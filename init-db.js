/**
 * Created by liumeng on 2017/5/26.
 */
"use strict"
require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./app/model.js');
const sys_config=require('./config/sys_config');
const bcrypt=require('bcrypt');


model.sync().then(()=>{
    console.log('sync done');
    //插入管理员账户
    let User=model.user;
    let adminPassword='admin';
    //加密密码
    var salt = bcrypt.genSaltSync(sys_config.saltRounds);
    var hash = bcrypt.hashSync(adminPassword, salt);
    console.log('加密密码是：'+hash);
    //插入管理员身份
    User.create({
        name:'admin',
        email:'378338627@qq.com',
        password:hash,
        gender:true,
        canLogin:true
    }).then(function(p){
        console.log('created'+JSON.stringify(p)+'test the password');
        process.exit(0);
    }).catch(function(err){
        console.log('failed:'+err);
    });
}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});