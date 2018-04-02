// ALL models (schema) are kept here

// CA Datagrid
export class DatagridColumn {
    id: number;                             // Unique ID, for later use
    displayName: string;                    // Text displayed in Grid header
    fieldName: string;                      // Field name in Array
    databaseDBTableName: string;            // Optional Table name in DB
    databaseDBFieldName: string;            // Optional Field name in DB
    tooltip: string;                        // Text string as tooltip
    datatype: string;                       // string, number, boolean
    prefix: string;                         // ie RK, or Rm
    divideBy: number;                       // 1000, 1000 000.  If <=0 => no action
    displayLength: number;                  // Max lenght in Grid, even if field is wider
    maxLength: number;                      // 0 means ignore
    sortOrder: string;                      // For later use - maybe add sort on startup
    filter: string;                         //  For later use - maybe add filter on startup
    backgroundColor: string;                // ie 'beige'
    color: string;                          // ie 'black'
    conditionalFormatColor: string;         // If '' then no condFmt.  ie 'blue'
    nrDataQualityIssues: number;            // Optional nr of DataQual issues
    maxValue: number;                       // Optional Max value in this col
    minValue: number;                       // Optional Min value in this col
    average: number;                        // Optional Avg value in this col
    linkedDashboardID: number;              // Optional ID of linked Dashboard
    linkedDashboardTabID: number;           // Optional ID of linked Tab
    isFrozen: boolean;                      // Optional: true if freeze col
    datagridColumnHidden?: any;
}

export class DatagridInput {
    datagridColumns: DatagridColumn[];            // Cols, with info on each
    datagridData: any;                            // Data Array
    datagridPagination: boolean;                  // True if pagination is on
    datagridPaginationSize: number;               // Size of each page, ie 10 (rows)
    datagridShowHeader: boolean;                  // True to show Headers
    datagridShowRowActionMenu: boolean;           // True to show the action menu per row
    datagridShowData: boolean;                    // True to show Data
    datagridShowFooter?: boolean;                 // True to show Footer
    datagridRowHeight: number;                    // Height in px
    datagriduserCanChangeProperties: boolean;     // False if use can change Nothing in grid, ie cannot even resize
    datagridShowTotalsRow: boolean;               // True to show additional row of totals at bottom
    datagridShowTotalsCol: boolean;               // True to show additional col of totals on right
    datagridCanEditInCell: boolean;               // True is user can edit inside cells
    datagridCanExportData: boolean;               // True if the data may be exported
    datagridEmptyMessage: string;                 // Message to display if the grid is empty
    datagridShowFields: string;                   // Array of Fields names to include in the data
    // Note: fields not in datagridShowFields does not exist
    datagridVisibleFields: string[];              // List of avaialble field names to make visible in grid
}

// Setup / Settings / General
export class UserPreferences {
    preferenceAutoSync: boolean;                            // T/F - can auto sync
    preferenceShowOpenStartupMessage: boolean;              // T/F - show open startup msg
    preferenceShowOpenDataCombinationMessage: boolean;      // T/F - show msg on open combination form
    preferenceShowViewStartupMessage: boolean;              // T/F - show msg on open view form
    preferenceShowDiscardStartupMessage: boolean;           // T/F - show msg on discard form
    preferenceDefaultTemplate: string;                      // Default Template
    preferenceDefaultDateformat: string;                    // Default Date Format, ie YYYY/MM/DD
    preferenceDefaultFolder: string;                        // Default Folder
    preferenceDefaultPrinter: string;                       // Default Printer
    preferenceDefaultPageSize: string;                      // Default Page Size
    preferenceDefaultPageLayout: string;                    // Default Page Layout
}

