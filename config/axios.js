const axios = require('axios');
const config = require('./snow-config.json');

const snowAxios = axios.create({
	baseURL: config.url,
	auth: {
		username: config.username,
		password: config.password
	}
})

module.exports = snowAxios;