const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const officegen=require('officegen');
const PDFDocument=require('pdfkit');


exports.operation=async(ctx,next)=>{
    let id=ctx.params.id;

    let OperationModel=model.operations;
    let OrderModel=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let BusinessContent=model.businessContents;
    let EquipType=model.equipTypes;
    let EquipOps=model.equipOps;
    let ActionModel=model.actions;

    OrderModel.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    OperationModel.belongsTo(BusinessContent,{foreignKey:'op'});
    OrderModel.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    BusinessContent.belongsTo(EquipType,{foreignKey:'type',targetKey:'code'});
    BusinessContent.belongsTo(EquipOps,{foreignKey:'operation',targetKey:'code'});
    OperationModel.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});

    let operation=await OperationModel.findOne({
        where: {
            id: id,
            status: 1
        },
        include: [{
            model: OrderModel,
            include: [
                {
                    model: Corporation
                },
                {
                    model: CorpBuilding,
                    include: [
                        {
                            model: Building
                        }
                    ]
                }
            ]
            },
            {
                model: BusinessContent,
                include: [{
                    model: EquipType
                }, {
                    model: EquipOps
                }],
            },
            {
                model:ActionModel,
                as:'actions',
                where:{
                    status:1
                },
                required:false
            }



        ]
    });

    if(operation){
        let date=new Date();
        ctx.res.writeHead ( 200, {
            "Content-Type": "application/pdf",
            'Content-disposition': 'attachment; filename=Operation'+operation.id+'_'+date.getTime()+'.pdf'
        });
        let doc=createOperationPDF(operation);
        let stream=doc.pipe(ctx.res);
        ctx.body=stream;

    }
    else{
        //throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
        ctx.body='工单不存在'
    }
}
exports.order=async(ctx,next)=>{
    let orderId=ctx.params.id;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let Operation=model.operations;

    let BusinessContent=model.businessContents;
    let EquipOp=model.equipOps;

    let ActionModel=model.actions;

    let User=model.user;

    ActionModel.belongsTo(User,{foreignKey:'worker'});

    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Order.hasMany(Operation,{foreignKey:'orderId',as:'operations'})
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOp,{foreignKey:'operation',targetKey:'code'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    let order=await Order.findOne({
        where:{
            status:1,
            id:orderId
        },
        include:[{
            model:Corporation
        },{
            model:CorpBuilding,
            include:[
                {
                    model:Building
                }
            ]
        },{
            model:Operation,
            where:{
                status:1
            },
            required:false,
            as:'operations',
            include:[
                {
                    model:BusinessContent,
                    include:[
                        {
                            model:EquipOp
                        }
                    ]
                },{
                    model:ActionModel,
                    as:'actions',
                    required:false,
                    where:{
                        status:1
                    },
                    include:[
                        {
                            model:User
                        }
                    ]
                }
            ]
        }],
        order:[
            [{model: Operation, as: 'operations'},'no','ASC']
        ]
    });

    if(order){
        let date=new Date();
        ctx.res.writeHead ( 200, {
            "Content-Type": "application/pdf",
            'Content-disposition': 'attachment; filename=Order_'+order.id+'_'+date.getTime()+'.pdf'
        });
        let doc=createOperationPDFS(order);
        let stream=doc.pipe(ctx.res);
        ctx.body=stream;
    }
    else{
        //throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
        ctx.body='这批工单不存在'
    }

}


var createOperationPDF=function(obj){
    let doc=new PDFDocument({
        size:'A4',
        margin:50
    });
    //head
    doc.image('./public/assets/img/lgxx.jpg', 75, 30,{width:28});

    doc.moveTo(70,60).lineTo(525,60).stroke();

    doc.registerFont('Song', './public/assets/fonts/STSONG.TTF')
    doc.registerFont('SongCu', './public/assets/fonts/FZCSJW.TTF')

    doc.fontSize(10);
    doc.font('Song').text('天津临港信息技术发展有限公司',75,45,{
        width:445,
        align:'right'
    });
    doc.moveDown();

    //单号
    doc.fontSize(12);
    doc.font('Song').text(obj.no?obj.no:'',50,60,{
        width:495,
        align:'right'
    });

    //表格开始 故障维护记录
    doc.moveTo(50,76).lineTo(545,76)
        .lineTo(545,170)
        .lineTo(50,170)
        .lineTo(50,76)
        .stroke();

    doc.moveTo(298,76).lineTo(298,170).stroke();

    doc.moveTo(298,96).lineTo(545,96).stroke();
    doc.moveTo(298,150).lineTo(545,150).stroke();

    doc.moveTo(380,76).lineTo(380,170).stroke();
    doc.moveTo(462,76).lineTo(462,170).stroke();

    doc.font('Song').text('编写',298,78,{
        width:82,
        align:'center'
    })
    doc.font('Song').text('审核',380,78,{
        width:82,
        align:'center'
    })
    doc.font('Song').text('批准',462,78,{
        width:82,
        align:'center'
    })


    doc.font('Song').text('/',298,152,{
        width:82,
        align:'center'
    })
    doc.font('Song').text('/',380,152,{
        width:82,
        align:'center'
    })
    doc.font('Song').text('/',462,152,{
        width:82,
        align:'center'
    })

    doc.fontSize(20);

    doc.font('SongCu').text('故障维护记录',50,110,{
        width:248,
        align:'center'
    })


    //题目

    doc.moveTo(50,170).lineTo(50,210)
        .lineTo(545,210)
        .lineTo(545,170)
        .stroke();
    doc.moveTo(298,170).lineTo(298,210).stroke();

    doc.fontSize(12);

    let title='';
    let content='';
    try{
        let corporation=obj.order.corporation.name;
        let equipment=obj.businessContent.equipment;
        let op=obj.businessContent.equipOp.name;
        title=corporation+op+'  '+equipment;
        content=op+'  '+equipment;
    }
    catch(e){
        console.log(e);
    }



    doc.font('Song').text('题        目：'+title,60,182,{
        width:238,
        align:'left'
    })

    //处理内容
    doc.font('Song').text(content,130,400,{
        width:415,
        align:'left'
    })

    doc.font('Song').text('故障等级：',308,182,{
        width:70,
        align:'left'
    });


    doc.fontSize(14);
    doc.font('Song').text('A',408,180.5);
    doc.font('Song').text('B',460,180.5);
    doc.font('Song').text('C',508,180.5);

    doc.moveTo(392,185).lineTo(401,185).lineTo(401,194).lineTo(392,194).lineTo(392,185).stroke();
    doc.moveTo(444,185).lineTo(453,185).lineTo(453,194).lineTo(444,194).lineTo(444,185).stroke();
    doc.moveTo(492,185).lineTo(501,185).lineTo(501,194).lineTo(492,194).lineTo(492,185).fill().stroke();


    doc.fontSize(12);
    //对象系统
    doc.moveTo(50,210).lineTo(50,250)
        .lineTo(298,250)
        .lineTo(298,210)
        .stroke();
    doc.font('Song').text('对象系统：',60,222,{
        width:238,
        align:'left'
    })

    //客户方负责人
    doc.moveTo(50,250).lineTo(50,290)
        .lineTo(298,290)
        .lineTo(298,250)
        .stroke();

    let customInfo='';
    try{
        let phone=obj.order.custom_phone;
        if(phone!='15822927208'){
            customInfo=phone
        }
    }
    catch(e){

    }

    doc.font('Song').text('客户方负责人：'+customInfo,60,262,{
        width:238,
        align:'left'
    })

    //发生时间
    doc.moveTo(298,290)
        .lineTo(340,290)
        .lineTo(340,210).stroke();
    doc.font('Song').text('发生时间',303,235,{
        width:36,
        align:'center',
        characterSpacing:5
    });


    let createTimeStamp=obj.create_time;
    let createTime=new Date(createTimeStamp);

    doc.moveTo(338,290)
        .lineTo(545,290)
        .lineTo(545,210).stroke();
    doc.font('Song').text(createTime.getFullYear()+'年'+(createTime.getMonth()+1)+'月'+createTime.getDate()+'日',345,230,{
        width:230,
        align:'left'
    })
    doc.font('Song').text(createTime.getHours()+'时'+createTime.getMinutes()+'分',345,257,{
        width:230,
        align:'left'
    })

    //影响范围
    doc.moveTo(50,290).lineTo(50,340)
        .lineTo(545,340)
        .lineTo(545,290).stroke();
    doc.moveTo(120,290).lineTo(120,340).stroke();
    doc.moveTo(298,290).lineTo(298,340).stroke();
    doc.moveTo(340,290).lineTo(340,340).stroke();
    doc.font('Song').text('影响范围',60,307,{
        width:50,
        align:'center'
    })
    doc.font('Song').text('处理时间',303,299,{
        width:36,
        align:'center',
        characterSpacing:5
    })
    //从什么时间开始处理的
    if(obj.actions&&obj.actions.length>0){
        let startTimeMin=0;
        let endTime=0;
        let actionArray=obj.actions;
        for(let ac of actionArray){
            if(startTimeMin==0){
                startTimeMin=ac.start_time;
            }
            else{
                if(ac.start_time<startTimeMin){
                    startTimeMin=ac.start_time;
                }
            }
            //说明完成了
            if(ac.operationComplete==1){
                endTime=ac.end_time;
            }


        }

        let ST=new Date(startTimeMin);
        //开始处理故障时间
        doc.font('Song').text(ST.getFullYear()+'年'+(ST.getMonth()+1)+'月'+ST.getDate()+'日',345,299,{
            width:230,
            align:'left'
        })
        doc.font('Song').text(ST.getHours()+'时'+ST.getMinutes()+'分',345,317,{
            width:230,
            align:'left'
        })
        //处理用时
        //endTIme>0说明做完了，就把所有action的time加起来

        let timeAll=0;
        let renci=0;
        for(let ac of actionArray){
            renci++;
            if(ac.start_time>0&&ac.end_time>0){
                timeAll=timeAll+ac.end_time-ac.start_time;
            }
        }
        if(endTime>0){
            doc.font('Song').text(timeAll/(1000*60)+'分钟'+(renci>1?'('+renci+'人次)':''),345,357,{
                align:'left'
            })
        }
    }




    //故障区分
    doc.moveTo(50,340).lineTo(50,390)
        .lineTo(545,390)
        .lineTo(545,340).stroke();
    doc.moveTo(120,340).lineTo(120,390).stroke();
    doc.moveTo(298,340).lineTo(298,390).stroke();
    doc.moveTo(340,340).lineTo(340,390).stroke();
    doc.moveTo(422,340).lineTo(422,390).stroke();
    doc.moveTo(464,340).lineTo(464,390).stroke();

    doc.font('Song').text('故障区分',60,357,{
        width:50,
        align:'center'
    })

    let equipType='';
    try{
        equipType=obj.businessContent.equipType.code;
    }catch(e){
        console.log(e);
    }




    doc.font('Song').text('硬件',139,347,{
        width:52,
        align:'left'
    });
    if(equipType=='HARDWARE'){
        doc.moveTo(127,351).lineTo(136,351).lineTo(136,360).lineTo(127,360).lineTo(127,351).fill();
    }
    else{
        doc.moveTo(127,351).lineTo(136,351).lineTo(136,360).lineTo(127,360).lineTo(127,351).stroke();
    }




    doc.font('Song').text('软件',191,347,{
        width:52,
        align:'left'
    });
    if(equipType=='SOFTWARE'){
        doc.moveTo(179,351).lineTo(188,351).lineTo(188,360).lineTo(179,360).lineTo(179,351).fill();
    }
    else{
        doc.moveTo(179,351).lineTo(188,351).lineTo(188,360).lineTo(179,360).lineTo(179,351).stroke();
    }


    doc.font('Song').text('网络',243,347,{
        width:52,
        align:'left'
    });
    if(equipType=='NETWORK'){
        doc.moveTo(231,351).lineTo(240,351).lineTo(240,360).lineTo(231,360).lineTo(231,351).fill();
    }
    else{
        doc.moveTo(231,351).lineTo(240,351).lineTo(240,360).lineTo(231,360).lineTo(231,351).stroke();
    }


    doc.font('Song').text('数据库',139,367,{
        width:52,
        align:'left'
    });
    doc.moveTo(127,371).lineTo(136,371).lineTo(136,380).lineTo(127,380).lineTo(127,371).stroke();


    doc.font('Song').text('应用',191,367,{
        width:52,
        align:'left'
    });
    doc.moveTo(179,371).lineTo(188,371).lineTo(188,380).lineTo(179,380).lineTo(179,371).stroke();

    doc.font('Song').text('其他',243,367,{
        width:52,
        align:'left'
    });
    doc.moveTo(231,371).lineTo(240,371).lineTo(240,380).lineTo(231,380).lineTo(231,371).stroke();



    doc.font('Song').text('故障处理用时',303,342,{
        width:36,
        align:'center',
        characterSpacing:5
    })

/*    doc.font('Song').text('15分钟',345,357,{
        align:'left'
    })*/

    doc.font('Song').text('服务中断时间',427,342,{
        width:36,
        align:'center',
        characterSpacing:5
    })
    doc.font('Song').text('0分钟',469,357,{
        align:'left'
    })

    //处理内容
    doc.moveTo(50,390).lineTo(50,510)
        .lineTo(545,510)
        .lineTo(545,390).stroke();
    doc.moveTo(120,390).lineTo(120,510).stroke();
    doc.font('Song').text('处理内容',60,442,{
        width:50,
        align:'center'
    })
/*    doc.font('Song').text('',60,407,{
        width:415,
        align:'left'
    })*/



    //处理结果
    doc.moveTo(50,510).lineTo(50,570)
        .lineTo(545,570)
        .lineTo(545,510).stroke();
    doc.moveTo(120,510).lineTo(120,570).stroke();
    doc.font('Song').text('处理结果',60,532,{
        width:50,
        align:'center'
    })
    doc.font('Song').text('完成',130,520,{
        width:415,
        align:'left'
    })



    //预防对策
    doc.moveTo(50,570).lineTo(50,630)
        .lineTo(545,630)
        .lineTo(545,570).stroke();
    doc.moveTo(120,570).lineTo(120,630).stroke();
    doc.font('Song').text('预防对策',60,592,{
        width:50,
        align:'center'
    })

    //用户意见
    doc.moveTo(50,650).lineTo(545,650)
        .lineTo(545,710).lineTo(50,710)
        .lineTo(50,650).stroke();

    doc.font('SongCu').text('客户意见：',60,660,{
        width:60,
        align:'left'
    })

    doc.font('Song').text('非常满意',138,658,{
        width:60,
        align:'left'
    })
    doc.moveTo(125,662).lineTo(134,662).lineTo(134,671).lineTo(125,671).lineTo(125,662).stroke();

    doc.font('Song').text('满意',233,658,{
        width:60,
        align:'left'
    })
    doc.moveTo(220,662).lineTo(229,662).lineTo(229,671).lineTo(220,671).lineTo(220,662).stroke();

    doc.font('Song').text('一般',302,658,{
        width:60,
        align:'left'
    })
    doc.moveTo(290,662).lineTo(299,662).lineTo(299,671).lineTo(290,671).lineTo(290,662).stroke();


    doc.font('Song').text('较差',369,658,{
        width:60,
        align:'left'
    })
    doc.moveTo(357,662).lineTo(366,662).lineTo(366,671).lineTo(357,671).lineTo(357,662).stroke();

    doc.font('SongCu').text('客户签字：',60,690,{
        width:60,
        align:'left'
    })


    doc.end();
    return doc;

}
var createOperationPDFS=function(obj){
    let doc=new PDFDocument({
        size:'A4',
        margin:50
    });

    let count=obj.operations.length;
    let i=0;
    for(let op of obj.operations){
        //head
        doc.image('./public/assets/img/lgxx.jpg', 75, 30,{width:28});

        doc.moveTo(70,60).lineTo(525,60).stroke();

        doc.registerFont('Song', './public/assets/fonts/STSONG.TTF')
        doc.registerFont('SongCu', './public/assets/fonts/FZCSJW.TTF')

        doc.fontSize(10);
        doc.font('Song').text('天津临港信息技术发展有限公司',75,45,{
            width:445,
            align:'right'
        });
        doc.moveDown();

        //单号
        doc.fontSize(12);
        doc.font('Song').text(op.no?op.no:'',50,60,{
            width:495,
            align:'right'
        });

        //表格开始 故障维护记录
        doc.moveTo(50,76).lineTo(545,76)
            .lineTo(545,170)
            .lineTo(50,170)
            .lineTo(50,76)
            .stroke();

        doc.moveTo(298,76).lineTo(298,170).stroke();

        doc.moveTo(298,96).lineTo(545,96).stroke();
        doc.moveTo(298,150).lineTo(545,150).stroke();

        doc.moveTo(380,76).lineTo(380,170).stroke();
        doc.moveTo(462,76).lineTo(462,170).stroke();

        doc.font('Song').text('编写',298,78,{
            width:82,
            align:'center'
        })
        doc.font('Song').text('审核',380,78,{
            width:82,
            align:'center'
        })
        doc.font('Song').text('批准',462,78,{
            width:82,
            align:'center'
        })


        doc.font('Song').text('/',298,152,{
            width:82,
            align:'center'
        })
        doc.font('Song').text('/',380,152,{
            width:82,
            align:'center'
        })
        doc.font('Song').text('/',462,152,{
            width:82,
            align:'center'
        })

        doc.fontSize(20);

        doc.font('SongCu').text('故障维护记录',50,110,{
            width:248,
            align:'center'
        })


        //题目

        doc.moveTo(50,170).lineTo(50,210)
            .lineTo(545,210)
            .lineTo(545,170)
            .stroke();
        doc.moveTo(298,170).lineTo(298,210).stroke();

        doc.fontSize(12);

        let title='';
        let content='';
        try{
            let corporation=obj.corporation.name;
            let equipment=op.businessContent.equipment;
            let equipop=op.businessContent.equipOp.name;
            title=corporation+equipop+'  '+equipment;
            content=equipop+'  '+equipment;
        }
        catch(e){
            console.log(e);
        }



        doc.font('Song').text('题        目：'+title,60,182,{
            width:238,
            align:'left'
        })

        //处理内容
        doc.font('Song').text(content,130,400,{
            width:415,
            align:'left'
        })

        doc.font('Song').text('故障等级：',308,182,{
            width:70,
            align:'left'
        });


        doc.fontSize(14);
        doc.font('Song').text('A',408,180.5);
        doc.font('Song').text('B',460,180.5);
        doc.font('Song').text('C',508,180.5);

        doc.moveTo(392,185).lineTo(401,185).lineTo(401,194).lineTo(392,194).lineTo(392,185).stroke();
        doc.moveTo(444,185).lineTo(453,185).lineTo(453,194).lineTo(444,194).lineTo(444,185).stroke();
        doc.moveTo(492,185).lineTo(501,185).lineTo(501,194).lineTo(492,194).lineTo(492,185).fill().stroke();


        doc.fontSize(12);
        //对象系统
        doc.moveTo(50,210).lineTo(50,250)
            .lineTo(298,250)
            .lineTo(298,210)
            .stroke();
        doc.font('Song').text('对象系统：',60,222,{
            width:238,
            align:'left'
        })

        //客户方负责人
        doc.moveTo(50,250).lineTo(50,290)
            .lineTo(298,290)
            .lineTo(298,250)
            .stroke();

        let customInfo='';
        try{
            let phone=obj.custom_phone;
            if(phone!='15822927208'){
                customInfo=phone
            }
        }
        catch(e){

        }

        doc.font('Song').text('客户方负责人：'+customInfo,60,262,{
            width:238,
            align:'left'
        })

        //发生时间
        doc.moveTo(298,290)
            .lineTo(340,290)
            .lineTo(340,210).stroke();
        doc.font('Song').text('发生时间',303,235,{
            width:36,
            align:'center',
            characterSpacing:5
        });


        let createTimeStamp=op.create_time;
        let createTime=new Date(createTimeStamp);

        doc.moveTo(338,290)
            .lineTo(545,290)
            .lineTo(545,210).stroke();
        doc.font('Song').text(createTime.getFullYear()+'年'+(createTime.getMonth()+1)+'月'+createTime.getDate()+'日',345,230,{
            width:230,
            align:'left'
        })
        doc.font('Song').text(createTime.getHours()+'时'+createTime.getMinutes()+'分',345,257,{
            width:230,
            align:'left'
        })

        //影响范围
        doc.moveTo(50,290).lineTo(50,340)
            .lineTo(545,340)
            .lineTo(545,290).stroke();
        doc.moveTo(120,290).lineTo(120,340).stroke();
        doc.moveTo(298,290).lineTo(298,340).stroke();
        doc.moveTo(340,290).lineTo(340,340).stroke();
        doc.font('Song').text('影响范围',60,307,{
            width:50,
            align:'center'
        })
        doc.font('Song').text('处理时间',303,299,{
            width:36,
            align:'center',
            characterSpacing:5
        })
        //从什么时间开始处理的
        if(op.actions&&op.actions.length>0){
            let startTimeMin=0;
            let endTime=0;
            let actionArray=op.actions;
            for(let ac of actionArray){
                if(startTimeMin==0){
                    startTimeMin=ac.start_time;
                }
                else{
                    if(ac.start_time<startTimeMin){
                        startTimeMin=ac.start_time;
                    }
                }
                //说明完成了
                if(ac.operationComplete==1){
                    endTime=ac.end_time;
                }


            }

            let ST=new Date(startTimeMin);
            //开始处理故障时间
            doc.font('Song').text(ST.getFullYear()+'年'+(ST.getMonth()+1)+'月'+ST.getDate()+'日',345,299,{
                width:230,
                align:'left'
            })
            doc.font('Song').text(ST.getHours()+'时'+ST.getMinutes()+'分',345,317,{
                width:230,
                align:'left'
            })

            //endTIme>0说明做完了，就把所有action的time加起来
            let timeAll=0;
            let renci=0;
            for(let ac of actionArray){
                renci++;
                if(ac.start_time>0&&ac.end_time>0){
                    timeAll=timeAll+ac.end_time-ac.start_time;
                }
            }
            if(endTime>0){
                doc.font('Song').text(timeAll/(1000*60)+'分钟'+(renci>1?'('+renci+'人次)':''),345,357,{
                    align:'left'
                })
            }
        }




        //故障区分
        doc.moveTo(50,340).lineTo(50,390)
            .lineTo(545,390)
            .lineTo(545,340).stroke();
        doc.moveTo(120,340).lineTo(120,390).stroke();
        doc.moveTo(298,340).lineTo(298,390).stroke();
        doc.moveTo(340,340).lineTo(340,390).stroke();
        doc.moveTo(422,340).lineTo(422,390).stroke();
        doc.moveTo(464,340).lineTo(464,390).stroke();

        doc.font('Song').text('故障区分',60,357,{
            width:50,
            align:'center'
        })

        let equipType='';
        try{
            equipType=op.businessContent.type;
        }catch(e){
            console.log(e);
        }




        doc.font('Song').text('硬件',139,347,{
            width:52,
            align:'left'
        });
        if(equipType=='HARDWARE'){
            doc.moveTo(127,351).lineTo(136,351).lineTo(136,360).lineTo(127,360).lineTo(127,351).fill();
        }
        else{
            doc.moveTo(127,351).lineTo(136,351).lineTo(136,360).lineTo(127,360).lineTo(127,351).stroke();
        }




        doc.font('Song').text('软件',191,347,{
            width:52,
            align:'left'
        });
        if(equipType=='SOFTWARE'){
            doc.moveTo(179,351).lineTo(188,351).lineTo(188,360).lineTo(179,360).lineTo(179,351).fill();
        }
        else{
            doc.moveTo(179,351).lineTo(188,351).lineTo(188,360).lineTo(179,360).lineTo(179,351).stroke();
        }


        doc.font('Song').text('网络',243,347,{
            width:52,
            align:'left'
        });
        if(equipType=='NETWORK'){
            doc.moveTo(231,351).lineTo(240,351).lineTo(240,360).lineTo(231,360).lineTo(231,351).fill();
        }
        else{
            doc.moveTo(231,351).lineTo(240,351).lineTo(240,360).lineTo(231,360).lineTo(231,351).stroke();
        }


        doc.font('Song').text('数据库',139,367,{
            width:52,
            align:'left'
        });
        doc.moveTo(127,371).lineTo(136,371).lineTo(136,380).lineTo(127,380).lineTo(127,371).stroke();


        doc.font('Song').text('应用',191,367,{
            width:52,
            align:'left'
        });
        doc.moveTo(179,371).lineTo(188,371).lineTo(188,380).lineTo(179,380).lineTo(179,371).stroke();

        doc.font('Song').text('其他',243,367,{
            width:52,
            align:'left'
        });
        doc.moveTo(231,371).lineTo(240,371).lineTo(240,380).lineTo(231,380).lineTo(231,371).stroke();



        doc.font('Song').text('故障处理用时',303,342,{
            width:36,
            align:'center',
            characterSpacing:5
        })

        /*    doc.font('Song').text('15分钟',345,357,{
         align:'left'
         })*/

        doc.font('Song').text('服务中断时间',427,342,{
            width:36,
            align:'center',
            characterSpacing:5
        })
        doc.font('Song').text('0分钟',469,357,{
            align:'left'
        })

        //处理内容
        doc.moveTo(50,390).lineTo(50,510)
            .lineTo(545,510)
            .lineTo(545,390).stroke();
        doc.moveTo(120,390).lineTo(120,510).stroke();
        doc.font('Song').text('处理内容',60,442,{
            width:50,
            align:'center'
        })
        /*    doc.font('Song').text('',60,407,{
         width:415,
         align:'left'
         })*/



        //处理结果
        doc.moveTo(50,510).lineTo(50,570)
            .lineTo(545,570)
            .lineTo(545,510).stroke();
        doc.moveTo(120,510).lineTo(120,570).stroke();
        doc.font('Song').text('处理结果',60,532,{
            width:50,
            align:'center'
        })
        doc.font('Song').text('完成',130,520,{
            width:415,
            align:'left'
        })



        //预防对策
        doc.moveTo(50,570).lineTo(50,630)
            .lineTo(545,630)
            .lineTo(545,570).stroke();
        doc.moveTo(120,570).lineTo(120,630).stroke();
        doc.font('Song').text('预防对策',60,592,{
            width:50,
            align:'center'
        })

        //用户意见
        doc.moveTo(50,650).lineTo(545,650)
            .lineTo(545,710).lineTo(50,710)
            .lineTo(50,650).stroke();

        doc.font('SongCu').text('客户意见：',60,660,{
            width:60,
            align:'left'
        })

        doc.font('Song').text('非常满意',138,658,{
            width:60,
            align:'left'
        })
        doc.moveTo(125,662).lineTo(134,662).lineTo(134,671).lineTo(125,671).lineTo(125,662).stroke();

        doc.font('Song').text('满意',233,658,{
            width:60,
            align:'left'
        })
        doc.moveTo(220,662).lineTo(229,662).lineTo(229,671).lineTo(220,671).lineTo(220,662).stroke();

        doc.font('Song').text('一般',302,658,{
            width:60,
            align:'left'
        })
        doc.moveTo(290,662).lineTo(299,662).lineTo(299,671).lineTo(290,671).lineTo(290,662).stroke();


        doc.font('Song').text('较差',369,658,{
            width:60,
            align:'left'
        })
        doc.moveTo(357,662).lineTo(366,662).lineTo(366,671).lineTo(357,671).lineTo(357,662).stroke();

        doc.font('SongCu').text('客户签字：',60,690,{
            width:60,
            align:'left'
        })

        if(i==(count-1)){

        }
        else{
            doc.addPage();
        }
        i++;
    }

    doc.end();
    return doc;

}
var createOperationDocx=function(){
    var docx = officegen ({
        type: 'docx',
        orientation: 'portrait',
        pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 1000 }
    });

    docx.on ( 'finalize', function ( written ) {
        console.log ( 'Finish to create the surprise PowerPoint stream and send it to '  + 'Total bytes created: ' + written + '\n' );
    });

    docx.on ( 'error', function ( err ) {
        console.log ( err );
    });
    var header = docx.getHeader ().createP ();
    header.addText ( '天津临港信息技术发展有限公司' );





    var table2=[
        [1,2,3,4],
        [5,6,7,8]
    ]
    var tableStyle2 = {
        tableColWidth: 2065,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS",
        borders:true
    }
    var pObj2=docx.createTable (table2, tableStyle2);

    var pp=docx.createP();

    pp.addText('你好');



    var table = [
        [{
            val: "故障维护记录",
            opts: {
                cellColWidth: 4261,
                b:true,
                sz: '32',
                fontFamily: "宋体"
            }
        },{
            val: "编写",
            opts: {
                b:true,
                color: "A00000",
                sz: '16',
                align: "right"
            }
        },{
            val: "审核",
            opts: {
                align: "center",
                cellColWidth: 42,
                b:true,
                sz: '16'
            }
        },{
            val: "批准",
            opts: {
                align: "center",
                vAlign:'center',
                cellColWidth: 42,
                b:true,
                sz: '16'
            }
        }],
        [1,'All grown-ups were once children',{val: "I have two spans.", opts: {gridSpan: 2}}],
        [2,'there is no harm in putting off a piece of work until another day.',pObj2,''],
        [3,'But when it is a matter of baobabs, that always means a catastrophe.','',''],
        [4,'watch out for the baobabs!','END',''],
    ]

    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS",
        borders:true
    }

    var pObj = docx.createTable (table, tableStyle);
    return docx;
}