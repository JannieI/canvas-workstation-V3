
    // Utility vars, ie used on more than one accasion:
    colourPickerClosed = new BehaviorSubject<
        {
            callingRoutine: string;
            selectedColor:string;
            cancelled: boolean
        }
    >(null);
    conditionFieldDataType: string = '';
    conditionOperator: string = '';
    continueToTransformations: boolean = false;         // True after Edit DS -> Open Transformations form
    getSource: string = 'Test';     // Where to read/write: File, Test (JSON Server), Canvas Server
    headers = new HttpHeaders().set("Content-Type", "application/json");

    selectedWidgetIDs: number[] = [];
    previousGraphEditDSID: number = -1;
    templateInUse = new BehaviorSubject<boolean>(false);
    widgetGroup = new BehaviorSubject<number[]>([]);




    // Prerequired info for Canvas
    // *********************************************************************************

    // Templates, Constants
    dashboardTemplate: Dashboard = dashboardTemplate;
    dashboardTabTemplate: DashboardTab = dashboardTabTemplate;
    vlTemplate: dl.spec.TopLevelExtendedSpec = vlTemplate;
    widgetTemplate: Widget = widgetTemplate;
    widgetTemplateInner: any = widgetTemplateInner;
    serverTypes: TributaryServerType[] = [ ...]

    currentCanvasServerURI: string = '';

    // Environment setting: Server Url, etc
    ENVCanvasServerList: 
    ENVStartupCanvasServerName: string = environment.ENVStartupCanvasServerName;
    ENVCanvasDatabaseLocalUrlS1: string = environment.ENVCanvasDatabaseLocalUrlS1;
    ENVCanvasDatabaseLocalUrlS2: string = environment.ENVCanvasDatabaseLocalUrlS2;
    ENVCanvasDatabaseLocalUrlS3: string = environment.ENVCanvasDatabaseLocalUrlS3;
    ENVCanvasDatabaseLocalUrlS4: string = environment.ENVCanvasDatabaseLocalUrlS4;
    ENVCanvasDatabaseLocalUrlS5: string = environment.ENVCanvasDatabaseLocalUrlS5;




    // Identification info: Canvas-Server, Company, User
    // *********************************************************************************
    // TODO - get from DB, not Constants



    // User
    // *********************************************************************************

    // User ID info - stored locally and used to login / verify
    canvasServerName: string = environment.ENVStartupCanvasServerName;
    currentUserID: string = '';
    canvasServerURI: string = '';
    currentCompany: string = '';
    currentToken: string = '';
    loggedIntoServer = new BehaviorSubject<boolean>(true);  // Emits True when log in/out of server

    // Canvas Server Profile (and settings)
    canvasSettings: CanvasSettings = {
        id: 1,
        companyName: '',
        companyLogo: '',
        dashboardTemplate: '',
        maxTableLength: 500,
        widgetsMinZindex: 50,
        widgetsMaxZindex: 59,
        gridSize: 3,
        snapToGrid: true,
        printDefault: '',
        printSize: '',
        printLayout: '',
        notInEditModeMsg: 'Not in Edit Mode (see Edit menu Option)',
        noQueryRunningMessage: 'No Query',
        queryRunningMessage: 'Query running...',
        cleanCacheOnLogin: false,
        cleanCacheOnLogout: false,
        editedBy: '',
        editedOn: null,
        createdBy: '',
        createdOn: null

    };

    // Company Profile (and defaults)

    // Current User Profile
    currentUser: CanvasUser;                            // Current logged in user


    // Canvas-related info and Data
    // *********************************************************************************

    // Cache of Permanent Canvas-related data read from the Canvas-Server
    // It hold full sets (all the records) but not necessarily complete (some portions like
    // the data arrays may be missing)
    actions: CanvasAction[] = [];
    backgroundcolors: CSScolor[] = [];
    backgroundcolorsDefault: CSScolor[] = [];
    canvasAuditTrails: CanvasAuditTrail[] = [];
    canvasComments: CanvasComment[] = [];
    canvasGroups: CanvasGroup[] = [];
    canvasMessages: CanvasMessage[] = [];
    canvasTasks: CanvasTask[] = [];
    canvasUsers: CanvasUser[] = [];
    containerStyles: ContainerStyle[] = [];
    dashboardLayout: DashboardLayout[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardsRecent: DashboardRecent[] = [];           // List of Recent Dashboards
    dashboardsRecentBehSubject = new BehaviorSubject<DashboardRecent[]>([]);  // Recently used Dashboards
    dashboards: Dashboard[] = [];
    dashboardScheduleLog: DashboardScheduleLog[] = [];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardTags: DashboardTag[] = [];
    dashboardThemes: DashboardTheme[] = [];
    dashboardLayouts: DashboardLayout[] = [];
    datasources: Datasource[] = [];
    datasourceSchedules: DatasourceSchedule[] = [];
    datasourceScheduleLog: DatasourceScheduleLog[] = [];
    dataCachingTable: DataCachingTable[] = [];
    dataConnections: DataConnection[] = [];
    dataFields: DataField[] = [];
    dataOwnerships: DataOwnership[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    datasets: any = [];                                 // List of dSets, NO data
    datasourcePermissions: DatasourcePermission[] = [];
    datasourceTransformations: DatasourceTransformation[] = [];
    dataTables: DataTable[] = [];
    finalFields: any = finalFields;
    hasNewMessage = new BehaviorSubject<boolean>(false);
    lastMessageDateTime: Date = new Date(); // Last time a caching message was received
    statusBarMessageLogs: StatusBarMessageLog[] = [];
    transformations: Transformation[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    widgetCheckpoints: WidgetCheckpoint[] = [];
    widgets: Widget[] = [];
    widgetLayouts: WidgetLayout[] = [];
    widgetGraphs: WidgetGraph[] =[];
    widgetStoredTemplates: WidgetStoredTemplate[] =[];


    // Cache of Permanent Canvas-related data for the currentDashboard and
    // currentDatasources.  It holds complete data
    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined
    currentDashboardName = new BehaviorSubject<string>('');
    currentDashboardPermissions: DashboardPermission[] = [];
    currentDashboards: Dashboard[] = [];
    currentDashboardSchedules: DashboardSchedule[] = [];
    currentDashboardSnapshots: DashboardSnapshot[] = [];
    currentDashboardSubscriptions: DashboardSubscription[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentDashboardTags: DashboardTag[] = [];
    currentDataOwnerships: DataOwnership[] = [];
    currentDataQualityIssues: DataQualityIssue[] = [];
    currentDatasets: any = [];                          // Used in current D, with data
    currentDatasources: Datasource[] = [];
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentDatasourceSchedules: DatasourceSchedule[] = [];
    currentPaletteButtonBar: PaletteButtonBar[];
    currentPaletteButtonsSelected= new BehaviorSubject<PaletteButtonsSelected[]>([]);
    currentTransformations: Transformation[] = [];
    changedWidget = new BehaviorSubject<Widget>(null);    // W that must be changed
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgets: Widget[] = [];


    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyBackgroundColors: boolean = true;
    isDirtyBackgroundColorsDefault: boolean = true;
    isDirtyCanvasComments: boolean = true;
    isDirtyCanvasGroups: boolean = true;
    isDirtyCanvasMessages: boolean = true;
    isDirtyCanvasSettings: boolean = true;
    isDirtyCanvasTasks: boolean = true;
    isDirtyCanvasAuditTrails: boolean = true;
    isDirtyContainerStyles: boolean = true;
    isDirtyDashboardPermissions: boolean = true;
    isDirtyDashboards: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    isDirtyDashboardSchedules: boolean = true;
    isDirtyDashboardSnapshots: boolean = true;
    isDirtyDashboardSubscription: boolean = true;
    isDirtyDashboardTabs: boolean = true;
    isDirtyDashboardTags: boolean = true;
    isDirtyDashboardThemes: boolean = true;
    isDirtyDataConnections: boolean = true;
    isDirtyDataFields: boolean = true;
    isDirtyDataOwnership: boolean = true;
    isDirtyDataQualityIssues: boolean = true;
    isDirtyDatasets: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyDataTables: boolean = true;
    isDirtyDatasourceSchedules: boolean = true;
    isDirtyDatasourceTransformations: boolean = true;
    isDirtyPaletteButtonBar: boolean = true;
    isDirtyPaletteButtonsSelected: boolean = true;
    isDirtyShapes: boolean = true;
    isDirtySlicers: boolean = true;
    isDirtystatusBarMessageLogs: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyUserPaletteButtonBar: boolean = true;
    isDirtyUsers: boolean = true;
    isDirtyWidgetCheckpoints: boolean = true;
    isDirtyWidgets: boolean = true;
    isDirtyWidgetGraphs: boolean = true;




    // Global vars that guide all interactions
    // *********************************************************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);     // True/False = EditMode/ViewMode
    showGrid = new BehaviorSubject<boolean>(false);     // True to show th egrid
    showPalette = new BehaviorSubject<boolean>(true);   // True to show the palette
    preferencePaletteHorisontal = new BehaviorSubject<boolean>(true); // Palette orientation
    loadVariableOnStartup = new BehaviorSubject<boolean>(false); // True to load variables in App.ngOnInit

    // First time user
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);
    firstAction: boolean = true;               // True if 1st action per D

    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    hasDatasources = new BehaviorSubject<boolean>(false);   // Used to set menu
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page


    // Session
    dontDisturb = new BehaviorSubject<boolean>(false);   // True means dont disturb display
    dsIDs: number[] = [];           // Dataset IDs
    sessionDateTimeLoggedin: string = '';
    sessionDebugging: boolean = true;      // True to log multiple messages to Console
    sessionLogging: boolean = false;


    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.canvasSettings.noQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)

    // Dexie
    dbCanvasAppDatabase;
    dbDataCachingTable;

