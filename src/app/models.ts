// ALL models (schema) are kept here

// Setup / Settings / General
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

export class ButtonBarAvailable {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
}

export class ButtonBarSelected {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
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
    id: number;
    sentBy: string;
    sentOn: string;
    toUsers: string[];      // Original list
    toGroups: string[];     // Original list
    recipient: string;      // Independant message, deduced from to lists
    read: boolean;
    subject: string;
    body: string;
    dashboardID: number;
}

export class CanvasAlert {
    id: number;
    sentOn: string;
    recipient: string;
    read: boolean;
    alertText: string;
    alertData?: any;    //type of data, table name, field names, field values
}

export class CanvasComment {
    id: number;
    dashboardID: number;
    dashboardTabID?: number;
    widgetID: number;
    shapeID: number;
    comment: string;
    creator: string;
    createdOn: string;
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
}

// Data
export class Dataset {
    id: number;
    datasourceID: number;
    sourceLocation: string;                 // Where data lives: file, localDB, MSSQL, etc
    folderName: string;                     // Optional folder name where data is stored
    filename: string;                       // Optional file name where data is stored
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
    userID: string;        // 1 of usr/grp filled in, one blank
    groupID: string;
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
    id: number;
    dashboardID: number;
    widgetID: number;
    widgetSpec: any;
    creator: string;
    createdOn: string;
}

export class Dashboard {

    // Identification and description
    id: number;
    version: number;
    state: string;
    code: string;
    name: string;
    description: string;

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
    tags: string[];
    permissions: string[];
}

export class DashboardTab {
    id: number;
    dashboardID: number;                  // FK to DashboardID to which widget belongs
    name: string;
    description: string;
    color: string;
}

// List of Recently opened D
export class DashboardRecent {
    userID: string;
    dashboardID: number;
    dashboardTabID: number;
    accessed: string;                   // Last dateTime opened
    stateAtRunTime: string;
    nameAtRunTime: string;
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
    id: number;
    dashboardID: number;
    userID: string;                     // 1 of usr/grp filled in, one blank
    groupID: string;
    canView: boolean;
    canEdit: boolean;
}

export class Widget {

    // Type
    widgetType: string;                 // Graph, Table, Shape, Slicer
    widgetSubType: string;              // Type of shape, ie Circle

    // Trashed
    isTrashed: boolean;

    // Where W lives
    dashboardID: number;                // FK to DashboardID to which widget belongs
    dashboardTabID: number;             // FKs to Tabs where the widget lives
    dashboardTabIDs: number[];             // FKs to Tabs where the widget lives

    // Identification and Description
    id: number;
    name: string;
    description: string;
    visualGrammar: string;              // Gramar for graphs, default = Vega
    version: number;

    // Props @Runtime
    isLiked: boolean;                   // @RunTime: True if Widget is liked by me
    isSelected: boolean;
    nrDataQualityIssues: number;
    nrComments: number;

    // Links @Runtime
    hyperlinkDashboardID: number;           // Optional Widget ID to jump to
    hyperlinkDashboardTabID: number;        // Optional Tab Nr to jump to
    
    // Data related
    datasourceID: number;                   // Specific ID that this W points to.  For a W, 
    // this is the dSet that contains its data.  For a Sl, it is the dSet that it filters.
    slicerNumberToShow: string;             // Nr fields (values) to show in Slicer - default = All
    slicerSortField: string;                // Name of Field to sort Slicer dataset on
    slicerSortFieldOrder: string;           // Sort order for Slicer dataset, Ascending, Descending
    slicerFieldName: string;                // Name to filter on
    slicerSelection: {isSelected: boolean; fieldValue: string;}[];
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
    containerColor: string;
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
    tableBackgroundColor: string;                 // Text color
    tableColor: string;                 // Text color
    tableCols: number;                  // Nr of cols, 0 means all
    tableHeight: number;                // in px, cuts of rest if bigger than this
    tableHideHeader: boolean;           
    tableLeft: number;                  // in px (for later use)
    tableRows: number;                  // Nr of rows in the data, excluding header: 0 means all
    tableTop: number;                   // in px (for later use)
    tableWidth: number;                 // in px, cuts of rest if bigger than this (for later use)

    // Shape
    shapeCx: string;                             // circle svg cx in px - ie '50' without dimension
    shapeCy: string;                             // circle svg cy
    shapeR: string;                              // circle svg radius
    shapeStroke: string;                         // colour of line
    shapeStrokeWidth: string;                    // line thickness in px
    shapeFill: string;                           // fill / inside (ie of circle)
    
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
