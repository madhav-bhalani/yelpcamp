module.exports =  class ExpressError extends Error{
    constructor(message, status){
        super(message);
        this.message = message;
        this.status = status;
    }
}