export class CanvasSettings {
    companyName: string;                    // Company Name
    companyLogo: string;                    // Optional file name for Company logo
    dashboardTemplate: string;              // Default Dashboard Template (later use)
    offlineData: boolean;                   // Store server data locally (T/F)
    offlineSchema: boolean;                 // Store server schema locally (T/F)
    offlineLogin: boolean;                  // Can log into a local server (T/F)
    maxTableLength: number;                 // Max Table Length (say 500 records)
    widgetsMinZindex: number;               // Widgets Min Zindex
    widgetsMaxZindex: number;               // Widgets Max Zindex
    gridSize: number;                       // Size of the Grid
    snapToGrid: boolean;                    // Snap to grid (T/F)
    printDefault: string;                   // Deflt: Local HP
    printSize: string;                      // Deflt Page Size: A4
    printLayout: string;                    // Deflt Layout: Single page, B and W

    // System-wide Messages
    notInEditModeMsg: string;               // Not-In-EditMode Message to display on StatusBar
    noQueryRunningMessage: string;          // No-Query-Running Message to display on StatusBar
    queryRunningMessage: string;            // Query-Running Message to display on StatusBar

}

export class CanvasAction {
    id: number;                             // Unique id per action
    dashboardID: number;                    // Where action took place
    dashboardTabID: number;                 // Where action took place
    objectType: string;                     // Type, ie Dashboard, Widget
    action: string;                         // Optional name, ie Move Widget
    description: string;                    // Optional description, ie calling routine, etc
    undoID: number;                         // Optional id of item in UNDO
    redoID: number;                         // Optonal id of item in REDO
    oldWidget: any;                         // Full W before action
    newWidget: any;                         // Full W after action
}

export class StatusBarMessage {
    message: string;                        // Text to display
    uiArea: string;                         // Specific UI area to affect, ie StatusBar
    classfication: string;                  // Info, Warning, Error
    timeout: number;                        // Duration to stay in ms, default = 3000
    defaultMessage: string;                 // Optional Message to display after timeout
}

export class CurrentDashboardInfo {
    currentDashboardID: number = 0;         // Current D we are working with
    currentDashboardTabID: number = 0;
    currentDashboardTabIndex: number = 0;   // Index in [T]
    widgetsToRefresh: number[] = [];        // Optional list of W to refresh, [] = All
    refreshingRoutine: string;              // Component-Function that called to refresh
    refreshDateTime: string;
}

export class PaletteButtonsSelected {
    id: number;
    userID: string;                         // FK to User, to which Button belongs
    paletteButtonBarID: number;             // FK to PaletteButtonBar
    mainmenuItem: string;
    menuText: string;
    shape: string;
    size: number;
    class: string;
    backgroundColor: string;
    accesskey: string;
    sortOrder: number;
    sortOrderSelected: number;             // SortOrder once selected, null ind DB, calced @Runtime
    isDefault: boolean;
    functionName: string;
    params: string;
    tooltipContent: string;
    isSelected: boolean;                    // Toggled at Runtime

}

export class PaletteButtonBar {
    id: number;
    mainmenuItem: string;
    menuText: string;
    shape: string;
    size: number;
    class: string;
    backgroundColor: string;
    accesskey: string;
    sortOrder: number;
    sortOrderSelected: number;             // SortOrder once selected, null ind DB, calced @Runtime
    isDefault: boolean;
    functionName: string;
    params: string;
    tooltipContent: string;
    isSelected: boolean;                    // Toggled at Runtime
}

export class CSScolor {
    name: string;
}


// Messages / Activities / Alerts / Comments / User
export class CanvasActivity {
    id: number;
    createdBy: string;
    createdOn: string;
    activityType: string;
    activityStatus: string;
    linkedDashboardList: string[];
    activityText: string;
    activityComments: string[];
}

export class CanvasMessage {
    id: number;                 // Unique ID
    threadID: number;           // Optional thread - to keep converstations together (later use)
    sentBy: string;             // UserID who sent message
    sentOn: string;             // DateTime message was sent
    toUsers: string[];          // Original list of Users
    toGroups: string[];         // Original list of Groups
    subject: string;            // Message Subject
    body: string;               // Message body
    dashboardID: number;        // Optional Dashboard linked to this message
    dashboardTabID: number;     // Optional Tab linked to this message
}

