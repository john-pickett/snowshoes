const fs = require('fs');
const snowAxios = require('../config/axios.js');
const registry = require('../config/registry.json');

// const url = '/api/now/table/' + item_data.table + "/" + item_data.sys_id;
//const folder = item_data.table;
//const file_name = script_name + '.js';
// let updated_script = fs.readFileSync(`./service-now/${folder}/${file_name}`, 'utf8');


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
		let url = '/api/now/table/' + script.table + "/" + script.sys_id;
		let updated_script = fs.readFileSync(`./service-now/${script.table}/${script.name}.js`, 'utf8');
		const result = await putScript(url, updated_script);
		console.log(result);
	})
}

updateAllScripts(registry);