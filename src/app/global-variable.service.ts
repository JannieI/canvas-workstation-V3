/*
 * Global variables and methods used by all components
 */

import { BehaviorSubject }            from 'rxjs';
import { Injectable }                 from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { HttpHeaders }                from "@angular/common/http";

// Our Models
import { CanvasAction }               from './models';
import { CanvasAuditTrail }           from './models';
import { CanvasGroup }                from './models';
import { CanvasHttpResponse }         from './models';
import { CanvasSettings }             from './models';
import { CanvasUser}                  from './models';
import { CSScolor }                   from './models';
import { CurrentDashboardInfo }       from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardRecent}             from './models';
import { DashboardSnapshot }          from './models';
import { DashboardTab }               from './models';
import { DashboardTag }               from './models';
import { DataCachingTable }           from './models';
import { DatasourceFilter }           from './models';
import { Datasource }                 from './models';
import { DatasourcePermission}        from './models';
import { PaletteButtonsSelected }     from './models';
import { StatusBarMessage }           from './models';
import { StatusBarMessageLog }        from './models';
import { TributaryServerType }        from './models';
import { TributarySource }            from './models';
import { WebSocketMessage }           from './models';
import { Widget }                     from './models';
import { WidgetCheckpoint }           from './models';

// Dexie
import Dexie                          from 'dexie';
import { DataCachingDatabase }        from './dexieDatabase';

// Local Data - Dexie
import { CanvasAppDatabase }          from './dexieDatabase';
import { LocalDashboard }             from './dexieDatabase';
import { LocalDashboardTab }          from './dexieDatabase';
import { LocalWidget }                from './dexieDatabase';
import { LocalWidgetCheckpoint }      from './dexieDatabase';
import { LocalWidgetLayout }          from './dexieDatabase';
import { IDataCachingTable }          from './dexieDatabase';

// TODO - to remove
import { Token }                      from './models';

// External
import * as dl                        from 'datalib';

// Environment
import { environment }                from '../environments/environment';

// Templates
import { canvasSettings }             from './templates';
import { dashboardTemplate }          from './templates';
import { dashboardTabTemplate }       from './templates';
import { finalFields }                from './templates';
import { serverTypes }                from './templates';
import { vlTemplate }                 from './templates';
import { widgetNavigatorVegaSpecification } from './templates';
import { widgetTemplateInner }        from './templates';
import { widgetTemplate }             from './templates';

@Injectable()
export class GlobalVariableService {


    // Utility vars, ie used on more than one occasion
    // ***********************************************
    colourPickerClosed = new BehaviorSubject<
        {
            callingRoutine: string;
            selectedColor:string;
            cancelled: boolean
        }
    >(null);
    conditionFieldDataType: string = '';
    conditionOperator: string = '';
    concoleLogStyleForCaching: string = "color: black; background: transparent; font-size: 10px; font-weight: bold;";
    concoleLogStyleForStartOfMethod: string = "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px; font-weight: bold;";
    concoleLogStyleForEndOfMethod: string = "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px;";
    concoleLogStyleForStartOfUtilFunctions: string = "color: black; background: rgba(243, 243, 243, 0.4); font-size: 10px;";
    continueToTransformations: boolean = false;         // True after Edit DS -> Open Transformations form
    getSource: string = 'Test';     // Where to read/write: File, Test, Canvas Server
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
    widgetNavigatorVegaSpecification: any = widgetNavigatorVegaSpecification;
    widgetTemplateInner: any = widgetTemplateInner;
    serverTypes: TributaryServerType[] = serverTypes;


    // Environment settings: Server Url, etc read from external
    ENVCanvasServerList: {
        serverName: string,
        serverHostURI: string
    }[] = environment.ENVCanvasServerList;
    ENVStartupCanvasServerName: string = environment.ENVStartupCanvasServerName;


    // User
    // *********************************************************************************

    // Current Canvas Server & User info - stored locally and used to login / verify
    canvasServerName: string = environment.ENVStartupCanvasServerName;
    currentUserID: string = '';
    currentUser: CanvasUser;                            // Current logged in user
    canvasServerURI: string = '';
    currentCompany: string = '';
    currentToken: string = '';
    loggedIntoServer = new BehaviorSubject<boolean>(true);  // Emits True when log in/out of server

    // Canvas Server Profile (and settings)
    canvasSettings: CanvasSettings = canvasSettings;        // Used by components
    canvasSettingsArray: CanvasSettings[];                  // Returned by getResource


    // Canvas-related info and Data
    // *********************************************************************************

    // Cache of Permanent Canvas-related data read from the Canvas-Server
    // It hold full sets (all the records) but not necessarily complete (some portions like
    // the data arrays may be missing)
    actions: CanvasAction[] = [];
    cachingStatus: string = 'NotStarted';   // NotStarted, Pending, InitialDone
    canvasBackgroundcolors: CSScolor[] = [];
    canvasGroups: CanvasGroup[] = [];
    canvasUsers: CanvasUser[] = [];
    dashboardPermissions: DashboardPermission[] = [];
    dashboardsRecent: DashboardRecent[] = [];           // List of Recent Dashboards
    dashboards: Dashboard[] = [];
    dashboardTabs: DashboardTab[] = [];
    dashboardTags: DashboardTag[] = [];
    datasources: Datasource[] = [];
    dataCachingTable: DataCachingTable[] = [];
    datasourcePermissions: DatasourcePermission[] = [];
    finalFields: any = finalFields;
    hasNewMessage = new BehaviorSubject<boolean>(false);
    lastMessageDateTime: Date = new Date(); // Last time a caching message was received
    statusBarMessageLogs: StatusBarMessageLog[] = [];
    // transformationsFormat: Transformation[] = transformationsFormat;
    widgetCheckpoints: WidgetCheckpoint[] = [];
    widgets: Widget[] = [];

    currentDashboardInfo = new BehaviorSubject<CurrentDashboardInfo>(null);      // Null when not defined
    currentDashboardName = new BehaviorSubject<string>('');
    currentDashboards: Dashboard[] = [];
    currentDashboardTabs: DashboardTab[] = [];
    currentDatasources: Datasource[] = [];
    currentPaletteButtonsSelected= new BehaviorSubject<PaletteButtonsSelected[]>([]);
    changedWidget = new BehaviorSubject<Widget>(null);    // W that must be changed
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgets: Widget[] = [];


    // Dirtiness of system (local) data: True if dirty (all dirty at startup)
    isDirtyDatasources: boolean = true;


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
    showModalLanding = new BehaviorSubject<boolean>(true);  // Shows Landing page
    lastDashboardOpened:
        {
            wasHyperlink: boolean;
            lastDashboardID: number;
            lastDashboardTabID: number
        } = {
            wasHyperlink: false,
            lastDashboardID: null,
            lastDashboardTabID: null
        };


    // Session
    dontDisturb = new BehaviorSubject<boolean>(false);   // True means dont disturb display
    sessionDateTimeLoggedin: string = '';
    sessionDebugging: boolean = true;      // True to log multiple messages to Console
    sessionLogging: boolean = false;


    // StatusBar
    statusBarRunning = new BehaviorSubject<string>(this.canvasSettings.noQueryRunningMessage);
    statusBarCancelRefresh = new BehaviorSubject<string>('Cancel');
    statusBarMessage = new BehaviorSubject<StatusBarMessage>(null)

    // Dexie
    dbDataCachingTable;

    // Dexie - Data
    dbCanvasAppDatabase;
    localDataCachingTable: IDataCachingTable[];
    localDashboards: LocalDashboard[];
    localDashboardTabs: LocalDashboardTab[];
    localWidgets: LocalWidget[];
    localWidgetCheckpoints: LocalWidgetCheckpoint[];
    localWidgetLayouts: LocalWidgetLayout[];

    constructor(
        private http: HttpClient,
    ) {

    }

