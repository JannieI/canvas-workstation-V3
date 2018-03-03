# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)


**Global / Overall issues / Settings**
1. Test everything with 1000 - ie Dashboards, Widgets per D, etc - to check performance and to see it form layout (ie grids sizes) will copy with large volume
2. Standard unit of measure: maybe save all as rem, and user can select px, rem, etc?
3. Use style.css for standard items, ie class="helpMessage"
4. Standardize date format shown - as selected by the user, stored as settings
6. 
7. Setting min Grid width - wait for Clarity Bug fix
8. 
9. LocalDB - how to add a table without deleting the IndexDB manually ??



**API**
1. Have flexible field selection: ie ..."fields": [A, B, F]


**1 Feb 2018**


For now:
- it is possible to use Vega sliders as well - these apply only to the graph on which it appears, and is applied after the Sl is applied.  Important, if Sl has no W linked to it, the dSet must still be obtained.
- all W use same WidgetComponent => drag and drop, resize, selection, align, delete, refresh-DS, etc are DRY. But the following is different according to the different types: refreshing, clicking (ie Sl refreshes data) ?


Different versions of Vega:
- keep version on W in DB
- Upgrade Util: converts W to new version, creates new record and keeps old one as IsTrashed=True.  Thus, can always see what it looked like before.  More thinking required here.
- see DRF guidelines about the steps to do
- a version of Canvas will only work with a specified version(s) of W - inside code.  This way, can load any version of Canvas and it will work provided the W version is in acceptable range - hardcoded in TS.  The version is set per W, thus can have different versions of Graphs (Vega), Sl, etc.

Warning:
- when a W is rendered and some fields dont exist, error occured, display a warning image + message inside W.  User can edit this, fix the fields and save
- before saving a W, Canvas checks that the fields are valid, that it renders, etc and warns if not (but allows to save) - how does this fit in with auto-save policy?

Caching:
- option to switch caching on or not at the server level and local level (if server allows it)
- stores all currentD info, users, etc
- refreshed via WS from DB
- also used for auto-save: all the steps are saved here, and synced to server at specified interval (setting on client)


Multi-T display:
- can add W from other D on the NEW W form -> makes a copy of it locally, and stores a reference to the original.  This is not maintained automatically, the user has to delete and re-copy to local to get the latest.  It is thus different to templates.
- on DS menu: indicate all W (graph + Sl) influenced by this DS
- on W menu: indicate all Sl affecting this W
 

Local DB:
This seems useful for the following:
- caching more than the current, for example load top 10 recently used D async while user is working => they are ready immediately when opened
- quicker startup as the last used D will be available locally.  How do we synch it if it has changed since?
- streaming: a WS is updating the local DB constantly, W refreshes at intervals
- will not be allowed with sensitive data
- handle big dSet -> store locally from DB and prompt user to have a Sl - which reduces the amount of data in [dSet*] which is in RAM
- lazy loading on Tbl, so a Table can show any size data.  Filters on Tbl will re-extract from local DB, and paginate again.
- take serious note of browser compatibility
- auto-save can be done here - should make it faster, and less calls to server

Auto-save / Undo:
- this is a key feature
- options:
    1. could save all info relating to the D: speed (ie to undo, the whole D will be recreated), easier to manage (all or nothing)
    2. save steps (action, old value, new value): more complicated to sync, and how will snapshots work?
    3. Combination of above, ie drag and resize as nr 2, rest as nr 1 ...
    For NOW: 
    - have a set of stores, one per entity with snapshot-id (-1 = optional), entity-id, {}
    - have one list: entity, id, action, old, new
    - single property changes, ie resize: graph, 3, change-container-width, old-width, new-width
    - significant changes to one entity: graph, 1, replace, old-spec-id, new-spec-id
    - snapshot: whole-dashboard, 2, snapshot, old-snapshot-id, new-snapshot-id
       This will replace all current entities (D, T, W, etc) from the respective stores where the snapshot-id matches


