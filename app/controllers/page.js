const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const officegen=require('officegen');
const PDFDocument=require('pdfkit');


exports.operation=async(ctx,next)=>{
    let id=ctx.params.id;

    let OperationModel=model.operations;

    let operationObj=await OperationModel.findOne({
        where:{
            id:id,
            status:1
        }
    })

    if(operationObj){
        ctx.res.writeHead ( 200, {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'Content-disposition': 'attachment; filename=WorkOrder_'+operationObj.no+'.docx'
        });

        let docx=createOperationDocx(operationObj);

        let r=ctx.res;
        docx.generate ( r);
        ctx.body=r;
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }
}
exports.order=async(ctx,next)=>{
    ctx.res.writeHead ( 200, {
        "Content-Type": "application/pdf",
        'Content-disposition': 'attachment; filename=WorkOrder.pdf'
    });
    let doc=new PDFDocument({
        size:'A4'
    });

    doc.rect(0,0,200,200).stroke('#000000');

    doc.font('Times-Roman')
        .text('123')
        .moveDown()

    doc.font('Times-Roman')
        .text('Hello from Times Roman!')



    doc.end();


    let stream=doc.pipe(ctx.res);
    ctx.body=stream;
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