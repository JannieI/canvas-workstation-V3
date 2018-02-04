// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';

// Our Serives

// Our Models
import { ButtonBarAvailable }         from './models';
import { ButtonBarSelected }          from './models';
import { CanvasActivity }             from './models';
import { CanvasAlert }                from './models';
import { CanvasComment }              from './models';
import { CanvasMessage }              from './models';
import { CanvasShape }                from './models';
import { CanvasSlicer}                from './models';
import { CanvasUser}                  from './models';
import { CanvasWidget }               from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';
import { CSScolor }                   from './models';
import { CurrentDashboardInfo }       from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DashboardTemplate }          from './models';
import { DashboardTheme }             from './models';
import { Datasource }                 from './models';
import { DataQualityIssue}            from './models';
import { DatasourcePermission}        from './models';
import { DatasourcePivot }            from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { StatusBarMessage }           from './models';
import { Transformation }             from './models';
import { Widget }                     from './models';

// External
import * as dl                        from 'datalib';
import { Observable }                 from 'rxjs/Observable';

// Setup / Settings / General
const backgroundcolors: CSScolor[] =
[
    {
        name: 'transparent'
    },
    {
        name: 'beige'
    },
    {
        name: 'white'
    }
];

const shapeButtonsAvailable: ButtonBarAvailable[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
        isDefault: true
    },
    {
        id: 2,
        buttonText: 'Duplicate',
        description: 'Duplicates the current Shape with a new name (adding ... Copy n).  The Dataset is not duplicated.',
        sortOrder: 2,
        isDefault: true
    },
    {
        id: 3,
        buttonText: 'Backward',
        description: 'Send the selected Widget backwards.',
        sortOrder: 3,
        isDefault: true
    },
    {
        id: 4,
        buttonText: 'Forward',
        description: 'Bring the selected Widget forward.',
        sortOrder: 4,
        isDefault: true
    },
    {
        id: 5,
        buttonText: 'Delete',
        description: 'Delete the selected Widget.',
        sortOrder: 5,
        isDefault: true
    },
    {
        id: 6,
        buttonText: 'Background toggle',
        description: 'Toggle the background of the selected Shape on / of.',
        sortOrder: 6,
        isDefault: true
    },
    {
        id: 7,
        buttonText: 'Increase size',
        description: 'Increase the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 7,
        isDefault: true
    },
    {
        id: 8,
        buttonText: 'Decrease',
        description: 'Decrease the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 8,
        isDefault: true
    }
]

const shapeButtonsSelected: ButtonBarSelected[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Shape, for example the color of a circle.',
        sortOrder: 1
    }
]

const widgetButtonsAvailable: ButtonBarAvailable[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
        isDefault: true
    },
    {
        id: 2,
        buttonText: 'Refresh',
        description: 'Refresh the data linked to the current Widget.',
        sortOrder: 2,
        isDefault: false
    },
    {
        id: 3,
        buttonText: 'Expand',
        description: 'Open a separate window showing all the data in the Dataset linked to the Widget.',
        sortOrder: 3,
        isDefault: false
    },
    {
        id: 4,
        buttonText: 'Duplicate',
        description: 'Duplicates the current Widget with a new name (adding ... Copy n).  The Dataset is not duplicated.',
        sortOrder: 4,
        isDefault: false
    },
    {
        id: 5,
        buttonText: 'Backward',
        description: 'Send the selected Widget backwards.',
        sortOrder: 5,
        isDefault: false
    },
    {
        id: 6,
        buttonText: 'Forward',
        description: 'Bring the selected Widget forward.',
        sortOrder: 6,
        isDefault: false
    },
    {
        id: 7,
        buttonText: 'Comments',
        description: 'Show the comments linked to the selected Widget.',
        sortOrder: 7,
        isDefault: false
    },
    {
        id: 8,
        buttonText: 'Data Quality',
        description: 'Show a form with Data Quality issues pertaining to the Dataset linked to the selected Widget.',
        sortOrder: 8,
        isDefault: false
    },
    {
        id: 9,
        buttonText: 'Save Checkpoint',
        description: 'Save the current layout of the selected Widget as a Checkpoint.',
        sortOrder: 9,
        isDefault: false
    },
    {
        id: 10,
        buttonText: 'Delete',
        description: 'Delete the selected Widget.',
        sortOrder: 10,
        isDefault: false
    },
    {
        id: 11,
        buttonText: 'Export png',
        description: 'Export the graph of the selected Widget as a .png file, which is a static image.',
        sortOrder: 11,
        isDefault: false
    },
    {
        id: 12,
        buttonText: 'Tags',
        description: 'Show the tags associated with the selected Widget.',
        sortOrder: 12,
        isDefault: false
    },
    {
        id: 13,
        buttonText: 'Border toggle',
        description: 'Toggle the border around the selected Widget between none, gray and black.  The line is 1px solid.',
        sortOrder: 13,
        isDefault: false
    },
    {
        id: 14,
        buttonText: 'Links',
        description: 'Show a form with links from and to the selected Widget.  New links can be added here.',
        sortOrder: 14,
        isDefault: false
    },
    {
        id: 15,
        buttonText: 'Increase size',
        description: 'Increase the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 15,
        isDefault: false
    },
    {
        id: 16,
        buttonText: 'Decrease',
        description: 'Decrease the size of the container around the selected Widget.  Note that the graph itself may remain the same size - use the Widget Editor (Edit) for this.',
        sortOrder: 16,
        isDefault: false
    }
]

const widgetButtonsSelected: ButtonBarSelected[] =
[
    {
        id: 1,
        buttonText: 'Edit',
        description: 'Open the edit form to edit the Widget, for example the graph type.',
        sortOrder: 1,
    },
    {
        id: 2,
        buttonText: 'Refresh',
        description: 'Refresh the data linked to the current Widget.',
        sortOrder: 2,
    }
]


// Messages / Activities / Alerts / Comments
const  canvasActivities: CanvasActivity[] =
[
    {
        id: 1,
        createdBy: 'AlexanderB',
        createdOn: '2017/01/01',
        activityType: 'Action',
        activityStatus: 'Open',
        linkedDashboardList: [],
        activityText: 'Refactor Widget for coal levels',
        activityComments: ['2017/01/01 @BorisN Levels in tenk 1-A checked and good']
    }
];

const canvasAlerts: CanvasAlert[] =
[
    {
        id: 1,
        sentOn: '2017/01/01',
        recipient: 'BonitaS',
        read: false,
        alertText: 'Schedule Weekly reports failed',
    },
    {
        id: 2,
        sentOn: '2017/01/01',
        recipient: 'AlisonW',
        read: true,
        alertText: 'Please log out for maintenance',
    },
    {
        id: 3,
        sentOn: '2017/01/01',
        recipient: 'GavinO',
        read: false,
        alertText: 'Longrunning query finished',
    },
    {
        id: 4,
        sentOn: '2017/01/01',
        recipient: 'WendyA',
        read: true,
        alertText: 'Query xyz failed',
    }
];

const canvasMessages: CanvasMessage[] =
[
    {
        id: 1,
        sentBy: 'GinaU',
        sentOn: '2017/01/01',
        toUsers: ['GinaU'],
        toGroups: [''],
        recipient: '',
        read: false,
        subject: 'Please QA attached Dashboard',
        body: 'I have amended the graph type for marketing expenses',
        dashboardID: 12
    },
    {
        id: 2,
        sentBy: 'PeterJ',
        sentOn: '2017/01/01',
        toUsers: [''],
        toGroups: ['Admin'],
        recipient: 'QuintinY',
        read: true,
        subject: 'Admin cleanup',
        body: 'Cleanout old users',
        dashboardID: null
    },
    {
        id: 3,
        sentBy: 'RubinV',
        sentOn: '2017/01/01',
        toUsers: [''],
        toGroups: ['Admin'],
        recipient: 'YasserK',
        read: false,
        subject: 'Admin cleanup',
        body: 'Cleanout old users',
        dashboardID: null
    }
];

