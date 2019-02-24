# Installation Guide for Canvas-Workstation

# 0. Upgrades done on JI PC:
2018-05-11 npm update --save clarity-icons


Note: make sure to have the latest version of Angular-CLI installed
# 1. Clone from Git

    1. Clone the app:
    Use your Projects folder (create a new one with mkdir if necessary.  On Linux, all names
    are case sensitive).  The following will create a folder under Projects called canvas-workstation.  The typescript code is installed in the src/app folder inside it.  Run:

        `Run git clone https://github.com/JannieI/canvas-workstation.git`

    Change to that folder with
        `cd canvas-workstation`


    2. Ensure node is installed, and at the correct version:
    Make sure you have node.js installed version 5 or higher.  Determine the version with
        `node -v`

    If needed, install the new version (Ubutu):
        `sudo apt-get update`
        `sudo apt-get install nodejs`

        I found this article that may help with Windows:
        http://blog.teamtreehouse.com/install-node-js-npm-windows


    3. Ensure npm is installed, and at the correct version:
    Make sure you have NPM installed version 3 or higher.  Determine the version with
        `npm -v`

    If needed, install the new version (sudo provides Admin user rights on Ubutu, and installs
    the package globally.  If left out, it installs in the node_modules sub-folder):
        `sudo apt-get install npm`


    4. Windows extra:
    On WINDOWS ONLY install global dependencies:
        `npm install -g webpack webpack-dev-server typescript`


    5. Install dependencies:
    When you clone the folder above, it contains a file called package.json.  This specifies
    the dependant software and their versions to npm.  Run
        `npm install`


    6. Install Vega-Lite:
        Vega-Lite is a concise declaritive graphics language.
        `npm install vega-lite`

    7. Install datalib:
        Datalib works with Vega to product data transformations like summary statistics.
        `npm install datalib`


    8. Start up the dev server (I believe it uses Express), but first make sure you are in the canvas-workstation folder:
        `ng serve` (I have also used  `run npm start`)


    9. View the app in the browser:
        Open browser to http://localhost:4200 (if npm is used to start, this may be port 3000)



