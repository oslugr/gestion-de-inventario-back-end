class APIError extends Error{
    constructor(name, statusCode, descripcion, log){

        super(descripcion);

        this.name        = name;
        this.statusCode  = statusCode;
        console.log(log)
    }

    getJson(){
        return {
            error: this.name,
            codigo: this.statusCode,
            descripcion: this.descripcion
        }
    }
}

class BadRequest extends APIError{
    constructor(descripcion, errores, log){

        super('Bad Request', '400', descripcion, log);
        
        this.errores = errores;
    }

    getJson(){
        return {
            error: this.name,
            codigo: this.statusCode,
            descripcion: this.descripcion,
            errores: this.errores
        }
    }
}

module.exports = { APIError, BadRequest}