const canvasComments: CanvasComment[] =
[
    {
        id: 1,
        dashboardID: 2,
        dashboardTabID: 1,
        widgetID: 4,
        shapeID: 0,
        comment: 'Checkpoints show more detail',
        creator: 'MarcoD',
        createdOn: '2017/01/01'
    }
]


// Data
const finalFields =
[
    {
        fieldName: 'MonthTraded',
        dataType: 'string',
        localName: 'Date',
        filtered: '2 flters',
        transformed: ''
    },
    {
        fieldName: 'TradeType',
        dataType: 'string',
        localName: '',
        filtered: '',
        transformed: ''
    },
    {
        fieldName: 'Volume',
        dataType: 'number',
        localName: '',
        filtered: '1 flters',
        transformed: '2 transf'
    },
    {
        fieldName: 'Price',
        dataType: 'number',
        localName: '',
        filtered: '',
        transformed: '6 transf'
    },
    {
        fieldName: 'Value',
        dataType: 'Calculated: number',
        localName: '',
        filtered: '',
        transformed: '1 transf'
    }
];

const combinations: Combination[] =
[
    {
        combinationID: 1,
        dashboardID: 1,
        type: 'Union'
    }
];

const combinationDetails: CombinationDetail[] =
[
    {
        combinationDetailID: 1,
        combinationID: 2,
        lhDatasourceID: 3,
        lhFieldName: 'TradeType',
        rhDatasourceID: 4,
        rhFieldName: 'TradeType'
    }
];

const fields: Field[] =
[
    {
        id: 1,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        datasourceID: 12,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: ''
    }
];

const fieldsMetadata: FieldMetadata[] =
[
    {
        id: 4,
        datasourceID: 12,
        name: 'DateTrade',
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: 'Bar of new Listings per Month'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Pie of Trades by Broker'
    },
    {
        id: 4,
        datasourceID: 12,
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Custom Query: TradeAttribution'
    }
];

const transformationsFormat: Transformation[] =
[
    {
        id: 1,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FormatDate',
        description: '(columnName, new-date-format, old-date-format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, M/D/Y, etc.',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 16,
        datasourceID: 12,
        category: 'Column-level',
        name: 'DatePart',
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second',
        fieldName: 'Date',
        parameters: ''

    },
    {
        id: 20,
        datasourceID: 12,
        category: 'Column-level',
        name: 'FormatNumber',
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’',
        fieldName: 'Date',
        parameters: ''

    }
];




@Injectable()
export class GlobalVariableService {

    // Constants
    NoQueryRunningMessage: string = 'No Query';
    QueryRunningMessage: string = 'Query running...';

    // Permanent data - later to come from http
    backgroundcolors: CSScolor[] = backgroundcolors;
    canvasActivities: CanvasActivity[] = canvasActivities;
    canvasAlerts: CanvasAlert[] = canvasAlerts;
    canvasComments: CanvasComment[] = canvasComments;
    canvasMessages: CanvasMessage[] =  canvasMessages;
    filePath: string;
    shapeButtonsAvailable: ButtonBarAvailable[] = shapeButtonsAvailable;
    widgetButtonsAvailable: ButtonBarAvailable[] = widgetButtonsAvailable;

