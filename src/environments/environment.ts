// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  
  ENVCanvasEazlServerUrl: "https://eazl-rest.xyz/eazl/api/",
  ENVCanvasDatabaseUseLocal: true,
  ENVCanvasDatabaseServerUrl: "canvasServer",
  ENVCanvasDatabaseLocalUrlS1: "http://localhost:3001/",
  ENVCanvasDatabaseLocalUrlS2: "http://localhost:3000/",
  ENVCanvasDatabaseLocalUrlS3: "http://localhost:3002/",
  ENVCanvasDatabaseLocalUrlS4: "http://localhost:3005/",
  ENVCanvasDatabaseLocalUrlS5: "http://localhost:3006/"
};
