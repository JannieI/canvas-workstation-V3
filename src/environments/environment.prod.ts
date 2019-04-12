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
			serverName: "Json-Server",
			serverHostURI: "http://localhost:3000"
		}

	],

	// Default Startup CanvasServer
	ENVStartupCanvasServerName: "Canvas Server Local",

};
