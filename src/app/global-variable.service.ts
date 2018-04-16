// Service to provide global variables
import { BehaviorSubject }            from 'rxjs/BehaviorSubject';
import { Injectable }                 from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { HttpErrorResponse }          from '@angular/common/http';
import { HttpParams }                 from "@angular/common/http";
import { HttpHeaders }                from "@angular/common/http";

// Our Models
import { CanvasAction }               from './models';
import { CanvasActivity }             from './models';
import { CanvasAlert }                from './models';
import { CanvasComment }              from './models';
import { CanvasGroup }                from './models';
import { CanvasMessage }              from './models';
import { CanvasSettings }             from './models';
import { CanvasUser}                  from './models';
import { Combination }                from './models';
import { CombinationDetail }          from './models';
import { CSScolor }                   from './models';
import { CurrentDashboardInfo }       from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardSchedule }          from './models';
import { DashboardSubscription }      from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DashboardTemplate }          from './models';
import { DashboardTheme }             from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';
import { Dataset }                    from './models';
import { Datasource }                 from './models';
import { DataQualityIssue}            from './models';
import { DatasourcePermission}        from './models';
import { DatasourcePivot }            from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';
import { StatusBarMessage }           from './models';
import { Transformation }             from './models';
import { UserPreferences }            from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';


// External
import * as dl                        from 'datalib';
import { Observable }                 from 'rxjs/Observable';

// Functions
import { nSQL } from "nano-sql";

// Vega template
const vlTemplate: dl.spec.TopLevelExtendedSpec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

        // Properties for top-level specification (e.g., standalone single view specifications)
        "background": "",
        "padding": "",
        "height": "100",
        "width": "100",
        // "autosize": "",          NB - add these only if needed, blank causes no graph display
        // "config": "",            NB - add these only if needed, blank causes no graph display

        // Properties for any specifications
        "title":
            {
                "text": "",
                "anchor": "",
                "offset": "",
                "orient": "",
                "style": ""
            },
        "name": "",
        "transform": "",

        "description": "",
        "data": null,
        "mark":
            {
                "type": "",  //bar circle square tick line area point rule text
                "style": "",
                "clip": "",
                "color": "#4682b4"
            },
        "encoding":
            {
                "color":
                    {
                        "field": "",
                        "type": ""
                    },
                "x":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "ordinal",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                        {
                            "title": ""
                        },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                    },
                "y":
                    {
                        "aggregate": "",
                        "field": "",
                        "type": "quantitative",
                        "bin": "",
                        "timeUnit": "",
                        "axis":
                            {
                                "title": ""
                            },
                        "scale": "",
                        "legend": "",
                        "format": "",
                        "stack": "",
                        "sort": "",
                        "condition": ""
                        }
            }
    };

// Widget template
const widgetTemplate: Widget =
    {
        "widgetType": "",
        "widgetSubType": "",

        "isTrashed": false,
        "dashboardID": null,
        "dashboardTabID": null,
        "dashboardTabIDs": [],
        "id": null,
        "name": "New Widget",
        "description": "New Widget from Template",
        "visualGrammar": "Vega-Lite",
        "version": 1,
        "isSelected": false,
        "isLiked": false,
        "nrDataQualityIssues": 0,
        "nrComments": 0,
        "showCheckpoints": false,
        "checkpointIDs": [],
        "currentCheckpoint": 0,
        "lastCheckpoint": -1,
        "hyperlinkDashboardID": null,
        "hyperlinkDashboardTabID": null,
        "datasourceID": null,
        "data": null,
        "dataFields": null,
        "dataFieldTypes": null,
        "dataFieldLengths": null,
        "datasetID": null,
        "dataParameters": [],
        "reportID": null,
        "reportName": "",
        "rowLimit": null,
        "addRestRow": false,
        "size": "",
        "containerBackgroundcolor": "transparent",
        "containerBorder": "1px solid gray",
        "containerBorderRadius": "6px",
        "containerBoxshadow": "none",
        "containerFontsize": 12,
        "containerHeight": 320,
        "containerLeft": 10,
        "containerHasTitle": false,
        "containerTop": 80,
        "containerWidth": 410,
        "containerZindex": 50,
        "titleText": "Title of new Widget",
        "titleBackgroundColor": "lightgray",
        "titleBorder": "",
        "titleColor": "black",
        "titleFontsize": 1,
        "titleFontWeight": "",
        "titleHeight": 1,
        "titleLeft": 1,
        "titleMargin": "0",
        "titlePadding": "0 0 0 5px",
        "titlePosition": "",
        "titleTextAlign": "center",
        "titleTop": 1,
        "titleWidth": 100,
        "graphType": "",
        "graphHeight": 240,
        "graphLeft": 1,
        "graphTop": 1,
        "graphWidth": 240,
        "graphGraphPadding": 1,
        "graphHasSignals": false,
        "graphFillColor": "",
        "graphHoverColor": "",
        "graphSpecification": "",
        "graphDescription": "",
        "graphXaggregate": "",
        "graphXtimeUnit": "",
        "graphXfield": "",
        "graphXtype": "",
        "graphXaxisTitle": "",
        "graphYaggregate": "",
        "graphYtimeUnit": "",
        "graphYfield": "",
        "graphYtype": "",
        "graphYaxisTitle": "",
        "graphTitle": "",
        "graphMark": "tick",
        "graphMarkColor": "#4682b4",
        "graphUrl": "",
        "graphColorField": "",
        "graphColorType": "",
        "graphData": "",
        "tableBackgroundColor" : "",
        "tableColor": "",
        "tableCols": 1,
        "fontSize": 12,
        "tableHeight": 1,
        "tableHideHeader": false,
        "tableLeft": 1,
        "tableLineHeight": 12,
        "tableRows": 1,
        "tableTop": 1,
        "tableWidth": 1,
        "slicerType": "",
        "slicerNumberToShow": '',
        "slicerSortField": '',
        "slicerSortFieldOrder": '',
        "slicerFieldName": "",
        "slicerSelection": null,
        "slicerBins": null,
        "slicerAddRest": false,
        "slicerAddRestValue": false,
        "shapeStroke": "",
        "shapeStrokeWidth": "",
        "shapeFill": "",
        "shapeText": "",
        "shapeValue": "",
        "shapeBullets": [],
        "shapeBulletStyleType": "",
        "shapeBulletsOrdered": false,
        "shapeOpacity": 1,
        "shapeRotation": 0,
        "shapeCorner": 15,
        "shapeFontSize": 24,
        "shapeFontFamily": "",
        "shapeIsBold": true,
        "shapeIsItalic": false,
        "refreshMode": "",
        "refreshFrequency": 1,
        "widgetRefreshedOn": "",
        "widgetRefreshedBy": "",
        "widgetCreatedOn": "",
        "widgetCreatedBy": "",
        "widgetUpdatedOn": "",
        "widgetUpdatedBy": ""
    }

// Dashboard template
const dashboardTemplate: Dashboard =
    {
        id: null,
        version: 0,
        state: '',
        code: '',
        name: '',
        description: '',
        accessType: 'Private',
        password: '',
        refreshMode: '',
        refreshTimer: 0,
        defaultTabID: 0,
        defaultExportFileType: '',
        url: '',
        qaRequired: false,
        isSample: false,
        backgroundColor: '',
        backgroundImage: '',
        templateDashboardID: 0,
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        refresher: '',
        dateRefreshed: '',
        nrWidgets: 0,
        nrShapes: 0,
        nrRecords: 0,
        nrTimesOpened: 0,
        tabs: [],
        permissions: []
    };

