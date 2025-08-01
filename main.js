require('dotenv').config();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

let source = process.env.REPOSITORIES_FILE_PATH;
let localWorkspace = process.env.WORKSPACE_PATH;
let displayName = process.env.DISPLAY_NAME;
let email = process.env.EMAIL;
let baseUrlToReplace = process.env.BASE_URL_TO_REPLACE;
let sheetIndex = process.env.SHEET_INDEX;

let sourceExtension = utils.getExtension(source);
let data = [];

switch(sourceExtension){
  case 'xlsx': {
    let workbook = XLSX.readFile(source);
    let sheetNames = workbook.SheetNames;
    let sheetName = sheetNames[sheetIndex];
    let sheet = workbook.Sheets[sheetName];
    let dataXLSX = XLSX.utils.sheet_to_json(sheet);
    data = dataXLSX.map(item => item['URL']);
  }
  case 'txt':
  default: {
    data = fs.readFileSync(source, { encoding: 'utf-8' }).split(/\r?\n/);
    data = data
      .filter(line => line.trim() !== '')
      .filter(line => !line.startsWith('#'));
  }
}

utils.setGlobalTooLongPath();

data.forEach(item => {
  let url = item.trim();
  let dir = url.replace(baseUrlToReplace, "");
  let parts = dir.split('/');
  let repoName = parts[parts.length - 1];
  parts = parts.filter(p => p.indexOf('.git') == -1);
  let newPath = parts.join('/');
  dir = path.join(localWorkspace, newPath);
  repoName = repoName.replace('.git', '');
  console.log('\n', dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${dir} creado.`)
  } else {
    console.warn(`${dir} existe.`);
    let fullPathRepo = path.join(dir, repoName); 
    console.log(fullPathRepo);
    if(fs.existsSync(fullPathRepo)){
      console.log('Repositorio existe.')
      process.chdir(fullPathRepo);
      utils.execSyncCommand(getSetUrlOriginCommand(url));
      console.log(`Remote Url ${repoName} establecida.`);
    }
  }
  utils.execClone(url, repoName, dir, displayName, email)
    .then(res => {
      console.log(`${repoName} Completo`);
    })
    .catch(e => console.log(e)); 
});

