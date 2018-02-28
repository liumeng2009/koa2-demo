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
    //插入系统管理员角色
    let Role=model.roles;
    let roleAdmin=await Role.create({
        name:'系统管理员',
        remark:'最高权限',
        status:1
    });

    let roleEngineer=await Role.create({
        name:'运维工程师',
        remark:'工程师权限',
        status:1
    });


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
        status:1,
        roleId:roleAdmin.id
    }).then(function(p){
        console.log('created'+JSON.stringify(p)+'test the password');
    }).catch(function(err){
        console.log('failed:'+err);
    });

    let zhanghePassword='123456';
    //加密密码
    var saltZ = bcrypt.genSaltSync(sys_config.saltRounds);
    var hashZ = bcrypt.hashSync(zhanghePassword, saltZ);
    console.log('加密密码是：'+hashZ);
    //插入管理员身份
    User.create({
        name:'张赫',
        email:'378338627@qq.com',
        phone:'15822927208',
        password:hashZ,
        gender:true,
        canLogin:true,
        roleId:roleEngineer.id,
        status:1
    }).then(function(p){
        console.log('created'+JSON.stringify(p)+'test the password');
    }).catch(function(err){
        console.log('failed:'+err);
    });

    let zhuPassword='123456';
    //加密密码
    var saltZu = bcrypt.genSaltSync(sys_config.saltRounds);
    var hashZu = bcrypt.hashSync(zhanghePassword, saltZu);
    console.log('加密密码是：'+hashZu);
    //插入管理员身份
    User.create({
        name:'朱亚亮',
        email:'378338627@qq.com',
        phone:'15822927208',
        password:hashZu,
        gender:true,
        canLogin:true,
        roleId:roleEngineer.id,
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

    let rongzi=await Corporation.create({
        name:'融资租赁公司',
        description:'融资租赁公司',
        status:1,
        groupId:groupKResult.id
    });

    let gonggong=await Corporation.create({
        name:'公共事业公司',
        description:'公共事业公司',
        status:1,
        groupId:groupKResult.id
    });
    let jianshe=await Corporation.create({
        name:'建设公司',
        description:'建设公司',
        status:1,
        groupId:groupKResult.id
    });
    let touzi=await Corporation.create({
        name:'投资公司',
        description:'投资公司',
        status:1,
        groupId:groupKResult.id
    });

    let touziBuilding=await CorpBuilding.create({
        corporationId:touzi.id,
        buildingId:buildingBResult.id,
        floor:7,
        position:'E',
        status:1
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

    let rongziBuilding=await CorpBuilding.create({
        corporationId:rongzi.id,
        buildingId:buildingBResult.id,
        floor:5,
        position:'W',
        status:1
    });

    let gonggongBuilding=await CorpBuilding.create({
        corporationId:gonggong.id,
        buildingId:buildingBResult.id,
        floor:6,
        position:'E',
        status:1
    });

    let jiansheBuilding=await CorpBuilding.create({
        corporationId:jianshe.id,
        buildingId:buildingBResult.id,
        floor:8,
        position:'E',
        status:1
    });
    let jiansheBuilding1=await CorpBuilding.create({
        corporationId:jianshe.id,
        buildingId:buildingBResult.id,
        floor:9,
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
    let equipTypeN=await EquipType.create({
        name:'网络',
        code:'NETWORK'
    });

    let EquipOp=model.equipOps;

    let equipOpS=await EquipOp.create({
        name:'安装',
        code:'SETUP'
    });
    let equipOpF=await EquipOp.create({
        name:'故障',
        code:'FIX'
    });
    let equipOpU=await EquipOp.create({
        name:'卸载',
        code:'UNINSTALL'
    });
    let equipOpN=await EquipOp.create({
        name:'无法开机',
        code:'NOTSTART'
    });
    let equipOpC=await EquipOp.create({
        name:'冲突',
        code:'CT'
    });
    let equipOpSET=await EquipOp.create({
        name:'设置',
        code:'SET'
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
        type:equipTypeH.code,
        equipment:'打印机',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent4=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'打印机',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });




    let busiContent5=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'浏览器',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent6=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'浏览器',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });

    let busiContent7=await BusinessContent.create({
        type:equipTypeN.code,
        equipment:'IP地址',
        operation:equipOpC.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent8=await BusinessContent.create({
        type:equipTypeN.code,
        equipment:'IP地址',
        operation:equipOpSET.code,
        weight:5,
        remark:'',
        status:1
    });

    let busiContent9=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'WORD',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent10=await BusinessContent.create({
        type:equipTypeS.code,
        equipment:'WORD',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });

    let busiContent11=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'电脑',
        operation:equipOpN.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent12=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'电脑',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent13=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'笔记本电脑',
        operation:equipOpN.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent14=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'笔记本电脑',
        operation:equipOpS.code,
        weight:5,
        remark:'',
        status:1
    });
    let busiContent15=await BusinessContent.create({
        type:equipTypeH.code,
        equipment:'笔记本电脑',
        operation:equipOpF.code,
        weight:5,
        remark:'',
        status:1
    });

    //权限部分
    //功能项
    let Function=model.functions;

    //基本设置
    let funcBasic=await Function.create({
        name:'基本设置',
        code:'basic',
        status:1,
        class:0,
        belong:null
    });

    let funAddress=await Function.create({
        name:'地址设置',
        code:'address',
        status:1,
        class:1,
        belong:funcBasic.id
    });
    let funGroup=await Function.create({
        name:'组织设置',
        code:'group',
        status:1,
        class:1,
        belong:funcBasic.id
    });
    let funCorporation=await Function.create({
        name:'公司设置',
        code:'corporation',
        status:1,
        class:1,
        belong:funcBasic.id
    });
    let funWorker=await Function.create({
        name:'工程师设置',
        code:'worker',
        status:1,
        class:1,
        belong:funcBasic.id
    });



    //工作管理
    let funcOperations=await Function.create({
        name:'工作管理',
        code:'operations',
        status:1,
        class:0,
        belong:null
    });

    let funOp=await Function.create({
        name:'工单',
        code:'op',
        status:1,
        class:1,
        belong:funcOperations.id
    });
    let funOrder=await Function.create({
        name:'客户需求',
        code:'order',
        status:1,
        class:1,
        belong:funcOperations.id
    });
    let funBusiness=await Function.create({
        name:'业务内容设置',
        code:'business',
        status:1,
        class:1,
        belong:funcOperations.id
    });

    //权限管理
    let funcAuth=await Function.create({
        name:'用户权限管理',
        code:'auth',
        status:1,
        class:0,
        belong:null
    });
    let funUser=await Function.create({
        name:'用户管理',
        code:'user',
        status:1,
        class:1,
        belong:funcAuth.id
    });
    let funFunc=await Function.create({
        name:'功能管理',
        code:'function',
        status:1,
        class:1,
        belong:funcAuth.id
    });
    let funRole=await Function.create({
        name:'角色管理',
        code:'role',
        status:1,
        class:1,
        belong:funcAuth.id
    });




    //操作项
    let Operate=model.operates;
    let menuOp= await Operate.create({
        name:'菜单可见',
        code:'menu',
        status:1
    });

    let listOp= await Operate.create({
        name:'查看',
        code:'list',
        status:1
    });

    let addOp=await Operate.create({
        name:'新增',
        code:'add',
        status:1
    })

    let editOp=await Operate.create({
        name:'编辑',
        code:'edit',
        status:1
    });

    let deleteOp=await Operate.create({
        name:'删除',
        code:'delete',
        status:1
    });

    //关系表
    let OpInFunc=model.opInFuncs;
    let AuthInRoles=model.authInRoles;
    let basicMenu= await OpInFunc.create({
        funcId:funcBasic.id,
        opId:menuOp.id
    })

    await AuthInRoles.create({
        authId:basicMenu.id,
        roleId:roleAdmin.id
    })



    let addressMenu=await OpInFunc.create({
        funcId:funAddress.id,
        opId:menuOp.id
    });
    await AuthInRoles.create({
        authId:addressMenu.id,
        roleId:roleAdmin.id
    })

    let addressAdd=await OpInFunc.create({
        funcId:funAddress.id,
        opId:addOp.id
    });
    await AuthInRoles.create({
        authId:addressAdd.id,
        roleId:roleAdmin.id
    })

    let addressEdit=await OpInFunc.create({
        funcId:funAddress.id,
        opId:editOp.id
    });
    await AuthInRoles.create({
        authId:addressEdit.id,
        roleId:roleAdmin.id
    })

    let addressDelete=await OpInFunc.create({
        funcId:funAddress.id,
        opId:deleteOp.id
    });
    await AuthInRoles.create({
        authId:addressDelete.id,
        roleId:roleAdmin.id
    })


    let groupMenu=await OpInFunc.create({
        funcId:funGroup.id,
        opId:menuOp.id
    });
    await AuthInRoles.create({
        authId:groupMenu.id,
        roleId:roleAdmin.id
    })

    let groupAdd=await OpInFunc.create({
        funcId:funGroup.id,
        opId:addOp.id
    });
    await AuthInRoles.create({
        authId:groupAdd.id,
        roleId:roleAdmin.id
    })

    let groupEdit=await OpInFunc.create({
        funcId:funGroup.id,
        opId:editOp.id
    });
    await AuthInRoles.create({
        authId:groupEdit.id,
        roleId:roleAdmin.id
    })

    let groupDelete=await OpInFunc.create({
        funcId:funGroup.id,
        opId:deleteOp.id
    });
    await AuthInRoles.create({
        authId:groupDelete.id,
        roleId:roleAdmin.id
    })


    let corporationMenu=await OpInFunc.create({
        funcId:funCorporation.id,
        opId:menuOp.id
    });
    await AuthInRoles.create({
        authId:corporationMenu.id,
        roleId:roleAdmin.id
    })

    let corporationAdd=await OpInFunc.create({
        funcId:funCorporation.id,
        opId:addOp.id
    });
    await AuthInRoles.create({
        authId:corporationAdd.id,
        roleId:roleAdmin.id
    })

    let corporationEdit=await OpInFunc.create({
        funcId:funCorporation.id,
        opId:editOp.id
    });
    await AuthInRoles.create({
        authId:corporationEdit.id,
        roleId:roleAdmin.id
    })

    let corporationDelete=await OpInFunc.create({
        funcId:funCorporation.id,
        opId:deleteOp.id
    });
    await AuthInRoles.create({
        authId:corporationDelete.id,
        roleId:roleAdmin.id
    })


    let workerMenu=await OpInFunc.create({
        funcId:funWorker.id,
        opId:menuOp.id
    });
    await AuthInRoles.create({
        authId:workerMenu.id,
        roleId:roleAdmin.id
    })


    let workerAdd=await OpInFunc.create({
        funcId:funWorker.id,
        opId:addOp.id
    });
    await AuthInRoles.create({
        authId:workerAdd.id,
        roleId:roleAdmin.id
    })


    let workerDelete=await OpInFunc.create({
        funcId:funWorker.id,
        opId:deleteOp.id
    });
    await AuthInRoles.create({
        authId:workerDelete.id,
        roleId:roleAdmin.id
    })


    let operationMenu=await OpInFunc.create({
        funcId:funcOperations.id,
        opId:menuOp.id
    });
    await AuthInRoles.create({
        authId:operationMenu.id,
        roleId:roleAdmin.id
    })
    await AuthInRoles.create({
        authId:operationMenu.id,
        roleId:roleEngineer.id
    })


    let opMenu=await OpInFunc.create({
        funcId:funOp.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:opMenu.id,
        roleId:roleAdmin.id
    });
    await AuthInRoles.create({
        authId:opMenu.id,
        roleId:roleEngineer.id
    })


    let opList=await OpInFunc.create({
        funcId:funOp.id,
        opId:listOp.id
    })
    await AuthInRoles.create({
        authId:opList.id,
        roleId:roleAdmin.id
    });
    await AuthInRoles.create({
        authId:opList.id,
        roleId:roleEngineer.id
    })


    let opAdd=await OpInFunc.create({
        funcId:funOp.id,
        opId:addOp.id
    })
    await AuthInRoles.create({
        authId:opAdd.id,
        roleId:roleAdmin.id
    });
    await AuthInRoles.create({
        authId:opAdd.id,
        roleId:roleEngineer.id
    })



    let opEdit=await OpInFunc.create({
        funcId:funOp.id,
        opId:editOp.id
    })
    await AuthInRoles.create({
        authId:opEdit.id,
        roleId:roleAdmin.id
    });
    await AuthInRoles.create({
        authId:opEdit.id,
        roleId:roleEngineer.id
    })


    let opDelete=await OpInFunc.create({
        funcId:funOp.id,
        opId:deleteOp.id
    })
    await AuthInRoles.create({
        authId:opDelete.id,
        roleId:roleAdmin.id
    });
    await AuthInRoles.create({
        authId:opDelete.id,
        roleId:roleEngineer.id
    })

    let businessMenu=await OpInFunc.create({
        funcId:funBusiness.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:businessMenu.id,
        roleId:roleAdmin.id
    });

    let businessList=await OpInFunc.create({
        funcId:funBusiness.id,
        opId:listOp.id
    })
    await AuthInRoles.create({
        authId:businessList.id,
        roleId:roleAdmin.id
    });

    let businessAdd=await OpInFunc.create({
        funcId:funBusiness.id,
        opId:addOp.id
    })
    await AuthInRoles.create({
        authId:businessAdd.id,
        roleId:roleAdmin.id
    });

    let businessEdit=await OpInFunc.create({
        funcId:funBusiness.id,
        opId:editOp.id
    })
    await AuthInRoles.create({
        authId:businessEdit.id,
        roleId:roleAdmin.id
    });

    let businessDelete=await OpInFunc.create({
        funcId:funBusiness.id,
        opId:deleteOp.id
    })
    await AuthInRoles.create({
        authId:businessDelete.id,
        roleId:roleAdmin.id
    });




    let authMenu=await OpInFunc.create({
        funcId:funcAuth.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:authMenu.id,
        roleId:roleAdmin.id
    });

    let userMenu=await OpInFunc.create({
        funcId:funUser.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:userMenu.id,
        roleId:roleAdmin.id
    });

    let userAdd=await OpInFunc.create({
        funcId:funUser.id,
        opId:addOp.id
    })
    await AuthInRoles.create({
        authId:userAdd.id,
        roleId:roleAdmin.id
    });


    let userEdit=await OpInFunc.create({
        funcId:funUser.id,
        opId:editOp.id
    })
    await AuthInRoles.create({
        authId:userEdit.id,
        roleId:roleAdmin.id
    });

    let userDelete=await OpInFunc.create({
        funcId:funUser.id,
        opId:deleteOp.id
    })
    await AuthInRoles.create({
        authId:userDelete.id,
        roleId:roleAdmin.id
    });

    let funcMenu=await OpInFunc.create({
        funcId:funFunc.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:funcMenu.id,
        roleId:roleAdmin.id
    });
    let funcList=await OpInFunc.create({
        funcId:funFunc.id,
        opId:listOp.id
    })
    await AuthInRoles.create({
        authId:funcList.id,
        roleId:roleAdmin.id
    });
    let funcAdd=await OpInFunc.create({
        funcId:funFunc.id,
        opId:addOp.id
    })
    await AuthInRoles.create({
        authId:funcAdd.id,
        roleId:roleAdmin.id
    });
    let funcEdit=await OpInFunc.create({
        funcId:funFunc.id,
        opId:editOp.id
    })
    await AuthInRoles.create({
        authId:funcEdit.id,
        roleId:roleAdmin.id
    });
    let funcDelete=await OpInFunc.create({
        funcId:funFunc.id,
        opId:deleteOp.id
    })
    await AuthInRoles.create({
        authId:funcDelete.id,
        roleId:roleAdmin.id
    });

    let roleMenu=await OpInFunc.create({
        funcId:funRole.id,
        opId:menuOp.id
    })
    await AuthInRoles.create({
        authId:roleMenu.id,
        roleId:roleAdmin.id
    });
    let roleList=await OpInFunc.create({
        funcId:funRole.id,
        opId:listOp.id
    })
    await AuthInRoles.create({
        authId:roleList.id,
        roleId:roleAdmin.id
    });
    let roleAdd=await OpInFunc.create({
        funcId:funRole.id,
        opId:addOp.id
    })
    await AuthInRoles.create({
        authId:roleAdd.id,
        roleId:roleAdmin.id
    });
    let roleEdit=await OpInFunc.create({
        funcId:funRole.id,
        opId:editOp.id
    })
    await AuthInRoles.create({
        authId:roleEdit.id,
        roleId:roleAdmin.id
    });
    let roleDelete=await OpInFunc.create({
        funcId:funRole.id,
        opId:deleteOp.id
    });
    await AuthInRoles.create({
        authId:roleDelete.id,
        roleId:roleAdmin.id
    });
}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});