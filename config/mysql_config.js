/**
 * Created by liumeng on 2017/5/25.
 */
const defaultConfig =__dirname+ '/mysql_config_default.js';
// 可设定为绝对路径，如 /opt/product/config-override.js
const overrideConfig =__dirname+'/mysql_config_override.js';
const testConfig = __dirname+'/mysql_config_test.js';

const fs = require('fs');

var config = null;

console.log(`Load ${defaultConfig}...`);
config = require(defaultConfig);

if (process.env.NODE_ENV === 'development') {
    try {
        if (fs.statSync(testConfig).isFile()) {
            //console.log(`Load ${testConfig}...`);
            config = Object.assign(config, require(testConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${testConfig}.`+err);
    }


} else if(process.env.NODE_ENV === 'production') {
    try {
        if (fs.statSync(overrideConfig).isFile()) {
            //console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config, require(overrideConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideConfig}.`+err);
    }
}else{

}

console.log(config);

module.exports = config;