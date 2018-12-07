// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

// The Eazl/Canvas server indicates where Canvas will get data from.  Each of these
// has ENV parameters to indicate where their data is, etc
export const environment = {
  	production: false,
  
	// Valid Servers
	ENVCanvasServerList: [ 
		{
			serverName: 'Canvas Local',
			serverHostURI: "http://localhost:8000"
	  	},
		{
			serverName: Canvas Server', 
			serverHostURI: "http://localhost:8000"
	  	},
		{
			serverName: 'Eazl',
			serverHostURI: : "https://eazl-rest.xyz/eazl/api/"
	  	}
	]

	// Eazl Server
	ENVCanvasEazlServerUrl: "https://eazl-rest.xyz/eazl/api/",

	// Canvas Server Cloud
	ENVCanvasServerCloudUrl: "http://localhost:8000",

	// Canvas Server Local
	ENVCanvasServerLocalUrl: "http://localhost:8000",

	// JSON-SERVER Urls
	ENVCanvasDatabaseLocalUrlS1: "http://localhost:3001",
	ENVCanvasDatabaseLocalUrlS2: "http://localhost:3000",
	ENVCanvasDatabaseLocalUrlS3: "http://localhost:3002",
	ENVCanvasDatabaseLocalUrlS4: "http://localhost:3005",
	ENVCanvasDatabaseLocalUrlS5: "http://localhost:3006"
};
