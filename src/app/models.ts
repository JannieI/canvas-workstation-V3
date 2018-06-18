import { DashboardCommentsComponent } from "./dashboard.comments.component";

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
export class CanvasSettings {
    companyName: string;                    // Company Name
    companyLogo: string;                    // Optional file name for Company logo
    dashboardTemplate: string;              // Default Dashboard Template (later use)
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
    createor: string;                       // UserID who created action
    created: string;                        // DateTime action was created
}

export class CanvasAuditTrail {
    id: number;                             // Unique id per action
    dashboardID: number;                    // Where action took place
    dashboardTabID: number;                 // Where action took place
    widgetID: number;                       // If linked to a Widget
    userID: string;                         // User who made change
    keyChanged: string;                     // Field / key that was changed
    oldValue: any;                          // Value prior to change
    newValue: any;                          // Value after change
    changedOn: string;                      // Date Time when changes was made
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
    currentDashboardState: string;          // Current D state
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
    sortOrderSelected: number;              // SortOrder once selected, null ind DB, calced @Runtime
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
    sortOrderSelected: number;              // SortOrder once selected, null ind DB, calced @Runtime
    isDefault: boolean;
    functionName: string;
    params: string;
    tooltipContent: string;
    isSelected: boolean;                    // Toggled at Runtime
}

export class CSScolor {
    name: string;                           // Name, ie brown
    cssCode: string;                        // CSS code, as name, hex, rgb.  ie transparent, rgb(111,52,78)
    shortList: boolean;                     // True if part of shorter list
}


// Messages / Activities / Alerts / Comments / User
export class CanvasTask {
    id: number;                             // Unique task ID
    taskText: string;                       // Description of task
    activityType: string;                   // Type of Task (or Activity)
    taskStatus: string;                     // Status, ie Draft, Completed
    assignedToUserID: string;               // UserID to whom this was assigned
    
    precedingTaskID: number;                // Optional task on which this one depends
    linkedDashboardID: number;              // Optional D-ID linked to this task
    taskComments: string[];                 // Immutable array of comments / feedback (userID, dt, text)
    startDate: string;                      // Date when task should start
    deadlineDate: string;                   // Date when task should end
    endDate: string;                        // Date when task ended
    durationDays: number;                   // Duration in days

    // Generated by the system
    editedBy: string;                       // Last user who edited this task
    editedOn: string;                       // Date this task was last edited
    createdBy: string;                      // UserID who created this task, can be System
    createdOn: string;                      // Date task was created
}

export class CanvasMessage {
    id: number;                 // Unique ID
    threadID: number;           // Optional thread - to keep converstations together (later use)
    sender: string;             // UserID who sent message, could also be System (for Alerts)
    sentOn: string;             // DateTime message was sent
    recipients: [               // Original list of Users, groups are split into users @time
        {
            userID: string;
            readOn: string;     // dateTime read, null if not read
        }
    ];
    toGroups: string[];         // Original list of Groups
    subject: string;            // Message Subject
    body: string;               // Message body
    dashboardID: number;        // Optional Dashboard linked to this message
    dashboardTabID: number;     // Optional Tab linked to this message
    url: string;                // Optional url to link to
    replyToMessageID: number;   // Optional message to which this is a reply

    // At runtime
    iHaveReadThis: boolean;     // 2nd normal form to make easier, if current user read it
    dashboardName: string;      // Optional, name of linked D
    replySender: string;        // Optional, sender of message to which this is a reply
    replyMessageStart: string;  // Optional, first 50 chars of message to which this is a reply
}

