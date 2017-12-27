const ApiErrorNames = require('./ApiErrorNames');

/**
 * 自定义Api异常
 */
class ApiError extends Error{
    //构造方法
    constructor(error_name,custom_info_array){
        super();

        var error_info = ApiErrorNames.getErrorInfo(error_name);

        this.name = error_name;
        this.status = error_info.code;

        //实现用户自定义错误提示
        if(custom_info_array){
            let errorMessage=error_info.message;
            let i=1;
            for(let info of custom_info_array){
                console.log(info);
                console.log('{'+i+'}');
                errorMessage=errorMessage.replace('{'+i+'}',info);
                i++;
                console.log(errorMessage);
            }
            this.message=errorMessage;
        }
        else{
            this.message=error_info.message;
        }
    }
}

module.exports = ApiError;