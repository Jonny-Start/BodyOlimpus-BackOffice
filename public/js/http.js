
// Utilidad para hacer peticiones HTTP a una API REST
const API_BASE_URL = window.API_BASE_URL || '/api';

// Función para obtener el token de la cookie
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

// Función genérica para peticiones con token y cookies
async function httpRequest(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
	const token = getCookie('token');
	const config = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
			...(token ? { 'Authorization': `Bearer ${token}` } : {})
		},
		credentials: 'include', // Enviar cookies
	};
	if (body) {
		config.body = JSON.stringify(body);
	}
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || 'Error en la petición');
		}
		return data;
	} catch (error) {
		console.error('HTTP Error:', error);
		throw error;
	}
}

// Métodos específicos para GET, POST, PUT, DELETE
export async function get(endpoint, headers = {}) {
	return httpRequest(endpoint, { method: 'GET', headers });
}

export async function post(endpoint, body, headers = {}) {
	return httpRequest(endpoint, { method: 'POST', body, headers });
}

export async function put(endpoint, body, headers = {}) {
	return httpRequest(endpoint, { method: 'PUT', body, headers });
}

export async function del(endpoint, headers = {}) {
	return httpRequest(endpoint, { method: 'DELETE', headers });
}
