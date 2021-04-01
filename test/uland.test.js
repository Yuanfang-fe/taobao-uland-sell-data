var should = require('chai').should(),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');

describe('【爱淘宝】接口测试', function () {
  it('应该根据商品链接返回商品的数据', function (done) {
    api.get('/uland/productData')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        "url": 'https://uland.taobao.com/coupon/edetail?spm=a311n.9159044.cellitem2.3.18e5791fD3K5fT&e=YVbo%2B3qfPBsNfLV8niU3R40dlhWtfp96Ng4Gqf8CT4CSaSRPch4qLIYoD4oxvFXnmMHpNfYdHdA5htauxI5YYSoPr%2BRaKTNCi3QW3cvngCSGKA%2BKMbxV53EsBWYs0b3ofO89LaN7UpXjhsJ%2FQdr8ONu1tLb6KOkT5bgGAUYJbG0%3D&app_pvid=59590_11.224.133.254_640_1617278862575&ptl=floorId%3A22358%3Bapp_pvid%3A59590_11.224.133.254_640_1617278862575%3Btpp_pvid%3A2844451f-e4ce-4a9f-8bb6-56386b524de2&union_lens=lensId%3AOPT%401617278862%402844451f-e4ce-4a9f-8bb6-56386b524de2_612023928677%401%3Brecoveryid%3Aa311n.9159044_1617278861270_5815871910384556_iP3qF%3Bprepvid%3Aa311n.9159044_1617278861270_5815871910384556_iP3qF&pid=mm_33231688_7050284_23466709',
        // "url": 'https://uland.taobao.com/coupon/edetail?spm=a311n.9159044.cellitem2.87.18e5791fOlsCsl&e=3FV6nfvka9YNfLV8niU3R40dlhWtfp96Ng4Gqf8CT4BnmB%2Fzds2ljdzOVELVbcPsCmgjKy3tnlAAbAN3NcqP1djiLvKBoQ2vzOJz0K1X%2B2rczlRC1W3D7FMlY14Qlkeac0Wu%2BmInBN4OWUdfcAJLEmYYYSHre8qcTTiZb6qxNoeie%2FpBy9wBFg%3D%3D&app_pvid=59590_11.15.153.223_538_1600392807636&ptl=floorId%3A22358%3Bapp_pvid%3A59590_11.15.153.223_538_1600392807636%3Btpp_pvid%3Af5a1d55a-d394-4601-acda-0ccb9c4f24f5&union_lens=lensId%3AOPT%401600392807%40f5a1d55a-d394-4601-acda-0ccb9c4f24f5_566174470926%401%3Brecoveryid%3Aa311n.9159044_1600392799182_6481355653844001_Hf%2FoF%3Bprepvid%3Aa311n.9159044_1600392799182_6481355653844001_Hf%2FoF&pid=mm_33231688_7050284_23466709',
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body.status).to.equal(1);
        expect(res.body.data.ret[0]).to.equal('SUCCESS::调用成功');
        expect(res.body.data.data).to.have.property('resultList');
        done();
      })
  });
});
