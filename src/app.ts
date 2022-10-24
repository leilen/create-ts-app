import * as fs from 'fs'
import * as readline from 'readline';
import {path as rootPath} from 'app-root-path';

const executedPath = process.cwd();
let projectName = null;

function returnFileNameArr(): { name: string, type: number, content?: string, replace?: Record<string, string> }[] {
  return [
    {
      name: 'package.json',
      type: 0,
      replace: {projectName},
    },
    {
      name: 'dist',
      type: 1
    },
    {
      name: 'dist/.keep',
      type: 0
    },
    {
      name: 'src',
      type: 1
    },
    {
      name: 'src/app.ts',
      type: 0,
    },
    {
      name: 'tsconfig.json',
      type: 0,
    },
    {
      name: 'webpack.config.js',
      type: 0,
    },
    {
      name: '.gitignore',
      type: 0,
    }
  ];
}

function isFileExist(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.stat(path, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true);
      }
    })
  });
}

async function checkIsNodeProject(): Promise<boolean> {
  for (let v of returnFileNameArr()) {
    if (await isFileExist(`${executedPath}/${v.name}`)) {
      return true;
    }
  }
  return false;
}
function mkdir(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}
function createFile(path: string, content?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const readString = fs.readFileSync(`${rootPath}/templates/${path}`,{encoding: 'utf8'})
    fs.writeFile(`${executedPath}/${projectName}/${path}`, readString ? readString : '', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}
async function createTsFiles() {
  try {
    for (let v of returnFileNameArr()) {
      if (v.type == 0) {
        await createFile(v.name, v.content);
      } else {
        await mkdir(`${executedPath}/${projectName}/${v.name}`);
      }
    }
  } catch (e) {
    throw e;
  }
}
function getProjectInfo(): Promise<void> {
  return new Promise((resolve) => {
    const readInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    readInterface.question('Enter project name [app] : ', (text) => {
      const trimmed = text.trim();
      projectName = trimmed ? text.trim() : null;
      readInterface.close();
      resolve();
    })
  })
}

async function main() {

  await getProjectInfo();
  
  if(!projectName){
    console.log('Must enter project name!!');
    return;
  }
  const projectNameRegexp = new RegExp('^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$');
  if(!projectNameRegexp.test(projectName)){
    console.log('Wrong project name!!');
    return;
  }
  let isProjectExists = await isFileExist(`${executedPath}/${projectName}`)
  if(isProjectExists){
    console.log('Already exist project name!!');
    return;
  }
  try{
    await mkdir(`${executedPath}/${projectName}`);
  }catch(e){
    console.log(e);
    return;
  }
  try {
    await createTsFiles();
  } catch (e) {
    console.log(e);
    return;
  }
  console.log('Succeed.');
}

main();