export class CanvasMessageSingle {
    id: number;                 // Unique ID
    messageID: number;          // FK to CanvasMessage
    recipient: string;          // Single Recipient, deduced from To-lists in Message
    read: boolean;              // True if Recipient has read the message.  Can toggle this
}

export class CanvasAlert {
    id: number;                 // Unique ID
    sentOn: string;             // DateTime sent
    recipient: string;          // UserID
    read: boolean;              // True if recipient read the alert
    alertText: string;          // Message
    alertData?: any;            // Type of data, table name, field names, field values
}

export class CanvasComment {
    id: number;                             // Unique ID
    dashboardID: number;                    // Dashboard to which comment is linked
    widgetID: number;                       // Optional Widget linked
    comment: string;                        // Comment Text
    creator: string;                        // UserID
    createdOn: string;                      // DateTime
}

export class CanvasUser {
    id: number;
    userID: string;
    password: string;
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    workNumber: string;
    cellNumber: string;
    groups: string[];
    isSuperuser: boolean;
    isStaff: boolean;
    isActive: boolean;
    dateJoined: string;
    lastLogin: string;
    colorScheme: string;                    // Color scheme for Canvas - for later use
    startupDashboardID: number;             // Optional Dashboard ID to show at startup
    startupDashboardTabID: number;          // Optional Dashboard Tab ID to show at startup
    gridSize: number;                       // Size of Grid on Dashboard in px
    environment: string;                    // Live, Test-Environment-Name
    profilePicture: string;
    queryRuntimeWarning: number;            // Minutes: Warn user if a report is known to run longer
    snapToGrid: boolean;                    // True: snap Widgets to the grid points on Dashboard
    favouriteDashboards: number[];          // IDs of D that are fav of this user
}

export class CanvasGroup {
    id: number;                             // Unique Group ID
    name: string;                           // Group name    
}

// Data
export class Dataset {
    id: number;
    datasourceID: number;
    sourceLocation: string;                 // Where data lives: file, localDB, MSSQL, etc
    url: string;                            // URL for http request
    folderName: string;                     // Optional folder name where data is stored
    fileName: string;                       // Optional file name where data is stored
    data: any;                              // Filtered data as json
    dataRaw: any;                           // Unfiltered data as json
}

export class Combination {
    combinationID: number;
    dashboardID: number;
    type: string;                           // ie Union
}

export class CombinationDetail {
    combinationDetailID: number;
    combinationID: number;
    lhDatasourceID: number;
    lhFieldName: string;
    rhDatasourceID: number;
    rhFieldName: string;
}

export class DataQualityIssue {
    id: number;
    datasourceID: number;
    status: string;
    name: string;
    type: string;
    description;
    nrIssues: number;
    loggedBy: string;
    loggedOn: string;
    solvedBy: string;
    solvedOn: string;
}

export class DatasourcePivot {
    id: number;
    datasourceID: number;
    columnFieldName: string;
    rowFieldName: string;
    aggregateFieldName: string;
    aggregateType: string;              // Sum, Average, etc
    refreshAlways: boolean;             // If True, will refresh after each change to rows, cols, etc
}

export class Datasource {
    id: number;
    type: string;
    subType: string;
    typeVersion: string;
    name: string;
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn: string;
    dataFields: string[];
    dataFieldTypes: string[];
    dataFieldLengths: number[];
    parameters: string;

    // Location and authentication
    folder: string;
    fileName: string;
    excelWorksheet: string;
    transposeOnLoad: boolean;
    startLineNr: number;                // 1 = first = default
    resourceUserName: string;
    resourcePassword: string;
    serverName: string;
    serverIP: string;
    serverPort: string;
    database: string;
    logFoler: string;
    logfileName: string;
    language: string;
    serverOptions: string;
}

export class DatasourcePermission {
    id: number;
    datasourceID: number;
    name?: string;                      // Optional DS name - filled in @Runtime
    userID: string;                     // 1 of usr/grp filled in, one blank
    groupID: number;
    canView: boolean;
    canEdit: boolean;
}

