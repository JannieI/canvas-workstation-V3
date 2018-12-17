export const environment = {
  production: true,


	// Valid Servers (NB: Json-Server hard coded in TypeScript for now ...)
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
			serverName: "Eazl Server",
			serverHostURI: "https://eazl-rest.xyz/eazl/api/"
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
	ENVCanvasDatabaseLocalUrlS5: "http://localhost:3006"

};
