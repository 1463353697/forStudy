var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接数据库
// mongoose.connect('mongodb://localhost:27017//mongoData');
mongoose.connect("mongodb://127.0.0.1:27017/scdata", {useNewUrlParser: true}, function(err){

　　if(err){

　　　　console.log('Connection Error:' + err)

　　}else{

　　　　console.log('Connection success!') }

})


//判断数据库连接是否成功
mongoose.connection.on("error", function(){
    console.log("MongoDB connected fail.");
});
mongoose.connection.on("connected", function(){
    console.log("MongoDB connected success.");
});

mongoose.connection.on("disconnected", function(){
    console.log("MongoDB connected disconnected.");
});

router.get("/",function(req,res,next){
    //给获取到的商品的价格进行排序
    let page = parseInt(req.param("page"));//获取参数中的页数
    let pageSize = parseInt(req.param("pageSize"));//获取参数中每页的数据条数
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");//获取参数中置顶的是升序还是降序
    let skip = (page-1)*pageSize;//要略过的条数，要是page为1，则显示一到pageSize的数据
    var priceGt = '',priceLte = '';
    let params = {};
    if(priceLevel != 'all'){
        switch(priceLevel){
            case '0':priceGt = 0;priceLte = 100;break;
            case '1':priceGt = 100;priceLte = 500;break;
            case '2':priceGt = 500;priceLte = 1000;break;
            case '3':priceGt = 1000;priceLte = 5000;break;
        }
        params = {
            salePrice:{
                $gt:priceGt,//大于
                $lte:priceLte
            }
        }
    }
    
    let goodModel = Goods.find(params).skip(skip).limit(pageSize);
    goodModel.sort({'salePrice':sort});
    goodModel.exec(function(err,doc){
        if(err) {
            res.json({
                status:"1",
                msg:err.message
            });
        } else{
            res.json({
                status:"0",
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }

            })
            console.log(doc);
        }

    })
    // Goods.find({},function(err,doc){
    //     if(err) {
    //         res.json({
    //             status:"1",
    //             msg:err.message
    //         });
    //     } else{
    //         res.json({
    //             status:"0",
    //             msg:'',
    //             result:{
    //                 count:doc.length,
    //                 list:doc
    //             }

    //         })
    //         console.log(doc);
    //     }
    // })
    // res.send("hello,goodlist");

})

module.exports = router;