export class Transformation {
    id: number;
    datasourceID: number;
    category: string;
    name: string;
    description: string;
    fieldName: string;
    parameters: string;
}

export class Field {
    id: number;
    datasourceID: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class FieldMetadata{
    id: number;
    datasourceID: number;
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}

export class WidgetCheckpoint {
    id: number;                         // Unique ID
    active: boolean;                    // Set at RunTime: true if currently shown
    dashboardID: number;                // Linked to this D
    widgetID: number;                   // Linked to this W
    name: string;                       // Name of Checkpoint
    widgetSpec: any;                    // json spec of W
    creator: string;                    // UserID
    createdOn: string;                  // DateTime of creation
}

export class Dashboard {

    // Identification and description
    id: number;
    version: number;
    state: string;
    code: string;
    name: string;
    description: string;

    // Access Type
    accessType: string;             // How to access D: Private, Public, Access List

    // Overall properties
    password: string;
    refreshMode: string;
    refreshTimer: number;
    defaultTabID: number;
    defaultExportFileType: string;
    url: string;
    qaRequired: boolean;
    isSample: boolean;              // True if this is a sample

    // Overlay looks
    backgroundColor: string;
    backgroundImage: string;
    templateDashboardID: number;

    // Creation, update and refresh
    creator: string;
    dateCreated: string;
    editor: string;
    dateEdited: string;
    refresher: string;
    dateRefreshed: string;

    // 2nd normal form
    nrWidgets: number;
    nrShapes: number;
    nrRecords: number;
    nrTimesOpened: number;
    tabs: number[];
    permissions: string[];
}

export class DashboardTab {
    id: number;
    dashboardID: number;                // FK to DashboardID to which widget belongs
    name: string;
    description: string;
    backgroundColor: string;
    color: string;
}

// List of Recently opened D
export class DashboardRecent {
    userID: string;                     // User who last saved the D
    dashboardID: number;                // Last D position
    dashboardTabID: number;             // Last T position
    editMode: boolean;                  // EditMode when last saved
    accessed: string;                   // Last dateTime opened
    stateAtRunTime: string;             // State when opened, ie Deleted
    nameAtRunTime: string;              // Name when opened
}

export class DashboardTag {
    id: number;
    dashboardID: number;
    tag: string;
}

export class DashboardTemplate {
    id: number;
    name: string;
    description: string;
}

export class DashboardTheme {
    id: number;
    name: string;
    description: string;
}

export class DashboardSnapshot {
    id: number;
    dashboardID: number;
    name: string;
    comment: string;
}

export class DashboardSchedule {
    id: number;
    dashboardID: number;
    datasourceID: number;
    name: string;
    description: string;
    repeats: string;                    // Daily, Weekday (M-F), Weekly, Monthly, Yearly
    repeatsEvery: number;               //   X                     X        X        X
    repeatsOn: string[];                // Weekly:  (M, T, W, ... S)
    repeatsFor: string;                 // Monthly: DayOfWeek, DayOfMonth
    startsOn: string;                   // Date
    EndsNever: boolean;
    EndsAfter: number;                  // n times
    EndsOn: string;                     // Date
}

export class DashboardPermission {
    id: number;                         // Unique ID
    dashboardID: number;                // FK to D
    userID: string;                     // UserID - NB: 1 of usr/grp filled in, one blank
    groupID: number;                    // Group ID
    groupName: string;                  // Filled in @RunTime
    canView: boolean;                   // True if can View this D
    canEdit: boolean;                   // True if can Edit this D
    canDelete: boolean;                 // True if can Delete this D
}

export class DashboardSubscription {
    id: number;                         // Unique ID
    dashboardID: number;                // FK to Dashboard
    userID: string;                     // User
    view: boolean;                      // Nofity if another user Views this D
    editmode: boolean;                  // Nofity if another user goes to EditMode on this D
    save: boolean;                      // Nofity if another user Saves this D
    delete: boolean;                    // Nofity if another user Deletes this D
    dashboardCode: string;              // D-Code filled in at Runtime
    notify: string;                     // How to be notified: Email, Message, Both
}

export class Widget {