    dashboards: Dashboard[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardsRecent: number[];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardTags: DashboardTag[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardThemes: DashboardTheme[] = [];
    dashboardTemplates: DashboardTemplate[] = [];
    widgets: Widget[] = [];
    shapes: CanvasShape[] = [];
    slicers: CanvasSlicer[] = [];

    datasources: Datasource[] = [];
    transformations: Transformation[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    datasourcePermissions: DatasourcePermission[] = [];
    datasourcePivots: DatasourcePivot[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    fields: Field[] = fields;
    fieldsMetadata: FieldMetadata[] = fieldsMetadata;
    datasets: any = [];
    finalFields: any = finalFields;


    // Data for CURRENT Dashboard and Datasources: only some models are loaded
    currentDatasources: Datasource[] = [];
    currentTransformations: Transformation[] = [];
    currentDataQualityIssues: DataQualityIssue[] = [];
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentDatasourcePivots: DatasourcePivot[] = [];
    currentDataset: any = [];
    currentDashboards: Dashboard[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentWidgets: Widget[] = [];
    currentShapes: Widget[] = [];
    currentTables: Widget[] = [];
    currentSlicers: Widget[] = [];
    currentDashboardSchedules: DashboardSchedule[] = [];
    currentDashboardTags: DashboardTag[] = [];
    currentDashboardPermissions: DashboardPermission[] = [];
    currentDashboardSnapshots: DashboardSnapshot[] = [];

    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined

    // Global vars that guide all interactions
    // ***************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);
    presentationMode = new BehaviorSubject<boolean>(false);
    showGrid = new BehaviorSubject<boolean>(false);
    // First time user
    isFirstTimeDashboard = new BehaviorSubject<boolean>(false);
    isFirstTimeDashboardOpen = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardSave = new BehaviorSubject<boolean>(true);
    isFirstTimeDashboardDiscard = new BehaviorSubject<boolean>(true);
    isFirstTimePresentation = new BehaviorSubject<boolean>(true);
    isFirstTimeWidgetLinked = new BehaviorSubject<boolean>(true);
    isFirstTimeDataCombination = new BehaviorSubject<boolean>(true);
    // Menu-related
    // showMainMenu = new BehaviorSubject<boolean>(true);
    // Opening forms
    openDashboardFormOnStartup: boolean = false;
    openNewDashboardFormOnStartup: boolean = false;
    hasDatasources = new BehaviorSubject<boolean>(false);   // Used to set menu
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    selectedWidgetIDs: number[] = [];

    // Session
    currentUser: CanvasUser;
    loggedIntoServer = new BehaviorSubject<boolean>(true);
    currentDashboardID:number = 0; // = new BehaviorSubject<number>(null);
    currentDashboardTabID:number = 0; //  = new BehaviorSubject<number>(1);
    sessionDebugging: boolean = true;
    sessionLogging: boolean = false;
    widgetToEditID = new BehaviorSubject<number>(null);
    datasourceToEditID = new BehaviorSubject<number>(null);
    shapeButtonsSelected: ButtonBarSelected[] = shapeButtonsSelected;
    widgetButtonsSelected: ButtonBarSelected[] = widgetButtonsSelected;
    menuActionResize = new BehaviorSubject<boolean>(false);
    menuActionSelectAll = new BehaviorSubject<boolean>(false);
    userID: string = 'JannieI';  // TODO - unHardCode
    dsIDs: number[] = [];           // Dataset IDs

    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.NoQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)


    // Temp vars
    // localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    // localWidgets = new BehaviorSubject< CanvasWidget[]>(localWidgets);
    // localShapes = new BehaviorSubject< CanvasShape[]>(null);
    localTrash = new BehaviorSubject< Widget[]>([]);

    dataGetFromSwitch = new BehaviorSubject<string>('File');
    duplicateWidget = new BehaviorSubject<boolean>(false);
    // refreshDashboard = new BehaviorSubject<boolean>(false);     // True to refresh the D now


    // Company related variables
    companyName: string = 'Clarity Analytics';                  // Optional, set in SystemConfig
    companyLogo: string = '';                                   // Optional file name, set in SystemConfig

    // System-wide related variables, set at Installation
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';

    // Current User
    // canvasUser = new BehaviorSubject<CanvasUser>(null);
    // isAuthenticatedOnEazl: boolean = false;        // True if authenticated

    // This session
    // showSystemConfigButtons: boolean = true;       // Menu option called = True: SystemConfiguration, False: System Info
    // sessionDateTimeLoggedin: string = '';
    // sessionDashboardTabID: number = null;          // Tab ID to load when form opens, -1 = none
    // sessionLoadOnOpenDashboardID: number = null;   // Dashboard to load when form opens, 0 = none
    // sessionLoadOnOpenDashboardName: string = '';   // Dashboard to load when form opens, '' = none

    // At startup
    // startupDashboardID: number = 0;                             // Dashboard to load @start, 0 = none
    // startupDashboardTabID: number = 0;                          // Tab ID to load @start, -1 = none
    // startupMessageToShow: string = '';                          // Message to show at start

    // Environment
    // testEnvironmentName: string = '';                           // Spaces = in PROD

    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyDashboards: boolean = true;
    isDirtyDashboardTabs: boolean = true;
    isDirtyDashboardsRecent: boolean = true;
    isDirtyWidgets: boolean = true;
    isDirtyShapes: boolean = true;
    isDirtySlicers: boolean = true;
    isDirtyDashboardSchedules: boolean = true;
    isDirtyDashboardTags: boolean = true;
    isDirtyDashboardPermissions: boolean = true;
    isDirtyDashboardSnapshots: boolean = true;
    isDirtyDashboardThemes: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyDataQualityIssues: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasourcePivots: boolean = true;


    // isDirtyTextAlignDropdown: boolean = true;
    // isDirtyBorderDropdown: boolean = true;
    // isDirtyBoxShadowDropdown: boolean = true;
    // isDirtyBackgroundImageDropdown: boolean = true;
    // isDirtyDashboardTab: boolean = true;
    // isDirtyCanvasMessage: boolean = true;
    // isDirtyCanvasMessageRecipient: boolean = true;
    // isDirtyDashboardTag: boolean = true;
    // isDirtyDashboardTagMembership: boolean = true;
    // isDirtyDashboard: boolean = true;
    // isDirtyDatasource: boolean = true;
    // isDirtyFilter: boolean = true;
    // isDirtyFontSizeDropdown: boolean = true;
    // isDirtyFontWeightDropdown: boolean = true;
    // isDirtyGraphType: boolean = true;
    // isDirtyGridSizeDropdown: boolean = true;
    // isDirtyGroup: boolean = true;
    // isDirtyImageSourceDropdown: boolean = true;
    // isDirtyPackageTask: boolean = true;
    // isDirtyReport: boolean = true;
    // isDirtyReportWidgetSet: boolean = true;
    // isDirtyReportHistory: boolean = true;
    // isDirtySystemConfiguration: boolean = true;
    // isDirtyTextMarginDropdown: boolean = true;
    // isDirtyTextPaddingDropdown: boolean = true;
    // isDirtyTextPositionDropdown: boolean = true;
    // isDirtyWidgetTemplate: boolean = true;
    // isDirtyWidgetType: boolean = true;
    // isDirtyUser: boolean = true;

    // System & operation config
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';
    // gridSize: number = 3;
    // snapToGrid: boolean = true;

    // Settings that can be set via UI for next time, from then on it will change
    // as the user uses them, and used the next time (a Widget is created)
    // lastContainerFontSize: SelectedItem =
    //     {
    //         id: 1,
    //         name: '1'
    //     };
    // lastColor: SelectedItemColor =
    //     {
    //         id: 'black',
    //         name: 'black',
    //         code: '#000000'
    //     };
    // lastBoxShadow: SelectedItem =new Promise<boolean>((resolve, reject) => {
    //     {
    //         id:1,
    //         name: ''
    //     };
    // lastBorder: SelectedItem =
    //     {
    //         id:1,
    //         name: '1px solid black'
    //     };
    // lastBackgroundColor: SelectedItemColor =
    //     {
    //         id: 'white',
    //         name: 'white',
    //         code: '#FFFFFF'
    //     };
    // lastWidgetHeight: number = 300;
    // lastWidgetWidth: number = 400;
    // lastWidgetLeft: number = 25;
    // lastWidgetTop: number = 80;


    constructor(
    ) {
     }

     refreshCurrentDashboardInfo(dashboardID: number, dashboardTabID: number): 
        Promise<boolean> {
        // Refreshes all info related to current D
        // dashboardTabID = -1 if unknown, so get first T
        // Returns True if all worked, False if something went wrong
        console.log('Global-Variables refreshCurrentDashboardInfo D,T id = ', dashboardID, dashboardTabID)

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...
        return new Promise<boolean>((resolve, reject) => {
            this.getCurrentDashboard(dashboardID).then( i => 
                // Load the DashboardTabs
                this.getCurrentDashboardTabs(dashboardID).then(j =>
                    {
                        if (dashboardTabID == -1) {
                            if (j.length > 0) {dashboardTabID = j[0].id}
                        }
        
                        // Load Permissions for D
                        this.getCurrentDashboardPermissions(dashboardID).then( o =>

                            // Load Widgets
                            this.getCurrentWidgets(dashboardID, dashboardTabID).then(q =>
                                // Reset Global Vars
                                {
                                    this.currentDashboardID = dashboardID
                                    this.currentDashboardTabID = dashboardTabID
                                    if (this.currentWidgets.length > 0) {
                                        this.hasDatasources.next(true);
                                    } else {
                                        this.hasDatasources.next(false);
                                    }
                                    resolve(true)
                                }
                            )
                        )
                })
            );
        });
    }

    refreshCurrentDatasourceInfo(datasourceID: number): Promise<boolean> {
        // Refreshes all info related to current DS
        // Returns True if all worked, False if something went wrong
        console.log('Global-Variables refreshCurrentDatasourceInfo D,T id = ', datasourceID)

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...
        return new Promise<boolean>((resolve, reject) => {
            this.getCurrentDatasource(datasourceID).then( i => 

            // Load Permissions for DS
            this.getCurrentDatasourcePermissions(datasourceID).then(k =>
            // Load Transformations
            this.getCurrentTransformations(datasourceID).then(l =>
            // Load Pivots
            this.getCurrentDatasourcePivots(datasourceID).then(m =>
            // Load dataQuality Issues
            this.getCurrentDataQualityIssues(datasourceID).then( o =>
                // Reset Global Vars
                {
                    resolve(true)
                }
        )))));
        });
    }

    refreshAllInfo(dashboardID: number, dashboardTabID: number) {
        // Refreshes all info related to current D
        console.log('Global-Variables refreshAllInfo D,T id = ', dashboardID, dashboardTabID)

        console.log('refreshAllInfo FIX DS ids that are hardcoded ...')
        // Load Dashboard Themes
        this.getDashboardThemes();

		// Load the current Dashboard, and Optional template
        this.getCurrentDashboard(dashboardID);

		// Load the current DashboardTab
        this.getCurrentDashboardTabs(dashboardID)

        // Load Dashboard Schedules
        this.getCurrentDashboardSchedules(dashboardID);

        // Load Dashboard Tags
        this.getCurrentDashboardTags(dashboardID);
        
        // Load Dashboard Permissions
        this.getCurrentDashboardPermissions(dashboardID);
        
        // Load Dashboard Snapshots
        this.getCurrentDashboardSnapshots(dashboardID);

        // Load Dashboard Templates
        this.getDashboardTemplates();
        
        // Load Current Datasources
        this.getCurrentDatasource(dashboardID)

        // Load DatTransformationsasources
        this.getTransformations();     

        // Load Current DatTransformationsasources
        this.getCurrentTransformations(1);     

        // Load DataQualityIssues
        this.getDataQualityIssues();     

        // Load Current DataQualityIssue
        this.getCurrentDataQualityIssues(1);     

        // Load DatasourcePermissions
        this.getDatasourcePermissions();     

        // Load Current DatasourcePermissions
        this.getCurrentDatasourcePermissions(1);     

        // Load Current DatasourcePivots
        this.getCurrentDatasourcePivots(1);     

        // Reset Global Vars
        this.currentDashboardID = dashboardID;
        this.currentDashboardTabID = dashboardTabID;
        
    }

    deleteWidget(index: number) {
        //
        console.log('Global-Variables deleteWidget ...');
        
        this.widgets.forEach( e => {
            if (e.id == index) {
                e.isTrashed = true;
                console.log('Global-Variables deleteWidget id:', e.id)
            }
        });
    }

    currentDatasourceAdd(newData: Datasource) {
        //
        console.log('Global-Variables currentDatasourceAdd ...');
        
        if (this.currentDatasources.filter(i => i.id == newData.id).length == 0) {
            this.currentDatasources.push(newData);
        } 
        console.log('Global-Variables currentDatasourceAdd after push', this.currentDatasources)
    }

    datasourceAdd(newData: Datasource) {
        //
        console.log('Global-Variables datasourceAdd ...');

        if (this.datasources.filter(i => i.id == newData.id).length == 0) {
            this.datasources.push(newData);
        } 
        console.log('Global-Variables datasourceAdd after push', this.datasources)
    }

    currentDatasourceDelete(index: number) {
        //
        console.log('Global-Variables datasourceDelete', index, this.currentDatasources)

        // let arr: Datasource[] = this.currentDatasources.splice(index,1);
        // console.log('Global-Variables currentDatasourceDelete arr', arr)
        // this.currentDatasources.next( this.currentDatasources)
        this.currentDatasources.splice(index,1)
        console.log('Global-Variables currentDatasourceDelete end', this.currentDatasources)
    }

    datasourceDelete(index: number) {
        //
        console.log('Global-Variables datasourceDelete ...');
        
        let arr: Datasource[] = this.datasources.splice(index,1);
        console.log('Global-Variables datasourceDelete arr', arr)
        this.datasources = this.datasources;
    }

    dashboardDelete(index: number) {
        //
        console.log('Global-Variables dashboardDelete', index)

        // let arr: CanvasWidget[] = this.currentWidgets.filter(
        //     i => {
        //             if (i.id == index) { i.isTrashed = true}
        //         }
        // );
        // console.log('Global-Variables dashboardDelete arr', arr)
        // this.currentWidgets.next(arr);
        for (var i = 0; i < this.currentWidgets.length; i++) {
            i => {
                    if (i.id == index) { i.isTrashed = true}
                }
        }
    }

    addDashboardRecent(dashboardID: number, dashboardTabID: number) {
        //
        console.log('Global-Variables addDashboardRecent ...');

        // TODO - put to DB
    }

    deleteDashboardRecent(index: number): Promise<boolean> {
        //
        console.log('Global-Variables deleteDashboardRecent ...');
        
        // Update data
        return new Promise<boolean>((resolve, reject) => {
            let i: number = this.dashboardsRecent.indexOf(index);
            if (i >= 0) {
                this.dashboardsRecent.splice(i , 1);
            };

            // Refresh temp array
            this.getDashboardsRecentList(this.userID).then(
                i => resolve(true)
            )
        });
    }

    getDashboards(): Promise<Dashboard[]> {
        // Description: Gets all D
        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboards ...');

        let url: string = 'getDashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<Dashboard[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboards = data;
                        this.isDirtyDashboards = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboards 1', data)
                        resolve(this.dashboards);
                    });
            } else {
                console.log('Global-Variables getDashboards 2')
                resolve(this.dashboards);
            }
        });

    }

    getCurrentDashboard(dashboardID: number): Promise<Dashboard[]> {
        // Description: Gets current D (and optional Template)
        // Params:
        //   dashboardID
        // Returns: this.currentDashboards array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboards ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {

                        // Load the current Dashboard, and Optional template
                        // let currentDashboards: Dashboard[] = [];
                        this.currentDashboards = this.dashboards.filter(
                            i => i.id == dashboardID
                        );

                        if (this.currentDashboards.length > 0) {
                            if (this.currentDashboards[0].templateDashboardID != 0) {
                                let templeteDashboard: Dashboard[] = null;

                                templeteDashboard = this.dashboards.filter(
                                    i => i.id == this.currentDashboards[0].templateDashboardID
                                );

                                if (templeteDashboard == null) {
                                    alert('Dashboard template id does not exist in Dashboards Array')
                                } else {
                                    this.currentDashboards.push(templeteDashboard[0]);
                                }
                            };
                        }
                        // this.currentDashboards.next(currentDashboards);

                        console.log('Global-Variables getCurrentDashboards 1', dashboardID, this.currentDashboards)
                        resolve(this.currentDashboards);

                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {

                // Load the current Dashboard, and Optional template
                // let currentDashboards: Dashboard[] = [];
                this.currentDashboards = this.dashboards.filter(
                    i => i.id == dashboardID
                );

                if (this.currentDashboards[0].templateDashboardID != 0) {
                    let templeteDashboard: Dashboard[] = null;

                    templeteDashboard = this.dashboards.filter(
                        i => i.id == this.currentDashboards[0].templateDashboardID
                    );

                    if (templeteDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        this.currentDashboards.push(templeteDashboard[0]);
                    }
                }
                // this.currentDashboards.next(currentDashboards);
                console.log('Global-Variables getCurrentDashboards 2', dashboardID, this.currentDashboards)
                resolve(this.currentDashboards);
            });
        };

    }

    getDashboardTabs(): Promise<DashboardTab[]> {
        // Description: Gets all T
        // Returns: this.dashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardTabs ...');

        let url: string = 'getDashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<DashboardTab[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTabs = data;
                        this.isDirtyDashboardTabs = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardTabs 1', data)
                        resolve(this.dashboardTabs);
                    });
            } else {
                console.log('Global-Variables getDashboardTabs 2')
                resolve(this.dashboardTabs);
            }
        });

    }

    getCurrentDashboardTabs(dashboardID: number): Promise<DashboardTab[]> {
        // Description: Gets all T for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboardTabs ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                this.getDashboardTabs()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTabs = data;
                        console.log('Global-Variables getCurrentDashboardTabs 1', dashboardID, data)
                        resolve(data);

                })
             })
        } else {
            return new Promise<DashboardTab[]>((resolve, reject) => {
                let returnData: DashboardTab[];
                returnData = this.dashboardTabs.filter(
                        i => i.dashboardID == dashboardID
                    )
                this.currentDashboardTabs = returnData;
                console.log('Global-Variables getCurrentDashboardTabs 2', dashboardID, returnData)
                resolve(returnData);
            });
        };

    }

    getDashboardSamples(): Promise<Dashboard[]> {
        // Description: Gets all Sample D
        // Returns: an array extracted from [D], unless:
        //   If D not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSamples ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        data = data.filter(
                            i => (i.isSample)
                        );
                        console.log('Global-Variables getDashboardSamples 1', data)
                        resolve(data);

                })
            })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let data: Dashboard[] = this.dashboards.filter(
                    i => (i.isSample)
                )
                console.log('Global-Variables getDashboardSamples 2', data)
                resolve(data);
            });
        };

    }

    getDashboardsRecentList(userID: string): Promise<number[]> {
        // Description: Gets a LIST of Recent D, T
        // Returns: this.dashboardsRecent array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardsRecentList ...');

        let url: string = 'getDashboardsRecentList';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<number[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardsRecent = [];
                        // TODO - http must be sorted => include in Options ...
                        let temp: DashboardRecent[] = data.filter(
                            i => i.userID == userID
                        )
                        temp.forEach( j => {
                            this.dashboardsRecent.push(j.dashboardID)
                        });
                        console.log('Global-Variables dashboardsRecent 1', this.dashboardsRecent)
                        this.isDirtyDashboardsRecent = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        resolve(this.dashboardsRecent);
                    });
            } else {
                console.log('Global-Variables this.dashboardsRecent 2', this.dashboardsRecent)
                resolve(this.dashboardsRecent);
            }
        });

    }

    // getDashboardsRecent(userID: string): Promise<Dashboard[]> {
    //     // Description: Gets all Recent D
    //     // Returns: recent [D] array, unless:
    //     //   If not cached or if dirty, get from File
    //     console.log('Global-Variables getDashboardsRecent ...');

    //     // Refresh from source at start, or if dirty
    //     if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
    //         return new Promise<Dashboard[]>((resolve, reject) => {
    //             this.getDashboardsRecentList(userID)
    //                 .then(data => {
    //                     let returnData: Dashboard[] = [];
    //                     for (var i = 0; i < this.dashboards.length; i++) {
    //                         if (data.indexOf(this.dashboards[i].id) != -1) {
    //                             returnData.push(this.dashboards[i]);
    //                         }
    //                     }
    //                     console.log('Global-Variables getDashboardsRecent 1', userID, returnData)
    //                     resolve(returnData);

    //             })
    //          })
    //     } else {
    //         return new Promise<Dashboard[]>((resolve, reject) => {
    //             let returnData: Dashboard[] = [];
    //             for (var i = 0; i < this.dashboards.length; i++) {
    //                 if (this.dashboardsRecent.indexOf(this.dashboards[i].id) != -1) {
    //                     returnData.push(this.dashboards[i]);
    //                 }
    //             }
    //             console.log('Global-Variables getDashboardsRecent 2', userID, returnData)
    //             resolve(returnData);
    //         });
    //     };

    // }

    getDashboardsRecent(userID: string): Promise<DashboardRecent[]>  {
        // Description: Gets an array of recently used D (not the Ds itself)
        // Returns: return array from source, not cached
        console.log('Global-Variables getDashboardsRecent ...');

        let url: string = 'getDashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<DashboardRecent[]>((resolve, reject) => {

            // Refresh from source at start
            this.statusBarRunning.next(this.QueryRunningMessage);
            this.get(url).then(data => {
                this.dashboardsRecent = [];
                // TODO - http must be sorted => include in Options ...
                let temp: DashboardRecent[] = data.filter(
                    i => i.userID == userID
                )
                console.log('Global-Variables dashboardsRecent 1', temp)
                this.isDirtyDashboardsRecent = false;
                this.statusBarRunning.next(this.NoQueryRunningMessage);
                resolve(temp);
            });
        });
    }

    getDashboardsRecentlyUsed(userID: string): Promise<Dashboard[]> {
        // Description: Gets all Recent Ds
        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardsRecentlyUsed ...');

        // Refresh from source at start, or if dirty
        if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboardsRecentList(userID)
                    .then(data => {
                        let returnData: Dashboard[] = [];
                        for (var i = 0; i < this.dashboards.length; i++) {
                            if (data.indexOf(this.dashboards[i].id) != -1) {
                                returnData.push(this.dashboards[i]);
                            }
                        }
                        console.log('Global-Variables getDashboardsRecentlyUsed 1', userID, returnData)
                        resolve(returnData);

                })
             })
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let returnData: Dashboard[] = [];
                for (var i = 0; i < this.dashboards.length; i++) {
                    if (this.dashboardsRecent.indexOf(this.dashboards[i].id) != -1) {
                        returnData.push(this.dashboards[i]);
                    }
                }
                console.log('Global-Variables getDashboardsRecentlyUsed 2', userID, returnData)
                resolve(returnData);
            });
        };

    }

    getDataset(datasourceID: number, datasetID: number): Promise<any> {
        // Description: Gets a Dataset, and inserts once into this.datasets
        // Returns: dataset 
        console.log('Global-Variables getDataset ...');

        let url: string = 'getDataset';
        this.filePath = './assets/data.datasets.json';
                
        // Get list of dSet-ids to make array work easier
        let dSetIDs: number[] = [];
        this.datasets.forEach(d => dSetIDs.push(d.id));

        return new Promise<any>((resolve, reject) => {

            this.get(url)
                .then(data => {

                    // TODO - fix this via real http
                    let dataurl: string = './assets/data.dataset' + datasetID.toString() + '.json';
                    this.filePath = '../assets/data.dataset' + datasetID.toString() + '.json';
                    this.get(dataurl)
                        .then(dataFile => {

                            // Add to datasets (contains all data) - once
                            if (dSetIDs.indexOf(datasetID) < 0) {
                                this.datasets.push(
                                    {
                                        id: datasetID,
                                        datasourceID: datasourceID,
                                        data: dataFile
                                    }
                                );
                            };
                            
                            console.log('Global-Variables getDataset 1', datasourceID, dataurl,
                                datasetID, 'datafile', dataFile, 
                                'datasets', this.datasets)
                            resolve(dataFile);
                        }
                    );
                }
            );
        });
    }

    filterSlicer(dataFile): any {
        // Filter a given array 
        console.log('Global-Variables filterSlicer ...');
        this.currentSlicers.forEach(s => {

        })
        return dataFile;

    }
    
    getDashboardSchedules(): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardSchedules array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSchedules ...');

        let url: string = 'getSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<DashboardSchedule[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSchedules.length == 0)  ||  (this.isDirtyDashboardSchedules) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSchedules = data;
                        this.isDirtyDashboardSchedules = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardSchedules 1')
                        resolve(this.dashboardSchedules);
                    });
            } else {
                console.log('Global-Variables getDashboardSchedules 2')
                resolve(this.dashboardSchedules);
            }
        });

    }

    getCurrentDashboardSchedules(dashboardID: number): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardSchedules array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboardSchedules ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSchedules.length == 0)  ||  (this.isDirtyDashboardSchedules) ) {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                this.getDashboardSchedules()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSchedules = data;
                        console.log('Global-Variables getCurrentDashboardSchedules 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardSchedule[]>((resolve, reject) => {
                let returnData: DashboardSchedule[];
                returnData = this.dashboardSchedules.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSchedules = returnData;
                console.log('Global-Variables getCurrentDashboardSchedules 2', 
                    dashboardID, returnData)
                resolve(returnData);
            });
        };
    }

    getDashboardTags(): Promise<DashboardTag[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardTagsget array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardTags ...');

        let url: string = 'getDashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<DashboardTag[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTags = data;
                        this.isDirtyDashboardTags = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardTags 1')
                        resolve(this.dashboardTags);
                    });
            } else {
                console.log('Global-Variables getDashboardTags 2')
                resolve(this.dashboardTags);
            }
        });

    }

    getCurrentDashboardTags(dashboardID: number): Promise<DashboardTag[]> {
        // Description: Gets all Sch for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardTags array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboardTags ...');

        // Refresh frogetm source at start, or if dirty
        if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                this.getDashboardTags()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardTags = data;
                        console.log('Global-Variables getCurrentDashboardTags 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardTag[]>((resolve, reject) => {
                let returnData: DashboardTag[];
                returnData = this.dashboardTags.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardTags = returnData;
                console.log('Global-Variables getCurrentDashboardTags 2', dashboardID)
                resolve(returnData);
            });
        };
    }

    getDashboardPermissions(): Promise<DashboardPermission[]> {
        // Description: Gets all P
        // Returns: this.dashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardPermissions ...');

        let url: string = 'getDashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<DashboardPermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardPermissions = data;
                        this.isDirtyDashboardPermissions = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardPermissions 1')
                        resolve(this.dashboardPermissions);
                    });
            } else {
                console.log('Global-Variables getDashboardPermissions 2')
                resolve(this.dashboardPermissions);
            }
        });

    }

    getCurrentDashboardPermissions(dashboardID: number): Promise<DashboardPermission[]> {
        // Description: Gets all Sch for current D
        // Params:
        //   dashboardID
        // Returns: this.currentDashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboardPermissions ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                this.getDashboardPermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardPermissions =data;
                        console.log('Global-Variables getCurrentDashboardPermissions 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardPermission[]>((resolve, reject) => {
                let returnData: DashboardPermission[];
                returnData = this.dashboardPermissions.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardPermissions =returnData;
                console.log('Global-Variables getCurrentDashboardPermissions 2', dashboardID)
                resolve(returnData);
            });
        };
    }

    getDashboardSnapshots(): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn
        // Returns: this.dashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSnapshots ...');

        let url: string = 'getDashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<DashboardSnapshot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSnapshots = data;
                        this.isDirtyDashboardSnapshots = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardSnapshots 1', data)
                        resolve(this.dashboardSnapshots);
                    });
            } else {
                console.log('Global-Variables getDashboardSnapshots 2')
                resolve(this.dashboardSnapshots);
            }
        });

    }

    getCurrentDashboardSnapshots(dashboardID: number): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn for current D
        // Params:
        //   dashboardID
        // Returns: this.getDashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDashboardSnapshots ...');

        // Refresh from source at start, or if dirty
        if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                this.getDashboardSnapshots()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentDashboardSnapshots = data;
                        console.log('Global-Variables getDashboardSnapshots 1', 
                            dashboardID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSnapshots = returnData;
                console.log('Global-Variables getDashboardSnapshots 2', dashboardID)
                resolve(returnData);
            });
        };
    }
    
    getDashboardThemes(): Promise<DashboardTheme[]> {
        // Description: Gets all Th
        // Returns: this.dashboardThemes array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardThemes ...');

        let url: string = 'getDashboardThemes';
        this.filePath = './assets/data.dashboardThemes.json';

        return new Promise<DashboardTheme[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardThemes.length == 0)  ||  (this.isDirtyDashboardThemes) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardThemes = data;
                        this.isDirtyDashboardThemes = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDashboardThemes 1', data)
                        resolve(this.dashboardThemes);
                    });
            } else {
                console.log('Global-Variables getDashboardThemes 2')
                resolve(this.dashboardThemes);
            }
        });

    }
    
    getDashboardTemplates(): Promise<Dashboard[]> {
        // Description: Gets all Tpl
        // Returns: recent [D] array, unless:
        //   If not cached or if dirty, get from File
        // Refresh from source at start, or if dirty
        console.log('Global-Variables getDashboardTemplates ...');

        if ( this.dashboards == []  ||  (this.isDirtyDashboards) ) {
            return new Promise<Dashboard[]>((resolve, reject) => {
                this.getDashboards()
                    .then(data => {
                        let arrTemplateIDs: number[] = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].templateDashboardID != 0  &&  
                                data[i].templateDashboardID != null) {
                                arrTemplateIDs.push(data[i].templateDashboardID)
                            }
                        }
                        let returnData: Dashboard[] = [];
                        if (arrTemplateIDs.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (arrTemplateIDs.indexOf(data[i].id) != -1) {
                                    returnData.push(data[i]);
                                }
                            }
                        }
                        console.log('Global-Variables getDashboardTemplates 1', returnData)
                        resolve(returnData);
                    });
            });
        } else {
            return new Promise<Dashboard[]>((resolve, reject) => {
                let arrTemplateIDs: number[] = [];
                for (var i = 0; i < this.dashboards.length; i++) {
                    if (this.dashboards[i].templateDashboardID != 0  &&  
                        this.dashboards[i].templateDashboardID != null) {
                        arrTemplateIDs.push(this.dashboards[i].templateDashboardID)
                    }
                }
                let returnData: Dashboard[] = [];
                if (arrTemplateIDs.length > 0) {
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (arrTemplateIDs.indexOf(this.dashboards[i].id) != -1) {
                            returnData.push(this.dashboards[i]);
                        }
                    }
                }
                console.log('Global-Variables getDashboardTemplates 2', returnData)
                resolve(returnData);

            });
        };

    }

    getDatasources(): Promise<Datasource[]> {
        // Description: Gets all DS
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDatasources ...');

        let url: string = 'getDatasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasources = data;
                        this.isDirtyDatasources = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasources 1', data)
                        resolve(this.datasources);
                    });
            } else {
                console.log('Global-Variables getDatasources 2')
                resolve(this.datasources);
            }
        });

    }

    getCurrentDatasource(dashboardID: number): Promise<Datasource[]> {
        // Description: Gets DS for current D
        // Params: dashboardID = current D
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDatasources ...');

        let url: string = 'getDatasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // TODO - What if databoards empty or diry - is that okay?
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.getDatasources()
                    .then(ds => 
                        {
                            let ids: number[] = [];
                            for (var i = 0; i < this.currentWidgets.length; i++) {
                                if (ids.indexOf(this.currentWidgets[i].datasourceID) < 0) {
                                    ids.push(this.currentWidgets[i].datasourceID)
                                }
                            };
                            let returnData: Datasource[] = [];
                            for (var i = 0; i < ds.length; i++) {
                                if (ids.indexOf(ds[i].id) >= 0) {
                                    returnData.push(ds[i]);
                                };
                            };
                            this.isDirtyDatasources = false;
                            this.currentDatasources = returnData;
                            this.statusBarRunning.next(this.NoQueryRunningMessage);
                            console.log('Global-Variables getCurrentDatasources 1', 
                                dashboardID, returnData);
                            resolve(returnData);
                        }
                    )
            } else {
                let ids: number[] = [];
                for (var i = 0; i < this.currentWidgets.length; i++) {
                    if (ids.indexOf(this.currentWidgets[i].datasourceID) < 0) {
                        ids.push(this.currentWidgets[i].datasourceID)
                    }
                };
                let returnData: Datasource[] = [];
                for (var i = 0; i < this.datasources.length; i++) {
                    if (ids.indexOf(this.datasources[i].id) >= 0) {
                        returnData.push(this.datasources[i]);
                    };
                };
                this.isDirtyDatasources = false;
                this.currentDatasources = returnData;
                this.statusBarRunning.next(this.NoQueryRunningMessage);
                console.log('Global-Variables getCurrentDatasources 2', dashboardID, this.currentDatasources);
                resolve(returnData);
            }
        });
    }

    getTransformations(): Promise<Transformation[]> {
        // Description: Gets all Tr
        // Returns: this.transformations array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getTransformations ...');

        let url: string = 'getTransformations';
        this.filePath = './assets/data.transformations.json';

        return new Promise<Transformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.transformations.length == 0)  ||  (this.isDirtyTransformations) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.transformations = data;
                        this.isDirtyTransformations = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getTransformations 1',  data)
                        resolve(this.transformations);
                    });
            } else {
                console.log('Global-Variables getTransformations 2')
                resolve(this.transformations);
            }
        });

    }

    getCurrentTransformations(datasourceID: number): Promise<Transformation[]> {
        // Description: Gets Tr for current DS
        // Returns: this.currentTransformations.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentTransformations ...');

        let url: string = 'getTransformations';
        this.filePath = './assets/data.transformations.json';

        if ( (this.currentTransformations.length == 0)  ||  (this.isDirtyTransformations) ) {
            return new Promise<Transformation[]>((resolve, reject) => {
                this.getTransformations()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentTransformations = data;
                        console.log('Global-Variables getTransformations 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<Transformation[]>((resolve, reject) => {
                let returnData: Transformation[];
                returnData = this.transformations.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentTransformations = returnData;
                console.log('Global-Variables getTransformations 2', datasourceID, returnData)
                resolve(returnData);
            });
        };
    }

    getDataQualityIssues(): Promise<DataQualityIssue[]> {
        // Description: Gets all dQual
        // Returns: this.dataQualityIssues array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDataQualityIssues ...');

        let url: string = 'getDataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<DataQualityIssue[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataQualityIssues.length == 0)  ||  (this.isDirtyDataQualityIssues) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataQualityIssues = data;
                        this.isDirtyDataQualityIssues = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDataQualityIssues 1', this.dataQualityIssues)
                        resolve(this.dataQualityIssues);
                    });
            } else {
                console.log('Global-Variables getDataQualityIssues 2', this.dataQualityIssues)
                resolve(this.dataQualityIssues);
            }
        });
    }

    getCurrentDataQualityIssues(datasourceID: number): Promise<DataQualityIssue[]> {
        // Description: Gets dQual for current DS
        // Returns: this.dataQualityIssues.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDataQualityIssues ...');

        let url: string = 'getDataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        if ( (this.currentDataQualityIssues.length == 0)  ||  (this.isDirtyDataQualityIssues) ) {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                this.getDataQualityIssues()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDataQualityIssues = data;
                        console.log('Global-Variables getDataQualityIssuess 1', 
                            datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DataQualityIssue[]>((resolve, reject) => {
                let returnData: DataQualityIssue[];
                returnData = this.dataQualityIssues.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDataQualityIssues = returnData;
                console.log('Global-Variables getDataQualityIssuess 2', datasourceID, returnData)
                resolve(returnData);
            });
        };
    }
      
    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDatasourcePermissions ...');

        let url: string = 'getDatasourcePermissions';
        this.filePath = './assets/data.datasourcePermissions.json';

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePermissions = data;
                        this.isDirtyDatasourcePermissions = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasourcePermissions 1', this.datasourcePermissions)
                        resolve(this.datasourcePermissions);
                    });
            } else {
                console.log('Global-Variables getDatasourcePermissions 2', this.datasourcePermissions)
                resolve(this.datasourcePermissions);
            }
        });
    }
 
    getCurrentDatasourcePermissions(datasourceID: number): Promise<DatasourcePermission[]> {
        // Description: Gets DS-P for current DS
        // Returns: this.datasourcePermissions.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDatasourcePermissions ...');

        let url: string = 'getDatasourcePermissions';
        this.filePath = './assets/data..datasourcePermissions.json';

        if ( (this.currentDatasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                this.getDatasourcePermissions()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePermissions = data;
                        console.log('Global-Variables getDatasourcePermissions 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DatasourcePermission[]>((resolve, reject) => {
                let returnData: DatasourcePermission[];
                returnData = this.datasourcePermissions.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePermissions = returnData;
                console.log('Global-Variables getDatasourcePermissions 2', datasourceID)
                resolve(returnData);
            });
        };

    }
  
    getDatasourcePivots(): Promise<DatasourcePivot[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePivots array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDatasourcePivots ...');

        let url: string = 'getDatasourcePivots';
        this.filePath = './assets/data.datasourcePivots.json';

        return new Promise<DatasourcePivot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePivots.length == 0)  ||  (this.isDirtyDatasourcePivots) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePivots = data;
                        this.isDirtyDatasourcePivots = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getDatasourcePivots 1', this.datasourcePivots)
                        resolve(this.datasourcePivots);
                    });
            } else {
                console.log('Global-Variables getDatasourcePivots 2', this.datasourcePivots)
                resolve(this.datasourcePivots);
            }
        });
    }
 
    getCurrentDatasourcePivots(datasourceID: number): Promise<DatasourcePivot[]> {
        // Description: Gets DS-P for current DS
        // Returns: this.datasourcePivots.value array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentDatasourcePivots ...');

        let url: string = 'getDatasourcePivots';
        this.filePath = './assets/data..datasourcePivots.json';

        if ( (this.currentDatasourcePivots.length == 0)  ||  (this.isDirtyDatasourcePivots) ) {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                this.getDatasourcePivots()
                    .then(data => {
                        data = data.filter(
                            i => i.datasourceID == datasourceID
                        );
                        this.currentDatasourcePivots = data;
                        console.log('Global-Variables getDatasourcePivots 1', datasourceID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<DatasourcePivot[]>((resolve, reject) => {
                let returnData: DatasourcePivot[];
                returnData = this.datasourcePivots.filter(
                    i => i.datasourceID == datasourceID
                );
                this.currentDatasourcePivots = returnData;
                console.log('Global-Variables getDatasourcePivots 2', datasourceID, returnData)
                resolve(returnData);
            });
        };

    }

    getWidgets(): Promise<Widget[]> {
        // Description: Gets all W
        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getWidgets ...', this.widgets.length);

        let url: string = 'getWidgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<Widget[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
                this.statusBarRunning.next(this.QueryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.widgets = data;
                        this.isDirtyWidgets = false;
                        this.statusBarRunning.next(this.NoQueryRunningMessage);
                        console.log('Global-Variables getWidgets 1', data)
                        resolve(this.widgets);
                    });
            } else {
                console.log('Global-Variables getWidgets 2', this.widgets)
                resolve(this.widgets);
            }
        });

    }

    getCurrentWidgets(dashboardID: number, dashboardTabID: number): Promise<Widget[]> {
        // Description: Gets all W for current D
        // Params:
        //   dashboardID
        //   dashboardTabID (0 => all Tabs)
        // Returns: arrays of current W, Sl, Sh, Tbl; unless:
        //   If not cached or if dirty, get from File
        // Usage: getWidgets(1, -1)  =>  Returns W for DashboardID = 1
        console.log('Global-Variables getCurrentWidgets ...');

        // Refresh from source at start, or if dirty
        if ( (this.currentWidgets.length == 0)  ||  (this.isDirtyWidgets) ) {
            return new Promise<Widget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(data => {

                        // Filter the widgets
                        data = data.filter(
                            i => i.dashboardID == dashboardID  &&
                                 (dashboardTabID == -1  ||  i.dashboardTabID == dashboardTabID)
                        );

                        // Add Sl, Sh, Tbl
                        this.currentSlicers = data.filter(w => w.widgetType == 'Slicer');
                        this.currentShapes = data.filter(w => w.widgetType == 'Shape');
                        this.currentTables = data.filter(w => w.widgetType == 'Table');
                        this.currentWidgets = data.filter(w => w.widgetType == 'Graph');

                        console.log('Global-Variables getCurrentWidgets 1', dashboardID, dashboardTabID, data)
                        resolve(data);
                })
             })
        } else {
            return new Promise<Widget[]>((resolve, reject) => {

                // Filter all types belonging to this D
                let data: Widget[];
                data = this.widgets.filter(
                    i => i.dashboardID == dashboardID  &&
                    (dashboardTabID == -1  ||  i.dashboardTabID == dashboardTabID)
                )

                // Add Sl, Sh, Tbl
                this.currentSlicers = data.filter(w => w.widgetType == 'Slicer');
                this.currentShapes = data.filter(w => w.widgetType == 'Shape');
                this.currentTables = data.filter(w => w.widgetType == 'Table');
                this.currentWidgets = data.filter(w => w.widgetType == 'Graph');

                console.log('Global-Variables getCurrentWidgets 2', dashboardID, dashboardTabID, data)
                resolve(data);
                    
            });
        };

    }

    getWidgetsInfo(): Promise<boolean> {
        // Description: Gets data and other info for [W]
        // Returns: this.datasets, currentDataset array
        // NB: this assumes [W] and [datasets] are available !!
        console.log('Global-Variables getWidgetsInfo ...');

        // Empty the necessary
        let dsIDs: number[] = [];           
        let dsCurrIDs: number[] = [];       // Current Dataset IDs
        this.currentDatasources = [];
        let promiseArray = [];
        let cnt: number = 0;
        
        // Get list of DS-ids to make array work easier
        this.datasources.forEach(d => this.dsIDs.push(d.id));

        // get Current DS
        this.currentWidgets.forEach(w => {
            
            // Only get data from Graphs and Text boxes
            if ( (w.widgetType == 'Graph'  ||  w.widgetType == 'Shape')  &&
                 (w.datasourceID >= 0) ) {

                // Only add datasets where necessary
                if (dsIDs.indexOf(w.datasourceID) < 0) {
                    let newDS = this.datasources.filter(d => d.id == w.datasourceID);
                    if (newDS.length > 0) { 
                        this.currentDatasources.push(newDS[0]);
                        dsIDs.push(w.datasourceID);
                    }
                };
                console.log('xx current DS done', w.id, w.datasourceID, this.currentDatasources)

                // Build array of promises, each getting data for 1 widget if not store already
                if (dsCurrIDs.indexOf(w.datasetID) < 0) {
                    dsCurrIDs.push(w.datasetID);

                    // Get the latest datasetID (when -1 is stored on W)
                    if (w.datasetID == -1) {
                        let ds: number[]=[];
                        
                        this.datasets.forEach(i => {
                            if(i.datasourceID == w.datasourceID) {
                                ds.push(i.id)
                            }
                        });
                        if (ds.length > 0) {
                            w.datasetID = Math.max(...ds);
                        };
                        console.log('xx new dSet id', w.id, w.datasetID)
                    };

                    promiseArray.push(this.getDataset(w.datasourceID, w.datasetID));
                    cnt = cnt + 1;
                };
                console.log('xx promise done', promiseArray)
        
                // Add widget data to local vars
                console.log('xx before allSynch', this.currentWidgets)
                this.allWithAsync(...promiseArray)
                    .then(resolvedData => {
                        console.log('xx after allSynch', this.currentWidgets, this.currentDataset)

                        // Filter currentDatasets by Sl linked to DS
                        this.currentDataset.forEach(cd => {
                            this.filterSlicer(cd);
                        })

                        // Add data to widget
                        // TODO - url = this.filePath for localDB ...
                        this.currentWidgets.forEach(w => {
                            w.graphUrl = "";
                            let ds = this.currentDataset.filter(i => i.id == w.datasetID);
                            console.log('xx ds', ds, this.currentDataset)
                            w.graphData = { value: ds.data};
                        });
                                
                        console.log('Global-Variables getWidgetsInfo 1 True');
                        resolve(true);
                    }, 
                    rejectionReason => console.log('reason:', rejectionReason) // reason: rejected!
                    )
            };
        });
    }

    allWithAsync = (...listOfPromises) => {
        // Resolve all promises in array
        console.log('Global-Variables allWithAsync ...');

        return new Promise(async (resolve, reject) => {
            let results = []
            for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
                results.push(await promise.then(async resolvedData => await resolvedData, reject))
                if (results.length === listOfPromises.length) resolve(results)
            }
        })
    }


    // var tree = dl.treejson('data/flare.json', {children: 'children'});

    getTree<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http
        console.log('Global-Variables get ...');

        return new Promise((resolve, reject) => {
            // Get from source - files for now ...
            var tree = dl.json(this.filePath, {data: 'data'})
                    console.log('currentData', tree);
                    // TODO - fix reading [] with dl !!!
                    resolve(tree);
            }
        );
    }




    get<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http
        console.log('Global-Variables get ...');

        return new Promise((resolve, reject) => {
            // Get from source - files for now ...
            dl.json({url: this.filePath}, {children: 'graphSpecification'}, (err, currentData) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(currentData);
                }
                });
            }
        );
    }

    refreshCurrentDashboard(
        refreshingRoutine: string,
        dashboardID: number, 
        dashboardTabID: number = 0, 
        tabToShow: string = '') {
        // Refresh the global var currentDashboardInfo, then .next it.
        // This will refresh the Dashboard on the screen (via .subscribe)
        // If a dashboardTabID is given, this one will be shown.  Else, it will navigate
        // to tabToShow, which can be First, Previous, Next, Last.  tabToShow overules
        // dashboardTabID if tabToShow is given.  It does not assume that all the currentD 
        // Info has already been collected - to allow for the first time this is called.
        // It does assume that we have a currentDashboardInfo object if Previous/Next are 
        // parameters.
        console.log('Global-Variables refreshCurrentDashboard ...');

        // Assume we have all currentD info
        if ( ( (tabToShow == 'Previous')  ||  (tabToShow == 'Next') )  &&  
            (this.currentDashboardInfo == null) ) {
            return;
        };

        let dt = new Date();  
        let x: number = 0;
        let y: number = 0;
        
        if (tabToShow != '') {
            if (this.currentDashboardTabs.length == 0) {
                console.log('this.currentDashboardTabs empty');
                return;
            }
            if (tabToShow == 'First') {
                x = 0;
            }
            if (tabToShow == 'Previous') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex - 1;
                if (x < 0) {
                    x = this.currentDashboardTabs.length - 1;
                }
            }
            if (tabToShow == 'Next') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex + 1;
                if (x >= this.currentDashboardTabs.length) {
                    x = 0;
                }
            }
            if (tabToShow == 'Last') {
                x = this.currentDashboardTabs.length - 1;
                    
            }
            y = this.currentDashboardTabs[x].id;
        } else {
            y = dashboardTabID;
            if (this.currentDashboards.length == 0) {
                x = 0;
            } else {
                for (var i = 0; i < this.currentDashboardTabs.length; i++) {
                    if (this.currentDashboardTabs[i].id = dashboardTabID) {
                        x = i;
                    }
                }
            }
        }

        this.currentDashboardInfo.next({
            currentDashboardID: dashboardID,
            currentDashboardTabID: y,
            currentDashboardTabIndex: x,
            refreshingRoutine: refreshingRoutine,
            refreshDateTime: dt.toString()
        });

    }

    sleep(milliseconds: number) {
        // 
        console.log('Global-Variables sleep ...', milliseconds);
        var start: number = new Date().getTime();
        console.log('  start', start, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log(counter, mod);
            if (mod == 0) {
                console.log ('   Minutes elapsed ', counter, mod )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', start, new Date().getTime())

                break;
            }
        }
    }
}