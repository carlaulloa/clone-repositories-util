const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

let source = "C:\\Users\\carla\\Downloads\\RepositoryLinks.xlsx";
let localWorkspace = "C:\\Users\\carla\\principal-workspace";
let sheetIndex = 0;

let workbook = XLSX.readFile(source);
let sheetNames = workbook.SheetNames;
let sheetName = sheetNames[sheetIndex];
let sheet = workbook.Sheets[sheetName];
var data = XLSX.utils.sheet_to_json(sheet);

let setTooLongPath = () => {
  child_process.execSync('git config --global core.longpaths true', { stdio: 'inherit' });
}

let getCloneCommand = (url, repoName) => {
  return `git clone --mirror ${url} ${repoName}/.git`;
}

let execClone = (url, repoName, dir) => {
  return new Promise((resolve, reject) => {
    process.chdir(dir);
    let coomand = getCloneCommand(url, repoName);
    try {
      child_process.execSync(coomand, { stdio: 'inherit' });
      let full = path.join(dir, repoName);
      process.chdir(full);
      child_process.execSync(`git config --unset core.bare`, { stdio: 'inherit' });
      console.log(`${repoName} unset completo`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

setTooLongPath();

data.forEach(item => {
  const urlColumn = 'Actualizar URL';
  const partToReplace = "git remote set-url origin";
  let url = item[urlColumn].replace(partToReplace, "").trim();
  let baseUrlToReplace = "http://gitlab.odybank.com.pe/";
  let dir = url.replace(baseUrlToReplace, "");
  let parts = dir.split('/');
  let repoName = parts[parts.length - 1];
  parts = parts.filter(p => p.indexOf('.git') == -1);
  let newPath = parts.join('/');
  dir = path.join(localWorkspace, newPath);
  console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${dir} creado.`)
  } else {
    console.warn(`${dir} existe.`)
  }
  repoName = repoName.replace('.git', '');
  execClone(url, repoName, dir)
    .then(res => {
      console.log(`${repoName} Completo`);
    })
    .catch(e => console.log(e))

});