export class CanvasMessageSingle {
    id: number;                 // Unique ID
    messageID: number;          // FK to CanvasMessage
    recipient: string;          // Single Recipient, deduced from To-lists in Message
    read: boolean;              // True if Recipient has read the message.  Can toggle this
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
    isSuperuser: boolean;                   // Systems supervisor - has ALL powers
    isStaff: boolean;                       // Is a staff member (and not Guest)
    isActive: boolean;                      // When False, cannot work on system (ie left company)  
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
    isFirstTimeUser: boolean;               // True if not created a D
    isAdministrator: boolean;               // Role can add/delete users to the group,
        // and assign roles).  Must be at least one administrator role at all times.
    dashboardCanCreateRole: boolean;        // Role can create Dashboards
    dashboardCanViewRole: boolean;          // Role can view Dashboards
    dashboardCanEditRole: boolean;          // Role can change / edit Dashboards
    dashboardCanSaveRole : boolean;         // Role can save changes to a Dashboards
    dashboardCanDeleteRole: boolean;        // Role can delete a Dashboard
    dashboardCanGrantAccessRole: boolean;   // Role can change access to a Dashboard
    dashboardCanAddDatasourceRole: boolean; // Role can change add DS to a Dashboard
    canManageGroupRole: boolean;            // Role can add/delete users to Group
    preferencePaletteHorisontal: boolean;                   // T/F - Palette Horisontal (else Vertial)
    preferenceAutoSync: boolean;                            // T/F - can auto sync
    preferenceShowOpenStartupMessage: boolean;              // T/F - show open startup msg
    preferenceShowOpenDataCombinationMessage: boolean;      // T/F - show msg on open combination form
    preferenceShowViewStartupMessage: boolean;              // T/F - show msg on open view form
    preferenceShowDiscardStartupMessage: boolean;           // T/F - show msg on discard form
    preferenceDefaultTemplateID: number;                    // Default Template ID
    preferenceDefaultDateformat: string;                    // Default Date Format, ie YYYY/MM/DD
    preferenceDefaultFolder: string;                        // Default Folder
    preferenceDefaultPrinter: string;                       // Default Printer
    preferenceDefaultPageSize: string;                      // Default Page Size
    preferenceDefaultPageLayout: string;                    // Default Page Layout
    preferenceDefaultSnapshotMins: number;                  // Mins after which a Snapshot must be taken (0 = none)
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
    id: number;                             // Unique ID
    name: string;                           // Short name to identify issue
    datasourceID: number;                   // DS to which the issue relates
    status: string;                         // Status: Logged, InProgress, Solved
    type: string;                           // User-defined type, ie Stats, Backfill
    description;                            // Description of the issue
    nrIssues: number;                       // Optional Nr of issue, can be rounded
    loggedBy: string;                       // UserID who logged the issue
    loggedOn: string;                       // Date Issue was logged
    solvedBy: string;                       // UserID who solved the issue
    solvedOn: string;                       // Date issue was marked as solved
}

export class DataOwnership {
    id: number;                             // Unique ID
    datasourceID: number;                   // DS for which the ownership is defined
    userID: string;                         // Short name to identify issue
    type: string;                           // User-defined ownership role, ie Owner, Steward, etc
    description;                            // Description of the responsibilities
    createdBy: string;                      // UserID who created the record
    createdOn: string;                      // Date record was created
    updatedBy: string;                      // UserID who last updated the record
    updatedOn: string;                      // Last Date when record was updated

    // @RunTime
    datasourceName: string;                 // Name of the linked DS
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
    username: string;                   // Username to log into server
    password: string;                   // Password to log into server
    description: string;
    createdBy: string;
    createdOn: string;
    refreshedBy: string;
    refreshedOn: string;
    dataFieldIDs: number[];             // IDs of fields in DB table
    dataFields: string[];               // FieldNames, in order to display
    dataFieldTypes: string[];           // Field Types, same order as dataFields
    dataFieldLengths: number[];         // Max field lengths, same order as dataFields
    parameters: string;                 // Parameters to pass into SQL query

    // Location and authentication
    folder: string;
    fileName: string;
    excelWorksheet: string;
    transposeOnLoad: boolean;
    startLineNr: number;                // 1 = first = default
    csvSeparationCharacter: string;     // CSV file column separator: comma or ;
    csvQuotCharacter: string;           // CSV values in "", in '' or without quotes

    // Managed Connection, Connection created and managed outside of the DS
    connectionID: number;               // Connection to DB
    dataTableID: number;                // ID of table linked in DB
    businessGlossary: string;           // Detailed business oriented description of DS (non-technical)
    dataDictionary: string;             // Detailed technical description of DS

