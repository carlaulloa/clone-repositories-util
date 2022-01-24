const path = require('path');
const child_process = require('child_process');

let getExtension = (pathFileName) => {
  return path.extname(pathFileName).replace('.', '');
}

let setGlobalTooLongPath = () => {
  child_process.execSync('git config --global core.longpaths true', { stdio: 'inherit' });
}

let setUsername = (displayName) => {
  return `git config user.name "${displayName}"`;
}

let setEmail = (email) => {
  return `git config user.email "${email}"`;
}

let getCloneCommand = (url, repoName) => {
  return `git clone ${url} ${repoName}`;
}

let getSetUrlOriginCommand = (url) => {
  return `git remote set-url origin ${url}`;
}

let execSyncCommand = (command) => {
  if(command !== null && command !== undefined){
    child_process.execSync(command.trim(), { stdio: 'inherit' });
  }
}

let execClone = (url, repoName, dir) => {
  return new Promise((resolve, reject) => {
    process.chdir(dir);
    let coomand = getCloneCommand(url, repoName);
    try {
      child_process.execSync(coomand, { stdio: 'inherit' });
      let full = path.join(dir, repoName);
      process.chdir(full);
      child_process.execSync(setUsername(displayName), { stdio: 'inherit' });
      child_process.execSync(setEmail(email), { stdio: 'inherit' });
      console.log(`${repoName} Config completa`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getExtension,
  setGlobalTooLongPath,
  setUsername,
  setEmail,
  getCloneCommand,
  execSyncCommand,
  execClone,
  getSetUrlOriginCommand
}