    databaseInit() {
        // Initial
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables databaseInit starts',
                this.concoleLogStyleForStartOfMethod)
        };

        // Initialise
        this.dbCanvasAppDatabase = new CanvasAppDatabase
        this.dbCanvasAppDatabase.open();
        this.dbDataCachingTable = new DataCachingDatabase;
        this.dbDataCachingTable.open();
    }

    refreshCurrentDashboardInfo(dashboardID: number, dashboardTabID: number):
        Promise<boolean> {
        // Refreshes all info related to current D
        // dashboardTabID = -1 if unknown, so get first T
        // Returns True if all worked, False if something went wrong
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables refreshCurrentDashboardInfo starts',
                this.concoleLogStyleForStartOfMethod,
                {dashboardID}, {dashboardTabID}, this.dashboards, this.dashboardTabs, this.currentDashboards, this.currentDashboardTabs)
        };

        return new Promise<boolean>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            // Load the current Dashboard Core info
            let pathUrl: string = '/canvasDashboardCore?id=' + dashboardID 
                + '&dashboardTabID=' + dashboardTabID;
            let finalUrl: string = this.canvasServerURI + pathUrl;
            
            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables refreshCurrentDashboardInfo: ' + httpResponse.message);
                        reject('Error in Global Variables refreshCurrentDashboardInfo: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables refreshCurrentDashboardInfo: Data in response object is null; it should be an array');
                        reject('Error in Global Variables refreshCurrentDashboardInfo: Data in response object is null; it should be an array');
                        return;
                    };
                    if(httpResponse.data.length == 0) {
                        console.error('Data in refreshCurrentDashboardInfo response object is an empty array; it should contain data');
                        reject('Data in refreshCurrentDashboardInfo response object is an empty array; it should contain data');
                        return;
                    };
                     
                    this.currentDashboards = httpResponse.data[0].dashboards;
                    this.currentDashboardTabs  = httpResponse.data[0].dashboardTabs;
                    this.currentWidgets  = httpResponse.data[0].widgets;
                    this.currentWidgetCheckpoints  = httpResponse.data[0].widgetCheckpoints;

                    // Load D-Template
                    let hasAccess: boolean = false;
                    if (this.currentDashboards.length > 0) {
                        if (this.currentDashboards[0].templateDashboardID != 0
                            &&
                            this.currentDashboards[0].templateDashboardID != null) {

                            hasAccess = false;
                            if (this.dashboardPermissionCheck(
                                this.currentDashboards[0].templateDashboardID,
                                'canviewright')) {
                                    hasAccess = true;
                            };
                            if (this.dashboardPermissionCheck(
                                this.currentDashboards[0].templateDashboardID,
                                'canviewandcanedit')) {
                                    hasAccess = true;
                            };

                            if (hasAccess) {

                                let templateDashboard: Dashboard[] = null;

                                templateDashboard = this.dashboards.filter(
                                    i => i.id === this.currentDashboards[0].templateDashboardID
                                );

                                if (templateDashboard == null) {
                                    console.error('Error in Global-Variables refreshCurrentDashboardInfo: Dashboard template id does not exist in Dashboards Array')
                                    this.templateInUse.next(false);
                                } else {
                                    this.currentDashboards.push(templateDashboard[0]);
                                    this.templateInUse.next(true);
                                }
                            } else {
                                this.templateInUse.next(false);
                            };
                        } else {
                            this.templateInUse.next(false);
                        };
                    };

                    if (dashboardTabID === -1) {
                        if (this.currentDashboardTabs.length > 0) {
                            dashboardTabID = this.currentDashboardTabs[0].id
                        };
                    };

                    // Set T-index
                    this.currentDashboardInfo.value.currentDashboardTabIndex =
                        this.currentDashboardTabs.findIndex(t => t.id === dashboardTabID);

                    // Load Permissions for D
                    this.getResource(
                        'dashboardPermissions',
                        '?filterObject={"dashboardID":' + dashboardID + '}')
                        .then( l => {

                            // Get all Unique DS-ids for the currentWs
                            let currentDSinWidgetIDSet: any = new Set(
                                this.currentWidgets
                                    .filter(w => w.datasourceID != null)
                                    .map(w => w.datasourceID)
                            );
                            let currentDSinWidgetIDs: number[] = Array.from(currentDSinWidgetIDSet);

                            // Get all currentDSids
                            let currentDSids: number[] = this.currentDatasources
                                .map(ds => ds.id);

                            // Get the data for those DS used in currentW and not in currentDS
                            let getCurrentDSPromises: any = [];
                            currentDSinWidgetIDs.forEach(DSid => {
                                if (currentDSids.indexOf(DSid) < 0) {

                                    // Get the dataFull, and then filter it down to dataFilters
                                    // using DS-Filters
                                    getCurrentDSPromises.push(this.getCurrentDatasource(DSid));
                                };
                            });

                            // Execute all the getData promises
                            Promise.all(getCurrentDSPromises)
                                .then( () => {

                                    // Get data and filter for each currentW
                                    this.currentWidgets.forEach(w => {

                                        if (w.datasourceID != null) {
                                            this.applyWidgetFilter(w);
                                        };

                                    });

                                    // Add to recent
                                    this.amendDashboardRecent(
                                        dashboardID,
                                        dashboardTabID,
                                        this.currentDashboardInfo.value.currentDashboardState
                                    );

                                    // Set the EditMode according to the D State
                                    this.editMode.next(
                                        this.currentDashboardInfo.value
                                            .currentDashboardState === 'Draft'?  true  :  false
                                    );

                                    resolve(true)

                                })
                                .catch(err => {
                                    console.error('Error in Global-Variables refreshCurrentDashboardInfo', err)
                                    if (err != null) {
                                        reject(err.message);
                                    } else {
                                        reject(err);
                                    };
                                })

                        })
                }
            );
        });
    }

    addDatasource(datasourceInput: Datasource, clientDataInput: any): Promise<string> {
        // Add a new Datasource, given the following:
        // - datasource
        // - data
        // The Server adds the records, with the correct IDs
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables addDatasource starts',
                this.concoleLogStyleForStartOfMethod,
                datasourceInput.name);
        };
        return new Promise<string>((resolve, reject) => {

            // Create Combo body
            let body: any = {
                "datasourceInput": datasourceInput,
                "clientDataInput": clientDataInput
            };
            console.log('xx body', body)

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDatasource';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.post<CanvasHttpResponse>(finalUrl, body, {headers}).subscribe(
                httpResponse  => {

                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables addDatasource: ' + httpResponse.message);
                        reject('Error in Global Variables addDatasource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables addDatasource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables addDatasource: Data in response object is null; it should be an array');
                        return;
                    };
                    if(httpResponse.data.length == 0) {
                        console.error('Error in Global Variables addDatasource Data in addDatasource response object is an empty array; it should contain data');
                        reject('Error in Global Variables addDatasource Data in addDatasource response object is an empty array; it should contain data');
                        return;
                    };

                    // Add to global vars
                    let datasourceAdded: Datasource = httpResponse.data[0].datasource;

                    if (datasourceAdded != null) {
                        let datasourceIndex: number = this.datasources.findIndex(ds => ds.id === datasourceAdded.id);
                        if (datasourceIndex < 0) {
                            this.datasources.push(datasourceAdded);
                        };
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables addDatasource ends',
                            this.concoleLogStyleForEndOfMethod,
                            "Datasource and related records saved", this.datasources)
                    };

                    resolve("success");
                },
                err => {
                    console.log('Error in Global-Variables addDatasource', err.message)
                    reject(err.message)
                }
            );

        });
    };

    saveDatasource(datasourceInput: Datasource, clientDataInput: any): Promise<string> {
        // Saves a Datasource, given the following:
        // - datasource
        // - data (only the data is used, not the IDs)
        // Note: The Server adds the records, with the correct IDs ~ that of DS
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables saveDatasource starts',
                this.concoleLogStyleForStartOfMethod,
                datasourceInput.name);
        };
        return new Promise<string>((resolve, reject) => {

            // Create Combo body
            let body: any = {
                "datasourceInput": datasourceInput,
                "clientDataInput": clientDataInput
            };

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDatasource';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl, body, {headers}).subscribe(
                httpResponse  => {

                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables saveDatasource: ' + httpResponse.message);
                        reject('Error in Global Variables saveDatasource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables saveDatasource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables saveDatasource: Data in response object is null; it should be an array');
                        return;
                    };
                    if(httpResponse.data.length == 0) {
                        console.error('Error in Global Variables saveDatasource Data in saveDatasource response object is an empty array; it should contain data');
                        reject('Error in Global Variables saveDatasource Data in saveDatasource response object is an empty array; it should contain data');
                        return;
                    };

                    // Update Datasources
                    let datasourceIndex: number = this.datasources.findIndex(
                        ds => ds.id === datasourceInput.id);
                    if (datasourceIndex < 0) {
                        this.datasources.push(datasourceInput);
                    } else {
                        this.datasources[datasourceIndex] = datasourceInput;
                    };

                    // Update CurrentDatasources
                    let currentDatasourceIndex: number = this.currentDatasources.findIndex(
                        ds => ds.id === datasourceInput.id);
                    if (currentDatasourceIndex >= 0) {
                        this.currentDatasources[currentDatasourceIndex] = datasourceInput;
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables saveDatasource ends',
                            this.concoleLogStyleForEndOfMethod,
                            "Datasource and related records saved", this.datasources, this.currentDatasources);
                    };

                    resolve("success");
                },
                err => {
                    console.error('Error in Global-Variables saveDatasource', err.message)
                    reject(err.message)
                }
            );
        });
    };
    
    deleteDatasource(datasourceID: number): Promise<string> {
        // Description: Deletes a Resources
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deleteDatasource starts',
                this.concoleLogStyleForStartOfMethod, {id: datasourceID});
        };

        if (datasourceID == null) {
            console.error('Error in Global-Variables deleteDatasource: given datasourceID should not be null');
        };

        console.time("      DURATION deleteDatasource" + datasourceID.toString());

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDatasource';
            let finalUrl: string = this.canvasServerURI + pathUrl;
            console.warn('    Global-Variables deleteDatasource finalUrl for:', finalUrl);
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + datasourceID, {headers})
            .subscribe(
                httpResponse => {
                    if(httpResponse.statusCode != 'success') {
                        console.timeEnd("      DURATION deleteDatasource" + ' ' + datasourceID.toString());
                        console.log('Error in Global Variables deleteDatasource: ' + httpResponse.message);
                        reject('Error in Global Variables deleteDatasource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.log('Error in Global Variables deleteDatasource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables deleteDatasource: Data in response object is null; it should be an array');
                        return;
                    };
                    if(httpResponse.data.length == 0) {
                        console.log('Data in deleteDatasource response object is an empty array; it should contain data');
                        reject('Data in deleteDatasource response object is an empty array; it should contain data');
                        return;
                    };

                    // Delete where DS was used in Stored Template
                    this.getResource('widgetStoredTemplates').then(swt => {
                        swt.forEach(swt => {
                            this.widgets.forEach(w => {
                                if (swt.widgetID === w.id  &&  w.datasourceID === datasourceID) {
                                    this.deleteResource('widgetStoredTemplates', swt.id);
                                };
                            });
                        });
                    });

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key === 'datasources'
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {

                                // TODO - TEST This !!!!
                                this[localVariableName] = this[localVariableName].filter(
                                    com => com.id != datasourceID
                                );
                                console.log('%c    Global-Variables deleteDatasource updated cached Memory for ',
                                    this.concoleLogStyleForCaching,
                                    'datasources row count:', this[localVariableName].length);

                            };
                        };

                        // Fix Disc
                        if (localCacheableDisc) {
                            // TODO - figure out
                        };

                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables deleteDatasource DELETED id: ',
                            this.concoleLogStyleForCaching,
                            {id: datasourceID})
                    };

                    console.timeEnd("      DURATION deleteDatasource" + datasourceID.toString());
                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.error('Error in Global-Variables deleteDatasource', err);
                    };

                    console.timeEnd("      DURATION deleteDatasource" + datasourceID.toString());
                    console.error('Error in Global-Variables deleteDatasource', err.message);
                    reject(err.message);
                }
            )
        });
    }

    getCurrentDatasource(datasourceID: number): Promise<Datasource> {
        // Add the datasource to currentDatasources array:
        // Get the .dataFull and .dataFiltered for a given DS, using the DS-Filters that
        // are active.  A DS-Filter set is determined by a Slicer.  If the Slicer is on the same
        // Dashboard, the DS-Filter set is active.  Else, it is passive.  Passive DS-Filters
        // are not applied. 
        // When there are NO DS-Filters, then .dataFull = .dataFiltered
        // Returns datasource added to currentDatasources, including data
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getCurrentDatasource starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<Datasource>((resolve, reject) => {

            // Find the DS in the currentDS array, and add if needed
            let currentDatasource: Datasource = null;
            let currentDatasourceIndex: number = this.currentDatasources
                .findIndex(ds => ds.id === datasourceID);
                console.log('xx FAILURE', this.currentDatasources, this.datasources)
            if (currentDatasourceIndex < 0) {
                let datasourceIndex: number = this.datasources
                    .findIndex(ds => ds.id === datasourceID);
                if (datasourceIndex >= 0) {
                    currentDatasource = this.datasources[datasourceIndex];
                    this.currentDatasources.push(currentDatasource)
                } else {
                    console.error('Error in Global-Variables getCurrentDatasource: Datasource does not exists in this.datasources id:', datasourceID)
                    reject('Datasource does not exist in datasources array for id: ' + datasourceID)
                };
            } else {
                currentDatasource = this.currentDatasources[currentDatasourceIndex];
            };

            // Get DS.dataFull
            this.getData('datasourceID=' + datasourceID)
                .then(res => {
                    
                    currentDatasource.dataFull = res;

                    //  Create DS.DS-Filter using active DS.DS-Filters
                    this.applyDSFilter(currentDatasource);
                    resolve(currentDatasource);

                })
                .catch(err => {
                    console.error('Error in Global-Variables getCurrentDatasource', err)
                    reject(err.message)
                })

        });
    }

    applyDSFilter(datasourceToFilter: Datasource) {
        // Apply DS-Filter set to DS.dataFull and update DS.dataFiltered for a given DS
        // When there are NO DS-Filters, then .dataFull = .dataFiltered
        // Notes: 
        // - this assumes that this.currentWidgets is already populated
        // - it applies changes to the given DS
        // - different Slicers are applied with AND (data must be in both to be included after filtering)
        // - filter items in the same Slicer are treated with OR (must be in any filter item to be included after filtering)
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables applyDSFilter starts',
                this.concoleLogStyleForStartOfMethod);
        };

        // Get IDs of all Slicers On the Dashboard
        let slicersOnDashboardIDs: number[] = this.currentWidgets
            .filter(w => w.widgetType === 'Slicer')
            .map(x => x.id);

        // Mark DS.DS-Filters in Slicers as active
        datasourceToFilter.datasourceFilters.forEach(dsf => {
            if (slicersOnDashboardIDs.indexOf(dsf.widgetID) >= 0) {
                dsf.isActive = true;
            } else {
                dsf.isActive = false;
            };
        });

        // Set dataFiltered = dataFull and return if the filter is empty
        if (datasourceToFilter.datasourceFilters == null 
            ||
            datasourceToFilter.datasourceFilters.length === 0) {
                datasourceToFilter.dataFiltered = 
                datasourceToFilter.dataFull;
                return;
        };

        // Create a unique list of Slicer IDs used in the DS-Filter
        let slicersUsedIDSet: any = new Set(datasourceToFilter.datasourceFilters
            .map(dsf => dsf.widgetID));
        let slicersUsedIDs: number[] = Array.from(slicersUsedIDSet);

        // Start with the all the data in partialDataFiltered.  Each Slicer will 
        // reduce partialDataFiltered, which will be the starting point for the 
        // next Slicer
        let partialDataFiltered: any[] = datasourceToFilter.dataFull;

        // Loop on the unique Slicers in the DS-Filter
        slicersUsedIDs.forEach(sID => {
            let dataFilterSubset: DatasourceFilter[] = datasourceToFilter
                .datasourceFilters.filter(dsf => dsf.widgetID === sID);
            
            // Filter the data on each filter item for this Slicer ID
            // Accumulate this, which means that they are treated as OR operands:
            // if data belongs to any one of the Slicer items, it is included
            let dataForOneSlicerItem: any = [];
            let allDataForThisSlicer: any = [];
            dataFilterSubset.forEach(fitem => {
                // Get dataForOneSlicerItem = partialDataFiltered.filter on
                //  filterFieldName, filterOperator, filterValue
                // allDataForThisSlicer = allDataForThisSlicer + dataForOneSlicerItem
            });

            // Afterwards, reduce the data to filter on to the above data
            // Thus, different Slicers are treated as AND operands:
            // data is only included if it belongs to all the Slicers
            // partialDataFiltered = allDataForThisSlicer
        })

    }

    applyWidgetFilter(widget: Widget) {
        // Apply W-Filter to currentDS.dataFiltered and update W.dataFiltered 
        // When there are NO W-Filters, then W.dataFiltered = DS.dataFiltered
        // Notes:
        // - assumes that currentDatasources exists, and has .dataFiltered
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables applyWidgetFilter starts',
                this.concoleLogStyleForStartOfMethod);
        };

        let currentDatasourceIndex: number = this.currentDatasources.findIndex(
            ds => ds.id === widget.datasourceID);
        let currentDatasource: Datasource = null;

        // Start with the filtered data in the related DS
        if (currentDatasourceIndex >= 0) {
            widget.dataFiltered = this.currentDatasources[currentDatasourceIndex].dataFiltered;
        } else {
            widget.dataFiltered = [];
            return;
        };

        // TODO - code in full ~ maybe done in W Ed already ...

    }

    actionWebSocket(webSocketMessage: WebSocketMessage) {
        // Handles all the WebSocket messages, depending on the type messageType and Action
        // It is async, so returns a Promise<boolean>
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables actionWebSocket starts',
                this.concoleLogStyleForStartOfMethod);
        };

        // Handle each messageType
        if (webSocketMessage.messageType === 'canvasData') {
            // Canvas-related data like dashboards, datasources, widgets, etc
            //   Actions: Individual record action: Add, Update, Delete.  Whole resource: ReplaceAll

            // Find object in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key === webSocketMessage.objectName
            );

            // If in CachingTable, update locally
            if (dataCachingTableIndex >= 0) {

                // Set vars to use here
                let localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                let localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                let localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                let localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                let localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;

                // Add an object
                if (webSocketMessage.action.toLowerCase() === 'add') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id === webSocketMessage.objectID);

                            if (localVarIndex < 0) {
                                this[localVariableName].push(webSocketMessage.content);
                            };
                        };

                        // Update Current Var
                        // TODO - consider this carefully: dont think we should add stuff to
                        // currentVars, ie currentDashboards = current D selected by user
                        console.log('xx actionWebSocket ADD Memory Updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .put(webSocketMessage.content)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx actionWebSocket Add Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                };

                // Update an object
                if (webSocketMessage.action.toLowerCase() === 'update') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id === webSocketMessage.objectID);

                            if (localVarIndex >0) {
                                this[localVariableName][localVarIndex] = webSocketMessage.content;
                            };
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            let localCurrentVarIndex: number = this[localCurrentVariableName].findIndex(
                                lv => lv.id === webSocketMessage.objectID);

                            if (localCurrentVarIndex >0) {
                                this[localCurrentVariableName][localCurrentVarIndex] = webSocketMessage.content;
                            };
                        };
                        console.log('xx actionWebSocket UPDATE Memory Updated', this[localCurrentVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                    if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(webSocketMessage.objectID)
                                .put(webSocketMessage.content)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx actionWebSocket UPDATE Disc count @ end ', res);
                                    });
                            });
                        };
                    };
                }

                // Delete an object
                if (webSocketMessage.action.toLowerCase() === 'delete') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            this[localVariableName] = this[localVariableName].filter(
                                lv => {
                                    return lv.id != webSocketMessage.objectID
                                });
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            this[localCurrentVariableName] = this[localCurrentVariableName].filter(
                                lv => {
                                    return lv.id != webSocketMessage.objectID
                                });
                        };
                        console.log('xx actionWebSocket DELETE Memory updated', this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {
                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(webSocketMessage.objectID)
                                .delete()
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.warn('xx actionWebSocket DELETE count @end', res);
                                    });
                            });
                        };
                    };
                };

                // Update dataCaching in Memory
                let dt: Date = new Date();
                let seconds: number = 86400;
                if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                    seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                };
                this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                    this.dateAdd(dt, 'second', seconds);
                this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                    webSocketMessage.messageDateTime;
                console.log('xx actionWebSocket dataCachingTable memory upd', this.dataCachingTable)


                // Update dataCaching on Disc
                this.dbDataCachingTable.table("localDataCachingTable")
                    .bulkPut(this.dataCachingTable)
                    .then(res => {
                        this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                            console.warn('xx actionWebSocket localDataCachingTable count @end', res);
                        });
                });

            };

            // If Dashboard is currently open

            // Warn user
            if(this.currentDashboardInfo.value != null) {
                if (webSocketMessage.objectName === 'dashboards'
                    &&
                    webSocketMessage.objectID === this.currentDashboardInfo.value.currentDashboardID) {
                        this.showStatusBarMessage(
                            {
                                message: 'This Dashboard has been changed',
                                uiArea: 'StatusBar',
                                classfication: 'Warning',
                                timeout: 3000,
                                defaultMessage: ''
                            }
                        );
                };
            };

            // Force refresh of Dashboard if critical
            // Consider carefulle:
            // - usecase for this
            // - how to do this elegantly, so that user is not surprised, or loses work if
            //   busy editing (which edits should not be accepted anyways)
        };

        if (webSocketMessage.messageType === 'clientData') {
            // client-related data, ie XIS Trades
            //   Actions: Refresh
        };

        if (webSocketMessage.messageType === 'canvasMessages') {
            // collaboration via Canvas Messages
            //   Actions: NewMessage
            this.hasNewMessage.next(true);
        };

        if (webSocketMessage.messageType === 'canvasSystem') {
            //system generated messages, ie from the server
            //   Actions: undetermined at the moment
        };

        return new Promise<string>((resolve, reject) => {
            // Handle the different websocket messages
            // Return a string with the error message if not okay

            setTimeout( () => {
                resolve('Success');
            }, 3000);
        });
    }

    getResource(resource: string = '', params: string = ''): Promise<any> {
        // Description: Gets the data (either from cached or HTTP), and updates
        // variables this.resource (ie this.dashboards)and cache (if from HTTP and cacheable)

        // Note: in order to use a resource, it must be defined in the Dexie.ts file.
        //       Also, it may be necessary to delete the whole IndexedDB before adding new tables ...
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getResource starts',
                this.concoleLogStyleForStartOfMethod, {resource});
        };
        console.time("      DURATION getResource: " + resource);

        return new Promise<any>((resolve, reject) => {

            // Assume worse case that all has to be obtained from HTTP server
            let isFresh: boolean = false;
            let localCacheableMemory: boolean = false;
            let localCacheableDisc: boolean = false;
            let localVariableName: string = null;
            let localCurrentVariableName: string = '';
            let localTableName: string = '';

            // Find DS in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key === resource
            );

            if (dataCachingTableIndex >= 0) {

                // Get var and table names
                localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                console.log('%c    Global-Variables getResource - inside dataCachingTableIndex for: ',
                    this.concoleLogStyleForCaching,
                    resource, {dataCachingTableIndex}, {localCacheableMemory},
                    {localCacheableDisc}, {localVariableName});

                // Local Memory is used, if fresh
                if (localCacheableMemory  ||  localCacheableDisc) {
                    console.log('%c    Global-Variables getResource - In local Memory or Disc for Resource: ',
                        this.concoleLogStyleForCaching,
                        resource, localVariableName,
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime)

                    // Fresh if not expired as yet
                    let dateNow: Date = new Date();
                    let timeNow: number = dateNow.getTime()
                    let dateCaching: Date = new Date(this.dataCachingTable[dataCachingTableIndex]
                        .localExpiryDateTime);
                    let timeCaching: number = dateCaching.getTime();
                    if (timeCaching >= timeNow) {
                        isFresh = true;
                    } else {
                        isFresh = false;
                    };

                    // console.log('xx actionWebSocket fresh variables for :', resource, {dateNow}, {timeNow}, {dateCaching}, {timeCaching}, isFresh)
                    // Use local cache variable or table if fresh
                    // TODO - check the assumption that there is data when fresh (else returns [])
                    if (isFresh) {
                        console.log('%c    Global-Variables getResource - cache is FRESH for: ',
                            this.concoleLogStyleForCaching,
                            resource)

                        // Get from Memory (local var)
                        if (localCacheableMemory) {

                            if (localVariableName != null) {
                                // var type = 'article';
                                // this[type+'_count'] = 1000;  // in a function we use "this";
                                // alert(this.article_count);

                                // Set to the full set, and then sortFilter if requested
                                let results: any = this[localVariableName];
                                if (params != '') {
                                    results = this.sortFilterFieldsAggregate(
                                        results,
                                        params);
                                };

                                console.log('%c    Global-Variables getResource - data returned from Memory for : ',
                                    this.concoleLogStyleForCaching,
                                    resource);

                                console.timeEnd("      DURATION getResource: " + resource);

                                resolve(results)
                                // resolve(this[localVariableName]);
                                return;
                            };
                        } else if (localCacheableDisc) {
                            // Get from Disc (Dexie)
                            if (localTableName != null) {
                                console.log('%c    Global-Variables getResource - in local Disc for: ',
                                    this.concoleLogStyleForCaching,
                                    resource);
                                this.dbCanvasAppDatabase.table(localTableName)
                                .toArray()
                                .then(res => {
                                    this[localVariableName] = res;
                                    console.log('%c    Global-Variables getResource - data returned from Disc for: ',
                                        this.concoleLogStyleForCaching,
                                        resource)
                                    console.timeEnd("      DURATION getResource: " + resource);
                                    resolve(this[localVariableName]);
                                    return;
                                });
                            };
                            //  Return, else goes through to HTTP (its async)
                            // console.timeEnd("      DURATION getResource: " + resource);
                            // return;
                        };
                    };
                };
            };
            console.log('%c    Global-Variables getResource - Will now try GET HTTP for: ',
                this.concoleLogStyleForCaching,
                resource)

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            // Get from HTTP server
            let pathUrl: string = resource + params;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            console.warn('    Global-Variables getResource finalUrl for:',
                resource, finalUrl);
            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {

                    if(httpResponse.statusCode != 'success') {
                        console.timeEnd("      DURATION getResource: " + resource);
                        console.error('Error in Global Variables getResource: ' + httpResponse.message);
                        reject('Error in Global Variables getResource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getResource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getResource: Data in response object is null; it should be an array');
                        return;
                    };

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {
                                this[localVariableName] = [];
                                this[localVariableName] = httpResponse.data;
                                let rowCount: number = -1;
                                if (httpResponse.data != null) {
                                    rowCount = httpResponse.data.length;
                                };
                                console.log('%c    Global-Variables getResource updated cached Memory for ',
                                    this.concoleLogStyleForCaching,
                                    resource,'row count:', rowCount, this[localVariableName]);
                            };

                            // TODO - should we fill Current Var here a well?
                        };

                        // Fill Disc
                        if (localCacheableDisc) {

                            if (localTableName != null) {

                                this.dbCanvasAppDatabase.table(localTableName).clear().then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName)
                                    .bulkPut(httpResponse.data)
                                    .then(resPut => {

                                        // Count
                                        this.dbCanvasAppDatabase.table(localTableName)
                                            .count(resCount => {
                                                console.log('%c    Global-Variables getResource updated local Disc for:',
                                                    this.concoleLogStyleForCaching,
                                                    resource, 'rowCount:', resCount);
                                        });
                                    });
                                });
                            };
                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.log('%c    Global-Variables getResource dataCachingTable updated with bulkPut for resource ',
                                        this.concoleLogStyleForCaching, resource, ', recordCount = ',
                                        res);
                                });
                        });
                    };

                    console.log('%c    Global-Variables getResource data retured from HTTP for: ',
                        this.concoleLogStyleForCaching,
                        resource, httpResponse.data, this.datasourcePermissions);
                    console.timeEnd("      DURATION getResource: " + resource);
                    resolve(httpResponse.data);
                    return;
                },
                err => {
                    console.timeEnd("      DURATION getResource: " + resource);
                    console.error('Error in Global-Variables getResource', err);
                    reject(err.message)
                }
            );

        });
    }

    addResource(resource: string = '', data: any): Promise<any> {
        // Description: Adds a new Resource
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables addResource starts',
                this.concoleLogStyleForStartOfMethod, {resource}, {data});
        };
        var now = new Date();
        let unique: number = now.getMinutes() + now.getSeconds() + now.getMilliseconds();
        console.time("      DURATION addResource " + resource + ' ' + unique.toString());

        return new Promise<any>((resolve, reject) => {

            // Get from HTTP server
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            console.warn('    Global-Variables addResource finalUrl for:', resource, finalUrl);

            this.http.post<CanvasHttpResponse>(finalUrl, data, {headers}).subscribe(
                httpResponse  => {
                    console.log('%c    Global-Variables addResource - inside POST HTTP, return:',
                        this.concoleLogStyleForCaching, httpResponse);

                    if(httpResponse.statusCode != 'success') {
                        console.timeEnd("      DURATION addResource " + resource + ' ' + unique.toString());
                        console.error('Error in Global Variables addResource: ' + httpResponse.message);
                        reject('Error in Global Variables addResource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables addResource: : Data in response object is null; it should be an array');
                        reject('Error in Global Variables addResource: : Data in response object is null; it should be an array');
                        return;
                    };
                    if(httpResponse.data.length == 0) {
                        console.error('Error in Global Variables addResource: : Data in response object is an empty array; it should contain data');
                        reject('Error in Global Variables addResource: : Data in response object is an empty array; it should contain data');
                        return;
                    };
                console.log('xx httpResponse.data[0].id', httpResponse.data[0].id)
                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key === resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {

                                let localIndex: number = this[localVariableName].findIndex(rec =>
                                    rec.id === httpResponse.data[0].id
                                );

                                if (localIndex >= 0) {
                                    this[localVariableName][localIndex] = httpResponse.data[0];
                                } else {
                                    this[localVariableName].push(httpResponse.data[0]);
                                }
                                console.log('%c    Global-Variables addResource updated cached Memory for:',
                                    this.concoleLogStyleForCaching,
                                    resource, ' to', this[localVariableName]);
                            };

                            // TODO - should we fill Current Var here as well?  Dont think so ...
                            //        at best, only for certain things, ie D that is open ...
                        };

                        // Fill Disc
                        if (localCacheableDisc) {

                            if (localTableName != null) {
                                // this.dbCanvasAppDatabase = new CanvasAppDatabase
                                // this.dbCanvasAppDatabase.open();

                                this.dbCanvasAppDatabase.table(localTableName).clear().then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName)
                                    .bulkPut(httpResponse.data[0])
                                    .then(resPut => {

                                        // Count
                                        this.dbCanvasAppDatabase.table(localTableName)
                                            .count(resCount => {
                                                console.log('%c    Global-Variables addResource updated local Disc for:',
                                                    this.concoleLogStyleForCaching,
                                                    resource, 'to', resCount);
                                        });
                                    });
                                });
                            };
                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();
                        console.log('%c    Global-Variables addResource dataCachingTable updated in Memory for:',
                            this.concoleLogStyleForCaching,
                            resource, 'to', this.dataCachingTable)

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.log('%c    Global-Variables addResource dataCachingTable updated on Disc for: ',
                                        this.concoleLogStyleForCaching,
                                        resource, 'count @end:', res);
                                });
                        });
                    };

                    console.log('%c    Global-Variables addResource data retured from HTTP',
                        this.concoleLogStyleForCaching,
                        httpResponse.data[0]);
                    console.timeEnd("      DURATION addResource " + resource + ' ' + unique.toString());
                    resolve(httpResponse.data[0]);
                    return;
                },
                err => {
                    console.timeEnd("      DURATION addResource " + resource + ' ' + unique.toString());
                    console.error('Error in Global-Variables addResource', err);
                    reject(err.message)
                }
            );

        });
    }

    saveResource(resource: string = '', data: any): Promise<string> {
        // Description: Saves Resource
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables saveResource starts',
                this.concoleLogStyleForStartOfMethod, {resource}, {data});
        };
        console.time("      DURATION saveResource " + resource + ' ' + data.id.toString());

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            // Set final path
            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            console.warn('    Global-Variables saveResource finalUrl for:', resource, finalUrl);

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };
            delete copyData._id;

            this.http.put<CanvasHttpResponse>(finalUrl + '?id=' + copyData.id, copyData, {headers})
            .subscribe(
                httpResponse => {
                    if(httpResponse.statusCode != 'success') {
                        console.timeEnd("      DURATION saveResource " + resource + ' ' + data.id.toString());
                        console.error('Error in Global Variables saveResource: ' + httpResponse.message);
                        reject('Error in Global Variables saveResource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables saveResource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables saveResource: Data in response object is null; it should be an array');
                        return;
                    };

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key === resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;

                        // Fill local Vars
                        if (localCacheableMemory) {

                            // Update the main variable if cached
                            if (localVariableName != null  &&  localVariableName) {

                                // Replace local
                                // TODO - TEST This !!!!
                                let localIndex: number = this[localVariableName].findIndex(rec =>
                                    rec.id === data.id
                                );
                                if (localIndex >= 0) {
                                    this[localVariableName][localIndex] = data;
                                };
                                console.log('%c    Global-Variables saveResource updated cached Memory for:',
                                    this.concoleLogStyleForCaching,
                                    resource, 'to', this[localVariableName]
                                    );
                            };

                            // Update the Current Variable - currently this is only used for
                            // the currentDashboard and its core entities that are cached in
                            // memory.  There should be no currentXXX vars for any other
                            // Entitiy.  2019-03-02
                            if (localCurrentVariableName != null  &&  localCurrentVariableName) {

                                // Replace local
                                // TODO - TEST This !!!!
                                let localIndex: number = this[localCurrentVariableName].findIndex(rec =>
                                    rec.id === data.id
                                );
                                if (localIndex >= 0) {
                                    this[localCurrentVariableName][localIndex] = data;
                                };
                                console.log('%c    Global-Variables saveResource updated CURRENT cached Memory for:',
                                    this.concoleLogStyleForCaching,
                                    resource, 'to', this[localCurrentVariableName]
                                    ,this.currentDashboardTabs
                                    );
                            };
                        };

                        // Update all records on Disc cache
                        // It must be defined in the dexie.ts class, with an id col which
                        // is also contained in the object to write ...
                        // TODO - what if not cached in MEM but only on Disc !!
                        if (localCacheableDisc) {

                            if (localTableName != null) {
                                this.dbCanvasAppDatabase.table(localTableName)
                                .bulkPut(this[localVariableName])
                                .then(resPut => {

                                    // Count
                                    this.dbCanvasAppDatabase.table(localTableName)
                                        .count(resCount => {
                                            console.log('%c    Global-Variables addResource updated local Disc for:',
                                                this.concoleLogStyleForCaching,
                                                resource, 'to', resCount);
                                    });
                                });
                            };

                        };

                        // Update dataCaching in Memory
                        let dt: Date = new Date();
                        let seconds: number = 86400;
                        if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                            seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                        };
                        this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                            this.dateAdd(dt, 'second', seconds);
                        this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                            new Date();
                        console.log('%c    Global-Variables saveResource - dataCachingTable memory upd',
                            this.concoleLogStyleForCaching,
                            this.dataCachingTable)

                        // Update dataCaching on Disc
                        this.dbDataCachingTable.table("localDataCachingTable")
                            .bulkPut(this.dataCachingTable)
                            .then(res => {
                                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    console.log('%c    Global-Variables saveResource updataCachingTable updated count @end',
                                        this.concoleLogStyleForCaching,
                                        res);
                                });
                        });
                    };

                    if (this.sessionDebugging) {
                        console.log('saveResource SAVED', {data})
                    };

                    console.timeEnd("      DURATION saveResource " + resource + ' ' + data.id.toString());
                    resolve('Saved');
                },
                err => {
                    console.timeEnd("      DURATION saveResource " + resource + ' ' + data.id.toString());
                    console.error('Error in Global-Variables saveResource', err);
                    reject(err.message);
                }
            )
        });
    }

    deleteResource(resource: string = '', id: number): Promise<string> {
        // Description: Deletes a Resources
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deleteResource starts',
                this.concoleLogStyleForStartOfMethod, {resource}, {id});
        };
        console.time("      DURATION deleteResource" + resource +  ' ' + id.toString());

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = resource;
            let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
            console.warn('    Global-Variables deleteResource finalUrl for:', resource, finalUrl);
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
            .subscribe(
                httpResponse => {
                    if(httpResponse.statusCode != 'success') {
                        console.timeEnd("      DURATION deleteResource" + resource +  ' ' + id.toString());
                        console.error('Error in Global Variables deleteResource: ' + httpResponse.message);
                        reject('Error in Global Variables deleteResource: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables deleteResource: Data in response object is null; it should be an array');
                        reject('Error in Global Variables deleteResource: Data in response object is null; it should be an array');
                        return;
                    };

                    // Update NrComments field if a W is linked
                    // TODO - how do we fix this !!!???
                    // if (widgetID != null) {
                    //     this.widgets.forEach(w => {
                    //         if (w.id === widgetID) {
                    //             w.nrComments = w.nrComments - 1;
                    //         };
                    //     });
                    // };

                    // Assume worse case that all has to be obtained from HTTP server
                    let isFresh: boolean = false;
                    let localCacheableMemory: boolean = false;
                    let localCacheableDisc: boolean = false;
                    let localVariableName: string = null;
                    let localCurrentVariableName: string = '';
                    let localTableName: string = '';

                    // Find DS in localCachingTable
                    let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                        dct.key === resource
                    );

                    // If cached, fill local info
                    if (dataCachingTableIndex >= 0) {
                        localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                        localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                        localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;
                        localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                        localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;

                        // Fill local Vars
                        if (localCacheableMemory) {

                            if (localVariableName != null) {

                                // TODO - TEST This !!!!
                                this[localVariableName] = this[localVariableName].filter(
                                    com => com.id != id
                                );
                                console.log('%c    Global-Variables deleteResource updated cached Memory for ',
                                    this.concoleLogStyleForCaching,
                                    resource,'row count:', this[localVariableName].length);

                            };
                        };

                        // Fix Disc
                        if (localCacheableDisc) {
                            // TODO - figure out
                        };

                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables deleteResource DELETED id: ',
                            this.concoleLogStyleForCaching,
                            {id})
                    };

                    console.timeEnd("      DURATION deleteResource" + resource +  ' ' + id.toString());
                    resolve('Deleted');
                },
                err => {
                    if (this.sessionDebugging) {
                        console.error('Error in Global-Variables deleteResource', err);
                    };

                    console.timeEnd("      DURATION deleteResource" + resource +  ' ' + id.toString());
                    console.error('Error in Global Variables deleteResource: ', err.message);
                    reject(err.message);
                }
            )
        });
    }

    dashboardCopy(originalDashboardID: number, newName: string, newState: string): Promise<any> {
        // Description: Gets all D
        // Returns: this.dashboards array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables dashboardCopy starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<any>((resolve, reject) => {

            if (newName == null) {
                newName = ''
            };

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDashboardCopy?originalDashboardID='
                + originalDashboardID + "&newName=" + newName + "&newState=" + newState;
            let finalUrl: string = this.canvasServerURI + pathUrl;
            console.log('finalUrl', finalUrl)
            this.http.post<CanvasHttpResponse>(finalUrl, "", {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables dashboardCopy: ' + httpResponse.message);
                        reject('Error in Global Variables dashboardCopy: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables dashboardCopy: Data in response object is null; it should be an array');
                        reject('Error in Global Variables dashboardCopy: Data in response object is null; it should be an array');
                        return;
                    };
                     
                    // TODO - make this DRY
                    // Add / Amend the cache
                    if (newState === 'Draft') {
                        let dashboardIndex: number = this.dashboards.findIndex(
                            d => d.id === originalDashboardID
                        );
                        if (dashboardIndex >= 0) {
                            this.dashboards[dashboardIndex].draftID = httpResponse.data[0].dashboard.id;
                        };
                    };

                    this.dashboards.push(httpResponse.data[0].dashboard);
                    this.currentDashboards.push(httpResponse.data[0].dashboard);
                    httpResponse.data[0].dashboardTabs.forEach(tab =>
                        {
                            this.dashboardTabs.push(tab);
                            this.currentDashboardTabs.push(tab);
                        }
                    );
                    httpResponse.data[0].widgets.forEach(widget =>
                        {
                            this.widgets.push(widget);
                            this.currentWidgets.push(widget);
                        }
                    );
                    httpResponse.data[0].widgetCheckpoints.forEach(widgetCheckpoint =>
                        {
                            this.widgetCheckpoints.push(widgetCheckpoint);
                            this.currentWidgetCheckpoints.push(widgetCheckpoint);
                        }
                    );

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables dashboardCopy ends',
                            this.concoleLogStyleForEndOfMethod,
                            "Draft created for current Dashboard", this.currentDashboardTabs)
                    };

                    resolve(httpResponse.data[0]);
                },
                err => {
                    console.error('Error in Global Variables dashboardCopy:', err.message)
                    reject(err.message)
                }
            );
        });
    }

    letDashboard(dashboardID: number = null): Dashboard {
        // Returns the given D from the internal arrays
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables letDashboard starts',
                this.concoleLogStyleForStartOfMethod,
                {dashboardID});
        };

        // Set to current if none provided
        if (dashboardID == null) {
            dashboardID = this.currentDashboardInfo.value.currentDashboardID;
        };

        // Get D
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id === dashboardID);
        if (dashboardIndex >= 0) {

            if (this.sessionDebugging) {
                console.log('%c    Global-Variables letDashboard ends',
                    this.concoleLogStyleForEndOfMethod,
                    this.dashboards[dashboardIndex])
            };

            return this.dashboards[dashboardIndex];
        } else {
            alert ('Dashboard ID ' + dashboardID.toString() + ' does not exist in the dashboards array - should be impossible');
            return null;
        };
    }

    discardDashboard(): Promise<number> {
        // Discards the Current Draft Dashboard, which means all changes are deleted
        // Returns true if successfull

        if (this.sessionDebugging) {
            console.log('%c  Global-Variables discardDashboard starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<number>((resolve, reject) => {

            // 1. Update the Original/Draft ids on the original
            let draftDashboardID: number = this.currentDashboardInfo.value.currentDashboardID;
            let draftDashboard: Dashboard = this.letDashboard(draftDashboardID);
            let originalDashboard: Dashboard = this.letDashboard(draftDashboard.originalID);
            let originalDashboardID: number = originalDashboard.id;

            if (draftDashboard.state != 'Draft') {
                console.error('Error deleting discardDashboard: This is not a draft Dashboard');
                reject('Error deleting discardDashboard: This is not a draft Dashboard');
            };

            // Clear related Actions in Memory
            this.actions = this.actions.filter(act => act.dashboardID != draftDashboardID);

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDashboardDiscard';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?draftDashboardID='
                + draftDashboardID + '&originalDashboardID=' + originalDashboardID, null, {headers})
                .subscribe(
                    httpResponse => {
                        if(httpResponse.statusCode != 'success') {
                            console.error('Error deleting discardDashboard: '+ httpResponse.message);
                            reject('Error deleting discardDashboard: '+ httpResponse.message);
                        };
                        if(httpResponse.data == null) {
                            console.error('Error in Global Variables discardDashboard: Data in response object is null; it should be an array');
                            reject('Error in Global Variables discardDashboard: Data in response object is null; it should be an array');
                            return;
                        };
    
                        // TODO - make this DRY
                        // Add / Amend the cache
                        let draftDashboardIndex: number = this.dashboards.findIndex(
                            d => d.id === draftDashboardID
                        );
                        if (draftDashboardIndex >= 0) {
                            let originalDashboardIndex: number = this.dashboards.findIndex(
                                d => d.id === this.dashboards[draftDashboardIndex].originalID
                            );
                            if (originalDashboardIndex >= 0) {
                                this.dashboards[originalDashboardIndex].draftID = null;
                            };
                        };

                        console.log('%c    Global-Variables discardDashboard - start resetting cache in Memory & Disc to dirty ...',
                            this.concoleLogStyleForCaching);
                        for (var i = 0; i < this.dataCachingTable.length; i++) {

                            // Update dataCaching in Memory
                            this.dataCachingTable[i].localExpiryDateTime = new Date();

                            // Update dataCaching on Disc
                            this.dbDataCachingTable.table("localDataCachingTable")
                                .bulkPut(this.dataCachingTable)
                                .catch(err => {
                                    console.error('Error in Global-Variables discardDashboard', err)
                                    reject(err.message)
                                });

                        };

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables discardDashboard ends',
                                this.concoleLogStyleForEndOfMethod,
                                '?draftDashboardID=' + draftDashboardID
                                + '&originalDashboardID=' + originalDashboardID)
                        };

                        resolve(originalDashboardID);
                    },
                    err => {
                        console.error('Error in Global-Variables discardDashboard', err);
                        reject('Error discardDashboard : ' + err.message);
                    }
                )
        })
    }

    saveDraftDashboard(deleteSnapshots: boolean): Promise<number> {
        // saves Draft Dashboard back to the original, keeping all changes
        // Returns original dashboardID (for the current Draft D)

        // The following are unmodified:
        // - the AuditTrails are kept against the Draft

        if (this.sessionDebugging) {
            console.log('%c  Global-Variables saveDraftDashboard starts',
                this.concoleLogStyleForStartOfMethod,
                {deleteSnapshots});
        };

        // Change the D
        return new Promise<number>((resolve, reject) => {

            // 1. Update the Original/Draft ids on the original
            let draftDashboardID: number = this.currentDashboardInfo.value.currentDashboardID;
            let draftDashboard: Dashboard = this.letDashboard(draftDashboardID);
            let originalDashboard: Dashboard = this.letDashboard(draftDashboard.originalID);
            let originalDashboardID: number = originalDashboard.id;

            if (draftDashboard.state != 'Draft') {
                console.error('Error in  Global-Variables saveDraftDashboard: This is not a draft Dashboard');
                reject('Error in  Global-Variables saveDraftDashboard: This is not a draft Dashboard');
            };

            // Clear related Actions in Memory
            this.actions = this.actions.filter(act => act.dashboardID != draftDashboardID);

            // Reset all the cached to Dirty
            // TODO - make this faster as and when required
            console.log('%c    Global-Variables saveDraftDashboard - start resetting cache in Memory & Disc to dirty ...',
                this.concoleLogStyleForCaching);
            for (var i = 0; i < this.dataCachingTable.length; i++) {

                // Update dataCaching in Memory
                this.dataCachingTable[i].localExpiryDateTime = new Date();

                // Update dataCaching on Disc
                this.dbDataCachingTable.table("localDataCachingTable")
                    .bulkPut(this.dataCachingTable)
                    .catch(err => {
                        console.error('Error in  Global-Variables saveDraftDashboard', err)
                        reject(err.message)
                    });

            };

            // Perform steps (business logic in Server)
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDashboardSaveDraft';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?draftDashboardID='
                + draftDashboardID + '&originalDashboardID=' + originalDashboardID, null, {headers})
                .subscribe(
                    httpResponse => {
                        if(httpResponse.statusCode != 'success') {
                            console.error('Error in Global Variables saveDraftDashboard: '+ httpResponse.message);
                            reject('Error in Global Variables saveDraftDashboard: '+ httpResponse.message);
                        };
                        if(httpResponse.data == null) {
                            console.error('Error in Global Variables saveDraftDashboard: Data in response object is null; it should be an array');
                            reject('Error in Global Variables saveDraftDashboard: Data in response object is null; it should be an array');
                            return;
                        };

                        // Update Original D in Memory
                        let dashboardIndex: number = this.dashboards.findIndex(d =>
                            d.id === originalDashboardID);
                        if (dashboardIndex >= 0) {
                            this.dashboards[dashboardIndex].draftID = null;
                        };

                        // Remove Draft from Memory
                        this.dashboards = this.dashboards.filter(
                            d => d.id != draftDashboardID
                        );
                        this.currentDashboards = this.currentDashboards.filter(
                            d => d.id != draftDashboardID
                        );

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables saveDraftDashboard ends',
                                this.concoleLogStyleForEndOfMethod,
                                '?draftDashboardID=' + draftDashboardID
                                + '&originalDashboardID=' + originalDashboardID)
                        };

                        resolve(originalDashboardID);
                    },
                    err => {
                        console.error('Error in Global-Variables saveDraftDashboard', err);
                        reject('Error saveDraftDashboard : ' + err.message);
                    }
                )

        });
    }

    // Treatment of Dashboard and related entities:
    // Background: A Dashboard is logically seen as one concept, but lives in the database
    // in different entities, called the core entities.  These core entities should be logically
    // treated as one unit.  A Dashboard can have further sets of information, like schedules.
    // These are called related entities, and are optional.  There are other (non-Dashboard) entities
    // that may be linked to a Dashboard (for example the user record may point to a startup Dashboard).
    // These are called linked entities.
    //
    // This doc explains:
    // 1. the core entities contained in a new Dashboard (Draft or copy created with SaveAs)
    // 2. how related entities are treated in the different processes for Dashboards
    //    (creating, discarding and saving a Draft, copying a Complete Dashboard)
    // Note: a Dashboard has two states: Complete and Draft

    // Special routes:
    //      - Edit Dashboard, which creates the Draft Dashboard (canvasDashboardCopy)
    //      - Discard Draft Dashboard (canvasDashboardDiscard)
    //      - Delete Dashboard with related entities (canvasDashboardDelete)
    //      - Save Draft Dashboard, to Complete (canvasDashboardSaveDraft)
    //      - SaveAs Dashboard, making a copy of the Complete Dashboard (canvasDashboardSaveAs)

    // 1. Core Entities are created when a Draft Dashboard is created, or a Dashboard is copied:
    //      Dashboards
    //      DashboardTabs
    //      Widgets
    //      WidgetCheckpoints
    //      WidgetLayout
    //
    //   Edit (create Draft):
    //    - These entities are copied to the new Dashboard from the Original Dashboard, with new IDs.
    //    - new state = Draft
    //    - The new IDs are linked, W -> T -> D -> W-Chk.
    //   Discard:
    //    - original/draft IDs updated on the Original Dashboard
    //    - The Draft Dashboard and core entities are deleted
    //   Save Draft (to Complete):
    //    - the Original (Complete) Dashboard record content is updated with Draft content, and
    //      original/draft IDs updated on the Original Dashboard
    //    - link core entities (Tabs, Widgets, WidgetCheckpoints) to the Original Dashboard
    //      (thus the previous Draft Widgets are now linked to the Original Dashboard)
    //    - Delete one Draft core entity: Dashboard
    //    - Delete three Orignal core entities: Tabs, Widgets, WidgetCheckpoints
    //   Delete (Original):
    //    - The Dashboard and core entities are deleted
    //   SaveAs (copy a Complete Dashboard):
    //    - These entities are copied to the new Dashboard when created, with new IDs.
    //    - The new IDs are linked, W -> T -> D -> W-Chk.
    //    - the new state = Complete

    // 2. Related Entities can be linked to a Draft and Complete Dashboard, but are deleted when the
    //    Draft Dashboard is deleted.  The rational for this is that these entities are instance
    //    specific - they are useful only for the Draft Dashboard:
    //      DashboardSnapshots
    //      DashboardSchedules
    //      DashboardScheduleLog
    //      DashboardSubscriptions
    //      DashboardTags
    //      DashboardPermissions
    //      DashboardUsedAsFavourite
    //      DashboardLayout - TODO, this must be redesigned !
    //
    //   Edit (create Draft):
    //    - No action
    //   Discard:
    //    - Delete these entities
    //   Save Draft (to Complete):
    //    - Delete these entities
    //   Delete (Original):
    //    - Delete these entities
    //   SaveAs (copy a Complete Dashboard):
    //    - These entities are NOT copied - TODO is this correct ???
    //
    // 3. Entities that can be linked to a Draft, and are re-linked to the Original Dashboard
    //    when the Draft is deleted.  These links point the the Dashboard as a whole, irrespective
    //    of the state (so a link to Draft should translate to a link to Complete):
    //      CanvasComments
    //      CanvasMessages
    //      CanvasTasks
    //      HyperlinkedWidgets
    //      UsedAsStartup
    //      UsedAsTemplate
    //
    //   Edit (create Draft):
    //    - No action
    //   Discard:
    //    - Re-link these entities to the Original Dashboard
    //   Save Draft (to Complete):
    //    - Re-link these entities to the Original Dashboard
    //   Delete (Original):
    //    - Make the link null
    //   SaveAs (copy a Complete Dashboard):
    //    - No action

    // 4. General entities that can be linked to Draft and must be deleted when the Draft
    //    Dashboard is deleted.
    //      DashboardRecent
    //      StatusBarMessageLog
    //      CanvasActions
    //
    //   Edit (create Draft):
    //    - No action (add record to Recent list)
    //   Discard:
    //    - Delete these entities
    //   Save Draft (to Complete):
    //    - Delete these entities
    //   Delete (Original):
    //    - Null the D-id for these entities
    //   SaveAs (copy a Complete Dashboard):
    //    - No action

    // TODO - finish these once overall design is done !
    // DatasourceFilter                    Delete  -
    // Combinations                  ?     Not Sure !!!

    deleteDashboardInfo(dashboardID: number): Promise<string> {
        // Deletes D with all related Entities
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deleteDashboardInfo starts',
                this.concoleLogStyleForStartOfMethod,
                {dashboardID});
        };

        // NB: has to be in synch with route canvasDashboardDelete !!!!!
        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDashboardDelete';
            let finalUrl: string = this.canvasServerURI + pathUrl;
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + dashboardID, {headers})
                .subscribe(
                    httpResponse => {
                        if(httpResponse.statusCode != 'success') {
                            console.error('Error in Global Variables deleteDashboardInfo: ' + httpResponse.message);
                            reject('Error in Global Variables deleteDashboardInfo: ' + httpResponse.message);
                            return;
                        };
                        if(httpResponse.data == null) {
                            console.error('Error in Global Variables deleteDashboardInfo: Data in response object is null; it should be an array');
                            reject('Error in Global Variables deleteDashboardInfo: Data in response object is null; it should be an array');
                            return;
                        };

                        // Remove where D used as template
                        this.dashboards.forEach(d => {
                            if (d.templateDashboardID === dashboardID) {
                                d.templateDashboardID = null;
                            };
                        });
                        this.currentDashboards.forEach(d => {
                            if (d.templateDashboardID === dashboardID) {
                                d.templateDashboardID = null;
                            };
                        });

                        // Remove where D was used for hyperlink
                        this.widgets.forEach(w => {
                            if (w.hyperlinkDashboardID === dashboardID) {
                                w.hyperlinkDashboardID = null;
                            };
                        });
                        this.currentWidgets.forEach(w => {
                            if (w.hyperlinkDashboardID === dashboardID) {
                                w.hyperlinkDashboardID = null;
                            };
                        });

                        // Remove where D was used as fav, startup
                        this.canvasUsers.forEach(u => {
                            if (u.preferenceStartupDashboardID === dashboardID) {
                                u.preferenceStartupDashboardID = null;
                            };
                            u.favouriteDashboards.filter(f => f != dashboardID)
                            // TODO - improve this to not update ALL users
                        });

                        // Remove from D-Recent
                        this.dashboardsRecent = this.dashboardsRecent.filter(
                            d => d.dashboardID != dashboardID
                        );

                        // Remove from Ds
                        this.dashboards = this.dashboards.filter(
                            d => d.id != dashboardID
                        );
                        this.currentDashboards = this.currentDashboards.filter(
                            d => d.id != dashboardID
                        );

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables deleteDashboardInfo ends',
                                this.concoleLogStyleForEndOfMethod,
                                dashboardID)
                        };

                        resolve('Deleted');
                    },
                    err => {
                        console.error('Error in Global-Variables deleteDashboardInfo', err.message);
                        reject(err.message);
                    }
                )
        });

    }

    clearDashboardInfo() {
        // Clears all related Entities of a D
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables clearDashboard starts',
                this.concoleLogStyleForEndOfMethod);
        };

        // TODO - find a better way to keep all related items in sync, and list updated
        this.currentDashboards = [];
        this.currentDashboardTabs = [];
        this.currentWidgets = [];
        this.currentWidgetCheckpoints = [];

    }

    addDashboard(data: Dashboard): Promise<any> {
        // Description: Adds a new Dashboard
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables addDashboard starts',
                this.concoleLogStyleForStartOfMethod, {data});
        };

        return new Promise<any>((resolve, reject) => {

            this.addResource('dashboards', data)
                .then(res => {

                    // Clear all related info
                    this.clearDashboardInfo();

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables addDashboard ends',
                            this.concoleLogStyleForEndOfMethod,
                            res)
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global-Variables addDashboard', err);
                    reject(err.message);
                }
            )
        });
    }

    refreshLocalCache() {
        // Refreshes ALL the local cache in Memory - ASYNC
        // It sets the cacheDoneStatus to 'InitialDone' once completed

        if (this.sessionDebugging) {
            console.log('%c  Global-Variables refreshLocalCacheMemory starts',
                this.concoleLogStyleForStartOfMethod);
        };

        // Set status
        this.cachingStatus = 'Pending';
        let cacheDoneCounter: number = 0;

        // Loop on localCachingTable
        for (var initialIndex = 0; initialIndex < this.dataCachingTable.length; initialIndex++) {

            // Only refresh those cacheable in Memory or on Disc
            // Note: it could be any one of the above, or both
            if (this.dataCachingTable[initialIndex].localCacheableMemory
                ||
                this.dataCachingTable[initialIndex].localCacheableDisc) {
                console.log('xx this.dataCachingTable[dataCachingTableIndex]', this.dataCachingTable[initialIndex].key, this.dataCachingTable[initialIndex].localVariableName)
                let resource: string = this.dataCachingTable[initialIndex].key;
                console.time("      DURATION refreshLocalCacheMemory: " + resource);

                // Get from HTTP server

                const headers = new HttpHeaders()
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + this.currentToken);

                let pathUrl: string = resource;
                let finalUrl: string = this.setBaseUrl(resource) + pathUrl;
                
                this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                    httpResponse  => {

                        if(httpResponse.statusCode != 'success') {
                            if (this.sessionDebugging) {
                                console.warn('Error refreshLocalCacheMemory FAILED', {httpResult: httpResponse});
                            };

                            console.timeEnd("      DURATION refreshLocalCacheMemory: " + resource);
                            // reject(httpResult.message);
                            return;
                        };
                        if(httpResponse.data == null) {
                            console.error('Error in Global Variables refreshLocalCacheMemory: Data in response object is null; it should be an array');
                            return;
                        };
                        if(httpResponse.data.length == 0) {
                            console.warn('Global Variables refreshLocalCacheMemory: Data for ' + resource + ' in response object is an empty array; it should contain data');
                            return;
                        };

                        // Find the return result - remember this comes back ASYNC,
                        // thus not the same order as the current loop
                        let resultIndex: number = this.dataCachingTable.findIndex(
                            dct => dct.key === httpResponse.resourceOrRoute);
                        if (resultIndex >= 0) {
                            // Fill local Vars
                            if (this.dataCachingTable[resultIndex].localCacheableMemory) {

                                if (this.dataCachingTable[resultIndex].localVariableName != null) {
                                    this[this.dataCachingTable[resultIndex].localVariableName] = [];
                                    this[this.dataCachingTable[resultIndex].localVariableName] = httpResponse.data;
                                    console.log('%c    Global-Variables refreshLocalCache ' + httpResponse.data.length.toString() + ' records updated cached Memory for ', resource);
                                };

                                // TODO - should we fill Current Var here a well?
                            };

                            // Fill Disc
                            if (this.dataCachingTable[resultIndex].localCacheableDisc) {

                                if (this.dataCachingTable[resultIndex].localTableName != null) {

                                    this.dbCanvasAppDatabase.table(this.dataCachingTable[resultIndex].localTableName).clear().then(res => {
                                        this.dbCanvasAppDatabase.table(this.dataCachingTable[resultIndex].localTableName)
                                        .bulkPut(httpResponse.data)
                                        .then(resPut => {

                                            // Count
                                            this.dbCanvasAppDatabase.table(this.dataCachingTable[resultIndex].localTableName)
                                                .count(resCount => {
                                                    console.log('    Global-Variables refreshLocalCache ' + httpResponse.data.length.toString() + ' records updated local Disc for:', resource);
                                            });
                                        });
                                    });
                                };
                            };

                            // Update dataCaching in Memory
                            let dt: Date = new Date();
                            let seconds: number = 86400;
                            if (this.dataCachingTable[resultIndex].localLifeSpan) {
                                seconds = +this.dataCachingTable[resultIndex].localLifeSpan;
                            };
                            this.dataCachingTable[resultIndex].localExpiryDateTime =
                                this.dateAdd(dt, 'second', seconds);
                            this.dataCachingTable[resultIndex].localLastUpdatedDateTime =
                                new Date();

                            // Update dataCaching on Disc
                            this.dbDataCachingTable.table("localDataCachingTable")
                                .bulkPut(this.dataCachingTable)
                                .then(res => {
                                    this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                                    });
                            });
                        };
                        console.timeEnd("      DURATION refreshLocalCacheMemory: " + resource);
                        
                        // Update counter
                        cacheDoneCounter = cacheDoneCounter + 1;
                        if (cacheDoneCounter === this.dataCachingTable.length) {
                            this.cachingStatus === 'InitialDone';
                            console.log('    Global-Variables refreshLocalCache: ALL cache refreshed');
                        };
                    },
                    err => {
                        if (this.sessionDebugging) {
                            console.error('Error in Global-Variables refreshLocalCache', err);
                        };
                        console.timeEnd("      DURATION refreshLocalCache: " + resource);
                    }
                );
            };
        };

    }

    updateLocalCacheMemory(
        cacheAction: string,
        cachedEntityID: number,
        cachedEntityName: string,
        cachedEntityData: any): Promise<boolean> {
        // Amend local Workstation Memory Cache
        //   cacheAction = add, update, delete
        //   cachedEntityID = ID of the entity to amend, ie 9 (for say dashboardID = 9)
        //   cachedEntityName = variable to amend, ie dashboards (for caching Table lookup)
        //   cachedEntityData = data to add, update

        if (this.sessionDebugging) {
            console.log('%c  Global-Variables updateLocalCacheMemory starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<boolean>((resolve, reject) => {
            let today = new Date();

            // Find object in localCachingTable
            let dataCachingTableIndex: number = this.dataCachingTable.findIndex(dct =>
                dct.key === cachedEntityName
            );

            // If in CachingTable, update locally
            if (dataCachingTableIndex >= 0) {

                // Set vars to use here
                let localCacheableMemory = this.dataCachingTable[dataCachingTableIndex].localCacheableMemory;
                let localCacheableDisc = this.dataCachingTable[dataCachingTableIndex].localCacheableDisc;
                let localVariableName = this.dataCachingTable[dataCachingTableIndex].localVariableName;
                let localCurrentVariableName = this.dataCachingTable[dataCachingTableIndex].localCurrentVariableName;
                let localTableName  = this.dataCachingTable[dataCachingTableIndex].localTableName;

                // Add an object
                if (cacheAction.toLowerCase() === 'add') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id === cachedEntityID);

                            if (localVarIndex < 0) {
                                this[localVariableName].push(cachedEntityData);
                            };
                        };

                        // Update Current Var
                        // TODO - consider this carefully: dont think we should add stuff to
                        // currentVars, ie currentDashboards = current D selected by user
                        console.log('xx ADD Memory Updated for Var: localVariableName', localVariableName, this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .put(cachedEntityData)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.log('xx updateLocalCacheMem count @ end for localTableName: ', localTableName, res);
                                    });
                            });
                        };
                    };
                };

                // Update an object
                if (cacheAction.toLowerCase() === 'update') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            let localVarIndex: number = this[localVariableName].findIndex(
                                lv => lv.id === cachedEntityID);

                            if (localVarIndex >0) {
                                this[localVariableName][localVarIndex] = cachedEntityData;
                            };
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            let localCurrentVarIndex: number = this[localCurrentVariableName].findIndex(
                                lv => lv.id === cachedEntityID);

                            if (localCurrentVarIndex >0) {
                                this[localCurrentVariableName][localCurrentVarIndex] = cachedEntityData;
                            };
                        };

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                    if (localTableName != null) {

                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(cachedEntityID)
                                .put(cachedEntityData)
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.log('xx updateLocalCacheMem Update count @ end for localTableName: ', localTableName, res);
                                    });
                            });
                        };
                    };
                }

                // Delete an object
                if (cacheAction.toLowerCase() === 'delete') {

                    // Update Memory
                    if (localCacheableMemory) {

                        // Update local var
                        if (localVariableName != null) {
                            this[localVariableName] = this[localVariableName].filter(
                                lv => {
                                    return lv.id != cachedEntityID
                                });
                        };

                        // Update Current Var
                        if (localCurrentVariableName != null) {
                            this[localCurrentVariableName] = this[localCurrentVariableName].filter(
                                lv => {
                                    return lv.id != cachedEntityID
                                });
                        };
                        console.log('xx updateLocalCacheMem Delete for localVariableName: ', localVariableName, this[localVariableName], this[localCurrentVariableName])

                    };

                    // Update Disc
                    if (localCacheableDisc) {
                        // Delete from DB
                        if (localTableName != null) {
                            this.dbCanvasAppDatabase.table(localTableName)
                                .where('id').equals(cachedEntityID)
                                .delete()
                                .then(res => {
                                    this.dbCanvasAppDatabase.table(localTableName).count(res => {
                                        console.log('xx updateLocalCacheMem Delete count @end for localTableName', localTableName, res);
                                    });
                            });
                        };
                    };
                };

                // Update dataCaching in Memory
                let dt: Date = new Date();
                let seconds: number = 86400;
                if (this.dataCachingTable[dataCachingTableIndex].localLifeSpan) {
                    seconds = +this.dataCachingTable[dataCachingTableIndex].localLifeSpan;
                };
                this.dataCachingTable[dataCachingTableIndex].localExpiryDateTime =
                    this.dateAdd(dt, 'second', seconds);
                this.dataCachingTable[dataCachingTableIndex].localLastUpdatedDateTime =
                today;
                console.log('xx updateLocalCacheMem dataCachingTable memory upd', this.dataCachingTable)


                // Update dataCaching on Disc
                this.dbDataCachingTable.table("localDataCachingTable")
                    .bulkPut(this.dataCachingTable)
                    .then(res => {
                        this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                            console.log('xx updateLocalCacheMem localDataCachingTable count @end', res);
                        });
                });

            };

            // Done
            resolve(true);
        });
    }

    getDashboardsRecent(userID: string): Promise<DashboardRecent[]>  {
        // Description: Gets an array of recently used D (not the Ds itself)
        // Returns: return array from source, not cached
        // Note:  data is ALWAYS synced to the different places:
        // - DB
        // - this.dashboardsRecent (array in Global Vars)
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getDashboardsRecent starts',
                this.concoleLogStyleForStartOfMethod, {userID});
        };

        return new Promise<DashboardRecent[]>((resolve, reject) => {

            // Get data
            this.getResource('dashboardsRecent')
                .then(res => {

                    // TODO - http must be sorted => include in Options ...
                    let temp: DashboardRecent[] = res.filter(
                        i => i.userID === userID
                    );

                    // Add State and Name, at Runtime
                    for (var x = 0; x < temp.length; x++) {
                        temp[x].stateAtRunTime = 'Deleted';
                        let newDate = new Date(temp[x].accessed);
                        temp[x].accessed = newDate;
                        for (var y = 0; y < this.dashboards.length; y++) {
                            if (this.dashboards[y].id ==
                                temp[x].dashboardID) {
                                    temp[x].stateAtRunTime = this.dashboards[y].state;
                                    temp[x].nameAtRunTime = this.dashboards[y].name;
                                };
                            };
                        };

                    // Sort DESC
                    // TODO - in DB, ensure dateTime stamp is used, as IDs may not work
                        // TODO - Also, the sort is done more than once ...
                    temp = temp.sort( (obj1,obj2) => {
                        if (obj1.accessed > obj2.accessed) {
                            return -1;
                        };
                        if (obj1.accessed < obj2.accessed) {
                            return 1;
                        };
                        return 0;
                    });

                    // Remove Deleted ones
                    temp = temp.filter(t => t.stateAtRunTime != 'Deleted');

                    this.dashboardsRecent = temp;
                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables dashboardsRecent ends',
                            this.concoleLogStyleForEndOfMethod, {temp})
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDashboardsRecent ends',
                            this.concoleLogStyleForEndOfMethod,
                            userID)
                    };

                    resolve(temp);
                })
                .catch(err => {
                    console.error('Error in Global-Variables getDashboardsRecent', err)
                    reject(err.message)
                });
        });
    }

    amendDashboardRecent(
        dashboardID: number,
        dashboardTabID: number,
        newState: string): Promise<any>  {
        // Compares given IDs against the Recent list:
        // - if D not there, call ADD.  Else SAVE
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables amendDashboardRecent starts',
                this.concoleLogStyleForStartOfMethod,
                {dashboardID}, {dashboardTabID});
        };

        let dashboardRecentIndex: number = this.dashboardsRecent.findIndex(dR =>
            dR.dashboardID === dashboardID
        );
        let today = new Date();

        // D not in Recent List, so Add
        if (dashboardRecentIndex === -1) {

            let dashboardNameIndex: number = this.dashboards.findIndex(d => d.id === dashboardID);
            let dashboardName: string = '';
            if (dashboardNameIndex >= 0) {
                dashboardName = this.dashboards[dashboardNameIndex].name;
            };
            let newRecent: DashboardRecent = {
                id: null,
                userID: this.currentUser.userID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                editMode: newState === 'Draft'?  true  :  false,
                accessed: new Date(this.formatDate(today)),
                stateAtRunTime: newState,
                nameAtRunTime: dashboardName
            };

            return new Promise<any>((resolve, reject) => {
                this.addResource('dashboardsRecent', newRecent)
                    .then(dR => {

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables amendDashboardRecent ends',
                                this.concoleLogStyleForEndOfMethod,
                                dashboardID)
                        };

                        resolve(dR)
                    })
                    .catch(err => {
                        console.error('Error in Global-Variables amendDashboardsRecent', err)
                        reject(err)
                    });
            });
        } else {

            // D + T in Recent List, so amend
            let recentDashboard: DashboardRecent = this.dashboardsRecent[dashboardRecentIndex];

            // Update fields
            recentDashboard.dashboardTabID = dashboardTabID;
            recentDashboard.stateAtRunTime =  newState;
            recentDashboard.editMode = newState === 'Draft'?  true  :  false;
            recentDashboard.accessed = new Date(this.formatDate(today));

            return new Promise<any>((resolve, reject) => {
                this.saveResource('dashboardsRecent', recentDashboard)
                    .then(res => {
                        this.dashboardsRecent = this.dashboardsRecent.sort( (obj1,obj2) => {
                            if (obj1.accessed > obj2.accessed) {
                                return -1;
                            };
                            if (obj1.accessed < obj2.accessed) {
                                return 1;
                            };
                            return 0;
                        });

                        if (this.sessionDebugging) {
                            console.log('%c    Global-Variables amendDashboardRecent ends',
                                this.concoleLogStyleForEndOfMethod,
                                dashboardID)
                        };

                        resolve(recentDashboard)
                    })
                    .catch(err => {
                        console.error('Error in Global-Variables amendDashboardsRecent', err)
                        reject(err)
                    });
            });
        };

    }

    touchupDashboardRecentVar(dashboardID:number, dashboardName: string) {
        // Description: Touchup DashboardRecent by changing selected fields
        // NOTE: It does NOT change the DB -> this is only updating the local variable.
        // - Next time one reads the list from the DB, it will be filled correctly
        // NOTE: it does NOT change position in the global variable.
        // It is typically used:
        // - change current D Desc => position remains unchanged
        // - D Rename => position should not be affected
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables touchupDashboardRecent starts',
                this.concoleLogStyleForStartOfMethod
                , {dashboardID}, {dashboardName});
        };

        let newRecentIndex: number = this.dashboardsRecent
            .findIndex(dR => dR.dashboardID === dashboardID);

        if (newRecentIndex >= 0) {
            this.dashboardsRecent[newRecentIndex].nameAtRunTime = dashboardName;
        };

    }

    getData(parameters: string): Promise<any[]> {
        // Description: Gets Data
        // parameters: list of ways to modify the result, for example:
        //   datasourceID=68                       REQUIRED - data for this DS
        //   &sortObject=-Month                    Comma separated list of fields, - means DESC
        //   &fields=Year, Month                   Fields to return, NOTE spaces
        //   &filterObject={"Year":2019}           Filter object in Mongo format
        //   &aggregationObject=aggregationObject  How to aggregate the data after SELECT statement
        //   &nrRowsToReturn=2                     Rows to return after ALL else have been done
        // Returns: res.data
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getData starts',
                this.concoleLogStyleForStartOfMethod, {parameters});
        };

        return new Promise<any[]>((resolve, reject) => {

            // Refresh from source at start, or if dirty
            this.statusBarRunning.next(this.canvasSettings.queryRunningMessage);

            if (parameters.substring(0, 1) != '?') {
                parameters = '?' + parameters;
            };
            console.time("      DURATION getData: " + parameters);

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            // let finalUrl: string = this.canvasServerURI + '/clientdata?id=' + id.toString()
            let finalUrl: string = this.canvasServerURI + '/clientData' + parameters;
            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables getData: ' + httpResponse.message);
                        reject('Error in Global Variables getData: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getData: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getData: Data in response object is null; it should be an array');
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getData ends',
                            this.concoleLogStyleForEndOfMethod,
                            httpResponse)
                    };
                    
                    console.timeEnd("      DURATION getData: " + parameters);
                    resolve(httpResponse.data);
                },
                err => {
                    console.timeEnd("      DURATION getData: " + parameters);
                    console.error('Error in Global-Variables getData', err);
                    reject(err.message);
                }
            );
        });

    }

    saveData(data: any): Promise<string> {
        // Description: Saves Data
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables saveData starts',
                this.concoleLogStyleForStartOfMethod, {data});
        };

        let pathUrl: string = 'data';
        let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            this.http.put<CanvasHttpResponse>(finalUrl + '/' + data.id, data, {headers})
            .subscribe(
                httpResponse => {

                    // No local to Replace

                    if (this.sessionDebugging) {
                        console.log('saveData SAVED', {res: httpResponse})
                    };
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables saveData: ' + httpResponse.message);
                        reject('Error in Global Variables saveData: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables saveData: Data in response object is null; it should be an array');
                        reject('Error in Global Variables saveData: Data in response object is null; it should be an array');
                        return;
                    };

                    resolve('Saved');
                },
                err => {
                    console.error('Error in Global-Variables saveData', err);
                    reject(err.message);
                }
            )
        });
    }

    deleteData(id: number): Promise<string> {
        // Description: Deletes given Data
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deleteData starts',
                this.concoleLogStyleForStartOfMethod, {id});
        };

        return new Promise<any>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            // let pathUrl: string = 'data';
            // let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;

            let finalUrl: string = this.canvasServerURI + '/clientData';
            this.http.delete<CanvasHttpResponse>(finalUrl + '?id=' + id, {headers})
                .subscribe(httpResponse => {

                    if (this.sessionDebugging) {
                        console.log('deleteData DELETED id: ', {id})
                    };
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables deleteData: ' + httpResponse.message);
                        reject('Error in Global Variables deleteData: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables deleteData: Data in response object is null; it should be an array');
                        reject('Error in Global Variables deleteData: Data in response object is null; it should be an array');
                        return;
                    };
            
                    resolve('Deleted');
                },
                err => {
                    console.error('Error in Global-Variables deleteData', err);
                    reject(err.message);
                }
            )
        });
    }

    filterSlicer(dataSet: any): any {
        // Filter a given Dataset on .dataRaw by applying all applicable Sl, and put result
        // into .data
        // Note: Objects and arrays are passed by reference. Primitive values like number,
        // string, boolean are passed by value.  Thus, original object (dSet) is modified here.
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables filterSlicer starts',
                this.concoleLogStyleForStartOfMethod,
                {dataSet});
        };

        return dataSet;

        // // Get all Sl for the given dSet
        // // TODO: cater (carefully) for case where sl.datasetID === -1, ie what if DS has
        // // two dSets with different values ...
        // let relatedSlicers: Widget[] = this.currentWidgets.filter(w =>
        //     w.datasourceID === dataSet.datasourceID
        //     &&  w.widgetType === 'Slicer'
        // );

        // // Reset the filtered data
        // dataSet.data = dataSet.dataRaw;
        // console.log('xx filterSlicer data, dataRaw.length', dataSet.data.length, dataSet.dataRaw.length)

        // // Loop on related Sl and filter data
        // relatedSlicers.forEach(w => {
        //     console.log('Releated Slicers are (id, type): ', w.id, w.slicerType)

        //     // Type = List
        //     if (w.slicerType === 'List') {

        //         // Build array of selection values
        //         let selectedValues: string[] = [];
        //         let allSelectedValues: string[] = [];

        //         w.slicerSelection.forEach(f => {
        //             if (f.isSelected) {
        //                 selectedValues.push(f.fieldValue);
        //             };
        //             allSelectedValues.push(f.fieldValue);
        //         });

        //         // Apply selected once, empty means all
        //         let tempData: any = [];
        //             dataSet.data.forEach(d => {
        //                 if (selectedValues.indexOf(d[w.slicerFieldName]) >= 0) {
        //                     tempData.push(d);
        //                 };
        //                 if ( (w.slicerAddRest  &&  w.slicerAddRestValue)
        //                     &&
        //                     allSelectedValues.indexOf(d[w.slicerFieldName]) < 0) {
        //                         tempData.push(d);
        //                 };
        //             });

        //             // Replace the filtered data, used by the graph
        //         dataSet.data = tempData;
        //         console.log('xx filterSlicer End of list data.length', dataSet.data.length)

        //     };

        //     // Type = Bins
        //     if (w.slicerType === 'Bins') {

        //         // Build array of selection values
        //         let rangeValues: {fromValue: number; toValue:number}[] = [];

        //         w.slicerBins.forEach(bn => {
        //             if (bn.isSelected) {
        //                 rangeValues.push(
        //                     {fromValue: bn.fromValue, toValue: bn.toValue}
        //                 )
        //             };
        //         });

        //         // Loop on Bins, and add filtered ones
        //         let filterBinData: any = [];

        //         rangeValues.forEach(rv => {
        //             dataSet.data.forEach(d => {
        //                 if (+d[w.slicerFieldName] >= rv.fromValue
        //                     &&
        //                     +d[w.slicerFieldName] <= rv.toValue) {
        //                         filterBinData.push(d);
        //                 };
        //             });
        //         });

        //         // Replace the filtered data, used by the graph
        //         dataSet.data = filterBinData;

        //     };
        // });

        // // Filter data in [W] related to this dSet
        // // TODO - cater later for cases for we use graphUrl
        // this.currentWidgets.forEach(w => {
        //     if (w.datasourceID === dataSet.datasourceID
        //         && w.widgetType != 'Slicer') {
        //             console.log('xx filterSlicer Related W: ', w.id)
        //             w.graphUrl = "";
        //             w.dataFiltered = dataSet.data;

        //     };
        // });

        // console.warn('xx filterSlicer @ End: currentW, dataSet', this.currentWidgets, dataSet)
        // return dataSet;
    }

    newDashboardSnapshot(
        snapshotName: string,
        snapshotComment: string,
        snapshotType: string): Promise<any>  {
        // Description: Adds a new DashboardSnapshot
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables newDashboardSnapshot starts',
                this.concoleLogStyleForStartOfMethod,
                {snapshotName}, {snapshotComment}, {snapshotType});
        };

        return new Promise<any>((resolve, reject) => {

            // Create new record
            let newSn: DashboardSnapshot = {
                id: null,
                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                name: snapshotName,
                snapshotType: snapshotType,
                comment: snapshotComment,
                dashboards: this.currentDashboards.slice(),
                dashboardTabs: this.currentDashboardTabs.slice(),
                widgets: this.currentWidgets.slice(),
                datasources: this.currentDatasources.slice(),
                widgetCheckpoints: this.currentWidgetCheckpoints.slice(),
                editedBy: '',
                editedOn: null,
                createdBy: this.currentUser.userID,
                createdOn: new Date()
            };

            // Add to DB
            this.addResource('dashboardSnapshots', newSn).then(res => {
console.log('xx Ivan ADD res', res)

                resolve(res);
            });
        });
    }

    getDatasourcePermissions(): Promise<DatasourcePermission[]> {
        // Description: Gets all DS-P
        // Returns: this.datasourcePermissions array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getDatasourcePermissions starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<DatasourcePermission[]>((resolve, reject) => {

            this.getResource( 'datasourcePermissions')
                .then( res  => {

                    // Fill in @RunTime info
                    this.datasourcePermissions.forEach(d => {
                        this.datasources.forEach(ds => {
                            if (ds.id === d.datasourceID) {
                                d.name = ds.name;
                            };
                        });
                        this.canvasGroups.forEach(grp => {
                            if (grp.id === d.groupID) {
                                d.groupName = grp.name;
                            };
                        });
                    });

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDatasourcePermissions ends',
                            this.concoleLogStyleForEndOfMethod,
                            this.datasourcePermissions)
                    };

                    resolve(this.datasourcePermissions);
                })
                .catch(err => {
                    console.error('Error in Global-Variables getDatasourcePermissions', err)
                    reject(err.message)
                });
        });
    }

    getSystemSettings(): Promise<CanvasSettings> {
        // Description: Gets system settings
        // Returns: this.canvasSettings object, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getSystemSettings starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<CanvasSettings>((resolve, reject) => {

            this.getResource('canvasSettings')
                .then(res  => {

                    // Note: the other global vars are arrays, this one is NOT
                    if (this.canvasSettingsArray != null) {
                        this.canvasSettings = this.canvasSettingsArray[0];
                    };

                    // Sanitize
                    if (this.canvasSettings.gridSize > 100
                        || this.canvasSettings.gridSize == null
                        || this.canvasSettings.gridSize === undefined) {
                        this.canvasSettings.gridSize = 100;
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getSystemSettings ends',
                            this.concoleLogStyleForEndOfMethod)
                    };

                    resolve(this.canvasSettings);
                })
                .catch(err => {
                    console.error('Error in Global-Variables getSystemSettings', err);
                    reject(err.message)
                });
        });

    }

    addPaletteButtonsSelected(data: PaletteButtonsSelected): Promise<any> {
        // Description: Adds a new PaletteButtonsSelected
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables addPaletteButtonsSelected starts',
                this.concoleLogStyleForStartOfMethod, {data});
        };

        return new Promise<any>((resolve, reject) => {

            this.addResource('paletteButtonsSelecteds', data)
                .then( (res) => {
                    // Update Global vars to make sure they remain in sync
                    this.currentPaletteButtonsSelected.value.push(JSON.parse(JSON.stringify(res)));

                    // Inform subscribers
                    this.currentPaletteButtonsSelected.next(
                        this.currentPaletteButtonsSelected.value
                    );

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables addPaletteButtonsSelected ends',
                            this.concoleLogStyleForEndOfMethod,
                            res);
                    };

                    resolve(res);
                })
                .catch(err => {
                    console.error('Error in Global-Variables addPaletteButtonsSelected', err);
                    reject(err.message);
                })
        });
    }

    savePaletteButtonsSelected(data: PaletteButtonsSelected): Promise<string> {
        // Description: Saves PaletteButtonsSelected
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables savePaletteButtonsSelected starts',
                this.concoleLogStyleForStartOfMethod, {data});
        };

        return new Promise<string>((resolve, reject) => {

            this.saveResource('paletteButtonsSelecteds', data)
                .then( res => {

                    // Replace local
                    let localIndex: number = this.currentPaletteButtonsSelected.value.findIndex(d =>
                        d.id === data.id
                    );
                    this.currentPaletteButtonsSelected.value[localIndex] = data;

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables savePaletteButtonsSelected ends',
                            this.concoleLogStyleForEndOfMethod,
                            res);
                    };

                    resolve('Saved');
                })
                .catch( err => {
                    console.error('Error in Global-Variables savePaletteButtonsSelected', err);
                    reject(err.message);
                })
        });
    }

    deletePaletteButtonsSelected(id: number): Promise<string> {
        // Description: Deletes a PaletteButtonsSelected
        // Returns: 'Deleted' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deletePaletteButtonsSelected starts',
                this.concoleLogStyleForStartOfMethod, {id});
        };

        return new Promise<any>((resolve, reject) => {

            this.deleteResource('paletteButtonsSelecteds', id)
                .then(res => {

                    // This is a different case: currentPaletteButtonsSelected is an
                    // Observable, and will be refreshed with a .next by the calling
                    // routine
                    let dID: number = -1;
                    for (var i = 0; i < this.currentPaletteButtonsSelected.value.length; i++) {

                        if (this.currentPaletteButtonsSelected.value[i].id === id) {
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

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables deletePaletteButtonsSelected ends',
                            this.concoleLogStyleForEndOfMethod,
                            res);
                    };

                    resolve('Deleted');
                })
                .catch( err => {
                    console.error('Error in Global-Variables deletePaletteButtonsSelected', err);
                    reject(err.message);
                })

        });
    }

    getWidgets(params: string = ''): Promise<Widget[]> {
        // Description: Gets all W
        // Returns: this.widgets array, unless:
        //   If not cached or if dirty, get from File
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getWidgets starts',
                this.concoleLogStyleForStartOfMethod,
                this.widgets.length);
        };

        return new Promise<Widget[]>((resolve, reject) => {

            this.getResource('widgets')
                .then(res => {

                    // TODO - fix hardcoding, issue with datalib jsonTree
                    this.widgets.forEach(w => {

                        // TODO - with DB, get summarised fields like NrComments, NrDataQual, etc

                        // Get Checkpoint info for ALL W, not only current one
                        // TODO - fix when using DB
                        let tempChk: WidgetCheckpoint[] = this.widgetCheckpoints
                            .filter(wc =>
                                wc.dashboardID === w.dashboardID
                                &&
                                wc.widgetID === w.id
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

                        // Constants in Text and Bullets
                        if (w.widgetType === 'Shape') {
                            if (w.widgetSubType === 'Text') {
                                w.shapeTextDisplay =
                                    this.calcShapeTextDisplay(w.shapeText);
                            };
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
                                if (i === 1) {
                                    oSel = (s === 'true');
                                };
                                if (i === 2) {
                                    oName = s;
                                };
                                if (i === 3) {
                                    oFrom = +s;
                                };
                                if (i === 4) {
                                    oTo  = +s;
                                    i = 0;
                                    let o: {isSelected: boolean; name: string; fromValue: number; toValue: number} =
                                        {isSelected: oSel, name: oName, fromValue: oFrom, toValue: oTo};

                                    w.slicerBins.push(o);
                                }
                            })
                        };
                    });

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getWidgets ends',
                            this.concoleLogStyleForEndOfMethod,
                            this.widgets)
                    };

                    resolve(this.widgets);
                })
                .catch(err => {
                    console.error('Error in Global-Variables getWidgets', err);
                    reject(err.message)
                });

        });

    }

    saveWidget(data: Widget): Promise<string> {
        // Description: Saves Widget
        // Returns: 'Saved' or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables saveWidget starts',
                this.concoleLogStyleForStartOfMethod, {data});
        };

        return new Promise<string>((resolve, reject) => {

            this.saveResource('widgets', data)
                .then(res => {

                    // Update widgets and currentWidgets
                    this.widgetReplace(data);

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables saveWidget ends',
                            this.concoleLogStyleForEndOfMethod,
                            res)
                    };

                    resolve('Saved');
                })
                .catch(err => {
                    console.error('Error in Global-Variables saveWidget', err);
                    reject(err.message);
                });
        });
    }

    duplicateSingleWidget(originalWidget: Widget) {
        // Duplicate the given Widget
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables duplicateSingleWidget starts',
                this.concoleLogStyleForStartOfMethod, {originalWidget});
        };

        // Find latest copy #
        let copyPosition: number = 1;
        for (var i = 0; i < 21; i++) {
            this.currentWidgets.forEach(w => {
                if ( w.titleText.includes(' (copy ' + i.toString() + ')') ) {
                    copyPosition = i + 1;
                };
            });
        };

        // Make a deep copy
        let copiedWidget: Widget = JSON.parse(JSON.stringify(originalWidget));

        copiedWidget._id = null;
        copiedWidget.id = null;
        copiedWidget.dashboardID = this.currentDashboardInfo.value.currentDashboardID;
        copiedWidget.dashboardTabID = this.currentDashboardInfo.value.currentDashboardTabID;

        // Assume this is a NEW W, so forget about tabs that original belongs
        copiedWidget.isSelected = false;
        copiedWidget.containerLeft = 120;
        copiedWidget.containerTop = 120;
        copiedWidget.isLocked = false;
        copiedWidget.titleText = copiedWidget.titleText + ' (copy ' +
            copyPosition.toString() + ')';

        // Add to all and current W
        this.addResource('widgets', copiedWidget)
            .then(res => {
                copiedWidget.id = res.id;

                this.changedWidget.next(copiedWidget);

                // Add to Action log
                this.actionUpsert(
                    null,
                    this.currentDashboardInfo.value.currentDashboardID,
                    this.currentDashboardInfo.value.currentDashboardTabID,
                    copiedWidget.id,
                    'Widget',
                    'Edit',
                    'Duplicate',
                    'App clickMenuWidgetDuplicate',
                    null,
                    null,
                    null,
                    copiedWidget
                );

                if (this.sessionDebugging) {
                    console.log('%c    Global-Variables duplicateSingleWidget ends',
                        this.concoleLogStyleForEndOfMethod,
                        res)
                };
            })
            .catch(err => {
                console.error('Error in Global-Variables duplicateSingleWidget', err);

            });

    }

    deleteWidget(id: number): Promise<string> {
        // Description: Deletes a Widgets
        // Returns: 'Deleted' or error message
        // NOTE: this permananently deletes a W, from arrays and DB.
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables deleteWidget starts',
                this.concoleLogStyleForStartOfMethod, {id});
        };

        return new Promise<any>((resolve, reject) => {

            this.deleteResource('widgets', id)
                .then(res => {

                    // Delete where W was used in Chkpnt
                    this.widgetCheckpoints.forEach(chk => {
                        if (chk.widgetID === id) {
                            this.deleteResource('widgetCheckpoints', chk.id);
                        };
                    });

                    // Delete where W was used in Stored Template
                    this.getResource('widgetStoredTemplates').then(swt => {
                        swt = swt.filter(w1 => w1.widgetID === id);
                        swt.forEach(w2 => {
                            this.deleteResource('widgetStoredTemplates', w2.id);
                        });
                    });

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables deleteWidget ends',
                            this.concoleLogStyleForEndOfMethod,
                            {id})
                    };

                    resolve('Deleted');
                })
                .catch(err => {
                    console.error('Error in Global-Variables deleteWidget', err);
                    reject(err.message);
                }
            )
        });
    }

    updateCanvasMessagesAsRead(userID: string): Promise<string> {
        // Marks all messages for this userID as read - typically done when Messages form
        // is closed, or at logout.
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables updateCanvasMessagesAsRead starts',
                this.concoleLogStyleForStartOfMethod, {userID});
        };

        return new Promise<string>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = '/canvasDataMarkMessagesAsRead';
            let finalUrl: string = this.canvasServerURI + pathUrl;

            this.http.put<CanvasHttpResponse>(finalUrl + '?userID='
                + userID, null, {headers})
                .subscribe(
                    httpResponse => {
                        if(httpResponse.statusCode != 'success') {
                            console.error('Error in Global Variables marking Messages as read: '+ httpResponse.message);
                            reject('Error in Global Variables marking Messages as read: '+ httpResponse.message);
                        };
                        if(httpResponse.data == null) {
                            console.error('Error in Global Variables marking Messages as read: Data in response object is null; it should be an array');
                            reject('Error in Global Variables marking Messages as read: Data in response object is null; it should be an array');
                            return;
                        };

                        resolve("Done");
                    },
                    err => {
                        console.error('Error in Global-Variables  marking MessagesAsRead: ', err);
                        reject('Error marking Messages as read FAILED: ' + err.message);
                    }
                )
        })
    }

    clearCurrentUser() {
        // Description: reset the Global currentUser variable
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables clearCurrentUser starts',
                this.concoleLogStyleForStartOfMethod);
        };

        this.currentUser.userID = '';
        this.currentUser.isSuperuser = false;
        this.currentUser.isStaff = false;
        this.currentUser.groups = [];
        this.currentUser.dashboardCanViewRole = false;
        this.currentUser.dashboardCanSaveRole = false;
        this.currentUser.dashboardCanGrantAccessRole = false;
        this.currentUser.dashboardCanEditRole = false;
        this.currentUser.dashboardCanDeleteRole = false;
        this.currentUser.dashboardCanCreateRole = false;
        this.currentUser.dashboardCanAddDatasourceRole = false;
        this.currentUser.canManageGroupRole = false;
        this.currentUser.datasourceCanCreateRole = false;
        this.currentUser.datasourceCanViewRole = false;
        this.currentUser.datasourceCanEditRole = false;
        this.currentUser.datasourceCanDeleteRole = false;
        this.currentUser.datasourceCanGrantAccessRole = false;
    }

    updateCurrentUserProperties(parameters:
        {
            isFirstTimeUser?: boolean,
            preferencePaletteHorisontal?: boolean,
            preferencePlaySound?: boolean,
            preferenceDebugSession?: boolean,
            preferenceAutoSync?: boolean,
            preferenceSnapToGrid?: boolean,
            preferenceShowOpenStartupMessage?: boolean,
            preferenceShowOpenDataCombinationMessage?: boolean,
            preferenceShowViewStartupMessage?: boolean,
            preferenceShowDiscardStartupMessage?: boolean,
            preferenceDefaultTemplateID?: number,
            preferenceDefaultDateformat?: string,
            preferenceDefaultFolder?: string,
            preferenceDefaultPrinter?: string,
            preferenceDefaultPageSize?: string,
            preferenceDefaultPageLayout?: string,
            preferenceDefaultSnapshotMins?: number,
            preferenceStartupDashboardID?: number,
            preferenceStartupDashboardTabID?: number,
            preferenceShowWidgetEditorLite?: boolean
        }
        ) {
        // Description: update properties in the the Global currentUser variable
        // NOTE: This does NOT update the DB or any other Variable
        // Returns: 'Setted', else 'Error: userID does not exist in canvasUsers'
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables updateCurrentUserProperties starts',
                this.concoleLogStyleForStartOfMethod);
        };

        let userid: number = this.currentUser.id;
        let userIndex: number = this.canvasUsers.findIndex(u => u.id === userid);
        if (userIndex < 0) {
            this.showStatusBarMessage(
                {
                    message: 'Current user not in currentUsers array!',
                    uiArea: 'StatusBar',
                    classfication: 'Error',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
        } else {

            if (parameters.isFirstTimeUser != null) {
                this.canvasUsers[userIndex].isFirstTimeUser = parameters.isFirstTimeUser;
                this.currentUser.isFirstTimeUser = parameters.isFirstTimeUser;
            };
            if (parameters.preferencePaletteHorisontal != null) {
                this.canvasUsers[userIndex].preferencePaletteHorisontal = parameters.preferencePaletteHorisontal;
                this.currentUser.preferencePaletteHorisontal = parameters.preferencePaletteHorisontal;
            };
            if (parameters.preferencePlaySound != null) {
                this.canvasUsers[userIndex].preferencePlaySound = parameters.preferencePlaySound;
                this.currentUser.preferencePlaySound = parameters.preferencePlaySound;
            };
            if (parameters.preferenceDebugSession != null) {
                this.canvasUsers[userIndex].preferenceDebugSession = parameters.preferenceDebugSession;
                this.currentUser.preferenceDebugSession = parameters.preferenceDebugSession;
            };
            if (parameters.preferenceAutoSync != null) {
                this.canvasUsers[userIndex].preferenceAutoSync = parameters.preferenceAutoSync;
                this.currentUser.preferenceAutoSync = parameters.preferenceAutoSync;
            };
            if (parameters.preferenceSnapToGrid != null) {
                this.canvasUsers[userIndex].preferenceSnapToGrid = parameters.preferenceSnapToGrid;
                this.currentUser.preferenceSnapToGrid = parameters.preferenceSnapToGrid;
            };
            if (parameters.preferenceShowOpenStartupMessage != null) {
                this.canvasUsers[userIndex].preferenceShowOpenStartupMessage = parameters.preferenceShowOpenStartupMessage;
                this.currentUser.preferenceShowOpenStartupMessage = parameters.preferenceShowOpenStartupMessage;
            };
            if (parameters.preferenceShowOpenDataCombinationMessage != null) {
                this.canvasUsers[userIndex].preferenceShowOpenDataCombinationMessage = parameters.preferenceShowOpenDataCombinationMessage;
                this.currentUser.preferenceShowOpenDataCombinationMessage = parameters.preferenceShowOpenDataCombinationMessage;
            };
            if (parameters.preferenceShowViewStartupMessage != null) {
                this.canvasUsers[userIndex].preferenceShowViewStartupMessage = parameters.preferenceShowViewStartupMessage;
                this.currentUser.preferenceShowViewStartupMessage = parameters.preferenceShowViewStartupMessage;
            };
            if (parameters.preferenceShowDiscardStartupMessage != null) {
                this.canvasUsers[userIndex].preferenceShowDiscardStartupMessage = parameters.preferenceShowDiscardStartupMessage;
                this.currentUser.preferenceShowDiscardStartupMessage = parameters.preferenceShowDiscardStartupMessage;
            };
            if (parameters.preferenceDefaultTemplateID != null) {
                this.canvasUsers[userIndex].preferenceDefaultTemplateID = parameters.preferenceDefaultTemplateID;
                this.currentUser.preferenceDefaultTemplateID = parameters.preferenceDefaultTemplateID;
            };
            if (parameters.preferenceDefaultDateformat != null) {
                this.canvasUsers[userIndex].preferenceDefaultDateformat = parameters.preferenceDefaultDateformat;
                this.currentUser.preferenceDefaultDateformat = parameters.preferenceDefaultDateformat;
            };
            if (parameters.preferenceDefaultFolder != null) {
                this.canvasUsers[userIndex].preferenceDefaultFolder = parameters.preferenceDefaultFolder;
                this.currentUser.preferenceDefaultFolder = parameters.preferenceDefaultFolder;
            };
            if (parameters.preferenceDefaultPrinter != null) {
                this.canvasUsers[userIndex].preferenceDefaultPrinter = parameters.preferenceDefaultPrinter;
                this.currentUser.preferenceDefaultPrinter = parameters.preferenceDefaultPrinter;
            };
            if (parameters.preferenceDefaultPageSize != null) {
                this.canvasUsers[userIndex].preferenceDefaultPageSize = parameters.preferenceDefaultPageSize;
                this.currentUser.preferenceDefaultPageSize = parameters.preferenceDefaultPageSize;
            };
            if (parameters.preferenceDefaultPageLayout != null) {
                this.canvasUsers[userIndex].preferenceDefaultPageLayout = parameters.preferenceDefaultPageLayout;
                this.currentUser.preferenceDefaultPageLayout = parameters.preferenceDefaultPageLayout;
            };
            if (parameters.preferenceDefaultSnapshotMins != null) {
                this.canvasUsers[userIndex].preferenceDefaultSnapshotMins = parameters.preferenceDefaultSnapshotMins;
                this.currentUser.preferenceDefaultSnapshotMins = parameters.preferenceDefaultSnapshotMins;
            };

            if (parameters.preferenceStartupDashboardID != null) {
                this.canvasUsers[userIndex].preferenceStartupDashboardID = parameters.preferenceStartupDashboardID;
                this.currentUser.preferenceStartupDashboardID = parameters.preferenceStartupDashboardID;
            };
            if (parameters.preferenceStartupDashboardTabID != null) {
                this.canvasUsers[userIndex].preferenceStartupDashboardTabID = parameters.preferenceStartupDashboardTabID;
                this.currentUser.preferenceStartupDashboardTabID = parameters.preferenceStartupDashboardTabID;
            };
            if (parameters.preferenceShowWidgetEditorLite != null) {
                this.canvasUsers[userIndex].preferenceShowWidgetEditorLite = parameters.preferenceShowWidgetEditorLite;
                this.currentUser.preferenceShowWidgetEditorLite = parameters.preferenceShowWidgetEditorLite;
            };

            // Update console.log
            this.sessionDebugging = parameters.preferenceDebugSession;

            // Save in DB
            this.saveResource('canvasUsers', this.canvasUsers[userIndex]);
        };
    }

    setBaseUrl(pathUrl: string): string {
       // Description: Gets the caching table that drives local caching process
       if (this.sessionDebugging) {
        console.log('%c    Global-Variables setBaseUrl starts',
            this.concoleLogStyleForStartOfUtilFunctions,
            pathUrl);
        };

        // CanvasDatabase: Local or Server
        let baseUrl: string = this.canvasServerURI + '/canvasdata/';

        // Return
        return baseUrl;

    }

    getDataCachingTable(): Promise<DataCachingTable[]> {
       // Description: Gets the caching table that drives local caching process
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getDataCachingTable starts',
                this.concoleLogStyleForStartOfMethod,
                this.dataCachingTable.length);
        };

        // Note: this does NOT use getResources, since getResources uses this table
        // to determine what to load in memory !!  So, it cant work that way.
        return new Promise<DataCachingTable[]>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let pathUrl: string = 'dataCachingTable';
            let finalUrl: string = this.setBaseUrl(pathUrl) + pathUrl;
            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables getDataCachingTable: ' + httpResponse.message);
                        reject('Error in Global Variables getDataCachingTable: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getDataCachingTable: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getDataCachingTable: Data in response object is null; it should be an array');
                        return;
                    };

                    this.dataCachingTable = httpResponse.data;

                    // TODO - should be done by the Server
                    // NB - need to remember cache has been refreshed locally
                    //      This is not stored on Server; updated each time it is loaded here
                    let today = new Date();
                    this.dataCachingTable.forEach(dc => {
                        dc.localLastUpdatedDateTime = today
                    })


                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getDataCachingTable ends',
                            this.concoleLogStyleForEndOfMethod,
                            this.dataCachingTable)
                    };

                    resolve(this.dataCachingTable);
                },
                err => {
                    console.error('Error in Global-Variables getDataCachingTable', err.message)
                    reject(err.message)
                }
            );
        });

    }

    refreshCurrentDashboard(
        refreshingRoutine: string,
        dashboardID: number,
        dashboardTabID: number = 0,
        tabToShow: string = '',
        widgetsToRefresh: number[] = []): string {
        // Refresh the global var currentDashboardInfo, then .next it.
        // This will refresh the Dashboard on the screen (via .subscribe)
        // If a dashboardTabID is given, this one will be shown.  Else, it will navigate
        // to tabToShow, which can be First, Previous, Next, Last.  tabToShow overules
        // dashboardTabID if tabToShow is given.  It does not assume that all the currentD
        // Info has already been collected - to allow for the first time this is called.
        // It does assume that we have a currentDashboardInfo object if Previous/Next are
        // parameters.
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables refreshCurrentDashboard starts',
                this.concoleLogStyleForStartOfMethod,
                'called from:', refreshingRoutine, {refreshingRoutine}, {dashboardID}, 
                {dashboardTabID}, {tabToShow}, {widgetsToRefresh});
        };

        // TODO - add Permissions, either here or automatically in DB !!!

        // Make sure the currT are indeed for the requested D
        let currentDashboardTabs: DashboardTab[];
        currentDashboardTabs = this.dashboardTabs.filter(t => t.dashboardID === dashboardID);
        currentDashboardTabs = currentDashboardTabs.sort( (obj1,obj2) => {
            if (obj1.displayOrder > obj2.displayOrder) {
                return 1;
            };
            if (obj1.displayOrder < obj2.displayOrder) {
                return -1;
            };
            return 0;
        });

        // Assume we have all currentD info
        if ( ( (tabToShow === 'Previous')  ||  (tabToShow === 'Next') )  &&
            (this.currentDashboardInfo == null) ) {
            console.error('Error in Global-Variables refreshCurrentDashboard returned since this.currentDashboardInfo == null')
            return 'Error';
        };

        let dt = new Date();
        let x: number = 0;
        let y: number = 0;

        if (tabToShow != '') {
            if (currentDashboardTabs.length === 0) {
                console.error('Error in Global-Variables refreshCurrentDashboard returned since currentDashboardTabs.length === 0', dashboardID, this.dashboards, this.dashboardTabs)
                return 'Error';
            };
            if (tabToShow === 'First') {
                x = 0;
            };
            if (tabToShow === 'Previous') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex - 1;
                if (x < 0) {
                    x = currentDashboardTabs.length - 1;
                };
            };
            if (tabToShow === 'Next') {
                x = this.currentDashboardInfo.value.currentDashboardTabIndex + 1;
                if (x >= currentDashboardTabs.length) {
                    x = 0;
                };
            };
            if (tabToShow === 'Last') {
                x = currentDashboardTabs.length - 1;
            };
            y = currentDashboardTabs[x].id;
        } else {
            y = dashboardTabID;

            if (currentDashboardTabs.length === 0) {
                x = 0;
            } else {
                for (var i = 0; i < currentDashboardTabs.length; i++) {
                    if (currentDashboardTabs[i].id === dashboardTabID) {
                        x = i;
                    };
                };
            };
        };

        // Inform subscribers of the change
        let dashboardIndex: number = this.dashboards.findIndex(d => d.id === dashboardID)
        let state: string = 'Draft';
        if (dashboardIndex >= 0) {
            state = this.dashboards[dashboardIndex].state;
        };
        this.currentDashboardInfo.next({
            currentDashboardID: dashboardID,
            currentDashboardState: state,
            currentDashboardTabID: y,
            currentDashboardTabIndex: x,
            refreshingRoutine: refreshingRoutine,
            refreshDateTime: dt,
            widgetsToRefresh
        });

    }

    widgetReplace(changedWidget: Widget) {
        // Replaces (ByVal) the global W and currentW
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables ... widgetReplace',
                this.concoleLogStyleForEndOfMethod, {changedWidget});
        };

        // Replace into widgets
        let widgetIndex: number = this.widgets.findIndex(w =>
            w.id === changedWidget.id
        );
        if (widgetIndex >= 0) {
            this.widgets[widgetIndex] =
                JSON.parse(JSON.stringify(changedWidget));
        };

        // Replace into currentWidgets
        let currentWidgetIndex: number = this.currentWidgets.findIndex(w =>
            w.id === changedWidget.id
        );
        if (currentWidgetIndex >= 0) {
            this.currentWidgets[currentWidgetIndex] =
            JSON.parse(JSON.stringify(changedWidget));
        };
    }

    sleep(milliseconds: number) {
        // Sleep for a while
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables sleep starts',
                this.concoleLogStyleForStartOfUtilFunctions,
                {milliseconds});
        };

        var start: number = new Date().getTime();
        console.log('  start', {start}, new Date().getTime())
        for (var counter = 0; counter < 3600001; counter++) {
            let mod:number = counter%60000;
            // TODO - remove this console.log BUT at moment sleep increments counter * 60000
            console.log({counter}, {mod});
            if (mod === 0) {
                console.log ('   Minutes elapsed ', {counter}, {mod} )
            }
            if ((new Date().getTime() - start) > milliseconds){
                console.log('  end', {start}, new Date().getTime())

                break;
            }
        }
    }

    createVegaSpec(
        widget: Widget,
        height: number = 400,
        width: number = 400,
        showSpecificGraphLayer: boolean = false,
        specificLayerToShow: number = 0): dl.spec.TopLevelExtentedSpec {

        // Creates and returns a specification for Vega visual grammar
        // The widget contains All the information needed to create the specification
        if (this.sessionDebugging) {
            let widgetID: number = widget.id;
            console.log('%c  Global-Variables createVegaSpec starts',
                this.concoleLogStyleForStartOfMethod,
                {widgetID});
        };

        // Sanitiy Check
        let specification: any = {};
        if (widget.visualGrammarType == null) {
            widget.visualGrammarType = 'standard';
        };
        if (widget.graphLayers == null  ||  widget.graphLayers.length === 0) {
            return;
        };
        console.log('xx CreateVega widget.graphLayers.length', widget.graphLayers.length, widget.visualGrammarType, widget.graphLayers[0].graphMark.toLocaleLowerCase() === 'navigator')

        // Custom visualGrammarType - return after each one
        if (widget.visualGrammarType.toLowerCase() === 'custom') {
            specification = widget.graphLayers[0].graphSpecification;

            // General
            specification['description'] = widget.graphDescription;
            specification['width'] = width;
            specification['height'] = height;

            // Replace the data in the spec - each custom one is different
            if (widget.graphLayers[0].graphMark === 'donutSliders') {
                let xDataValues: any = widget.dataFiltered.map(x => {
                    let obj: any = {
                        "id": x[widget.graphLayers[0].graphXfield],
                        "field": x[widget.graphLayers[0].graphYfield]
                    };
                    return obj;
                });

                specification['data'][0]['values'] = xDataValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark === 'wordCloud') {
                let xColumnValues: any = widget.dataFiltered.map(
                    x => x[widget.graphLayers[0].graphXfield]
                );

                // Remove nulls as WordCloud doesnot like it
                xColumnValues = xColumnValues.filter(x => x != null);
                specification['data'][0]['values'] = xColumnValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark === 'networkCircle') {

                return specification;
            };
            if (widget.graphLayers[0].graphMark.toLocaleLowerCase() === 'navigator') {
                console.log('xx GV widget.dataFiltered', widget.dataFiltered)
                specification['data'][0]['values'] = widget.dataFiltered;
                return specification;
            };

        };


        // NB - the rest of the Code deals ONLY with the STANDARD visualGrammarType

        return;
    }

    createVegaLiteSpec(
        widget: Widget,
        height: number = 0,
        width: number = 0,
        showSpecificGraphLayer: boolean = false,
        specificLayerToShow: number = 0): dl.spec.TopLevelExtentedSpec {

        // Creates and returns a specification for Vega-Lite visual grammar
        if (this.sessionDebugging) {
            let widgetID: number = widget.id;
            console.log('%c  Global-Variables createVegaLiteSpec starts',
                this.concoleLogStyleForStartOfMethod,
                {widgetID});
        };

        let specification: any = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A simple bar chart with embedded data.",
            "background": widget.graphBackgroundColor,
            "title": {
                "text": "",
                "anchor": "start",
                "angle": 0,
                "baseline": "top",
                "color": "red",
                "font": "",
                "fontSize": 10,
                "fontWeight": 400,
                "limit": 0
            },
            "data": {
                "values": []
            },
            "transform": [],
            "config": {
                "style": {
                  "cell": {
                    "stroke": widget.graphBorderColor
                  }
                }
            }
        };

        // Custom visualGrammarType - RETURN after each one
        if (widget.visualGrammarType == null) {
            widget.visualGrammarType = 'standard';
        };

        if (widget.visualGrammarType.toLowerCase() === 'custom') {
            specification = widget.graphLayers[0].graphSpecification;

            // Replace the data in the spec - each custom one is different
            if (widget.graphLayers[0].graphMark === 'waterfall') {
                // let xDataValues: any = widget.graphData.map(x => {
                //     let obj: any = {
                //         "id": x[widget.graphLayers[0].graphXfield],
                //         "field": x[widget.graphLayers[0].graphYfield]
                //     };
                //     return obj;
                // });

                // specification['data'][0]['values'] = xDataValues;

                return specification;
            };
            if (widget.graphLayers[0].graphMark === 'marginalHistogram') {

                return specification;
            };
            if (widget.graphLayers[0].graphMark === 'geoshape') {

                return specification;
            };
        };


        // NB - the rest of the Code deals ONLY with the STANDARD visualGrammarType


        // Optional Sampling
        if (widget.sampleNumberRows != 0) {
            specification['transform']['sample'] = widget.sampleNumberRows;
        };

        // General
        specification['description'] = widget.graphDescription;
        specification['width'] = width;
        specification['height'] = height;

        // Title
        specification['title']['text'] = widget.graphTitleText;
        if (widget.graphTitleAnchor != null) {
            specification['title']['anchor'] = widget.graphTitleAnchor.toLowerCase();
        };
        specification['title']['angle'] = widget.graphTitleAngle;
        if (widget.graphTitleBaseline != null) {
            specification['title']['baseline'] = widget.graphTitleBaseline.toLowerCase();
        };
        specification['title']['color'] = widget.graphTitleColor;
        specification['title']['font'] = widget.graphTitleFont;
        specification['title']['fontSize'] = widget.graphTitleFontSize;
        specification['title']['fontWeight'] = widget.graphTitleFontWeight;
        specification['title']['limit'] = widget.graphTitleLength;
        if (widget.graphTitleOrientation != null) {
            specification['title']['orient'] = widget.graphTitleOrientation.toLowerCase();
        };


        // Data
        if (widget.graphUrl != ""  &&  widget.graphUrl != null) {
            specification['data'] = {"url": widget.graphUrl};
        } else {
            this.applyWidgetFilter(widget);
            specification['data'] = {"values": widget.dataFiltered};
        };

        // Selection
        if (widget.graphPanAndZoom) {
            specification['selection'] =
                {
                    "grid": {
                    "type": "interval", "bind": "scales"
                    }
                };
        };


        // Calculated Fields
        if (widget.graphCalculations == null) {
            widget.graphCalculations = [];
        };
        for (var i = 0; i < widget.graphCalculations.length; i++) {

            // Split function
            let calcFunction: string = '';
            let calcFields: string[] = [];
            let sortFields: string[] = [];
            let frameFields: string[] = [];

            // Take out spaces typed by user
            widget.graphCalculations[i].calculatedExpression =
                widget.graphCalculations[i].calculatedExpression.replace(/ /gi,"");

            // Get brackets and extract Formula and Fields
            let bracketLeftIndex: number = widget.graphCalculations[i].calculatedExpression.indexOf('(');
            let bracketRightIndex: number = widget.graphCalculations[i].calculatedExpression.indexOf(')');

            if ( (bracketLeftIndex > 0)  ||  ( (bracketRightIndex - bracketLeftIndex) > 1) ) {
                calcFunction = widget.graphCalculations[i].calculatedExpression
                    .substring(0, bracketLeftIndex);
                calcFields = widget.graphCalculations[i].calculatedExpression
                    .substring(bracketLeftIndex + 1, bracketRightIndex)
                    .split(",");
            };


            // Cumulation Function
            if (calcFunction.toLowerCase() === 'sum'  &&  calcFields.length > 0) {
                specification['transform'].push(
                    {
                        "window": [{
                            "op": "sum",
                            "field": calcFields[0],
                            "as": widget.graphCalculations[i].calculatedAs
                        }],
                        "frame": [null, null]
                    }
                );

            } else if (calcFunction.toLowerCase() === 'cumulate'  &&  calcFields.length > 0) {
                specification['transform'].push(
                    {
                        "sort": [{"field": calcFields[0]}],
                        "window": [
                            {
                                "op": "count",
                                "field": "count",
                                "as": widget.graphCalculations[i].calculatedAs
                            }
                        ],
                        "frame": [null, 0]
                    }
                );

            } else if (calcFunction.toLowerCase() === 'rank'  &&  calcFields.length > 1) {
                specification['transform'].push(
                    {
                        "sort": [
                            {"field": calcFields[0], "order": "descending"},
                            {"field": calcFields[1], "order": "descending"}
                        ],
                        "window": [{
                        "op": "rank",
                        "as": widget.graphCalculations[i].calculatedAs
                        }],
                        "groupby": [calcFields[1]]
                    }
                );
            } else {

                // Add Calculation Formula the transformation channel
                specification['transform'].push(
                    {
                            "calculate": widget.graphCalculations[i].calculatedExpression,
                            "as": widget.graphCalculations[i].calculatedAs
                    }
                );

            };
        };


        // Filter
        if (widget.widgetFilters == null) {
            widget.widgetFilters = [];
        };
        let widgetFilters = widget.widgetFilters.filter(gflt => gflt.isActive).slice();

        for (var i = 0; i < widgetFilters.length; i++) {

            let filterSpec: any = null;
            let filterFieldDataType: string = 'string';
            let filterFieldDataTypeIndex: number = widget.dataschema.findIndex(
                dat => dat.name === widgetFilters[i].filterFieldName
            );

            if (filterFieldDataTypeIndex >= 0) {
                filterFieldDataType = widget.dataschema[filterFieldDataTypeIndex].type;
            };

            if (widgetFilters[i].filterOperator === 'Not Equal') {
                if (filterFieldDataType === 'string'
                    ||
                    widgetFilters[i].filterTimeUnit.toLowerCase() === 'month') {
                    filterSpec =
                        {"filter":

                                "datum." + widgetFilters[i].filterFieldName + " != '"
                                + widgetFilters[i].filterValue + "'"

                        };
                } else {
                    filterSpec =
                        {"filter":

                                "datum." + widgetFilters[i].filterFieldName + " != "
                                + +widgetFilters[i].filterValue

                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Equal') {
                if (filterFieldDataType === 'string'
                    ||
                    widgetFilters[i].filterTimeUnit.toLowerCase() === 'month') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "equal": widgetFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "equal": +widgetFilters[i].filterValue
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Less Than') {

                if (filterFieldDataType === 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "lt": widgetFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "lt": +widgetFilters[i].filterValue
                            }
                        };
                };

            };

            if (widgetFilters[i].filterOperator === 'Less Than Equal') {

                if (filterFieldDataType === 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "lte": widgetFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "lte": +widgetFilters[i].filterValue
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Greater Than') {

                if (filterFieldDataType === 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "gt": widgetFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "gt": +widgetFilters[i].filterValue
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Greater Than Equal') {

                if (filterFieldDataType === 'string') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "gte": widgetFilters[i].filterValue
                            }
                        };
                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "gte": +widgetFilters[i].filterValue
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Range') {

                if (filterFieldDataType === 'number') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "range": [
                                    +widgetFilters[i].filterValueFrom,
                                    +widgetFilters[i].filterValueTo
                                ]
                            }
                        };

                } else {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "range": [
                                    widgetFilters[i].filterValueFrom,
                                    widgetFilters[i].filterValueTo
                                ]
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'One Of') {

                let fromTo: string[] = widgetFilters[i].filterValue.split(',');
                if (fromTo.length > 0) {
                    if (filterFieldDataType === 'number') {
                        let fromToNumber: number[] = fromTo.map(x => +x);
                        filterSpec =
                            {"filter":
                                {
                                    "field": widgetFilters[i].filterFieldName,
                                    "oneOf": fromToNumber
                                }
                            };

                    } else {
                        filterSpec =
                            {"filter":
                                {
                                    "field": widgetFilters[i].filterFieldName,
                                    "oneOf": fromTo
                                }
                            };
                    };
                };
            };

            if (widgetFilters[i].filterOperator === 'Valid') {

                if (filterFieldDataType === 'number') {
                    filterSpec =
                        {"filter":
                            {
                                "field": widgetFilters[i].filterFieldName,
                                "valid": true
                            }
                        };
                };
            };

            if (widgetFilters[i].filterOperator === 'Selection') {

                filterSpec = [
                    {"filter":
                        {
                            "field": widgetFilters[i].filterValue,
                            "selection": widgetFilters[i].filterValue
                        }
                    }
                ];
            };

            // Add to Vega Spec
            if (filterSpec != null) {
                if (widgetFilters[i].filterTimeUnit != '') {
                    filterSpec['filter']['timeUnit'] = widgetFilters[i].filterTimeUnit.toLowerCase();
                };

                specification['transform'].push(filterSpec);
                // widget.graphTransformations.push(graphTransformationSpec);
            };

            console.warn('xx createVegaLiteSpec END FILTER widget.widgetFilters', widget.widgetFilters);

        }


        let currentGraphLayer: number = 0;
        let specificationInnerArray: any[] = [];

        for (currentGraphLayer = 0; currentGraphLayer < widget.graphLayers.length; currentGraphLayer++) {

            // Define new innec Spec
            let specificationInner: any = {
                "mark": {
                    "type": "bar",
                    "tooltip": {
                        "content": "data"
                }
                },
                "encoding": {
                    "x": {
                        "field": "",
                        "type": "",
                        "axis": "",
                        "scale": ""
                    },
                    "y": {
                        "field": "",
                        "type": "",
                        "axis": "",
                        "scale": ""
                    },
                    "color": {
                        "field": "",
                        "type": "",
                        "scale": "",
                        "legend": ""
                    },
                    "size": {
                        "field": ""
                    }
                }
            };

            // Mark
            specificationInner['mark']['type'] = widget.graphLayers[currentGraphLayer].graphMark;
            specificationInner['mark']['orient'] = widget.graphLayers[currentGraphLayer].graphMarkOrient.toLowerCase();
            specificationInner['mark']['line'] = widget.graphLayers[currentGraphLayer].graphMarkLine;
            if (widget.graphLayers[currentGraphLayer].graphMarkPoint) {
                specificationInner['mark']['point'] = { "color": widget.graphLayers[currentGraphLayer].graphMarkPointColor};
            };
            specificationInner['mark']['color'] = widget.graphLayers[currentGraphLayer].graphMarkColour;
            specificationInner['mark']['cornerRadius'] = widget.graphLayers[currentGraphLayer].graphMarkCornerRadius;
            specificationInner['mark']['opacity'] = widget.graphLayers[currentGraphLayer].graphMarkOpacity;
            specificationInner['mark']['binSpacing'] = widget.graphLayers[currentGraphLayer].graphMarkBinSpacing;
            if (widget.graphLayers[currentGraphLayer].graphMarkInterpolate === "Step") {
                specificationInner['mark']['interpolate'] = "step-after";
            };

            let vegaGraphMarkExtent: string = 'stderr';
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent === 'Confidence Interval') {
                vegaGraphMarkExtent = 'ci';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent === 'Std Error') {
                vegaGraphMarkExtent = 'stderr';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent === 'Std Deviation') {
                vegaGraphMarkExtent = 'stdev';
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkExtent === 'Q1 and Q3') {
                vegaGraphMarkExtent = 'iqr';
            };

            specificationInner['mark']['extent'] = "";
            if (widget.graphLayers[currentGraphLayer].graphMark === 'errorband') {
                specificationInner['mark']['extent'] = vegaGraphMarkExtent;
            };
            if (widget.graphLayers[currentGraphLayer].graphMark === 'errorbar') {
                specificationInner['mark']['extent'] = vegaGraphMarkExtent;
                specificationInner['mark']['ticks'] = true;
            };
            if (widget.graphLayers[currentGraphLayer].graphMarkSize != null
                &&
                widget.graphLayers[currentGraphLayer].graphMarkSize != 0) {
                specificationInner['mark']['size'] =
                    widget.graphLayers[currentGraphLayer].graphMarkSize;
            };



            // Text Channel
            if (widget.graphLayers[currentGraphLayer].graphMark === 'text') {
                if (widget.graphLayers[currentGraphLayer].graphXfield != '') {
                    specificationInner['encoding']['text'] = {
                        "field": widget.graphLayers[currentGraphLayer].graphXfield,
                        "type": widget.graphLayers[currentGraphLayer].graphXtype.toLowerCase(),
                        "aggregate": widget.graphLayers[currentGraphLayer].graphXaggregate,
                        "align": "left",
                        "baseline": "middle",
                        "dx": 3,
                        "format": widget.graphLayers[currentGraphLayer].graphXformat
                    };
                };
            };



            // X field
            if (widget.graphLayers[currentGraphLayer].graphXfield != '') {
                specificationInner['encoding']['x']['field'] = widget.graphLayers[currentGraphLayer].graphXfield;
                specificationInner['encoding']['x']['aggregate'] = widget.graphLayers[currentGraphLayer].graphXaggregate;
                if (widget.graphLayers[currentGraphLayer].graphXMaxBins > 0) {
                    specificationInner['encoding']['x']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphXMaxBins};
                } else {
                    specificationInner['encoding']['x']['bin'] = widget.graphLayers[currentGraphLayer].graphXbin;
                };
                specificationInner['encoding']['x']['format'] = widget.graphLayers[currentGraphLayer].graphXformat.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphXimpute != '') {
                    if (widget.graphLayers[currentGraphLayer].graphXimpute === 'Value') {
                        specificationInner['encoding']['x']['impute'] =
                            {"value": widget.graphLayers[currentGraphLayer].graphXimputeValue };
                    } else {
                        specificationInner['encoding']['x']['impute'] =
                            {"method": widget.graphLayers[currentGraphLayer].graphXimpute};
                    };
                };
                specificationInner['encoding']['x']['stack'] = widget.graphLayers[currentGraphLayer].graphXstack;
                specificationInner['encoding']['x']['sort'] = widget.graphLayers[currentGraphLayer].graphXsort.toLowerCase();
                specificationInner['encoding']['x']['type'] = widget.graphLayers[currentGraphLayer].graphXtype.toLowerCase();
                specificationInner['encoding']['x']['timeUnit'] = widget.graphLayers[currentGraphLayer].graphXtimeUnit.toLowerCase();

                if (widget.graphLayers[currentGraphLayer].graphXaxisScaleType != 'Default'  &&  widget.graphLayers[currentGraphLayer].graphXaxisScaleType != undefined) {
                    specificationInner['encoding']['x']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphXaxisScaleType.toLowerCase() };
                };

                specificationInner['encoding']['x']['axis'] = {"grid": widget.graphLayers[currentGraphLayer].graphXaxisGrid };
                if (widget.graphLayers[currentGraphLayer].graphXaxisGrid) {
                    specificationInner['encoding']['x']['axis'] = {"gridColor": widget.graphLayers[currentGraphLayer].graphXaxisGridColor };
                };

                specificationInner['encoding']['x']['axis']['labels'] = widget.graphLayers[currentGraphLayer].graphXaxisLabels;
                if (widget.graphLayers[currentGraphLayer].graphXaxisLabelAngle != 0){
                    specificationInner['encoding']['x']['axis']['labelAngle'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelAngle;
                };
                if (widget.graphLayers[currentGraphLayer].graphXaxisLabels) {
                    specificationInner['encoding']['x']['axis']['labelColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    specificationInner['encoding']['x']['axis']['tickColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    specificationInner['encoding']['x']['axis']['titleColor'] = widget.graphLayers[currentGraphLayer].graphXaxisLabelColor;
                    if (widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength != null
                        && widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength > 0) {
                            specificationInner['encoding']['x']['axis']['labelLimit'] =
                                widget.graphLayers[currentGraphLayer].graphXaxisLabelsLength;
                    };
                };

                if (!widget.graphLayers[currentGraphLayer].graphXaxisTitleCheckbox) {
                    specificationInner['encoding']['x']['axis']['title'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphXaxisTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphXaxisTitle != undefined) {
                        specificationInner['encoding']['x']['axis']['title'] = widget.graphLayers[currentGraphLayer].graphXaxisTitle;
                    };
                };

                if (widget.graphLayers[currentGraphLayer].graphXaxisFormat != '') {
                    specificationInner['encoding']['x']['axis']['format'] =  widget.graphLayers[currentGraphLayer].graphXaxisFormat;
                };

                specificationInner['encoding']['x']['axis']['maxExtent'] = widget.graphDimensionBottom;
                // specificationInner['encoding']['x']['axis']['labelLimit'] = widget.graphDimensionBottom;


                if (widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart != null
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd != null) {

                    if(specificationInner['encoding']['x']['scale'] === "") {
                        specificationInner['encoding']['x']['scale'] = {
                            "domain":
                            [
                                Number(widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart),
                                Number(widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd)
                            ]
                        };
                    } else {
                        specificationInner['encoding']['x']['scale']['domain'] =
                            [
                                widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainStart,
                                widget.graphLayers[currentGraphLayer].graphXaxisScaleDomainEnd
                            ];
                        specificationInner['mark']['clip'] = true;
                    };
                };
            };



            // Y field
            if (widget.graphLayers[currentGraphLayer].graphYfield != '') {
                specificationInner['encoding']['y']['field'] = widget.graphLayers[currentGraphLayer].graphYfield;
                specificationInner['encoding']['y']['aggregate'] = widget.graphLayers[currentGraphLayer].graphYaggregate;
                if (widget.graphLayers[currentGraphLayer].graphYMaxBins > 0) {
                    specificationInner['encoding']['y']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphYMaxBins};
                } else {
                    specificationInner['encoding']['y']['bin'] = widget.graphLayers[currentGraphLayer].graphYbin;
                };
                specificationInner['encoding']['y']['format'] = widget.graphLayers[currentGraphLayer].graphYformat.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphYimpute != '') {
                    if (widget.graphLayers[currentGraphLayer].graphYimpute === 'Value') {
                        specificationInner['encoding']['y']['impute'] =
                            {"value": +widget.graphLayers[currentGraphLayer].graphYimputeValue };
                    } else {
                        specificationInner['encoding']['y']['impute'] =
                            {"method": widget.graphLayers[currentGraphLayer].graphYimpute.toLowerCase() };
                    };
                };
                specificationInner['encoding']['y']['stack'] = widget.graphLayers[currentGraphLayer].graphYstack.toLowerCase();
                specificationInner['encoding']['y']['sort'] = widget.graphLayers[currentGraphLayer].graphYsort.toLowerCase();
                specificationInner['encoding']['y']['type'] = widget.graphLayers[currentGraphLayer].graphYtype.toLowerCase();
                specificationInner['encoding']['y']['timeUnit'] = widget.graphLayers[currentGraphLayer].graphYtimeUnit.toLowerCase();

                if (widget.graphLayers[currentGraphLayer].graphYaxisScaleType != 'Default'  &&  widget.graphLayers[currentGraphLayer].graphYaxisScaleType != undefined) {
                    specificationInner['encoding']['y']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphYaxisScaleType.toLowerCase() };
                };

                specificationInner['encoding']['y']['axis'] = {"grid": widget.graphLayers[currentGraphLayer].graphYaxisGrid };
                if (widget.graphLayers[currentGraphLayer].graphYaxisGrid) {
                    specificationInner['encoding']['y']['axis'] = {"gridColor": widget.graphLayers[currentGraphLayer].graphYaxisGridColor };
                };

                specificationInner['encoding']['y']['axis']['labels'] = widget.graphLayers[currentGraphLayer].graphYaxisLabels;
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabelAngle != 0){
                    specificationInner['encoding']['y']['axis']['labelAngle'] =
                        widget.graphLayers[currentGraphLayer].graphYaxisLabelAngle;
                };
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabels) {
                    specificationInner['encoding']['y']['axis']['labelColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                    specificationInner['encoding']['y']['axis']['tickColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                    specificationInner['encoding']['y']['axis']['titleColor'] = widget.graphLayers[currentGraphLayer].graphYaxisLabelColor;
                };
                if (widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength != null
                    && widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength > 0) {
                        specificationInner['encoding']['y']['axis']['labelLimit'] =
                            widget.graphLayers[currentGraphLayer].graphYaxisLabelsLength;
                };

                if (!widget.graphLayers[currentGraphLayer].graphYaxisTitleCheckbox) {
                    specificationInner['encoding']['y']['axis']['title'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphYaxisTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphYaxisTitle != undefined) {
                        specificationInner['encoding']['y']['axis']['title'] =
                            widget.graphLayers[currentGraphLayer].graphYaxisTitle;
                    };
                };

                if (widget.graphLayers[currentGraphLayer].graphYaxisFormat != '') {
                    specificationInner['encoding']['y']['axis']['format'] =  widget.graphLayers[currentGraphLayer].graphYaxisFormat;
                };
                specificationInner['encoding']['y']['axis']['maxExtent'] = widget.graphDimensionLeft;
                // specificationInner['encoding']['y']['axis']['labelLimit'] = widget.graphDimensionLeft;

                if (widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart != null
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd != ''
                    &&
                    widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd != null) {

                    if(specificationInner['encoding']['y']['scale'] === "") {
                        specificationInner['encoding']['y']['scale'] = {
                            "domain":
                            [
                                Number(widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart),
                                Number(widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd)
                            ]
                        };
                    } else {
                        specificationInner['encoding']['y']['scale']['domain'] =
                            [
                                widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainStart,
                                widget.graphLayers[currentGraphLayer].graphYaxisScaleDomainEnd
                            ];
                        specificationInner['mark']['clip'] = true;
                    };
                };
            };



            // Conditional pre-work
            this.conditionFieldDataType = 'string';
            this.conditionOperator = '==';
            if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
            && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                let conditionFieldDataTypeIndex: number = widget.dataschema.findIndex(
                    dat => dat.name === widget.graphLayers[currentGraphLayer].conditionFieldName
                );
                if (conditionFieldDataTypeIndex >= 0) {
                    this.conditionFieldDataType = widget.dataschema[conditionFieldDataTypeIndex].type;
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator === 'Less Than') {
                    this.conditionOperator = '<';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator === 'Less Than Equal') {
                    this.conditionOperator = '<=';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator === 'Greater Than') {
                    this.conditionOperator = '>';
                };
                if (widget.graphLayers[currentGraphLayer].conditionOperator === 'Greater Than Equal') {
                    this.conditionOperator = '>=';
                };
            };


            // Color field
            if (widget.graphLayers[currentGraphLayer].graphColorField != '') {
                let colorBinMax: any = false;
                if (widget.graphLayers[currentGraphLayer].graphColorMaxBins > 0) {
                    colorBinMax = {"maxbins": widget.graphLayers[currentGraphLayer].graphColorMaxBins};
                } else {
                    colorBinMax = widget.graphLayers[currentGraphLayer].graphColorBin;
                };

                specificationInner['encoding']['color'] = {
                    "aggregate": widget.graphLayers[currentGraphLayer].graphColorAggregate,
                    "bin": colorBinMax,
                    "field": widget.graphLayers[currentGraphLayer].graphColorField,
                    "format": widget.graphLayers[currentGraphLayer].graphColorFormat.toLowerCase(),
                    "legend": "",
                    "sort": widget.graphLayers[currentGraphLayer].graphColorSort.toLowerCase(),
                    "stack": widget.graphLayers[currentGraphLayer].graphColorStack.toLowerCase(),
                    "timeUnit": widget.graphLayers[currentGraphLayer].graphColorTimeUnit.toLowerCase(),
                    "type": widget.graphLayers[currentGraphLayer].graphColorType.toLowerCase(),
                    "scale": widget.graphLayers[currentGraphLayer].graphColorScheme ==
                        'None'?  null  :  {"scheme": widget.graphLayers[currentGraphLayer].graphColorScheme.toLowerCase()}
                };

                if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
                    && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                        if (this.conditionFieldDataType.toLowerCase() === 'string') {
                            specificationInner['encoding']['color']['condition'] =
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " '" + widget.graphLayers[currentGraphLayer].conditionValue
                                + "'",
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            };
                        } else {
                            specificationInner['encoding']['color']['condition'] =
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " " + widget.graphLayers[currentGraphLayer].conditionValue,
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            };

                        };
                };

                // Legend
                if (widget.graphLayers[currentGraphLayer].graphLegendHide) {
                    specificationInner['encoding']['color']['legend'] = null;
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphLegendTitle == null) {
                        widget.graphLayers[currentGraphLayer].graphLegendTitle = '';
                    };
                    specificationInner['encoding']['color']['legend'] =
                        {
                            "labelColor" : widget.graphLayers[currentGraphLayer].graphLegendLabels?
                                           widget.graphLayers[currentGraphLayer].graphLegendLabelColor
                                           : 'transparent',
                            "tickColor" : widget.graphLayers[currentGraphLayer].graphLegendLabels?
                                          widget.graphLayers[currentGraphLayer].graphLegendLabelColor
                                          : 'transparent',
                            "titleColor" : widget.graphLayers[currentGraphLayer].graphLegendLabelColor,
                            "labelLimit": widget.graphDimensionRight,
                            "title": widget.graphLayers[currentGraphLayer].graphLegendTitleCheckbox?
                                        widget.graphLayers[currentGraphLayer].graphLegendTitle
                                        :  null
                        };
                };


                if (widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != 'Default'
                    &&
                    widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != undefined
                    &&
                    widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType != '') {
                    specificationInner['encoding']['color']['scale'] =
                    {"type": widget.graphLayers[currentGraphLayer].graphLegendAxisScaleType.toLowerCase() };
                };


                // if (widget. != '') {
                //     if (widget. === 'Value') {
                //         specificationInner['encoding']['color']['impute'] =
                //             {"value":' + widget.Value + '};
                //     } else {
                //         specificationInner['encoding']['color']['impute'] =
                //             {"method": "' + widget. + '"};
                //     };
                // };

            } else {

                if (widget.graphLayers[currentGraphLayer].conditionFieldName != ''
                    && widget.graphLayers[currentGraphLayer].conditionFieldName != null) {

                        if (this.conditionFieldDataType.toLowerCase() === 'string') {
                            specificationInner['encoding']['color'] =
                            { "condition":
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " '" + widget.graphLayers[currentGraphLayer].conditionValue
                                + "'",
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            }
                            };
                        } else {
                            specificationInner['encoding']['color']['condition'] =
                            specificationInner['encoding']['color'] =
                            { "condition":
                            {
                                "test": "datum." + widget.graphLayers[currentGraphLayer].conditionFieldName
                                + " " + this.conditionOperator + " " + widget.graphLayers[currentGraphLayer].conditionValue,
                                "value": widget.graphLayers[currentGraphLayer].conditionColour
                            }
                            };

                        };
                };

            };



            // Size field
            if (widget.graphLayers[currentGraphLayer].graphSizeField != '') {

                specificationInner['encoding']['size']['field'] = widget.graphLayers[currentGraphLayer].graphSizeField;
                specificationInner['encoding']['size']['type'] = widget.graphLayers[currentGraphLayer].graphSizeType.toLowerCase();
                specificationInner['encoding']['size']['aggregate'] = widget.graphLayers[currentGraphLayer].graphSizeAggregate.toLowerCase();
                if (widget.graphLayers[currentGraphLayer].graphSizeMaxBins > 0) {
                    specificationInner['encoding']['size']['bin'] =
                        {"maxbins": widget.graphLayers[currentGraphLayer].graphSizeMaxBins};
                } else {
                    specificationInner['encoding']['size']['bin'] = widget.graphLayers[currentGraphLayer].graphSizeBin;
                };


            } else {
                specificationInner['encoding']['size'] = {
                    "field": ""
                };
            };



            // Row field
            if (widget.graphLayers[currentGraphLayer].graphRowField != '') {

                specificationInner['encoding']['row'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphRowField,
                    "type": widget.graphLayers[currentGraphLayer].graphRowType.toLowerCase()
                };

                if (!widget.graphLayers[currentGraphLayer].graphRowTitleCheckbox) {
                    specificationInner['encoding']['row']['header'] = {"title": null};
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphRowTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphRowTitle != undefined) {
                        specificationInner['encoding']['row']['header'] = {"title": widget.graphLayers[currentGraphLayer].graphRowTitle};
                    };
                };

            };


            // Column field
            if (widget.graphLayers[currentGraphLayer].graphColumnField != '') {

                specificationInner['encoding']['column'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphColumnField,
                    "type": widget.graphLayers[currentGraphLayer].graphColumnType.toLowerCase()
                };

                if (!widget.graphLayers[currentGraphLayer].graphColumnTitleCheckbox) {
                    specificationInner['encoding']['column']['header'] = {"title": null};
                } else {
                    if (widget.graphLayers[currentGraphLayer].graphColumnTitle != ''  &&  widget.graphLayers[currentGraphLayer].graphColumnTitle != undefined) {
                        specificationInner['encoding']['column']['header'] = {"title": widget.graphLayers[currentGraphLayer].graphColumnTitle};
                    };
                };

            };


            // Detail field
            if (widget.graphLayers[currentGraphLayer].graphDetailField != '') {

                specificationInner['encoding']['detail'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphDetailField,
                    "type": widget.graphLayers[currentGraphLayer].graphDetailType
                };

            };


            // X2 field
            if (widget.graphLayers[currentGraphLayer].graphX2Field != '') {

                specificationInner['encoding']['x2'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphX2Field,
                    "type": widget.graphLayers[currentGraphLayer].graphX2Type
                };

            };


            // Y2 field
            if (widget.graphLayers[currentGraphLayer].graphY2Field != '') {

                specificationInner['encoding']['y2'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphY2Field,
                    "type": widget.graphLayers[currentGraphLayer].graphY2Type
                };

            };


            // Projection
            if (widget.graphLayers[currentGraphLayer].graphProjectionType != ''  &&  widget.graphLayers[currentGraphLayer].graphProjectionType != null) {
                let projection: string = 'albersUsa';
                if (widget.graphLayers[currentGraphLayer].graphProjectionType != ''  &&  widget.graphLayers[currentGraphLayer].graphProjectionType != null) {
                    projection = widget.graphLayers[currentGraphLayer].graphProjectionType;
                };
                specificationInner['projection'] = {
                    "type":  widget.graphLayers[currentGraphLayer].graphProjectionType
                };
                specificationInner['encoding']['latitude'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphProjectionFieldLatitude,
                    "type": "quantitative"
                };
                specificationInner['encoding']['longitude'] = {
                    "field": widget.graphLayers[currentGraphLayer].graphProjectionFieldLongitude,
                    "type": "quantitative"
                };
            };


            // Add to Inner Array
            specificationInnerArray.push(specificationInner);
        };

        // Put spec together from pieces, with or without layers
        if (specificationInnerArray.length === 1  ||  showSpecificGraphLayer) {
            specification = {...specification, ...specificationInnerArray[specificLayerToShow]}
        } else {
            specification = {...specification, [widget.graphLayerFacet.toLowerCase()]: specificationInnerArray}
        };


        // Tooltip setting
        // specification['mark']['tooltip']['content'] = "";

        // Return
        return specification;

    }

    actionUpsert(
        id: number,
        dashboardID: number,
        dashboardTabID: number,
        widgetID: number,
        objectType: string,
        actionType: string,
        action: string,
        description: string,
        undoID: number,
        redoID: number,
        oldWidget: any,
        newWidget: any,
        logToDB: boolean = true
     ): number {
        let actID: number = 1;
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables actionUpsert starts',
                this.concoleLogStyleForStartOfMethod,
                {logToDB}, {oldWidget}, {newWidget});
        };

        // Make snapshot when start changing
        if (this.firstAction) {
            let dashboardIndex: number = this.dashboards.findIndex(
                d => d.id ==
                this.currentDashboardInfo.value.currentDashboardID
            );
            if (dashboardIndex >= 0) {
                let today = new Date();
                let snapshotName: string = this.dashboards
                    [dashboardIndex].name + ' ' + this.formatDate(today);
                let snapshotComment: string = 'Added automated Snapshot before first Action';

                // Determine if last snapshot for this D was an auto first
                this.getResource('dashboardSnapshots','?filterObject={"dashboardID": '
                    + this.currentDashboardInfo.value.currentDashboardID.toString()
                    + '} &sortObject=-createdOn &nrRowsToReturn=1'
                    + '&fields=id, comment '

                ).then(lss => {
console.log('xx Ivan lss', lss)
                    // Add if last snap was not an auto (null returned if no last snapshot)
                    if (lss != null) {

                        if (lss.length === 0  ||  lss[0].comment != snapshotComment) {
                            this.newDashboardSnapshot(snapshotName, snapshotComment,'BeforeFirstEdit')
                                .then(res => {

                                    this.showStatusBarMessage(
                                        {
                                            message: 'Added automated Snapshot before first Action',
                                            uiArea: 'StatusBar',
                                            classfication: 'Info',
                                            timeout: 3000,
                                            defaultMessage: ''
                                        }
                                    );

                                });
                        };
                    };
                });

                this.firstAction = false;
            };
        };

        if (id == null) {
            // Add / Update an action to the ActionLog.  It returns id of new/updated record
            // It returns -1 if it failed.
            // NB: id = null => Add, else Update
            // The update replaces any give non-null values

            // TODO - decide if lates / -1 is best choice here
            let act: number[] = [];
            for (var i = 0; i < this.actions.length; i++) {
                act.push(this.actions[i].id)
            };
            if (act.length > 0) {
                actID = Math.max(...act) + 1;
            };

            let today = new Date();
            this.actions.push({
                id: actID,
                dashboardID: dashboardID,
                dashboardTabID: dashboardTabID,
                widgetID: oldWidget == null? null : oldWidget.id,
                objectType: objectType,
                actionType: actionType,
                action: action,
                description: description,
                undoID: undoID,
                redoID: redoID,
                oldWidget: oldWidget == null? null : JSON.parse(JSON.stringify(oldWidget)),
                newWidget: newWidget == null? null : JSON.parse(JSON.stringify(newWidget)),
                createor: this.currentUser.userID,
                created: today
            });
            if (this.sessionDebugging) {
                console.log('%c    Global-Variables actionUpsert done for:',
                    this.concoleLogStyleForEndOfMethod,
                    this.actions);
            };

        } else {
            this.actions.forEach(ac => {
                if (ac.id === id) {
                    if (action != null) {ac.action = action};
                    if (description != null) {ac.description = description};
                    if (undoID != null) {ac.undoID = undoID};
                    if (redoID != null) {ac.redoID = redoID};
                    if (oldWidget != null) {
                        // ac.oldWidget =  Object.assign({}, oldWidget)
                        ac.oldWidget =  JSON.parse(JSON.stringify(oldWidget))
                    };
                    if (newWidget != null) {
                        // ac.newWidget = Object.assign({}, newWidget)
                        ac.newWidget = JSON.parse(JSON.stringify(newWidget))
                    };
                    actID = id;
                };
            });

        };

        // Log to DB
        if (logToDB) {

            // Get Old and New
            let actOldWidget: Object = null;
            let actNewWidget: Object = null;
            let ac: CanvasAction = this.actions.filter(ac => ac.id === actID)[0];
            if (ac != null  &&  ac != undefined) {
                actOldWidget = ac.oldWidget;
                actNewWidget = ac.newWidget;
            };

            // Brief description of diff
            var result: any[] = [];
            if (actOldWidget == null) {
                result.push('Whole new Widget added')
            };
            if (actNewWidget == null) {
                result.push('Widget deleted')
            };
            if (actOldWidget != null  &&  actNewWidget != null) {

                for(var key in actNewWidget) {
                    if (key != 'data'  &&  key != 'dataFiltered') {

                        if(actOldWidget[key] != actNewWidget[key]) {

                            // Add to DB
                            let today = new Date();
                            let newAuditTrail: CanvasAuditTrail ={
                                id: null,
                                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                                dashboardTabID: this.currentDashboardInfo.value.currentDashboardTabID,
                                widgetID: widgetID,
                                objectType: objectType,
                                actionType: actionType,
                                action: action,
                                description: description,
                                keyChanged: key,
                                oldValue: actOldWidget[key],
                                newValue: actNewWidget[key],
                                userID: this.currentUser.userID,
                                changedOn: today
                            }
                            this.addResource('canvasAuditTrails', newAuditTrail);

                            // Show to Dev
                            result.push(key + ' changed from ' + actOldWidget[key]
                                + ' to ' + actNewWidget[key]);
                        };
                    };
                };
            };

        };

        // Return
        return actID;

    }

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF snapping is enabled
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables alignToGripPoint starts',
                this.concoleLogStyleForStartOfUtilFunctions,
                {inputValue});
        };

        if (this.currentUser.snapToGrid) {
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
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables showStatusBarMessage starts',
                this.concoleLogStyleForStartOfMethod,
                {statusBarMessage});
        };

        // Add to DB (if a Dashboard on display)
        if(this.currentDashboardInfo.value != null) {
            let newStatusBarMessageLog: StatusBarMessageLog = {
                id: null,
                logDateTime: new Date(),
                userID: this.currentUser.userID,
                dashboardID: this.currentDashboardInfo.value.currentDashboardID,
                dashboardName: null,
                message:statusBarMessage.message,
                uiArea: statusBarMessage.uiArea,
                classfication: statusBarMessage.classfication,
                timeout: statusBarMessage.timeout,
                defaultMessage: statusBarMessage.defaultMessage
            };

            this.addResource('statusBarMessageLogs', newStatusBarMessageLog);
        };

        // No messages during dont disturb
        if (!this.dontDisturb.value) {

            // Pop message in right area
            if (statusBarMessage.uiArea === 'StatusBar') {
                this.statusBarMessage.next(statusBarMessage);
            };
        };
    }

    dashboardPermissionCheck(
        dashboardID: number,
        accessRequired: string = 'CanViewOrCanEdit'
        ): boolean {
        // Checks if the current user has access to the given D.
        // - accessRequired = type of access requested.  Can be basic (CanView, CanEdit,
        //   etc), or composite : string = CanViewOrCanEdit, CanViewAndCanEdit,
        //   CanEditOrCanDelete, CanEditAndCanDelete.  These are Hard-Coded
        //   It is NOT case sensitive, and only applicable to accessType = 'AccessList'

        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dashboardPermissionCheck starts',
                this.concoleLogStyleForStartOfUtilFunctions,
                {dashboardID}, {accessRequired});
        };

        // Assume no access
        let hasAccess: boolean = false;
        accessRequired = accessRequired.toLowerCase();

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id === dashboardID) {
                dashboard = JSON.parse(JSON.stringify(d));
            };
        });

        // Make sure we have a D
        if (dashboard === undefined) {
            return;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() === 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() === 'private'
            &&
            dashboard.creator.toLowerCase() === userID.toLowerCase()) {
                hasAccess = true;
        };
        if (dashboard.accessType.toLowerCase() === 'accesslist') {

            this.dashboardPermissions.forEach(dp => {

                if (dp.dashboardID === dashboard.id) {

                    if (dp.userID != null) {

                        if (dp.userID.toLowerCase() === userID.toLowerCase()) {
                            if (accessRequired === 'canviewright'  &&  dp.canViewRight) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'caneditright'  &&  dp.canEditRight) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'candsaveright'  &&  dp.canSaveRight) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'candeleteright'  &&  dp.canDeleteRight) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'canadddatasource'  &&  dp.canAddDatasource) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'cangrantaccess'  &&  dp.canGrantAccess) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'canvieworcanedit'  &&  (dp.canViewRight  ||  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'canviewandcanedit'  &&  (dp.canViewRight  &&  dp.canEditRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'caneditorcandelete'  &&  (dp.canEditRight  ||  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'caneditandcandelete'  &&  (dp.canEditRight  &&  dp.canDeleteRight) ) {
                                hasAccess = true;
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (accessRequired === 'canviewright'  &&  dp.canViewRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'caneditright'  &&  dp.canEditRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'candsaveright'  &&  dp.canSaveRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'candeleteright'  &&  dp.canDeleteRight) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'canadddatasource'  &&  dp.canAddDatasource) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'cangrantaccess'  &&  dp.canGrantAccess) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'canvieworcanedit'  &&  (dp.canViewRight  ||  dp.canEditRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'canviewandcanedit'  &&  (dp.canViewRight  &&  dp.canEditRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'caneditorcandelete'  &&  (dp.canEditRight  ||  dp.canDeleteRight) ) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'caneditandcandelete'  &&  (dp.canEditRight  &&  dp.canDeleteRight) ) {
                                    hasAccess = true;
                                };
                            };
                    };
                };
            });
        };

        // Return
        if (this.sessionDebugging) {
            if (!hasAccess) {
                console.log('  Access FAILED for: ', {dashboardID}, {accessRequired}, dashboard.accessType, {hasAccess});
            };
        };

        return hasAccess;
    }

    datasourcePermissionsCheck(datasourceID: number, accessRequired: string = 'CanView'): boolean {
        // Description: Determines if the current user has the given access to a DS
        // Access is given directly to a user, and indirectly to a group (to which the user
        // belongs).
        // Returns: T/F
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables datasourcePermissionsCheck starts',
                this.concoleLogStyleForStartOfMethod);
        };
        // Assume no access
        let hasAccess: boolean = false;
        accessRequired = accessRequired.toLowerCase();

        // Format user
        let userID = this.currentUser.userID;

        let datasource: Datasource;
        this.datasources.forEach(ds => {
            if (ds.id === datasourceID) {
                datasource = JSON.parse(JSON.stringify(ds));
            };
        });

        // Make sure we have a D
        if (datasource === undefined) {
            return;
        };

        if (datasource.accessType.toLowerCase() === 'public') {
            hasAccess = true;
        };

        // The owner has access to Private ones
        if (datasource.accessType.toLowerCase() === 'private'
            &&
            datasource.createdBy.toLowerCase() === userID.toLowerCase()) {
                hasAccess = true;
        };
        if (datasource.accessType.toLowerCase() === 'accesslist') {

            this.datasourcePermissions.forEach(dp => {

                if (dp.datasourceID === datasource.id) {

                    if (dp.userID != null) {

                        if (dp.userID.toLowerCase() === userID.toLowerCase()) {
                            if (accessRequired === 'canview'  &&  dp.canView) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'canedit'  &&  dp.canEdit) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'candelete'  &&  dp.canDelete) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'canrefresh'  &&  dp.canRefresh) {
                                hasAccess = true;
                            };
                            if (accessRequired === 'cangrant'  &&  dp.canGrant) {
                                hasAccess = true;
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (accessRequired === 'canview'  &&  dp.canView) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'canedit'  &&  dp.canEdit) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'candelete'  &&  dp.canDelete) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'canrefresh'  &&  dp.canRefresh) {
                                    hasAccess = true;
                                };
                                if (accessRequired === 'cangrant'  &&  dp.canGrant) {
                                    hasAccess = true;
                                };
                            };
                    };
                };
            });
        };

        // Return
        if (this.sessionDebugging) {
            if (!hasAccess) {
                console.log('  Access type, result: ', {datasourceID}, {accessRequired}, datasource.accessType, {hasAccess})
            };
        };

        return hasAccess;
    }

    dashboardPermissionList(id: number): string[] {
        // Returns Array of Permissions for the current user to the given D.
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables dashboardPermissionList starts',
                this.concoleLogStyleForStartOfMethod,
                {id});
        };

        // Assume no access
        let accessList: string[] = [];

        // Format user
        let userID = this.currentUser.userID;

        let dashboard: Dashboard;
        this.dashboards.forEach(d => {
            if (d.id === id) {
                dashboard = JSON.parse(JSON.stringify(d));
            };
        });

        // Make sure we have a D
        if (dashboard === undefined) {
            return accessList;
        };

        // Everyone has access to Public Ds
        if (dashboard.accessType.toLowerCase() === 'public') {
            accessList = ['canviewright' ,'caneditright' ,
            'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        // The owner has access to Private ones
        if (dashboard.accessType.toLowerCase() === 'private'
            &&
            dashboard.creator.toLowerCase() === userID.toLowerCase()) {
                accessList = ['canviewright' ,'caneditright' ,
                'cansaveright', 'candeleteright', 'canadddatasource', 'cangrantaccess'];
        };

        if (dashboard.accessType.toLowerCase() === 'accesslist') {
            this.dashboardPermissions.forEach(dp => {
                if (dp.dashboardID === dashboard.id) {
                    if (dp.userID != null) {
                        if (dp.userID.toLowerCase() === userID.toLowerCase()) {
                            if (dp.canViewRight) {
                                accessList.push('canviewright');
                            };
                            if (dp.canEditRight) {
                                accessList.push('caneditright');
                            };
                            if (dp.canSaveRight) {
                                accessList.push('candsaveright');
                            };
                            if (dp.canDeleteRight) {
                                accessList.push('candeleteright');
                            };
                            if (dp.canAddDatasource) {
                                accessList.push('canadddatasource');
                            };
                            if (dp.canGrantAccess) {
                                accessList.push('cangrantaccess');
                            };
                        };
                    };
                    if (dp.groupName != null) {
                        if (this.currentUser.groups.
                            map(x => x.toLowerCase()).indexOf(dp.groupName.toLowerCase()) >= 0) {
                                if (dp.canViewRight) {
                                    accessList.push('canViewright');
                                };
                                if (dp.canEditRight) {
                                    accessList.push('canEditright');
                                };
                                if (dp.canSaveRight) {
                                    accessList.push('candsaveright');
                                };
                                if (dp.canDeleteRight) {
                                    accessList.push('canDeleteright');
                                };
                                if (dp.canAddDatasource) {
                                    accessList.push('canadddatasource');
                                };
                                if (dp.canGrantAccess) {
                                    accessList.push('cangrantaccess');
                                };
                        };
                    };
                };
            });
        };

        // Return
        return accessList;
    }

    formatDate(date: Date, returnFormat: string = 'dateTime') {
        // Formats a given date into requested format
        // - date: date to format
        // - returnFormat: format to return
        //   = date (YYYY/MM/DD) - Default
        //   = time (HH:MM:SS)
        //   = dateTime (YYYY/MM/DD HH:MM:SS)
        // if (this.sessionDebugging) {
            // console.log('      Global-Variables formatDate starts',
            //     this.concoleLogStyleForStartOfUtilFunctions, {date});
        // };

        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (returnFormat === 'date') {
            return [year, month, day].join('/');
        };
        if (returnFormat === 'time') {
            return hour + ':' + minute + ':' + second;
        };

        // Default
        return [year, month, day].join('/') + ' ' + hour + ':' + minute + ':' + second;
    }



    // Canvas-Server, stuffies
    // ***********************************************************************

    verifyCanvasUser(
        givenCanvasServerName: string,
        givenCanvasServerURI: string,
        givenCompanyName: string,
        givenUserID: string,
        givenToken: string): Promise<boolean> {
        // Checks if userID exists.  If not, return false.
        // If so, set currentUser object and return true
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables verifyCanvasUser starts',
                this.concoleLogStyleForStartOfMethod,
                {givenCanvasServerName}, {givenCanvasServerURI}, {givenCompanyName}, {givenUserID});
        };

        // TODO - do in more safe way with DB, Auth0, etc
        return new Promise<boolean>((resolve, reject) => {

            // Nothing to do
            if (givenUserID == null  ||  givenUserID === '') {
                resolve(false);
            };

            const headers = new HttpHeaders()
                .set("Authorization", "Bearer " + givenToken);

            this.http.post<Token>(
                givenCanvasServerURI + '/auth/local/verify',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID 
                }, 
                {headers}
                ).subscribe(res => {
console.log('xx res', res)
                // Store locally
                // localStorage.setItem("canvs-token", JSON.stringify(token));

                if (res) {

                    // TODO - must this be done here ??  Needed to setBaseUrl
                    this.canvasServerURI = givenCanvasServerURI;

                    // The token is need in getDataCachingTable, so set it beforehand
                    this.currentToken = givenToken;

                    // Refresh, but first get the cache
                    this.getDataCachingTable()
                        .then( () => {

                            this.getResource('canvasUsers').then(usr  => {

                                let foundIndex: number = usr.findIndex(u => u.userID === givenUserID);
                                if (foundIndex < 0) {

                                    if (this.sessionDebugging) {
                                        console.warn('Global-Variables verifyCanvasUser: Invalid userid', givenUserID);
                                    };
                                    resolve(false);
                                } else {

                                    if (this.sessionDebugging) {
                                        console.warn('Global-Variables verifyCanvasUser: Valid userid', givenUserID);
                                    };

                                    // Set User var
                                    this.currentUser = usr[foundIndex];

                                    // Set GVs
                                    this.sessionDebugging = this.currentUser.preferenceDebugSession;

                                    // Store User ID info
                                    this.canvasServerName = givenCanvasServerName;
                                    this.canvasServerURI = givenCanvasServerURI;
                                    this.currentCompany = givenCompanyName;
                                    this.currentUserID = givenUserID;

                                    // Register session start time
                                    let today = new Date();
                                    this.sessionDateTimeLoggedin =
                                        this.formatDate(today);

                                    // Indicate logged in; so StatusBar shows Server Name
                                    this.loggedIntoServer.next(true);

                                    // Optional start D
                                    if (this.currentUser.preferenceStartupDashboardID != null) {
                                        let startTabID: number = -1;
                                        if (this.currentUser.preferenceStartupDashboardTabID != null) {
                                            startTabID = this.currentUser.preferenceStartupDashboardTabID;
                                        };

                                        this.refreshCurrentDashboard(
                                            'statusbar-verifyCanvasUser',
                                            this.currentUser.preferenceStartupDashboardID,
                                            startTabID,
                                            ''
                                        );
                                    };

                                    // Create Var with data
                                    let localCanvasUser =
                                        {
                                            canvasServerName: givenCanvasServerName,
                                            canvasServerURI: givenCanvasServerURI,
                                            currentCompany: givenCompanyName,
                                            currentUserID: givenUserID,
                                            currentToken: givenToken
                                        };
                                    console.warn('Global-Variables verifyCanvasUser localCanvasUser', localCanvasUser)

                                    // Add / Update DB with Put
                                    let currentCanvasUserCount: number = 0;

                                    // Local App info DB
                                    this.dbCanvasAppDatabase.table("currentCanvasUser")
                                        .put(localCanvasUser)
                                        .then(res => {
                                            console.warn('Global-Variables verifyCanvasUser Add/Updated currentCanvasUser to: ', res);

                                            // Count
                                            this.dbCanvasAppDatabase.table("currentCanvasUser").count(res => {
                                                console.warn('Global-Variables verifyCanvasUser currentCanvasUsers Count = ', res);
                                                currentCanvasUserCount = res;

                                                // Return
                                                if (currentCanvasUserCount > 0) {
                                                    return true;
                                                } else {
                                                    return false;
                                                };
                                            });
                                        }
                                    );

                                    // Load System Settings
                                    this.getSystemSettings()
                                        .then( () => {

                                            this.refreshLocalCache();

                                            this.loadVariableOnStartup.next(true);
                                            resolve(true);
                                        })
                                        .catch(err => {
                                            console.error('Error in Global-Variables verifyCanvasUser: ', err);
                                            reject(err.message);
                                        })

                                };
                            })
                            .catch(err => {
                                console.error('Error in Global-Variables verifyCanvasUser: ', err);
                                reject(err.message);
                            })

                        })
                        .catch(err => {
                            console.error('Error in Global-Variables verifyCanvasUser: ', err);
                            reject(err.message);
                        })

                } else {
                    console.warn('Global-Variables verifyCanvasUser: Registration failed on : ',
                        givenCanvasServerURI, givenUserID, res);
                    resolve(false);
                };
            },
            err => {
                console.log('Error Registration FAILED on : ',
                givenCanvasServerURI, {err});
                console.warn('Error in Global-Variables verifyCanvasUser - HTTP Error'), err;
                resolve(false);
            });

        });
    }

    registerCanvasUser(
        givenCanvasServerName: string,
        givenCompanyName: string,
        givenUserID: string,
        givenPassword: string): Promise<string> {
        // Registers a user on a given Server & Company (add to Users) if he/she does not
        // already exist
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables registerCanvasUser starts',
                this.concoleLogStyleForStartOfMethod,
                {givenCanvasServerName}, {givenCompanyName},
                {givenUserID}, {givenPassword});
        };

        return new Promise<string>((resolve, reject) => {

            // Get the ServerURL
            let serverURLIndex: number = this.ENVCanvasServerList.findIndex(
                srv => srv.serverName === givenCanvasServerName
            );
            if (serverURLIndex < 0) {
                resolve('Error: Server Name not in ENV configuration');
            };
            let givenCanvasServerURI: string = this.ENVCanvasServerList[serverURLIndex]
                .serverHostURI;

            this.http.post<CanvasHttpResponse>(givenCanvasServerURI + '/auth/local/signup',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID,
                    "password": givenPassword
                }
                ).subscribe(httpResponse => {

                    if (httpResponse.statusCode === 'failed') {
                        console.warn('Error in Global-Variables registerCanvasUser Failed: ' + httpResponse.message, httpResponse);
                        resolve('Failed: ' + httpResponse.message);
                    };
                    if (httpResponse.statusCode === 'success') {
                        console.warn('Success: ' + httpResponse.message);
                        resolve('Success: ' + httpResponse.message);
                    };
                    if (httpResponse.statusCode === 'error') {
                        console.warn('Error: ' + httpResponse.message);
                        resolve('Error: ' + httpResponse.message);
                    };
            },
            err => {
                console.error('Error in Global-Variables registerCanvasUser', err);
                resolve('Error: Registration FAILED ' + err.message);
            });
        });
    }

    loginCanvasServer(
        givenCanvasServerName: string,
        givenCompanyName: string,
        givenUserID: string,
        givenPassword: string): Promise<{ message: string, token: string}> {
        // Logs a user on a given Server & Company
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables loginCanvasServer starts',
                this.concoleLogStyleForStartOfMethod,
                {givenCanvasServerName}, {givenCompanyName},
                {givenUserID}, {givenPassword});
        };

        return new Promise<{ message: string, token: string}>((resolve, reject) => {

            // Get the ServerURL
            let serverURLIndex: number = this.ENVCanvasServerList.findIndex(
                srv => srv.serverName === givenCanvasServerName
            );
            if (serverURLIndex < 0) {
                resolve({ message:'Error: Server Name not in ENV configuration', token: null});
            };
            let givenCanvasServerURI: string = this.ENVCanvasServerList[serverURLIndex]
                .serverHostURI;
            this.http.post<CanvasHttpResponse>(givenCanvasServerURI + '/auth/local/login',
                {
                    "companyName": givenCompanyName,
                    "userID": givenUserID,
                    "password": givenPassword
                }
                ).subscribe(httpResponse => {

                    if (httpResponse.statusCode === 'failed') {
                        console.warn('Error in Global-Variables loginCanvasUser Failed: ' + httpResponse.message);

                        resolve({ message:'Failed: ' + httpResponse.message, token: null});
                    };
                    if (httpResponse.statusCode === 'success') {
                        console.warn('    Global-Variables loginCanvasUser Success: ' + httpResponse.message);

                        resolve({ message:'Success: ' + httpResponse.message, token: httpResponse.token});
                    };
                    if (httpResponse.statusCode === 'error') {
                        console.warn('Error in Global-Variables loginCanvasUser Error: ' + httpResponse.message);

                        resolve({ message:'Error: ' + httpResponse.message, token: null});
                    };
            },
            err => {
                console.error('Error in Global-Variables loginCanvasUser Error: ', err);
                resolve({ message:'Error: Login FAILED ' + err.message, token: null});
            });
        });
    }

    getListTables(
        serverType: string,
        serverName: string,
        databaseName: string,
        port: string,
        username: string,
        password: string): Promise<CanvasHttpResponse> {
        // Description: Returns an Array of tables in the given Server and DB
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getListTables starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'listTables?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global-Variables getListTables Failed: ' + httpResponse.message, httpResponse);
                        reject('Error in Global Variables getListTables: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getListTables: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getListTables: Data in response object is null; it should be an array');
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getListTables ends',
                            this.concoleLogStyleForEndOfMethod,
                            httpResponse.data);
                    };
                    resolve(httpResponse);
                },
                err => {
                    console.error('Error in Global-Variables getListTables', err);
                    reject(err.message  || err.sqlMessage);
                }
            )
        });

    }

    getListFields(
        serverType: string,
        serverName: string,
        databaseName: string,
        tableName: string,
        port: string,
        username: string,
        password: string): Promise<CanvasHttpResponse> {
        // Description: Returns an Array of Fields in the given Server and DB
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getListFields starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'listFields?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&tableName=" + tableName +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables getListFields: ' + httpResponse.message);
                        reject('Error in Global Variables getListFields: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getListFields: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getListFields: Data in response object is null; it should be an array');
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getListTables ends',
                            this.concoleLogStyleForEndOfMethod,
                            httpResponse.data.length);
                    };
                    resolve(httpResponse);
                },
                err => {
                    console.error('Error in Global-Variables getListFields', err.message);
                    reject(err.message  ||  err.sqlMessage);
                }
            )
        });

    }

    getExecQuery(
        serverType: string,
        serverName: string,
        databaseName: string,
        sqlStatement: string,
        port: string,
        username: string,
        password: string,
        datasourceID: number = null,
        nrRowsToReturn: number = 0): Promise<CanvasHttpResponse> {
        // Description: Executes a SQL Statement and returns an Array of data
        // Input:
        // - serverType = type of DB, ie MySQL, MicrosoftSQL, etc
        // - serverName, databaseName, port, username, password = DB connection string & credentials
        // - sqlStatement = SQL Statement
        // - datasourceID = Optional DS-id if clientData must be saved (cached)
        // - nrRowsToReturn = Optional number of rows to return, 0 = all

        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getExecQuery starts',
                this.concoleLogStyleForStartOfMethod);
        };

        return new Promise<CanvasHttpResponse>((resolve, reject) => {

            // Get data
            let pathUrl: string = 'execQuery?' +
                "serverType=" + serverType +
                "&serverName=" + serverName +
                "&databaseName=" + databaseName +
                "&sqlStatement=" + sqlStatement +
                "&port=" + port +
                "&username=" + username +
                "&password=" + password +
                "&datasourceID=" + datasourceID +
                "&nrRowsToReturn=" + nrRowsToReturn;
            let finalUrl: string = this.canvasServerURI + '/clientData/' + pathUrl;

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables getExecQuery: ' + httpResponse.message);
                        reject('Error in Global Variables getExecQuery: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getExecQuery: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getExecQuery: Data in response object is null; it should be an array');
                        return;
                    };

                    this.statusBarRunning.next(this.canvasSettings.noQueryRunningMessage);
                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables getExecQuery ends',
                            this.concoleLogStyleForEndOfMethod,
                            httpResponse.data.length);
                    };
                    resolve(httpResponse);
                },
                err => {
                    console.error('Error in Global-Variables getExecQuery', err.message);
                    reject(err.message  || err.sqlMessage);
                }
            )
        });

    }

    getDashboardSummary(dashboardID: number): Promise<any> {
        // Gets a summary of related Entities for the given Dashboard
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getDashboardSummary starts',
                this.concoleLogStyleForStartOfMethod,
                {dashboardID});
        };
        return new Promise<any>((resolve, reject) => {

            let pathUrl: string = '/canvasDashboardSummary?id=' + dashboardID.toString();
            let finalUrl: string = this.canvasServerURI + pathUrl;

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            this.http.get<CanvasHttpResponse>(finalUrl, {headers}).subscribe(
                httpResponse  => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables getDashboardSummary: ' + httpResponse.message);
                        reject('Error in Global Variables getDashboardSummary: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables getDashboardSummary: Data in response object is null; it should be an array');
                        reject('Error in Global Variables getDashboardSummary: Data in response object is null; it should be an array');
                        return;
                    };

                    if (this.sessionDebugging) {
                        console.log('%c    Global-Variables canvasDashboardSummary ends',
                            this.concoleLogStyleForEndOfMethod,
                            "Data retrieved")
                    };

                    resolve(httpResponse);
                },
                err => {
                    console.error('Error in Global-Variables canvasDashboardSummary', err.message)
                    reject(err.message)
                }
            );
        });
    };

    tributaryCreateSession(sampleSize: number = null) {
        // Create a new Tributary Session
        // - sampleSize = optional nr of rows to return
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables tributaryCreateSession starts',
                this.concoleLogStyleForStartOfMethod,
                {sampleSize});
        };

        let pathUrl: string = this.canvasServerURI +
            'canvas/datasources/sessions/create-session/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + localToken.token);
            const sampleString: any = { "sample_size": sampleSize };
            this.http.post(pathUrl, sampleString, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryCreateSession Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global-Variables tributaryCreateSession', err);
                    reject(err.message);
                }
            )
        });

    }

    tributaryInspect(inspectURL: string, source: any) {
        // Inspect a DS using the given URL
        // - inspectURL - url obtained from tributaryCreateSession()
        // - source = specification for Tributary
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables tributaryInspect starts',
                this.concoleLogStyleForStartOfMethod,
                {inspectURL});
        };

        let pathUrl: string = inspectURL;

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + localToken.token);
            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryInspect Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global-Variables tributaryInspect', err);
                    reject(err.message);
                }
            )
        });

    }

    tributaryExecute(executeURL: string, source: any) {
        // Executes a DS using the given URL
        // - executeURL - url obtained from tributaryCreateSession()
        // - source = specification for Tributary
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables tributaryExecute starts',
                this.concoleLogStyleForStartOfMethod,
                {executeURL});
        };

        let pathUrl: string = executeURL;

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + localToken.token);
            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                        console.log('tributaryExecute Data', {res})
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global-Variables tributaryExecute', err);
                    reject(err.message);
                }
            )
        });

    }

    getTributaryData(source: any): Promise<any> {
        // Description: Gets data from the Tributary Server
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getTributaryData starts',
                this.concoleLogStyleForStartOfMethod, {source});
        };

        let pathUrl: string = this.canvasServerURI + 'canvas/enqueue/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + localToken.token);

            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global-Variables getTributaryData', err);
                    reject(err.message);
                }
            )
        });
    }

    getTributaryInspect(source: any): Promise<any> {
        // Description: Gets data from the Tributary Server
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables getTributaryData starts',
                this.concoleLogStyleForStartOfMethod, {source});
        };

        let pathUrl: string = this.canvasServerURI + 'canvas/inspect/';

        return new Promise<any>((resolve, reject) => {

            let localToken: Token = JSON.parse(localStorage.getItem('eazl-token'));
            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + localToken.token);

            this.http.post(pathUrl, source, {headers})
            .subscribe(
                res => {

                    if (this.sessionDebugging) {
                    };

                    resolve(res);
                },
                err => {
                    console.error('Error in Global Variables getTributaryInspect', err.message);
                    reject(err.message);
                }
            )
        });
    }

    constructTributarySQLSource(
        connector: string,
        drivername: string,
        username: string,
        password: string,
        database: string,
        host: string,
        port: number,
        query: string): TributarySource {
        // Description: constructs a Tributary Source object from the given parameters
        if (this.sessionDebugging) {
            console.log('%c  Global-Variables constructTributarySQLSource starts',
                this.concoleLogStyleForStartOfMethod,
                {connector}, {drivername}, {username}, {password}, {database}, {host}, {port},
                {query});
        };

        let tributarySource: TributarySource = {
            "source": {
                "connector": connector,
                "drivername": drivername,
                "username": username,
                "password": password,
                "database": database,
                "host": host,
                "port": port,
                "query": query
            }
        };

        // Return
        return tributarySource;
    };

    dateAdd(date: Date, interval: string, units: number) {
        // Adds an element to a data, similar to ADDDATE SQL-style
        //  - date  Date to start with
        //  - interval  One of: year, quarter, month, week, day, hour, minute, second
        //  - units  Number of units of the given interval to add.
        //  Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now
        // Returns: Amended Date
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables dateAdd starts',
                this.concoleLogStyleForStartOfUtilFunctions,
                {date}, {interval}, {units});
        };

        // Get the original
        var ret: Date = new Date(date); //don't change original date

        var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
        switch(interval.toLowerCase()) {
            case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
            case 'year2'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;

            case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
            case 'quarters':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;

            case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
            case 'months'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;

            case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
            case 'weeks'   :  ret.setDate(ret.getDate() + 7*units);  break;

            case 'day'    :  ret.setDate(ret.getDate() + units);  break;
            case 'days'    :  ret.setDate(ret.getDate() + units);  break;

            case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
            case 'hours'   :  ret.setTime(ret.getTime() + units*3600000);  break;

            case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
            case 'minutes' :  ret.setTime(ret.getTime() + units*60000);  break;

            case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
            case 'seconds' :  ret.setTime(ret.getTime() + units*1000);  break;

            default       :  ret = undefined;  break;
        };

        return ret;
    }

    dateDiff(fromDate: Date, toDate: Date, interval: string): number {
        // Returns the difference between two dates in the given interval, similar to DATEDIFF SQL-style
        //  - fromDate  From Date
        //  - toDate  To Date
        //  - interval  One of: year, quarter, month, week, day, hour, minute, second
        //  Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now
        // Returns: Amended Date
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables getTributaryDirectDBSchema starts',
                this.concoleLogStyleForStartOfUtilFunctions,
                {fromDate}, {toDate}, {interval});
        };

        // Cater for missing input
        if (fromDate == null) {
            fromDate = new Date();
        };
        if (toDate == null) {
            toDate = new Date();
        };
        let diffDays: number = toDate.getDate() - fromDate.getDate(); // milliseconds between two dates
        let diffTime: number = toDate.getTime() - fromDate.getTime(); // milliseconds between two dates
        let diff: number = +toDate - +fromDate; // milliseconds between two dates
        let ret: number = -1;
        switch(interval.toLowerCase()) {
            case 'year'        : ret = diffDays / 365;  break;
            case 'quarter'     : ret = diffDays / 120;  break;
            case 'month'       : ret = diffDays / 30;  break;
            case 'week'        : ret = diffDays / 7 ;  break;
            case 'day'         : ret = diffTime / 86400000;  break;
            case 'hour'        : ret = diffTime / 3600000;  break;
            case 'minute'      : ret = diffTime / 60000;  break;
            case 'second'      : ret = diffTime / 1000;  break;
            case 'millisecond' : ret = diffTime;  break;
            default       	   : ret = undefined;
        };

        return ret;
    }

    calcShapeTextDisplay(shapeText: string): string {
        // Description: Transforms the .shapeText property to .shapeTextDisplay using
        // keywords like #pagenr, #pages, #date
        // Returns: Added Data or error message
        if (this.sessionDebugging) {
            // console.log('      Global-Variables calcShapeTextDisplay starts',
            //     this.concoleLogStyleForStartOfUtilFunctions, {shapeText});
        };

        let today = new Date();
        let pages: number = this.currentDashboardTabs.length;
        let selectedTabIndex: number = this.currentDashboardInfo
            .value.currentDashboardTabIndex;
        selectedTabIndex = selectedTabIndex + 1;
        let shapeTextDisplay = shapeText;
        shapeTextDisplay = shapeTextDisplay
            .replace(/#date/g, this.formatDate(today, 'date'));
        shapeTextDisplay = shapeTextDisplay
            .replace(/#pagenr/g, selectedTabIndex.toString());
        shapeTextDisplay = shapeTextDisplay
            .replace(/#pages/g, pages.toString());

        // Return
        return shapeTextDisplay;
    }

    calcGraphHeight(widget: Widget): number {
        // Description: calculate the Height of the graph in a Widget
        // Returns: Graph Height, null if impossible to do so
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables calcGraphHeight starts',
                this.concoleLogStyleForStartOfUtilFunctions);
        };

        // Ignore bad input
        if (widget == null) {
            return null;
        };

        let graphHeight: number;

        // Set Graph Height and Width
        // if (widget.graphXaxisTitle != ''
        //     &&
        //     widget.graphXaxisTitle != null) {
        //         graphHeight = widget.containerHeight - 55;
        // } else {
        //     graphHeight = widget.containerHeight - 15;
        // };
        graphHeight = widget.containerHeight - 15;

        // Return
        return graphHeight;
    }

    calcGraphWidth(widget: Widget): number {
        // Description: calculate the Width of the graph in a Widget
        // Returns: Graph Width, null if impossible to do so
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables calcGraphWidth starts',
                this.concoleLogStyleForStartOfUtilFunctions);
        };

        // Ignore bad input
        if (widget == null) {
            return null;
        };

        let graphWidth: number;

        // Set Graph Width and Width - Assume font size 12 for now
        // if (widget.graphColorField != ''
        //     &&  widget.graphColorField != null) {
        //     graphWidth = widget.containerWidth - 35;
        // } else {
        //     graphWidth = widget.containerWidth - 35;
        // };
        graphWidth = widget.containerWidth - 35;

        // Return
        return graphWidth;
    }

    sortFilterFieldsAggregate(
        inputResults: any = null, parameters: string
        ): any {
        // This routines receives data as an array and parameters, and then returns the
        // data after manipulations, like sorting, filtering, field selection and
        // aggregations.  The parameters are the instructions for the manipulations.
        // Note: the format of the parameters must comply with what the Server requires,
        //       so that the same parameters works for data from HTTP or Cache

        // Examples of how the manipulations are used:
        //   sortObject=-Month
        //   fields=Month Year
        //   filterObject={"Month":"January"}
        //   aggregationObject= TODO: not done as yet ...
        //   nrRowsToReturn=1

        // Calling Examples
        //   let parameters: string  = '?sortObject=-id';
        //   parameters = parameters + '&fields=id, name, creator ';
        //   parameters = parameters + '&filterObject= {"creator": "JannieI"}'
        //   parameters = parameters + '&nrRowsToReturn=3';

        //   let parameters: string = '?sortObject=-id';
        //   parameters = parameters + '&fields=id, name, creator ';
        //   parameters = parameters + '&filterObject= {"id": 116}'
        //   parameters = parameters + '&nrRowsToReturn=3'

        //   let parameters: string = '?sortObject=-id';
        //   parameters = parameters + '&fields=id, name, creator, dateRefreshed ';
        //   parameters = parameters + '&filterObject= {"dateRefreshed" : null}'

        // Return if nothing to do
        if (inputResults == null) {
            return [];
        };
        if (inputResults.length === 0) {
            return [];
        };

        let sortObject: any = null;
        let fieldsObject: string = null;
        let filterObject: any = null;
        let aggregationObject: any = null;
        let nrRowsToReturn: number = 0;

        // 1. Extract Query properties: these are used by the Widget to reduce the data block returned
        let results: any = inputResults;

        let parametersArray: string[] = parameters.split("&")

        parametersArray.forEach(par => {

            // Make sure its not empty, else TS will get the hizzy fit
            if (par.length > 0) {

                // Strip of indicator chars
                if (par[0] === '?') {
                    par = par.substring(1);
                };
                if (par[0] === '&') {
                    par = par.substring(1);
                };

                // Get two parts of parameter
                if (par.indexOf('=') > 0) {
                    let parKey: string = par.substring(0, par.indexOf('='));
                    let parValue: string = par.substring(par.indexOf('=') + 1);
                    parKey = parKey.trim();
                    parValue = parValue.trim();

                    if (parKey === 'sortObject') {
                        sortObject = parValue;
                    };
                    if (parKey === 'fields') {
                        fieldsObject = parValue;
                    };
                    if (parKey === 'filterObject') {
                        filterObject = parValue;
                    };
                    if (parKey === 'aggregationObject') {
                        aggregationObject = parValue;
                    };
                    if (parKey === 'nrRowsToReturn') {
                        nrRowsToReturn = +parValue;
                        if (nrRowsToReturn == null) {
                            nrRowsToReturn = 0;
                        };
                    };
                }
            };
        })

        // 2. If (SORT_OBJECT) then results = results.sort()
        // Sort ASC on given field, -field means DESC
        // NB: this is NOT mongoose notation with {field: 1}, it is ONE
        //     field, ie sortObject=-createdOn

        // TODO - return sortOrder = 1 depending on - in field, see TypeScript
        if (sortObject != null) {

            // When DESC, and take off -
            // For example, sortOrder=-Month
            let sortDirection: number = 1;
            let sortColumn: string = sortObject;
            if (sortObject[0] === "-") {
                sortDirection = -1;
                sortColumn = sortObject.substr(1);
            };

            // Sort given column in given direction
            results = results.sort( (a,b) => {
                if (a[sortColumn] > b[sortColumn]) {
                    return sortDirection;
                };
                if (a[sortColumn] < b[sortColumn]) {
                    return sortDirection * -1;
                };
                return 0;
            });

        };
        console.log('xx post sort', sortObject, results)

        // 3. If (FIELDS_STRING) then results = results[fields]
        if (fieldsObject != null) {

            // Create Array of Fields, un-trimmed
            let fieldsArray = fieldsObject.split(",");
            fieldsArray = fieldsArray.map(x => x.trim());

            // Loop on keys in Object = row 1, delete field from each element in array if not
            // in fieldsArray
            Object.keys(results[0]).forEach(key => {

                if (fieldsArray.indexOf(key) < 0) {
                    for (var i = 0; i < results.length; i++) {
                        delete results[i][key];
                    };
                };
            });
        };
        console.log('xx post fields', results)

        // 4. If (FILTER_OBJECT) then results = results.filter()
        if (filterObject != null) {

            filterObject = JSON.parse(filterObject)

            Object.keys(filterObject).forEach( key => {
                // Get the key-value pair
                let value = filterObject[key];
                results = results.filter(r => {
                    return value === r[key];
                });
            });
        };
console.log('xx post filter', results)
        // TODO
        // 5. If (AGGREGATION_OBJECT) then results = results.clever-thing
        if (aggregationObject != null) {

        };

        // 6. Reduce nr of rows to return: 0 or null means all rows
        if (nrRowsToReturn > 0) {
            results = results.slice(0, nrRowsToReturn)
        };

        // 7. Return
        return results;

    }

    testBingMaps() {
        // Test to get DistanceMatrix from Bing via Async - not sure how to get results !
        console.log('bingMaps Start')

        let pathUrl: string = 'https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrixAsync';
        pathUrl = pathUrl + '?origins=-33.8689103,18.5167131';
        pathUrl = pathUrl + '&destinations=-34.0165939,22.8028049;-34.19553,22.091511;-34.0386276,22.2109966;-33.590777,22.200313;-33.573833,22.437935;-34.014232,22.452362;-34.0386162,23.0488625;-33.9676361,22.4382248;-34.04956,23.354508;-33.980665,25.571136;-34.17686,22.100389;-33.95696,22.4624252;-34.180534,22.1436;-33.9676361,22.4382248;-33.92873,25.482503;-34.045921,23.323514;-34.1754951,22.1035347;-34.0043068,22.4864826;-34.0256271,22.8132019;-34.0450058,23.3695278;-32.349277,22.582667;-34.014437,22.452317;-34.0043068,22.4864826;-34.05893,23.37694;-34.0403137,23.0469074;-33.9560623,22.6195;-33.59527,22.23417;-34.1844063,22.1460972;-33.58964,22.205465;-34.03452,23.04515;-34.0347939,23.0454731;-34.056427,23.3725662;-33.9701538,22.4885139;-34.1270183,22.1173702999999;-34.147772,22.103731;-33.95044,22.432437;-33.997984,22.615692;-33.94693,22.410223;-33.945488,22.4643173;-34.1833534,22.1141949;-33.96437,22.4831429;-33.9524231,22.4433327;-34.1825371,22.14276;-34.07952,22.150616;-34.18756,22.1141472;-33.940074,25.597108;-33.999468,25.535987;-34.0564537,23.3729343;-34.0362434,23.0409622;-34.147772,22.10343';
        pathUrl = pathUrl + '&distanceUnit=km';
        pathUrl = pathUrl + '&travelMode=driving';
        pathUrl = pathUrl + '&startTime=2017-06-15T13:00:00-07:00';
        pathUrl = pathUrl + '&key=An32WT6o1FBmePyg2qOelW0-eby7-hW9H1YmxfAw9yVrEvPloQ9Wte1l0n3h1DED';

        this.http.get<any>(pathUrl).subscribe(
            httpResult  => {
                console.log('httpResult', httpResult)
            },
            err => {
                console.log('err', err)
            }
        );
    }





    sendTransformationQuery(data: object): Promise<object | null> {
        // Description: Send transformation to the server.
        // Returns: Data or error message
        if (this.sessionDebugging) {
            console.log('%c    Global-Variables sendTransformationQuery ...',
                "color: black; background: rgba(104, 25, 25, 0.4); font-size: 10px",{data});
        };

        return new Promise<object | null>((resolve, reject) => {

            const headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + this.currentToken);

            let finalUrl: string = this.canvasServerURI + '/data';

            // Omit _id (immutable in Mongo)
            const copyData = { ...data };

            this.http.put<CanvasHttpResponse>(finalUrl, copyData, {headers})
            .subscribe(
                httpResponse => {
                    if(httpResponse.statusCode != 'success') {
                        console.error('Error in Global Variables sendTransformationQuery: ' + httpResponse.message);
                        reject('Error in Global Variables sendTransformationQuery: ' + httpResponse.message);
                        return;
                    };
                    if(httpResponse.data == null) {
                        console.error('Error in Global Variables sendTransformationQuery: Data in response object is null; it should be an array');
                        reject('Error in Global Variables sendTransformationQuery: Data in response object is null; it should be an array');
                        return;
                    };

                    console.log('return message :', httpResponse);

                    // // Replace local
                    // let localIndex: number = this.dashboards.findIndex(d =>
                    //     d.id === data.id
                    // );
                    // if (localIndex >= 0) {
                    //     this.dashboards[localIndex] = data;
                    // };
                    // localIndex = this.currentDashboards.findIndex(d =>
                    //     d.id === data.id
                    // );
                    // if (localIndex >= 0) {
                    //     this.currentDashboards[localIndex] = data;
                    // };

                    // if (this.sessionDebugging) {
                    //     console.log('saveDashboard SAVED', res.data)
                    // };

                    resolve(httpResponse.data);
                },
                err => {
                    console.log('Error Global Variables sendTransformation', err);
                    reject(null);
                }
            )
        });
    }


}