var utils = require('./utils')
var axios = require('axios');
var qs = require('qs');

var userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36";

/**
 * 处理请求参数
 * @param {*} url 爱淘宝商品链接
 */
function processRequestUrl(url) {
  var queryParams = qs.parse(url.split("?")[1]);
  var variableMap = {
    e: decodeURIComponent(queryParams.e),
    taoAppEnv: "0",
  };
  var jsVersion = "2.4.0";
  var floorId = 13052;
  var c = {
    AntiCreep: true,
    AntiFlood: true,
    api: "mtop.alimama.union.xt.biz.zhibo.api.entry",
    data: `{"floorId":${floorId},"variableMap": ${JSON.stringify(
      variableMap
    )})`,
    dataType: "jsonp",
    ecode: 0,
    timeout: 500,
    type: "get",
    v: "1.0",
  };
  var d = {
    AntiCreep: true,
    AntiFlood: true,
    H5Request: true,
    LoginRequest: undefined,
    WindVaneRequest: false,
    getJSONP: true,
    mainDomain: "taobao.com",
    prefix: "h5api",
    safariGoLogin: true,
    subDomain: "m",
    token: "",
    useAlipayJSBridge: false,
    queryParams: queryParams,
  };

  var hostname = "uland.taobao.com";

  if (d.hostSetting && d.hostSetting[hostname]) {
    var e = d.hostSetting[a.location.hostname];
    e.prefix && (d.prefix = e.prefix),
      e.subDomain && (d.subDomain = e.subDomain),
      e.mainDomain && (d.mainDomain = e.mainDomain);
  }
  if (d.H5Request === !0) {
    var path =
        "//" +
        (d.prefix ? d.prefix + "." : "") +
        (d.subDomain ? d.subDomain + "." : "") +
        d.mainDomain +
        "/h5/" +
        c.api.toLowerCase() +
        "/" +
        c.v.toLowerCase() +
        "/",
      appKey = c.appKey || ("waptest" === d.subDomain ? "4272" : "12574478"),
      timeStamp = new Date().getTime(),
      sign = utils.genSign(
        d.token + "&" + timeStamp + "&" + appKey + "&" + c.data
      ),
      k = {
        jsv: jsVersion,
        appKey: appKey,
        t: timeStamp,
        sign: sign,
      },
      l = {
        data: c.data,
        ua: userAgent,
      };
    Object.keys(c).forEach(function (key) {
      "undefined" == typeof k[key] &&
        "undefined" == typeof l[key] &&
        (k[key] = c[key]);
    }),
      d.getJSONP
        ? (k.type = "jsonp")
        : d.getOriginalJSONP
        ? (k.type = "originaljsonp")
        : (d.getJSON || d.postJSON) && (k.type = "originaljson"),
      (d.querystring = k),
      (d.postdata = l),
      (d.path = path);
  }
  return d;
}

/**
 * 首先获取cookie信息
 * @param {*} url 
 */
function doLogin(url) {
  var params = processRequestUrl(url);

  var {
    querystring: { jsv, appKey, t, sign, api, dataType, timeout, type, v },
    postdata: { data },
    path,
    queryParams,
  } = params;

  var variableMap = {
    e: decodeURIComponent(queryParams.e),
    taoAppEnv: "0",
  };

  var query = {
    jsv,
    appKey,
    t,
    sign,
    api,
    dataType,
    timeout,
    type,
    v,
    data,
    callback: "mtopjsonp1",
  };

  var url = `https:${path}?${qs.stringify(query)}`;
  
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url,
    })
    .then(function (response) {
      let setCookie = response.headers["set-cookie"];
      if(setCookie.length) {
        let cookies = setCookie.map((cookie) => {
          return cookie.split(";")[0];
        });
        resolve({ params, cookies });
      }else{
        reject({
          message: '没有获取到cookie'
        })
      }
    })
    .catch(function (error) {
      console.log('获取 cookie 出错====>',error);
      reject(error);
    })
  })
}