    // Direct Connection, all info provided here and once off
    databaseName: string;                   // DB to connect to
    port: string;                       // Port on the DB Server
    serverType: string;                 // Server or Host type, ie MySQL, PostgreSQL, etc
    serverName: string;                 // Server or Host name
    dataTableName: string;              // Table inside Server with the data
    dataSQLStatement: string;           // SQL Statement to extract data with
    dataNoSQLStatement: string;         // NoSQL Statement to extract data with

    // Updated at runtime
    nrWidgets: number;                  // Nr of Ws linked to this DS (at the moment)
}

export class DatasourcePermission {
    id: number;                         // Unique ID
    datasourceID: number;               // FK to DS
    name?: string;                      // Optional DS name - filled in @Runtime
    userID: string;                     // 1 of usr/grp filled in, one blank
    groupID: number;                    // Granted to Group ID
    canView: boolean;                   // Can view a DS
    canEdit: boolean;                   // Can Edit a DS, ie do a transformation
    canAdd: boolean;                    // Can Add a new DS, ie DB table or a file
    canDelete: boolean;                 // Can Delete a DS (Definition, not the Data)
}

export class DatasourceTransformation {
    id: number;                         // Unique ID
    datasourceID: number;               // FK to DS
    sequence: number;                   // Order, 1 at top
    parameterText: string[];            // Parameter Values for this transformation
}

export class Transformation {
    id: number;                         // Unique ID
    category: string;                   // Category, ie based on a Column, etc
    name: string;                       // Name of transformation, ie FillBlank
    description: string;                // Description of transformation 
    fieldName: string;
    
    // Parameter info
    parameters: {paramName: string; paramValue: string}[];
    parameterPlaceholder: string[];
    parameterTitle: string[];
    parameterText: string[];
    parameterHeading: string[];
}

export class DataConnection {
    id: number;                 // Unique ID
    connectionName: string;     // Name of the Connection, ie XIS MS SQL Server
    serverType: string;         // Type of server, ie PostgreSQL, MySQL, etc
    serverName: string;         // DNS Server Name or IP address, ending with optional :port
    port: string;               // Port on the Server, maybe blank
    database: string;           // Database to connect to
    authentication: string;     // Type of authentication: usr & psw, OR login as me (ie using AD)
    description: string;        // Description of Connection

    // For later use
    defaultDatabase?: string;
    logFolder?: string;
    logfileName?: string;
    characterSet?: string;
    language?: string;
    serverOptions?: string;

}

export class DataTable {
    id: number;                 // Unique ID
    connectionID: number;       // Connection to which the Field belongs
    nameDB: string;             // Field Name (in DB)
    nameLocal: string;          // Optional Local Field Name (shown in D)
    type: string;               // Table / View
    description: string;        // Detailed description of the table
    businessGlossary: string;   // Detailed business oriented description of table (non-technical)

    // Creation, update and refresh
    creator: string;            // Created By
    dateCreated: string;        // Created On
    editor: string;             // Last Edited By
    dateEdited: string;         // Last Edited On
}

export class DataField {
    id: number;                 // Unique ID
    tableID: number;            // DataTable to which the Field belongs
    nameDB: string;             // Field Name (in DB)
    nameLocal: string;          // Optional Local Field Name (shown in D)
    type: string;               // String, Number, Boolean
    format: string;             // Optional, ie YYYY/MM/DD
    filterOperand: string;      // Optional filter operand, ie '>='
    filterValue: string;        // Optional filter value, ie '1'
    calculation: string;        // Optional Calculation, ie 'OtherFieldName / 2'
    orderSequence: number;      // Optional order sequence
    orderDirection: string;     // Optional order direction, Asc / Desc
    description: string;        // Detailed description of field (technical terms)
    businessGlossary: string;   // Detailed business oriented description of field (non-technical)
    keyField: boolean;          // True if a key field - used for explanedBy (later use)
    explainedBy: string;        // Graph (bar chart of ...) that explains field if key field is true (later use)

    // Creation, update and refresh
    creator: string;            // Created By
    dateCreated: string;        // Created On
    editor: string;             // Last Edited By
    dateEdited: string;         // Last Edited On

    // At Runtime
    hidden: boolean;            // True if hidden at runtime
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

export class Dashboard {

    // Identification and description
    id: number;
    originalID: number;             // ID of the original (Completed state) for a draft
    draftID: number;                // ID of the Draft version for a Complete
    version: number;
    state: string;
    code: string;
    name: string;
    description: string;

