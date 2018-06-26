# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)

**UI / ideas**
    Tooltips:
    ---------
    Add Tooltips to all - decide if CSS title is okay, as it looks different to Clarity tooltip   for icons - See where and how to use tooltips on buttons (ie HTML title="" or via Clarity).  Be   consistent!!

    Outstanding:
    ------------
    - Usage Stats form
    - Data Qual form



     Overall design and layout
    --------------------------
    - GO BACK TO SIMPLICITY !!!  Review regular on how to make it easier and faster.  If like SPSS where everything sits behinds a menu item, then too difficult.  Simplify (Ivan)
    - Review whether as beautiful as Simplus
    - Relook at ALL forms for consistent layout, look and feel, INcluding the popups like the W     title
    - Add 'X' top left on all, so that it can close if screen is too small and the save button  overflow beyond the screen
    - Keep Help Message on top of forms uniform - always look and feel the same.  Also, make sure   there is a preference to switch it back on manually.
    Standard unit of measure: maybe save all as rem, and user can select px, rem, etc?
    - Use style.css for standard items, ie class="helpMessage"
    - Standardize date format shown - as selected by the user, stored as settings
    -Accelator keys: accesskey="h".  Make consistent approach for all, taking into account that browser has own set.  Try to make it dynamic, ie use can define it!
    - Consider Zoom - can use scale(0.6) from CSS, but then need to properly understand layout of main page.  Also, Google, etc already has a zoom, so what's the point.  Remove from menu if not needed
    - everything must be accessable IN 3 CLICKS
    - every form must load in LESS THAN 3 SECS
    - Google Sheets says 'All changes saved' after each change.  Should we do the same, ie after each resize or drag-n-drop?
    - verify that we cater for casual to sophisticated user
    - go through system and make sure things are done consistently
    - make all drag-n-drop and similar to Microsoft interface.
    - test: a new user must be able to build a D in 5 minutes, and a person must be ready with max 1hr training session.  Remember, no one reads the manual!  Final test, give it to highschool kids!!
    - go through Liz doc on Driv (GDG) on design principles and review all forms


    JSON-Server Timeout:
    --------------------
    - if BULK DELETE in quick succesion, gets http error: ERR_CONNECTION_REFUSED.  Assume it is because json-server gets flooded, but this has to be tested with real server.


    - consider if we need SAVE AS functionality

    Create DS via File:
    -------------------
    - consider multiple files, in which case to loop over files Array
    - consider drag and drop from external places - see example in 
        https://www.html5rocks.com/en/tutorials/file/dndfiles/

    PDF / IMAGE:
    ------------
    - can save Dashboard as pdf - see https://github.com/MrRio/jsPDF.
    Rather: https://stackoverflow.com/questions/38996376/generate-pdf-file-from-html-using-angular2-typescript,  or  https://stackoverflow.com/questions/42900319/how-to-convert-html-to-pdf-in-angular2  or  https://www.npmjs.com/package/jspdf
    - can send as Email Attachment (in pdf or pic). To do this via Gmail, use its API - see https://www.sitepoint.com/sending-emails-gmail-javascript-api/
    - can copy whole D as image - can paste somewhere, or print and put on wall
    - view pdf docs insides forms: see https://www.npmjs.com/package/ng2-pdf-viewer
    - make sure we can have hybrid DS - cloud and local and server in one D
    - view Thumbnails of all T - can selected ala PowerPoint
    - Have popup thumbnails of D on Landing page
    - Use thumbnails to select a W from another D - have thumbnails are on/off option for performance perhaps

    https://stackoverflow.com/questions/35138424/how-do-i-download-a-file-with-angular2
    To download and show PDF files, a very similar code snipped is like below:
        private downloadFile(data: Response): void {
            let blob = new Blob([data.blob()], { type: "application/pdf" });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
        }

        public showFile(fileEndpointPath: string): void {
            let reqOpt: RequestOptions = this.getAcmOptions();  //  getAcmOptions is our helper method. Change this line according to request headers you need.
            reqOpt.responseType = ResponseContentType.Blob;
            this.http
            .get(fileEndpointPath, reqOpt)
            .subscribe(
                data => this.downloadFile(data),
                error => alert("Error downloading file!"),
                () => console.log("OK!")
            );
        }


    Testing:
    --------
    - test everything with 1000 - ie Dashboards, Widgets per D, etc - to check performance and to see it form layout (ie grids sizes) will copy with large volume
    - Test on different configs: screen resolution, 2 screens
    - Test on different devices, ie Tablet and Phone
    Multi-T display: show nr of Tabs where a W is displayed in header as a badge

    Printing:
    -------------
    - allow different print layouts and formats, for example one
       Widget per page, Dashboard layout, all Dashboards (linked) or just the current one.


    Admin module and Users
    ----------------------
    - Users, groups, permissions: add DS permissions, Private Dashboards?, Public Dashboards?, etc to form 'My Permissions'
    - Where does UI sit - in Dashboard or separate.  Consider Standalone vs Network
    - Global var with userLoggedIn
    - What and how is cached locally - and how refreshed?  Ie BackgroundColours should be stored locally and only updated if and when needed.
    - Finalise group membership / roles
    - Add UserID to ALL data and code -> where needed ...
    - It must be impossible to lock out all users - admin keeps access and at least one is kept.  Also, if a W is locked and the owner on leave, someone must be able to unlock it.


    Refactoring / tech debt / necessary improvements:
    -------------------------------------------------
    - review and check: isable IN 3 CLICKSt should NEVER be allowed to edit the DB itself - there must be a UI function for changsable IN 3 CLICKSing things.  And always by the users, with rights if necessary.
    - Consider array.splisable IN 3 CLICKSce() instead of current deep copy - is more TS-like ...  Review ALL deep    copies - try sable IN 3 CLICKSJSONify or source.map(Object) - remember that Sl Object. did not deep copy!!sable IN 3 CLICKS
    - Add RouteGuard on 'sable IN 3 CLICKSClarity Analytics', before going to web site ...
    BUG/ISSUE: multi-tab Slicers and Ws only refresh on the first one - when are the others done?  To do them while hidden makes no sence - should we have a dirty flag, and filterSlicer on tab change??
    - ContainerFontSize - consider dropping it, and have a font size for Title, Shape-Text, etc.      Else it gets confusing ...
    - Consider not increasing stuckCount in App if an item is selected/deselected. This does mean   to pass event back from slicer.single component.
    On Duplicate of W: make sure Comments, Links, etc is also duplicated in DB (or not??)
    Expand: add Refresh button, for when change nr lines to show.  Also, 100 -> 1000
     + Dont show top if no Dataset - rather appropriate Unexpected Error msg
    Resize does not snap sable IN 3 CLICKSto grid - is this philosophy correct?  If it does snap, remember to change the graphW & -H as well
    - FIX nrDataQualityIssues at DB level: join and fill the value, so that Canvas dont need to do any manipulation
    


    Tributary:
    ----------
    - Read more - see Pentaho ETL / Data Integration for features.
    - Combinations must also be done here
    - Add token management forms: forgot password, refresh token ...



    Different versions of Vega:
    ---------------------------
    - keep version on W in DB
    - Upgrade Util: converts W to new version, creates new record and keeps old one as IsTrashed=True.  Thus, can always see what it looked like before.  More thinking required here.
    - see DRF guidelines about the steps to do
    - a version of Canvas will only work with a specified version(s) of W - inside code.  This way, can load any version of Canvas and it will work provided the W version is in acceptable range - hardcoded in TS.  The version is set per W, thus can have different versions of Graphs (Vega), Sl, etc.
    API: Have flexible field selection: ie ..."fields": [A, B, F]
    Setting min Grid width - wait for Clarity Bug fix

    - Need way to browse large volumes of data without killing browser - server must calc and warn user, plus also do pagination in the background. Also, data manipulation must be pushed onto the server as far as possible.
    Warning:
    - when a W is rendered and some fields dont exist, error occured, display a warning image +     message inside W.  User can edit this, fix the fields and save
    - before saving a W, Canvas checks that the fields are valid, that it renders, etc and warns if not (but allows to save) - how does this fit in with auto-save policy?

    Local DB:
    ---------
    - how to add a table without deleting the IndexDB manually ??
    Caching:
    - option to switch caching on or not at the server level and local level (if server allows it)
    - stores all currentD info, users, etc
    - refreshed via WS from DB
    - also used for auto-save: all the steps are saved here, and synced to server at specified  interval (setting on client)

    Should we de-select all Ws when we change Tabs, or load a new D?  If not, may be confusing but handy.  If do, where do we do it - GlobVar functions, or in App component (and update Globals back, which does not make sense)


    Data:
    -----
    1. Make sure terminology is consitent: Datasource -> Transform -> Dataset
    4. I used FieldNames (string) in ie Pivot - is that okay?
    5. Design (technically) how Datasets, pivotRow, pivotCol, pivotResult, pivotAgg, Fields,    FieldsMetaData, Combinations, CombinationDetails will work, given that these can change over   time, has to be fast enough (cannot all live in memory) and has to integrate with Vega ...
    6. Check Definition of DS = source, location, authentication, F, Tr, Pv etc.  Dataset is just   the data, with an ID / url to find it.
    8. When removing a Dataset, it validates that not used in a Widget, Shape or Combination. If so,     then cannot be removed.  If removed, all resultsets stored for it must be removed as well, or  not?
    9. Data Quality issues: add place to add detail values.  An overall statement can say all data  has an issue, but a specific one must identify the column(s) and row(s) affected, thus given     the IDs or key values.
    10.Similtaneous update of LOCAL and GLOBAL vars!  Ie: app sends [widgets] to widget component,  which is the local widgets.  Who and where are Global widgets synced !!!!????  Maybe use     observables where the local ones just subscribe to the global ones.  Anyway, make this method   standard across app.
    11.Determine which transformations live on server and which on client, and whether some/all
       lives on both.
    12.Remember usage - and can sort by popular ones or show it for all relevant objects
    13.Allow own profile pic upload!
    14.How do we treat sensitive data - that may not be seen by DBA.  Keep it in Excel and reload   each time ...

    Data types and field lengths:
    --------------------------------
    - Define Canvas datatype = TS ones?  Define Canvas data types: which module creates this for   data and where?  Are all numbers equal?
    - where defined, by what means, and how are they used?  Is it display side only?  Can the user  change it?  What if an actual field is wider than the stated length - will it truncate   displayed data?  Does numbers have a length?
    - How are dates stored in DB vs localDB vs arrays?  How do we format dates onto the form?  How  is locale used?
    - How does types tranform into Vega field types, ie on Editor?
    16.After Ws were linked to a DS: if do a Tr, then validate that W are still okay (ie a W field  may not exist any longer in DS)



    Widget Editor - Adv:
    --------------------
    - DESIGn: Adv form
    - user can change Vega field types on Adv form
    - our field type -> vega types: take a best guess
    - APPLY on Adv form must re-render
    - at start, add row, col, color fields
    - EDIT buggie - color stays, fails on T=2
    BUG: if using a custom vega spec, the editor does not understand this.
    - set properties of new Widget as a template - user pref
    - when open NEW and only 1 DS, then skip DS selection page?
    - when add NEW, ensure it is accessable: always same position top left + z-index = Max(rest)+1
    - How to show comparison between current and previous period ?
    - Bug with IE: 'IE supports only grid-row-end with span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support' - looks like no solution at    the moment
    - Cross hair with showing values on axis - ie crypto trading websites!
    - Look at embeding widgets -> export Vega spec + embed line, user puts it in his html ...?
    - Serias work to be done - learning Vega and adding ALL features !!!
    - Add other Viz to W Editor (data page) - ie Layered Graphs, Trellis, etc.  These need new templates, and a new UI. For a GAUGE, see https://gist.github.com/anilkpatro/0cf0503b581556a14aab
    For KPI charts, see https://www.zoho.com/reports/help/dashboard/kpi-widgets.html
    - Give hints/advice on W as to type of graph, insights, etc.
    - filter in W, not only via Slicer, using Vega
    - where to store pictures for Ws - on a server??
    1. Easy to drill in and out of dates - year - month - day, etc



    Table (Bradley SmartTable):
    ---------------------------
    - add drag fields - to X = Add, Drag away = delete from headers
    - add drag field to Y = Pivot!  Decide local or in backend
    - add functionality = filter, sort, etc.  Decide here OR in app component ... Maybe only here
    - Does not have Links button - thinking was that one would not need to link a table to another  tab, but this must be verified
    - Right click to get popup menu with clever info
    - can set whether a user can change properties at runtime, or not
    - export to csv, Excel, etc
    - grouping of cols under another
    - filter on any col
    - cell based filter: click a cell, and it 1. filters all records in col with that value (how to show visually that table is filtered, how to unfilter it)  2. cross filter (via Slicer or otherwise) to filter all other tables and graphs using the same DS.  Think first clearly how this will work !
    - sort on all cols
    - conditional formatting
    - tooltips, which give data type, etc
    - freeze rows, cols, both
    - col header buttons, which can be on/off
    - powerful sizing and resizing
    - totals row and col
    - custom event handling
    - in-cell editing, with validation
    - cell background and colour and font size
    - resize row and col
    - support 10m rows
    - Add SORT to DB ... what about add afterwards?
    - Consider filter on click cell -> not sure how to make this easy in UI, could be quite easy to just call slicerFilter in the background.
    - Consider, carefully, to allow table to grow to a max of x rows.  This means that all affected Ws have to have a relative starting position.  Remember ReportBuilder ...
    - cell highlighter: 1. user-defined way to specify what colour a cell should be, ie red, orange, green for info, warn, error.  2.  Also with ranges, ie 1-10 = light blue, etc.  3. And filter, ie all values over 200K are red.  4. Full on Conditional Formatting
    - hierarchical Grid
    - pivot functionality
    - group headers and rows


    Dashboard:
    ----------
    2. Open: all Ds using a given Template
    4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
       for March last year, or compare all to last year ... NB
    5. Also, easy way to jump to previous period:  loaded at start with data ??
    6. Startup D: should this be settable as a pref, or should we always display the Landing page?
    7 .Show Grid - currently a .png -> how to make this dynamic ?
    8 .Save keeps all snapshots and undo actions, forever.  Thus, can see how things looked like at any point in the past.  It must be clearly marked for the user.  Must also be able to search the list, and see a list of undo actions.  Also, do we discard all undo actions when a snapshot is taken, or not.  Think clearly about it.
      Important: NO undo on forms, ie Comments.  Must be done through Add/Edit/Delete
      buttons and logic on form.
    9 .Import: check security, particularly for the Datasource.  Also, is the access rights
       stored with the text file (security risk)?  Also, can / should it over-write an
       existing Dashboard - yes, with a warning.  It must create a Draft version in all cases.
    11.StatusBar must not grow beyond screen width, or to double line
    12.Set editMode per Recent - must be same mode as last saved
    13.Set editMode @startup as user pref ?  How will this work if a D is opened read-only
    14.Consider quick access to EditMode - maybe dblClick 'ViewOnly' on StatusBar
    15.Decision required on philosophy: do we restore / remove Comments, etc with
       each snapshot !?  If yes, then all in synch.  But, can get confusing if a
       user added a Comment to the latest, then another user restores an earlier
       snapshot and his Comments are GONE! Also, if now add comments to older
       snapshot, and another user restores to a later snapshot, what happens to
       these comments??  Think carefully here.
    16.Consider popup status messages, like VSCode to be more visible - maybe not needed.
    17.Considering opening message per D (might even be per user as well), that will display each time D is opened.  How is it entered, who enters / deletes / edits it, and how is it displayed - modal (another one!), popup and for how long, and how is it closed, and how does it look to fit in?


    Sample Ds:
    ----------
    - Sample 1: personal finance, budget, expenses, etc
    - Sample 2: elaborate to-do list
    - Sample 3: buying a house: loan projections, to-do list of steps, pictures of house, share with friends, time-line of progress, gannt chart in Vega!



    Templates:
    ----------
    1. Loading a template - make sure to respect security / rights + all is read-only
    2. D used as Templates may include templates already!  This is to simplify things, and a string     of dependencies - it is thus restricted to one level.  A T can be used in may D, no issue.
    3. Add Datasources to Dashboard, but flag them as invisible.  Thus, Dashboard can use them
       in Template only, and user cannot use them.  If the user needs that Datasource, he can
       add it, in which case it will be duplicated, one invisible.
    4. If this gets too complicated, only use Shapes on Templates.
    5. Ensure Templates are on different layers / z-index
    6. When a T is changed, the user is warned which Ds use it - he can see their names and maybe   even open them.
    7. When and where is DS & data loaded?  
    8. Is it same per Tab?  The D will have many tabs, which tabs of Template is used where, or just first one on all D tabs?
    9. A lot more thought and testing needs to go into this.



    Scheduler:
    ----------
    1. Determine tech and where/how it runs
    2. How does standalone work - does it have a schedule?
    3. How are users notified and also when scheduler is down
    4. How is dataset stored - per Dashboard as more than one can be linked ..