    // Type
    widgetType: string;                 // Graph, Table, Shape, Slicer
    widgetSubType: string;              // Type of shape, ie Circle.  NB spelling is case-
                                        // sensitive, and used in Code !!

    // Trashed
    isTrashed: boolean;

    // Where W lives
    dashboardID: number;                // FK to DashboardID to which widget belongs
    dashboardTabID: number;             // FKs to Tabs where the widget lives
    dashboardTabIDs: number[];          // FKs to Tabs where the widget lives

    // Identification and Description
    id: number;
    name: string;
    description: string;
    visualGrammar: string;              // Gramar for graphs, default = Vega
    version: number;

    // Properties load @Runtime
    isLiked: boolean;                   // @RunTime: True if Widget is liked by me
    isSelected: boolean;
    nrDataQualityIssues: number;
    nrComments: number;
    showCheckpoints: boolean;           // True is use is showing Checkpoints in Presentation Mode
    checkpointIDs: number[];            // Array of FKs to widgetCheckpoints
    currentCheckpoint: number;          // Index of current Checkpoint in checkpointIDs
    lastCheckpoint: number;             // Index of last Checkpoint in checkpointIDs
    // NB: lastCheckpoint >= 0 is used to test that there are no Checkpoints for a W
    // NB: it is not the ID, but the INDEX
    // NB: So, it must be set to -1 to be meaningful.

    // Links @Runtime
    hyperlinkDashboardID: number;           // Optional Widget ID to jump to
    hyperlinkDashboardTabID: number;        // Optional Tab Nr to jump to

    // Data related
    datasourceID: number;                   // Specific ID that this W points to.  For a W,

    // this is the dSet that contains its data.  For a Sl, it is the dSet that it filters.
    datasetID: number;                      // Specific ID that this W points to.  For a W,
    // this is the dSet that contains its data.  For a Sl, it is the dSet that it filters.
    // For a W, -1 = latest dataset of the DS-id.  For now, Sl must have a datsetID <> -1
    data: any;                          // Optional - can copy rawData into table
    dataFields: string[];               // Optional - can copy [fieldNames] into table
    dataFieldTypes: string[];           // Optional - can copy [fieldTypes] into table
    dataFieldLengths: number[];         // Optional - can copy [fieldLengths] into table
    dataParameters: {"field": string; "value": string;}[]
    reportID: number;                   // FK to report (query / data).  -1: dont load any report data
    reportName: string;                 // Report (query) name in Eazl (DS implied)
    rowLimit: number;                   // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    addRestRow: boolean;                // True means add a row to  = SUM(rest)
    size: string;                       // Small, Medium, Large ito data loading

    // Container
    containerBackgroundcolor: string;
    containerBorder: string;
    containerBorderRadius: string;
    containerBoxshadow: string;
    containerFontsize: number;
    containerHeight: number;
    containerLeft: number;
    containerHasTitle: boolean;         // True to display Title at top of container
    containerTop: number;
    containerWidth: number;
    containerZindex: number;

    // Title
    titleText: string;                  // Text, can include HTML & keywords (##today##)
    titleBackgroundColor: string;
    titleBorder: string;                // css spec, ie 1px solid black
    titleColor: string;
    titleFontsize: number;              // in px (for later use)
    titleFontWeight: string;            //   (for later use)
    titleHeight: number;                // in px (for later use)
    titleLeft: number;                  // in px
    titleMargin: string;                // css spec, ie 2px 1px 0px 0px
    titlePadding: string;               // css spec, ie 2px 1px 0px 0px
    titlePosition: string;              // absolute (needed for left to work) or relative
    titleTextAlign: string;             // left, right, center
    titleTop: number;                   // in px (for later use)
    titleWidth: number;                 // in %: 0 means it adapts to container

