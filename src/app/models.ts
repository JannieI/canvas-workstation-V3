// ALL models (schema) are kept here
export class canvasShape {
    imageAlt: string;                      // alt in img tag
    imageHeigt: number;                    // in px
    imageLeft: number;                     // in px
    imageSource: string;                   // Path (folder + filename) <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
    imageTop: number;                      // in px
    imageWidth: number;                    // in px
    
}

export class canvasWidget {

    // Trashed
    isTrashed: boolean;

    // Not needed when Widget is inside a Dashboard
    dashboardID: number;                   // FK to DashboardID to which widget belongs
    dashboardTabID: number;               // FK to Tab where the widget lives
    dashboardTabName: string;             // FK to Tab Name where widget lives

    // Identification and Description
    id: number;
    name: string;
    description: string;
    grammar: string;
    version: number;

    // @Runtime
    isLiked: boolean;                      // @RunTime: True if Widget is liked by me
    isSelected: boolean;

    // Data related
    datasetID: number;
    dataParameters: 
    [ 
        {
            "field": string;
            "value": string;
        }
    ]
    reportID: number;                      // FK to report (query / data).  -1: dont load any report data
    reportName: string;                    // Report (query) name in Eazl (DS implied)
    rowLimit: number;                      // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    addRestRow: boolean;                  // True means add a row to  = SUM(rest)
    size: string;                           // Small, Medium, Large ito data loading

    // Links
    hyperlinkDashboardID: number;           // Optional Widget ID to jump to
    hyperlinkDashboardTabID: number;        // Optional Tab Nr to jump to

    // Container
    containerBackgroundcolor: string;
    containerBorder: string;
    containerBoxshadow: string;
    containerColor: string;
    containerFontsize: number;
    containerHeight: number;
    containerLeft: number;
    containerWidgetTitle: string;         // Title at top of container
    containerTop: number;
    containerWidth: number;
    containerZindex: number;

    // Title
    titleText: string;                     // with HTML & keywords (##today##)
    titleBackgroundColor: string;
    titleBorder: string;
    titleColor: string;
    titleFontsize: number;                 // in px
    titleFontWeight: string;
    titleHeight: number;                   // in px
    titleLeft: number;                     // in px
    titleMargin: string;
    titlePadding: string;
    titlePosition: string;
    titleTextAlign: string;
    titleTop: number;                      // in px
    titleWidth: number;                    // in px: 0 means it adapts to container

    // Graph
    graphType: string;                     // bar, pie, etc
    graphHeight: number;                   // in px
    graphLeft: number;                     // in px
    graphTop: number;                      // in px
    graphWidth: number;                    // in px
    graphGraphPadding: number;
    graphHasSignals: boolean;
    graphXcolumn: string;
    graphYcolumn: string;
    graphFillColor: string;
    graphHoverColor: string;
    graphSpecification: any;

    // Table - to be determined later ...
    tableColor: string;                    // Text color
    tableCols: number;                     // Nr of cols, 0 means all
    tableHeight: number;                   // in px, cuts of rest if bigger than this
    tableHideHeader: boolean;
    tableLeft: number;                     // in px
    tableRows: number;                     // Nr of rows in the data, excluding header: 0 means all
    tableTop: number;                      // in px
    tableWidth: number;                    // in px, cuts of rest if bigger than this

    // Created, updated and refreshed
    refreshMode: string;                   // Manual, OnOpen, Repeatedly
    refreshFrequency: number;              // Nr of seconds if RefreshMode = Repeatedly
    widgetRefreshedOn: string;            // Data Refreshed on
    widgetRefreshedBy: string;            // Date Refreshed by
    widgetCreatedOn: string;              // Created on
    widgetCreatedBy: string;              // Created by
    widgetUpdatedOn: string;              // Updated on
    widgetUpdatedBy: string;              // Updated by    

}

export class canvasActivity {
    id: number;
    createdBy: string;
    createdOn: string;
    activityType: string;
    activityStatus: string;
    linkedDashboardList: string[];
    activityText: string;
    activityComments: string[];
}

export class canvasMessage {
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

export class canvasAlert {
    id: number;
    sentOn: string;
    recipient: string;
    read: boolean;
    alertText: string;
    alertData?: any;    //type of data, table name, field names, field values
}

export class widgetNote {
    id: number;
    dashboardID: number;
    widgetID: number;
    noteText: string;
    updatedBy: string;
    updatedOn: string;
}

export class widgetLinkedDashboard {
    id: number;
    sourceDashboardID: number;
    sourceWidgetID: number;
    destinationDashboardID: number;
    destinationWidgetID: number;
}

export class buttonBarAvailable {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
}

export class buttonBarSelected {
    id: number;
    buttonText: string;
    description: string;
    sortOrder: number;
}

export class datasourceFilter {
    id: number;
    fieldName: string;
    operator: string;
    filterValue: string | number;
}

export class dataQualityIssue {
    id: number;
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

export class datasource {
    id: number;
    name: string;
    type: string;
    description;
}

export class currentDatasource {
    id: number;
    name: string;
    type: string;
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn;
    parameters: string;
}

export class datasourcePermission {
    id: number;
    datasourceID: number;
    userID: string;        // 1 of usr/grp filled in, one blank
    groupID: string;
    canView: boolean;
    canEdit: boolean;    
}

// Dashboard
export class dashboard {

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
    defaultTabID;
    defaultExportFileType: string;
    url: string;
    qaRequired: boolean;

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

export class dashboardTag {
    id: number;
    dashboardID: number;
    tag: string;
}

export class dashboardTemplate {
    id: number;
    name: string;
    description: string;
}

export class dashboardTheme {
    id: number;
    name: string;
    description: string;
}

export class dashboardComment {
    id: number;
    dashboardID: number;
    comment: string;
    creator: string;
    createdOn: string;
}

export class dashboardSnapshot {
    id: number;
    dashboardID: number;
    name: string;
    comment: string;
}

export class dashboardSchedule {
    id: number;
    dashboardID: number;
    name: string;
    description: string;
    repeats: string;       // Daily, Weekday (M-F), Weekly, Monthly, Yearly
    repeatsEvery: number;  //   X                     X        X        X
    repeatsOn: string[];   // Weekly:  (M, T, W, ... S)
    repeatsFor: string;    // Monthly: DayOfWeek, DayOfMonth
    startsOn: string;      // Date
    EndsNever: boolean;
    EndsAfter: number;     // n times
    EndsOn: string;        // Date
}

export class dashboardPermission {
    id: number;
    dashboardID: number;
    userID: string;        // 1 of usr/grp filled in, one blank
    groupID: string;
    canView: boolean;
    canEdit: boolean;    
}

// CSS Color
export class CSScolor {
    name: string;
}

export class transformation {
    id: number;
    category: string;
    name: string;
    description: string;
}

export class currentTransformation {
    id: number;
    category: string;
    name: string;
    description: string;
    fieldID: number;
    fieldName: string;
    parameters: string;
}

export class field {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class fieldMetadata{
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}
