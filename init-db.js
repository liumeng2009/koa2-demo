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
        phone:'15822927208',
        password:hash,
        gender:true,
        canLogin:true,
        status:1
    }).then(function(p){
        console.log('created'+JSON.stringify(p)+'test the password');
    }).catch(function(err){
        console.log('failed:'+err);
    });

    //插入初始化的组织信息
    let Group=model.groups;
    Group.create({
        name:'管委会',
        description:'group1',
        status:1
    }).then(function(result){
        console.log('group1 initital success'+result.id);
    }).catch(function(err){
        console.log('group1 failed:'+err);
    });

    Group.create({
        name:'控股公司',
        description:'group2',
        status:1
    }).then(function(result){
        console.log('group2 initital success'+result);
    }).catch(function(err){
        console.log('group2 failed:'+err);
    });







}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});