const dashboardTabTemplate: DashboardTab =
    {
        id: null,
        dashboardID: 0,
        name: 'First',
        description: '',
        backgroundColor: '',
        color: ''
                
    };


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

    // Settings 
    // TODO - get from DB, not Constants

    canvasSettings: CanvasSettings = {
        companyName: '',
        companyLogo: '',
        dashboardTemplate: '',
        offlineData: false,
        offlineSchema: false,
        offlineLogin: false,
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
        queryRunningMessage: 'Query running...'
    }

    userPreferences: UserPreferences = {
        preferencePaletteHorisontal: false,
        preferenceAutoSync: true,
        preferenceShowOpenStartupMessage: true,
        preferenceShowOpenDataCombinationMessage: true,
        preferenceShowViewStartupMessage: true,
        preferenceShowDiscardStartupMessage: true,
        preferenceDefaultTemplate: '',
        preferenceDefaultDateformat: '',
        preferenceDefaultFolder: '',
        preferenceDefaultPrinter: '',
        preferenceDefaultPageSize: '',
        preferenceDefaultPageLayout: ''
    }

    vlTemplate: dl.spec.TopLevelExtendedSpec = vlTemplate;
    widgetTemplate: Widget = widgetTemplate;
    dashboardTemplate: Dashboard = dashboardTemplate;
    dashboardTabTemplate: DashboardTab = dashboardTabTemplate;
    

    // System-wide related variables, set at Installation - for later use
    // systemConfigurationID: number = -1;
    // backendName: string = 'Eazl';
    // backendUrl: string = '';                                    // RESTi url, set in SystemConfig
    // defaultDaysToKeepResultSet: number = 1;                     // Optional, set in SystemConfig
    // frontendName: string = 'Canvas';
    // maxRowsDataReturned: number = 1000000;                      // Optional, set in SystemConfig
    // maxRowsPerWidgetGraph: number = 1;                          // Optional, set in SystemConfig
    // systemTitle: string = 'Canvas';
    // averageWarningRuntime: number = 0;
    // defaultWidgetConfiguration: string = '';
    // dashboardIDStartup: number = null;
    // defaultReportFilters: string = '';
    // environment: string = '';
    // frontendColorScheme: string = '';

    // Permanent data - later to come from http
    backgroundcolors: CSScolor[] = [];
    canvasActivities: CanvasActivity[] = [];
    canvasAlerts: CanvasAlert[] = [];
    canvasComments: CanvasComment[] = [];
    canvasMessages: CanvasMessage[] = [];
    widgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    filePath: string;

    dashboards: Dashboard[] = [];
    canvasUsers: CanvasUser[] = [];
    canvasGroups: CanvasGroup[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardsRecent: number[];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardTags: DashboardTag[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardSnapshots: DashboardSnapshot[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    dashboardThemes: DashboardTheme[] = [];
    dashboardTemplates: DashboardTemplate[] = [];
    widgets: Widget[] = [];

    datasources: Datasource[] = [];
    transformations: Transformation[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    datasourcePermissions: DatasourcePermission[] = [];
    datasourcePivots: DatasourcePivot[] = [];
    transformationsFormat: Transformation[] = transformationsFormat;
    fields: Field[] = fields;
    fieldsMetadata: FieldMetadata[] = fieldsMetadata;
    datasets: any = [];                                 // List of dSets, NO data
    finalFields: any = finalFields;


    // Data for CURRENT Dashboard and Datasources: only some models are loaded
    currentCanvasGroups: CanvasGroup[] = [];
    currentDatasources: Datasource[] = [];
    currentTransformations: Transformation[] = [];
    currentDataQualityIssues: DataQualityIssue[] = [];
    currentDatasourcePermissions: DatasourcePermission[] = [];
    currentDatasourcePivots: DatasourcePivot[] = [];
    currentDatasets: any = [];                          // Used in current D, with data
    currentDashboards: Dashboard[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentWidgets: Widget[] = [];
    currentDashboardSchedules: DashboardSchedule[] = [];
    currentDashboardTags: DashboardTag[] = [];
    currentPaletteButtonBar: PaletteButtonBar[];
    currentDashboardPermissions: DashboardPermission[] = [];
    currentDashboardSnapshots: DashboardSnapshot[] = [];
    currentDashboardSubscriptions: DashboardSubscription[] = [];
    changedWidget = new BehaviorSubject<Widget>(null);    // W that must be changed

    // TODO - this is trigger a rename of the Dname on statusbar - must be better way
    currentDashboardName = new BehaviorSubject<string>('');
    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined
    // widgetsToRefresh = new BehaviorSubject<number[]>([]);            // Array of Wids to refresh

    // Global vars that guide all interactions
    // ***************************************
    // Modes and Display
    editMode = new BehaviorSubject<boolean>(false);
    presentationMode = new BehaviorSubject<boolean>(false);
    showGrid = new BehaviorSubject<boolean>(false);
    showPalette = new BehaviorSubject<boolean>(true);
    preferencePaletteHorisontal = new BehaviorSubject<boolean>(true);

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
    hasDatasources = new BehaviorSubject<boolean>(false);   // Used to set menu
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    selectedWidgetIDs: number[] = [];

    // Session
    actions: CanvasAction[] = [];
    currentUser: CanvasUser;
    datasourceToEditID = new BehaviorSubject<number>(null);
    dsIDs: number[] = [];           // Dataset IDs
    getSource: string = 'Test';     // Where to read/write: File, Test (JSON Server), Eazl
    loggedIntoServer = new BehaviorSubject<boolean>(true);
    menuActionResize = new BehaviorSubject<boolean>(false);
    currentPaletteButtonsSelected= new BehaviorSubject<PaletteButtonsSelected[]>([]);
    recentDashboards = new BehaviorSubject<DashboardRecent[]>([]);  // Recently used Dashboards
    sessionDebugging: boolean = true;
    sessionLogging: boolean = false;
    templateInUse = new BehaviorSubject<boolean>(false);
    widgetGroup = new BehaviorSubject<number[]>([]);
    // userID: string = 'JannieI';  // TODO - unHardCode
    

    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.canvasSettings.noQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)

    dataGetFromSwitch = new BehaviorSubject<string>('File');
    // refreshDashboard = new BehaviorSubject<boolean>(false);      // True to refresh the D now

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
    isDirtyDashboardSubscription: boolean = true;
    isDirtyDashboardThemes: boolean = true;
    isDirtyDatasources: boolean = true;
    isDirtyTransformations: boolean = true;
    isDirtyDataQualityIssues: boolean = true;
    isDirtyDatasourcePermissions: boolean = true;
    isDirtyDatasourcePivots: boolean = true;
    isDirtyDatasets: boolean = true;
    isDirtyBackgroundColors: boolean = true;
    isDirtyCanvasActivities: boolean = true;
    isDirtyCanvasAlerts: boolean = true;
    isDirtyCanvasComments: boolean = true;
    isDirtyCanvasMessages: boolean = true;
    isDirtyCanvasSettings: boolean = true;
    isDirtyUserPreferences: boolean = true;
    isDirtyPaletteButtonBar: boolean = true;
    isDirtyUserPaletteButtonBar: boolean = true;
    isDirtyPaletteButtonsSelected: boolean = true;
    isDirtyWidgetCheckpoints: boolean = true;
    isDirtyCanvasGroups: boolean = true;
    isDirtyUsers: boolean = true;

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
        private http: HttpClient,
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
            this.getCurrentDashboard(dashboardID).then( i => {

                // Load the DashboardTabs
                this.getCurrentDashboardTabs(dashboardID).then(j => {
                    if (dashboardTabID == -1) {
                        if (j.length > 0) {dashboardTabID = j[0].id}
                    };

                    // Load Permissions for D
                    this.getCurrentDashboardPermissions(dashboardID).then( l => {

                    // Load Checkpoints for D
                    this.getCurrentWidgetCheckpoints(dashboardID).then( l => {

                    // Load Datasets
                    this.getDataset().then(m => {

                        // Load Widgets
                        this.getCurrentWidgets(dashboardID, dashboardTabID).then(n => {

                            // Load current DS
                            this.getCurrentDatasources(dashboardID).then(k => {

                                // Get info for W
                                this.getWidgetsInfo().then(n => {

                                    if (this.currentDatasources.length > 0) {
                                        this.hasDatasources.next(true);
                                    } else {
                                        this.hasDatasources.next(false);
                                    }
                                    resolve(true)
                                })
                            })
                        })
                    })
                })
                })
                })
            });
        });
    }

    refreshCurrentDatasourceInfo(datasourceID: number): Promise<boolean> {
        // Refreshes all info related to current DS, but NOT currentDatasources
        // Returns True if all worked, False if something went wrong
        console.log('Global-Variables refreshCurrentDatasourceInfo D,T id = ', datasourceID)

        // Get lates dSet for give DSid
        // TODO - decide if lates / -1 is best choice here
        let ds: number[] = [];
        let dSetID: number = 1;
        for (var i = 0; i < this.datasets.length; i++) {
            if(this.datasets[i].datasourceID == datasourceID) {
                ds.push(this.datasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        };

        // Load the current Dashboard, and Optional template.  The dependants are stakced
        // in a Promise chain, to ensure we have all or nothing ...

        return new Promise<boolean>((resolve, reject) => {
            // Load data
            this.getCurrentDataset(datasourceID, dSetID).then (j =>
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
        this.getCurrentDatasources(dashboardID)

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

    }

    // dashboardDelete(index: number) {
    //     //
    //     console.log('Global-Variables dashboardDelete', index)

    //     for (var i = 0; i < this.currentWidgets.length; i++) {
    //         i => {
    //                 if (i.id == index) { i.isTrashed = true}
    //             }
    //     }
    // }

    addDashboardRecent(dashboardID: number, dashboardTabID: number) {
        //
        console.log('Global-Variables addDashboardRecent ...', dashboardID, dashboardTabID);

        // TODO - put to DB
    }

    deleteDashboardRecent(index: number): Promise<boolean> {
        //
        console.log('Global-Variables deleteDashboardRecent ...', index);

        // Update data
        return new Promise<boolean>((resolve, reject) => {
            let i: number = this.dashboardsRecent.indexOf(index);
            if (i >= 0) {
                this.dashboardsRecent.splice(i , 1);
            };

            // Refresh temp array
            this.getDashboardsRecentList(this.currentUser.userID).then(
                i => resolve(true)
            )
        });
    }

    getDashboards(): Promise<Dashboard[]> {
        // Description: Gets all D
        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboards ...');

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<Dashboard[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboards.length == 0)  ||  (this.isDirtyDashboards) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboards = data;
                        this.isDirtyDashboards = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboards 1', this.dashboards)
                        resolve(this.dashboards);
                    });
            } else {
                console.log('Global-Variables getDashboards 2')
                resolve(this.dashboards);
            }
        });

    }

    deleteDashboardInfo(dashboardID: number) {
        // Deletes D with all related Entities
        console.log('Global-Variables deleteDashboardInfo ...', dashboardID);

        // TODO - update DB
        this.dashboards.forEach(d => {
            if (d.templateDashboardID == dashboardID) {
                d.templateDashboardID == 0;
                this.saveDashboard(d);
            };
        });
        this.currentDashboards.forEach(d => {
            if (d.templateDashboardID == dashboardID) {
                d.templateDashboardID == 0;
            };
        });
        this.widgets.forEach(w => {
            if (w.hyperlinkDashboardID == dashboardID) {
                w.hyperlinkDashboardID = 0;
                this.saveWidget(w);
            };
        });
        this.currentWidgets.forEach(w => {
            if (w.hyperlinkDashboardID == dashboardID) {
                w.hyperlinkDashboardID = 0;
            };
        });
        this.canvasUsers.forEach(u => {
            if (u.startupDashboardID == dashboardID) {
                u.startupDashboardID = 0;
            };
            u.favouriteDashboards.filter(f => f != dashboardID) 
            // TODO - improve this to not update ALL users
            this.saveCanvasUser(u);
        });

        // Delete from DB
        this.deleteDashboard(dashboardID);

        this.dashboardTabs.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardTab(t.id);
            };
        });
        this.widgets.forEach(w => {
            if (w.dashboardID == dashboardID) {
                this.deleteWidget(w.id);
            };
        });
        this.dashboardSnapshots.forEach(snp => {
            if (snp.dashboardID == dashboardID) {
                this.deleteDashboardSnapshot(snp.id);
            };
        });
        this.canvasMessages.forEach(mes => {
            if (mes.dashboardID == dashboardID) {
                this.deleteCanvasMessage(mes.id);
            };
        });
        this.canvasComments.forEach(com => {
            if (com.dashboardID == dashboardID) {
                this.deleteCanvasComment(com.id);
            };
        });
        this.dashboardSchedules.forEach(sch => {
            if (sch.dashboardID == dashboardID) {
                this.deleteDashboardSchedule(sch.id);
            };
        });
        this.currentDashboardSubscriptions.forEach(sub =>  {
            if (sub.dashboardID == dashboardID) {
                this.deleteDashboardSubscription(sub.id);
            };
        });
        this.dashboardTags.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardTag(t.id);
            };
        });
        this.dashboardPermissions.forEach(t => {
            if (t.dashboardID == dashboardID) {
                this.deleteDashboardPermission(t.id);
            };
        });
        this.widgetCheckpoints.forEach(chk => {
            if (chk.dashboardID == dashboardID) {
                this.deleteWidgetCheckpoint(chk.id);
            };
        });

    }

    clearDashboardInfo() {
        // Clears all related Entities of a D
        console.log('Global-Variables clearDashboardInfo ...');

        // TODO - find a better way to keep all related items in sync, and list updated
        this.currentDashboards = [];
        this.currentDashboardTabs = [];
        this.currentWidgets = [];
        this.currentDashboardSnapshots = [];
        this.currentDashboardSchedules = [];
        this.currentDashboardSubscriptions = [];
        this.currentDashboardTags = [];
        this.currentDashboardPermissions = [];
        this.currentWidgetCheckpoints = [];

    }

    deleteDashboard(id: number): Promise<string> {
        // Description: Deletes a Dashboard
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboard ...', id);

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
                            
                    this.dashboards = this.dashboards.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboards = this.currentDashboards.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboard DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboard(data: Dashboard): Promise<string> {
        // Description: Saves Dashboard
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveDashboard ...');

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                data => {

                    // TODO - update local vars
                    // this.dashboards.forEach(d => {
                    //     if (d.id == data.id) {
                    //         d = data;
                    //     };
                    // });
                    console.log('saveDashboard SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
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
                                let templateDashboard: Dashboard[] = null;

                                templateDashboard = this.dashboards.filter(
                                    i => i.id == this.currentDashboards[0].templateDashboardID
                                );

                                if (templateDashboard == null) {
                                    alert('Dashboard template id does not exist in Dashboards Array')
                                } else {
                                    this.currentDashboards.push(templateDashboard[0]);
                                    this.templateInUse.next(true);
                                }
                            } else {
                                this.templateInUse.next(false);
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
                    let templateDashboard: Dashboard[] = null;

                    templateDashboard = this.dashboards.filter(
                        i => i.id == this.currentDashboards[0].templateDashboardID
                    );

                    if (templateDashboard == null) {
                        alert('Dashboard template id does not exist in Dashboards Array')
                    } else {
                        this.currentDashboards.push(templateDashboard[0]);
                        this.templateInUse.next(true);
                    }
                } else {
                    this.templateInUse.next(false);
                };
                // this.currentDashboards.next(currentDashboards);
                console.log('Global-Variables getCurrentDashboards 2', dashboardID, this.currentDashboards)
                resolve(this.currentDashboards);
            });
        };

    }

    addDashboard(data: Dashboard): Promise<any> {
        // Description: Adds a new Dashboard
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboard ...', data.id);

        let url: string = 'dashboards';
        this.filePath = './assets/data.dashboards.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Clear all related info
                    this.clearDashboardInfo();

                    // Update Global vars to make sure they remain in sync
                    this.dashboards.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboards.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addDashboard ADDED', data, this.dashboards)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboard FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }
    
    getDashboardTabs(): Promise<DashboardTab[]> {
        // Description: Gets all T
        // Returns: this.dashboardTabs array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardTabs ...');

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<DashboardTab[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTabs.length == 0)  ||  (this.isDirtyDashboardTabs) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTabs = data;
                        this.isDirtyDashboardTabs = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardTabs 1', this.dashboardTabs)
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
                        resolve(this.currentDashboardTabs);

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
                resolve(this.currentDashboardTabs);
            });
        };

    }

    addDashboardTab(data: DashboardTab): Promise<any> {
        // Description: Adds a new DashboardTab
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboardTab ...', data.id);

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.dashboardTabs.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardTabs.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addDashboardTab ADDED', data, this.dashboardTabs)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardTab FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }
    
    deleteDashboardTab(id: number): Promise<string> {
        // Description: Deletes a DashboardTab
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardTab ...', id);

        let url: string = 'dashboardTabs';
        this.filePath = './assets/data.dashboardTabs.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
                            
                    this.dashboardTabs = this.dashboardTabs.filter(
                        t => t.id != id
                    );
                    this.currentDashboardTabs = this.currentDashboardTabs.filter(
                        t => t.id != id
                    );

                    console.log('deleteDashboardTab DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardTab FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
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

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<number[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.isDirtyDashboards)  ||  (this.isDirtyDashboardsRecent) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
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
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        resolve(this.dashboardsRecent);
                    });
            } else {
                console.log('Global-Variables this.dashboardsRecent 2', this.dashboardsRecent)
                resolve(this.dashboardsRecent);
            }
        });

    }

    getDashboardsRecent(userID: string): Promise<DashboardRecent[]>  {
        // Description: Gets an array of recently used D (not the Ds itself)
        // Returns: return array from source, not cached
        console.log('Global-Variables getDashboardsRecent ...');

        let url: string = 'dashboardsRecent';
        this.filePath = './assets/data.dashboardsRecent.json';

        return new Promise<DashboardRecent[]>((resolve, reject) => {

            // Refresh from source at start
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
            this.get(url).then(data => {
                this.dashboardsRecent = [];
                // TODO - http must be sorted => include in Options ...
                let temp: DashboardRecent[] = data.filter(
                    i => i.userID == userID
                );

                // Add State and Name, at Runtime
                for (var x = 0; x < temp.length; x++) {
                    temp[x].stateAtRunTime = 'Deleted';
                    for (var y = 0; y < this.dashboards.length; y++) {
                        if (this.dashboards[y].id ==
                            temp[x].dashboardID) {
                                temp[x].stateAtRunTime = this.dashboards[y].state;
                                temp[x].nameAtRunTime = this.dashboards[y].name;
                        };
                    };
                };

                console.log('Global-Variables dashboardsRecent 1', temp)
                this.isDirtyDashboardsRecent = false;
                this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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

    getDataset(): Promise<Dataset[]> {
        // Description: Gets Datasets, WITHOUT data
        // Returns: this.dataset
        console.log('Global-Variables getDataset ...');

        let url: string = 'datasets';
        this.filePath = './assets/data.datasets.json';

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasets = data;
                        this.isDirtyDatasets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDataset 1', this.datasets)
                        resolve(this.datasets);
                    });
            } else {
                console.log('Global-Variables getDataset 2', this.datasets)
                resolve(this.datasets);
            }
        });

    }

    getCurrentDataset(datasourceID: number, datasetID: number): Promise<Dataset> {
        // Description: Gets a Dataset, and inserts it once into this.currentDatasets
        // Returns: dataset
        console.log('Global-Variables getCurrentDataset ...');

        let url: string = 'dataset';
        this.filePath = './assets/data.datasets.json';

        // Get list of dSet-ids to make array work easier
        let dsCurrIDs: number[] = [];       // currentDataset IDs
        let dsSourceLocation: string = '';
        let folderName: string = '';
        let fileName: string = '';
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));
        let datasetIndex: number = null;

        // this.datasets.forEach(ds => {
        //     if (ds.id == datasetID) {
        //         dsSourceLocation = ds.sourceLocation;
        //         url = ds.url;
        //         if (ds.folderName == ''  ||  ds.folderName == null) {
        //             ds.folderName = '../assets/';
        //         };
        //         if (ds.fileName == ''  ||  ds.fileName == null) {
        //             ds.fileName = 'data.dataset' + ds.id.toString() + '.json';
        //         };
        //         folderName = ds.folderName;
        //         fileName = ds.fileName;
        //         this.filePath = ds.folderName + ds.fileName;
        //     }
        // });
        for (var i = 0; i < this.datasets.length; i++) {
            if (this.datasets[i].id == datasetID) {
                datasetIndex = i;
                dsSourceLocation = this.datasets[i].sourceLocation;
                url = this.datasets[i].url;
                if (this.datasets[i].folderName == ''  ||  this.datasets[i].folderName == null) {
                    this.datasets[i].folderName = '../assets/';
                };
                if (this.datasets[i].fileName == ''  ||  this.datasets[i].fileName == null) {
                    this.datasets[i].fileName = 'data.dataset' + this.datasets[i].id.toString() + '.json';
                };
                folderName = this.datasets[i].folderName;
                fileName = this.datasets[i].fileName;
                this.filePath = this.datasets[i].folderName + this.datasets[i].fileName;
            }
        };
