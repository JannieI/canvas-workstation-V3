// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  	production: false,

	// Valid Servers (NB: Json-Server, etc hard coded in TypeScript for now ...)
	ENVCanvasServerList: [
		{
			serverName: "Canvas Server Local",
			serverHostURI: "http://localhost:8000"
	  	},
		{
			serverName: "Canvas Server Cloud",
			serverHostURI: "http://localhost:8000"
	  	},
		{
			serverName: "Json-Server",
			serverHostURI: "http://localhost:3000"
		}

	],

	// Default Startup CanvasServer
	ENVStartupCanvasServerName: "Canvas Server Local",

	// JSON-SERVER Urls (NB: Hard coded for now ...)
	ENVCanvasDatabaseLocalUrlS1: "http://localhost:3001",
	ENVCanvasDatabaseLocalUrlS2: "http://localhost:3000",
	ENVCanvasDatabaseLocalUrlS3: "http://localhost:3002",
	ENVCanvasDatabaseLocalUrlS4: "http://localhost:3005",
	ENVCanvasDatabaseLocalUrlS5: "http://localhost:3006",

	// Address of Web Socket Server
	ENVCanvasWebSocketServerUrl: "https://localhost:3000"
};
