var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//连接mysql
var mysql = require('mysql');
var DBConfig = require('../public/javascripts/mysql/DBConfig');
var UserSQL = require('../public/javascripts/mysql/UserSQL');
var StockSQL = require('../public/javascripts/mysql/StockSQL');

//使用DBConfig的配置信息创建一个MySQL连接池
var pool = mysql.createPool(DBConfig.mysql);
//响应JSON数据
var responseJSON = function (res, result) { 
  if (typeof result === 'undefined') {
    res.json({ code: '500', msg: '操作错误' })
  } else { 
    res.json(result)
  }
}




router.get('/getEchartData', function (req, res, next) {
  var categories = { 'type': 'category', 'data': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], 'axisTick': {'alignWithLabel':'true'}};
  var series = [{ 'name': '羽绒服周销量', 'data': [50, 200, 360, 100, 100, 200, 500], 'type': 'bar' }, { 'name': '毛衣周销量', 'data': [150, 80, 56, 50, 100, 230, 530], 'type': 'bar'}];
  var title = {'text':'axios异步柱状图'}
  var responseData = { 'categories': categories, 'series': series, 'title':title };
  res.header("Access-Control-Allow-Origin", "*");
  return res.json(responseData);
});

router.post('/userlogin', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  //获取连接
  pool.getConnection(function (err, connection) {
    var sqlparam = req.body;
    connection.query(UserSQL.findUserById, [sqlparam.username], function (err, result) {
      for (var i = 0; i < result.length; i++) {
        if (result[i].password == sqlparam.password) {
          result = {code: '200',msg: '操作成功'};
        }
      }
      //以json的格式返回
      responseJSON(res, result);
      //释放连接
      connection.release();
    });
  });
});


//获取库存
router.get('/getAllStock',function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");

  pool.getConnection(function (err, connection) {
    connection.query(StockSQL.findAllStock, null, function (err, result) {
      //以json的格式返回
      responseJSON(res, result);
      //释放连接
      connection.release();
    });
  });

});




router.get('/getTableData', function (req, res, next) {
  var tabledata = [{id:'1',name:'TAEYANG',amount1:'520',amount2:'100%',amount3:'520'}];
  res.header("Access-Control-Allow-Origin", "*");
  return res.json(tabledata);
});


module.exports = router;
