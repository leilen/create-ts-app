### Quick Overview

```
npm install -g create-ts-cli;
create-ts-cli;
Enter project name [app] : test-cli-app
cd test-cli-app;
npm install;
npm start;
```

### Demo
![Demo gif for create-ts-cli](https://likealocal-dev.s3.ap-northeast-2.amazonaws.com/create-react-cli.gif)

### Get Started Immediately
You  **don’t**  need to install or configure tools like Webpack or ts-node.  
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.

### Commands
`npm start` - Execute your app without build
`npm run build` - Build your app to dist directory
`npm run pro` - Execute your app from dist directory
 `npm run clean` - Clean dist directory

### Project
```
test-cli-app
├── README.md
├── node_modules
├── tsconfig.json
├── webpack.config.js
├── package.json
├── .gitignore
├── src                      <--- working directory
│   └── app.ts
└── dist                     <--- files after build
    └── app.js
```

## License
Create React App is open source software [licensed as MIT](https://github.com/facebook/create-react-app/blob/master/LICENSE).