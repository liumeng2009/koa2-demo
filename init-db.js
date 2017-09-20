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


model.sync().then(async ()=>{
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
    let Corporation=model.corporations;
    let Building=model.buildings;
    let CorpBuilding=model.corpBuildings;

    //async ()=>{
    let groupGResult=await Group.create({
        name:'管委会',
        description:'group1',
        status:1
    });
    let groupKResult=await Group.create({
        name:'控股',
        description:'group2',
        status:1
    });
    let buildingNResult=await Building.create({
        name:'商务大厦南楼',
        address:'南',
        minfloor:1,
        maxfloor:15,
        status:1
    });
    let buildingBResult=await Building.create({
        name:'商务大厦北楼',
        address:'北',
        minfloor:1,
        maxfloor:15,
        status:1
    });
    let buildingHResult=await Building.create({
        name:'海泰创业园1号楼',
        address:'海泰创业园',
        minfloor:1,
        maxfloor:4,
        status:1
    });

    //审批中心
    let shenpizhongxin=await Corporation.create({
        name:'审批服务大厅',
        description:'审批中心',
        status:1,
        groupId:groupGResult.id
    });

    let shenpizhongxinBuilding=await CorpBuilding.create({
        corporationId:shenpizhongxin.id,
        buildingId:buildingBResult.id,
        floor:1,
        position:'A',
        status:1
    });

    //投促局
    let toucuju=await Corporation.create({
        name:'投促局',
        description:'投促局',
        status:1,
        groupId:groupGResult.id
    });

    let toucujuBuilding1=await CorpBuilding.create({
        corporationId:toucuju.id,
        buildingId:buildingNResult.id,
        floor:3,
        position:'W',
        status:1
    });
    let toucujuBuilding2=await CorpBuilding.create({
        corporationId:toucuju.id,
        buildingId:buildingNResult.id,
        floor:3,
        position:'E',
        status:1
    });

    //建规局
    let jianguiju=await Corporation.create({
        name:'建规局',
        description:'建规局',
        status:1,
        groupId:groupGResult.id
    });

    let jianguijuBuilding1=await CorpBuilding.create({
        corporationId:jianguiju.id,
        buildingId:buildingNResult.id,
        floor:4,
        position:'E',
        status:1
    });
    //安环局
    let anhuanju=await Corporation.create({
        name:'安环局',
        description:'安环局',
        status:1,
        groupId:groupGResult.id
    });

    let anhuanjuBuilding1=await CorpBuilding.create({
        corporationId:anhuanju.id,
        buildingId:buildingNResult.id,
        floor:5,
        position:'E',
        status:1
    });

    //控股
    let konggu=await Corporation.create({
        name:'控股公司',
        description:'控股公司',
        status:1,
        groupId:groupKResult.id
    });

    let kongguBuilding1=await CorpBuilding.create({
        corporationId:konggu.id,
        buildingId:buildingNResult.id,
        floor:6,
        position:'A',
        status:1
    });
    let kongguBuilding2=await CorpBuilding.create({
        corporationId:konggu.id,
        buildingId:buildingNResult.id,
        floor:7,
        position:'A',
        status:1
    });

    //财政局
    let caizhengju=await Corporation.create({
        name:'财政局',
        description:'财政局',
        status:1,
        groupId:groupGResult.id
    });

    let caizhengjuBuilding1=await CorpBuilding.create({
        corporationId:caizhengju.id,
        buildingId:buildingNResult.id,
        floor:8,
        position:'W',
        status:1
    });
    //经发局
    let jingfaju=await Corporation.create({
        name:'经发局',
        description:'经发局',
        status:1,
        groupId:groupGResult.id
    });

    let jingfajuBuilding1=await CorpBuilding.create({
        corporationId:jingfaju.id,
        buildingId:buildingNResult.id,
        floor:8,
        position:'E',
        status:1
    });

    //人社局
    let rensheju=await Corporation.create({
        name:'人社局',
        description:'人社局',
        status:1,
        groupId:groupGResult.id
    });

    let renshejuBuilding1=await CorpBuilding.create({
        corporationId:rensheju.id,
        buildingId:buildingNResult.id,
        floor:9,
        position:'W',
        status:1
    });

    //社发局
    let shefaju=await Corporation.create({
        name:'社发局',
        description:'社发局',
        status:1,
        groupId:groupGResult.id
    });

    let shefajuBuilding1=await CorpBuilding.create({
        corporationId:shefaju.id,
        buildingId:buildingNResult.id,
        floor:9,
        position:'E',
        status:1
    });


    //管委会办公室
    let gbangongshi=await Corporation.create({
        name:'管委会办公室',
        description:'管委会办公室',
        status:1,
        groupId:groupGResult.id
    });

    let gbangongshiBuilding1=await CorpBuilding.create({
        corporationId:gbangongshi.id,
        buildingId:buildingNResult.id,
        floor:10,
        position:'A',
        status:1
    });
    let gbangongshiBuilding2=await CorpBuilding.create({
        corporationId:gbangongshi.id,
        buildingId:buildingNResult.id,
        floor:11,
        position:'A',
        status:1
    });
    let gbangongshiBuilding3=await CorpBuilding.create({
        corporationId:gbangongshi.id,
        buildingId:buildingNResult.id,
        floor:12,
        position:'A',
        status:1
    });

    let EquipType=model.equipTypes;

    let equipTypeH=await EquipType.create({
        name:'硬件',
        code:'HARDWARE'
    });
    let equipTypeS=await EquipType.create({
        name:'软件',
        code:'SOFTWARE'
    });

    let EquipOp=model.equipOps;

    let equipOpS=await EquipOp.create({
        name:'安装',
        code:'SETUP'
    });
    let equipOpF=await EquipOp.create({
        name:'修复',
        code:'FIX'
    });



    let BusinessContent=model.businessContents;

    let busiContent1=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'电话',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent2=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'电话',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent3=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'浏览器',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent4=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'浏览器',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });








    //}

/*    Group.create({
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
    });*/







}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});