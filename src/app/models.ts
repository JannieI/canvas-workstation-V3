// ALL models (schema) are kept here
export class canvasShape {
    image_alt: string;                      // alt in img tag
    image_heigt: number;                    // in px
    image_left: number;                     // in px
    image_source: string;                   // Path (folder + filename) <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
    image_top: number;                      // in px
    image_width: number;                    // in px
    
}

export class canvasWidget {

    // Not needed when Widget is inside a Dashboard
    dashboard_id: number;                   // FK to DashboardID to which widget belongs
    dashboard_tab_id: number;               // FK to Tab where the widget lives
    dashboard_tab_name: string;             // FK to Tab Name where widget lives

    // Identification and Description
    id: number;
    name: string;
    description: string;
    grammar: string;
    version: number;
    is_liked: boolean;                      // @RunTime: True if Widget is liked by me

    // Data related
    datasetID: number;
    data_parameters: 
    [ 
        {
            "field": string;
            "value": string;
        }
    ]
    report_id: number;                      // FK to report (query / data).  -1: dont load any report data
    report_name: string;                    // Report (query) name in Eazl (DS implied)
    row_limit: number;                      // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    add_rest_row: boolean;                  // True means add a row to  = SUM(rest)
    size: string;                           // Small, Medium, Large ito data loading

    // Links
    hyperlinkDashboardID: number;           // Optional Widget ID to jump to
    hyperlinkDashboardTabID: number;        // Optional Tab Nr to jump to

    // Container
    container_background_color: string;
    container_border: string;
    container_box_shadow: string;
    container_color: string;
    container_font_size: number;
    container_height: number;
    container_left: number;
    container_widget_title: string;         // Title at top of container
    container_top: number;
    container_width: number;
    container_zindex: number;

    // Title
    title_text: string;                     // with HTML & keywords (##today##)
    title_backgroundColor: string;
    title_border: string;
    title_color: string;
    title_fontSize: number;                 // in px
    title_fontWeight: string;
    title_height: number;                   // in px
    title_left: number;                     // in px
    title_margin: string;
    title_padding: string;
    title_position: string;
    title_textAlign: string;
    title_top: number;                      // in px
    title_width: number;                    // in px: 0 means it adapts to container

    // Graph
    graph_type: string;                     // bar, pie, etc
    graph_height: number;                   // in px
    graph_left: number;                     // in px
    graph_top: number;                      // in px
    graph_width: number;                    // in px
    graph_graphPadding: number;
    graph_hasSignals: boolean;
    graph_xcolumn: string;
    graph_ycolumn: string;
    graph_fillColor: string;
    graph_hoverColor: string;
    graph_spec: any;

    // Table - to be determined later ...
    table_color: string;                    // Text color
    table_cols: number;                     // Nr of cols, 0 means all
    table_height: number;                   // in px, cuts of rest if bigger than this
    table_hideHeader: boolean;
    table_left: number;                     // in px
    table_rows: number;                     // Nr of rows in the data, excluding header: 0 means all
    table_top: number;                      // in px
    table_width: number;                    // in px, cuts of rest if bigger than this

    // Created, updated and refreshed
    refresh_mode: string;                   // Manual, OnOpen, Repeatedly
    refresh_frequency: number;              // Nr of seconds if RefreshMode = Repeatedly
    widget_refreshed_on: string;            // Data Refreshed on
    widget_refreshed_by: string;            // Date Refreshed by
    widget_Created_on: string;              // Created on
    widget_Created_by: string;              // Created by
    widget_updated_on: string;              // Updated on
    widget_updated_by: string;              // Updated by    

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
    refresh_mode: string;
    refresh_timer: number;
    default_tab_id: number;
    default_export_file_type: string;
    url: string;

    // Overlay looks
    background_color: string;
    background_image: string;
    templateDashboardID: number;
    
    // Creation, update and refresh
    creator: string;
    date_created: string;
    editor: string;
    date_edited: string;
    refresher: string;
    date_refreshed: string;
    
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

export class snapshot {
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