    // Access Type
    accessType: string;             // How to access D: Private, Public, AccessList

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

    // 2nd normal form - calculated at DB level
    nrWidgets: number;
    nrShapes: number;
    nrRecords: number;
    nrTimesOpened: number;
    nrTimesChanged: number;
    tabs: number[];
    permissions: string[];
}

export class DashboardTab {
    id: number;
    originalID: number;                 // Optional T-id from which this T was copied
    dashboardID: number;                // FK to DashboardID to which widget belongs
    name: string;                       // Short Name
    description: string;                // Description
    displayOrder: number;               // Sort on this to order tabs on D
    backgroundColor: string;            // Bg Color of T on Status Bar
    color: string;                      // Color of T name on Status Bar
}

// List of Recently opened D
export class DashboardRecent {
    id: number;                         // Unique ID
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
    id: number;                                     // Unique ID
    dashboardID: number;                            // D for which the Snapshot is stored
    name: string;                                   // Name of Snapshot
    snapshotType: string;                           // StartEditMode, BeforeFirstEdit, AutoFrequency, UserDefined
    comment: string;                                // Optional Comment
    dashboards: Dashboard[];                        // Array of D used (can include a Template)
    dashboardTabs: DashboardTab[];                  // Ts of D
    widgets: Widget[];                              // W of D
    datasets: Dataset[];                            // dSets of D
    datasources: Datasource[];                      // DS of D
    widgetCheckpoints: WidgetCheckpoint[];          // Checkpoints of W
}

export class DashboardSchedule {
    id: number;
    dashboardID: number;
    datasourceID: number;
    name: string;
    description: string;
    repeatFrequency: string;            // Occurs: Daily, Weekly, Monthly, Yearly
    repeatsEvery: number;               // Repeats every x of Frequency, ie 2 = every 2nd Month
    weeklyMonday: boolean;              // For Weekly: occurs on this weekday
    weeklyTuesday: boolean;             // For Weekly: occurs on this weekday
    weeklyWednesday: boolean;           // For Weekly: occurs on this weekday
    weeklyThursday: boolean;            // For Weekly: occurs on this weekday
    weeklyFriday: boolean;              // For Weekly: occurs on this weekday
    weeklySaturday: boolean;            // For Weekly: occurs on this weekday
    weeklySunday: boolean;              // For Weekly: occurs on this weekday
    monthlyOn: number;                  // For Monthly: Occurs on this Day of month, ie 13th
    yearlyJanuary: boolean;             // For Yearly: Occurs in this month
    yearlyFebruary: boolean;            // For Yearly: Occurs in this month
    yearlyMarch: boolean;               // For Yearly: Occurs in this month
    yearlyApril: boolean;               // For Yearly: Occurs in this month
    yearlyMay: boolean;                 // For Yearly: Occurs in this month
    yearlyJune: boolean;                // For Yearly: Occurs in this month
    yearlyJuly: boolean;                // For Yearly: Occurs in this month
    yearlyAugust: boolean;              // For Yearly: Occurs in this month
    yearlySeptember: boolean;           // For Yearly: Occurs in this month
    yearlyOctober: boolean;             // For Yearly: Occurs in this month
    yearlyNovember: boolean;            // For Yearly: Occurs in this month
    yearlyDecember: boolean;            // For Yearly: Occurs in this month
    startsOn: string;                   // Date
    endsNever: boolean;                 // True means never ends
    endsAfter: number;                  // n times, ie 2 means it will run twice
    endsOn: string;                     // Date
}

export class DashboardPermission {
    id: number;                         // Unique ID
    dashboardID: number;                // FK to D
    userID: string;                     // UserID - NB: 1 of usr/grp filled in, one blank
    groupID: number;                    // Group ID
    groupName: string;                  // Filled in @RunTime
    canEditRight: boolean;              // True if can Edit this D
    canViewRight: boolean;              // True if can View this D
    canSaveRight: boolean;              // Can Save a D
    canDeleteRight: boolean;            // True if can Delete this D
    canAddDatasource: boolean;          // True if can Add a DS to this D
    canGrantAccess: boolean;            // Can Delete a D
    grantor: string;                    // UserId who granted permission
    grantedOn: string;                  // Date and time created or last updated
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

