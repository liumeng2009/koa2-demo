//有个别的特殊情况 例如 api/operation/:id 和 api/operation/working的区分
var needAuthUrlArray=[
    '/api/operation/workingOperationList',
    '/api/operation/doneOperationList',
    '/api/operation/operationCount',

    '/api/order/saveOrder'
]
module.exports = needAuthUrlArray;