Other:
- Sl over T can be clumsy - can use multi-T feature but is this enough?
- Sl: can switch on/off per W -> suggest this will be confusing to users ...
- can we hide T - will show in T list with hidden tick, can uncheck?
- getting a W from another D - only show those where the user has access to the DS
- after Ws were linked to a DS: if do a Tr, then validate that W are still okay (ie a W field may not exist any longer in DS)
- decide if check/tick is shown on related Sl when a W is clicked.  
- try to improve performance - trackedByFn ...

Shapes:
- have the following elements:
    - headers, say 1-6
    - text
    - bullets
    - numbered bullets
    - links (to web and other D, T)
    - images
    - data field, maybe in brackets
    - blocks / borders?
    - formatting like background color?
- use a simple MD language, parse to HTML and render
- can have a View Window next to Design Window - can see how it looks
- select data fields from existing DS and dSet
- must be able to make a PowerPoint-light: front page(logo and title), agenda with bullets and optional links, pages with logo and title repeated at the top and bullets and W (graphs, etc) that are normal Canvas W => interactive and can add Sl, explore, expand, etc.

**END 1 Feb 2018**


**UI / ideas**
1. See where and how to use tooltips on buttons (ie HTML title="" or via Clarity)
2. GO BACK TO SIMPLICITY !!!  Review regular on how to make it easier and faster.
4. Review whether as beautiful as Simplus
5. Test on different configs: screen resolution, 2 screens
6. Test on different devices, ie Tablet and Phone
7. Install at user as pilot, may Liaan ...
8. Keep Help Message on top of forms uniform - always look and feel the same.  Also, make sure there is a preference to switch it back on manually.
9. Some models like Shape has dashboardTabName - suggest we delete this
10.Consider highlight of selected row in Snapshots.  If good, apply to all Grids.  Better: consider a GRID-COMPONENT ...
11.It should NEVER be allowed to edit the DB itself - there must be a UI function for changing things.  And always by the users, with rights if necessary.
12.It must be impossible to lock out all users - admin keeps access and at least one is kept.  Also, if a W is locked and the owner on leave, someone must be able to unlock it.
13.Accelator keys: accesskey="h".  Make consistent approach for all, taking into account that browser has own set.  Try to make it dynamic, ie use can define it!
14. Have verticle and horisontal hairlines when moving W - experiment a bit
15. When equi-distant - keep order on screen, not order selected
16. Thumbnail view of all T - can selected ala PowerPoint
17. Have popup thumbnail of D on Landing page
18. Use thumbnails to select a W from another D - have thumbnails are on/off option for performance perhaps
19. Look at function in MS staff hub
20. Incorporate tasks into Landing page?
21. Give the user a vote - via like?  Create a sense of belonging and community
22. Use cell to do things easily - ie ask time off, manager approves and data stored as record - EASY and integrated and No forms
23.Consider to move ALL selected objects - remember complexity since Sl and W sits in different components ...
24.Refactor: Change all components to use central (global var) createVegaLiteSpec ...
25.Consider CAREFULLY skipping all currentXX routines and data ... this can work is all controlled by App Component.  Not sure what the FULL implications are ...
26.Consider array.spice() instead of current deep copy - is more TS-like ...
27.Consider depricating gv.currentWidgets, gv = global.variables.  THINK !  Can 1) make app.currentWidget = gv.currentWidget, ByRef.  Test that this always updates.  2) always refresh gv.currentWidget  3) delete gv.currentWidget - check where uses and how.  
THEN: consider all currentXXX, where XXX = Objects to follow the same methodology.
28.Delete Slicer has no confirmation - maybe it should be done.  Then decide, in app component or new component.
29.Consider showing #W selected on StatusBar - dont think it will make a diff, as it is easier to see visually on W what is going on.  If move and some grouped, will figure it out methinks


