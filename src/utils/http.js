
const { getToken } = require('../utils/cookie');

class http {
    static get baseUrl() {
        return process.env.URL_API + '/api';
    }

    static getAuthHeaders(token) {
        // const token = getToken();
        return {
            'authorization': `Bearer ${token}`,
            'content-Type': 'application/json'
        };
    }

    static async get(endpoint, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async post(endpoint, data, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async put(endpoint, data, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async delete(endpoint, token) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}
module.exports = http;