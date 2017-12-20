# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)


**Global / Overall issues / Settings**
1. Include internasionalisation - different languages
2. My date format - and show like this ....
3. Use style.css for standard items, ie class="helpMessage"

**API**
1. Have flexible field selection: ie ..."fields": [A, B, F]

**UI / ideas**
1. See where and how to use tooltips on buttons (ie HTML title="" or via Clarity)
2. Try keyboard shortcuts via access-key.  If it works, make customisable
3. GO BACK TO SIMPLICITY !!!  Review regular on how to make it easier and faster.
4. Review whether as beautiful as Simplus
5. Test on different configs: screen resolution, 2 screens
6. Test on different devices, ie Tablet and Phone
7. Install at user as pilot, may Liaan ...
8. Show version 

**Status Bar**
1. Show Canvas version
2. Show standalone/server name

**Data**
1. Light data exploration: outliers
2. Define Canvas datatype = TS ones?
3. Make sure terminology is consitent: Datasource -> Transform -> Dataset
4. Do we store more than one version of a dataset - say one dated 'calced on .,/,,/,,' ?
   This could be useful for comparisons, or required in some cases.
5. Add start-row-number (ala Fredd files)
6. Can Transformations do Group By !?

**Admin module**
1. Users, groups, permissions
2. Where does UI sit - in Dashboard or separate.  Consider Standalone vs Network
3. Global var with userLoggedIn
4. What and how is cached locally - and how refreshed
5. Finalise group membership / roles

**Transformations:**
1. Calculated field with TS like formulas
2. Calculated fields can contain other fields, ie <TradeDate> - 1
3. Calculated fields can contain IF-THEN-ELSE statements

**Dashboard**
1. Design layers: background colour, background image, Grid, [widgets + shapes] - say 10,
   and top layers are transparent so that one can see the Grid
2. Easy way to create a Widget from a dataset - even on Add Dataset.  - like one click option
3. Easy to drill in and out of dates - year - month - day, etc
4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
   for March last year, or compare all to last year ... NB
5. Also, easy way to jump to previous period:  loaded at start with data ??
6. Delete moves to Trash - may sure can open again with File -> Open
7. Click Tab to rename
8. Make Tabs more visible on status bar
9. Test printing - and see if pagelayout can be changed


**Widget**
1. More than one version of grammar - create space in spec and code (IF) - may not be needed
   on UI for now
2. On delete, moves to Trash?  And can be restored?
3. Border on select
4. Drag and Sizing handles on select
5. Fix bug and Duplicat Widget correctly
6. In Slideshow mode: show link buttons and this now jumps (Edit mode = show linking form)


**Presentation**
1. See if can print, and if so: allow different layouts and formats, for example one 
   Widget per page, Dashboard layout, all Dashboards (linked) or just the current one.
2. Recording: store the name, show the actions (ie show Dashboard 1, then 2 etc) in an 
   Explorer (tree) view.
3. Add a Link button to the Widget, and maybe a 'make buttons in/visible' option on the
   menu.
4. Add cursor style and size on menu.
5. Allow annotations - highligh, arrows, etc ... !?
6. Add Easy Explore option: can look at other things while in presentation mode ??  Not 
   sure if this makes sense ....  if want to look at different data, just open the relevant 
   Dashboard in view-only, or create a temp one quicky ...
7. Embed objects like voice recording, video and urls - can jump to web, show movie, etc!
8. The Datasource and Dataset cannot be changed, but the user has Slicers to filter the
   data.
9. Make sure access rights are still respected at all levels: Dashboard, Widget, Datasource

**Scheduler**
1. Determines tech and where/how it runs
2. How does standalone work - does it have a schedule?
3. How are users notified and also when scheduler is down
4. How is dataset stored - per Dashboard as more than one can be linked ..
5. 

## Near future
1. Design and test layout of Canvas on a mobile device
2. Sparklines

## Later
1. Add Filter AFTER Tranformation and pivot ...  
2. Expand filter to: In, Or, nested, etc ... If considered Really, Really necessary ...

## Maybe considered, not sure
1. ETL process - there are products that does this already
2. What-if questions - see Power BI
3. Natural language questions - see Power BI