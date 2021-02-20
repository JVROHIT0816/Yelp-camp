const { model } = require("mongoose");

class apperror extends Error{
    constructor(message,status){
        super();
        this.message = message;
        this.status = status;
        //console.log(message);
    }
}

module.exports = apperror;