**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
























## Later versions
    To consider for LATER versions:

    Widget Action Menu:
    - decide what other menu options to add here
    - decide if all these must be on Main menu and Palette, ie Edit Title (currently not on)
    - decide if different actions per W Type, ie Slicer has some that Shape does not have
    - consider recorded actions: make title bg color = xxx, color = yyy (company default)

    Pilot Installation:
    - Install at user as pilot, may Liaan ...

    Tabs:
    - can we hide T - will show in T list with hidden tick, can uncheck?

    Widgets:
    - Decide to get a W from another D - only show those where the user has access to the DS
    - Decide if check/tick is shown on related Sl when a W is clicked.  The treeview is good enough methinks
    - Consider Table Checkpoint - not sure if it is that useful, as one can filter, etc on table, or redesign ... And the purpose of a table is to look at data for a while methinks


    Treeview: 
    - drag and drop W onto different Tabs
    - Delete icon to delete here (name ~ title may not be clear)
    - click and goto tab where W lives
    - add Tabs, to show hierarchy better: Tab -< Ws - DS + Sl, Tab -< Sl -< Ws + DS

    - consider case-INsensitive testing in filterSlicer, or make it a user-defined setting
    - Give the user a vote - via like?  Create a sense of belonging and community
    - Consider multi-W actions, ie to move ALL selected objects - remember complexity since Sl and W sits in different components ...  Also, the current code is specific to ONE

    Performance:
    - try to improve performance - trackedByFn ...

    UI:
    - Have verticle and horisontal hairlines when moving W - experiment a bit
    - Make Observable from keystrokes in app component - then debounce to make it less??  See BK mouse wheel scroll ...
    - Consider to Warn user if 2 Sl on the same dataset for the same field - not sure it is needed
    Tooltip:
    - Show a Viz on the tooltip - this could be our explain ... !
    Landing page:
    - Incorporate tasks into Landing page?
    Menu functions:
    - Consider copy + paste for Slicer, Shape and Table.  For now, I think it is okay
    - Consider cut as well, cut = copy + delete ...
    External contact:
    - Use cell phone to do things easily - ie ask time off, manager approves and data stored as record - EASY and integrated and No forms
    - Telegram interface with bot ...
    - consider custom (big) cursor for presentations - see https://alligator.io/css/cursor-property/  2018/06/07: just could not get it going...

    Comments:
    - given DataQuality, etc, decide if we keep Comments !  What is use case?
    - only per D, or per W as well?
    - add filter on Sender/Receiver
    - In ViewOnly mode: cannot select a W, thus cannot see Comments per selected ...
    - Consider dataQuality on own menu item, or on W menu
    - look at ITTT - if this then that = rules engine that is dynamic
    - consider to show pages and tabs as images - making it easy to select
    - consider adding data: ie load new data into a grid / table ala Excel, and save it in Canvas as DS ...
    - do analysis of forces - what will make users switch vs stay away.  Different for different departments: IT = security, deployment, operations,  Finance = ROI, actual investment, cost sensitive  Users = resources to grow,  Management = fit into strategy
    - consider if we need to make special adjustments for batch jobs of the user
    - add ROI examples
    - look at Xero accounting package stats - can or should we duplicate that?
    - look for real examples where we can disrupt
    - relook at 'what business are we in' to determine product offering vs target market
    - look at market: do segmentation, non-customers that can use Canvas, think of different market needs.  Also, look at different user profiles: info-worker, project manager, consultants, team members, board.  Review competition, and be clear about differentiators.
    - consider RIGHT CLICK menu (Ihsane) - this is a lot of work, so first test if users wants it
    - consider if it is possible to show changes easily and visually, similar to mark-up in a Word doc!

    Styles:
    -------
    - ala Ivan
    - valid tags corresponds to html, ie H1, H2, etc normal, small, etc
    - have an optional style-tag to all text boxes: either specify the font-size, color, etc on the element, OR specify the style-tag.
    - have a global setting AND a Dashboard setting for 
    1. style sheet (has full list of style tags and how it looks)
    2. style tag (has font-size, etc per tag)
    Note: 2 is stronger than 1, Dashboard is strong than general
    - when an element has a style tag, it will get the propagate to all text with that tag.  This way:
    1. can have all D look similar
    2. easily change styles


    Shapes:
    -------
    - links (to web and other D, T)
    - write text vertically !
    - have UPPERCASE / Sentence Case options
    - add triangle, or make arrow more sophisticated = no line (! triangle), no arrowhead
    - make rotation of arrow with mouse - drag it around!
    - size with svg markerWidth and -Height
    - Can / should other Shapes (ie TEXT) also rotate with transform="rotate(30 20,40)"??
    - Can / should Shapes have radial / linear blur inside??
    - Consider Shape = Line - easy to do, not sure where and how used (rather use arrow)?
    - Add emojis !?  See https://www.w3schools.com/charsets/ref_utf_misc_symbols.asp 
    - Consider MarkDown / HTML formatting to Text shape - do we really need this?
    - PBI can change type of W after created, ie Table to Matrix
    - How to incorporate fancy W types, ie half circle with needle / doughnut / etc ...
    - add video as shape
    - make it easier to add co logo, ie Add logo menu option.
    - ArrowThin is not inside the W container => difficult to drag and drop, hangs over others, difficult to place, looks funny.  Also, the Arrow header is not always the same colour as the line.  Make more sophisticated to set tail (line) length -> so line length = 0 makes it s simple arrow head, or Triangle.  Also dimentions for head size - height and width.  Can these be done with a mouse ?
    - consider triangle as a new shape - not sure it is needed, or if can be done via thin arrows
    - are thin Arrows just Arrows without the body??
    - Arrow: make dynamic!  For both size and rotation, taking into account that it has to land inside the W container at all times, and preferably left top corner for easy placements.  Also, consider shrinking W container, ie with *ngIf on title and other grid areas ...

    Draw Mode (Shapes):
    -------------------
    - make the whole canvas interactive once you click DrawMode
    - hand-drawn lines / pics with mouse! => creates a normal W, with sizing and positioning so that it is top left :-)
    - add handles to arrows, lines, etc => use this to position and rotate and make longer / resize !
    - data quality issues: decide in inside or outside Canvas, and complete form
    - curved lines, bazier curves


    Widget Groups:
    --------------
    - have a CLEAR definition of what this is and how it works:
    - only one, or many?
    - if click one in group, select all in group?
    - if move one in group and rest not selected, do they move as well?
    - if resize, one or all in group resizes?  Particularly if none selected.
    - if some W selected, say 1 in group of 4.  If move, does group also move?
    - better indication that groups are used, and maybe some help when Ws are group - say one- time help popup.
    - also decide: should Group/ UnGroup save to DB or not?  It could be considered a once off thing, that must not affect other users when they open it.


    Speaker notes:
    --------------
    - Notes that can open in separate Browser Tab.  
    - Also, can show speaker notes on different screen!  
    - Add timer.


    Palette:
    --------
    - make Palette button sizes dynamic - small, medium, large, and make this a user setting.  Make sure div around it is also sized dynamically.
    ButtonBars: Decide on what to do with Widget- and Shape-ButtonBars and 2 forms - AFTER UI and functionality has been decided.  Maybe remove them, or only allow for order ... For now,palette cannot be changed.
    - expand palette / menus: add regularly used tasks, ie add a circle (with one click)
    - generalise this: user can record task!!  For example, add arrow, gray with black border at 45 degrees = recorded and add as a button !!!
    - make icons draggable - like Ubuntu palette on left !

    Themes:
    -------
    - consider light, etc themes, see https://medium.com/@amcdnl/theming-angular-with-css-variables-3c78a5b20b24

    Global Variables:
    -----------------
    - Consider which ones to keep in vars, which to load from DB each time
    - Consider depricating gv.currentWidgets, gv = global.variables.  THINK !  Can 1) make  app.currentWidget = gv.currentWidget, ByRef.  Test that this always updates.  2) always refresh  gv.currentWidget  3) delete gv.currentWidget - check where uses and how.  THEN: consider all currentXXX, where XXX = Objects to follow the same methodology.
