# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)

**UI / ideas**


    Tooltips:
    ---------
        Add Tooltips to all - decide if CSS title is okay, as it looks different to Clarity tooltip   for icons - See where and how to use tooltips on buttons (ie HTML title="" or via Clarity).  Be consistent!!

    Outstanding Forms:
    ------------
        - Usage Stats form
        - Print
        - Theme
        - Tablist
        - Direct Service
        - Managed Service
        - Combinations
        - Template form: does not work this way any longer.  Maybe use this for the Layout form, else just delete.



     Ease of use / Simplicity
    -------------------------
        - GO BACK TO SIMPLICITY !!!  Review regular on how to make it easier and faster.  If like SPSS where everything sits behinds a menu item, then too difficult.  Simplify (Ivan)
        - Relook at ALL forms for consistent layout, look and feel, INcluding the popups like the W title
        - everything must be accessable IN 3 CLICKS
        - Keep Help Message on top of forms uniform - always look and feel the same.  Also, make sure there is a preference to switch it back on manually.
        Standard unit of measure: maybe save all as rem, and user can select px, rem, etc?
        - neaten first time user for all forms: maybe more GotIt help messages that shows up only once, and disappears after GotIt was clicked.  Key example: first time EditMode is used, the user needs to understand Save and Discard.
        - Google Sheets says 'All changes saved' after each change.  Should we do the same, ie after each resize or drag-n-drop?
        - verify that we cater for casual to sophisticated user
        - test: a new user must be able to build a D in 5 minutes, and a person must be ready with max 1hr training session.  Remember, no one reads the manual!  Final test, give it to highschool kids!!
        - test with newBee - can they do graph on D with minimal guidance?
        - must easily spot messages on StatusBar
        - must immediately know when in EditMode.
        - make EditMode and Save easier for beginners - via docs and what else?

    UI, Layout, menu options:
    ------------------------
        - Use style.css for standard items, ie class="helpMessage"
        - Standardize date format shown - as selected by the user, stored as settings
        - Consider Zoom - can use scale(0.6) from CSS, but then need to properly understand layout of main page.  Also, Google, etc already has a zoom, so what's the point.  Remove from menu if not needed
        - every form must load in LESS THAN 3 SECS
        - go through system and make sure things are done consistently
        - make all drag-n-drop and similar to Microsoft interface.
        - go through Liz doc on Driv (GDG) on design principles and review all forms



    Testing:
    --------
        - test everything with 1000 - ie 1000 Dashboards in system, 1000 Widgets per D, etc - to check performance and to see it form layout (ie grids sizes) will copy with large volume
        - Test on different configs: screen resolution, 2 screens
        - Test on different devices, ie Tablet and Phone
        Multi-T display: show nr of Tabs where a W is displayed in header as a badge
        - different Browsers (NB)
        - different devices, ie iPad and iPhone
        - different OS, ie Applie
        - use Canvas for our business !

    Printing:
    -------------
        - allow different print layouts and formats, for example one
        Widget per page, Dashboard layout, all Dashboards (linked) or just the current one.
        - MUST be able to print 1 page, or all pages of Dashboard in one click


    Admin module and Users
    ----------------------
        - Users, groups, permissions: add DS permissions, Private Dashboards?, Public Dashboards?, etc to form 'My Permissions'
        - Finalise group membership / roles
        - Add UserID to ALL data and code -> where needed ... [FROM DatasourcePermission]
        - It must be impossible to lock out all users - admin keeps access and at least one is kept.  Also, if a W is locked and the owner on leave, someone must be able to unlock it.


    Refactoring / tech debt / necessary improvements:
    -------------------------------------------------
        - Add RouteGuard on 'Clarity Analytics', before going to web site ...
        BUG/ISSUE: multi-tab Slicers and Ws only refresh on the first one - when are the others done?  To do them while hidden makes no sence - should we have a dirty flag, and filterSlicer on tab change??
        - On Duplicate of W: make sure Comments, Links, etc is also duplicated in DB (or not??)
        - Expand: add Refresh button, for when change nr lines to show.  Also, 100 -> 1000
        + Dont show top if no Dataset - rather appropriate Unexpected Error msg
        - Resize does not snap to grid - is this philosophy correct?  If it does snap, remember to change the graphW & -H as well
        - FIX nrDataQualityIssues at DB level: join and fill the value, so that Canvas dont need to do any manipulation
        - in Open D we list those 'Due on' a date.  This can only be done when we calculate the due date given the schedule - remember the Omega complexity with this.
        - rename shapes for icons = angle-double, line-chart, wand.  AND look for others



    Canvas Server:
    ----------
        - Combinations must also be done here - possible?
        - Add token management forms: forgot password, refresh token ...
        - for Data Services: add Movie API ala Express Course!  Just for fun
        



    Different versions of Vega:
    ---------------------------
        - keep version on W in DB
        - Upgrade Util: converts W to new version, creates new record and keeps old one as IsTrashed=True.  Thus, can always see what it looked like before.  More thinking required here.
        - see DRF guidelines about the steps to do
        - a version of Canvas will only work with a specified version(s) of W - inside code.  This way, can load any version of Canvas and it will work provided the W version is in acceptable range - hardcoded in TS.  The version is set per W, thus can have different versions of Graphs (Vega), Sl, etc.
        API: Have flexible field selection: ie ..."fields": [A, B, F]
        Setting min Grid width - wait for Clarity Bug fix


    Local DB:
    ---------
        - review and check: it should NEVER be allowed to edit the DB itself - there must be a UI function for changing things.  And always by the users, with rights if necessary.
        - Snapshot.clickRestore accesses global vars directly: revisit whole routine and see if can be done better: DS, dSet, WChkPnt, D, T, W.
            - some other places with the same issue:
            * WidgetCheckPoint: app.Undo
            * current dSet: dataRefresh.clickDS, slicerSingle.clickSlicer
            * currentW: app (20+ times), SlicerEd.clickSave & clickSlicerItem
        - how to add a table without deleting the IndexDB manually ??
        Caching:
        - speed test with Dexie with Dashboards stored:
            * memory variable 0 - 3 ms, once 6 ms for 10K Ds
            * 10: 11 - 177 ms, avg 55 ms
            *100: 99 - 136, avg 120 ms
            * 1000 405 - 575, avg 505 ms
            * 10 000: avg 8 secs 200ms.  Note: clearing the DB took 10.5 MINS - 12.5 MINS !


    Data:
    -----
        - Make sure terminology is consitent: Datasource -> Transform -> Dataset
        - import / initial load facility: can create DS in bulk from an existing DB or folder -> see mongoimport function
        - consider using external software for heavy calculations / computations / transformations, ie C, Pandas in Python, local Spark, Google cloud functions, etc
        - Have TestConnectivity method - can TEST connection
        - I used FieldNames (string) in ie Pivot - is that okay?
        - Design (technically) how Datasets, pivotRow, pivotCol, pivotResult, pivotAgg, Fields, FieldsMetaData, Combinations, CombinationDetails will work, given that these can change over time, has to be fast enough (cannot all live in memory) and has to integrate with Vega ...
        - Check Definition of DS = source, location, authentication, F, Tr, Pv etc.  Dataset is just the data, with an ID / url to find it.
        - When removing a Dataset, it validates that not used in a Widget, Shape or Combination. If so, then cannot be removed.  If removed, all resultsets stored for it must be removed as well, or  not?
        - Similtaneous update of LOCAL and GLOBAL vars!  Ie: app sends [widgets] to widget component, which is the local widgets.  Who and where are Global widgets synced !!!!????  Maybe use observables where the local ones just subscribe to the global ones.  Anyway, make this method standard across app.
        - Allow own profile pic upload! - currently hardcoded to JannieProfile pic ...
        - export to csv, Excel, etc
            - for CSV export, tried https://www.npmjs.com/package/angular5-csv - worked with example, but seems old.
        - has currency
        - consider Excel-like format => many users can use it already
        - data bars inside text values
        - sub totals and grand totals
        - can add labels, once
        - Sybrin wants to see previous versions of the Datasources!
        - export to Excel, pdf (Power BI can export to pdf with drill down !!)


    Data types and field lengths:
    -----------------------------
        - Define Canvas datatype = TS / Vega ones?  Define Canvas data types: which module creates this for data and where?  Are all numbers equal?
        - where defined, by what means, and how are they used?  Is it display side only?  Can the user  change it?  What if an actual field is wider than the stated length - will it truncate displayed data?  Does numbers have a length?
        - How are dates stored in DB vs localDB vs arrays?  How do we format dates onto the form?  How  is locale used?
        - How does types tranform into Vega field types, ie on Editor?
        16.After Ws were linked to a DS: if do a Tr, then validate that W are still okay (ie a W field  may not exist any longer in DS)


    Data Permisions:
    ---------------
        - make sure these permissions are respected within each Widget
        - make sure these respected in Delete DS


    Authentication:
    ---------------
        - add Auth0, Google, Facebook
        - Sybrin wants their permissioning, which is complicated, bank compliant, AD included, etc

    Schema Validator:
    - See https://github.com/tdegrunt/jsonschema
    
    Widget Editor - Adv:
    --------------------
        - highlight one series in graph, either click the line (bar), or click on the legend
        - set properties of new Widget as a template - user pref
        - Give hints/advice on W as to type of graph, insights, etc.
        - add Drill Down / Drill Through: this is critical.  Drill down is a capability that takes the user from a more general view of the data to a more specific one at the click of a mouse. For example, a report that shows sales revenue by state can allow the user to select a state, click on it and see sales revenue by county or city within that state. It is called “drill down” because it is a feature that allows the user to go deeper into more specific layers of the data or information being analyzed.  Further levels of drill down can be set up within the report–practically as many as supported by the data. In our example, the drill-down can go from country to state to city to zip code to specific location of stores or individual sales reps. Typically, the look and feel of each level of the report is similar–what changes is the granularity of the data.  Instead of taking the user to a more granular level of the data, drill through takes him to a report that is relevant to the data being analyzed, also at the click of a mouse. For example, a tabular report that shows sales revenue by state can allow the user to click on it and reveal an analysis grid of the same data, or a heat map representing the data in visual form. It is called “drill through” because it is a feature that allows the user to pass from one report to another while still analyzing the same set of data.
        - Easy way to compare data: graph shows revenue per month for this year.  What was figure for March last year, or compare all to last year ... NB
        - allow way to see detail data behind a (summaried) cell or graph
        - consider adding data table Excel-style -> can then use them, ie lookup tables
        - manipulations: 
            - look at Merge / combining 2 DS
            - add / remove cols
            - read from Jira ?
            - can import whole folder, using one as headers
            - specify data types, ie whole numbers
        - has to do conditional formatting in table cells
        - m

        Fix:
            - test all Calc Formulae

        Tooltip:
            - make work Vega style tooltip work





    Table:
    ------
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
        - QUICK Filter: shown as tabs at the top (ala Inet) to filter on predefied values, ie 1d 1w 1m 1y for stock prices.
    

    Error Handling:
    --------------
        - nice message at all points, ie when DB not available on landing page
        - central logging and handling: server will do server stuff, add frontend stuff
        - error bubbling strategy - show each one on a form

    Data Summaries:
        - DATA SUMMARIES, aka CompassQL ...
            - Summary of n charts - design UI 
            - new Data Science tool
            - fields: count#, any - see Voyager
            - wildcards

    Layout:
        - review design
        - estimate size of graph better - depends on length of data in fields, ie Y and Color
        - remove outline afterwards (invisible) as well as buttons
        - when remove graph, remove layout ?  How linked?

    Samples: use this to demo Canvas features (brag)
    --------
        NB:
        1. Start with Jen data, budget, sales, forecasts, costs and pipeline for first demos (must be able to drill down to customers, products and roll up per group and branch)
        2. Build layouts per Industry, see AirTable

        Dashboards:
        - Sample 1: personal finance, budget, expenses, etc
        - Sample 2: elaborate to-do list
        - Sample 3: buying a house: loan projections, to-do list of steps, pictures of house, share with friends, time-line of progress, gannt chart in Vega!
        - Sample 4: Anscombe example.  Consider built-in stats functions like regression into backend; as a Transformation.

        Datasources:
        - Consider where to store, tag as sample => cannot alter and delete?
        - Reserve Bank CPI
        - Python brings back data sets !!!
        - Read from PDF tables
        - Multi currency !!!
        - List of all tables in spreadsheet
        - Data refresh - can schedule refresh even to excel
        - Don't want users to define DS
        - Can do row-level security in DS
        - Can del DS and then graph updates !!!
        - Table with alternating colours
        - Powerbi - pain with duplicate data models - MUST BE CENTRAL !!!  To maintain one file is master service nirvana. But, can only publish to where DS lives .... Many tricks or needs Sharepoint ...?
        - Qlik slow if to many users - Gabriella
        - Sage has no forecasting - linked data to excel then power bi

        - Wikipedia via webconnector to get GDP
        - Support desk!  Usual, ie calls per week, calls per agent, etc.  BUT, have a capturing tool ~ Canvas menu.  When a call is closed: click on menu option, add: issue + text, new dev requested + text, support needed by user + text.  This can produce powerful graphs on the three dimensions, each with nr of users per menu option.  This can be used to improve training, and new dev: the hotspots should be easily visible = area that must be fixed or enhanced or simplied to give the best bang for the next sprint.  Running the data over a timeline and marking the change as an event, one can easily see if the change has worked, and trends (ie what is getting worse / better).  I want to use this for Clarity on Canvas.



    Scheduler:
    ----------
        1. Determine tech and where/how it runs
        2. How does standalone work - does it have a schedule?
        3. How are users notified and also when scheduler is down
        4. How is dataset stored - per Dashboard as more than one can be linked ..



    Form: Tasks: (maybe hang back with this until we have a use case)
    -----------
    1. the form is not fully functionaly! 
        - when click on grid, the detail does not appear at the top
        - the grid on the Details tab seems to give incorrect info
        - there is no Edit button
        - there is no Delete button

    Form - SystemSettings:
    ---------------------
        - add errorMessage to HTML form


    Form - Dashboard Scheduler:
    --------------------------
        - add errorMessage to HTML form











