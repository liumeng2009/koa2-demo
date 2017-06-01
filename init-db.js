/**
 * Created by liumeng on 2017/5/26.
 */
require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./app/model.js');


model.sync().then(()=>{
    console.log('sync done');
    process.exit(0);
}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});