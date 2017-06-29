const ApiErrorNames = require('./ApiErrorNames');

/**
 * 自定义Api异常
 */
class ApiError extends Error{
    //构造方法
    constructor(error_name){
        super();

        var error_info = ApiErrorNames.getErrorInfo(error_name);

        console.log('9999999999'+JSON.stringify(error_info));

        this.name = error_name;
        this.status = error_info.code;
        this.message = error_info.message;
    }
}

module.exports = ApiError;