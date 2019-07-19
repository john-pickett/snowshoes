const fs = require('fs');
const snowAxios = require('../config/axios.js');
const registry = require('../config/registry.json');
const { asyncForEach } = require('./utils.js');

const putScript = (url, updated_script) => {
	return new Promise((resolve, reject) => {
		snowAxios.put(url, {
			script: updated_script
		}).then((res) => {
			resolve(res.status)
		})
	})
}

const updateAllScripts = async (registry) => {
	registry.forEach(async (script) => {
		console.log('updating ' + script.name);
		let url = '/api/now/table/' + script.table + "/" + script.sys_id;
		let updated_script = fs.readFileSync(`./service-now/${script.table}/${script.name}.js`, 'utf8');
		const result = await putScript(url, updated_script);
		console.log(result);
	})
}

const start = (async () => {
	await asyncForEach(registry, async (script) => {
		console.log('putting ' + script.table)
		let url = '/api/now/table/' + script.table + "/" + script.sys_id;
		let updated_script = fs.readFileSync(`./service-now/${script.table}/${script.name}.js`, 'utf8');
		const result = await putScript(url, updated_script);
		console.log(result);
	})
})();
