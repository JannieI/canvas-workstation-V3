# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)


**Global / Overall issues / Settings**
1. Test everything with 1000 - ie Dashboards, Widgets per D, etc - to check performance and to see it form layout (ie grids sizes) will copy with large volume
2. Standard unit of measure: maybe save all as rem, and user can select px, rem, etc?
3. Use style.css for standard items, ie class="helpMessage"
4. Standardize date format shown - as selected by the user, stored as settings


**API**
1. Have flexible field selection: ie ..."fields": [A, B, F]


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


**Data**
1. Define Canvas datatype = TS ones?
2. Is heading 'Existing Dataset' = ... DataSOURCES ?
3. Make sure terminology is consitent: Datasource -> Transform -> Dataset
4. I used FieldNames (string) in ie Pivot - is that okay?
5.
8. When removing a Dataset, it validates that not used in a Widget, Shape or Combination. If so, then cannot be removed.  If removed, all resultsets stored for it must be removed as well, or not?
9. Data Quality issues: add place to add detail values.  An overall statement can say all data has an issue, but a specific one must identify the column(s) and row(s) affected, thus given the IDs or key values.
11.Determine which transformations live on server and which on client, and whether some/all
   lives on both.


**Admin module**
1. Users, groups, permissions
2. Where does UI sit - in Dashboard or separate.  Consider Standalone vs Network
3. Global var with userLoggedIn
4. What and how is cached locally - and how refreshed
5. Finalise group membership / roles
6. Where system settings like Security Model ?


**Dashboard**
1. Easy to drill in and out of dates - year - month - day, etc
2.
4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
   for March last year, or compare all to last year ... NB
5. Also, easy way to jump to previous period:  loaded at start with data ??
6. Reuse open Dashboard code between Open & Rename, if possible
7. Test printing - and see if pagelayout can be changed
10.View all Comments and notes at once, with filter on messageText and Sender/Receiver
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
19.


**Templates**
1. Loading a template - make sure to respect security / rights + all is read-only
3. Add Datasources to Dashboard, but flag them as invisible.  Thus, Dashboard can use them
   in Template only, and user cannot use them.  If the user needs that Datasource, he can
   add it, in which case it will be duplicated, one invisible.
4. If this gets too complicated, only use Shapes on Templates.
5. Ensure Templates are on different layers / z-index



**Widget**
1. Issue: how to call code ~WidgetEdit, etc from explore NOT duplicating code ...
2. Add fields for Widget Properties to New / Edit !
3. Fix bug: isTrash => Widget does not disappear !
4. Expand: add Refresh button, for when change nr lines to show.  Also, 100 -> 1000
 + Dont show top if now Dataset - rather appropriate Unexpected Error msg
5. Fix bug and Duplicate Widget correctly
6. Fix bug: [style.border]="row.isSelected? '2px solid black' : '2px solid red'" does not work
7. Flag visible if it has a Note, Data Quality issues
8. Issue - button bar is at top of Widget => moves graph down, messes up things.  Either totally
   separate SINGLE bar => just make visible ...  OR  duplicate div and border around Widget
9. Advanced box in Widget-Editor: consider and document z-index used here
11.Issue - When resize Widget => add resize graph as well.
12.Fix bug: graph moves inside another when Dragging - had this in v1 ...
13.Bug with IE: 'IE supports only grid-row-end with span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support' - looks like no solution at the moment
14.Bug fix: delete does not remove the Widget !


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
1. Make moveable!
2. Make look and feel customisable
3. X top right to close (and how to show later?)  Can make temporary invisible?


**Scheduler**
1. Determines tech and where/how it runs
2. How does standalone work - does it have a schedule?
3. How are users notified and also when scheduler is down
4. How is dataset stored - per Dashboard as more than one can be linked ..
5.
