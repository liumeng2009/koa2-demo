/**
 * Created by liumeng on 2017/5/24.
 */
const ApiErrorNames = require('./ApiErrorNames');

class ApiError extends Error{

    //构造方法
    constructor(error_name){
        super();
        //说明传递的是对象,并且处在开发环境下，打印详细的错误信息
        if(error_name.name&&process.env.NODE_ENV === 'development'){
            console.log(1+error_name.name);
            this.name = error_name.name;
            this.code = error_name.code;
            this.message = error_name.message;
        }
        //说明传递的是字符串
        else{
            if(error_name.name){
                //非开发环境下，打印友好的错误信息
                console.log(2);
                var error_info = ApiErrorNames.getErrorInfo(error_name.name);
                this.name = error_name;
                this.code = error_info.code;
                this.message = error_info.message;
            }
            else{
                console.log(3);
                var error_info = ApiErrorNames.getErrorInfo(error_name);
                this.name = error_name;
                this.code = error_info.code;
                this.message = error_info.message;
            }
        }
    }
}

module.exports = ApiError;