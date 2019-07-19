var fs = require('fs');
const snowAxios = require('../config/axios.js');
const config = require('../config/snow-config.json');
const { write_json_registry, write_javascript, asyncForEach, parse_json_registry } = require('./utils.js');
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

/*
script: {
      "client_callable": "false",
      "access": "public",
      "sys_mod_count": "14",
      "active": "true",
      "description": "Script Include which creates/manages the activity data for Benchmarks Recommendations",
      "sys_updated_on": "2018-01-15 17:35:47",
      "sys_tags": "",
      "sys_class_name": "sys_script_include",
      "sys_id": "22af764d5b673200514d484c11f91a55",
      "sys_package": {
        "link": "https://dev54390.service-now.com/api/now/table/sys_package/3ad18693db92220004997878f0b8f516",
        "value": "3ad18693db92220004997878f0b8f516"
      },
      "sys_update_name": "sys_script_include_22af764d5b673200514d484c11f91a55",
      "sys_updated_by": "admin",
      "api_name": "sn_bm_client.RecommendationManager",
      "sys_created_on": "2017-06-22 22:17:03",
      "name": "RecommendationManager",
      "sys_name": "RecommendationManager",
      "sys_scope": {
        "link": "https://dev54390.service-now.com/api/now/table/sys_scope/3ad18693db92220004997878f0b8f516",
        "value": "3ad18693db92220004997878f0b8f516"
      },
      "sys_created_by": "admin",
      "sys_policy": "protected"
    }
*/

const scriptAlreadyExists = (script, registry) => {
	return registry.some((item) => {
		return item.sys_id === script.sys_id;
	})
}

const configureRegistryData = (scripts) => {
	// parse existing registry here and add new scripts to it
	const existing_data = parse_json_registry();

	if (existing_data.length) { // registry already has data
		for (let i = 0; i < scripts.length; i ++) {
			if (!scriptAlreadyExists(scripts[i], existing_data)) {
				// new scripts here
				let currentScript = {};
				currentScript.name = item.name;
				currentScript.sys_id = item.sys_id;
				currentScript.table = item.sys_class_name; // is sys_class_name always the same as table??
				currentScript.created_on = item.sys_created_on;
				currentScript.updated_on = item.sys_updated_on;
				existing_data.push(currentScript);
			} else {
				// existing script - update updated value
				let currentScriptIndex = existing_data.findIndex(item => item.sys_id === scripts[i].sys_id);
				existing_data[currentScriptIndex].sys_updated_on = scripts[i].sys_updated_on; // should we verify name/created are the same?
			}
			return existing_data;
		}
	} else { // if registry does not have data, just write them all to the file
		let registryData = []

		scripts.forEach((item) => {
			let currentScript = {};
			currentScript.name = item.name;
			currentScript.sys_id = item.sys_id;
			currentScript.table = item.sys_class_name; // is sys_class_name always the same as table??
			currentScript.created_on = item.sys_created_on;
			currentScript.updated_on = item.sys_updated_on;
			registryData.push(currentScript);
		})
		return registryData;
	}

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

const start = (async () => {
	await asyncForEach(Object.values(table_maps), async (table) => {
		await writeSNDataToFiles(table)
	})
})();



module.exports = { getScriptsFromSN, configureRegistryData, writeSNDataToFiles };