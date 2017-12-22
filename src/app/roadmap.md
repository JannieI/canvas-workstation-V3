# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)


**Global / Overall issues / Settings**
1. Include internasionalisation - different languages
2. My date format - and show like this ....
3. Use style.css for standard items, ie class="helpMessage"



**Offline work**
1. Copy schema or copy data, depending on Server settings

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


**Status Bar**
1. Show Canvas version
2. Show standalone/server name
3. Show version 
4. Make status bar customisable - can choose what to show.  Plus, ... if too many (and 
   what happens then?)
5 .Statusbar - make read-only text dimmer / lighter so that clickable ones stand out


**Data**
1. Light data exploration: outliers
2. Define Canvas datatype = TS ones?
3. Make sure terminology is consitent: Datasource -> Transform -> Dataset
4. Do we store more than one version of a dataset - say one dated 'calced on .,/,,/,,' ?
   This could be useful for comparisons, or required in some cases.
5. Add start-row-number (ala Fredd files)
6. Can Transformations do Group By !?
7. Combinations - needs proper design.  Union can be any number, picked from a list of
   existing Datasets.  Datasets added after the Union has been defined, has to be added
   manually.  Datasets can also be removed from the Union.  Can also delete a Union.
8. Add Remove Dataset logic and UI.  When removing a Dataset, it validates that not used
   in a Widget, Shape or Combination. If so, then cannot be removed.  If removed, all
   resultsets stored for it must be removed as well.
9. Decide if Slicers link to 1 or many Datasets - this depends on how we can do this 
   technically.  If not too complex, we should as this is quite powerful to drive the 
   whole Dashboard from a single Widget.
10.Data Quality issues: add place to add detail values.  An overall statement can say all
   data has an issue, but a specific one must identify the column(s) and row(s) affected,
   thus given the IDs or key values.
11.Determine which transformations live on server and which on client, and whether some/all
   lives on both.
   


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
1. Design layers: background colour, background image, Grid, Template, 
   [widgets + shapes] - say 10, and top layers are transparent so that one can see the 
   Grid. 
2. Easy way to create a Widget from a dataset - even on Add Dataset.  - like one click option
3. Easy to drill in and out of dates - year - month - day, etc
4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
   for March last year, or compare all to last year ... NB
5. Also, easy way to jump to previous period:  loaded at start with data ??
6. Delete moves to Trash - may sure can open again with File -> Open
7. Click Tab to rename
8. Make Tabs more visible on status bar
9. Test printing - and see if pagelayout can be changed
10.View all Comments and notes at once, with filter on messageText and Sender/Receiver
11.Consider Explorer / Tree view of Dashboard - showing makeup of Widgets, Shapes, Datasets,
   links, etc.
12.Add subscriptions, events and distribution: send {Clarity Message / Email / Telegram}
   when {Dashboard} is {changed/deleted}
13.Save keeps all snapshots and undo actions, forever.  Thus, can see how things looked
   at any point in the past.  It must be clearly marked for the user.  Must also be able to
   search the list, and see a list of undo actions.
14.The SPEC contains all Widgets - this has a serious design implication that Widgets are
   not standalone items, and connect be shared.  The reasons are: it will be difficult
   to manage this, particularly over datasources and changes that users can do, the 
   Dashboard is a selfcontained unit, access rights have to be extended to Widgets, and
   there are no surprises (when someone changes a Widget that I reference in my Dashboard) 
   = master of my own destiny.
15.Import: check security, particularly for the Datasource.  Also, is the access rights
   stored with the text file (security risk)?  Also, can / should it over-write an
   existing Dashboard - yes, with a warning.  It must create a Draft version in all cases.
16.In view-only mode, can open Widget Editor and explore.  But, cannot save back !  Can 
   also use Slicers to filter data set, and can add new ones!!
17.Locking/Contention: due to the complexity, we will start with single user editing - 
   only one user at a time can edit a Dashboard, and this applies to the whole Dashboard.
   It seems sufficient for small to medium companies, and also Dashboards wont be edited
   as frequently as transactional records.


**Dashboard Tabs**
1. Make more clear and visible
2. Have colours per tab
3. Tab name has max length of x
4. Add Tab Description - maybe make this a tooltip as well.


**Templates**
1. Security is same since this is a normal Dashboard, not flagged as a template during
   creation.
2. Loading a template - make sure to respect security / rights
3. Add Datasources to Dashboard, but flag them as invisible.  Thus, Dashboard can use them
   in Template only, and user cannot use them.  If the user needs that Datasource, he can 
   add it, in which case it will be duplicated, one invisible.
4. If this gets too complicated, only use Shapes on Templates.
5. Ensure Templates are on different layers / z-index


**Alerts/Activities/Messages**
1. Must be easy to access (1 button) and use


**Widget**
1. More than one version of grammar - create space in spec and code (IF) - may not be needed
   on UI for now
2. On delete, moves to Trash?  And can be restored?
3. Border on select
4. Drag and Sizing handles on select
5. Fix bug and Duplicat Widget correctly
6. In Slideshow mode: show link buttons and this now jumps (Edit mode = show linking form)
7. Flag visible if it has a Note, Data Quality issues
8. Consider Widget Templates - could be a way to make graphs easier, or standardise the
   look and feel in the company ...
9. Quick Widget: when creating Dataset, click a button to get a best guess Wizard - Make this
   really easy.


**Shapes**
1. Add ability to use data in a textbox: aggregation : dataset : fieldname, where
   aggregation = {sum, min, max, average, first, last}, dataset is an existing one, and
   fieldname is a final column name.


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




