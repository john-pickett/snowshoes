var fs = require('fs');
const snowAxios = require('../config/axios.js');
const config = require('../config/snow-config.json');
const { write_json_registry, write_javascript, asyncForEach } = require('./utils.js');
const table_maps = require('../config/table-maps.json');
const app_name = config.app_name;

const getScriptsFromSN = (table) => {
	// returns [ {}, {} ]
	return new Promise((resolve, reject) => {
		snowAxios.get(`/api/now/table/${table}` + `?sysparm_query=sys_scopeLIKE${app_name}`)
		.then((res) => {
			console.log(res.status)
			resolve(res.data.result)
		}).catch((err) => {
			reject(err)
		})
	})
}

const configureRegistryData = (scripts) => {
	let registryData = []

	scripts.forEach((item) => {
		let currentScript = {}
		currentScript.name = item.name;
		currentScript.sys_id = item.sys_id;
		currentScript.table = item.sys_class_name; // is sys_class_name always the same as table??
		registryData.push(currentScript);
	})
	return registryData;
}

const writeSNDataToFiles = async (table) => {
	console.log('grabbing ' + table);
	const scripts = await getScriptsFromSN(table);

	return new Promise((resolve, reject) => {
		const registryData = configureRegistryData(scripts);
		write_json_registry('registry', JSON.stringify(registryData, null, '\t'));

		// writing individual JS files
		scripts.forEach((item) => {
			write_javascript(item.name, item.script, item.sys_class_name);
		});
		resolve();
	})
	
}

// writeSNDataToFiles(table_maps.script_includes).then(() => {
// 	writeSNDataToFiles(table_maps.business_rules)
// })

const start = (async () => {
	await asyncForEach(Object.values(table_maps), async (table) => {
		await writeSNDataToFiles(table)
	})
})();



module.exports = { getScriptsFromSN, write_json_registry, write_javascript, writeSNDataToFiles };