    // Graph
    graphType: string;                  // bar, pie, etc
    graphHeight: number;                // in px
    graphLeft: number;                  // in px
    graphTop: number;                   // in px
    graphWidth: number;                 // in px
    graphGraphPadding: number;
    graphHasSignals: boolean;
    graphFillColor: string;
    graphHoverColor: string;
    graphSpecification: any;
    graphDescription: string;

    // X axis
    graphXaggregate: string;
    graphXtimeUnit: string;
    graphXfield: string;
    graphXtype: string;
    graphXaxisTitle: string;

    // Y axis
    graphYaggregate: string;
    graphYtimeUnit: string;
    graphYfield: string;
    graphYtype: string;
    graphYaxisTitle: string;

    graphTitle: string;
    graphMark: string;
    graphMarkColor: string;
    graphUrl: string;
    graphData: any;
    graphColorField: string;
    graphColorType: string;

    // Table - to be determined later ...
    tableBackgroundColor: string;       // Background color
    tableColor: string;                 // Text color
    tableCols: number;                  // Nr of cols, 0 means all
    fontSize: number;                   // Font size of text
    tableHeight: number;                // in px, cuts of rest if bigger than this
    tableHideHeader: boolean;           // False to hide the column header row
    tableLeft: number;                  // in px (for later use)
    tableLineHeight: number;            // Background color (for later use)
    tableRows: number;                  // Nr of rows in the data, excluding header: 0 means all
    tableTop: number;                   // in px (for later use)
    tableWidth: number;                 // in px, cuts of rest if bigger than this (for later use)

    // Slicer
    slicerAddRest: boolean;             // True to add everything NOT in slicerSelection
    slicerAddRestValue: boolean;        // True means add all NOT in Sl
    // 1. All in Sl selected + AddRest = 100% of data)  2. None in Sl + AddRest = Compliment
    slicerBins: {isSelected: boolean; name: string; fromValue: number; toValue: number}[];
    slicerFieldName: string;            // Name to filter on
    slicerNumberToShow: string;         // Nr fields (values) to show in Slicer - default = All
    slicerSelection: {isSelected: boolean; fieldValue: string;}[];
    slicerSortField: string;            // Name of Field to sort Slicer dataset on
    slicerSortFieldOrder: string;       // Sort order for Slicer dataset, Ascending, Descending
    slicerType: string;                 // Type of Slicer, ie List, Bin

    // Shape
    shapeBullets: string[];             // Array of bullet points
    shapeBulletStyleType: string;       // List marker: disc, circle, square, none
    shapeBulletsOrdered: boolean;       // True if the list is ordered
    shapeCorner: number;                // Corner size in px, ie 15
    shapeFill: string;                  // Fill / inside (ie of circle, colour of text, etc)
    shapeFontFamily: string;            // Font, ie Aria, Sans Serif
    shapeFontSize: number;              // Size of font in px, ie 12
    shapeIsBold: boolean;               // True if text is bold
    shapeIsItalic: boolean;             // True if text is italic
    shapeOpacity: number;               // Opacity, between 0 and 1, ie of rectangle
    shapeRotation: number;              // Nr of degrees to rotate a Shape
    shapeStroke: string;                // Colour of line
    shapeStrokeWidth: string;           // Line thickness in px
    shapeText: string;                  // Text in textbox
    shapeValue: string;                 // Value to display

    // Created, updated and refreshed
    refreshMode: string;                // Manual, OnOpen, Repeatedly
    refreshFrequency: number;           // Nr of seconds if RefreshMode = Repeatedly
    widgetRefreshedOn: string;          // Data Refreshed on
    widgetRefreshedBy: string;          // Date Refreshed by
    widgetCreatedOn: string;            // Created on
    widgetCreatedBy: string;            // Created by
    widgetUpdatedOn: string;            // Updated on
    widgetUpdatedBy: string;            // Updated by

}