const mtopjsonp2 = function (data) {
  return data
}
/**
 * 获取产品的数据
 * @param {*} url 爱淘宝的商品链接 https://uland.taobao.com
 */
 const getProductData = exports.getProductData = async function(url) {
   var { params, cookies } = await doLogin(url);
   var {
     querystring: { jsv, appKey, api, dataType, timeout, type, v },
     path,
     queryParams,
   } = params;
   var spmAB = await utils.getSpmAB(url);
   var cna = await utils.getCna();
   var recoveryId =
     spmAB +
     "_" +
     new Date().getTime() +
     "_" +
     ("" + Math.random()).slice(2) +
     "_" +
     cna.slice(0, 5);
   var data = JSON.stringify({
     floorId: "13193",
     variableMap: JSON.stringify({
       buyMoreSwitch: "0",
       e: decodeURIComponent(queryParams.e),
       recoveryId: recoveryId,
       type: "nBuy",
       union_lens: decodeURIComponent(queryParams["union_lens"]),
     }),
   });
   // 获取 cookie 中 _m_h5_tk 值的 "_" 前面的部分
   var token = cookies[1].split("=")[1].split("_")[0];
   var t = new Date().getTime();
   // sign为主要的安全校验字段，需要加密处理
   var sign = utils.genSign(token + "&" + t + "&" + appKey + "&" + data);
   var query = {
     jsv,
     appKey,
     t,
     sign,
     api,
     dataType,
     type,
     timeout: 20000,
     v,
     data,
     callback: "mtopjsonp2",
   };
   var url = `https:${path}?${qs.stringify(query)}`;

   return new Promise((resolve, reject) => {
     axios({
       method: "GET",
       headers: { cookie: cookies.join("; ") },
       url,
     })
       .then(function (response) {
         let data = eval(response.data);
         console.log(data);
         resolve(data);
       })
       .catch(function (error) {
         console.log(
           "获取商品数据出错====>" + error + "=====> url ====>" + url
         );
         reject(error);
       });
   });
 };

// test
// let timer = setInterval(() => {
//   getProductData('https://uland.taobao.com/ccoupon/edetail?e=3Grz9kQByHMGQASttHIRqbdPNGUjRpBH7seEdu18kElLAWLXu7wvPplAqg9W%2BtAQo3DPIznAwagBH%2Fv%2BMDTTdOUuzRaMFbMYaP2h%2FKlDM8kNSrKiYsJzJ2UF3P9ZDUna3pOXkArbDQEYlt28h5xOtwzUv%2BYStry7v1%2FAHDBSKqXcp41oS4BDgbWCUz5k1ZA%2FwdWr93Gr8MBMmdsrkidbOd3h1FtNvlY31WozoFaXPfwgTcctY5DjBSudO%2FVEgjeWAEmugspjUdZ%2F%2FOgzVEYycg%3D%3D&traceId=0b5116f915984810673582616eebc9&union_lens=lensId:TAPI@1598481067@0b0fa0ea_0e8b_1742ce56d81_4b56@01')
//   getProductData('https://uland.taobao.com/coupon/edetail?spm=a311n.9159044.cellitem2.87.18e5791fOlsCsl&e=3FV6nfvka9YNfLV8niU3R40dlhWtfp96Ng4Gqf8CT4BnmB%2Fzds2ljdzOVELVbcPsCmgjKy3tnlAAbAN3NcqP1djiLvKBoQ2vzOJz0K1X%2B2rczlRC1W3D7FMlY14Qlkeac0Wu%2BmInBN4OWUdfcAJLEmYYYSHre8qcTTiZb6qxNoeie%2FpBy9wBFg%3D%3D&app_pvid=59590_11.15.153.223_538_1600392807636&ptl=floorId%3A22358%3Bapp_pvid%3A59590_11.15.153.223_538_1600392807636%3Btpp_pvid%3Af5a1d55a-d394-4601-acda-0ccb9c4f24f5&union_lens=lensId%3AOPT%401600392807%40f5a1d55a-d394-4601-acda-0ccb9c4f24f5_566174470926%401%3Brecoveryid%3Aa311n.9159044_1600392799182_6481355653844001_Hf%2FoF%3Bprepvid%3Aa311n.9159044_1600392799182_6481355653844001_Hf%2FoF&pid=mm_33231688_7050284_23466709')
//   getProductData(
//     "https://uland.taobao.com/coupon/edetail?spm=a311n.9159044.30889496.2.18e5791fU8FX6t&e=xF%2FIAT9M0OsNfLV8niU3R5TgU2jJNKOfNNtsjZw%2F%2FoIPGqzJHeInP%2Bx3E5qoOl7LQjEvcrWTTTgygrLrKN9EFOmFKyIN1bVX65OH1WfUm95Uf2TiFOebe4UragdyXcdsKImrWVhkPy%2BEJpuFXfIw5IchIB%2Bs4x7RJfYGDZbs1v3k7glD%2BLC7OUwNBUbTsArs&app_pvid=59590_11.26.37.23_548_1600393474244&ptl=floorId%3A27258%3Bapp_pvid%3A59590_11.26.37.23_548_1600393474244%3Btpp_pvid%3Ada019e60-8c34-4d97-a9b0-902db3f4ca12&union_lens=lensId%3AOPT%401600393474%40da019e60-8c34-4d97-a9b0-902db3f4ca12_619807390194%401%3Brecoveryid%3Aa311n.9159044_1600393472981_7547709603747303_Hf%2FoF%3Bprepvid%3Aa311n.9159044_1600393472981_7547709603747303_Hf%2FoF&pid=mm_33231688_7050284_23466709"
//   );
// }, 100);
