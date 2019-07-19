const fs = require('fs');

const write_json_registry = (file_name, file_data) => { // data must be a string e.g., JSON.stringify(data)
	const dir = __dirname + '/../config';

	fs.writeFile(`${dir}/${file_name}.json`, file_data, 'utf8', () => {
		console.log('done writing to json');
	});
}

const parse_json_registry = () => {
	const registry_file = __dirname + '/../config/registry.json';
	let existing_data;

	// if statement is for adding to existing registry instead of overwriting
	if (fs.existsSync(registry_file)){
		existing_data = JSON.parse(fs.readFileSync(registry_file, 'utf8'));
	}
	return existing_data;
}

const write_javascript = (file_name, data, class_name) => {
	const sn_dir = __dirname + `/../service-now/`
	if (!fs.existsSync(sn_dir)){
		fs.mkdirSync(sn_dir)
	}
	// need to map class_name to friendly SN name 
	const dir = __dirname + `/../service-now/${class_name}`
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir)
	}
	fs.writeFile(`${dir}/${file_name}.js`, data, 'utf8', () => {
		console.log('done writing to javascript file')
	})
}

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
	  await callback(array[index])
	}
}

module.exports = { write_json_registry, write_javascript, asyncForEach, parse_json_registry };