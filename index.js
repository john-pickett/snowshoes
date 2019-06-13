
const { getScriptsFromSN } = require('./scripts/get_scripts');
const { updateScript } = require('./scripts/update');

const snowshoes = { getScriptsFromSN, updateScript };

module.exports = snowshoes;