# Roadmap

This document describes items for later versions of Canvas.

## Due in v2 (just not shown on forms)


**Global / Overall issues / Settings**
1. 
2. Standard unit of measure: maybe save all as rem, and user can select px, rem, etc?
3. Use style.css for standard items, ie class="helpMessage"
4. Standardize date format shown - as selected by the user, stored as settings


**API**
1. Have flexible field selection: ie ..."fields": [A, B, F]


**UI / ideas**
1. See where and how to use tooltips on buttons (ie HTML title="" or via Clarity)
2. 
3. GO BACK TO SIMPLICITY !!!  Review regular on how to make it easier and faster.
4. Review whether as beautiful as Simplus
5. Test on different configs: screen resolution, 2 screens
6. Test on different devices, ie Tablet and Phone
7. Install at user as pilot, may Liaan ...


**Data**
1. 
2. Define Canvas datatype = TS ones?
3. Make sure terminology is consitent: Datasource -> Transform -> Dataset
4. Do we store more than one version of a dataset - say one dated 'calced on .,/,,/,,' ?
   This could be useful for comparisons, or required in some cases.
5. 
6. 
7. Combinations - needs proper design.  Union can be any number, picked from a list of
   existing Datasets.  Datasets added after the Union has been defined, has to be added
   manually.  Datasets can also be removed from the Union.  Can also delete a Union.
8. Add Remove Dataset logic and UI.  When removing a Dataset, it validates that not used
   in a Widget, Shape or Combination. If so, then cannot be removed.  If removed, all
   resultsets stored for it must be removed as well.
9. 
10.Data Quality issues: add place to add detail values.  An overall statement can say all
   data has an issue, but a specific one must identify the column(s) and row(s) affected,
   thus given the IDs or key values.
11.Determine which transformations live on server and which on client, and whether some/all
   lives on both.
   

--- store default folder in Pref

**Admin module**
1. Users, groups, permissions
2. Where does UI sit - in Dashboard or separate.  Consider Standalone vs Network
3. Global var with userLoggedIn
4. What and how is cached locally - and how refreshed
5. Finalise group membership / roles


**Transformations:**
1. 


**Dashboard**
1. 
2. Easy way to create a Widget from a dataset - even on Add Dataset.  - like one click option
3. Easy to drill in and out of dates - year - month - day, etc
4. Easy way to compare data: graph shows revenue per month for this year.  What was figure
   for March last year, or compare all to last year ... NB
5. Also, easy way to jump to previous period:  loaded at start with data ??
6. Reuse open Dashboard code between Open & Rename, if possible
7. 
8. 
9. Test printing - and see if pagelayout can be changed
10.View all Comments and notes at once, with filter on messageText and Sender/Receiver
11.
12.
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
16.Fix bug: Recent Dashboard refreshes 1 cycle too late 
17.


**Dashboard Tabs**
1. 


**Templates**
1. 
2. Loading a template - make sure to respect security / rights + all is read-only
3. Add Datasources to Dashboard, but flag them as invisible.  Thus, Dashboard can use them
   in Template only, and user cannot use them.  If the user needs that Datasource, he can 
   add it, in which case it will be duplicated, one invisible.
4. If this gets too complicated, only use Shapes on Templates.
5. Ensure Templates are on different layers / z-index


**Alerts/Activities/Messages**
1. Must be easy to access (1 button) and use


**Widget**
1. Issue: what happens if Treeview expand gt Modal height !?
2. Issue: how to call WidgetEdit, etc from explore NOT duplicating code ...
3. Border on select
4. Fix bug: isTrash => Widget does not disappear !
5. Fix bug and Duplicate Widget correctly
6. Fix bug: [style.border]="row.isSelected? '2px solid black' : '2px solid red'" does not work
7. Flag visible if it has a Note, Data Quality issues
8. Consider Widget Templates - could be a way to make graphs easier, or standardise the
   look and feel in the company ...
9. Quick Widget: when creating Dataset, click a button to get a best guess Wizard - Make this
   really easy.
10.Issue - button bar is at top of Widget => moves graph down, messes up things.  Either totally
   separate SINGLE bar => just make visible ...  OR  duplicate div and border around Widget
11.When resize Widget => add resize graph as well.
12.Fix bug: graph moves inside another when Dragging - had this in v1 ...
13.Bug with IE: 'IE supports only grid-row-end with span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support' - looks like no solution at the moment
14.Bug fix: delete does not remove the Widget !


**Shapes**
1. Add ability to use data in a textbox: aggregation : dataset : fieldname, where
   aggregation = {sum, min, max, average, first, last}, dataset is an existing one, and
   fieldname is a final column name.
2. Fix bug: circle flickers when hover over menu
3. Generate all shapes from data - not only circle which is static html at moment



**Presentation**
1. See if can print, and if so: allow different layouts and formats, for example one 
   Widget per page, Dashboard layout, all Dashboards (linked) or just the current one.
2. Recording: store the name, show the actions (ie show Dashboard 1, then 2 etc) in an 
   Explorer (tree) view.
3. 
4. 
5. Allow annotations - highligh, arrows, etc ... !?
6. Add Easy Explore option: can look at other things while in presentation mode ??  Not 
   sure if this makes sense ....  if want to look at different data, just open the relevant 
   Dashboard in view-only, or create a temp one quicky ...
7. Embed objects like voice recording, video and urls - can jump to web, show movie, etc!
8. 
9. Make sure access rights are still respected at all levels: Dashboard, Widget, Datasource


**Slicers**
1. Make moveable!
2. Make look and feel customisable
3. X top right to close (and how to show later?)


**Scheduler**
1. Determines tech and where/how it runs
2. How does standalone work - does it have a schedule?
3. How are users notified and also when scheduler is down
4. How is dataset stored - per Dashboard as more than one can be linked ..
5. 



## Near Future

**General**
1. Add cursor style and size on menu: needs a custome .png file, IE needs .cur ...
2. Consider if Transformations can do Group By - for now it is either in the SQL, or Vega


**Data**
1. Consider linking Slicers many Datasets - this depends on how we can do this 
   technically.  If not too complex, we should as this is quite powerful to drive the 
   whole Dashboard from a single Widget.

   
**Status Bar**
1. Make status bar customisable - can choose what to show.  Plus, ... if too many (and 
   what happens then?)


