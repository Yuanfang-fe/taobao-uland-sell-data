var express = require('express');
var router = express.Router();
var taobao = require("../public/javascripts/taobao/20200909/index")

/* 获取产品数据. */
router.get("/productData", async function (req, res, next) {
  const { url } = req.body;
  if (url) {
    taobao.getProductData(url)
    .then(data=>{
      res.send({
        status: 1,
        data: data,
        message: "成功",
      });
    }).catch(e=>{
      res.send({
        status: 0,
        data: null,
        message: e.message,
      });
    });
  } else {
    res.send({
      status: 0,
      data: null,
      message: "缺少参数url",
    });
  }
  
});

module.exports = router;