**Data**
1. Define Canvas datatype = TS ones?
2. Is heading 'Existing Dataset' = ... DataSOURCES ?
3. Make sure terminology is consitent: Datasource -> Transform -> Dataset
4. I used FieldNames (string) in ie Pivot - is that okay?
5. Design (technically) how Datasets, pivotRow, pivotCol, pivotResult, pivotAgg, Fields, FieldsMetaData, Combinations, CombinationDetails will work, given that these can change over time, has to be fast enough (cannot all live in memory) and has to integrate with Vega ...
6. Check Definition of DS = source, location, authentication, F, Tr, Pv etc.  Dataset is just the data, with an ID / url to find it.
8. When removing a Dataset, it validates that not used in a Widget, Shape or Combination. If so, then cannot be removed.  If removed, all resultsets stored for it must be removed as well, or not?
9. Data Quality issues: add place to add detail values.  An overall statement can say all data has an issue, but a specific one must identify the column(s) and row(s) affected, thus given the IDs or key values.
10.Similtaneous update of LOCAL and GLOBAL vars!  Ie: app sends [widgets] to widget component, which is the local widgets.  Who and where are Global widgets synced !!!!????  Maybe use observables where the local ones just subscribe to the global ones.  Anyway, make this method standard across app. 
11.Determine which transformations live on server and which on client, and whether some/all
   lives on both.
12.Remember usage - and can sort by popular ones or show it for all relevant objects
13.Allow own profile pic upload!
14.How do we treat sensitive data - that may not be seen by DBA.  Keep it in Excel and reload each time ...
15.Telegram interface with bot ...
16.Decide on what to do with Widget- and Shape-ButtonBars and 2 forms - AFTER UI and functionality has been decided.  Maybe remove them, or only allow for order ... For now, palette cannot be changed.
17.Decide what buttons to keep on widget - for now can only think about link button in presentation mode.
1. Define Canvas data types: which module creates this for data and where?  Are all numbers equal?
2. Data field lengths: where defined, by what means, and how are they used?  Is it display side only?  Can the user change it?  What if an actual field is wider than the stated length - will it truncate displayed data?  Does numbers have a length?
3. How are dates stored in DB vs localDB vs arrays?  How do we format dates onto the form?  How is locale used?
4. How does types tranform into Vega field types, ie on Editor?
5. Consider dataQuality on own menu item, or on W menu


**Admin module**
1. Users, groups, permissions
2. Where does UI sit - in Dashboard or separate.  Consider Standalone vs Network
3. Global var with userLoggedIn
4. What and how is cached locally - and how refreshed
5. Finalise group membership / roles
6. Where system settings like Security Model ?
7. Add UserID to ALL data and code -> where needed ...




**Widget Editor**
- user can change Vega field types on Adv form
- our field type -> vega types: take a best guess
- APPLY on Adv form must re-render
- DESIGn: Adv form
- at start, add row, col, color fields
- EDIT buggie - color stays, fails on T=2
- new push
- TABLE: 
    - make faster, ie use raw <td> tags or superClick grid from Bradley
    - add drag fields - to X = Add, Drag away = delete from headers
    - add drag field to Y = Pivot!  Decide local or in backend
    - add functionality = filter, sort, etc.  Decide here OR in app component ... Maybe only here
BUG: if using a custom vega spec, the editor does not understand this.
- set properties of new Widget as a template - user pref
- when open NEW and only 1 DS, then skip DS selection page?
- when add NEW, ensure it is accessable: always same position top left + z-index = Max(rest)+1



**Dashboard**
1. Easy to drill in and out of dates - year - month - day, etc
2. Open: all Ds using a given Template
4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
   for March last year, or compare all to last year ... NB
5. Also, easy way to jump to previous period:  loaded at start with data ??
6. Reuse open Dashboard code between Open & Rename, if possible
7. Test printing - and see if pagelayout can be changed
8. Startup D: should this be settable as a pref, or should we always display the Landing page?
10.View all Comments at once, with filter on messageText and Sender/Receiver
11.Save keeps all snapshots and undo actions, forever.  Thus, can see how things looked
   at any point in the past.  It must be clearly marked for the user.  Must also be able to
   search the list, and see a list of undo actions.