    // Where W lives
    dashboardID: number;                // FK to DashboardID to which widget belongs
    dashboardTabID: number;             // FKs to Tabs where the widget lives
    dashboardTabIDs: number[];          // FKs to Tabs where the widget lives

    // Locking
    isLocked: boolean;                  // True if this W is temporary locked

    // Identification and Description
    id: number;
    originalID: number;                 // Original ID from which W was copied
    name: string;
    description: string;
    annotation: string;                 // Optional annotation per W, deeper info about W
    annotationLastUserID: string;       // Last UserID who updated this annotation
    annotationLastUpdated: string;      // Last date-time this annotation was updated
    visualGrammar: string;              // Gramar for graphs, default = Vega
    version: number;

    // Properties loaded @Runtime
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
    titleMargin: string;                // css spec, ie 2px 1px 0px 0px
    titlePadding: string;               // css spec, ie 2px 1px 0px 0px
    titleTextAlign: string;             // left, right, center
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
    tableLineHeight: number;            // Table Line height (for later use)
    tableRows: number;                  // Nr of rows in the data, excluding header: 0 means all
    tableTop: number;                   // in px (for later use)
    tableWidth: number;                 // in px, cuts of rest if bigger than this (for later use)

    // Slicer
    slicerAddRest: boolean;             // True to add everything NOT in slicerSelection
    slicerAddRestValue: boolean;        // True means add all NOT in Sl
    // 1. All in Sl selected + AddRest = 100% of data)  2. None in Sl + AddRest = Compliment
    slicerBins: {isSelected: boolean; name: string; fromValue: number; toValue: number}[];
    slicerColor: string;                // Text Color
    slicerFieldName: string;            // Name to filter on
    slicerNumberToShow: string;         // Nr fields (values) to show in Slicer - default = All
    slicerSelection: {isSelected: boolean; fieldValue: string;}[];
    slicerSortField: string;            // Name of Field to sort Slicer dataset on
    slicerSortFieldOrder: string;       // Sort order for Slicer dataset, Ascending, Descending
    slicerType: string;                 // Type of Slicer, ie List, Bin

    // Shape
    shapeBullet: 
        { 
            text: string; 
            linkedTabID: number; 
            color: string; 
            jumpedColor: string 
        }[];                            // Bullets, with info
    shapeBulletStyleType: string;       // List marker: disc, circle, square, none
    shapeBulletsOrdered: boolean;       // True if the list is ordered
    shapeBulletMarginBottom: number;       // Margin-Top in px
    shapeCorner: number;                // Corner size in px, ie 15
    shapeFill: string;                  // Fill / inside (ie of circle, colour of text, etc)
    shapeFontFamily: string;            // Font, ie Aria, Sans Serif
    shapeFontSize: number;              // Size of font in px, ie 12
    shapeImageUrl: string;              // URL of the Image
    shapeIsBold: boolean;               // True if text is bold
    shapeIsItalic: boolean;             // True if text is italic
    shapeOpacity: number;               // Opacity, between 0 and 1, ie of rectangle
    shapeRotation: number;              // Nr of degrees to rotate a Shape
    shapeSize: number;                  // Size of shape, used in scale(). For now: 0-9
    shapeStroke: string;                // Colour of line
    shapeStrokeWidth: string;           // Line thickness in px
    shapeSvgHeight: number;             // Height of SVG element
    shapeSvgWidth: number;              // Width of SVG element
    shapeText: string;                  // Text in textbox
    shapeTextAlign: string;             // Align text Left, Center, Right
    shapeTextColour: string;            // Text colour
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

export class WidgetCheckpoint {
    id: number;                         // Unique ID
    parentWidgetIsDeleted: boolean;     // True if W it belongs to has been deleted.
    // This is kept to perform an Undo when the W is restored.
    active: boolean;                    // Set at RunTime: true if currently shown
    dashboardID: number;                // Linked to this D
    widgetID: number;                   // Linked to this W
    originalID: number;                 // Copied from this ID
    name: string;                       // Name of Checkpoint
    widgetSpec: any;                    // json spec of W
    creator: string;                    // UserID
    createdOn: string;                  // DateTime of creation
}
