'use strict';

module.exports = {
    currentTimeStamp: ()=> Math.floor(new Date() / 1000),

    handleSuccessOrErrorMessage: (err, message, res, data,status,param) => {
        if (!err) {
            let response = {'error': false, 'message': message};
            if (typeof data !== undefined) {
                response.data = data;
            }
            res.status(200).send(response);
        } else {
           let response = {'error': true, 'message': message };
            if(data !== undefined || param !== undefined){
                response.data = data
                response.param = param
                res.status(status).send(response);
            }else{
                response = {'error': true, 'message': message };
                res.status(400).send(response);
            }
        }
    },
}