14.The SPEC does NOT contain all Widgets - this allows Widgets to be standalone items, and can easily be connected to more than one Dashboard in future, if we decide so (not adivised as your Dashboard may suddenly change without warning).
15.Import: check security, particularly for the Datasource.  Also, is the access rights
   stored with the text file (security risk)?  Also, can / should it over-write an
   existing Dashboard - yes, with a warning.  It must create a Draft version in all cases.
16.Fix bug: Recent Dashboard refreshes 1 cycle too late
17.Fix Bug: grid shows on top of widgets -> cannot click them
18.StatusBar must not grow beyond screen width, or to double line
19.Set editMode per Recent - must be same mode as last saved
20.Set editMode @startup as user pref
21.Set editMode for ALL menu options: ie, cannot edit Title with RightClick in ViewOnly


**Templates**
1. Loading a template - make sure to respect security / rights + all is read-only
2. D used as Templates may include templates already!  This is to simplify things, and a string of dependencies - it is thus restricted to one level.  A T can be used in may D, no issue.
3. Add Datasources to Dashboard, but flag them as invisible.  Thus, Dashboard can use them
   in Template only, and user cannot use them.  If the user needs that Datasource, he can
   add it, in which case it will be duplicated, one invisible.
4. If this gets too complicated, only use Shapes on Templates.
5. Ensure Templates are on different layers / z-index
6. When a T is changed, the user is warned which Ds use it - he can see their names and maybe even open them.



**Widget**
1. Issue: how to call code ~WidgetEdit, etc from explore NOT duplicating code ...
2.
3. Fix bug: isTrash => Widget does not disappear !
4. Expand: add Refresh button, for when change nr lines to show.  Also, 100 -> 1000
 + Dont show top if now Dataset - rather appropriate Unexpected Error msg
5. Slicerresize: only goes to a min size (maybe min-size in css), but internals shrinks further.  Not bad functionally but not right - have a look.
6. Fix bug: [style.border]="row.isSelected? '2px solid black' : '2px solid red'" does not work
7. Flag visible if it has a Note, Data Quality issues
8. 
9. Advanced box in Widget-Editor: consider and document z-index used here
10.How to show comparison between current and previous period ?
11.Issue - When resize Widget => add resize graph as well.
12.Fix bug: graph moves inside another when Dragging - had this in v1 ...
13.Bug with IE: 'IE supports only grid-row-end with span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support' - looks like no solution at the moment
14.Bug fix: delete does not remove the Widget !
15.Cross hair with showing values on axis - ie crypto trading websites!
16.Show a Viz on the tooltip - this could be our explain ... !
17.Annotate on Widget - our shapes with text and emojis, like the Tableau
18.Look at embeding widgets -> export Vega spec + embed line, user puts it in his html ...?
19.
20.Serias work to be done - learning Vega and adding ALL features !!!
21.Add other Viz to W Editor (data page) - ie Layered Graphs, Trellis, etc.  These need new templates, and a new UI.  


**Shapes**
1. Fix bug: circle flickers when hover over menu
2. Generate all shapes from data - not only circle which is static html at moment
3. Add a DragHandle and Resize handle to popup menu.  This way it is simpler - just hover to make the buttons appear, drag and voila.  Similarly, consider removing the Drag and Resize handles from the Dashboard if this works.
4. Keep Select button on Shape - make red border like Dashboard + can group/ungroup + can move/align/etc together with Widgets.  Make this code DRY.


**Presentation**
1. See if can print, and if so: allow different layouts and formats, for example one
   Widget per page, Dashboard layout, all Dashboards (linked) or just the current one.
2. Issue: Make sure access rights are still respected at all levels: Dashboard, Widget, Datasource


**Slicers**
1. Philosopy: currently is UNselects anyone unselected: say 2 Sl on Origin field, one has 
Europe unselected, one has USA unselected.  Then data is only for Japan (3 values in dataset) - is this correct, or should it include all?
2. Make look and feel customisable
3. Warn user if 2 Sl on the same dataset for the same field?



**Scheduler**
1. Determines tech and where/how it runs
2. How does standalone work - does it have a schedule?
3. How are users notified and also when scheduler is down
4. How is dataset stored - per Dashboard as more than one can be linked ..
5.


