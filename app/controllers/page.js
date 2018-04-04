const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const officegen=require('officegen');


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


    var docx = officegen ( {
        type: 'docx',
        orientation: 'portrait',
        pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 1000 }
        // The theme support is NOT working yet...
        // themeXml: themeXml
    } );

// Remove this comment in case of debugging Officegen:
// officegen.setVerboseMode ( true );

    docx.on ( 'error', function ( err ) {
        console.log ( err );
    });
    docx.on('onend',function(written){
        console.log('111111111111111'+written);
    })

    var pObj = docx.createP ();

    pObj.addText ( 'Simple' );
    pObj.addText ( ' with color', { color: '000088' } );
    pObj.addText ( ' and back color.', { color: '00ffff', back: '000088' } );

    var pObj = docx.createP ();

    pObj.addText ( 'Since ' );
    pObj.addText ( 'officegen 0.2.12', { back: '00ffff', shdType: 'pct12', shdColor: 'ff0000' } ); // Use pattern in the background.
    pObj.addText ( ' you can do ' );
    pObj.addText ( 'more cool ', { highlight: true } ); // Highlight!
    pObj.addText ( 'stuff!', { highlight: 'darkGreen' } ); // Different highlight color.

    var pObj = docx.createP ();

    pObj.addText ('Even add ');
    pObj.addText ('external link', { link: 'https://github.com' });
    pObj.addText ('!');

    var pObj = docx.createP ();

    pObj.addText ( 'Bold + underline', { bold: true, underline: true } );

    var pObj = docx.createP ( { align: 'center' } );

    pObj.addText ( 'Center this text', { border: 'dotted', borderSize: 12, borderColor: '88CCFF' } );

    var pObj = docx.createP ();
    pObj.options.align = 'right';

    pObj.addText ( 'Align this text to the right.' );

    var pObj = docx.createP ();

    pObj.addText ( 'Those two lines are in the same paragraph,' );
    pObj.addLineBreak ();
    pObj.addText ( 'but they are separated by a line break.' );

    docx.putPageBreak ();

    var pObj = docx.createP ();

    pObj.addText ( 'Fonts face only.', { font_face: 'Arial' } );
    pObj.addText ( ' Fonts face and size.', { font_face: 'Arial', font_size: 40 } );

    docx.putPageBreak ();

    var pObj = docx.createP ();

    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image3.png' ) );

    docx.putPageBreak ();

    var pObj = docx.createP ();

    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image1.png' ) );

    var pObj = docx.createP ();

    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/sword_001.png' ) );
    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/sword_002.png' ) );
    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/sword_003.png' ) );
    pObj.addText ( '... some text here ...', { font_face: 'Arial' } );
    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/sword_004.png' ) );

    var pObj = docx.createP ();

    pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image1.png' ) );

    docx.putPageBreak ();

    var pObj = docx.createListOfNumbers ();

    pObj.addText ( 'Option 1' );

    var pObj = docx.createListOfNumbers ();

    pObj.addText ( 'Option 2' );

    pObj.addHorizontalLine ();

    var pObj = docx.createP ({ backline: 'E0E0E0' });

    pObj.addText ( 'Backline text1' );

    pObj.addText ( ' text2' );

    var table = [
        [{
            val: "No.",
            opts: {
                cellColWidth: 4261,
                b:true,
                sz: '48',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        },{
            val: "Title1",
            opts: {
                b:true,
                color: "A00000",
                align: "right",
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        },{
            val: "Title2",
            opts: {
                align: "center",
                cellColWidth: 42,
                b:true,
                sz: '48',
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }],
        [1,'All grown-ups were once children',''],
        [2,'there is no harm in putting off a piece of work until another day.',''],
        [3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
        [4,'watch out for the baobabs!','END'],
    ]

    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS"
    }

    var pObj = docx.createTable (table, tableStyle);

/*    var out = fs.createWriteStream ( 'tmp/out.docx' );

    out.on ( 'error', function ( err ) {
        console.log ( err );
    });



    out.on ( 'close', function () {
        console.log ( 'Finish to create a DOCX file.' +docx);
        ctx.body=docx;
    });*/

    docx.generate ( ctx.res );




/*    await ctx.render('back/operation/print', {
        title: '需求'
    });*/
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