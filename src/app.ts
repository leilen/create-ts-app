import * as fs from 'fs'
import * as readline from 'readline';

const executedPath = process.cwd();
let projectName = null;

function returnFileNameArr(): { name: string, type: number, content?: string }[] {
  return [
    {
      name: 'package.json',
      type: 0,
      content: `{
        "name": "${projectName}",
        "version": "1.0.0",
        "description": "",
        "main": "dist/app.js",
        "scripts": {
          "build": "webpack -p --mode=production",
          "pro": "node dist/app.js",
          "start": "ts-node src/app.ts",
          "clean": "rm -rf ./dist/* && touch ./dist/.keep"
        },
        "author": "",
        "license": "ISC",
        "devDependencies": {
          "@types/node": "^12.7.8",
          "ts-node": "^8.5.0",
          "webpack-cli": "^3.3.9"
        },
        "dependencies": {
          "ts-loader": "^6.2.1",
          "typescript": "^3.7.2",
          "webpack": "^4.41.0",
          "webpack-node-externals": "^1.7.2"
        }
      }`
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
      content: `console.log('hello create-ts-app.')`
    },
    {
      name: 'tsconfig.json',
      type: 0,
      content: `{
        "compilerOptions": {
            "moduleResolution": "node",
            "typeRoots": [
                "node_modules/@types"
            ],
            "resolveJsonModule": true
        },
        "files" : ["./src/app.ts"],
        "exclude": [
            "node_modules",
            "dist"
        ]
    }`
    },
    {
      name: 'webpack.config.js',
      type: 0,
      content: `// webpack.config.js
  
      const webpack = require('webpack');
      const path = require('path');
      const nodeExternals = require('webpack-node-externals')
      
      module.exports = (env, options) => {
        let config = {
          entry: './src/app.ts',
          output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'app.js'
          },
          target: 'node',
          node: {
            __dirname: false,   // if you don't put this is, __dirname
            __filename: false,  // and __filename return blank or /
          },
          externals: [
            nodeExternals()
          ],
          resolve: {
            extensions: [".ts"]
          },
          module: {
            rules: [
            {
              test: /\.ts$/,
              use: ['ts-loader']
            }
            ]
          }
        }
        return config;
      }`
    },
    {
      name: '.gitignore',
      type: 0,
      content: `node_modules
package-lock.json
dist/*
package-lock.json
!/**/.keep`
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
    fs.writeFile(path, content ? content : '', (err) => {
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
        await createFile(`${executedPath}/${projectName}/${v.name}`, v.content);
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