# 2. Fresh installation

    ## Install Clarity

        ### Install Clarity with a Clarity Seed Project (Recommended)
        (see https://vmware.github.io/clarity/get-started)

        For a new project, the best approach is to clone the Clarity seed project and modify it to fit your needs. The seed project is integrated with clarity-ui and clarity-angular, so you don’t need to install Clarity separately.  Make sure that the UI and icons are installed

        Clone from Git:
        `git clone https://github.com/vmware/clarity-seed.git`

        Install the dependencies:
        `npm install`

        Run the seed app:
        `npm start`

    ## Install Vega-Lite
        Vega-Lite is a concise declaritive graphics language.
        `npm install vega-lite --save`

    ## Install datalib
        Datalib works with Vega to product data transformations like summary statistics.

        `npm install datalib --save`

    ## Install datalib typing
        Clone Clarity Analytics Git repo **typings** in node_modules/@types (the .ts file must be in a subfolder called *datalib* )
        Note: ensure that tsconfig.json points to this folder:
            ...
            "typeRoots": [
                "node_modules/@types"
            ],
            ...

    ## Install Parse - needed ?
        Locally
        $ npm install -g parse-server mongodb-runner
        $ mongodb-runner start
        $ parse-server --appId APPLICATION_ID --masterKey MASTER_KEY --databaseURI mongodb://localhost/test
        Note: If installation with -g fails due to permission problems (npm ERR! code 'EACCES'), please refer to this link.

    ## DONT Install nanoSQL
        npm install nano-sql --save
        NB: this is being replaced with Dexie ...
        UnInstalled 2019-01-04


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


    ## Install sockects.io
    npm install socket.io-client
    npm install @types/socket.io-client


# 3. Upgrade from ng5 -> ng6 (2018-08-21)

    Follow this doc CAREFULLY:
    https://loiane.com/2018/05/upgrading-to-angular-v6/


        Upgraded node to v8+: - see https://www.hostingadvice.com/how-to/update-node-js-latest-version/

        1. Did (v7 -> 10) with:
            sudo npm cache clean -f
            sudo npm install -g n
            sudo n stable

        This was bad - rather get the latest LTS version.  So, had to:
            sudo npm cache clean -f
            sudo npm install -g n
            sudo n 8.11.4
            See: https://www.abeautifulsite.net/how-to-upgrade-or-downgrade-nodejs-using-npm

        ISSUE: Node v10 is not supported by SQLITE !

        Run ng upgrade -d to see that all is good.
        Used ncu to see what is out of date, and then ncu -u to update them.

        Deleted Node_Modules folder, and ran npm i.

        Isses:
        1. SQLITE3 did not work with Node v10 - downgraded Node and all was good
        2. TS was wrong version - struggled quite a bit with it.  Delete packages-lock.json, install right version and uninstall incorrect version.  Remember to consider local vs global packages, and also packages.json.
        3. Lots of issues with Clarity.  Eventually read the docs, and it was easy.  They changed the npm instruction, node_modules folder, etc.
        4. At some stage, reinstalled some packages (not sure if it was needed):
        Re-Installed Vega: `npm install vega-lite --save`
        Re-Installed Vega-Lite: `npm install vega-lite --save`
        Re-Installed datalib (typings live in https://github.com/Clarity-Analytics/typings):
            `npm install datalib --save`

            ## Install datalib typing
            Clone Clarity Analytics Git repo **typings** in node_modules/@types (the .ts file must be in a subfolder called *datalib* )
            Note: ensure that tsconfig.json points to this folder:
                ...
                "typeRoots": [
                    "node_modules/@types"
                ],
                ...
        Re-Install nanoSQL: `npm install nano-sql --save`


    ## Dexie
        http://dexie.org/docs/Typescript

    ## agGrid
        https://www.ag-grid.com/angular-getting-started/


    Issue with datalib, as types were not found:
        Had to keep these lines in tsconfig.json:
        ...
        "typeRoots": [
            "node_modules/@types"
        ]
        ...

    File-Saver
        npm install file-saver --save
        npm install @types/file-saver --save-dev

    Excel files:
        npm install xlsx

    Issue with auto file change detection:
        Consider that, when having large number of files, there is a Limit at INotify Watches on Linux. So increasing the watches limit to 512K for example can solve this.

        sudo sysctl fs.inotify.max_user_watches=524288
        sudo sysctl -p --system

# 4. Upgrade / clean packages 2019-02-24
    npm install datalib (gave an error)
    npm upgrade 5.10.10 -> 6.8.0
    sudo npm uninstall bootstrap
    sudo ng update @angular/core @angular/cli
        @angular/compiler-cli@7.2.6
    sudo ng update @clr/angular
        Clarity 1.1.0

    sudo ng update --all
      @angular/cli                6.1.4 -> 7.3.3           ng update @angular/cli
      @angular/core               6.1.3 -> 7.2.6           ng update @angular/core
      @clr/angular                0.12.9 -> 1.1.0          ng update @clr/angular
      rxjs                        6.2.2 -> 6.4.0           ng update rxjs
    
    Angular wants TS version  >=3.1.1 and <3.3.0:
    sudo npm uninstall typescript
    sudo npm uninstall typescript -g
    sudo npm install typescript@3.2.4 -g
    sudo npm install typescript@3.2.4

    Minor changes (2 Clarity breaking changes) -> Commit to Git

---------------------- 2019-02-24 1 ----------------------






ag-grid-angular                  😎  MAJOR UP  Major update available. https://angular-grid.ag-grid.com
                                              npm install --save ag-grid-angular@20.1.0 to go from 18.1.0 to 20.1.0

core-js                          😍  UPDATE!   Your local install is out of date. https://github.com/zloirock/core-js#readme
                                              npm install --save core-js@2.6.5 to go from 2.5.7 to 2.6.5

datalib                          😕  NOTUSED?  Still using datalib?

file-saver                       😍  UPDATE!   Your local install is out of date. https://github.com/eligrey/FileSaver.js#readme
                                              npm install --save file-saver@2.0.1 to go from 2.0.0-rc.4 to 2.0.1

mutationobserver-shim            😍  UPDATE!   Your local install is out of date. https://github.com/megawac/MutationObserver.js
                                              npm install --save mutationobserver-shim@0.3.3 to go from 0.3.2 to 0.3.3
                                 😕  NOTUSED?  Still using mutationobserver-shim?
                                              Depcheck did not find code similar to require('mutationobserver-shim') or import from 'mutationobserver-shim'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save mutationobserver-shim

sqlite3                          😍  UPDATE!   Your local install is out of date. http://github.com/mapbox/node-sqlite3
                                              npm install --save sqlite3@4.0.6 to go from 4.0.2 to 4.0.6
                                 😕  NOTUSED?  Still using sqlite3?
                                              Depcheck did not find code similar to require('sqlite3') or import from 'sqlite3'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save sqlite3

ts-helpers                       😕  NOTUSED?  Still using ts-helpers?
                                              Depcheck did not find code similar to require('ts-helpers') or import from 'ts-helpers'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save ts-helpers

tslib                            😕  NOTUSED?  Still using tslib?
                                              Depcheck did not find code similar to require('tslib') or import from 'tslib'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save tslib

vega                             😍  UPDATE!   Your local install is out of date. https://github.com/vega/vega
                                              npm install --save vega@4.4.0 to go from 4.2.0 to 4.4.0

vega-tooltip                     😎  NEW VER!  NonSemver update available. https://github.com/vega/vega-tooltip#readme
                                              npm install --save vega-tooltip@0.16.0 to go from 0.13.0 to 0.16.0
                                 😕  NOTUSED?  Still using vega-tooltip?
                                              Depcheck did not find code similar to require('vega-tooltip') or import from 'vega-tooltip'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save vega-tooltip

web-animations-js                😕  NOTUSED?  Still using web-animations-js?
                                              Depcheck did not find code similar to require('web-animations-js') or import from 'web-animations-js'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save web-animations-js

xlsx                             😍  UPDATE!   Your local install is out of date. http://sheetjs.com/opensource
                                              npm install --save xlsx@0.14.1 to go from 0.14.0 to 0.14.1

@types/core-js                   😕  NOTUSED?  Still using @types/core-js?
                                              Depcheck did not find code similar to require('@types/core-js') or import from '@types/core-js'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev @types/core-js

@types/file-saver                😕  NOTUSED?  Still using @types/file-saver?
                                              Depcheck did not find code similar to require('@types/file-saver') or import from '@types/file-saver'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev @types/file-saver

@types/jasmine                   😎  MAJOR UP  Major update available. https://github.com/DefinitelyTyped/DefinitelyTyped
                                              npm install --save-dev @types/jasmine@3.3.9 to go from 2.8.8 to 3.3.9
                                 😕  NOTUSED?  Still using @types/jasmine?
                                              Depcheck did not find code similar to require('@types/jasmine') or import from '@types/jasmine'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev @types/jasmine

@types/jasminewd2                😍  UPDATE!   Your local install is out of date. https://github.com/DefinitelyTyped/DefinitelyTyped
                                              npm install --save-dev @types/jasminewd2@2.0.6 to go from 2.0.3 to 2.0.6
                                 😕  NOTUSED?  Still using @types/jasminewd2?
                                              Depcheck did not find code similar to require('@types/jasminewd2') or import from '@types/jasminewd2'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev @types/jasminewd2

@types/node                      😎  MAJOR UP  Major update available. https://github.com/DefinitelyTyped/DefinitelyTyped
                                              npm install --save-dev @types/node@11.9.5 to go from 10.7.1 to 11.9.5
                                 😕  NOTUSED?  Still using @types/node?
                                              Depcheck did not find code similar to require('@types/node') or import from '@types/node'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev @types/node

codelyzer                        😎  MINOR UP  Minor update available. https://github.com/mgechev/codelyzer#readme
                                              npm install --save-dev codelyzer@4.5.0 to go from 4.4.4 to 4.5.0
                                 😕  NOTUSED?  Still using codelyzer?
                                              Depcheck did not find code similar to require('codelyzer') or import from 'codelyzer'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev codelyzer

enhanced-resolve                 😕  NOTUSED?  Still using enhanced-resolve?
                                              Depcheck did not find code similar to require('enhanced-resolve') or import from 'enhanced-resolve'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev enhanced-resolve

jasmine-core                     😎  MINOR UP  Minor update available. https://jasmine.github.io
                                              npm install --save-dev jasmine-core@3.3.0 to go from 3.2.1 to 3.3.0

karma                            😎  MAJOR UP  Major update available. http://karma-runner.github.io/
                                              npm install --save-dev karma@4.0.0 to go from 3.0.0 to 4.0.0

karma-cli                        😎  MAJOR UP  Major update available. http://karma-runner.github.io/
                                              npm install --save-dev karma-cli@2.0.0 to go from 1.0.1 to 2.0.0

karma-jasmine                    😎  MAJOR UP  Major update available. https://github.com/karma-runner/karma-jasmine#readme
                                              npm install --save-dev karma-jasmine@2.0.1 to go from 1.1.2 to 2.0.1

protractor                       😍  UPDATE!   Your local install is out of date. https://github.com/angular/protractor
                                              npm install --save-dev protractor@5.4.2 to go from 5.4.0 to 5.4.2

ts-node                          😎  MAJOR UP  Major update available. https://github.com/TypeStrong/ts-node
                                              npm install --save-dev ts-node@8.0.2 to go from 7.0.1 to 8.0.2

tslint                           😍  UPDATE!   Your local install is out of date. https://palantir.github.io/tslint
                                              npm install --save-dev tslint@5.13.0 to go from 5.11.0 to 5.13.0

typings                          😕  NOTUSED?  Still using typings?
                                              Depcheck did not find code similar to require('typings') or import from 'typings'.
                                              Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.
                                              Use --skip-unused to skip this check.
                                              To remove this package: npm uninstall --save-dev typings

webdriver-manager                😍  UPDATE!   Your local install is out of date. https://github.com/angular/webdriver-manager#readme
                                              npm install --save-dev webdriver-manager@12.1.1 to go from 12.1.0 to 12.1.1
