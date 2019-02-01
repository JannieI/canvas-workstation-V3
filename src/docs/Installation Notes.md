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
