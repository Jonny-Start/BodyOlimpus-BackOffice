module.exports = class localStorage {
    constructor() { }

    static push(token = '') {
        return localStorage.setItem('token', JSON.stringify(token)); // Guarda el token en localStorage
    }

    static get(){
        return JSON.parse(localStorage.getItem('token')); //Extraer el token del localStorage
    }
}