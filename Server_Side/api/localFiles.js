const config = require('../config');
const {public_folder} = config.localFiles;
const path = require('path');

const getLocalFile = (fileInPublicFolder = '') => path.join(__dirname, public_folder, fileInPublicFolder);

module.exports = {
    getLocalFile
};