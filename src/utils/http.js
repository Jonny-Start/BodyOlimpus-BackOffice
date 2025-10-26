
/**
 * Clase http que proporciona métodos para realizar solicitudes HTTP.
 * 
 * @class
 * 
 * @static
 * 
 * @description Esta clase contiene métodos estáticos para realizar solicitudes GET, POST, PUT y DELETE a una API.
 * 
 * @method {string} baseUrl - Obtiene la URL base para las solicitudes API.
 * 
 * @method {Object} getAuthHeaders - Genera los encabezados de autorización para las solicitudes HTTP.
 * @param {string} token - El token de autorización que se utilizará en el encabezado.
 * 
 * @method {Promise<Object>} get - Realiza una solicitud GET a un endpoint específico.
 * @param {string} endpoint - El endpoint al que se desea realizar la solicitud.
 * @param {string} token - El token de autenticación para la solicitud.
 * 
 * @method {Promise<Object>} post - Realiza una solicitud POST a un endpoint específico.
 * @param {string} endpoint - El endpoint al que se enviará la solicitud.
 * @param {Object} data - Los datos que se enviarán en el cuerpo de la solicitud.
 * @param {string} token - El token de autenticación para la solicitud.
 * 
 * @method {Promise<Object>} put - Realiza una solicitud HTTP PUT a un endpoint específico.
 * @param {string} endpoint - El endpoint al que se enviará la solicitud.
 * @param {Object} data - Los datos que se enviarán en el cuerpo de la solicitud.
 * @param {string} token - El token de autenticación para la solicitud.
 * 
 * @method {Promise<Object>} delete - Elimina un recurso en el servidor.
 * @param {string} endpoint - La ruta del recurso que se desea eliminar.
 * @param {string} token - El token de autenticación para autorizar la solicitud.
 */
class http {

    
    /**
     * Obtiene la URL base para las solicitudes API.
     * La URL se construye a partir de la variable de entorno URL_API
     * y se le añade el sufijo '/api'.
     *
     * @static
     * @returns {string} La URL base para las solicitudes API.
     */
    static get baseUrl() {
        return process.env.URL_API + '/api';
    }

    
    /**
     * Genera los encabezados de autorización para las solicitudes HTTP.
     *
     * @param {string} token - El token de autorización que se utilizará en el encabezado.
     * @returns {Object} Un objeto que contiene los encabezados de autorización.
     */
    static getAuthHeaders(token) {
        return {
            'authorization': `Bearer ${token}`,
            'content-Type': 'application/json'
        };
    }


    /**
     * Realiza una solicitud GET a un endpoint específico.
     *
     * @param {string} endpoint - El endpoint al que se desea realizar la solicitud.
     * @param {string} token - El token de autenticación para la solicitud.
     * @returns {Promise<Object>} - Una promesa que se resuelve con los datos de la respuesta en formato JSON.
     * @throws {Error} - Lanza un error si la respuesta no es exitosa, con el mensaje de error correspondiente.
     */
    static async get(endpoint, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeaders(token)
        });
        if (!response.ok) {
            const errorData = await response.json(); // Get the response body
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }


    /**
     * Realiza una solicitud POST a un endpoint específico.
     *
     * @param {string} endpoint - El endpoint al que se enviará la solicitud.
     * @param {Object} data - Los datos que se enviarán en el cuerpo de la solicitud.
     * @param {string} token - El token de autenticación para la solicitud.
     * @returns {Promise<Object>} - Una promesa que se resuelve con la respuesta en formato JSON.
     * @throws {Error} - Lanza un error si la respuesta no es exitosa, con el mensaje de error correspondiente.
     */
    static async post(endpoint, data, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json(); // Get the response body
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }


    /**
     * Realiza una solicitud HTTP PUT a un endpoint específico.
     *
     * @param {string} endpoint - El endpoint al que se enviará la solicitud.
     * @param {Object} data - Los datos que se enviarán en el cuerpo de la solicitud.
     * @param {string} token - El token de autenticación para la solicitud.
     * @returns {Promise<Object>} - Una promesa que se resuelve con la respuesta JSON del servidor.
     * @throws {Error} - Lanza un error si la respuesta no es exitosa, con el mensaje de error correspondiente.
     */
    static async put(endpoint, data, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json(); // Get the response body
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }


    /**
     * Elimina un recurso en el servidor.
     *
     * @param {string} endpoint - La ruta del recurso que se desea eliminar.
     * @param {string} token - El token de autenticación para autorizar la solicitud.
     * @throws {Error} Lanza un error si la respuesta no es exitosa, incluyendo el mensaje de error del servidor.
     * @returns {Promise<Object>} Una promesa que se resuelve con la respuesta en formato JSON.
     */
    static async delete(endpoint, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token)
        });
        if (!response.ok) {
            const errorData = await response.json(); // Get the response body
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }


}
module.exports = http;