**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
























## Later versions
    To consider for LATER versions:


    System, Limits:
    --------------
    - consider hard max limits: cannot read more than 10000 rows from Excel, etc ?
    - determine limits, ie 1.2 GB of RAM, HDisc requirements, etc
    - set max on data, ie max 2bn rows from db, max 10000 rows in browser, etc
    - do some performance benchmarks: if 1000 lines csv file, takes 3 seconds to load, etc
    - Need way to browse large volumes of data without killing browser - server must calc and warn user, plus also do pagination in the background. Also, data manipulation must be pushed onto the server as far as possible.
    Warning:
    - when a W is rendered and some fields dont exist, error occured, display a warning image +     message inside W.  User can edit this, fix the fields and save
    - before saving a W, Canvas checks that the fields are valid, that it renders, etc and warns if not (but allows to save) - how does this fit in with auto-save policy?
    - ensure multi-tenant (companyName) used correctly and consistently


    General:
    -------
    - Add a demo in the cloud
    - Run over HTTPS (Node and ng)
    - Have a SERIOUS look at Security!  See:
        - https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d
        - https://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned/
        - https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46


    Image:
    -----
    - add image via File input box - Canvas Server gives back url?
    - scale on Sh Editor, and add drag handles to size here
    - picture overlaps the WidgetContainer in App.html - looks funny


    Dashboard:
    ----------
    - DS and filters defined and in use -> is this in the Tree view?
    - new Thumbnail images !
    - can the business Glossary be read from the Clients data?
    - Need to explain the Datasource, Dashboard, Tab, Widget link better, maybe use Excel as an analogy.
    - Embedding may be more complicated than meets the eye looking at the tech stack and permissioning.  Consider how to obtain filters in their system, produce graph and pass this back to them (web components ?)
    - Premade Dashboards and also Widgets
    - Have DOWN arrow to go the second page on same tab ??!!!
    - Legend and tooltips - drag field here
    - Import Vega spec automatically
    - relook at D export: maybe export Widgets too, plus data or at least points to data.  Amend Import to: show structure and what is valid, and if user proceeds: read Widgets to, create new records in DB, similar to ADD D and ADD W
    - show rubberband when selecting with mouse on D: mouse down and up @View controls size of pre-created Div
    - have optional authorised recipients -> can only Send a Message / Email to these and no one else.
    - add colour to Dashboard tags.  Maybe show it on other forms as well, where useful
    - share link (url) = will open Canvas with THIS Dashboard ?
    - on SAVE form: add user / group to notify that this D has been saved.
    - make it easier to see where to input data: maybe gray background ... Is this really necesary?  Make baie certain as this is baie work ...
    - look at Windi.com, Wahoo ? to see how to make it easy
    - look at gartner quadrant for dv. Explore, visualize, transform, compute, compose
    - create a video / bitmap.  See: w3schools:
        <iframe width="420" height="315"
            src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1">
        </iframe>
    - consume all files in a folder !!  Can also poll folder to update when they change !!!
    - infer xsd from XML files. Tranform XML to SQL db table And show mapping. Publish to make it accessable by other consumers like spotfire. Which reads it as a db table, or to other bi consumers. Can combine XML to other data
    - can read Ems, Jms ... ??
    - expose Canvas to existing users as private preview and log keystrokes => knows what they are using, and how long something takes!!
    -Accelator keys: accesskey="h".  Make consistent approach for all, taking into account that browser has own set.  Try to make it dynamic, ie use can define it!
    - Decision required on philosophy: do we restore / remove Comments, etc with
       each snapshot !?  If yes, then all in synch.  But, can get confusing if a
       user added a Comment to the latest, then another user restores an earlier
       snapshot and his Comments are GONE! Also, if now add comments to older
       snapshot, and another user restores to a later snapshot, what happens to
       these comments??  Think carefully here.
    - Consider popup status messages, like VSCode to be more visible - maybe not needed.
    - Considering opening message per D (might even be per user as well), that will display each time D is opened.  How is it entered, who enters / deletes / edits it, and how is it displayed - modal (another one!), popup and for how long, and how is it closed, and how does it look to fit in?
    - have group of D (better name ...) of several Ds = used on filtering when Open D.  Maybe called bookmarks?
    - have D views on a D = set of filters and settings applied. Currently this is just another Snapshot ...  Make it easy to switch, and then attach a VIEW to a message ...
    - Save keeps all snapshots and undo actions, forever.  Thus, can see how things looked like at any point in the past.  It must be clearly marked for the user.  Must also be able to search the list, and see a list of undo actions.  Also, do we discard all undo actions when a snapshot is taken, or not.  Think clearly about it.
    - navigation menu:
        - can open menu on left with icons and colours that jumps to different pages when clicked.  Can use this menu for beginner = create D, create W, etc !
        - something to show when hover over menu items
    - consider adding Ctrl-Z = Redo previous action (if on menu, ie open Add Widget form).  Can be tricksy - what if previous was Delete Widget ?
    - Show Grid - currently a .png -> how to make this dynamic ?  See: https://stackoverflow.com/questions/3540194/how-to-make-a-grid-like-graph-paper-grid-with-just-css
    - consider removing Datalib library, if not needed for vega template spec

    Layouts:
    -------
    - consider, ala James McGillivray, standard layout grids, with some cells merged.  Then, when D opens, looks like Powerpoint that says type title here, text here.  Each block will say 'click here to add Title / Graph / Text Shape / etc'.  Can make it easy to have standard layouts!
    - what happens after: are Widgets fixed to block, or can one drag them (think this is better), and can one delete empty thing.

    Data:
    ----
    - cater for situation where one can define Schema before reading data - upload and store in DS definition!  Also, what about validating data against this schema before loading - Ivan 2019-01-08

    - Discover DBs, ie IP, etc (Bradley)
    - reconsider Transpose option for pre-loading.  May be useful for some datasets, but clearly not for SQL, etc.  And doubt if json files would need that.  Can this be useful?
    - How do we treat sensitive data - that may not be seen by DBA.  Keep it in Excel and reload each time ...
    - Remember usage - and can sort by popular ones or show it for all relevant objects
    - PowerBI can delete DS, then W just shows big X, with a message Fix this.  Is this a good idea?  I dont think so, but I think one must be able to swop DS for a W provided the same fields are present - just replace the DS-id ?  Maybe just easier to recreate it, and only be able to delete a DS if all Widgets linked to it are deleted.
    - PowerBI has a mess with duplication - and checks once per hour if a DS has been changed.  I dont think we should do this at all.
    - consider row level security ...
    - PowerBI puts DS in a file, and do versioning here.  We should be able to do versioning in Canvas!
    - PowerBI tenant setting: can export data, can forward data, can share data, can print, can subscribe on behalf of someone else.  Consider this and improve our settings
    - consider COPY of DS: can then amend the second one, ie do Transformations
    - load file: add predefined filters, so that only THIS data is loaded.  Thus, less loaded into Canvas.  Consider how to define this, ie columnName='...' - can this then be done before / after preview ?  Make visual.
    - load file: add limit, max nr of lines loaded.  And warn when this has been reached.
    - load file: where to add data types?
    - load file: where to add validation and action, ie Col = 'Sales Amount' is a decimal, and if not so, ignore row / fail?
    - load file: add all-or-nothing option: all good, else fail.  If false, will load what is valid and just ignore rest?
    - pre-build all DS from existing DB -> quick and easy to start
    - consider import of Excel tables
    - consider import from Powerpoint and Word tables ...
    - consider integration with a ERD tool like Erwin, see:
    https://erwin.com/products/data-modeler/#
    - Filters take a lot of space => rather use clicking on graph to filter, or open filter on separate page / popup.  Then have a button on form to indicate that it is filtered and to clear the filters.
    - functionality to change DS on a W
    - give a warning of which Dashboards uses a field if a DS definition is changed.
    - getting Data from a web table: this is not so often used, thus try and read other types of grids/tables as well (ie Clarity Datagrid)
    - security: can block print and screenshots
    - allow for companies that have to store data in SA    cater for DB rename (name or location)


    Widget Action Menu:
    ------------------
    - decide what other menu options to add here
    - decide if all these must be on Main menu and Palette, ie Edit Title (currently not on)
    - decide if different actions per W Type, ie Slicer has some that Shape does not have
    - consider recorded actions: make title bg color = xxx, color = yyy (company default)


    Canvas Server:
    ----
    - consider a REST API for Canvas Server Accounts => other users can add, delete stuff ...
    - consider Guest login - can do 1 private Dashboard, access to files ?  Is this useful?
    - Word and Pdf readers
    - function (on Canvas Server) to add lat/long to a DS
    - MELT function (Pandas) to un-pivot data, and then test with the World Bank (or other economical data)
    - Consider a multi-server setup, where a company has many branches.
    - Testing: get an autmated way to test all routes, as well as the desired response for set records
    - 


    Data Confidentiallity:
    ---------------------
    - consider including this.  For example, confidential data cannot be exported outside of Canvas, cannot export graph or even make a screen snapshot of it.  Or at the very least warn that data is confidential.
    - next level is content aware: cannot email Absa's margin data to Stadard Bank... Not sure how we do this, and if it is even possible.

    Pilot Installation:
    - Install at user as pilot, may Liaan ...

    Tabs:
    ----
    - can we hide T - will show in T list with hidden tick, can uncheck?
    - change TABS to GO TO Tab

    Reports:
    --------
    - consider a Marked Up report, created with Markup language and data.  Can get complicated!
    - the idea would be to have tech-users create reports


    Widgets:
    -------
    - Bug with IE: 'IE supports only grid-row-end with span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support' - looks like no solution at the moment
    - can switch DS for a W, provided used fields are the same (name and type): is this REALLY necessary and useful as it looks complicated and not important
    - Decide to get a W from another D - only show those where the user has access to the DS
    - Decide if check/tick is shown on related Sl when a W is clicked.  The treeview is good enough methinks
    - consider colour in HEX code
    - Consider Table Checkpoint - not sure if it is that useful, as one can filter, etc on table, or redesign ... And the purpose of a table is to look at data for a while methinks
    - consider auto-calculated values, ie hover and show SUM of data.  Not sure how to do this, and if useful
    - make Checkpoints more visible, may o o 0 o at bottom to show how many and where we are?
    - consider dataQual triangle, -> link icons in same spot each time?
    - consider Ctrl-X = CUT = Delete current and Copy it.  Can for example use the Del Form to confirm - do we need a confirmation ?
    - consider Shift-Delete = needs no confirmation - good idea?
    - consider selection of geo data on a map using a polygon - maybe via a 3rd party package
    - dot on rectangle - move to change border-radius (see LibreOffice Impress) ?
    - add -> hyperlink inside TEXT box, thus can have Back Button.  Think: just to a tab, or to a D too?
    - widget Title: consider adding bold and italic
    - consider if putting Templates (for D, W, etc) and CanvasSettings, TributaryTypes, etc in DB makes sense.  Disadvantage is speed, not sure there is a real advantage.
    - currently flip-to-table/graph is temporary - consider storing the widgetType permanently.
    - kanban board – think of container with cards, each having user selected fields (assigned to, task descr, etc) and a filter => can create a block of tasks assigned to me ?
    - Storyboard – explain better and show example
    - Graph with different granularity ~ via checkpoints?
    - consider standardizing items between Container and Graph-Title, ie Font Weight, Shadow, Margin, etc only on one and not the other
    - consider a list of predefined styles for Graph-Titles similar to Containers
    - if a shape with a transparent background is just below the title bar, and one clicks the context menus (ie Annotations): then the dropdown disappears behind the the shape.  It is a bit confusing but setting the z-index of the dropdown menu does not seem to change anything.  Ideas?
    - ContainerFontSize - consider dropping it, and have a font size for Title, Shape-Text, etc. Else it gets confusing ...
    - Consider not increasing stuckCount in App if an item is selected/deselected. This does mean to pass event back from slicer.single component.
    - master-detail setup: click on a cell in the master, and the cell value becomes a Widget-filter for the detail table or graph.  This can also be used for Drill Through


    Treeview:
    --------
    - drag and drop W onto different Tabs
    - Delete icon to delete here (name ~ title may not be clear)
    - click and goto tab where W lives
    - add Tabs, to show hierarchy better: Tab -< Ws - DS + Sl, Tab -< Sl -< Ws + DS

    - consider case-INsensitive testing in filterSlicer, or make it a user-defined setting
    - Give the user a vote - via like?  Create a sense of belonging and community
    - Consider multi-W actions, ie to move ALL selected objects - remember complexity since Sl and W sits in different components ...  Also, the current code is specific to ONE


    Performance:
    -----------
    - try to improve performance - trackedByFn ...


    UI:
    --
    - Have verticle and horisontal hairlines when moving W - experiment a bit
    - Make Observable from keystrokes in app component - then debounce to make it less??  See BK mouse wheel scroll ...
    - Consider to Warn user if 2 Sl on the same dataset for the same field - not sure it is needed
    Tooltip:
    - Show a Viz on the tooltip - this could be our explain ... !
    Landing page:
    - Menu functions:
        - Consider copy + paste for Slicer, Shape and Table.  For now, I think it is okay
        - Consider cut as well, cut = copy + delete ...
        - relook at the menu layout.  One suggestion was to organise menus per tasks.  Or, at the very least have a Tasks menu option: user tasks on here?

    -External contact:
    - Use cell phone to do things easily - ie ask time off, manager approves and data stored as record - EASY and integrated and No forms
    - Telegram interface with bot ...
    - consider custom (big) cursor for presentations - see https://alligator.io/css/cursor-property/  2018/06/07: just could not get it going...

    Tables:
    ------
    - allow to set pagination nr (currently defaults to 10)
    - table checkpoints?
    - dynamic setting of table size: number of rows shown, number of rows per page.  Maybe via the drop down menu in the title?
    - merged cells - give County ones, then all cities for this county as rows below it.
    - consider subtotals per group ...

    Comments:
    --------
    - given DataQuality, etc, decide if we keep Comments !  What is use case?
    - only per D, or per W as well?
    - add filter on Sender/Receiver
    - In ViewOnly mode: cannot select a W, thus cannot see Comments per selected ...
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
    - consider RIGHT CLICK menu (Ihsane) - this is a lot of work, so first test if users wants it.  Also, think about old hover menu I had long ago ...
    - consider if it is possible to show changes easily and visually, similar to mark-up in a Word doc!
    - consider increase / decrease in the distance between multiple selected Widgets, both horisontally and vertically.  Is this needed ?

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
    - Indented bullets !!!
    - Some points un-bulleted - ie spaces ...  Maybe get a text editor !!!
    - Include code blocks - like Vscode style!!!
    - Round buttons at bottom of presentation to navigate
    - store alignVertically, alignHorisontally on W -> after the text in bullet is changed, it will automatically align V or H

    - Slicer:
    - Consider Slicer per User on the Dashboard
    - all ALL, NONE options to list of checkboxes (or the heading, or the caret dropdown menu)
    - ie checkbox for multiple select, radio button for single selection
    - make typing / changing text easier - type into box like PowerPoint
    - create a Word-like reporter (Terence uses this): Another great use would be to make a report. Not so much for display but for reading. Like a monthly report on exposures. We currently use word for that but the only difference from what you already have would beprinting in A4 format with different font and wording formats.
    - write text vertically !
    - have UPPERCASE / Sentence Case options
    - add triangle, or make arrow more sophisticated = no line (! triangle), no arrowhead:
      With plain CSS:
        <div class="triangle"></div>
        .triangle {
            width: 0;
            height: 0;
            border-top: 20px solid #333;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
        }
    - make rotation of arrow with mouse - drag it around!
    - size with svg markerWidth and -Height
    - Can / should other Shapes (ie TEXT, LINE) also rotate with transform="rotate(30 20,40)"??
    - Can / should Shapes have radial / linear blur inside??
    - Consider Shape = Line - easy to do, not sure where and how used (rather use arrow)?
        - must be draggable to increase / decrease size
        - must set width in px
        - must set color
        - must be solid or dotted
        - draw with mouse, see http://svgdiscovery.com/THREEjs/SVGControl/03-drawArrowLines.htm
    - consider sparklines:
        - small graphs with no text, etc.  Maybe this only has value inside a table?
    - Consider robot widgets:
        - shows red / orange / green light depending on status.
        - for SVG, see http://svgdiscovery.com/HMI/StatusStick/statusStick.htm
    - Add emojis !?  See http://unicode.org/charts/  (also pictographs!)
        - See https://www.w3schools.com/charsets/ref_utf_misc_symbols.asp
        - try to include big, colourful icons
        - can convert unicode to SVG - see http://svgdiscovery.com/C/svg-text-symbol.htm
        and https://unicode-table.com/en/#miscellaneous-symbols
        - in SVG!  See http://svgdiscovery.com/L/svg-font-icon.htm
                function buildIconTable()
                {
                    var fontSize=50
                    for(var k=0;k<svgIcon.length;k++)
                    {
                        var iconSplit=svgIcon[k].split(",")
                        var fontFamily=iconSplit[0]
                        var code="&#x"+iconSplit[1]
                        var title=iconSplit[2]
                        var row=iconTable.insertRow(k)
                        var nameCell=row.insertCell(0)
                        nameCell.innerText=(k+1)+". "+title+"\nFont Family: "+fontFamily+"\n"+code

                        var iconCell=row.insertCell(1)
                        iconCell.style.color=rcolor()
                        iconCell.style.fontFamily=fontFamily
                        iconCell.style.fontSize=fontSize+"px"
                        iconCell.innerHTML=code

                    }
                }
                var svgIcon=[]
                svgIcon[0]='Arial Unicode MS,2708,AIRLINER'
                svgIcon[1]='Wingdings,f051,AIRPLANE'
                svgIcon[2]='Webdings,f06A,AIRPLANE:PRIVATE'
                svgIcon[3]='Webdings,f068,AMBULANCE'
                svgIcon[4]='Arial Unicode MS,27AB,ARROW:BACK-TILTED'
                svgIcon[5]='Arial Unicode MS,27B2,ARROW:CIRCLED'
                svgIcon[6]='Arial Unicode MS,27A8,ARROW:CONCAVE-POINTED'
                svgIcon[7]='Arial Unicode MS,27A5,ARROW:CURVED DOWNWARDS'
                svgIcon[8]='Arial Unicode MS,27A6,ARROW:CURVED UPWARDS'
                svgIcon[9]='Arial Unicode MS,279F,ARROW:DASHED TRIANGLE'
                svgIcon[10]='Arial Unicode MS,279B,ARROW:DRAFTING POINT'
                svgIcon[11]='Arial Unicode MS,27B9,ARROW:FEATHERED HEAVY NORTH EAST'
                svgIcon[12]='Arial Unicode MS,27B7,ARROW:FEATHERED HEAVY SOUTH EAST'
                svgIcon[13]='Arial Unicode MS,27B8,ARROW:FEATHERED HEAVY'
                svgIcon[14]='Arial Unicode MS,27B6,ARROW:FEATHERED NORTH EAST'
                svgIcon[15]='Arial Unicode MS,27B5,ARROW:FEATHERED SOLID'
                svgIcon[16]='Arial Unicode MS,27B4,ARROW:FEATHERED SOUTH EAST'
                svgIcon[17]='Arial Unicode MS,27B3,ARROW:FEATHERED'
                svgIcon[18]='Arial Unicode MS,27AC,ARROW:FRONT-TILTEDS'
                svgIcon[19]='Arial Unicode MS,27A0,ARROW:HEAVY DASHED TRIANGLE'
                svgIcon[20]='Arial Unicode MS,27AE,ARROW:HEAVY RIGHT-SHADOWED'
                svgIcon[21]='Arial Unicode MS,279E,ARROW:HEAVY TRIANGLE-HEADED'
                svgIcon[22]='Arial Unicode MS,27BD,ARROW:HEAVY WEDGE-TAILED'
                svgIcon[23]='Arial Unicode MS,27AA,ARROW:LEFT-SHADED'
                svgIcon[24]='Arial Unicode MS,279A,ARROW:NORTH EAST'
                svgIcon[25]='Arial Unicode MS,27B1,ARROW:NOTCHED-SHADOWED'
                svgIcon[26]='Arial Unicode MS,27AF,ARROW:NOTCHED'
                svgIcon[27]='Arial Unicode MS,27BE,ARROW:OPEN-OUTLINED'
                svgIcon[28]='Wingdings,f0c3,ARROW:RIBBON 1'
                svgIcon[29]='Wingdings,f0c4,ARROW:RIBBON 2'
                svgIcon[30]='Wingdings,f0c5,ARROW:RIBBON 3'
                svgIcon[31]='Wingdings,f0c6,ARROW:RIBBON 4'
                svgIcon[32]='Wingdings,f0c7,ARROW:RIBBON 5'
                svgIcon[33]='Wingdings,f0c8,ARROW:RIBBON 6'
                svgIcon[34]='Wingdings,f0c9,ARROW:RIBBON 7'
                svgIcon[35]='Wingdings,f0cA,ARROW:RIBBON 8'
                svgIcon[36]='Arial Unicode MS,27A9,ARROW:RIGHT-SHADED'
                svgIcon[37]='Arial Unicode MS,27AD,ARROW:RIGHT-SHADOWED'
                svgIcon[38]='Arial Unicode MS,2799,ARROW:RIGHTWARDS'
                svgIcon[39]='Arial Unicode MS,279C,ARROW:ROUND-TIPPED'
                svgIcon[40]='Arial Unicode MS,27A1,ARROW:SOLID RIGHTWARDS'
                svgIcon[41]='Arial Unicode MS,2798,ARROW:SOUTH EAST'
                svgIcon[42]='Arial Unicode MS,27A7,ARROW:SQUAT RIGHTWARDS'
                svgIcon[43]='Arial Unicode MS,27BA,ARROW:TEARDROP-BARBED'
                svgIcon[44]='Arial Unicode MS,27BB,ARROW:TEARDROP-SHANKED'
                svgIcon[45]='Arial Unicode MS,279D,ARROW:TRIANGLE-HEADED'
                svgIcon[46]='Arial Unicode MS,27BC,ARROW:WEDGE-TAILED'
                svgIcon[47]='Arial Unicode MS,2794,ARROW:WIDE-RIGHTWARDS'
                svgIcon[48]='Wingdings,f0dA,ARROWHEAD:DOWN'
                svgIcon[49]='Wingdings,f0d7,ARROWHEAD:LEFT'
                svgIcon[50]='Wingdings,f0d8,ARROWHEAD:RIGHT'
                svgIcon[51]='Arial Unicode MS,27A4,ARROWHEAD:SOLID RIGHTWARDS'
                svgIcon[52]='Arial Unicode MS,27A3,ARROWHEAD:THREE-D BOTTOM'
                svgIcon[53]='Arial Unicode MS,27A2,ARROWHEAD:THREE-D TOP'
                svgIcon[54]='Wingdings,f0d9,ARROWHEAD:UP'
                svgIcon[55]='Arial Unicode MS,2743,ASTERISK: PINWHEEL'
                svgIcon[56]='Arial Unicode MS,273A,ASTERISK:16 POINTED'
                svgIcon[57]='Arial Unicode MS,274A,ASTERISK:8 TEARDROP-SPOKED'
                svgIcon[58]='Arial Unicode MS,2749,ASTERISK:BALLOON-SPOKED'
                svgIcon[59]='Arial Unicode MS,2723,ASTERISK:BALLOON'
                svgIcon[60]='Arial Unicode MS,2725,ASTERISK:CLUB-SPOKED'
                svgIcon[61]='Arial Unicode MS,2733,ASTERISK:EIGHT SPOKED'
                svgIcon[62]='Arial Unicode MS,274B,ASTERISK:HEAVY 8 TEARDROP-SPOKED'
                svgIcon[63]='Arial Unicode MS,2724,ASTERISK:HEAVY BALLOON'
                svgIcon[64]='Arial Unicode MS,273D,ASTERISK:HEAVY TEARDROP-SPOKED'
                svgIcon[65]='Arial Unicode MS,2731,ASTERISK:HEAVY'
                svgIcon[66]='Arial Unicode MS,2732,ASTERISK:OPEN CENTRE'
                svgIcon[67]='Arial Unicode MS,273C,ASTERISK:OPEN TEARDROP-SPOKED'
                svgIcon[68]='Arial Unicode MS,273B,ASTERISK:TEARDROP-SPOKED'
                svgIcon[69]='Arial Unicode MS,2722,ASTERISK:TEARDROP'
                svgIcon[70]='Webdings,f08e,AUTOMOBILE'
                svgIcon[71]='Wingdings,f025,BELL'
                svgIcon[72]='Webdings,f062,BICYCLE'
                svgIcon[73]='Webdings,f06F,BOAT'
                svgIcon[74]='Wingdings,f04d,BOMB'
                svgIcon[75]='Wingdings,f0fe,BOX:CHECK'
                svgIcon[76]='Wingdings,f0fd,BOX:x'
                svgIcon[77]='Webdings,F076,BUS'
                svgIcon[78]='Webdings,f08f,CHART'
                svgIcon[79]='Arial Unicode MS,2713,CHECK MARK'
                svgIcon[80]='Arial Unicode MS,2714,CHECK MARK:HEAVY '
                svgIcon[81]='Webdings,f061,CHECK'
                svgIcon[82]='Arial Unicode MS,274D,CIRCLE:SHADOWED'
                svgIcon[83]='Arial Unicode MS,2776,CIRCLED DIGIT[A]:1'
                svgIcon[84]='Arial Unicode MS,2777,CIRCLED DIGIT[A]:2'
                svgIcon[85]='Arial Unicode MS,2778,CIRCLED DIGIT[A]:3'
                svgIcon[86]='Arial Unicode MS,2779,CIRCLED DIGIT[A]:4'
                svgIcon[87]='Arial Unicode MS,277A,CIRCLED DIGIT[A]:5'
                svgIcon[88]='Arial Unicode MS,277B,CIRCLED DIGIT[A]:6'
                svgIcon[89]='Arial Unicode MS,277C,CIRCLED DIGIT[A]:7'
                svgIcon[90]='Arial Unicode MS,277D,CIRCLED DIGIT[A]:8'
                svgIcon[91]='Arial Unicode MS,277E,CIRCLED DIGIT[A]:9'
                svgIcon[92]='Arial Unicode MS,277F,CIRCLED DIGIT[A]:10'
                svgIcon[93]='Arial Unicode MS,2780,CIRCLED DIGIT[B]:1'
                svgIcon[94]='Arial Unicode MS,2781,CIRCLED DIGIT[B]:2'
                svgIcon[95]='Arial Unicode MS,2782,CIRCLED DIGIT[B]:3'
                svgIcon[96]='Arial Unicode MS,2783,CIRCLED DIGIT[B]:4'
                svgIcon[97]='Arial Unicode MS,2784,CIRCLED DIGIT[B]:5'
                svgIcon[98]='Arial Unicode MS,2785,CIRCLED DIGIT[B]:6'
                svgIcon[99]='Arial Unicode MS,2786,CIRCLED DIGIT[B]:7'
                svgIcon[100]='Arial Unicode MS,2787,CIRCLED DIGIT[B]:8'
                svgIcon[101]='Arial Unicode MS,2788,CIRCLED DIGIT[B]:9'
                svgIcon[102]='Arial Unicode MS,2789,CIRCLED DIGIT[B]:10'
                svgIcon[103]='Arial Unicode MS,278A,CIRCLED DIGIT[C]:1'
                svgIcon[104]='Arial Unicode MS,278B,CIRCLED DIGIT[C]:2'
                svgIcon[105]='Arial Unicode MS,278C,CIRCLED DIGIT[C]:3'
                svgIcon[106]='Arial Unicode MS,278D,CIRCLED DIGIT[C]:4'
                svgIcon[107]='Arial Unicode MS,278E,CIRCLED DIGIT[C]:5'
                svgIcon[108]='Arial Unicode MS,278F,CIRCLED DIGIT[C]:6'
                svgIcon[109]='Arial Unicode MS,2790,CIRCLED DIGIT[C]:7'
                svgIcon[110]='Arial Unicode MS,2791,CIRCLED DIGIT[C]:8'
                svgIcon[111]='Arial Unicode MS,2792,CIRCLED DIGIT[C]:9'
                svgIcon[112]='Arial Unicode MS,2793,CIRCLED DIGIT[C]:10'
                svgIcon[113]='Arial Unicode MS,271A,CROSS:HEAVY GREEK'
                svgIcon[114]='Arial Unicode MS,271C,CROSS:HEAVY OPEN CENTRE'
                svgIcon[115]='Arial Unicode MS,271D,CROSS:LATIN'
                svgIcon[116]='Arial Unicode MS,2720,CROSS:MALTESE'
                svgIcon[117]='Arial Unicode MS,271B,CROSS:OPEN CENTRE'
                svgIcon[118]='Arial Unicode MS,2719,CROSS:OUTLINED GREEK'
                svgIcon[119]='Arial Unicode MS,271F,CROSS:OUTLINED LATIN'
                svgIcon[120]='Arial Unicode MS,271E,CROSS:SHADOWED LATIN'
                svgIcon[121]='Wingdings,f0b1,CROSSHAIRS:CIRCLE'
                svgIcon[122]='Wingdings,f0b0,CROSSHAIRS:SQUARE'
                svgIcon[123]='Webdings,F095,DAGGER'
                svgIcon[124]='Wingdings,f05d,DHARMA'
                svgIcon[125]='Arial Unicode MS,2756,DIAMOND: MINUS X'
                svgIcon[126]='Webdings,F0FF,DOVE'
                svgIcon[127]='Webdings,F0F1,DRONE'
                svgIcon[128]='Wingdings,f053,DROP OF WATER'
                svgIcon[129]='Webdings,f060,ENCLOSED'
                svgIcon[130]='Webdings,F04E,EYE'
                svgIcon[131]='Wingdings,f04c,FACE:FROWNING'
                svgIcon[132]='Wingdings,f04b,FACE:NEUTRAL'
                svgIcon[133]='Wingdings,f04A,FACE:SMILEY'
                svgIcon[134]='Webdings,F066,FIRE ENGINE'
                svgIcon[135]='Wingdings,f04f,FLAG'
                svgIcon[136]='Arial Unicode MS,2740,FLORETTE:'
                svgIcon[137]='Arial Unicode MS,273E,FLORETTE:6 PETALLED SOLID'
                svgIcon[138]='Arial Unicode MS,2741,FLORETTE:8 PETALLED'
                svgIcon[139]='Arial Unicode MS,273F,FLORETTE:SOLID'
                svgIcon[140]='Webdings,F059,HEART'
                svgIcon[141]='Arial Unicode MS,2766,HEART:FLORAL'
                svgIcon[142]='Arial Unicode MS,2764,HEART:HEAVY SOLID '
                svgIcon[143]='Arial Unicode MS,2763,HEART:ORNAMENT'
                svgIcon[144]='Arial Unicode MS,2765,HEART:ROTATED BULLET'
                svgIcon[145]='Arial Unicode MS,2767,HEART:ROTATED FLORAL'
                svgIcon[146]='Wingdings,f036,HOURGLASS'
                svgIcon[147]='Webdings,F0D1,KEY'
                svgIcon[148]='Webdings,f07e,LIGHTNING'
                svgIcon[149]='Webdings,F085,MASK'
                svgIcon[150]='Webdings,f091,MONEYBAG'
                svgIcon[151]='Webdings,F0AF,MUSIC'
                svgIcon[152]='Arial Unicode MS,2712,NIB'
                svgIcon[153]='Webdings,F054,OCEAN LINER'
                svgIcon[154]='Arial Unicode MS,2761,PARAGRAPH ORNAMENT'
                svgIcon[155]='Wingdings,f050,PENNANT'
                svgIcon[156]='Webdings,F0EB,PIN'
                svgIcon[157]='Webdings,F070,POLICE CAR'
                svgIcon[158]='Webdings,F073,QUESTION'
                svgIcon[159]='Wingdings,f0b4,QUESTION:DIAMOND'
                svgIcon[160]='Webdings,F0F9,ROCKET'
                svgIcon[161]='Webdings,F071,ROTATE'
                svgIcon[162]='Webdings,F06B,SATELLITE'
                svgIcon[163]='Webdings,f064,SHIELD'
                svgIcon[164]='Wingdings,f04e,SKULL CROSS BONES'
                svgIcon[165]='Arial Unicode MS,2744,SNOWFLAKE'
                svgIcon[166]='Arial Unicode MS,2746,SNOWFLAKE:CHEVRON'
                svgIcon[167]='Arial Unicode MS,2745,SNOWFLAKE:TRIFOLIATE'
                svgIcon[168]='Arial Unicode MS,2747,SPARKLE'
                svgIcon[169]='Arial Unicode MS,2748,SPARKLE:HEAVY'
                svgIcon[170]='Webdings,f021,SPIDER'
                svgIcon[171]='Arial Unicode MS,274F,SQUARE:LOWER RIGHT SHADOWED'
                svgIcon[172]='Arial Unicode MS,2751,SQUARE:LOWER RIGHT SHADOWED'
                svgIcon[173]='Arial Unicode MS,2750,SQUARE:UPPER RIGHT SHADOWED'
                svgIcon[174]='Arial Unicode MS,2752,SQUARE:UPPER RIGHT SHADOWED'
                svgIcon[175]='Wingdings,f05a,STAR AND CRESCENT'
                svgIcon[176]='Arial Unicode MS,2721,STAR OF DAVID'
                svgIcon[177]='Webdings,f06C,STAR'
                svgIcon[178]='Wingdings,F0ae,STAR:10-POINTS'
                svgIcon[179]='Arial Unicode MS,2739,STAR:12 POINTED SOLID'
                svgIcon[180]='Webdings,F098,STAR:3-D'
                svgIcon[181]='Wingdings,F0a9,STAR:3-POINTS'
                svgIcon[182]='Wingdings,F0aa,STAR:4-POINTS'
                svgIcon[183]='Wingdings,F0ab,STAR:5-POINTS'
                svgIcon[184]='Arial Unicode MS,2736,STAR:6 POINTED SOLID'
                svgIcon[185]='Wingdings,F0ac,STAR:6-POINTS'
                svgIcon[186]='Arial Unicode MS,2735,STAR:8 POINTED PINWHEEL'
                svgIcon[187]='Arial Unicode MS,2734,STAR:8 POINTED SOLID'
                svgIcon[188]='Wingdings,F0ad,STAR:8-POINTS'
                svgIcon[189]='Wingdings,f0b3,STAR:ARC-ROTATED'
                svgIcon[190]='Wingdings,f0b2,STAR:ARC'
                svgIcon[191]='Arial Unicode MS,2742,STAR:CIRCLED OPEN'
                svgIcon[192]='Wingdings,f0b5,STAR:CIRCLED1'
                svgIcon[193]='Arial Unicode MS,272A,STAR:CIRCLED2'
                svgIcon[194]='Arial Unicode MS,2727,STAR:FOUR POINTED'
                svgIcon[195]='Arial Unicode MS,272E,STAR:HEAVY OUTLINED'
                svgIcon[196]='Arial Unicode MS,2738,STAR:HEAVY RECTILINEAR'
                svgIcon[197]='Arial Unicode MS,272B,STAR:OPEN CENTRE'
                svgIcon[198]='Arial Unicode MS,272D,STAR:OUTLINED'
                svgIcon[199]='Arial Unicode MS,272F,STAR:PINWHEEL'
                svgIcon[200]='Arial Unicode MS,2737,STAR:RECTILINEAR'
                svgIcon[201]='Wingdings,f0b6,STAR:SHADOWED1'
                svgIcon[202]='Arial Unicode MS,2730,STAR:SHADOWED2'
                svgIcon[203]='Arial Unicode MS,272C,STAR:SOLID CENTRE'
                svgIcon[204]='Arial Unicode MS,2726,STAR:SOLID FOUR POINTED'
                svgIcon[205]='Arial Unicode MS,2729,STAR:STRESS OUTLINED'
                svgIcon[206]='Wingdings,f0a5,TARGET'
                svgIcon[207]='Webdings,f074,TRAIN'
                svgIcon[208]='Webdings,F0D8,WEATHER:CLOUDY RAIN'
                svgIcon[209]='Webdings,F0D9,WEATHER:CLOUDY'
                svgIcon[210]='Webdings,F0D7,WEATHER:PARTLY CLOUDY'
                svgIcon[211]='Webdings,F0D6,WEATHER:PARTLY SUNNY'
                svgIcon[212]='Webdings,F0DB,WEATHER:RAIN'
                svgIcon[213]='Webdings,F0DA,WEATHER:SNOW'
                svgIcon[214]='Webdings,f0d5,WEATHER:SUNNY'
                svgIcon[215]='Webdings,F0DC,WEATHER:THUNDER SHOWERS'
                svgIcon[216]='Webdings,F0DD,WEATHER:TORNADO'
                svgIcon[217]='Webdings,F0DE,WEATHER:WINDY'
                svgIcon[218]='Webdings,f022,WEB'
                svgIcon[219]='Wingdings,f052,WHITE SUN WITH RAYS'
                svgIcon[220]='Arial Unicode MS,2715,X:'
                svgIcon[221]='Arial Unicode MS,2717,X:BALLOT'
                svgIcon[222]='Arial Unicode MS,2718,X:HEAVY BALLOT'
                svgIcon[223]='Arial Unicode MS,2716,X:HEAVY'
                svgIcon[224]='Wingdings,f05b,YIN YANG'


    - Consider MarkDown / HTML formatting to Text shape - do we really need this?
    - PBI can change type of W after created, ie Table to Matrix
    - How to incorporate fancy W types, ie half circle with needle / doughnut / etc ...
        - see SVG http://svgdiscovery.com/C/svg-donut-arcs.htm
    - add video as shape
    - ArrowThin is not inside the W container => difficult to drag and drop, hangs over others, difficult to place, looks funny.  Also, the Arrow header is not always the same colour as the line.  Make more sophisticated to set tail (line) length -> so line length = 0 makes it s simple arrow head, or Triangle.  Also dimentions for head size - height and width.  Can these be done with a mouse ?
    - consider triangle as a new shape - not sure it is needed, or if can be done via thin arrows
    - are thin Arrows just Arrows without the body??
    - make it easier to add co logo, ie Add logo menu option.
    - have polygon - 6 sided doughnut as shape
    - have pentagon as shape - can divide background in 2 colours with a slant
    - #pagenr and #pages in Template: it takes the page Nr from the template, and not the main Dashboard.  Consider changing it.
    - consider HTML or MarkDown inside text boxes and bullets.  Consider the benefit.
    - Bullets: move up and down arrows to arrange the points
    - Improve borders: current with 4, 1 per side so that one can have a Box with a thin gray border and one side a blue line
    - Text: add StrikeThrough to bold, italics. With Ctrl-B, etc.  SuperScript and SubScript ?
    - TextBox (new shape):
        - Ideally a third party control, that writes to HTML and Canvas then puts this into the InnetHTML: <div [innerHtml]="getSymbol()"></div>
        - can edit individual strings inside the one textbox
        - can have text at top, and bullet below it
        - different font sizes
        - add StrikeThrough to bold, italics. With Ctrl-B, etc
        - SuperScript and SubScript ??
        - make it easy to insert symbols = unicode UTF8
    - Easy to add images - select from file or use url
    - Next (slide) button ...
    - Effects !  Ie Text slides in from right ...  With CSS
    - Code shape - looks like code !
    - Gifs ...
    - Math formulas - no way unless we use third party tool !
        - easy peezy, just use SVG.  See http://svgdiscovery.com/Text/dynamicText.htm
    - Thumbnails - open on side and jump to tab by clicking on it, see:
    https://www.npmjs.com/package/dom-to-image
    - Need a LINE !!
        - consider drawing this via the mouse
        - must be stretchable via dragging endpoints.
    - Add icons (colour and variety of images) and symbols, that can be resized: see
        https://www.w3schools.com/charsets/ref_utf_misc_symbols.asp
    - Arrange and size blocks inside blocks - click one, select center, click second ...?
    - Needs a big question mark
    - Speaker notes
    - when adding an image, the height and width is all over the place.  Store that in the widget definition somewhere.
    - Time keeping ...
    - consider separate menu options and forms for Shapes, might be easier for user and also gives more flexibility (and easier code).
    - Insert clip art ...
    - align selected shapes ONLY: click big box and smaller box inside it, select Center and the smaller one is centered RELATIVE to the bigger one.  This is needed!
    - guide rails like Google: drag a box past another box, and red lines appear to show it aligns with the top, middle, bottom of another box, or center of page.  And also when things are equi-distant.  This I assume is serious code.
    - Text: capitalisation, ie Short Demo ??  Really, really needed?
    - Text: truncate option:
        <p class="truncate-text">If I exceed one line's width, I will be truncated.</p>
        .truncate-text {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 200px;
        }
    - barGauge, see http://svgdiscovery.com/HMI/BarGauge/barGaugeObject.htm

    Draw Mode (Shapes):
    -------------------
    - make the whole canvas interactive once you click DrawMode
    - hand-drawn lines / pics with mouse! => creates a normal W, with sizing and positioning so that it is top left :-)
    - add handles to arrows, lines, etc => use this to position and rotate and make longer / resize !
    - curved lines, bazier curves

    Users and Groups:
    ----------------
    - enhance granting of permissions on the form: can add new Dashboards to a user, group, OR show all of them and check / uncheck.  Think clearly about UI and use case.

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
    - currently: put Widgets A, B into a group and unselect.  When select Widget C, then the group will also become selected, so A, B, C selected.  This could make sense - think about the use case and consider changing it.
    - can duplicate a group, and can also copy a group from one tab to the next?
    - can have multiple groups?
    - when move group and then undo: the whole group has to jump back to original position.


    Speaker notes:
    --------------
    - Notes that can open in separate Browser Tab.
    - Also, can show speaker notes on different screen!
    - Add timer.


    Palette:
    --------
    - make Palette button sizes dynamic - small, medium, large, and make this a user setting.  Make sure div around it is also sized dynamically.
    ButtonBars: Decide on what to do with Widget- and Shape-ButtonBars and 2 forms - AFTER UI and functionality has been decided.  Maybe remove them, or only allow for order ... For now,palette cannot be changed.
    - expand palette / menus: add regularly used tasks/actions, ie add a circle (with one click)
    - generalise this: user can record task/actions!!  For example, add arrow, gray with black border at 45 degrees = recorded and add as a button !!!
    - make icons draggable - like Ubuntu palette on left !
    - relook at toolbar colour
    - add input elements, ie checkboxes and dropdowns (see MS Ribbon)
    - consider palette per Widget (Jaco)
    - group related things together, see Google
    - if more than 1 widget type has same function, make ONE on palette menu (thus icon is used once), and figure out inside what fn to call depending on type

    Themes:
    -------
    - consider light, etc themes, see https://medium.com/@amcdnl/theming-angular-with-css-variables-3c78a5b20b24


    Tasks: (enhance form and functionality)
    -----
    - Incorporate tasks into Landing page?
    - notify when not done (by deadline)
    - easy to see outstanding tasks
    - email / notify when a task ends, starts
    - powerful filters
    - can just give deadline (optional start, duration)
    - consider integration with Jira - create tasks in Canvas and add then automatically to Jira! It is more popular than Trello.  See:
    https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/


    Global Variables:
    -----------------
    - Consider which ones to keep in vars, which to load from DB each time
    - Consider depricating gv.currentWidgets, gv = global.variables.  THINK !  Can 1) make  app.currentWidget = gv.currentWidget, ByRef.  Test that this always updates.  2) always refresh  gv.currentWidget  3) delete gv.currentWidget - check where uses and how.  THEN: consider all currentXXX, where XXX = Objects to follow the same methodology.

    SQL Editor:
    ----------
    - add SQL editor (maybe third party plug-in) = full-blown thing
    - at least show tables and fields in a dropdown ...

    Usage: (of data)
    ------
    - Closely monitor usage of data (who accessed what and when).  Then consider (very carefully) a payment plan for data usage - simply like a data vendor ...
    - owners
    - DBs accessed
    - #rows extracted
    - who used what when
    - where in schedules
    - permissions (who has or has not)
    - link to Business Glossary


    Canvas Server:
    ----------
    - consider a much larger project, say with a visual GUI to show processes / transformations
    - connector for S3 - https://github.com/andrewrk/node-s3-client
    - connector for Analytics Services - https://docs.microsoft.com/en-us/javascript/api/overview/azure/analysis-services?view=azure-node-latest
    - connector for Outlook
    - connector for Git
    - consider language equivalent to DAX or M
    - chart Real Time data, maybe via Web Sockets.  Can also be a summary / snapshot of the data every x minutes, something that Dries would want
    - authenticate via their system, ie AD
    - must be able to create new Widget
    - consider: get the SQL for an Overlay query, might be useful
    - get SQL back from an Overlay query -> show on screen so user can see
    - consider data filters - then we have to store this and include in SQL Where clause ...
    - Add Named-Transformations: have a CRUD form where user specifies a name, and a list of transformations to be performed with it.  Maybe give a start DS -> can only work if the requested DS has this layout, plus has field types, etc to calc and also know it will work.  Seems best solution to have a start DS.
    - Show Transformations and Spec as json !!
    - Transform with IF this then that value Statement !
    - Content / Context filtering:
        - create a Transition called ContentFilter (or ContextFilter), which takes 2 params: field name (say Region), table name (say TN).  
        - TN must be loaded before from a file, and contain two fields: the field name, and userID that may see the data.  For example:

        Region         UserID
        Gauteng       JohnM
        Free State    AnneS
        ...

        - the filter is not applied generally, but only applied when created explicit by the user on a DS.
        - during the transformation pipeline, table TN will be joined to the data (in SQLite or Pandas), and UserID filtered on the current userid.
        - the result is only the records that the current user may see.


    Create DS via File:
    -------------------
    - consider multiple files, in which case to loop over files Array
    - consider drag and drop from external places - see example in
        https://www.html5rocks.com/en/tutorials/file/dndfiles/

    Auto create of Dashboards:
    -------------------------
    - consider converting an excel spreadheet into a Dashboard, automatically.  With graphs and all.  Of kors, we need a use case for this.

    Business Glossary:
    -----------------
    - tag Tables, Fields
    - tag data in context
    - tag Dashboards, Widgets
    - flexible and customisable
    - searchable (NB), can see Dashboards and Descriptions on list
    - can jump to relevant Dashboards from here

    Product Design:
    --------------
    - do we do data virtualization???  If so, get best practice and key points
    - ask Joya for unique marketing method, ie not billboards
    - title of TIBCO person: Senior Solutions Engineer ...

    New Events:
    - generic place to store events, say Date, Category, DS-id (optional), Code, Description, Capturer/Source, CaptureDateTime. With form to capture and view.
    - can then either graph this (ie nr of type XXX new events), or join to DS data on DS-id, or just show on a timeline with other data (say as a small marker on each day where there were News Events of a certain type)
    - this can be very cool - need to make sure we do it well though.


    Bookmarks:
    ---------
    - consider bookmark(s), gives filters at a point in time.  Can send this to other users, and will open with these filters applied.
    - can this be used in a presentation, ie Bookmark1 = Overall, Bookmark2 = drill down

    Presentation Mode:
    -----------------
    - take menus away (cater somehow for the gap during design, unless you design with this OR *ngIf menu out)
    - status bar becomes simple and replaces existing (think if this is really necessary) with name, page n of m, <> arrows.  Maybe just add page n of m to existing one!!

    Canvas Server:
    ----------
    - Read more - see Pentaho ETL / Data Integration for features.
    - consider Views on DS: one DS definition, many views which could be aggregations. 
    - make an Aggregation Transformation: fld3, SUM(fld1 AS xxx, fld2 As yyy) GROUP BY fld3

    Authentication:
    ---------------
    - cater for Microsoft AD
    - cater for single sign-on - somehow



    PDF / IMAGE:
    ------------
    - can save Dashboard as pdf - see https://github.com/MrRio/jsPDF.  Works but messes up the html - probably Angular and Clarity that cause it.  Tried canvas2html - does not seem to work too well either.
    - See: https://stackoverflow.com/questions/14552112/html-to-pdf-with-node-js
    - also, SVG-> PDF see http://svgdiscovery.com/C/svg-print-save-PDF.htm
        Rather: https://stackoverflow.com/questions/38996376/generate-pdf-file-from-html-using-angular2-typescript,  or  https://stackoverflow.com/questions/42900319/how-to-convert-html-to-pdf-in-angular2  or  https://www.npmjs.com/package/jspdf
        - can send Dashboard as Email Attachment (in pdf or pic). To do this via Gmail, use its API - see https://www.sitepoint.com/sending-emails-gmail-javascript-api/
        - can copy whole D as image - can paste somewhere, or print and put on wall
        - view pdf docs insides forms: see https://www.npmjs.com/package/ng2-pdf-viewer
        - make sure we can have hybrid DS - cloud and local and server in one D
        - view Thumbnails of all T - can selected ala PowerPoint
        - Have popup thumbnails of D on Landing page
        - Use thumbnails to select a W from another D - have thumbnails are on/off option for performance perhaps
        - got is working (sort of) with: http://www.shanegibney.com/shanegibney/angular2-and-jspdf-file-generation/

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


    Messages: (enhance form and functionality)
    --------
    - give more sort and filter - ie all per user, topic
    - consider tags / keywords.  Also, is there a central keyword store?  For example, the same keyboards / tags used for Dashboards and Widgets and Messages?
    - easy to show / access unread ~ use of inbox as todo list in Google
    - link to Company platform, ie Skype?
    - make messages visible, ie hover shows latest collaborations
    - send only to authorised email list on a D (optional feature) if it exists
    - see if recipients can be linked to data, ie Clearing Member selected on Dashboard, then send to HIS email address only

    Alerts:
    ------
    - pulse alerts aligned to a dashboard with thresholds acceeded
    - user wants to know when trades exceed 90% percentile, and then get 1. an alert and 2. a Dashboard attached with the relevant info


    Dashboard Permissions:
    ---------------------
    - currently cannot grant permissions to Draft, which is Private.  Re-Consider this: should draft be Shared, Scheduled, etc?  And what happens to permissions when saved back - should it revert back to previous permissions for the Complete version, or inherit the next version (dont think so, as this means one has to wiggle this a bit ...)


    News Events:
    -----------
    - time series graphs with annotations


    Notebook: Style
    --------
    - emulate a Jupyter NB style - run code inside and show results (with Python code editor windows inbetween the results)
    - does regression by choosing type of regression
    - R built in


    Data Scientist:  More advanced functions
    --------------
    - has math and date time and stats functions in calculated fields


    Business messages:  See How We Can Incorporate This
    -----------------
    - business tool for business to write own reports
    - large effort in developing reports

    There are two types of BI:
    - self-service, where a business user, ie CFO, does own graphs
    - enterprise BI which is closely controlled.
    There is space for BOTH, and Canvas supports both. Note that we dont spread the DS distributedly, which becomes a management nightmare.

    They needed to find a way to:
    - get more from data
    - offer more value
    - innovate
    - grow with clients
    - compete to attract talent
    - how to simplify reporting
    - visualize reports
    - share reports with all levels
    - join different pockets of data to get insight
    - growing rate of amount of data
    - measurement scorecard
    - peer scorecard
    - see trends real time
    - centralize reporting
    - can access reports from anywhere including mobile
    - more factual, visual decision making
    - pulse alerts aligned to a dashboard with thresholds acceded
    - governance in who can see what
    - helped by structured data strategy
    - want to apply AI and machine learning which is not easy as one requires a baseline over a period of time
    - get new insights to run business better
    - build a competitive advantage
    - see he customer behaviour is changing
    - better understanding of company impact
    - performance measurements of staff
    - strategic partnership with product provider like Sisense
    - all levels in company sees same reports
    - real time insights will become more important
    - all businesses are now data businesses
    - Data is the new oil
    - they believe in reports by business people by business people
    - agile which means don't need SQL
    - can answer any question immediately
    - every one must be able to access tool
    - dashboards visually appealing
    - can use scripts if need be
    - can annotate data and text comments called key takeaways or key insights
    - uses Northwind SQL db for demo
    - imports data and shows relationships from SQL DB
    - can link from different sources ie Excel and SQL  DB.  See (for node): https://www.npmjs.com/package/xlsx
    - can also do calculated fields
    - change headers
    - can change data type
    - then build elastic cube which imports data which can also be scheduled
    - can also do live connect to get real time data
    - formatting gauge widget via a popup
    - can add conditional formatting with multiple rules
    - can add kpi to alert - in popup can give email or mobile to notify via above threshold or always
    - new widget via popup which makes suggestion on widget type
    - can show pivot table and switch to graph
    - Multiple Dbs → 1 Dashboard
    - Joining different Dbs on different keys and values
    - Dev – 60% + of time on ops reports !
    - Messages = IM
    - ERD tool – and central data Dict
    - available on mobile
    - snapshot = G Drive previous version = version control
    - Industries: customer service, marketing, finance, social responsibility, healthcare, - human resources, manufacturing, retail, sales, IT, education, computer software, telecom, executive, supply-chain
    - report = simple Dashboard
    - Explore = discover
    - Canvas = powerpoint-lite, dashboard, data virtualisation-lite, transformations, data - governance-lite
    - World class, easy insight from any data, agile tool, full BI scope (1 tool with less resources), instant deployment, short learning curve (hrs not weeks), can blend data together, analysis = slice and dice, impact = actionable insights, deploy = cloud, on-prem, hybrid, embed = secure and white label, govern = secure and control your data, customer success, instant impact: quickly up and running and deliver ROI within weeks or months, no need to involve IT resources to tackle complex data, no DBA or scripts required, increase customer satisfaction, easy to use front end, open API architecture, latest socket technology, access control, full reporting suite allowing for user customisation, dashboard for key statistics, easy to use with minimal training, unlimited number of users, no upfront capital expenditure (if in cloud), easily scale up or down, pay as you go?, remote working, empower your employees
    share Dashboard – also sends out email

    Data Profiling:
    --------------
    - this is a whole thing, see Microsoft SQL data profiler
    - gives col info: length, null ratio, pateer, value distribution, stats
    - possible foreign keys between two tables

    Twitter interface:
    -----------------
    - incoming: show a twitter feed as a Widget
    - outgoing: send a graph with user text to Twitter, see https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/overview

    Connectors:
    - Connector to git hub !!!
    - Strata connector !!!
    - Sybrin needs hadoop / spark support

    Packages:
    --------
    - consider these
    - Lighthouse
    - Service worker
    - AngularFire


    Templates:
    ----------
    6. When a T is changed on a template, the user is warned which Ds use it - he can see their names and maybe even open them.
    8. A D may have many tabs, which tabs of Template is used where, or just first one on all D tabs?

    Layouts:
    - store template Layouts in DB - currently hardcoded in form
    - Create form: just add any number of containers to a Tab, then click this option.  It must save their dimensions, a thumbnail and create records in DB (template layouts).
    See:
    https://github.com/rioki/node-thumper
    https://libraries.io/npm/express-thumbnail
    https://www.npmjs.com/package/capture-chrome
    https://www.npmjs.com/package/capture-phantomjs
    - consider to have a Layout per Tab - easy to do if adding a TabID to the DashboardLayout record ...

    StatusBar:
    ---------
    - the StatusBar must not grow beyond screen width, or to double line
    - page # from pages
    - custom select of elements on StatusBar: ie ViewMode/EditMode, Version, etc
    - add Ctrl-Backspace to go back to the previously opened tab, useful if jumped randomly using Tabs popup (just keep prevID, and if pressed then replace with current => toggle between two.  Think this can be useful)
    - Statusbar needs word (make more clear what it does), 
    - Also, the background is very dark and heavy.  Relook at this with the menu bar background.

    Audible sounds (on statusbar):
    -----------------------------
    - add user option to turn on/off
    - add user selection of sound (.wav file to play), see:
        https://www.zapsplat.com/sound-effect-category/button-clicks/
        http://soundbible.com/1705-Click2.html
        http://www.findsounds.com/ISAPI/search.dll?keywords=mouse+click
        http://www.freesfx.co.uk/soundeffects/button-clicks/


    Editor:
    ------
    - allow to transform editing of D to another user, provided she has the rights to edit.
    - on separate form, filtered with right access rights?, with space for a message
    - send message to new user
    - update D record and switch to viewonly for current user


    Animation:
    ---------
    - consider this ...  This may have serious consequences for structure, or could simply be a list of object IDs in sequence, and animation disable = false them in sequence!
    - arrow keys or enter if nothing selected could trigger animation.


    Container:
    ---------
    - container: consider 100% height / width option => fills parent div element.
    - easy way to fit container around context, ie edit words in a Text box and now the container with a border is too small / large.
    - consider colour in HEX code
    - Arrow: make dynamic!  For both size and rotation, taking into account that it has to land inside the W container at all times, and preferably left top corner for easy placements.  Also, consider shrinking W container, ie with *ngIf on title and other grid areas ...  Look at:
        . https://www.w3schools.com/css/css3_2dtransforms.asp
        . https://learn.shayhowe.com/advanced-html-css/css-transforms/
        . https://robots.thoughtbot.com/transitions-and-transforms
        . https://www.w3schools.com/cssref/tryit.asp?filename=trycss3_transform-origin
    - consider MULTIPLE edit:
        - select more than one, open Container Form.
        - apply changes to ALL selected ...

    Canvas Schema Changes:
    ---------------------
    - get a visual tool that will help with changes to Canvas Schemas
    - maybe: check code where something is used, change model, and update DB (delete or edit or add a field).  Of course, only after a proper BACKUP !

    Data Quality:
    - Data Quality issues: add place to add detail values.  An overall statement can say all data  has an issue, but a specific one must identify the column(s) and row(s) affected, thus given the IDs or key values.


    Widget Editor - Adv: Features to consider at a later stage
    --------------------
    - General
        - look at use case: do we need a little pic / icon next to each bar (title, x, etc) to make it easier to recognise?
        - save config / style of stuff, say Title, X, etc so that graphs can look and feel the same.
    - add url to open a web page
    - add click (and right click?) events to graph -> can DRILL or can apply Graph Conditional Filter !
    - look at DAX and M for the Graph Calculated Fields.  Maybe datum.Field is written as [Field] as this is more known ...
    - must be able to create new Widget - trick is to make a simple way to specify how and what fields to add, it X or Y ...
    - have Market Place for Dashboards and Widget, can export and import to there - so can reause and learn from others
    - keep widgetStoredTemplateID on Widget => we know where it came from
    - Widget Stored Templates: consider auto-update checkbox.  When checked, and template changes, ALL Widgets created from it will change (using widgetStoredTemplateID).  Can consider the converse: when the Widget from which the Template was created changes,
    the Template will be updated.  This could trigger auto-update.  Consider use Case first.
    - consider conditional formatting on the field - ie show in blue or show icon.  Issues: 1. what if more than one conditional format?  2. too many icons on field bar.

    - Title
        - can save and re-use style, ie graphs for Finance will then all look the same
    - Pan & Zoom:
        - how!?

    - Types:
        - suggest graph types based on fields selected (ie 1 quantitative field means could do a
        tick or pie chart)
        - consider reset button ?  Not sure what use case will be
        - geoShapes: enhance so that one can customise the inputs, layouts, etc.  Then use with layers (ie names or Mark_size=circles with colours to show related info to a spot)
        - Cross hair with showing values on axis - ie crypto trading websites!
        - Look at embeding widgets -> export Vega spec + embed line, user puts it in his html ...?
        - For a GAUGE, see    https://gist.github.com/anilkpatro/0cf0503b581556a14aab
        - For SVG Gauge, see http://svgdiscovery.com/HMI/AnalogGaugeObject/analogGaugeObject.htm
        and http://svgdiscovery.com/HMI/Button/AnalogGauge/buttonGauge.htm  !!!
        - For KPI charts, see https://www.zoho.com/reports/help/dashboard/kpi-widgets.html.  Must include target, and progress (either % with green/red arrow since last month or graph ytd) and level of achievement (ie combo graph with line as target).  Try to use Clarity CARDS for this - else just a simple TEXT box.  The TRICK is the period (current and comparative and scale), ie. show Total Sales (sum of field Sales) for Oct (current month), and green up arrow if bigger than Total Sales for Sep (previous period).  Could also be Show Average Income YTD compare to a set value (read from another file / table) with or without a period next to it ...  So, need a whole store here.  Advanced version: a small line graph of the Total Sales per month for last 12 months ...
        - embed graphs created in Python and R - ie. Seaborn
        - Add layers of projections, each one with specific info: crime, lightning, etc
        - Have a key indicator (dot) on a map, and click it to open a graph or snippet (of say historic crime rates).  Would need cloropleth - maybe with right click menu to open different graphs / popups.  
        - add network plot / graph
        - Consider graph render: with each change (option to check this ability)
        - Render graph with a keystroke (ctrl-R)
        - Move in history with ctrl-z and ctrl-shft-z.  
        - Make Calc Help searchable, with even dropdown to find things.  
        - Colour_Scheme: show dots with range.  
        - Store Widget filters and conditional formatting with predefined names per DS.  
        - Angle not intuitive: maybe slider
        - opacity: maybe slider with blockie to indicate change 
        - Consider restrictive colours - may only use this given set of colours, and make a scheme for the corporate CI.  
        - Col and Row not intuitive - add help.
        - Surface temp since 1650 - can canvas do it ?
        - Can we normalize data - relative to starting point ?
        - Need data point annotations - ie what happened here? Can we have TEXT write something here which can be used for tooltip?

    - Local Names
        - Investigate if this make sense: user can name a field (per DS or even per Widget?) over and above what is done at DS level - use case?

    - Spec: 
        - allow to import and then reverse engineer what the Widget fields are.  Easy to do, but looks of work and has to be updated in parallel to any changes made to the other way.
        - also, allow custom specs to be created, sorting out %x, %y, %color parameters where these fields must be placed.

    - Mark:
        - stroke, strokeWidth
        - text Mark, with text properties (similar to X and Y)
        - drill down - click on column in bar and jump to another on fly
        - interactivity - ie hover and show data labels
        - trendlines
        - color per bar
        - more graph types, ie D3.js
        - suggest graph types based on fields and their types selected?
        - add more properties for Text mark, ie dx, dy, etc on form

    - Fields:
        - symbol

    - Preview:
        - dataQuality (nr of issues, text of last one)
        - tooltip with field description
        - data ownners (nr of issues, text of last one)
        - hide and order fields here ?

    - Transformations:
        - this is a BIG opportunity
        - allow for Sorted array of transformations, any type in any order
        - add Window, Rank, etc
        - must be extensible - can build own transformations and hook it up

    - Third party code (ie Grip forms for Rulesets) - Ivan:
        - we treat this as a selling point (differentiator)
        - allow stuffies like this, can add to ENV config => shows on menu
        - us or user can write the Angular forms
        - just add a calling function (maybe even generic like the current Palette buttons)
        - and only the specific user will see his menu items and forms!

    - Calculated field
        - make easier: either show boxes for fields with correct type, or auto complete, VSCode style !
        - full UI to select fields and formulae in easy way, also give proper space for params, ie some take 1 param, some take 2, validate (try catch or some clever way)
        - Calc % of TOTAL !!  Maybe make this a checkbox (and do in background):
          "transform": [{
            "window": [{
                "op": "sum",
                "field": "Time",
                "as": "TotalTime"
            }],
            "frame": [null, null]
            },
            {
                "calculate": "datum.Time/datum.TotalTime * 100",
                "as": "PercentOfTotal"
            }]

    - Window
        - add this!
        - How to show comparison between current and previous period ?
        - Make rank without a GroupBy field - is there a use case for this?

    - Filters
        - Show value range in fields: Select Total field in dropdown, then it shows that Total values ranges from say 0 to 100, and maybe even some stats like average...  Only if usecase.
        - Add Selection Predicate
        - Add Pre and Post filter indicator: Pre is at start, then other transformations like Windows, and then Post.  Serious power.
        - for string fields: show top 10 distinct values ?
        - for numbers: show range min to max ?
        - add dates: maybe add calendar drop down, with {"filter": {"field": "date", "range": [{"year": 2006, "month": "jan", "date": 1}, {"year": 2008, "month": "feb", "date": 20}] }} checks if the date’s value is between Jan 1, 2006 and Feb 20, 2008
        - add PRE and POST filter, like WHERE and HAVING, at start and end of Transformation[]
        - consider showing them: 1. with a filter symbol next to + symbol for Calculated fields  2. per field affect, ie in blue.  Not sure how to manage more than one filter per field, or seeing the full picture if 50 fields with 3 filter scattered through the list.  Think use Case.
        - if a field is used in a Widget filter (>= 1 time), then show visual clue on Fields list, ie in blue.  There are too many suggestions to make this blue - so think which one to use, if any.

    - CONFIG:
        - how and where used?

    -   Scale/Axis (later):
        - rangeStep
        - domain
        - clip: true
        - colour
        - range
        - Legend: more fields like orient, fill, color, padding

    - Data
        - Consider showing Spec with data as well - first determine if use case for it.
        - Python and R brings back data sets !!!

    - Row & Column:
        - get setting for labels = null -> does not show


    - Colour Editor / Manage Colours:
    --------------------------------
        - after ADD, the colour goes to right hand side.  It seems okay - means not part of the original colours.  What are the downsides to this?

    - Board Pack use case:
        - this is of definate value !!  Maybe add some specific functions to make it work well ...

    Management tools / Utilities:
    ----------------------------
    - Canvas Data Migration tool to help changes DS and W when the underlying database changes
    - DS inspector: looks for DS that are identical / similar to spot duplication and copy - paste problems where DS are just duplicated and not re-used
    - Business Glossary must be super powerful to help preventabove problem


