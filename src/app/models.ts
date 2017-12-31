// ALL models (schema) are kept here

// Setup / Settings / General
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


// Messages / Activities / Alerts / Comments
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
    widgetID: number;
    comment: string;
    creator: string;
    createdOn: string;
}


// Data
export class Combination {
    combinationID: number;
    dashboardID: number;
    type: string;                       // ie Union
}

export class CombinationDetail {
    combinationDetailID: number;
    combinationID: number;
    lhDatasourceID: number;
    lhFieldName: string;
    rhDatasourceID: number;
    rhFieldName: string;
}

export class DatasourceFilter {
    id: number;
    datasourceID: number;
    fieldName: string;
    operator: string;
    filterValue: string | number;
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

export class Datasource {
    id: number;
    name: string;
    type: string;
    description;
}

export class CurrentDatasource {
    id: number;
    type: string;
    name: string;
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn: string;
    parameters: string;
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
    category: string;
    name: string;
    description: string;
}

export class CurrentTransformation {
    id: number;
    category: string;
    name: string;
    description: string;
    fieldID: number;
    fieldName: string;
    parameters: string;
}

export class Field {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

export class FieldMetadata{
    name: string;
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
}


// Dashboard
export class CanvasShape {

    // Type
    shapeType: string;

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
    version: number;

    // Data related - only for Textboxes
    datasetID?: number;
    
    // @Runtime
    isSelected: boolean;

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

    // shape
    cx: string;                             // circle svg cx in px - ie '50' without dimension
    cy: string;                             // circle svg cy
    r: string;                              // circle svg radius
    stroke: string;                         // colour of line
    strokeWidth: string;                    // line thickness in px
    fill: string;                           // fill / inside (ie of circle)   

    // Created, updated and refreshed
    widgetCreatedOn: string;              // Created on
    widgetCreatedBy: string;              // Created by
    widgetUpdatedOn: string;              // Updated on
    widgetUpdatedBy: string;              // Updated by    

}

export class CanvasWidget {

    // Trashed
    isTrashed: boolean;

    // Not needed when Widget is inside a Dashboard
    dashboardID: number;                // FK to DashboardID to which widget belongs
    dashboardTabID: number;             // FK to Tab where the widget lives
    dashboardTabName: string;           // FK to Tab Name where widget lives

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

export class WidgetLinkedDashboard {
    id: number;
    sourceDashboardID: number;
    sourceWidgetID: number;
    destinationDashboardID: number;
    destinationWidgetID: number;
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
    dashboardID: number;                  // FK to DashboardID to which widget belongs
    dashboardTabID: number;               // FK to Tab where the widget lives
    name: string;
    color: string;
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
    repeats: string;       // Daily, Weekday (M-F), Weekly, Monthly, Yearly
    repeatsEvery: number;  //   X                     X        X        X
    repeatsOn: string[];   // Weekly:  (M, T, W, ... S)
    repeatsFor: string;    // Monthly: DayOfWeek, DayOfMonth
    startsOn: string;      // Date
    EndsNever: boolean;
    EndsAfter: number;     // n times
    EndsOn: string;        // Date
}

export class DashboardPermission {
    id: number;
    dashboardID: number;
    userID: string;        // 1 of usr/grp filled in, one blank
    groupID: string;
    canView: boolean;
    canEdit: boolean;    
}
