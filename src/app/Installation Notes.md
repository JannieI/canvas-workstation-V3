# Installation Guide


## Install Clarity

### Install Clarity with a Clarity Seed Project (Recommended)
(see https://vmware.github.io/clarity/get-started)

For a new project, the best approach is to clone the Clarity seed project and modify it to fit your needs. The seed project is integrated with clarity-ui and clarity-angular, so you don’t need to install Clarity separately.

Clone from Git:
`git clone https://github.com/vmware/clarity-seed.git`

Install the dependencies:
`npm install`

Run the seed app:
`npm start`

## Install Vega-Lite
Vega-Lite is a concise declaritive graphics language.
`npm install vega-lite`

## Install datalib
Datalib works with Vega to product data transformations like summary statistics.

`npm install datalib`

## Install datalib typing
Clone Clarity Analytics Git repo **typings** in node_modules/@types (the .ts file must be in a subfolder called *datalib* )
Note: ensure that tsconfig.json points to this folder:
    ...
    "typeRoots": [
        "node_modules/@types"
    ],
    ...


## Changes
1. Change the style sheets to .css (no scss)
2. Copy the favicon.ico and look at index.html:
    ...
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    ...
3. Amend app.component.html to show the Clarity Analytics logo.  Consider the size to make it fit nicely:
`  ...
      <a href="#" class="nav-link">
        <span class="clr-icon">
          <img src="../favicon.ico" height="42" width="42">
        </span>
        <span class="title">Clarity</span>
      </a>`
4. Amend stuffies like project name, etc.

## Sample files

###Package.json
`
{
  "name": "clarity-seed",
  "version": "0.10.0",
  "description": "Angular-CLI starter for a Clarity project",
  "angular-cli": {},
  "scripts": {
    "start": "ng serve",
    "lint": "tslint \"src/**/*.ts\"",
    "test": "ng test --single-run",
    "pree2e": "webdriver-manager update",
    "e2e": "protractor protractor.config.js"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^4.3.0",
    "@angular/common": "^4.3.0",
    "@angular/compiler": "^4.3.0",
    "@angular/core": "^4.3.0",
    "@angular/forms": "^4.3.0",
    "@angular/http": "^4.3.0",
    "@angular/platform-browser": "^4.3.0",
    "@angular/platform-browser-dynamic": "^4.3.0",
    "@angular/router": "^4.3.0",
    "@webcomponents/custom-elements": "1.0.0",
    "clarity-angular": "~0.10.10",
    "clarity-icons": "~0.10.10",
    "clarity-ui": "~0.10.10",
    "core-js": "^2.4.1",
    "mutationobserver-shim": "^0.3.2",
    "rxjs": "^5.4.3",
    "ts-helpers": "^1.1.1",
    "web-animations-js": "^2.3.1",
    "zone.js": "^0.8.16"
  },
  "devDependencies": {
    "@angular/cli": "^1.2.1",
    "@angular/compiler-cli": "^4.3.0",
    "@types/core-js": "~0.9.42",
    "@types/jasmine": "^2.5.53",
    "@types/jasminewd2": "^2.0.2",
    "@types/node": "^8.0.24",
    "bootstrap": "4.0.0-alpha.5",
    "codelyzer": "~3.1.2",
    "enhanced-resolve": "~3.4.1",
    "jasmine-core": "~2.6.2",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~1.7.0",
    "karma-chrome-launcher": "^2.2.0",
    "karma-cli": "^1.0.1",
    "karma-jasmine": "^1.0.2",
    "karma-mocha-reporter": "~2.2.1",
    "karma-remap-istanbul": "~0.6.0",
    "protractor": "~5.1.2",
    "ts-node": "^3.0.4",
    "tslint": "^5.3.2",
    "typescript": "~2.3.3",
    "typings": "^1.4.0",
    "webdriver-manager": "^12.0.6"
  }
}
`

### Angular-cli.json
`
{
    "project": {
        "version": "1.0.0-beta.20-4",
        "name": "clarity-seed"
    },
    "apps": [
        {
            "root": "src",
            "outDir": "dist",
            "assets": [
                "images",
                "favicon.ico"
            ],
            "index": "index.html",
            "main": "main.ts",
            "test": "test.ts",
            "tsconfig": "tsconfig.json",
            "prefix": "app",
            "mobile": false,
            "styles": [
                "../node_modules/clarity-icons/clarity-icons.min.css",
                "../node_modules/clarity-ui/clarity-ui.min.css",
                "styles.css"
            ],
            "scripts": [
                "../node_modules/core-js/client/shim.min.js",
                "../node_modules/mutationobserver-shim/dist/mutationobserver.min.js",
                "../node_modules/@webcomponents/custom-elements/custom-elements.min.js",
                "../node_modules/clarity-icons/clarity-icons.min.js",
                "../node_modules/web-animations-js/web-animations.min.js"
            ],
            "environmentSource": "environments/environment.ts",
            "environments": {
                "dev": "environments/environment.ts",
                "prod": "environments/environment.prod.ts"
            }
        }
    ],
    "addons": [],
    "packages": [],
    "e2e": {
        "protractor": {
            "config": "./protractor.config.js"
        }
    },
    "test": {
        "karma": {
            "config": "./karma.conf.js"
        }
    },
    "defaults": {
        "styleExt": "scss",
        "prefixInterfaces": false,
        "inline": {
            "style": false,
            "template": false
        },
        "spec": {
            "class": false,
            "component": true,
            "directive": true,
            "module": false,
            "pipe": true,
            "service": true
        }
    }
}
`

## 