**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************
**********************************************************************************










    One day stuff:
    -------------

    - have TS scripts inside Canvas
    - investigate IFrames
    - Bezier curved arrows that can connect to rectangles
    - Workflow via diagram
    - Embedding: seems like a huge demand: companies what it all to look and feel like their app
    - Speech driven
    - Dragable side-panel
    - Team collaboration.... Editing the same Widget at the same time
    - Chalk font
    - Have Cancas cheat sheet !!! Look at ggplot cheat sheet - how to build good graphs, can use colour with a hue
    - Gray background with white grid !!
    - Has graph title and sub title (useful?)
    - Can we do SA largest municipalities with their names, on a map
    - See shiny interactive form and filter on side !!! 
    - Qlik and power bi integrates with r - use data frame or embed plot
    - Want to make dashboard available to clients globally - how will the login and security work
    - have an easy way to share a Canvas graph: code to embed Vega and link to Spec, access to data.  Thus, can be created anywhere.  Use case?  May be better to have web components.
    - interactive modeling.  Say you have accounting data, and want to:
        - modify the data (ie exclude some expenditure in a month as once off, etc) while keeping the original data intact
        - build a forecasting model
        - visualise the data
        - see it is not right, modify the data above or modify the model
        - visualise and repeat (Oksana !)
    - read data from other schemas: Excel, PowerBI models, Tableau - which means migration is easy !


    Renderers:
    ---------
    - have different renderers, other than browser (for same Dashboard)!


    End of One day stuff:


