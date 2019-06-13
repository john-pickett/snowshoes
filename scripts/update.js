const fs = require('fs');
const snowAxios = require('../config/axios.js');
const config = require('../config/snow-config.json');
const table_maps = require('../config/table-maps.json');
const registry = require('../config/registry.json');

const script_name = process.argv[2];

// this func finds the script by the name (same as file name)
// is there a better way to do this??
const findItemInRegistry = (name) => {
	return registry.filter((item) => {
		return item.name === name
	})[0]
}

const item_data = findItemInRegistry(script_name);
const url = '/api/now/table/' + item_data.table + "/" + item_data.sys_id;
const folder = item_data.table;
const file_name = script_name + '.js';
const updated_script = fs.readFileSync(`./service-now/${folder}/` + file_name, 'utf8');

const putScript = () => {
	return new Promise((resolve, reject) => {
		snowAxios.put(url, {
			script: updated_script
			}).then((res) => {
			resolve(res.status)
		})
	})
}

const updateScript = async () => {
	const result = await putScript();
	console.log(result);
}

updateScript();

module.exports = { updateScript, putScript };