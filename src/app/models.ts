// ALL models (schema) are kept here
export class canvasWidget {
    id: number;
    grammar: string;
    version: number;
    top: number;
    left: number;
    container_background_color: string;
    container_border: string;
    container_box_shadow: string;
    container_color: string;
    container_font_size: number;
    container_height: number;
    container_left: number;
    container_widget_title: string;                   // Title at top of container
    container_top: number;
    container_width: number;

    areas_show_widget_text: boolean;
    areas_show_widget_graph: boolean;
    areas_show_widget_table: boolean;
    areas_show_widget_image: boolean;

    textual_text_text: string;                      // with HTML & keywords (##today##)
    textual_text_backgroundColor: string;
    textual_text_border: string;
    textual_text_color: string;
    textual_text_fontSize: number;                  // in px
    textual_text_fontWeight: string;
    textual_text_height: number;                    // in px
    textual_text_left: number;                      // in px
    textual_text_margin: string;
    textual_text_padding: string;
    textual_text_position: string;
    textual_text_textAlign: string;
    textual_text_top: number;                       // in px
    textual_text_width: number;                     // in px: 0 means it adapts to container

    graph_graph_id: number;
    graph_graph_left: number;                     // in px
    graph_graph_top: number;                      // in px
    graph_vega_parameters_vega_graphHeight: number;
    graph_vega_parameters_vega_graphWidth: number;
    graph_vega_parameters_vega_graphPadding: number;
    graph_vega_parameters_vega_hasSignals: boolean;
    graph_vega_parameters_vega_xcolumn: string;
    graph_vega_parameters_vega_ycolumn: string;
    graph_vega_parameters_vega_fillColor: string;
    graph_vega_parameters_vega_hoverColor: string;
    graph_spec: any;

    table_color: string;                    // Text color
    table_cols: number;                     // Nr of cols, 0 means all
    table_height: number;                   // in px, cuts of rest if bigger than this
    table_hideHeader: boolean;
    table_left: number;                     // in px
    table_rows: number;                     // Nr of rows in the data, excluding header: 0 means all
    table_top: number;                      // in px
    table_width: number;                    // in px, cuts of rest if bigger than this

    image_alt: string;                      // alt in img tag
    image_heigt: number;                    // in px
    image_left: number;                     // in px
    image_source: string;                   // Path (folder + filename) <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
    image_top: number;                      // in px
    image_width: number;                    // in px

    properties_widget_id: number;                      // Unique ID from DB
    properties_dashboard_id: number;                   // FK to DashboardID to which widget belongs
    properties_dashboard_tab_id: number;               // FK to Tab where the widget lives
    properties_dashboard_tab_name: string;             // FK to Tab Name where widget lives
    properties_widget_code: string;                    // Short Code ~ ShortName
    properties_widget_name: string;                    // Descriptive Name
    properties_widget_description: string;             // User description
    properties_widget_default_export_filetype: string; // User can select others at export time
    properties_widget_hyperlink_tab_nr: string;        // Optional Tab Nr to jump to
    properties_widget_hyperlinkWidget_id: string;      // Optional Widget ID to jump to
    properties_widget_refresh_mode: string;            // Manual, OnOpen, Repeatedly
    properties_widget_refresh_frequency: number;       // Nr of seconds if RefreshMode = Repeatedly
    properties_widget_password: string;                // Optional password
    properties_widget_is_liked: boolean;               // @RunTime: True if Widget is liked by me

    properties_widget_report_id: number;               // FK to report (query / data).  -1: dont load any report data
    properties_widget_report_name: string;             // Report (query) name in Eazl (DS implied)
    properties_widget_report_parameters: string;       // Optional Report parameters
    properties_widget_show_limited_rows: number;       // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    properties_widget_add_rest_row: boolean;           // True means add a row to  = SUM(rest)
    properties_widget_type: string;                    // Bar, Pie, Text, etc - must correspond to coding
    properties_widget_comments: string;                // Optional comments
    properties_widget_index: number;                   // Sequence number on dashboard
    properties_widget_is_locked: boolean;              // Protected against changes
    properties_widget_size: string;                    // Small, Medium, Large
    properties_widget_system_message: string;          // Optional for Canvas to say something to user
    properties_widget_type_id: number;                 // Widget Type ID (for Bar, Pie, etc)
    properties_widget_refreshed_on: string;            // Data Refreshed on
    properties_widget_refreshed_by: string;            // Date Refreshed by
    properties_widget_Created_on: string;              // Created on
    properties_widget_Created_by: string;              // Created by
    properties_widget_updated_on: string;              // Updated on
    properties_widget_updated_by: string;              // Updated by    
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
