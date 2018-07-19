"use strict"
require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./app/model.js');

model.sync().then(async()=>{

}).catch((e)=>{
    console.log('failed!'+e);
})