console.log('xx getCurrentDataset url', url, this.datasets)
        return new Promise<any>((resolve, reject) => {

            // Data already in dataset
            if (dsSourceLocation == '') {

                if (datasetIndex != null) {
                    // Add to Currentatasets (contains all data) - once
                    if (dsCurrIDs.indexOf(datasetID) < 0) {
                        this.currentDatasets.push(this.datasets[datasetIndex]);
                    };
                } else {
                    console.log('Error in getCurrentDataset - datasetIndex == null')
                };
            };

            // Get data from the correct place
            if (dsSourceLocation == 'localDB') {

                this.getLocal('Dataset')
                .then(data => {
                    let newdSet: Dataset = data;

                    // // Add to datasets (contains all data) - once
                    // if (dSetIDs.indexOf(datasetID) < 0) {
                    //     this.datasets.push(newdSet);
                    // };

                    // Add to Currentatasets (contains all data) - once
                    if (dsCurrIDs.indexOf(datasetID) < 0) {
                        this.currentDatasets.push(newdSet);
                    };

                    console.log('Global-Variables getCurrentDataset 1 from ', dsSourceLocation, datasourceID,
                        datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                    resolve(newdSet);
                });
            };

            if (dsSourceLocation == 'file') {
                // TODO - fix this via real http
                let dataurl: string = this.filePath;
                this.get(dataurl)
                    .then(dataFile => {

                        let newdSet: Dataset = {
                            id: datasetID,
                            datasourceID: datasourceID,
                            url: url,
                            sourceLocation: 'file',
                            folderName: folderName,
                            fileName: fileName,
                            data: dataFile,
                            dataRaw: dataFile
                        };

                        // // Add to datasets (contains all data) - once
                        // if (dSetIDs.indexOf(datasetID) < 0) {
                        //     this.datasets.push(newdSet);
                        // };

                        // Add to Currentatasets (contains all data) - once
                        if (dsCurrIDs.indexOf(datasetID) < 0) {
                            this.currentDatasets.push(newdSet);
                        };

                        console.log('Global-Variables getCurrentDataset 1 from ', dsSourceLocation, datasourceID,
                            datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                        resolve(newdSet);
                    }
                );
            };

            if (dsSourceLocation == 'HTTP') {

                this.get(url)
                    .then(dataFile => {

                        let newdSet: Dataset = {
                            id: datasetID,
                            datasourceID: datasourceID,
                            url: url,
                            sourceLocation: 'HTTP',
                            folderName: folderName,
                            fileName: fileName,
                            data: dataFile,
                            dataRaw: dataFile
                        };

                        // // Add to datasets (contains all data) - once
                        // if (dSetIDs.indexOf(datasetID) < 0) {
                        //     this.datasets.push(newdSet);
                        // };

                        // Add to Currentatasets (contains all data) - once
                        if (dsCurrIDs.indexOf(datasetID) < 0) {
                            this.currentDatasets.push(newdSet);
                        };

                        console.log('Global-Variables getCurrentDataset 1 from ', dsSourceLocation, datasourceID,
                            datasetID, newdSet, 'currentDatasets', this.currentDatasets)
                        resolve(newdSet);
                    }
                );
            };
        });
    }

    addDataset(data: Dataset): Promise<any> {
        // Description: Adds a new Dataset
        // Returns: Added Data or error message
        console.log('Global-Variables addDataset ...', data.id);

        // let url: string = data.url;
        // this.filePath = data.folderName + data.fileName;
        let url: string = 'datasets';
        this.filePath = './assets/data.datasets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.datasets.push(JSON.parse(JSON.stringify(data)));
                    this.currentDatasets.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addDataset ADDED', res, this.datasets, this.currentDatasets)

                    resolve(res);
                },
                err => {
                    console.log('Error addDataset FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }
    
    getData(id: number): Promise<Dataset[]> {
        // Description: Gets Datasets, WITHOUT data
        // Returns: this.dataset
        console.log('Global-Variables getData ...', id);

        let url: string = 'data/' + id.toString();
        this.filePath = './assets/data.datasets.json';

        return new Promise<Dataset[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // if ( (this.datasets.length == 0)  ||  (this.isDirtyDatasets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(res => {
                        // TODO - load here, or in calling routing
                        // this.datasets[xxx from id].rawData & .data = data;
                        // this.isDirtyDatasets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getData', res)
                        resolve(res);
                    });
            // } else {
            //     console.log('Global-Variables getData 2', this.datasets)
            //     resolve(this.datasets);
            // }
        });

    }

    addData(data: any): Promise<any> {
        // Description: Adds DATA used in a new Dataset
        // Returns: Added Data or error message
        console.log('Global-Variables addData  ...', data.id);

        // let url: string = data.url;
        // this.filePath = data.folderName + data.fileName;
        let url: string = 'data';
        this.filePath = './assets/data.dataset' + data.id + '.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {
                                       
                    console.log('addData ADDED', res, this.datasets, this.currentDatasets)

                    resolve(res);
                },
                err => {
                    console.log('Error addData FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    filterSlicer(dataSet: Dataset): Dataset {
        // Filter a given Dataset on .dataRaw by applying all applicable Sl, and put result
        // into .data
        // Note: Objects and arrays are passed by reference. Primitive values like number,
        // string, boolean are passed by value.  Thus, original object (dSet) is modified here.
        console.log('Global-Variables filterSlicer ...');

        this.currentWidgets.forEach(w => {
            console.log('xx strt graphData', w.graphUrl, w.graphData);
        });


        // Get all Sl for the given dSet
        // TODO: cater (carefully) for case where sl.datasetID == -1, ie what if DS has
        // two dSets with different values ...
        let relatedSlicers: Widget[] = this.currentWidgets.filter(w =>
            w.datasourceID == dataSet.datasourceID  
            &&  w.datasetID == dataSet.id  
            &&  w.widgetType == 'Slicer'
        );
        console.log('xx 1', dataSet)
        // Reset the filtered data
        dataSet.data = dataSet.dataRaw;
        console.log('xx 2', dataSet)

        // Loop on related Sl and filter data
        relatedSlicers.forEach(w => {
            console.log('sl-filter 0', w.slicerType)

            // Type = List
            if (w.slicerType == 'List') {

                // Build array of selection values
                let selectedValues: string[] = [];
                let allSelectedValues: string[] = [];

                w.slicerSelection.forEach(f => {
                    if (f.isSelected) { 
                        selectedValues.push(f.fieldValue);
                    };
                    allSelectedValues.push(f.fieldValue);
                });

                // Apply selected once, empty means all
                let tempData: any = [];
                    dataSet.data.forEach(d => {
                        if (selectedValues.indexOf(d[w.slicerFieldName]) >= 0) {
                            tempData.push(d);
                        };
                        if ( (w.slicerAddRest  &&  w.slicerAddRestValue)  
                            &&
                            allSelectedValues.indexOf(d[w.slicerFieldName]) < 0) {
                                tempData.push(d);
                        };
                    });

                    // Replace the filtered data, used by the graph
                dataSet.data = tempData;
                
            };

            // Type = Bins
            if (w.slicerType == 'Bins') {

                // Build array of selection values
                let rangeValues: {fromValue: number; toValue:number}[] = [];

                w.slicerBins.forEach(bn => {
                    if (bn.isSelected) { 
                        rangeValues.push(
                            {fromValue: bn.fromValue, toValue: bn.toValue}
                        )
                    };
                });

                // Loop on Bins, and add filtered ones
                let filterBinData: any = [];

                rangeValues.forEach(rv => {
                    dataSet.data.forEach(d => {
                        if (+d[w.slicerFieldName] >= rv.fromValue  
                            &&  
                            +d[w.slicerFieldName] <= rv.toValue) {
                                filterBinData.push(d);
                        };
                    });
                });

                // Replace the filtered data, used by the graph
                dataSet.data = filterBinData;

            };
        });

        // Filter data in [W] related to this dSet
        // TODO - cater later for cases for we use graphUrl
        this.currentWidgets.forEach(w => {
            if (w.datasourceID == dataSet.datasourceID  
                &&   w.datasetID == dataSet.id  
                && w.widgetType != 'Slicer') {
                    w.graphUrl = "";
                    w.graphData = dataSet.data;
            };
        });

        console.log('xx filt Sl', this.currentWidgets, dataSet)
        return dataSet;
    }

    getDashboardSchedules(): Promise<DashboardSchedule[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardSchedules array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSchedules ...');

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<DashboardSchedule[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSchedules.length == 0)  ||  (this.isDirtyDashboardSchedules) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSchedules = data;
                        this.isDirtyDashboardSchedules = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardSchedules 1')
                        resolve(this.dashboardSchedules);
                    });
            } else {
                console.log('Global-Variables getDashboardSchedules 2')
                resolve(this.dashboardSchedules);
            }
        });

    }

    deleteDashboardSchedule(id: number): Promise<string> {
        // Description: Deletes a DashboardSchedules
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardSchedule ...', id);

        let url: string = 'dashboardSchedules';
        this.filePath = './assets/data.dashboardSchedules.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
        
                    this.dashboardSchedules = this.dashboardSchedules.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSchedules = this.currentDashboardSchedules.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardSchedule DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSchedule FAILED', err);;
                    resolve(err.Message);
                }
            )
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
                        resolve(this.currentDashboardSchedules);
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
                resolve(this.currentDashboardSchedules);
            });
        };
    }

    getDashboardTags(): Promise<DashboardTag[]> {
        // Description: Gets all Sch
        // Returns: this.dashboardTagsget array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardTags ...');

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<DashboardTag[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardTags.length == 0)  ||  (this.isDirtyDashboardTags) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardTags = data;
                        this.isDirtyDashboardTags = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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
        // Description: Gets all Tags for current D
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
                        resolve(this.currentDashboardTags);
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
                resolve(this.currentDashboardTags);
            });
        };
    }

    addDashboardTag(data: DashboardTag): Promise<any> {
        // Description: Adds a new DashboardTag
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboardTag ...', data.id);

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.dashboardTags.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardTags.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addDashboardTag ADDED', data, this.dashboardTags)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardTag FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardTag(id: number): Promise<string> {
        // Description: Deletes a DashboardTag
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardTag ...', id);

        let url: string = 'dashboardTags';
        this.filePath = './assets/data.dashboardTags.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
                            
                    this.dashboardTags = this.dashboardTags.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardTags = this.currentDashboardTags.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardTag DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardTag FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardPermissions(): Promise<DashboardPermission[]> {
        // Description: Gets all P
        // Returns: this.dashboardPermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardPermissions ...');

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<DashboardPermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardPermissions.length == 0)  ||  (this.isDirtyDashboardPermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardPermissions = data;
                        this.isDirtyDashboardPermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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
                        resolve(this.currentDashboardPermissions);
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
                resolve(this.currentDashboardPermissions);
            });
        };
    }

    addDashboardPermission(data: DashboardPermission): Promise<any> {
        // Description: Adds a new DashboardPermission
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboardPermission ...', data.id);

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.dashboardPermissions.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardPermissions.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardPermission ADDED', data, 
                        this.currentDashboardPermissions, this.dashboardPermissions)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveDashboardPermission(data: DashboardPermission): Promise<string> {
        // Description: Saves DashboardPermission
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveDashboardPermission ...');

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                data => {
                    console.log('saveDashboardPermission SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardPermission(id: number): Promise<string> {
        // Description: Deletes a DashboardPermissions
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardPermission ...', id);

        let url: string = 'dashboardPermissions';
        this.filePath = './assets/data.dashboardPermissions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
        
                    this.dashboardPermissions = this.dashboardPermissions.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardPermissions = this.currentDashboardPermissions.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardPermission DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardPermission FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }
    
    getCanvasGroups(): Promise<CanvasGroup[]> {
        // Description: Gets all G
        // Returns: this.canvasGroups array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasGroups ...');

        let url: string = 'canvasGroups';
        this.filePath = './assets/data.canvasGroups.json';

        return new Promise<CanvasGroup[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasGroups.length == 0)  ||  (this.isDirtyCanvasGroups) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasGroups = data;
                        this.isDirtyCanvasGroups = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasGroups 1')
                        resolve(this.canvasGroups);
                    });
            } else {
                console.log('Global-Variables getCanvasGroups 2')
                resolve(this.canvasGroups);
            }
        });

    }

    getDashboardSnapshots(): Promise<DashboardSnapshot[]> {
        // Description: Gets all Sn
        // Returns: this.dashboardSnapshots array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSnapshots ...');

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<DashboardSnapshot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardSnapshots.length == 0)  ||  (this.isDirtyDashboardSnapshots) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

                this.get(url)
                    .then(data => {
                        this.dashboardSnapshots = data;
                        this.isDirtyDashboardSnapshots = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardSnapshots 1', this.dashboardSnapshots)
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
                        console.log('Global-Variables getCurrentDashboardSnapshots 1',
                            dashboardID, data)
                        resolve(this.currentDashboardSnapshots);
                })
             })
        } else {
            return new Promise<DashboardSnapshot[]>((resolve, reject) => {
                let returnData: DashboardSnapshot[];
                returnData = this.dashboardSnapshots.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentDashboardSnapshots = returnData;
                console.log('Global-Variables getCurrentDashboardSnapshots 2', dashboardID)
                resolve(this.currentDashboardSnapshots);
            });
        };
    }

    addDashboardSnapshot(data: DashboardSnapshot): Promise<any> {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboardSnapshot ...', data.id);

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.dashboardSnapshots.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardSnapshots.push(JSON.parse(JSON.stringify(data)));

                    console.log('addDashboardSnapshot ADDED', data, 
                        this.currentDashboardSnapshots, this.dashboardSnapshots)

                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardSnapshot FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardSnapshot(id: number): Promise<string> {
        // Description: Deletes a DashboardSnapshots
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardSnapshot ...', id);

        let url: string = 'dashboardSnapshots';
        this.filePath = './assets/data.dashboardSnapshots.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
        
                    this.dashboardSnapshots = this.dashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );
                    this.currentDashboardSnapshots = this.currentDashboardSnapshots.filter(
                        dsp => dsp.id != id
                    );

                    console.log('deleteDashboardSnapshot DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSnapshot FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getDashboardThemes(): Promise<DashboardTheme[]> {
        // Description: Gets all Th
        // Returns: this.dashboardThemes array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardThemes ...');

        let url: string = 'dashboardThemes';
        this.filePath = './assets/data.dashboardThemes.json';

        return new Promise<DashboardTheme[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dashboardThemes.length == 0)  ||  (this.isDirtyDashboardThemes) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardThemes = data;
                        this.isDirtyDashboardThemes = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardThemes 1', this.dashboardThemes)
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

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasources = data;
                        this.isDirtyDatasources = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        this.datasources.forEach(ds => {
                            // TODO - remove this, currently datalib reads array as string 'a,b,c'
                            let f: string = ds.dataFields.toString();
                            let fN: string[] = f.split(',');
                            ds.dataFields = fN;
                            let t: string = ds.dataFieldTypes.toString();
                            let fT: string[] = t.split(',');
                            ds.dataFieldTypes = fT;
                            let l: string[] = ds.dataFieldLengths.toString().split(',');
                            let fL: number[] = [];
                            for (var i = 0; i < l.length; i++) {
                                fL.push(+l[i]);
                            };
                            ds.dataFieldLengths = fL;
                        });


                        console.log('Global-Variables getDatasources 1', this.datasources)
                        resolve(this.datasources);
                    });
            } else {
                console.log('Global-Variables getDatasources 2')
                resolve(this.datasources);
            }
        });

    }

    getCurrentDatasources(dashboardID: number): Promise<Datasource[]> {
        // Description: Gets DS for current D
        // Params: dashboardID = current D
        // Returns: this.datasources array, unless:
        //   If not cached or if dirty, get from File
        // NB: assume this.currentWidgets exists !!
        console.log('Global-Variables getCurrentDatasources ...');

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<Datasource[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            // TODO - What if databoards empty or diry - is that okay?
            if ( (this.datasources.length == 0)  ||  (this.isDirtyDatasources) ) {
                this.getDatasources()
                    .then(ds =>
                        {
                            let datasourceIDs: number[] = [];
                            let dashboardWidgets: Widget[] = this.widgets.filter(
                                w => w.dashboardID == dashboardID
                            );

                            for (var i = 0; i < dashboardWidgets.length; i++) {
                                if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {
                                    console.log('xx id', dashboardWidgets[i].datasourceID)
                                    if (dashboardWidgets[i].datasourceID != null) {
                                        datasourceIDs.push(dashboardWidgets[i].datasourceID)
                                    };
                                }
                            };
                            let returnData: Datasource[] = [];
                            for (var i = 0; i < ds.length; i++) {
                                if (datasourceIDs.indexOf(ds[i].id) >= 0) {
                                    if (ds[i] != null) {
                                        returnData.push(ds[i]);
                                    };
                                };
                            };
                            
                            this.isDirtyDatasources = false;
                            this.currentDatasources = returnData;
                            this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                            console.log('Global-Variables getCurrentDatasources 1',
                                dashboardID, this.currentDatasources);
                            resolve(this.currentDatasources);
                        }
                    )
            } else {
                let datasourceIDs: number[] = [];
                let dashboardWidgets: Widget[] = this.widgets.filter(
                    w => w.dashboardID == dashboardID
                );

                for (var i = 0; i < dashboardWidgets.length; i++) {
                    if (datasourceIDs.indexOf(dashboardWidgets[i].datasourceID) < 0) {
                        if (dashboardWidgets[i].datasourceID != null) {
                            datasourceIDs.push(dashboardWidgets[i].datasourceID)
                        };
                    };
                };
                let returnData: Datasource[] = [];
                for (var i = 0; i < this.datasources.length; i++) {
                    if (datasourceIDs.indexOf(this.datasources[i].id) >= 0) {
                        returnData.push(this.datasources[i]);
                    };
                };

                this.isDirtyDatasources = false;
                this.currentDatasources = returnData;
                this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                console.log('Global-Variables getCurrentDatasources 2', dashboardID,
                    this.currentDatasources);
                resolve(this.currentDatasources);
            }
        });
    }

    addDatasource(data: Datasource): Promise<any> {
        // Description: Adds a new Datasource, if it does not exist
        // Returns: Added Data or error message
        console.log('Global-Variables addDatasource ...', data.id);

        let url: string = 'datasources';
        this.filePath = './assets/data.datasources.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {
                    
                    // Update Global vars to make sure they remain in sync
                    let newDS: Datasource = JSON.parse(JSON.stringify(res))
                    if (this.datasources.filter(i => i.id == newDS.id).length == 0) {
                        this.datasources.push(newDS);
                    };
                    if (this.currentDatasources.filter(i => i.id == newDS.id).length == 0) {
                        this.currentDatasources.push(newDS);
                    };

                    // Inform that we now at a DS
                    this.hasDatasources.next(true);
                    
                    console.log('addDatasource ADDED', res, 
                        this.currentDatasources, this.datasources)

                    resolve(res);
                },
                err => {
                    console.log('Error addDatasource FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteCurrentDatasource(id: number) {
        // Delete current DS
        console.log('Global-Variables deleteCurrentDatasource', id, this.currentDatasources)

        let index: number = -1;
        for (var i = 0; i < this.currentDatasources.length; i++) {
            if (this.currentDatasources[i].id == id) {
                index = i;
            };
        };
        if (index != -1) {
            this.currentDatasources.splice(index,1)
        };

        console.log('Global-Variables deleteCurrentDatasource end', this.currentDatasources)

    }

    getTransformations(): Promise<Transformation[]> {
        // Description: Gets all Tr
        // Returns: this.transformations array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getTransformations ...');

        let url: string = 'transformations';
        this.filePath = './assets/data.transformations.json';

        return new Promise<Transformation[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.transformations.length == 0)  ||  (this.isDirtyTransformations) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.transformations = data;
                        this.isDirtyTransformations = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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

        let url: string = 'transformations';
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
                        resolve(this.currentTransformations);
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
                resolve(this.currentTransformations);
            });
        };
    }

    getDataQualityIssues(): Promise<DataQualityIssue[]> {
        // Description: Gets all dQual
        // Returns: this.dataQualityIssues array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDataQualityIssues ...');

        let url: string = 'dataQualityIssues';
        this.filePath = './assets/data.dataQualityIssues.json';

        return new Promise<DataQualityIssue[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.dataQualityIssues.length == 0)  ||  (this.isDirtyDataQualityIssues) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dataQualityIssues = data;
                        this.isDirtyDataQualityIssues = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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

        let url: string = 'dataQualityIssues';
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
                        resolve(this.currentDataQualityIssues);
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
                resolve(this.currentDataQualityIssues);
            });
        };
    }

    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDatasourcePermissions ...');

        let url: string = 'datasourcePermissions';
        this.filePath = './assets/data.datasourcePermissions.json';

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePermissions.length == 0)  ||  (this.isDirtyDatasourcePermissions) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePermissions = data;
                        this.isDirtyDatasourcePermissions = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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

        let url: string = 'datasourcePermissions';
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
                        resolve(this.currentDatasourcePermissions);
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
                resolve(this.currentDatasourcePermissions);
            });
        };

    }

    deleteDatasourcePermission(id: number) {
        // Remove a record from the global and current DatasourcePermissions
        console.log('Global-Variables deleteDatasourcePermission ...', id);

        console.log('xx GV Perms pre', this.datasourcePermissions, this.currentDatasourcePermissions)
        
        this.datasourcePermissions = this.datasourcePermissions.filter(
            dsp => dsp.id != id
        );
        this.currentDatasourcePermissions = this.currentDatasourcePermissions.filter(
            dsp => dsp.id != id
        );

        console.log('xx GV Perms', this.datasourcePermissions, this.currentDatasourcePermissions)
    }

    getDatasourcePivots(): Promise<DatasourcePivot[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePivots array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDatasourcePivots ...');

        let url: string = 'datasourcePivots';
        this.filePath = './assets/data.datasourcePivots.json';

        return new Promise<DatasourcePivot[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.datasourcePivots.length == 0)  ||  (this.isDirtyDatasourcePivots) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.datasourcePivots = data;
                        this.isDirtyDatasourcePivots = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
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

        let url: string = 'datasourcePivots';
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
                        resolve(this.currentDatasourcePivots);
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
                resolve(this.currentDatasourcePivots);
            });
        };

    }

    getSystemSettings(): Promise<CanvasSettings> {
        // Description: Gets system settings
        // Returns: this.canvasSettings object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getSystemSettings ...');

        let url: string = 'canvasSettings';
        this.filePath = './assets/data.canvasSettings.json';

        return new Promise<CanvasSettings>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyCanvasSettings) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasSettings = data;

                        // Load global Vars
                        // TODO - create glob vars when needed, or delete totally
                        this.canvasSettings.companyName = data.companyName;
                        this.canvasSettings.companyLogo = data.companyLogo;
                        this.canvasSettings.dashboardTemplate = data.dashboardTemplate;
                        this.canvasSettings.offlineData = data.offlineData;
                        this.canvasSettings.offlineSchema = data.offlineSchema;
                        this.canvasSettings.offlineLogin = data.offlineLogin;
                        this.canvasSettings.maxTableLength = data.maxTableLength;
                        this.canvasSettings.widgetsMinZindex = data.widgetsMinZindex;
                        this.canvasSettings.widgetsMaxZindex = data.widgetsMaxZindex;
                        this.canvasSettings.gridSize = data.gridSize;
                        this.canvasSettings.snapToGrid = data.snapToGrid;
                        this.canvasSettings.printDefault = data.printDefault;
                        this.canvasSettings.printSize = data.printSize;
                        this.canvasSettings.printLayout = data.printLayout;
                        this.canvasSettings.notInEditModeMsg = data.notInEditModeMsg;
                        this.canvasSettings.noQueryRunningMessage = data.noQueryRunningMessage;
                        this.canvasSettings.queryRunningMessage = data.queryRunningMessage;
                        
                        this.isDirtyCanvasSettings = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getSystemSettings 1', this.canvasSettings)
                        resolve(this.canvasSettings);
                    });
            } else {
                console.log('Global-Variables getSystemSettings 2', this.canvasSettings)
                resolve(this.canvasSettings);
            }
        });

    }

    saveSystemSettings(data: CanvasSettings): Promise<string> {
        // Description: Saves system settings
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveSystemSettings ...');

        let url: string = 'canvasSettings';
        this.filePath = './assets/data.canvasSettings.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {

                    this.canvasSettings = JSON.parse(JSON.stringify(data));
                    console.log('saveSystemSettings SAVED')
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveSystemSettings FAILED');;
                    resolve(err.Message.toString());
                }
            )
        });
    }

    getUserPreferences(): Promise<UserPreferences> {
        // Description: Gets userPreferences 
        // Returns: this.userPreferences object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getUserPreferences ...');

        let url: string = 'userPreferences';
        this.filePath = './assets/data.userPreferences.json';

        return new Promise<UserPreferences>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyUserPreferences) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(res => {
                        this.userPreferences = res;

                        // Load global Vars
                        // this.userPreferences.preferenceAutoSync = data.preferenceAutoSync;
                        // this.userPreferences.preferenceShowOpenStartupMessage = data.preferenceShowOpenStartupMessage;
                        // this.userPreferences.preferenceShowOpenDataCombinationMessage = data.preferenceShowOpenDataCombinationMessage;
                        // this.userPreferences.preferenceShowViewStartupMessage = data.preferenceShowViewStartupMessage;
                        // this.userPreferences.preferenceShowDiscardStartupMessage = data.preferenceShowDiscardStartupMessage;
                        // this.userPreferences.preferenceDefaultTemplate = data.preferenceDefaultTemplate;
                        // this.userPreferences.preferenceDefaultDateformat = data.preferenceDefaultDateformat;
                        // this.userPreferences.preferenceDefaultFolder = data.preferenceDefaultFolder;
                        // this.userPreferences.preferenceDefaultPrinter = data.preferenceDefaultPrinter;
                        // this.userPreferences.preferenceDefaultPageSize = data.preferenceDefaultPageSize;
                        // this.userPreferences.preferenceDefaultPageLayout = data.preferenceDefaultPageLayout;
                        this.isDirtyUserPreferences = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getUserPreferences 1', this.userPreferences)
                        resolve(this.userPreferences);
                    });
            } else {
                console.log('Global-Variables getUserPreferences 2', this.userPreferences)
                resolve(this.userPreferences);
            }
        });

    }

    saveUserPreferences(data: UserPreferences): Promise<string> {
        // Description: Saves userPreferences
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveUserPreferences ...');

        let url: string = 'userPreferences';
        this.filePath = './assets/data.userPreferences.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                res => {
                    this.userPreferences = JSON.parse(JSON.stringify(res));
                    console.log('saveUserPreferences SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveUserPreferences FAILED');;
                    resolve(err.Message.toString());
                }
            )
        });
    }

    getDashboardSubscriptions(): Promise<DashboardSubscription[]> {
        // Description: Gets dashboardSubscriptions 
        // Returns: this.dashboardSubscriptions object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSubscription ...');

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<DashboardSubscription[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyDashboardSubscription) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.dashboardSubscriptions = data;

                        this.isDirtyDashboardSubscription = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardSubscription 1', this.dashboardSubscriptions)
                        resolve(this.dashboardSubscriptions);
                    });
            } else {
                console.log('Global-Variables getDashboardSubscription 2', this.dashboardSubscriptions)
                resolve(this.dashboardSubscriptions);
            }
        });

    }

    getCurrentDashboardSubscriptions(dashboardID: number): Promise<DashboardSubscription[]> {
        // Description: Gets currentDashboardSubscription 
        // Returns: this.currentDashboardSubscription object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getDashboardSubscription ...');

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<DashboardSubscription[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyDashboardSubscription) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.getDashboardSubscriptions()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );

                        this.currentDashboardSubscriptions = data;

                        this.isDirtyDashboardSubscription = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getDashboardSubscription 1', this.currentDashboardSubscriptions)
                        resolve(this.currentDashboardSubscriptions);
                    });
            } else {
                console.log('Global-Variables getDashboardSubscription 2', this.currentDashboardSubscriptions)
                resolve(this.currentDashboardSubscriptions);
            }
        });

    }

    saveDashboardSubscription(data: DashboardSubscription): Promise<string> {
        // Description: Saves DashboardSubscription
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveDashboardSubscription ...');

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                data => {
                    console.log('saveDashboardSubscription SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    addDashboardSubscription(data: DashboardSubscription): Promise<any> {
        // Description: Adds a new DashboardSubscription
        // Returns: Added Data or error message
        console.log('Global-Variables addDashboardSubscription ...', data.id);

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    this.dashboardSubscriptions.push(JSON.parse(JSON.stringify(data)));
                    this.currentDashboardSubscriptions.push(JSON.parse(JSON.stringify(data)));
                    console.log('addDashboardSubscription ADDED', data)
                    resolve(data);
                },
                err => {
                    console.log('Error addDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteDashboardSubscription(id: number): Promise<string> {
        // Description: Deletes a DashboardSubscription
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteDashboardSubscription ...', id);

        let url: string = 'dashboardSubscriptions';
        this.filePath = './assets/data.dashboardSubscriptions.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
                    
                    this.dashboardSubscriptions = this.dashboardSubscriptions.
                        filter(sub => sub.id != id);
                    this.currentDashboardSubscriptions = this.currentDashboardSubscriptions.
                        filter(sub => sub.id != id);
                    console.log('deleteDashboardSubscription DELETED', id, data, this.dashboardSubscriptions, this.currentDashboardSubscriptions)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteDashboardSubscription FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getPaletteButtonBar(): Promise<PaletteButtonBar[]> {
        // Description: Gets currentgetPaletteButtonBar 
        // Returns: this.currentgetPaletteButtonBar object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getPaletteButtonBar ...');

        let url: string = 'paletteButtonBars';
        this.filePath = './assets/data.paletteButtonBars.json';

        return new Promise<PaletteButtonBar[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonBar) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.currentPaletteButtonBar = data;

                        this.isDirtyPaletteButtonBar = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getPaletteButtonBar 1', this.currentPaletteButtonBar)
                        resolve(this.currentPaletteButtonBar);
                    });
            } else {
                console.log('Global-Variables getPaletteButtonBar 2', this.currentPaletteButtonBar)
                resolve(this.currentPaletteButtonBar);
            }
        });

    }

    savePaletteButtonBar(data: PaletteButtonBar): Promise<string> {
        // Description: Saves PaletteButtonBar
        // Returns: 'Saved' or error message
        console.log('Global-Variables savePaletteButtonBar ...');

        let url: string = 'paletteButtonBars';
        this.filePath = './assets/data.paletteButtonBars.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                data => {
                    console.log('savePaletteButtonBar SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error savePaletteButtonBar FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getPaletteButtonsSelected(): Promise<PaletteButtonsSelected[]> {
        // Description: Gets currentgetPaletteButtonsSelected 
        // Returns: this.currentgetPaletteButtonsSelected object, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getPaletteButtonsSelected ...');

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<PaletteButtonsSelected[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if (this.isDirtyPaletteButtonsSelected) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.currentPaletteButtonsSelected.next(data);

                        this.isDirtyPaletteButtonsSelected = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                        console.log('Global-Variables getPaletteButtonsSelected 1', 
                            this.currentPaletteButtonsSelected.value);
                        resolve(this.currentPaletteButtonsSelected.value);
                    });
            } else {
                console.log('Global-Variables getPaletteButtonsSelected 2', 
                    this.currentPaletteButtonsSelected.value);

                resolve(this.currentPaletteButtonsSelected.value);
            }
        });

    }

    savePaletteButtonsSelected(data: PaletteButtonsSelected): Promise<string> {
        // Description: Saves PaletteButtonsSelected
        // Returns: 'Saved' or error message
        console.log('Global-Variables savePaletteButtonsSelected ...');

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                data => {
                    console.log('savePaletteButtonsSelected SAVED', data)
                    resolve('Saved');
                },
                err => {
                    console.log('Error savePaletteButtonsSelected FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deletePaletteButtonsSelected(id: number): Promise<string> {
        // Description: Deletes a PaletteButtonsSelected
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deletePaletteButtonsSelected ...', id);

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                res => {

                    // This is a different case: currentPaletteButtonsSelected is an 
                    // Observable, and will be refreshed with a .next by the calling
                    // routine
                    let dID: number = -1;
                    for (var i = 0; i < this.currentPaletteButtonsSelected.value.length; i++) {
                        console.log('xx i ', i, this.currentPaletteButtonsSelected.value.length)
                        if (this.currentPaletteButtonsSelected.value[i].id == id) {
                            dID = i;
                            break;
                        };
                    };
                    if (dID >=0) {
                        this.currentPaletteButtonsSelected.value.splice(dID, 1);
                    };

                    // Inform subscribers
                    this.currentPaletteButtonsSelected.next(
                        this.currentPaletteButtonsSelected.value
                    );

        console.log('deletePaletteButtonsSelected DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deletePaletteButtonsSelected FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    addPaletteButtonsSelected(data: PaletteButtonsSelected): Promise<any> {
        // Description: Adds a new PaletteButtonsSelected
        // Returns: Added Data or error message
        console.log('Global-Variables addPaletteButtonsSelected ...', data.id);

        let url: string = 'paletteButtonsSelecteds';
        this.filePath = './assets/data.paletteButtonsSelecteds.json';


        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
                .subscribe(
                    res => {

                        // Update Global vars to make sure they remain in sync
                        this.currentPaletteButtonsSelected.value.push(JSON.parse(JSON.stringify(res)));
                      
                        // Inform subscribers
                        this.currentPaletteButtonsSelected.next(
                            this.currentPaletteButtonsSelected.value
                        );

                        console.log('addWidget ADDED', data, this.widgets)
    
                        resolve(data);
                    },
                    err => {
                        console.log('Error addDashboardSubscription FAILED', err);;
                        resolve(err.Message);
                    }
                )
        });
    }

    getWidgets(): Promise<Widget[]> {
        // Description: Gets all W
        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getWidgets ...', this.widgets.length);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<Widget[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.widgets = data.filter(d => (!d.isTrashed) );
                        // TODO - fix hardcoding, issue with datalib jsonTree
                        this.widgets.forEach(w => {

                            // Get Checkpoint info for ALL W, not only current one
                            // TODO - fix when using DB
                            let tempChk: WidgetCheckpoint[] = this.widgetCheckpoints
                                .filter(wc => 
                                    wc.dashboardID == w.dashboardID
                                    &&
                                    wc.widgetID == w.id
                            );

                            if (tempChk.length > 0) {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = tempChk.length - 1;
                                
                                for (var x = 0; x < tempChk.length; x++) {
                                    w.checkpointIDs.push(tempChk[x].id);
                                };

                            } else {
                                w.showCheckpoints = false;
                                w.checkpointIDs = [];
                                w.currentCheckpoint = 0;
                                w.lastCheckpoint = -1;
                            };
                            
                            // Get bullets
                            // TODO - fix when using DB
                            if (w.widgetType == 'Shape') {
                                let b: string = w.shapeBullets.toString();
                                w.shapeBullets = b.split(',');
                            };

                            // TODO - this does NOT work in datalib: if the first dashboardTabIDs
                            // = "a,b,c", then all works.  Else, it gives a big number 1046785...
                            // irrespective ...
                            if (w.dashboardTabIDs != null) {
                                // re = regEx
                                var re = /t/gi;
                                let d: string = w.dashboardTabIDs.toString();
                                d = d.replace(re, '');
                                let dA: string[] = d.split(',');
                                w.dashboardTabIDs = [];
                                dA.forEach(da => w.dashboardTabIDs.push(+da));
                            }

                            // TODO - fix when using DB
                            // Update slicerSelection
                            if (w.slicerSelection != null) {
                                let s: string = w.slicerSelection.toString();
                                let sF: string[] = s.split(',');
                                let sO: {isSelected: boolean; fieldValue: string}[] = [];
                                let i: number = 0;
                                let oSel: boolean;
                                let oFld: string;
                                w.slicerSelection = [];
                                sF.forEach(s => {
                                    i = i + 1;
                                    if (i == 1) {
                                        oSel = (s == 'true');
                                    } else {
                                        oFld = s;
                                        i = 0;
                                        let o: {isSelected: boolean; fieldValue: string} = 
                                            {isSelected: oSel, fieldValue: oFld};
                                        w.slicerSelection.push(o);
                                    }
                                })
                            };

                            // TODO - fix when using DB
                            // Update slicerBins
                            if (w.slicerBins != null) {
                                let s: string = w.slicerBins.toString();
                                let sF: string[] = s.split(',');
                                let sO: {
                                    isSelected: boolean; name: string; fromValue: number; toValue: number
                                }[] = [];
                                let i: number = 0;
                                let oSel: boolean;
                                let oName: string;
                                let oFrom: number;
                                let oTo: number;
                                w.slicerBins = [];
                                sF.forEach(s => {
                                    i = i + 1;
                                    if (i == 1) {
                                        oSel = (s == 'true');
                                    };
                                    if (i == 2) {
                                        oName = s;
                                    };
                                    if (i == 3) {
                                        oFrom = +s;
                                    };
                                    if (i == 4) {
                                        oTo  = +s;
                                        i = 0;
                                        let o: {isSelected: boolean; name: string; fromValue: number; toValue: number} = 
                                            {isSelected: oSel, name: oName, fromValue: oFrom, toValue: oTo};
                                            
                                        w.slicerBins.push(o);
                                    }
                                })
                            };
                        });

                        this.isDirtyWidgets = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getWidgets 1', this.widgets)
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
        if ( (this.widgets.length == 0)  ||  (this.isDirtyWidgets) ) {
            return new Promise<Widget[]>((resolve, reject) => {
                this.getWidgets()
                    .then(data => {

                        // Filter the widgets
                        // TODO - use i.dashboardTabIDs.indexOf(dashboardTabID) >= 0 once datalib
                        // reads arrays correctly.  That should be the only change ...
                        data = data.filter(
                            i => (i.dashboardID == dashboardID)  
                                 &&
                                 (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                                 &&  
                                 (!i.isTrashed)
                        );
                        this.currentWidgets = data;

                        console.log('Global-Variables getCurrentWidgets 1', this.currentWidgets)
                        resolve(this.currentWidgets);
                })
             })
        } else {
            return new Promise<Widget[]>((resolve, reject) => {

                // Filter all Tabs belonging to this D
                let data: Widget[];
                data = this.widgets.filter(
                    i => (i.dashboardID == dashboardID)  
                    &&
                    (i.dashboardTabIDs.indexOf(dashboardTabID) >= 0)
                    &&  
                    (!i.isTrashed)
                )

                this.currentWidgets = data;
                console.log('Global-Variables getCurrentWidgets 2', dashboardID, 
                    dashboardTabID,  this.currentWidgets, this.widgets)
                resolve(this.currentWidgets);

            });
        };

    }

    addWidget(data: Widget): Promise<any> {
        // Description: Adds a new Widget
        // Returns: Added Data or error message
        console.log('Global-Variables addWidget ...', data.id);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.widgets.push(JSON.parse(JSON.stringify(data)));
                    this.currentWidgets.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addWidget ADDED', data, this.widgets)

                    resolve(data);
                },
                err => {
                    console.log('Error addWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteWidget(id: number): Promise<string> {
        // Description: Deletes a Widgets
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteWidget ...', id);

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    this.widgets = this.widgets.filter(
                        w => w.id != id
                    );
                    this.currentWidgets = this.currentWidgets.filter(
                        w => w.id != id
                    );

                    console.log('deleteWidget DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    saveWidget(data: Widget): Promise<string> {
        // Description: Saves Widget
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveWidget ...');

        let url: string = 'widgets';
        this.filePath = './assets/data.widgets.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {
                    // Update widgets and currentWidgets
                    this.widgetReplace(data);           
                                     
                    console.log('saveWidget SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveWidget FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getWidgetsInfo(): Promise<boolean> {
        // Description: Gets data and other info for [W]
        // Returns: this.datasets, currentDataset array
        // NB: this assumes [W] and [datasets] are available !!
        console.log('Global-Variables getWidgetsInfo ...');

        // Empty the necessary
        let dsCurrIDs: number[] = [];       // Current Dataset IDs
        let promiseArray = [];

        // Get list of dSet-ids to make array work easier
        this.currentDatasets.forEach(d => dsCurrIDs.push(d.id));

        return new Promise(async (resolve, reject) => {

            // Construct array with correct datasetIDs
            this.currentWidgets.forEach(w => {

                // Only get data from Graphs and Text boxes
                // if ( (w.widgetType == 'Graph'  ||  w.widgetType == 'Shape')  &&
                //     (w.datasourceID >= 0) ) {
                if (w.datasourceID != null  &&  w.datasetID != null) {

                    // Build array of promises, each getting data for 1 widget if not store already
                    if (dsCurrIDs.indexOf(w.datasetID) < 0) {

                        // Get the latest datasetID (when -1 is stored on W)
                        if (w.datasetID == -1) {
                            let ds: number[]=[];

                            for (var i = 0; i < this.datasets.length; i++) {
                                if(this.datasets[i].datasourceID == w.datasourceID) {
                                    ds.push(this.datasets[i].id)
                                }
                            };
                            if (ds.length > 0) {
                                w.datasetID = Math.max(...ds);
                            };
                        };

                        // Remember, AFTER latest was found
                        dsCurrIDs.push(w.datasetID);
                        console.log('xx allS 0', this.currentDatasets.slice())

                        promiseArray.push(this.getCurrentDataset(w.datasourceID, w.datasetID));
                    };
                }
            });

            // // Return if nothing to be done, means all data already good
            // if (promiseArray.length = 0) {
            //     // TODO - better error handling
            //     console.log('                        is EMPTy, so Nothing to resolve');
            //     resolve(true)
            // };

            // Get all the dataset to local vars
            this.allWithAsync(...promiseArray)
                .then(resolvedData => {
console.log('xx allS 1', this.currentDatasets.slice())
                    // Filter currentDatasets by Sl linked to DS
                    this.currentDatasets.forEach(cd => {
                        // TODO - improve
                        // this.filterSlicer(cd);  
                    })
                    console.log('xx allS 2', this.currentDatasets.slice())

                    // Add data to widget
                    // TODO - url = this.filePath for localDB ...
                    // this.currentWidgets.forEach(w => {
                    //     w.graphUrl = "";
                    //     let ds: Dataset[] = this.currentDatasets.filter(
                    //         i => i.id == w.datasetID
                    //     );
                    //     if (ds.length > 0) {
                    //         w.graphData = ds[0].data;
                    //     } else {
                    //         w.graphData = null;
                    //     }

                    // });

                    console.log('Global-Variables getWidgetsInfo 1 True');
                    resolve(true);
                },
                rejectionReason => console.log('reason:', rejectionReason) // reason: rejected!
            );
        });
    }

    allWithAsync = (...listOfPromises) => {
        // Resolve all promises in array
        console.log('Global-Variables allWithAsync ...');

        return new Promise(async (resolve, reject) => {
            let results = []
            if (listOfPromises.length == 0) {
                resolve(true);
            } else {
                for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
                    results.push(await promise.then(async resolvedData => await resolvedData, reject))
                    if (results.length === listOfPromises.length) resolve(results)
                }
            }
        })
    }

    getBackgroundColors(): Promise<CSScolor[]> {
        // Description: Gets all Background colors
        // Returns: this.backgroundcolors array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getBackgroundColors ...', this.backgroundcolors.length);

        let url: string = 'canvasBackgroundcolors';
        this.filePath = './assets/settings.backgroundcolors.json';

        return new Promise<CSScolor[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.backgroundcolors.length == 0)  ||  (this.isDirtyBackgroundColors) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.backgroundcolors = data.filter(d => (!d.isTrashed) );

                        this.isDirtyBackgroundColors = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getBackgroundColors 1', this.backgroundcolors)
                        resolve(this.backgroundcolors);
                    });
            } else {
                console.log('Global-Variables getBackgroundColors 2', this.backgroundcolors)
                resolve(this.backgroundcolors);
            }
        });

    }

    getCanvasActivities(): Promise<CanvasActivity[]> {
        // Description: Gets all Canvas Activities
        // Returns: this.canvasactivities array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasActivities ...', this.canvasActivities.length);

        let url: string = 'canvasActivities';
        this.filePath = './assets/settings.canvasActivities.json';

        return new Promise<CanvasActivity[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasActivities.length == 0)  ||  (this.isDirtyCanvasActivities) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasActivities = data.filter(d => (!d.isTrashed) );

                        this.isDirtyCanvasActivities = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasActivities 1', this.canvasActivities)
                        resolve(this.canvasActivities);
                    });
            } else {
                console.log('Global-Variables getCanvasActivities 2', this.canvasActivities)
                resolve(this.canvasActivities);
            }
        });

    }

    getCanvasAlerts(): Promise<CanvasAlert[]> {
        // Description: Gets all Canvas Alerts
        // Returns: this.canvasalerts array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasAlerts ...', this.canvasAlerts.length);

        let url: string = 'canvasAlerts';
        this.filePath = './assets/settings.canvasAlerts.json';

        return new Promise<CanvasAlert[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasAlerts.length == 0)  ||  (this.isDirtyCanvasAlerts) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasAlerts = data.filter(d => (!d.isTrashed) );

                        this.isDirtyCanvasAlerts = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasAlerts 1', this.canvasAlerts)
                        resolve(this.canvasAlerts);
                    });
            } else {
                console.log('Global-Variables getCanvasAlerts 2', this.canvasAlerts)
                resolve(this.canvasAlerts);
            }
        });

    }

    getCanvasComments(): Promise<CanvasComment[]> {
        // Description: Gets all Canvas Comments
        // Returns: this.canvasComments array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasComments ...', this.canvasComments.length);

        let url: string = 'canvasComments';
        this.filePath = './assets/settings.canvasComments.json';

        return new Promise<CanvasComment[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasComments.length == 0)  ||  (this.isDirtyCanvasComments) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasComments = data.filter(d => (!d.isTrashed) );

                        this.isDirtyCanvasComments = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasComments 1', this.canvasComments)
                        resolve(this.canvasComments);
                    });
            } else {
                console.log('Global-Variables getCanvasComments 2', this.canvasComments)
                resolve(this.canvasComments);
            }
        });

    }

    addCanvasComment(data: CanvasComment): Promise<any> {
        // Description: Adds a new canvasComment
        // Returns: Added Data or error message
        console.log('Global-Variables addCanvasComment ...', data.id);

        let url: string = 'canvasComments';
        this.filePath = './assets/data.CanvasComments.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.canvasComments.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addCanvasComment ADDED', data, this.canvasComments, this.canvasComments)

                    resolve(data);
                },
                err => {
                    console.log('Error addCanvasComment FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteCanvasComment(id: number): Promise<string> {
        // Description: Deletes a canvasComments
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteCanvasComment ...', id);

        let url: string = 'canvasComments';
        this.filePath = './assets/data.CanvasComments.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
   
                    this.canvasComments = this.canvasComments.filter(
                        com => com.id != id
                    );

                    console.log('deleteCanvasComment DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteCanvasComment FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getCanvasMessages(): Promise<CanvasMessage[]> {
        // Description: Gets all Canvas Messages
        // Returns: this.canvasMessages array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasMessages ...', this.canvasMessages.length);

        let url: string = 'canvasMessages';
        this.filePath = './assets/settings.canvasMessages.json';

        return new Promise<CanvasMessage[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasMessages.length == 0)  ||  (this.isDirtyCanvasMessages) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasMessages = data.filter(d => (!d.isTrashed) );

                        this.isDirtyCanvasMessages = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasMessages 1', this.canvasMessages)
                        resolve(this.canvasMessages);
                    });
            } else {
                console.log('Global-Variables getCanvasMessages 2', this.canvasMessages)
                resolve(this.canvasMessages);
            }
        });

    }

    deleteCanvasMessage(id: number): Promise<string> {
        // Description: Deletes a canvasMessages
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteCanvasMessage ...', id);

        let url: string = 'canvasMessages';
        this.filePath = './assets/data.CanvasMessages.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {
   
                    this.canvasMessages = this.canvasMessages.filter(
                        com => com.id != id
                    );

                    console.log('deleteCanvasMessage DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteCanvasMessage FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    getWidgetCheckpoints(): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Canvas Messages
        // Returns: this.widgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getWidgetCheckpoints ...', this.widgetCheckpoints.length);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/settings.widgetCheckpoints.json';

        return new Promise<WidgetCheckpoint[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.widgetCheckpoints = data.filter(d => (!d.isTrashed) );

                        this.isDirtyWidgetCheckpoints = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getWidgetCheckpoints 1', this.widgetCheckpoints)
                        resolve(this.widgetCheckpoints);
                    });
            } else {
                console.log('Global-Variables getWidgetCheckpoints 2', this.widgetCheckpoints)
                resolve(this.widgetCheckpoints);
            }
        });

    }
    
    getCurrentWidgetCheckpoints(dashboardID: number): Promise<WidgetCheckpoint[]> {
        // Description: Gets all Checkpoints for current D
        // Returns: this.currentWidgetCheckpoints array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCurrentWidgetCheckpoints ...');

        // Refresh from source at start, or if dirty
        if ( (this.widgetCheckpoints.length == 0)  ||  (this.isDirtyWidgetCheckpoints) ) {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                this.getWidgetCheckpoints()
                    .then(data => {
                        data = data.filter(
                            i => i.dashboardID == dashboardID
                        );
                        this.currentWidgetCheckpoints = data;
                        console.log('Global-Variables getCurrentWidgetCheckpoints 1', dashboardID, data)
                        resolve(this.currentWidgetCheckpoints);

                })
             })
        } else {
            return new Promise<WidgetCheckpoint[]>((resolve, reject) => {
                let returnData: WidgetCheckpoint[];
                returnData = this.widgetCheckpoints.filter(
                    i => i.dashboardID == dashboardID
                );
                this.currentWidgetCheckpoints = returnData;
                console.log('Global-Variables getCurrentWidgetCheckpoints 2', dashboardID, returnData)
                resolve(this.currentWidgetCheckpoints);
            });
        };

    }

    addWidgetCheckpoint(data: WidgetCheckpoint): Promise<any> {
        // Description: Adds a new WidgetCheckpoint
        // Returns: Added Data or error message
        console.log('Global-Variables addWidgetCheckpoint ...', data.id);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/data.widgetCheckpoints.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.post('http://localhost:3000/' + url, data, {headers})
            .subscribe(
                data => {
                    
                    // Update Global vars to make sure they remain in sync
                    this.widgetCheckpoints.push(JSON.parse(JSON.stringify(data)));
                    this.currentWidgetCheckpoints.push(JSON.parse(JSON.stringify(data)));
                    
                    console.log('addWidgetCheckpoint ADDED', data, this.currentWidgetCheckpoints, this.widgetCheckpoints)

                    resolve(data);
                },
                err => {
                    console.log('Error addWidgetCheckpoint FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    deleteWidgetCheckpoint(id: number): Promise<string> {
        // Description: Deletes a WidgetCheckpoints
        // Returns: 'Deleted' or error message
        console.log('Global-Variables deleteWidgetCheckpoint ...', id);

        let url: string = 'widgetCheckpoints';
        this.filePath = './assets/data.widgetCheckpoints.json';

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.delete('http://localhost:3000/' + url + '/' + id, {headers})
            .subscribe(
                data => {

                    // Update vars
                    this.widgetCheckpoints = this.widgetCheckpoints.filter(
                        chk => chk.id != id
                    );
                    this.currentWidgetCheckpoints = this.currentWidgetCheckpoints.filter(
                        chk => chk.id != id
                    );

                    console.log('deleteWidgetCheckpoint DELETED id: ', id)
                    resolve('Deleted');
                },
                err => {
                    console.log('Error deleteWidgetCheckpoint FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

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

    getCanvasUsers(): Promise<CanvasUser[]> {
        // Description: Gets all Canvas Users
        // Returns: this.users array, unless:
        //   If not cached or if dirty, get from File
        console.log('Global-Variables getCanvasUsers ...');

        let url: string = 'canvasUsers';
        this.filePath = './assets/data.canvasUsers.json';

        return new Promise<CanvasUser[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            if ( (this.canvasUsers.length == 0)  ||  (this.isDirtyUsers) ) {
                this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);
                this.get(url)
                    .then(data => {
                        this.canvasUsers = data;
                        this.isDirtyUsers = false;
                        this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                        console.log('Global-Variables getCanvasUsers 1', this.canvasUsers)
                        resolve(this.canvasUsers);
                    });
            } else {
                console.log('Global-Variables getCanvasUsers 2', this.canvasUsers)
                resolve(this.canvasUsers);
            }
        });

    }

    saveCanvasUser(data: CanvasUser): Promise<string> {
        // Description: Saves CanvasUser
        // Returns: 'Saved' or error message
        console.log('Global-Variables saveCanvasUser ...');

        let url: string = 'canvasUsers';
        this.filePath = './assets/data.canvasUsers.json';

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json");

            this.http.put('http://localhost:3000/' + url + '/' + data.id, data, {headers})
            .subscribe(
                res => {
                    // TODO - fix DB
                                     
                    console.log('saveCanvasUser SAVED', res)
                    resolve('Saved');
                },
                err => {
                    console.log('Error saveCanvasUser FAILED', err);;
                    resolve(err.Message);
                }
            )
        });
    }

    get<T>(url: string, options?: any, dashboardID?: number, datasourceID?: number): Promise<any> {
        // Generic GET data, later to be replaced with http
        console.log('Global-Variables get (url, filePath) ...', url, this.filePath);

        // TODO - cleaner switch to http?
        // if (this.filePath == './assets/data.widgets.json') {
        if (this.getSource = 'Test') {
            const params = new HttpParams()
                .set('orderBy', '"dashboardTabID"')
                .set('limitToFirst', "1");
            // const headers = new HttpHeaders()
            //     .set("Content-Type", "application/json");

            // PUT
            // this.http.put("/courses/-KgVwECOnlc-LHb_B0cQ.json",
            // {
            //     "courseListIcon": ".../main-page-logo-small-hat.png",
            //     "description": "Angular Tutorial For Beginners TEST",
            //     "iconUrl": ".../angular2-for-beginners.jpg",
            //     "longDescription": "...",
            //     "url": "new-value-for-url"
            // },
            // {headers})
            // .subscribe(    

            // MULTIPLE
            // const parallel$ = Observable.forkJoin(
            //     this.http.get('/courses/-KgVwEBq5wbFnjj7O8Fp.json'),
            //     this.http.get('/courses/-KgVwECOnlc-LHb_B0cQ.json')
            // );
        
            // parallel$.subscribe(

            // IN SEQUENCE
            // const sequence$ = this.http.get<Course>(
            //     '/courses/-KgVwEBq5wbFnjj7O8Fp.json')
            // .switchMap(course => {
        
            //     course.description+= ' - TEST ';
        
            //     return this.http.put(
            //         '/courses/-KgVwEBq5wbFnjj7O8Fp.json', 
            //         course)
            // });
            // sequence$.subscribe();            

            // PROGRESS
            // const req = new HttpRequest('GET', this.url, {
            //     reportProgress: true
            //   });
          
            //   this.http.request(req).subscribe((event: HttpEvent<any>) => {
            //     switch (event.type) {
            //       case HttpEventType.Sent:
            //         console.log('Request sent!');
            //         break;
            //       case HttpEventType.ResponseHeader:
            //         console.log('Response header received!');
            //         break;
            //       case HttpEventType.DownloadProgress:
            //         const kbLoaded = Math.round(event.loaded / 1024);
            //         console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
            //         break;
            //       case HttpEventType.Response:
            //         console.log('😺 Done!', event.body);
            //     }
            //   });

            return new Promise((resolve, reject) => {
                // this.http.get(this.filePath).subscribe(res => resolve(res));

                // Cater for different Servers
                let finalUrl: string = '';
                if (url == 'widgets') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'dashboardSnapshots') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'widgetCheckpoints') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'data') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else if (url == 'datasets') {
                    finalUrl = 'http://localhost:3000/' + url;
                } else {
                    finalUrl = 'http://localhost:3000/' + url;
                };
                

                this.http.get(finalUrl).subscribe(
                    res => 
                    {
                        resolve(res);
                    },
                    (err: HttpErrorResponse) => {
                        if (err.error instanceof Error) {
                          console.log("Client-side error occured.");
                        } else {
                          console.log("Server-side error occured.");
                        };
                        console.log('ERROR Error',err.error);
                        console.log('ERROR Name',err.name);
                        console.log('ERROR Message',err.message);
                        console.log('ERROR Status',err.status);
                      }
                )}
            );

        };
        
        if (this.getSource == 'File') {
            return new Promise((resolve, reject) => {
                // Get from source - files for now ...
                dl.json({url: this.filePath}, {children: 'graphSpecification'}, (err, currentData) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (options == 'metadata') {}
                        resolve(currentData);
                    }
                    });
                }
            );
        };
    }

    connectLocalDB<T>(): Promise<string | Object> {
        // Connect to the local DB, ie nanaSQL
        console.log('Global-Variables connectLocalDB');

        return new Promise((resolve, reject) => {

            // NB: if you CLEAR the IndexDB in the Browser, and create new records (where
            // pk = null, and props = ai, then it creates a new record for each one already
            // in the DB - true story!
            // TODO - for now, must delete IndexDB in browser, Application when shema changes
            // TODO - add proper error message if it fails

            // Users Table
            nSQL('users')
            .model ([
                {key:'id',type:'int', props:['pk','ai']}, // pk == primary key, ai == auto incriment
                {key:'name',type:'string'},
                {key:'age', type:'int'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })

            // DashboardSnapshot Table
            nSQL('DashboardSnapshot')
            .model ([
                {key:'id', type: 'int', props:['pk', 'ai']},
                {key:'dashboardID', type: 'int'},
                {key:'name', type: 'string'},
                {key:'comment', type: 'string'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewDashboardSnapshot',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getDashboardSnapshotByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])

            // Dataset Table
            nSQL('Dataset')
            .model ([
                {key:'id', type: 'int', props:['pk', 'ai']},
                {key:'datasourceID', type: 'int'},
                {key:'folderName', type: 'string'},
                {key:'fileName', type: 'string'},
                {key:'data', type: 'array'},
                {key:'dataRaw', type: 'array'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewDataset',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getDatasetByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])
            
            // Widgets Table
            nSQL('widgets')
            .model([
                {key: 'widgetType', 				type: 'string'},
                {key: 'widgetSubType', 				type: 'string'},
                {key: 'isTrashed', 					type: 'bool'},
                {key: 'dashboardID', 				type: 'int'},
                {key: 'dashboardTabID', 			type: 'int'},
                {key: 'dashboardTabIDs', 			type: 'array'},
                {key: 'id', 						type: 'int',		props:['pk','ai']},
                {key: 'name', 						type: 'string'},
                {key: 'description', 				type: 'string'},
                {key: 'visualGrammar', 				type: 'string'},
                {key: 'version', 					type: 'int'},
                {key: 'isLiked', 					type: 'bool'},
                {key: 'isSelected', 				type: 'bool'},
                {key: 'nrDataQualityIssues', 		type: 'int'},
                {key: 'nrComments', 				type: 'int'},
                {key: 'showCheckpoints', 			type: 'bool'},
                {key: 'checkpointIDs', 			    type: 'array'},
                {key: 'currentCheckpoint', 			type: 'int'},
                {key: 'lastCheckpoint', 			type: 'int'},
                {key: 'hyperlinkDashboardID', 		type: 'int'},
                {key: 'hyperlinkDashboardTabID', 	type: 'int'},
                {key: 'datasourceID', 				type: 'int'},
                {key: 'datasetID', 					type: 'int'},
                {key: 'dataParameters', 			type: 'array'},
                {key: 'reportID', 					type: 'int'},
                {key: 'reportName', 				type: 'string'},
                {key: 'rowLimit', 					type: 'int'},
                {key: 'addRestRow', 				type: 'bool'},
                {key: 'size', 						type: 'string'},
                {key: 'containerBackgroundcolor', 	type: 'string'},
                {key: 'containerBorder', 			type: 'string'},
                {key: 'containerBorderRadius', 	    type: 'string'},
                {key: 'containerBoxshadow', 		type: 'string'},
                {key: 'containerFontsize', 			type: 'int'},
                {key: 'containerHeight', 			type: 'int'},
                {key: 'containerLeft', 				type: 'int'},
                {key: 'containerHasTitle', 		    type: 'bool'},
                {key: 'containerTop', 				type: 'int'},
                {key: 'containerWidth', 			type: 'int'},
                {key: 'containerZindex', 			type: 'int'},
                {key: 'titleText', 					type: 'string'},
                {key: 'titleBackgroundColor', 		type: 'string'},
                {key: 'titleBorder', 				type: 'string'},
                {key: 'titleColor', 				type: 'string'},
                {key: 'titleFontsize', 				type: 'int'},
                {key: 'titleFontWeight', 			type: 'string'},
                {key: 'titleHeight', 				type: 'int'},
                {key: 'titleLeft', 					type: 'int'},
                {key: 'titleMargin', 				type: 'string'},
                {key: 'titlePadding', 				type: 'string'},
                {key: 'titlePosition', 				type: 'string'},
                {key: 'titleTextAlign', 			type: 'string'},
                {key: 'titleTop', 					type: 'int'},
                {key: 'titleWidth', 				type: 'int'},
                {key: 'graphType', 					type: 'string'},
                {key: 'graphHeight', 				type: 'int'},
                {key: 'graphLeft', 					type: 'int'},
                {key: 'graphTop', 					type: 'int'},
                {key: 'graphWidth', 				type: 'int'},
                {key: 'graphGraphPadding', 			type: 'int'},
                {key: 'graphHasSignals', 			type: 'bool'},
                {key: 'graphFillColor', 			type: 'string'},
                {key: 'graphHoverColor', 			type: 'string'},
                {key: 'graphSpecification', 		type: 'any'},
                {key: 'graphDescription', 			type: 'string'},
                {key: 'graphXaggregate', 			type: 'string'},
                {key: 'graphXtimeUnit', 			type: 'string'},
                {key: 'graphXfield', 				type: 'string'},
                {key: 'graphXtype', 				type: 'string'},
                {key: 'graphXaxisTitle', 			type: 'string'},
                {key: 'graphYaggregate', 			type: 'string'},
                {key: 'graphYtimeUnit', 			type: 'string'},
                {key: 'graphYfield', 				type: 'string'},
                {key: 'graphYtype', 				type: 'string'},
                {key: 'graphYaxisTitle', 			type: 'string'},
                {key: 'graphTitle', 				type: 'string'},
                {key: 'graphMark', 					type: 'string'},
                {key: 'graphMarkColor', 			type: 'string'},
                {key: 'graphUrl', 					type: 'string'},
                {key: 'graphData', 					type: 'any'},
                {key: 'graphColorField', 			type: 'string'},
                {key: 'graphColorType', 			type: 'string'},
                {key: 'tableBackgroundColor', 		type: 'string'},
                {key: 'tableColor', 				type: 'string'},
                {key: 'tableCols', 					type: 'int'},
                {key: 'fontSize',                   type: 'string'},
                {key: 'tableHeight', 				type: 'int'},
                {key: 'tableHideHeader', 			type: 'bool'},
                {key: 'tableLeft', 					type: 'int'},
                {key: 'tableLineHeight', 			type: 'int'},
                {key: 'tableRows', 					type: 'int'},
                {key: 'tableTop', 					type: 'int'},
                {key: 'tableWidth', 				type: 'int'},
                {key: 'slicerType', 				type: 'string'},
                {key: 'slicerAddRest', 				type: 'bool'},
                {key: 'slicerAddRestValue', 		type: 'bool'},
                {key: 'slicerNumberToShow', 		type: 'string'},
                {key: 'slicerSortField', 			type: 'string'},
                {key: 'slicerSortFieldOrder', 		type: 'string'},
                {key: 'slicerFieldName', 			type: 'string'},
                {key: 'slicerSelection', 			type: 'array'},
                {key: 'slicerBins', 			    type: 'array'},
                {key: 'shapeStroke', 				type: 'string'},
                {key: 'shapeStrokeWidth', 			type: 'string'},
                {key: 'shapeFill', 					type: 'string'},
                {key: 'shapeText', 					type: 'string'},
                {key: 'shapeValue', 				type: 'string'},
                {key: 'shapeBullets', 				type: 'string'},
                {key: 'shapeBulletStyleType', 		type: 'int'},
                {key: 'shapeBulletsOrdered', 		type: 'bool'},
                {key: 'shapeOpacity', 				type: 'int'},
                {key: 'shapeRotation', 				type: 'int'},
                {key: 'shapeCorner', 				type: 'int'},
                {key: 'shapeFontSize', 				type: 'int'},
                {key: 'shapeFontFamily', 			type: 'string'},
                {key: 'shapeIsBold', 				type: 'bool'},
                {key: 'shapeIsItalic', 				type: 'bool'},
                {key: 'refreshMode', 				type: 'string'},
                {key: 'refreshFrequency', 			type: 'int'},
                {key: 'widgetRefreshedOn', 			type: 'string'},
                {key: 'widgetRefreshedBy', 			type: 'string'},
                {key: 'widgetCreatedOn', 			type: 'string'},
                {key: 'widgetCreatedBy', 			type: 'string'},
                {key: 'widgetUpdatedOn', 			type: 'string'},
                {key: 'widgetUpdatedBy', 			type: 'string'}
            ])
            .config({
                id: "CanvasCache",
                mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
                history: false // allow the database to undo/redo changes on the fly.
            })
            .actions([
                {
                    name:'addNewWidget',
                    args:['row: map'],
                    call:function(args, db) {
                        return db.query('upsert',args.row).exec();
                    }
                }
            ])
            .views([
                {
                    name: 'getWidgetByID',
                    args: ['id:int'],
                    call: function(args, db) {
                        return db.query('select').where(['id','=',args.id]).exec();
                    }
                },
            ])
            .connect()
            .then(db => {
                console.log('Global-Variables connectLocalDB', db)
                resolve(db)

            })
        })
    }

    getLocal<T>(table: string, params?: any): Promise<any> {
        // Generic retrieval of data from localDB
        console.log('Global-Variables getLocal for table, params...', table, params);

        return new Promise((resolve, reject) => {

            nSQL(table).query('select').exec()
            .then( result => {
                console.log('Global-Variables getLocal result', result) // <= arrayid:1, name:"bill", age: 20}]
                resolve(result)
            })

            // Worked
            // nSQL(table).connect()
            // .then(function(result) {
            //     return nSQL().query('select').exec(); // select all rows from the current active table
            // })
            // .then(function(result) {
            //     console.log('Global-Variables getLocal result', result) // <= arrayid:1, name:"bill", age: 20}]
            //     resolve(result)
            // })

        })
    }

    saveLocal<T>(table: string, row: any): Promise<any> {
        // Generic saving of row to a table in the localDB
        console.log('Global-Variables saveLocal for table...', table);
        return new Promise((resolve, reject) => {

            nSQL(table).query('upsert', row).exec().then(res => {

                // TODO - we need a better way to update the global vars
                if (table == 'DashboardSnapshot') {
                    res.forEach( r => {
                        r.affectedRows.forEach(ra => {
                            this.dashboardSnapshots.push(ra);
                            this.currentDashboardSnapshots.push(ra);
                        })
                    });
                };
            });
            // Worked
            // nSQL(table).connect()
            // .then(function(result) {
            //     resolve(nSQL().query('upsert', row).exec());
            // })

        })
    }

    
    //         // Example 1
        //         // nSQL('widgets') //  "users" is our table name.
        //         // .model([ // Declare data model
        //         //     {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
        //         //     {key:'name',type:'string'},
        //         //     {key:'age', type:'int'}
        //         // ])
        //         // .connect() // Init the data store for usage. (only need to do this once)
        //         // .then(function(result) {
        //         //     return nSQL().query('upsert',{ // Add a record
        //         //         id: null, name:"boy", age: 54
        //         //     }).exec();
        //         // })
        //         // .then(function(result) {
        //         //     return nSQL().query('select').exec(); // select all rows from the current active table
        //         // })
        //         // .then(function(result) {
        //         // })

        //         // Example 2
        //         // nSQL('users')// Table/Store Name, required to declare model and attach it to this store.
        //         // .model([ // Data Model, required
        //         //     {key:'id',type:'int',props:['pk', 'ai']}, // pk == primary key, ai == auto incriment
        //         //     {key:'name',type:'string'},
        //         //     {key:'age', type:'int'}
        //         // ])
        //         // .config({
        //         // 	mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
        //         // 	history: true // allow the database to undo/redo changes on the fly.
        //         // })
        //         // .actions([ // Optional
        //         // 	{
        //         // 		name:'add_new_user',
        //         // 		args:['user:map'],
        //         // 		call:function(args, db) {
        //         // 			return db.query('upsert',args.user).exec();
        //         // 		}
        //         // 	}
        //         // ])
        //         // .views([ // Optional
        //         // 	{
        //         // 		name: 'get_user_by_name',
        //         // 		args: ['name:string'],
        //         // 		call: function(args, db) {
        //         // 			return db.query('select').where(['name','=',args.name]).exec();
        //         // 		}
        //         // 	},
        //         // 	{
        //         // 		name: 'list_all_users',
        //         // 		args: ['page:int'],
        //         // 		call: function(args, db) {
        //         // 			return db.query('select',['id','name']).exec();
        //         // 		}
        //         // 	}
        //         // ])
        //         // .connect()
        //             // .then( conn =>
        //             // 	nSQL().doAction('add_new_user', { user: { id: null, name:"bill", age: 20 } } )
        //             // 	.then(first =>
        //             // 		nSQL().doAction('add_new_user', { user: { id: 4, name:"bambie", age: 21 } } )
        //             // 		// nSQL().query('upsert',{ // Add a record
        //             // 		// 	name:"bill", age: 20
        //             // 		// }).exec()
        //             // 			.then(second => {
        //             // 				return nSQL().getView('list_all_users');
        //             // 			}).then(result => {
        //             // 			})
        //             // 		)
        //             // )
        //     })
    // }

    refreshCurrentDashboard(
        refreshingRoutine: string,
        dashboardID: number,
        dashboardTabID: number = 0,
        tabToShow: string = '',
        widgetsToRefresh: number[] = []) {
        // Refresh the global var currentDashboardInfo, then .next it.
        // This will refresh the Dashboard on the screen (via .subscribe)
        // If a dashboardTabID is given, this one will be shown.  Else, it will navigate
        // to tabToShow, which can be First, Previous, Next, Last.  tabToShow overules
        // dashboardTabID if tabToShow is given.  It does not assume that all the currentD
        // Info has already been collected - to allow for the first time this is called.
        // It does assume that we have a currentDashboardInfo object if Previous/Next are
        // parameters.
        console.log('Global-Variables refreshCurrentDashboard ...');

        // TODO - add Permissions, either here or automatically in DB !!!
        
        // Make sure the currT are indeed for the requested D
        let currentDashboardTabs: DashboardTab[];
        currentDashboardTabs = this.dashboardTabs.filter(t => t.dashboardID == dashboardID);
        
        // Assume we have all currentD info
        if ( ( (tabToShow == 'Previous')  ||  (tabToShow == 'Next') )  &&
            (this.currentDashboardInfo == null) ) {
            return;
        };

        let dt = new Date();
        let x: number = 0;
        let y: number = 0;

        if (tabToShow != '') {
            if (currentDashboardTabs.length == 0) {
                console.log('this.currentDashboardTabs empty');
                return;
            }
            if (tabToShow == 'First') {
                x = 0;
            }
            if (tabToShow == 'Previous') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex - 1;
                if (x < 0) {
                    x = currentDashboardTabs.length - 1;
                }
            }
            if (tabToShow == 'Next') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex + 1;
                if (x >= currentDashboardTabs.length) {
                    x = 0;
                }
            }
            if (tabToShow == 'Last') {
                x = currentDashboardTabs.length - 1;

            }
            y = currentDashboardTabs[x].id;
        } else {
            y = dashboardTabID;
            if (this.currentDashboards.length == 0) {
                x = 0;
            } else {
                for (var i = 0; i < currentDashboardTabs.length; i++) {
                    if (currentDashboardTabs[i].id == dashboardTabID) {
                        x = i;
                    };
                };
            };
        };

        this.currentDashboardInfo.next({
            currentDashboardID: dashboardID,
            currentDashboardTabID: y,
            currentDashboardTabIndex: x,
            refreshingRoutine: refreshingRoutine,
            refreshDateTime: dt.toString(),
            widgetsToRefresh
        });

    }

    widgetReplace(changedWidget: Widget) {
        // Replaces (ByVal) the global W and currentW
        console.log('Global-Variables ... widgetReplace', changedWidget.id);

        // TODO - this is not DRY - there must be a better way!!
        this.widgets.forEach(w => {
            if (w.id == changedWidget.id) {
                // TODO - Make a deep copy / error free, less work copy
                w.widgetType = changedWidget.widgetType;
                w.widgetSubType = changedWidget.widgetSubType;
                w.isTrashed = changedWidget.isTrashed;
                w.dashboardID = changedWidget.dashboardID;
                w.dashboardTabID = changedWidget.dashboardTabID;
                w.dashboardTabIDs = changedWidget.dashboardTabIDs;
                w.id = changedWidget.id;
                w.name = changedWidget.name;
                w.description = changedWidget.description;
                w.visualGrammar = changedWidget.visualGrammar;
                w.version = changedWidget.version;
                w.isSelected = changedWidget.isSelected;
                w.isLiked = changedWidget.isLiked;
                w.nrDataQualityIssues = changedWidget.nrDataQualityIssues;
                w.nrComments = changedWidget.nrComments;
                w.showCheckpoints = changedWidget.showCheckpoints;
                w.checkpointIDs = changedWidget.checkpointIDs;
                w.currentCheckpoint = changedWidget.currentCheckpoint;
                w.lastCheckpoint = changedWidget.lastCheckpoint;
                w.hyperlinkDashboardID = changedWidget.hyperlinkDashboardID;
                w.hyperlinkDashboardTabID = changedWidget.hyperlinkDashboardTabID;
                w.datasourceID = changedWidget.datasourceID;
                w.datasetID = changedWidget.datasetID;
                w.data = changedWidget.data;
                w.dataFields = changedWidget.dataFields;
                w.dataFieldTypes = changedWidget.dataFieldTypes;
                w.dataFieldLengths = changedWidget.dataFieldLengths;
                w.dataParameters = changedWidget.dataParameters;
                w.reportID = changedWidget.reportID;
                w.reportName = changedWidget.reportName;
                w.rowLimit = changedWidget.rowLimit;
                w.addRestRow = changedWidget.addRestRow;
                w.size = changedWidget.size;
                w.containerBackgroundcolor = changedWidget.containerBackgroundcolor;
                w.containerBorder = changedWidget.containerBorder;
                w.containerBorderRadius = changedWidget.containerBorderRadius;
                w.containerBoxshadow = changedWidget.containerBoxshadow;
                w.containerFontsize = changedWidget.containerFontsize;
                w.containerHeight = changedWidget.containerHeight;
                w.containerLeft = changedWidget.containerLeft;
                w.containerHasTitle = changedWidget.containerHasTitle;
                w.containerTop = changedWidget.containerTop;
                w.containerWidth = changedWidget.containerWidth;
                w.containerZindex = changedWidget.containerZindex;
                w.titleText = changedWidget.titleText;
                w.titleBackgroundColor = changedWidget.titleBackgroundColor;
                w.titleBorder = changedWidget.titleBorder;
                w.titleColor = changedWidget.titleColor;
                w.titleFontsize = changedWidget.titleFontsize;
                w.titleFontWeight = changedWidget.titleFontWeight;
                w.titleHeight = changedWidget.titleHeight;
                w.titleLeft = changedWidget.titleLeft;
                w.titleMargin = changedWidget.titleMargin;
                w.titlePadding = changedWidget.titlePadding;
                w.titlePosition = changedWidget.titlePosition;
                w.titleTextAlign = changedWidget.titleTextAlign;
                w.titleTop = changedWidget.titleTop;
                w.titleWidth = changedWidget.titleWidth;
                w.graphType = changedWidget.graphType;
                w.graphHeight = changedWidget.graphHeight;
                w.graphLeft = changedWidget.graphLeft;
                w.graphTop = changedWidget.graphTop;
                w.graphWidth = changedWidget.graphWidth;
                w.graphGraphPadding = changedWidget.graphGraphPadding;
                w.graphHasSignals = changedWidget.graphHasSignals;
                w.graphFillColor = changedWidget.graphFillColor;
                w.graphHoverColor = changedWidget.graphHoverColor;
                w.graphSpecification = changedWidget.graphSpecification;
                w.graphDescription = changedWidget.graphDescription;
                w.graphXaggregate = changedWidget.graphXaggregate;
                w.graphXtimeUnit = changedWidget.graphXtimeUnit;
                w.graphXfield = changedWidget.graphXfield;
                w.graphXtype = changedWidget.graphXtype;
                w.graphXaxisTitle = changedWidget.graphXaxisTitle;
                w.graphYaggregate = changedWidget.graphYaggregate;
                w.graphYtimeUnit = changedWidget.graphYtimeUnit;
                w.graphYfield = changedWidget.graphYfield;
                w.graphYtype = changedWidget.graphYtype;
                w.graphYaxisTitle = changedWidget.graphYaxisTitle;
                w.graphTitle = changedWidget.graphTitle;
                w.graphMark = changedWidget.graphMark;
                w.graphMarkColor = changedWidget.graphMarkColor;
                w.graphUrl = changedWidget.graphUrl;
                w.graphColorField = changedWidget.graphColorField;
                w.graphColorType = changedWidget.graphColorType;
                w.graphData = changedWidget.graphData;
                w.tableBackgroundColor = changedWidget.tableBackgroundColor;
                w.tableColor = changedWidget.tableColor;
                w.tableCols = changedWidget.tableCols;
                w.fontSize  = changedWidget.fontSize;
                w.tableHeight = changedWidget.tableHeight;
                w.tableHideHeader = changedWidget.tableHideHeader;
                w.tableLeft = changedWidget.tableLeft;
                w.tableLineHeight = changedWidget.tableLineHeight;
                w.tableRows = changedWidget.tableRows;
                w.tableTop = changedWidget.tableTop;
                w.tableWidth = changedWidget.tableWidth;
                w.slicerType = changedWidget.slicerType,
                w.slicerNumberToShow = changedWidget.slicerNumberToShow;
                w.slicerSortField = changedWidget.slicerSortField;
                w.slicerSortFieldOrder = changedWidget.slicerSortFieldOrder;
                w.slicerFieldName = changedWidget.slicerFieldName;
                w.slicerSelection = changedWidget.slicerSelection;
                w.slicerBins = changedWidget.slicerBins;
                w.slicerAddRest = changedWidget.slicerAddRest;
                w.slicerAddRestValue = changedWidget.slicerAddRestValue;
                w.shapeStroke = changedWidget.shapeStroke;
                w.shapeStrokeWidth = changedWidget.shapeStrokeWidth;
                w.shapeFill = changedWidget.shapeFill;
                w.shapeText = changedWidget.shapeText;
                w.shapeValue = changedWidget.shapeValue;
                w.shapeBullets = changedWidget.shapeBullets;
                w.shapeBulletStyleType = changedWidget.shapeBulletStyleType;
                w.shapeBulletsOrdered = changedWidget.shapeBulletsOrdered;
                w.shapeOpacity = changedWidget.shapeOpacity;
                w.shapeRotation = changedWidget.shapeRotation;
                w.shapeCorner = changedWidget.shapeCorner;
                w.shapeFontSize = changedWidget.shapeFontSize;
                w.shapeFontFamily = changedWidget.shapeFontFamily;
                w.shapeIsBold = changedWidget.shapeIsBold;
                w.shapeIsItalic = changedWidget.shapeIsItalic;
                w.refreshMode = changedWidget.refreshMode;
                w.refreshFrequency = changedWidget.refreshFrequency;
                w.widgetRefreshedOn = changedWidget.widgetRefreshedOn;
                w.widgetRefreshedBy = changedWidget.widgetRefreshedBy;
                w.widgetCreatedOn = changedWidget.widgetCreatedOn;
                w.widgetCreatedBy = changedWidget.widgetCreatedBy;
                w.widgetUpdatedOn = changedWidget.widgetUpdatedOn;
                w.widgetUpdatedBy = changedWidget.widgetUpdatedBy;
            };
        });
        this.currentWidgets.forEach(w => {
            if (w.id == changedWidget.id) {
                // TODO - Make a deep copy / error free, less work copy
                w.widgetType = changedWidget.widgetType;
                w.widgetSubType = changedWidget.widgetSubType;
                w.isTrashed = changedWidget.isTrashed;
                w.dashboardID = changedWidget.dashboardID;
                w.dashboardTabID = changedWidget.dashboardTabID;
                w.dashboardTabIDs = changedWidget.dashboardTabIDs;
                w.id = changedWidget.id;
                w.name = changedWidget.name;
                w.description = changedWidget.description;
                w.visualGrammar = changedWidget.visualGrammar;
                w.version = changedWidget.version;
                w.isSelected = changedWidget.isSelected;
                w.isLiked = changedWidget.isLiked;
                w.nrDataQualityIssues = changedWidget.nrDataQualityIssues;
                w.nrComments = changedWidget.nrComments;
                w.showCheckpoints = changedWidget.showCheckpoints;
                w.checkpointIDs = changedWidget.checkpointIDs;
                w.currentCheckpoint = changedWidget.currentCheckpoint;
                w.lastCheckpoint = changedWidget.lastCheckpoint;
                w.hyperlinkDashboardID = changedWidget.hyperlinkDashboardID;
                w.hyperlinkDashboardTabID = changedWidget.hyperlinkDashboardTabID;
                w.datasourceID = changedWidget.datasourceID;
                w.datasetID = changedWidget.datasetID;
                w.data = changedWidget.data;
                w.dataFields = changedWidget.dataFields;
                w.dataFieldTypes = changedWidget.dataFieldTypes;
                w.dataFieldLengths = changedWidget.dataFieldLengths;
                w.dataParameters = changedWidget.dataParameters;
                w.reportID = changedWidget.reportID;
                w.reportName = changedWidget.reportName;
                w.rowLimit = changedWidget.rowLimit;
                w.addRestRow = changedWidget.addRestRow;
                w.size = changedWidget.size;
                w.containerBackgroundcolor = changedWidget.containerBackgroundcolor;
                w.containerBorder = changedWidget.containerBorder;
                w.containerBorderRadius = changedWidget.containerBorderRadius;
                w.containerBoxshadow = changedWidget.containerBoxshadow;
                w.containerFontsize = changedWidget.containerFontsize;
                w.containerHeight = changedWidget.containerHeight;
                w.containerLeft = changedWidget.containerLeft;
                w.containerHasTitle = changedWidget.containerHasTitle;
                w.containerTop = changedWidget.containerTop;
                w.containerWidth = changedWidget.containerWidth;
                w.containerZindex = changedWidget.containerZindex;
                w.titleText = changedWidget.titleText;
                w.titleBackgroundColor = changedWidget.titleBackgroundColor;
                w.titleBorder = changedWidget.titleBorder;
                w.titleColor = changedWidget.titleColor;
                w.titleFontsize = changedWidget.titleFontsize;
                w.titleFontWeight = changedWidget.titleFontWeight;
                w.titleHeight = changedWidget.titleHeight;
                w.titleLeft = changedWidget.titleLeft;
                w.titleMargin = changedWidget.titleMargin;
                w.titlePadding = changedWidget.titlePadding;
                w.titlePosition = changedWidget.titlePosition;
                w.titleTextAlign = changedWidget.titleTextAlign;
                w.titleTop = changedWidget.titleTop;
                w.titleWidth = changedWidget.titleWidth;
                w.graphType = changedWidget.graphType;
                w.graphHeight = changedWidget.graphHeight;
                w.graphLeft = changedWidget.graphLeft;
                w.graphTop = changedWidget.graphTop;
                w.graphWidth = changedWidget.graphWidth;
                w.graphGraphPadding = changedWidget.graphGraphPadding;
                w.graphHasSignals = changedWidget.graphHasSignals;
                w.graphFillColor = changedWidget.graphFillColor;
                w.graphHoverColor = changedWidget.graphHoverColor;
                w.graphSpecification = changedWidget.graphSpecification;
                w.graphDescription = changedWidget.graphDescription;
                w.graphXaggregate = changedWidget.graphXaggregate;
                w.graphXtimeUnit = changedWidget.graphXtimeUnit;
                w.graphXfield = changedWidget.graphXfield;
                w.graphXtype = changedWidget.graphXtype;
                w.graphXaxisTitle = changedWidget.graphXaxisTitle;
                w.graphYaggregate = changedWidget.graphYaggregate;
                w.graphYtimeUnit = changedWidget.graphYtimeUnit;
                w.graphYfield = changedWidget.graphYfield;
                w.graphYtype = changedWidget.graphYtype;
                w.graphYaxisTitle = changedWidget.graphYaxisTitle;
                w.graphTitle = changedWidget.graphTitle;
                w.graphMark = changedWidget.graphMark;
                w.graphMarkColor = changedWidget.graphMarkColor;
                w.graphUrl = changedWidget.graphUrl;
                w.graphColorField = changedWidget.graphColorField;
                w.graphColorType = changedWidget.graphColorType;
                w.graphData = changedWidget.graphData;
                w.tableBackgroundColor = changedWidget.tableBackgroundColor;
                w.tableColor = changedWidget.tableColor;
                w.tableCols = changedWidget.tableCols;
                w.fontSize  = changedWidget.fontSize;
                w.tableHeight = changedWidget.tableHeight;
                w.tableHideHeader = changedWidget.tableHideHeader;
                w.tableLeft = changedWidget.tableLeft;
                w.tableLineHeight = changedWidget.tableLineHeight;
                w.tableRows = changedWidget.tableRows;
                w.tableTop = changedWidget.tableTop;
                w.tableWidth = changedWidget.tableWidth;
                w.slicerType = changedWidget.slicerType,
                w.slicerNumberToShow = changedWidget.slicerNumberToShow;
                w.slicerSortField = changedWidget.slicerSortField;
                w.slicerSortFieldOrder = changedWidget.slicerSortFieldOrder;
                w.slicerFieldName = changedWidget.slicerFieldName;
                w.slicerSelection = changedWidget.slicerSelection;
                w.slicerBins = changedWidget.slicerBins;
                w.slicerAddRest = changedWidget.slicerAddRest;
                w.slicerAddRestValue = changedWidget.slicerAddRestValue;
                w.shapeStroke = changedWidget.shapeStroke;
                w.shapeStrokeWidth = changedWidget.shapeStrokeWidth;
                w.shapeFill = changedWidget.shapeFill;
                w.shapeText = changedWidget.shapeText;
                w.shapeValue = changedWidget.shapeValue;
                w.shapeBullets = changedWidget.shapeBullets;
                w.shapeBulletStyleType = changedWidget.shapeBulletStyleType;
                w.shapeBulletsOrdered = changedWidget.shapeBulletsOrdered;
                w.shapeOpacity = changedWidget.shapeOpacity;
                w.shapeRotation = changedWidget.shapeRotation;
                w.shapeCorner = changedWidget.shapeCorner;
                w.shapeFontSize = changedWidget.shapeFontSize;
                w.shapeFontFamily = changedWidget.shapeFontFamily;
                w.shapeIsBold = changedWidget.shapeIsBold;
                w.shapeIsItalic = changedWidget.shapeIsItalic;
                w.refreshMode = changedWidget.refreshMode;
                w.refreshFrequency = changedWidget.refreshFrequency;
                w.widgetRefreshedOn = changedWidget.widgetRefreshedOn;
                w.widgetRefreshedBy = changedWidget.widgetRefreshedBy;
                w.widgetCreatedOn = changedWidget.widgetCreatedOn;
                w.widgetCreatedBy = changedWidget.widgetCreatedBy;
                w.widgetUpdatedOn = changedWidget.widgetUpdatedOn;
                w.widgetUpdatedBy = changedWidget.widgetUpdatedBy;
            };
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

    createVegaLiteSpec(
        widget: Widget, 
        height: number = 0, 
        width: number = 0): dl.spec.TopLevelExtendedSpec {
        // Creates a Vega-Lite spec for a given Widget from a standard template
        // - widget is the W for which the graph is created, and contains all the 
        //   required detail
        // - height, width are optional dimensions.  If provided, it will overrule
        //   those values in spec
        console.log('Global-Variables refreshCurrentDashboard ...');

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = this.vlTemplate;
        if (widget.graphUrl != "") {
            vlSpecsNew['data'] = {"url": widget.graphUrl};
        } else {
            vlSpecsNew['data'] = {"values": widget.graphData};
        }
        vlSpecsNew['description'] = widget.graphDescription;
        vlSpecsNew['mark']['type'] = widget.graphMark;
        vlSpecsNew['mark']['color'] = widget.graphMarkColor;

        vlSpecsNew['encoding']['x']['field'] = widget.graphXfield;
        vlSpecsNew['encoding']['x']['type'] = widget.graphXtype;
        vlSpecsNew['encoding']['x']['axis']['title'] = widget.graphXaxisTitle;
        vlSpecsNew['encoding']['x']['timeUnit'] = widget.graphXtimeUnit;
        vlSpecsNew['encoding']['x']['aggregate'] = widget.graphXaggregate;

        vlSpecsNew['encoding']['y']['field'] = widget.graphYfield;
        vlSpecsNew['encoding']['y']['type'] = widget.graphYtype;
        vlSpecsNew['encoding']['y']['axis']['title'] = widget.graphYaxisTitle;
        vlSpecsNew['encoding']['y']['timeUnit'] = widget.graphYtimeUnit;
        vlSpecsNew['encoding']['y']['aggregate'] = widget.graphYaggregate;

        if (height != 0) {
            vlSpecsNew['height'] = height;
        } else {
            vlSpecsNew['height'] = widget.graphHeight;
        };
        if (width != 0) {
            vlSpecsNew['width'] = width;
        } else {
            vlSpecsNew['width'] = widget.graphWidth;
        };

        vlSpecsNew['title']['text'] = widget.graphTitle;

        vlSpecsNew['encoding']['color']['field'] = widget.graphColorField;
        vlSpecsNew['encoding']['color']['type'] = widget.graphColorType;


        // if (widget.graphColorField != ''  && widget.graphColorField != null) {
        //     vlSpecsNew['encoding']['color'] = {
        //         "field": widget.graphColorField,
        //         "type": widget.graphColorType
        //       }
        // };

        return vlSpecsNew;
    }

    actionUpsert(
        id: number,
        dashboardID: number, 
        dashboardTabID: number,
        objectType: string,
        action: string, 
        description: string,
        undoID: number, 
        redoID: number, 
        oldWidget: any, 
        newWidget: any, 
     ): number {
        let actID: number = 1;

        if (id == null) {
            // Add / Update an action to the ActionLog.  It returns id of new/updated record
            // It returns -1 if it failed.
            // NB: id = null => Add, else Update
            // The update replaces any give non-null values
            console.log('Global-Variables actionAdd ...');

            // TODO - decide if lates / -1 is best choice here
            let act: number[] = [];
            for (var i = 0; i < this.actions.length; i++) {
                act.push(this.actions[i].id)
            };
            if (act.length > 0) {
                actID = Math.max(...act) + 1;
            };

            this.actions.push({
                id: actID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                objectType: objectType,
                action: action,
                description: description,
                undoID: undoID,
                redoID: redoID,
                oldWidget: oldWidget == null? null : Object.assign({}, oldWidget),
                newWidget: newWidget == null? null : Object.assign({}, newWidget),
            });
        } else {
            this.actions.forEach(ac => {
                if (ac.id == id) {
                    if (action != null) {ac.action = action};
                    if (description != null) {ac.description = description};
                    if (undoID != null) {ac.undoID = undoID};
                    if (redoID != null) {ac.redoID = redoID};
                    if (oldWidget != null) {ac.oldWidget =  Object.assign({}, oldWidget)};
                    if (newWidget != null) {ac.newWidget = Object.assign({}, newWidget)};
                    actID = id;
                };
            });
            
        };

        console.log('actionUpsert', this.actions)

        // Return
        return actID;
            
    }

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF snapping is enabled
        console.log('Global-Variables snapToGrid ...', inputValue);

        if (this.canvasSettings.snapToGrid) {
            if ( (inputValue % this.canvasSettings.gridSize) >= (this.canvasSettings.gridSize / 2)) {
                inputValue = inputValue + this.canvasSettings.gridSize - (inputValue % this.canvasSettings.gridSize);
            } else {
                inputValue = inputValue - (inputValue % this.canvasSettings.gridSize);
            }
        };

        // Return the value
        return inputValue;
    }

    showStatusBarMessage(statusBarMessage: StatusBarMessage
        ): void {
        // Shows a message in the right area, ie StatusBar
        console.log('Global-Variables showStatusBarMessage ...');

        // Pop message in right area
        if (statusBarMessage.uiArea == 'StatusBar') {
            this.statusBarMessage.next(statusBarMessage);
        };
    }

    createDatagridColumns(
        dataRow: any,
        showFields: string[] = [],
        visibleFields: string[] = []
        ): DatagridColumn[] {
        // It will return an array of datagridColumns to use in the ca-datagrid
        // for a given array of data and a set of columns to show, 
        console.log('Global-Variables createDatagridColumns ...');

        // No data provided
        if (dataRow == null  ||  dataRow == undefined) {
            return [];
        };

        // Start, assuming nothing to return
        let datagridColumns: DatagridColumn[] = [];
        let columns: string[] = [];

        // Get cols from the data
        columns = Object.keys(dataRow)

        // Make All visible if nothing was given
        if (visibleFields.length == 0) {
            visibleFields = columns;
        };

        // Select All fields if nothing was given
        if (showFields.length == 0) {
            showFields = columns;
        };        

        // Loop on the cols, and create an object for each in the datagridColumns array
        showFields.forEach( sf => {
            for (var i = 0; i < columns.length; i++) {

                // Include it field has to be shown
                if (sf == columns[i]) {
                    datagridColumns.push(
                    {
                        id: i,
                        displayName: columns[i],
                        fieldName: columns[i],
                        databaseDBTableName: '',
                        databaseDBFieldName: '',
                        tooltip: '',
                        datatype: 'string',
                        prefix: '',
                        divideBy: 0,
                        displayLength: 12,
                        maxLength: 0,
                        sortOrder: '',
                        filter: '',
                        backgroundColor: '',
                        color: '',
                        conditionalFormatColor: '',
                        nrDataQualityIssues: 0,
                        maxValue: 0,
                        minValue: 0,
                        average: 0,
                        linkedDashboardID: 0,
                        linkedDashboardTabID: 0,
                        isFrozen: false,
                        datagridColumnHidden: 
                            visibleFields.indexOf(columns[i])
                            < 0 ? {hidden: true} :  {hidden: false}
                    });
                };
            };
        });

        return datagridColumns;

    }

    dashboardPermissionCheck(id: number): boolean {
        // Checks if the current user has access to the given D.
        console.log('Global-Variables dashboardPermissionCheck ...');

        // Assume no access
        let hasAccess: boolean = false;

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id == id) {
                dashboard = Object.assign({}, d);
            };
        });

        // Make sure we have a D
        if (dashboard == undefined) {
            return;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() == 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() == 'private'  
            && 
            dashboard.creator.toLowerCase() == userID.toLowerCase()) {
                hasAccess = true;
        };
        if (dashboard.accessType.toLowerCase() == 'accesslist') {  
            this.dashboardPermissions.forEach(dp => {
                if (dp.dashboardID == dashboard.id) {
                    if (dp.userID != null) {
                        if (dp.userID.toLowerCase() == userID.toLowerCase()) {
                            hasAccess = true;
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                hasAccess = true;
                        };
                    };
                };
            });
        };

        // Return
        return hasAccess;
    }
}