/*
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { DOCUMENT }                   from '@angular/platform-browser';
import { ElementRef }                 from '@angular/core';
import { HostListener }               from '@angular/core';
import { Inject }                     from "@angular/core";
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';
import { Subscription }               from "rxjs";
import { timer }                      from "rxjs";

// Own Services
import { GlobalVariableService }      from './global-variable.service';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Models
import { CanvasAction }               from './models'
import { Dashboard }                  from './models'
import { DashboardRecent }            from './models'
import { Dataset }                    from './models'
import { Datasource }                 from './models'
import { Field }                      from './models'
import { PaletteButtonBar }           from './models'
import { WebSocketMessage }           from './models'
import { Widget }                     from './models'
import { WidgetCheckpoint }           from './models';

import { WidgetSingleComponent }      from './widget.single.component';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import { StatusbarComponent }         from './statusbar.component';

// WS
import { WebSocketSubject }           from 'rxjs/webSocket';

// Dexie
import Dexie from 'dexie';

class MyAppDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    contacts: Dexie.Table<IContact, number>; // number = type of the primkey
    //...other tables goes here...

    constructor () {
        super("MyAppDatabase");
        this.version(1).stores({
            contacts: '++id, first, last',
            //...other tables goes here...
        });
    }
}

interface IContact {
    id?: number,
    first: string,
    last: string
}

// Constants
export enum KEY_CODE {
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40
}


@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('circle1', {read: ElementRef}) circle1: ElementRef;  //Vega graph
    @ViewChild('widgetDOMX')  widgetDOM: WidgetSingleComponent;
    @ViewChild('widgetDOM')  widgetDOMold: WidgetSingleComponent;
    @ViewChild('statusbarDOM') statusbarDOM: StatusbarComponent;
    @ViewChild('widgetFullDOM') widgetFullDOM: ElementRef;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        event.preventDefault();
        console.log('xx key pressed: ', event.code)
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {

            if (this.showWidgetFullScreenWidth > 0) {
                this.clickCloseFullScreen();
                return;
            };
        };

        // No key actions while a modal form is open
        if (this.modalFormOpen) {
            return;
        };


        // Ignore certain ones
        if (event.key == 'Tab'  ||  event.key == 'Control') {
            return;
        }

        // Known ones
        if (event.code == 'KeyZ'  &&  (event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickMenuEditUndo();
            return;
        };
        if (event.code == 'KeyZ'  &&  (event.ctrlKey)  &&  (event.shiftKey) ) {
            this.clickMenuEditRedo();
            return;
        };
        if (event.code == 'KeyC'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuWidgetCopy();
            return;
        };
        if (event.code == 'KeyV'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuWidgetPaste();
            return;
        };
        if (event.code == 'Delete'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuPaletteDelete();
            return;
        };
        if (event.code == 'Home'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageFirst();
            return;
        };
        if (event.code == 'PageUp'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageUp();
            return;
        };
        if (event.code == 'PageDown'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageDown();
            return;
        };
        if (event.code == 'End'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageLast();
            return;
        };

        // Move with Arrow
        if (event.key == 'ArrowRight'  ||  event.key == 'ArrowDown'  ||
            event.key == 'ArrowLeft'   ||  event.key == 'ArrowUp') {

            // Has to be in editMode
            if (!this.editMode) {
                this.showMessage(
                    this.globalVariableService.canvasSettings.notInEditModeMsg,
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
            };

            // Set start coordinates
            this.startX = 0;
            this.startY = 0;

            // Set end coordinates
            if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
                this.endX = this.globalVariableService.canvasSettings.gridSize;
                this.endY = 0;
            };
            if (event.keyCode === KEY_CODE.LEFT_ARROW) {
                this.endX = -1 * this.globalVariableService.canvasSettings.gridSize;
                this.endY = 0;
            };
            if (event.keyCode === KEY_CODE.UP_ARROW) {
                this.endX = 0;
                this.endY = -1 * this.globalVariableService.canvasSettings.gridSize;
            };
            if (event.keyCode === KEY_CODE.DOWN_ARROW) {
                this.endX = 0;
                this.endY = this.globalVariableService.canvasSettings.gridSize;
            };

            // Set draggables
            this.draggableWidgets  = [];
            this.currentWidgets.forEach(w => {
                if (w.isSelected) {
                    this.draggableWidgets.push(w.id);
                }
            });

            // Move the draggable ones
            if (this.draggableWidgets.length > 0) {
                this.moveWidgets()
            };
        };

    }

    canSave: boolean = true;
    clickedSlicerItem: boolean = false;
    clipboardWidget: Widget;
    companyName: string = '';
    currentDashboardName: string = '';
    currentDatasources: Datasource[];
    currentShapeSpec: any;          // TODO - fill this var !!  not working at moment
    currentTabName: string = '';
    currentDashboardTabIndex: number = 0;
    currentDashboardBackgroundColor: string = 'white';
    currentDashboardBackgroundImage: string = '';
    currentTabBackgroundColor: string = '';
    currentTabColor: string = '';
    currentUserID: string = '';
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgets: Widget[] = [];
    currentWidgetsOriginals: Widget[] = [];
    currentWidgetDashboardTabIDs: number[] = [];  // Of current W
    dontDisturb: boolean = false;
    draggableWidgets: number[] = [];
    dashboardStartX: number;
    dashboardStartY: number;
    dashboardEndX: number;
    dashboardEndY: number;
    editMode: boolean;
    editingDS: boolean;
    hasDashboard: boolean = false;
    hasDatasources: boolean = true;             // TODO - consider removing this totally
    editMenuText: string;
    fields: Field[];
    isBusyResizing: boolean = false;
    isFirstTimeUser: boolean = false;
    combinationType: string;                    // Type passed to Combinations form
    minWidgetContainerHeight: number = 16;      // Smallest that W Container can get
    minWidgetContainerWidth: number = 16;       // Smallest that W Container can get
    minGraphHeight: number = 1;                 // Smallest that Graph can get
    minGraphWidth: number = 1;                  // Smallest that Graph can get
    modalFormOpen: boolean = false;
    moveStartX: number;
    moveStartY: number;
    moveEndX: number;
    moveEndY: number;
    moveOffsetX: number;
    moveOffsetY: number;
    moveLastX: number = 0;
    moveLastY: number = 0;
    newWidget: boolean = false;
    newWidgetContainerLeft: number = 0;
    newWidgetContainerTop: number = 0;
    paletteButtons: PaletteButtonBar[] = [];
    paletteDrag: boolean;
    paletteLeft: number = 10;                   // Palette position in px
    paletteTop: number = 80;                    // Palette position in px
    paletteHeight = 275;                        // Palette dimensions in px
    paletteWidth = 39;                          // Palette dimensions in px
	recentDashboards: DashboardRecent[];
    refreshGraphs: boolean = false;
    selectedDatasource: Datasource;
    selectedDashboard: Dashboard;
    selectDatasetID: number;
    selectDatasourceID: number;
    selectedWidget: Widget;
    selectedWidgetID: number;
    selectWidgetIndex: number;
    selectedDatasourceID: number;       // DS of selecte W, -1 for D
    showGrid: boolean;
    showDatasourcePopup: boolean = false;
    showModalDashboardNew: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardSaveAs: boolean = false;
    showModalDashboardExport: boolean = false;
    showModalDashboardSnapshots: boolean = false;
    showModalDashboardShare: boolean = false;
    showModalDashboardDiscard: boolean = false;
    showModalDashboardLogin: boolean = false;
    showModalDashboardLogout: boolean = false;
    showModalDashboardComments: boolean = false;
    showModalDashboardDataQuality: boolean = false;
    showModalDashboardRename: boolean = false;
    showModalDashboardDescription: boolean = false;
    showModalDashboardTags
    showModalDashboardTheme: boolean = false;
    showModalDashboardTemplate: boolean = false;
    showModalDashboardSchedule: boolean = false;
    showModalDashboardScheduleEdit: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalDashboardDeleteBulk: boolean = false;
    showModalDashboardTreeview: boolean = false;
    showModalDashboardSubscribe: boolean = false;
    showModalDashboardUsageStats: boolean = false;
    showMainMenu: boolean = true;
    showModalWidgetAnnotations: boolean = false;
    showModalWidgetContainer: boolean = false;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetLinks: boolean = false;
    showModalWidgetRefresh: boolean = false;
    showModalWidgetExpand: boolean = false;
    showModalWidgetExport: boolean = false;
    showModalWidgetDelete: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalDataDirectFileSpreadsheet: boolean = false;
    showModalDataDirectGoogleSheets: boolean = false;
    showModalDataDirectFileCSV: boolean = false;
    showModalDataDirectFileJSON: boolean = false;
    showModalDataDirectQueryBuilder: boolean = false;
    showModalDataDirectSQLEditor: boolean = false;
    showModalDataDirectNoSQL: boolean = false;
    showModalDataDirectService: boolean = false;
    showModalDataDirectWeb: boolean = false;
    showModalDataDirectImport: boolean = false;
    showModalDataDirectExport: boolean = false;
    showModalDataOverview: boolean = false;
    showModalCombinationAppend: boolean = false;
    showModalDataUsage: boolean = false;
    showModalDataScheduleEdit: boolean = false;
    showModalDataSchedule: boolean = false;
    showModalDataRefreshOnce: boolean = false;
    showModalDataRefreshRepeat: boolean = false;
    showModalDataManagedQueryBuilder: boolean = false;
    showModalDataManagedSQLEditor: boolean = false;
    showModalDataManagedGraphQLEditor: boolean = false;
    showModalDataManagedNoSQLEditor: boolean = false;
    showModalDataManagedNeo4jEditor: boolean = false;
    showModalDataManagedOverlayEditor: boolean = false;
    showModalDataTransformation: boolean = false;
    showModalDataEditDatasource: boolean = false;
    showModalDataManagedConnection: boolean = false;
    showModalSlicerEditor: boolean = false;
    showModalWidgetTablist: boolean = false;
    showModalWidgetDescription: boolean = false;
    showModalTableEditor: boolean = false;
    showModalManagedDataDataQuality: boolean = false;
    showModalManagedDataOwnership: boolean = false;
    showModalManageBussGlossary: boolean = false;
    showModalManagedDataDataDictionary: boolean = false;
    showModalDataCombination: boolean = false;
    showModalDataShare: boolean = false;
    showModalDataDictionary: boolean = false;
    showModalBusinessGlossary: boolean = false;
    showModalDataSummary: boolean = false;
    showModalDataDeleteDatasource: boolean = false;
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
    showModalTableDelete: boolean = false;
    showModalSlicerDelete: boolean = false;
    showFavouriteDashboard: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalCollaborateAuditTrail: boolean = false;
    showModalCollaborateSendMessage: boolean = false;
    showModalCollaborateSendEmail: boolean = false;
    showModalCollaborateMessages: boolean = false;
    showModalCollaborateTasksNew: boolean = false;
    showModalCollaborateSystemMessages: boolean = false;
    showModalCollaborateActivities: boolean = false;
    showModalCollaborateTasks: boolean = false;
    showModalLanding: boolean;
    showModalUserMyProfile: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUserMyPermissions: boolean = false;
    showModalUserPaletteButtonBar: boolean = false;
    showModalUsers: boolean = false;
    showModalGroups: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showPalette: boolean = true;
    showPopupMessage: boolean = false;
    showTitleForm: boolean = false;
    showWidgetContextMenu: boolean = false;
    showWidgetFullScreen: boolean = true;
    showWidgetFullScreenWidth: number = 0;
    showWidgetFullScreenHeight: number = 0;
    showWidgetFullScreenBorder: string = '';
    showWidgetFullScreenX: string = '';             // Will be set when menu option called
    showWidgetFullScreenCopy: string = '';          // Will be set when menu option called
    snapToGrid: boolean = true;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    statusBarCancelRefresh: boolean = false;
    statusBarRunning: boolean = false;
    stuckCount: number = 0;
    widgetDimenstions: {
        width: number;
        height: number;
        } = {
            width: 0,
            height: 0,
        };
    widgetGroup: number[] = [];
    zoomFactor: string = 'scale(1)';
    templateWidgets: Widget[] = [];


    public serverMessages = new Array<WebSocketMessage>();

    public sender: string = '';
    public content: string;
    public isBroadcast = false;
    public clientMessage = '';
    private socket$: WebSocketSubject<WebSocketMessage>;

    subscriptionSnapshot: Subscription;
    subscriptionAnimation: Subscription;
    view: any;
    article_count: string = 'start'

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
    ) {
        this.socket$ = WebSocketSubject.create('ws://localhost:8999');

        // Subscribe to WS
        this.socket$.subscribe(
            (message) => {
                this.serverMessages.push(message);
                console.warn('xx message', message, this.serverMessages);
                },
            (err) => console.error(err),
            () => console.warn('Completed!')
        );
    }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // var type = 'article';
        // this[type+'_count'] = 1000;  // in a function we use "this";
        // alert(this.article_count);
        
        var db = new Dexie("MyAppDatabase");
        db.version(1).stores({contacts: 'id, first, last'});
        db.table("contacts").put({first: "First name", last: "Last name"});

        // Get Users and Groups, async
        this.globalVariableService.getCanvasGroups();

        // Dont Disturb
        this.globalVariableService.dontDisturb.subscribe(ddb => this.dontDisturb = ddb)

        // Current user
        this.globalVariableService.currentUserID.subscribe(usr => {
            this.currentUserID = usr;
            console.warn('xx currentUserID', this.currentUserID)
        })

        // TODO - fix hard coding, must be done via Login
        this.globalVariableService.getCanvasUsers().then(res => {
            this.globalVariableService.currentUserID.next('JannieI');
            this.globalVariableService.currentUser = this.globalVariableService.canvasUsers
                .filter(u => u.userID == 'JannieI')[0];
            console.log('Welcome ' + this.globalVariableService.currentUser.userID);

            // Set palette position
            if (this.globalVariableService.currentUser.lastPaletteLeft != null) {
                this.paletteLeft = this.globalVariableService.currentUser.lastPaletteLeft;
            };
            if (this.globalVariableService.currentUser.lastPaletteTop != null) {
                this.paletteTop = this.globalVariableService.currentUser.lastPaletteTop;
            };

            let today = new Date();
            this.globalVariableService.sessionDateTimeLoggedin = 
                this.globalVariableService.formatDate(today);
            // Snapshot at user defined interval: preferenceDefaultSnapshotMins = 0 => none
            let userMins: number = this.globalVariableService.currentUser.preferenceDefaultSnapshotMins;
            if (userMins > 0) {
                let mins: number = userMins * 60 * 1000;
                let localTimer = timer(mins, mins);
                this.subscriptionSnapshot = localTimer.subscribe(t => {
                    if (this.editMode) {

                        // Determine if any actions since session login
                        let temp: CanvasAction[] = this.globalVariableService.actions.filter(act =>
                            act.created > new Date(this.globalVariableService.sessionDateTimeLoggedin)
                            &&
                            act.createor == this.globalVariableService.currentUser.userID
                        );

                        // Only snap if there were activities
                        if (temp.length > 0) {

                            let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(
                                d => d.id ==
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardID
                            );
                            if (dashboardIndex >= 0) {
                                let today = new Date();
                                let snapshotName: string = this.globalVariableService.dashboards[
                                    dashboardIndex]
                                    .name + ' ' + this.globalVariableService.formatDate(today);
                                let snapshotComment: string = 'Automated Snapshot after ' +
                                    (mins / 60000).toString() + ' mins';
                                this.globalVariableService.newDashboardSnapshot(
                                    snapshotName, 
                                    snapshotComment,
                                    'AutoFrequency').then(res => {
                                        this.showMessage(
                                            'Added automated Snapshot after ' +
                                            (mins / 60000).toString() + ' mins',
                                            'StatusBar',
                                            'Info',
                                            3000,
                                            ''
                                        );

                                });
                            };
                        };                        
                    };
                });
            };

            this.globalVariableService.currentPaletteButtonsSelected.subscribe(i => {
                this.paletteButtons = i.slice();

                // Synch BehSubj that hold orientation
                this.globalVariableService.preferencePaletteHorisontal.next(
                    this.globalVariableService.currentUser.preferencePaletteHorisontal
                );

                this.globalVariableService.preferencePaletteHorisontal.subscribe(i =>

                    // Calc the W and H - store and this.paletteHeight and this.paletteWidth
                    this.setPaletteHeightAndWidth()
                );

            });
        });

        this.globalVariableService.showPalette.subscribe(i => this.showPalette = i);
        this.globalVariableService.showGrid.subscribe(i => this.showGrid = i);
        this.showModalLanding = this.globalVariableService.showModalLanding.value;

        this.globalVariableService.hasDatasources.subscribe(
            i => this.hasDatasources = i
        );

        this.globalVariableService.editMode.subscribe(
            i => {
                    this.editMode = i;
                    if (!i) {this.editMenuText = 'Edit Mode'}
                    else {this.editMenuText = 'View Mode'};
                 }
        );

        this.globalVariableService.dashboardsRecentBehSubject.subscribe(i => {
            this.recentDashboards = i.slice(0, 5)
        });

        // This refreshes one W
        this.globalVariableService.changedWidget.subscribe(w => {
            if (w != null) {
                // Note: amend this.currentWidgets as it is a ByRef to
                // this.gv.currentWidgets, which Angular does not register that it has changed

                // Deep copy
                let newW: Widget = Object.assign({}, w);

                // Delete W if it in our stash
                for (var i = 0; i < this.currentWidgets.length; i++) {
                    if (this.currentWidgets[i].id == w.id) {
                        this.currentWidgets.splice(i, 1);
                    };
                };

                // Add the given one, if [TabID] has current TabID
                if (newW.dashboardTabIDs.indexOf(
                    this.globalVariableService.currentDashboardInfo.value.
                    currentDashboardTabID) >= 0) {
                    this.currentWidgets.push(newW);
                };

                console.warn('xx app changedWidget replaced', w, this.currentWidgets)
            };
        });

        // This refreshes the whole D, with W and related info
        this.globalVariableService.currentDashboardInfo.subscribe(
            i => {
                if (i) {

                    this.companyName = this.globalVariableService.canvasSettings.companyName;
                    this.hasDashboard = true;

                    this.globalVariableService.refreshCurrentDashboardInfo(
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID)
                            .then(j => {

                                let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(d => d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID);

                                if (dashboardIndex >= 0) {
                                    this.currentDashboardBackgroundColor = this.globalVariableService.dashboards[dashboardIndex].backgroundColor;
                                    let templateDashboardID: number = this.globalVariableService.dashboards[dashboardIndex].templateDashboardID; 

                                    if (templateDashboardID != null  &&  templateDashboardID > 0) {
                                        // Load Template
                                        this.templateWidgets = this.globalVariableService.widgets.filter(w => 
                                            w.dashboardID == templateDashboardID
                                        );

                                    } else {
                                        this.templateWidgets = [];
                                    };

                                };

                                this.refreshGraphs = false;

                                // Cater for -1, ie First T
                                if (this.globalVariableService.currentDashboardInfo.value
                                    .currentDashboardTabIndex == -1) {
                                        this.globalVariableService.currentDashboardInfo
                                            .value.currentDashboardTabIndex = 0
                                };
                                if (this.globalVariableService.currentDashboardInfo.value
                                    .currentDashboardTabID == -1) {
                                        if (this.globalVariableService.
                                            currentDashboardTabs.length > 0) {
                                        this.globalVariableService.currentDashboardInfo
                                            .value.currentDashboardTabID = this.globalVariableService.
                                            currentDashboardTabs[this.globalVariableService.currentDashboardInfo
                                                .value.currentDashboardTabIndex].id
                                    };
                                };

                                this.currentDashboardTabIndex = this.globalVariableService.currentDashboardInfo.value.
                                    currentDashboardTabIndex;
                                this.currentDashboardName = this.globalVariableService.
                                    currentDashboards[0].name;
                                this.currentTabName = this.globalVariableService.
                                    currentDashboardTabs[this.currentDashboardTabIndex].name;
                                this.currentTabBackgroundColor = this.globalVariableService.
                                    currentDashboardTabs[this.currentDashboardTabIndex].backgroundColor;
                                if (this.currentTabBackgroundColor == ''  ||  this.currentTabBackgroundColor == null) {
                                    this.currentTabBackgroundColor = '#192b35';
                                };
                                this.currentTabColor = this.globalVariableService.
                                    currentDashboardTabs[this.currentDashboardTabIndex].color;
                                if (this.currentTabColor == ''  ||  this.currentTabColor == null) {
                                    this.currentTabColor = 'white';
                                };
                                this.currentDatasources = this.globalVariableService.
                                    currentDatasources.slice();

                                // Loop on All/Indicated Ws
                                this.currentWidgets = [];
                                for (var i = 0; i < this.globalVariableService.currentWidgets.length; i++) {
                                    let w: Widget = Object.assign({},
                                        this.globalVariableService.currentWidgets[i]);
                                    w.isSelected = false;
                                    this.currentWidgets.push(w)
                                }
                                console.warn('xx app end', this.currentWidgets);

                            }

                        )
                }
            }
        )
    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        //
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

        // if (this.widgetDOM != undefined  &&  (!this.refreshGraphs) ) {
        //     this.refreshGraphs = true;
        //     // TODO - only refresh changed one after W-Editor
        //     this.currentWidgets.forEach(w => {
        //     })
        // }
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.globalVariableService.showGrid.unsubscribe();
        this.globalVariableService.showPalette.unsubscribe();
        this.globalVariableService.hasDatasources.unsubscribe();
        this.globalVariableService.editMode.unsubscribe();
        this.globalVariableService.changedWidget.unsubscribe();
        this.globalVariableService.currentDashboardInfo.unsubscribe();
        this.subscriptionSnapshot.unsubscribe();
        this.subscriptionAnimation.unsubscribe();
    }





    // ***********************  HANDLE RETURN AFTER MODAL FORM CLOSES ************************ //
    dashboardPageFirst() {
        // Move to First Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardPageFirst', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'First'
        );
    }

    dashboardPageDown() {
        // Move to next Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardPageDown', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Next'
        );
    }

    dashboardPageUp() {
        // Move to previous Tab 
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardPageUp', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Previous'
        );
    }

    dashboardPageLast() {
        // Move to previous Tab 
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardPageLast', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Last'
        );
    }
        






    // ***********************  HANDLE RETURN AFTER MODAL FORM CLOSES ************************ //

    handleCloseModalLanding(action: string) {
        // Close Modal form Landing page
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalLanding', '@Start');

        this.showModalLanding = false;
        // this.document.body.style.backgroundImage ='../images/BarChart.png';

        if (action == 'New') {
            this.showModalDashboardNew = true;
        } else {
            if (this.globalVariableService.openDashboardFormOnStartup) {
                console.log('handleCloseModalLanding 1')
                this.showModalDashboardOpen = true;
            };

            this.dashboardOpenActions();
            this.showModalLanding = false;
        };

    }

    handleCloseDashboardNew(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardNew', '@Start');

        this.menuOptionClickPostAction();

        // When creating a D, one can also Edit it
        this.globalVariableService.editMode.next(true);
        this.showModalDashboardNew = false;

        // Show help for first time users
        if (action == 'Created'
            &&
            this.globalVariableService.currentUser.isFirstTimeUser) {
            this.isFirstTimeUser = true;
        }

    }

    handleCloseDashboardOpen(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardOpen', '@Start');

        this.menuOptionClickPostAction();
        this.dashboardOpenActions();

        this.showModalDashboardOpen = false;
    }

    handleCloseDashboardSave(action: string) {
        // Handle close form for Save a D - from Draft -> Complete
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSave', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSave = false;
    }

    handleCloseDashboardSaveAs(action: string) {
        // Handle close form for Save AS a Complete D under a new name
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSaveAs', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSaveAs = false;
    }

    handleCloseDashboardExport(action: string) {
        // Handle close form for Export of D to a text file
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardExport = false;
    }

    handleCloseDashboardSnapshots(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSnapshots', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSnapshots = false;
    }

    handleCloseDashboardShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardShare', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardShare = false;
    }

    handleCloseDashboardDiscard(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDiscard', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardRename(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardRename', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDescription(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDescription', '@Start');

        this.menuOptionClickPostAction();

        // Refresh any changes to the current D
        if (action == 'Saved') {
            this.currentDashboardName = this.selectedDashboard.name;
            this.currentDashboardBackgroundColor = this.selectedDashboard.backgroundColor;
            this.currentDashboardBackgroundImage = this.selectedDashboard.backgroundImage;
        };

        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTags', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTags = false;
    }

    handleCloseDashboardTheme(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTheme', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTheme = false;
    }

    handleCloseDashboardTemplate(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTemplate', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTemplate = false;
    }

    handleCloseDashboardSchedule(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSchedule', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSchedule = false;
    }
    
    handleCloseDashboardScheduleEdit(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardScheduleEdit', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardScheduleEdit = false;
    }

    handleCloseDashboardDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDelete', '@Start');

        if (action == 'Deleted') {
            this.clearDashboard();
        }
        this.menuOptionClickPostAction();

        this.showModalDashboardDelete = false;
    }

    handleCloseDashboardDeleteBulk(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDeleteBulk', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDeleteBulk = false;
    }

    handleCloseDashboardTreeview(action: string){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTreeview', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTreeview = false;
    }

    handleCloseDashboardSubscribe(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSubscribe', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSubscribe = false;
    }

    handleCloseDashboardUsageStats(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardUsageStats', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardUsageStats = false;
    }

    handleCloseShapeEdit(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeEdit', '@Start');

        // Add to Action log
        if (changedWidget != null) {
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                changedWidget.id,
                'Widget',
                this.newWidget? 'Add' : 'Edit',
                '',
                'App handleCloseShapeEdit',
                null,
                null,
                this.newWidget? null : this.selectedWidget,
                changedWidget
            );

            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.menuOptionClickPostAction();

        this.showModalShapeEdit = false;
    }

    handleCloseShapeDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeDelete', '@Start');

        // Delete if so requested
        if (action == 'Delete') {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.selectedWidget.id,
                'Widget',
                'Delete',
                '',
                'App handleCloseWidgetDelete',
                null,
                null,
                this.selectedWidget,
                null
            );

            this.deleteWidget('Shape');
        };

        this.menuOptionClickPostAction();

        this.showModalShapeDelete = false;
    }

    handleCloseWidgetAnnotations(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardAnnotations', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetAnnotations = false;
    }

    handleCloseDashboardComments(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardComments', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardComments = false;
    }

    handleCloseDashboardDataQuality(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDataQuality', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDataQuality = false;
    }

    handleCloseDashboardPrint(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardPrint', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardPrint = false;
    }

    handleCloseDataSlicers(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataSlicers', '@Start');

        // Add to Action log
        if (changedWidget != null) {
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                changedWidget.id,
                'Widget',
                this.newWidget? 'Add' : 'Edit',
                '',
                'App handleCloseDataSlicers',
                null,
                null,
                this.newWidget? null : this.selectedWidget,
                changedWidget
            );

            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.menuOptionClickPostAction();

        this.showModalSlicerEditor = false;
    }

    handleCloseWidgetTitle(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalWidgetTitle', '@Start');

        if (changedWidget != null) {
            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.menuOptionClickPostAction();

        this.showTitleForm = false;
    }

    handleCloseWidgetEditor(changedWidget: Widget) {    //widgetsToRefresh: number) {
        // Handle closing routine for Widget Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

        // Cancel => changedWidget = null
        if (changedWidget != null) {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                changedWidget.id,
                'Widget',
                this.newWidget? 'Add' : 'Edit',
                '',
                'App handleCloseWidgetEditor',
                null,
                null,
                this.newWidget? null : this.selectedWidget,
                changedWidget
            );

            this.globalVariableService.changedWidget.next(changedWidget);
        }

        this.menuOptionClickPostAction();
        console.warn('xx app W', this.selectedWidget, changedWidget, this.currentWidgets)
        this.showModalWidgetEditor = false;
    }

    handleCloseWidgetTablist(tabIDs: number[]) {
        // Handle close of Tablist form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetTablist', '@Start');

        // Close without change returns null
        if (tabIDs != null) {

            // Work on selected W
            this.currentWidgets.forEach(w => {
                if (w.isSelected) {

                    // Update local, and global Ws
                    w.dashboardTabIDs = tabIDs;
                    this.globalVariableService.widgetReplace(w);
                    this.globalVariableService.changedWidget.next(w);
                }
            });

        };

        this.menuOptionClickPostAction();

        this.showModalWidgetTablist = false;
    }

    handleCloseWidgetDescription(tabIDs: number[]) {
        // Handle close of Description form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDescription', '@Start');

        this.showModalWidgetDescription = false;
    }

    handleCloseDataDirectFileCSV(returnDS: Datasource) {
        // Handle close of Direct File CSV file load
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectFileCSV', '@Start');

        this.menuOptionClickPostAction();
    
        this.showModalDataDirectFileCSV = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
        
    handleCloseDataDirectFileJSON(returnDS: Datasource) {
        // Handle close of Direct File JSON file load
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectFileJSON', '@Start');

        this.menuOptionClickPostAction();
    
        this.showModalDataDirectFileJSON = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectFileSpreadsheet(returnDS: Datasource) {
        // Handle close of Direct File Spreadsheet load
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectFileSpreadsheet', '@Start');

        this.menuOptionClickPostAction();
    
        this.showModalDataDirectFileSpreadsheet = false;
        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectGoogleSheets(returnDS: Datasource) {
        // Handle close of Direct File Spreadsheet load
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectGoogleSheets', '@Start');

        this.menuOptionClickPostAction();
    
        this.showModalDataDirectGoogleSheets = false;
        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
    
    handleCloseDataDirectQueryBuilder(returnDS: Datasource) {
        // Handle Close of Direct SQL Query Builder
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectQueryBuilder', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectQueryBuilder = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };

    }

    handleCloseDataDirectSQLEditor(returnDS: Datasource) {
        // Handle close of Direct SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectSQLEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectSQLEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectNoSQL(returnDS: Datasource) {
        // Handle close of Direct NoSQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectNoSQL', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectNoSQL = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectService(returnDS: Datasource) {
        // Handle close of Direct Service form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectService', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectService = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectWeb(returnDS: Datasource) {
        // Handle close of Direct Web form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectWeb', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectWeb = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
    
    handleCloseDataDirectImport(action: string) {
        // Handle close of Direct Import of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectImport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectImport = false;

    }

    handleCloseDataDirectExport(action: string) {
        // Handle close of Direct NoSQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDirectExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectExport = false;

    }

    handleCloseDataCombinationAppend(action: string) {
        // Handle close of CombinationAppend form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataCombinationAppend', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCombinationAppend = false;
    }

    handleCloseDataDatasourceOverview(action: string) {
        // Handle close of Datasource Overview
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceOverview', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataOverview = false;
    }
    
    handleCloseDataDatasourceUsage(action: string) {
        // Handle close of Datasource Usage
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceUsage', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataUsage = false;
    }

    handleCloseDataDatasourceScheduleEdit(action: string) {
        // Handle close of Datasource Schedule Edit
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceScheduleEdit', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataScheduleEdit = false;
    }

    handleCloseDataDatasourceSchedule(action: string) {
        // Handle close of Datasource Schedules
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceSchedule', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataSchedule = false;
    }

    handleCloseDataDatasourceRefreshOnce(action: string) {
        // Handle close of Datasource RefreshOnce
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceRefreshOnce', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataRefreshOnce = false;
    }
    
    handleCloseDataDatasourceRefreshRepeat(action: string) {
        // Handle close of Datasource RefreshRepeat
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDatasourceRefreshRepeat', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataRefreshRepeat = false;
    }
    
    handleCloseDataManagedConnection(action: string) {
        // Handle Close of SQL Query Builder
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedConnection', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedConnection = false;
    }

    handleCloseDataManagedQueryBuilder(returnDS: Datasource) {
        // Handle Close of SQL Query Builder
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedQueryBuilder', '@Start');

        this.menuOptionClickPostAction();

        this.selectedDatasource = returnDS;
        this.showModalDataManagedQueryBuilder = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataManagedSQLEditor(returnDS: Datasource) {
        // Handle Close of SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedSQLEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedSQLEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
    
    handleCloseDataManagedGraphQLEditor(returnDS: Datasource) {
        // Handle Close of GraphQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedGraphQLEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedGraphQLEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
    
    handleCloseDataManagedNoSQLEditor(returnDS: Datasource) {
        // Handle Close of NoSQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedNoSQLEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedNoSQLEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
    
    handleCloseDataManagedNeo4jEditor(returnDS: Datasource) {
        // Handle Close of Neo4j Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedNeo4jEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedNeo4jEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataManagedOverlayEditor(returnDS: Datasource) {
        // Handle Close of Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedOverlayEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedOverlayEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }
        
    handleCloseDataTransformation(action: string) {
        // Handle Close of Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataTransformation', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataTransformation = false;
    }
        
    handleCloseDataEditDatasource(returnedDatasource: Datasource) {
        // Handle Close of Edit Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataEditDatasource', '@Start');

        this.menuOptionClickPostAction();

        // Close the Edit Selection form
        this.showModalDataEditDatasource = false;
        
        // Open relevant form
        if (returnedDatasource != null) {
            this.editingDS = true;
            this.selectedDatasource = returnedDatasource;

            if (this.globalVariableService.continueToTransformations) {
                this.globalVariableService.continueToTransformations = false;
                this.showModalDataTransformation = true;
            } else {
                if (returnedDatasource.createMethod == 'directFileCSV') {
                    this.showModalDataDirectFileCSV = true;
                } else if (returnedDatasource.createMethod == 'directFileJSON') {
                    this.showModalDataDirectFileJSON = true;
                } else if (returnedDatasource.createMethod == 'directFileSpreadsheet') {
                    this.showModalDataDirectFileSpreadsheet = true;
                } else if (returnedDatasource.createMethod == 'directGoogleSheets') {
                    this.showModalDataDirectGoogleSheets = true;
                } else if (returnedDatasource.createMethod == 'directQueryBuilder') {
                    this.showModalDataDirectQueryBuilder = true;
                } else if (returnedDatasource.createMethod == 'directSQLEditor') {
                    this.showModalDataDirectSQLEditor = true
                } else if (returnedDatasource.createMethod == 'directNoSQL') {
                    this.showModalDataDirectNoSQL = true
                } else if (returnedDatasource.createMethod == 'directWeb') {
                    this.showModalDataDirectWeb = true
                } else if (returnedDatasource.createMethod == 'managedQueryBuilder') {
                    this.showModalDataManagedQueryBuilder = true;
                } else if (returnedDatasource.createMethod == 'managedSQLEditor') {
                    this.showModalDataManagedSQLEditor = true;
                } else if (returnedDatasource.createMethod == 'managedOverlayEditor') {
                    this.showModalDataManagedOverlayEditor = true;
                } else if (returnedDatasource.createMethod == 'managedGraphQLEditor') {
                    this.showModalDataManagedGraphQLEditor = true;
                } else if (returnedDatasource.createMethod == 'managedNoSQLEditor') {
                    this.showModalDataManagedNoSQLEditor = true;
                } else if (returnedDatasource.createMethod == 'managedNeo4jEditor') {
                    this.showModalDataManagedNeo4jEditor = true;
                } else {
                    this.showMessage(
                        'Datasource has invalid data (createMethod)',
                        'StatusBar',
                        'Error',
                        3000,
                        ''
                    );
        
                };

            };

        };
    }

    handleCloseDataManagedDataQuality(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedDataQuality', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataDataQuality = false;
    }

    handleCloseDataManagedDataOwnership(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedDataOwnership', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataOwnership = false;
    }

    handleCloseDataManagedDataDictionary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManageDataDictionary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataDataDictionary = false;
    }

    handleCloseDataManagedBusGlossary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataManagedBusGlossary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManageBussGlossary = false;
    }

    handleCloseDataCombination(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataCombination', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataCombination = false;
    }

    handleCloseDataShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataShare', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataShare = false;
    }

    handleCloseDataDictionary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDictionary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDictionary = false;
    }

    handleCloseBusinessGlossary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseBusinessGlossary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalBusinessGlossary = false;
    }

    handleCloseDataSummary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataSummary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataSummary = false;
    }

    handleCloseDataDeleteDatasource(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataDeleteDatasource', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDeleteDatasource = false;
    }

    handleCloseWidgetContainer(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetContainer', '@Start');

        this.globalVariableService.changedWidget.next(changedWidget);

        this.menuOptionClickPostAction();

        this.showModalWidgetContainer = false;
    }

    handleCloseWidgetCheckpoints(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetCheckpoints', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetCheckpoints = false;
    }

    handleCloseWidgetLinks(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetLinks', '@Start');


        this.menuOptionClickPostAction();

        this.showModalWidgetLinks = false;
    }

    handleCloseWidgetRefresh(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetRefresh', '@Start');


        this.menuOptionClickPostAction();

        this.showModalWidgetRefresh = false;
    }

    handleCloseWidgetExpand(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExpand', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetExpand = false;
    }

    handleCloseWidgetExport(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetExport = false;
    }

    handleCloseWidgetDelete(action: string) {
        // Handles the response to the Delete Widget form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDelete', '@Start');

        // Delete, if so requested
        if (action == 'delete') {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.selectedWidget.id,
                'Widget',
                'Delete',
                '',
                'App handleCloseWidgetDelete',
                null,
                null,
                this.selectedWidget,
                null
            );

            this.deleteWidget('Graph');
        };

        this.menuOptionClickPostAction();

        // Hide modal form
        this.showModalWidgetDelete = false;
    }

    handleCloseTableEditor(changedWidget: Widget) {    //widgetsToRefresh: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseTableEditor', '@Start');

        // Add to Action log
        if (changedWidget != null) {
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                changedWidget.id,
                'Widget',
                this.newWidget? 'Add' : 'Edit',
                '',
                'App handleCloseTableEditor',
                null,
                null,
                this.newWidget? null : this.selectedWidget,
                changedWidget
            );

            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.menuOptionClickPostAction();

        this.showModalTableEditor = false;
    }

    handleCloseTableDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseTableDelete', '@Start');

        // Delete if so requested
        if (action == 'Delete') {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.selectedWidget.id,
                'Widget',
                'Delete',
                '',
                'App handleCloseWidgetDelete',
                null,
                null,
                this.selectedWidget,
                null
            );

            this.deleteWidget('Table');
        };

        this.menuOptionClickPostAction();

        this.showModalTableDelete = false;
    }

    handleCloseSlicerDelete(action: string) {
        // Once deletion confirmation form has closed, delete it if so requested
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseSlicerDelete', '@Start');

        // Delete if so requested
        if (action == 'Delete') {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.selectedWidget.id,
                'Widget',
                'Delete',
                '',
                'App handleCloseWidgetDelete',
                null,
                null,
                this.selectedWidget,
                null
            );

            this.deleteWidget('Slicer');
        };

        this.menuOptionClickPostAction();

        this.showModalSlicerDelete = false;
    }

    handleCloseDashboardHelp(action: string) {
        // Close help form for first time D users
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardHelp', '@Start');

        this.menuOptionClickPostAction();

        this.isFirstTimeUser = false;
    }

    handleCloseCollaborateAuditTrail(action: string) {
        // Close AuditTrail form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateAuditTrail', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateAuditTrail = false;
    }

    handleCloseCollaborateMessages(action: string) {
        // Close Messages form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateMessages', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateMessages = false;
    }

    handleCloseCollaborateTaskAdd(action: string) {
        // Close Add Task form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateTaskAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateTasksNew = false;
    }

    handleCloseCollaborateSystemMessages(action: string) {
        // Close Add Task form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateSystemMessages', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSystemMessages = false;
    }

    handleCloseCollaborateActivities(action: string) {
        // Close Activities form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivities', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateActivities = false;
    }

    handleCloseCollaborateTasks(action: string) {
        // Close Activities form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateTasks', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateTasks = false;
    }

    handleCloseSendMessageAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseSendMessageAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSendMessage = false;
    }

    handleCloseSendEmailAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseSendEmailAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSendEmail = false;
    }

    handleCloseUserLogin(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogin', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardLogin = false;
    }

    handleCloseUserLogout(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogout', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardLogout = false;

        if (action == 'LoggedOut') {
            this.showModalDashboardLogin = true;
        };
    }

    handleCloseUserPreferences(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserPreferences', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserPreferences = false;
    }

    handleCloseUserMyPermissions(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserMyPermissions', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserMyPermissions = false;
    }

    handleCloseUserdMyProfile(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserdMyProfile', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserMyProfile = false;
    }

    handleCloseUserPaletteButtonBar(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserPaletteButtonBar', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserPaletteButtonBar = false;
    }

    handleCloseUsers(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUsers', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUsers = false;
    }

    handleCloseGroups(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseGroup', '@Start');

        this.menuOptionClickPostAction();

        this.showModalGroups = false;
    }

    handleCloseUserSystemSettings(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserSystemSettings', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserSystemSettings = false;
    }






    // ***********************  CLICK EDIT MENU OPTIONS ************************ //

    clickMenuEditMode() {
        // Toggle Edit Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditMode', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.hasDashboard) {
            this.showMessage(
                'First add/open a Dashboard',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        }

        // Warning to make sure does not get stuck
        if (!this.showPalette) {
            this.showMessage(
                'Make palette visible on View menu',
                'StatusBar',
                'Info',
                3000,
                ''
            );
        };

        this.menuOptionClickPreAction();

        // Exceed 4 ...
        this.stuckCount = 5;

        // Switch off all selections if going to View Mode
        if (this.editMode) {
            this.clickMenuEditSelectAllNone('None');
            
            // Toggle mode
            this.globalVariableService.editMode.next(!this.editMode);

            // Update EditMode in D-Recent
            let localIndex: number = this.globalVariableService.dashboardsRecent.findIndex(
                u => u.dashboardID == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            );
            if (localIndex >= 0) {
                this.globalVariableService.dashboardsRecent[localIndex].editMode = false;
                this.globalVariableService.saveDashboardRecent(
                    this.globalVariableService.dashboardsRecent[localIndex]);
            };
            
        } else {
        
            let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(
                d => d.id == this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardID
            );

            if (dashboardIndex >= 0) {
                let localDashboard: Dashboard = this.globalVariableService
                    .dashboards[dashboardIndex];

                if (localDashboard.state == 'Complete') {
                    if (localDashboard.draftID != null) {

                        // Simply open Draft in EditMode
                        this.globalVariableService.refreshCurrentDashboard(
                            'app-clickMenuEditMode', localDashboard.draftID, -1, ''
                        );
                        this.globalVariableService.editMode.next(true);
                        

                    } else {

                        this.globalVariableService.copyDashboard(
                            localDashboard.id, null, 'Draft'
                        ).then(res => {

                            this.globalVariableService.refreshCurrentDashboard(
                                'app-clickMenuEditMode', res.id, -1, ''
                            );

                            let today = new Date();
                            let snapshotName: string = this.globalVariableService.dashboards[
                                dashboardIndex].name + ' ' 
                                + this.globalVariableService.formatDate(today);
                            this.globalVariableService.newDashboardSnapshot(
                                snapshotName, 'Starting Edit Mode','StartEditMode'
                            );

                            // Toggle mode
                            this.globalVariableService.editMode.next(!this.editMode);

                        });
                    };
                } else {
                    this.globalVariableService.editMode.next(true);
                };

                // Update EditMode in D-Recent
                let localIndex: number = this.globalVariableService.dashboardsRecent.findIndex(
                    u => u.dashboardID == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
                );
                if (localIndex >= 0) {
                    this.globalVariableService.dashboardsRecent[localIndex].editMode = true;
                    this.globalVariableService.saveDashboardRecent(
                        this.globalVariableService.dashboardsRecent[localIndex]);
                };                    
            };
        };

        // // Register in recent
        // this.globalVariableService.amendDashboardRecent(
        //     this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
        //     this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID);

        this.menuOptionClickPostAction();
    }

    clickMenuEditUndo() {
        // Undo a previous action
        // These are the rules:  DO = action, Undo = cancel DO, Redo = cancel Undo
        // Redo:
        // - can only reverse a previous Undo
        // - can only continue this up to a DO (cannot go further)
        // Undo:
        // - reverse previous DO or Redo
        // - stores undoID = id of DO that was reversed
        // - if multiple, takes DO prior to (prev undoID)
        // - does not store oldW, newW as these are obtained from DO
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditUndo', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Get action for current D and T
        let ourActions: CanvasAction[] = [];
        ourActions = this.globalVariableService.actions.filter(act =>
            act.dashboardID ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            &&
            act.dashboardTabID ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        );

        // Can only undo if something has been done before
        if (ourActions.length == 0) {
            console.log('Nothing to undo')
            return;
        };

        this.menuOptionClickPreAction();

        // Get last actionID for it
        let tempActionIDs: number[] = [];
        for (var i = 0; i < ourActions.length; i++) {
            tempActionIDs.push(ourActions[i].id)
        };
        let maxActID: number = Math.max(...tempActionIDs);

        // Get last action
        let filteredActions: CanvasAction[] = [];
        filteredActions = ourActions.filter(act => act.id == maxActID);

        if (filteredActions[0].undoID == null) {
            console.warn('xx filteredActions[0]', filteredActions[0])
            // Previous was not an UNDO, so just reverse it
            let widgetID: number = null;
            if (filteredActions[0].newWidget != null) {
                widgetID = filteredActions[0].newWidget.id
            };

            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                widgetID,
                'Widget',
                'Edit',
                'Undo',
                'App clickMenuEditUndo',
                filteredActions[0].id,
                null,
                filteredActions[0].newWidget,
                filteredActions[0].oldWidget
            );
            if (filteredActions[0].objectType == 'Widget') {
                if (filteredActions[0].oldWidget == null) {
                    this.deleteWidget(null, filteredActions[0].newWidget.id);
                } else {

                    // TODO - do this better in a DB
                    if (this.currentWidgetCheckpoints.length > 0) {
                        this.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };
                 
                    if (this.globalVariableService.currentWidgetCheckpoints.length > 0) {
                        this.globalVariableService.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };

                    if (this.globalVariableService.widgetCheckpoints.length > 0) {
                        this.globalVariableService.widgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                                this.globalVariableService.saveWidgetCheckpoint(chk);
                            };
                        });
                    };

                    // Add (previous action was a Delete) / Save to DB
                    if (filteredActions[0].action = 'Delete') {
                        this.globalVariableService.addWidget(filteredActions[0].oldWidget);
                    } else {
                        this.globalVariableService.saveWidget(filteredActions[0].oldWidget);
                    };

                    this.globalVariableService.changedWidget.next(filteredActions[0].oldWidget);

                };
            };

            console.log('undo prev DO, id ',filteredActions[0].id, this.globalVariableService.actions )
        } else {
            // Get highest DO id < (undoID - 1)
            let lastUndoID: number = filteredActions[0].undoID;
            let undoActID: number = 1;
            let tempActionIDs: number[] = [];
            for (var i = ourActions.length - 1; i >= 0; i--) {
                if (ourActions[i].id < lastUndoID) {
                    if (ourActions[i].undoID == null) {
                        tempActionIDs.push(ourActions[i].id);
                    } else {
                        break;
                    };
                };
            };
            if (tempActionIDs.length > 0) {
                undoActID = Math.max(...tempActionIDs);
            };

            // Can only undo if something has been done before
            if (tempActionIDs.length == 0) {
                console.log('Nothing more to undo')

                this.menuOptionClickPostAction();
                return;
            };

            filteredActions = this.globalVariableService.actions.filter(
                    act => act.id == undoActID);

            // Add to Actions
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                filteredActions[0].newWidget.id,
                'Widget',
                'Edit',
                'Undo ' + filteredActions[0].redoID == null? 'DO' : 'REDO',
                'App clickMenuEditUndo',
                filteredActions[0].id,
                null,
                filteredActions[0].newWidget,
                filteredActions[0].oldWidget
            );

            // Diff Object Types
            if (filteredActions[0].objectType == 'Widget') {
                if (filteredActions[0].oldWidget == null) {
                    this.deleteWidget(null, filteredActions[0].newWidget.id);
                } else {

                    // TODO - do this better in a DB
                    if (this.currentWidgetCheckpoints.length > 0) {
                        this.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };
                    if (this.globalVariableService.currentWidgetCheckpoints.length > 0) {
                        this.globalVariableService.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };
                    if (this.globalVariableService.widgetCheckpoints.length > 0) {
                        this.globalVariableService.widgetCheckpoints.forEach(chk => {
                            if (chk.widgetID == filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                                this.globalVariableService.saveWidgetCheckpoint(chk);
                            };
                        });
                    };

                    // Save to DB
                    this.globalVariableService.saveWidget(filteredActions[0].oldWidget);

                    this.globalVariableService.changedWidget.next(filteredActions[0].oldWidget);
                };

            };

            console.log('undo prev id ', filteredActions[0].id, this.globalVariableService.actions)
        };

        this.menuOptionClickPostAction();
    }

    clickMenuEditRedo() {
        // Redo a previous action
        // These are the rules:  DO = action, Undo = cancel DO, Redo = cancel Undo
        // Redo:
        // - can only reverse a previous Undo
        // - can only continue this up to a DO (cannot go further)
        // See Undo function for more detail.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditRedo', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Get action for current D and T
        let ourActions: CanvasAction[] = [];
        ourActions = this.globalVariableService.actions.filter(act =>
            act.dashboardID ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            &&
            act.dashboardTabID ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        );

        // TODO - decide if lates / -1 is best choice here
        if (ourActions.length == 0) {
            console.log('Nothing to Redo');
            return;
        };

        this.menuOptionClickPreAction();

        // Loop back, 1 at a time, and stop at first non-Undo
        let redoIDs: number[] = [];
        for (var i = ourActions.length - 1; i >= 0; i--) {
            if (ourActions[i].redoID != null) {
                redoIDs.push(ourActions[i].redoID)
            } else {
                if (ourActions[i].undoID == null) {
                    // Previous was not an UNDO, so cannot reverse it
                    console.log('Prev NOT an undo, so cannot redo it')
                    break;
                } else {

                    if (redoIDs.indexOf(ourActions[i].id)<0) {

                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            ourActions[i].newWidget.id,
                            'Widget',
                            'Edit',
                            'Redo',
                            'App clickMenuEditRedo',
                            null,
                            ourActions[i].id,
                            ourActions[i].newWidget,
                            ourActions[i].oldWidget);

                            // Diff Object Types
                            if (ourActions[i].objectType == 'Widget') {
                                if (ourActions[i].oldWidget == null) {
                                    this.deleteWidget('Graph',ourActions[i].newWidget.id);
                                } else {

                                    // Save to DB
                                    this.globalVariableService.saveWidget(ourActions[i].oldWidget);

                                    this.globalVariableService.changedWidget.next(
                                        ourActions[i].oldWidget);
                                };
                            };

                        console.log('Redo id', ourActions[i].id);
                        break;
                    };
                };
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuEditSelectAllNone(size: string) {
        // Selects/Deselects n objects on the D based on size, All, None, Auto
        // Auto will select All if none is selected, None is any is selected
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectAllNone', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        if (size == 'None') {
            this.currentWidgets.forEach(w => {w.isSelected  = false});
            this.globalVariableService.currentWidgets.forEach(w => {
                w.isSelected  = false
            });
        };
        if (size == 'All') {
            this.currentWidgets.forEach(w => w.isSelected = true);
            this.globalVariableService.currentWidgets.forEach(w => w.isSelected = true);
        };
        if (size == 'Auto') {
            let selectedWidgets: Widget[] = this.currentWidgets.filter(
                w => (w.isSelected) );
            if (selectedWidgets.length == 0) {
                this.currentWidgets.forEach(w => w.isSelected = true);
                this.globalVariableService.currentWidgets.forEach(w => w.isSelected = true);
            } else {
                this.currentWidgets.forEach(w => w.isSelected = false);
                this.globalVariableService.currentWidgets.forEach(w => w.isSelected = false);
            }
        };

        this.menuOptionClickPostAction();
    }





    // ***********************  CLICK DASHBOARD MENU OPTIONS ************************ //

    clickDashboardNew() {
        // Create a new D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardNew', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Create Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();
        this.editMode = true;
        this.hasDashboard = true;
        console.log('App clickDashboardNew')
        this.showModalDashboardNew = true;
    }

    clickDashboardOpen() {
        // Open or Import an existing D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardOpen', '@Start');

        // Only for Draft
        if (this.globalVariableService.currentUser.userID == '') {
            this.showMessage(
                'Log in first',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        console.log('App clickDashboardOpen')
        this.showModalDashboardOpen = true;
    }

    clickDashboardDiscard() {
        // Discard changes made since the previous Save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDiscard', '@Start');

        // Only for Draft
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardState !=
            'Draft') {
            this.showMessage(
                'Only Draft Dashboards can be Discarded',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardDiscard = true;
    }

    clickDashboardShare() {
        // Share a D - set the Access Type (ie Private) and Access List
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardShare', '@Start');
        
        // TODO - is this correct ??
        // Can only be done for state = Complete
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardState
            != 'Complete') {
            this.showMessage(
                'Only possible for Dashboards with state = Complete',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;
        }

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanGrantAccessRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Access Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalDashboardShare = true;
    }

    clickDashboardSave() {
        // Save changes, and make them available to others
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSave', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanSaveRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Save Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Check D state
        let dashboardIndex: number = this.globalVariableService.currentDashboards.findIndex(
            d => d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        if (dashboardIndex >= 0) {
            if (this.globalVariableService.currentDashboards[dashboardIndex].state 
                != 'Draft') {
                    this.showMessage(
                        'Can only save a Dashboard with State Draft',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                    return;
            };
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardSave = true;
    }

    clickDashboardSaveAs() {
        // Save D AS (make a copy)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSaveAs', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanSaveRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Save Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Check D state
        let dashboardIndex: number = this.globalVariableService.currentDashboards.findIndex(
            d => d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        if (dashboardIndex >= 0) {
            if (this.globalVariableService.currentDashboards[dashboardIndex].state 
                != 'Complete') {
                    this.showMessage(
                        'Can only save a Dashboard with Complete Draft',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                    return;
            };
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardSaveAs = true;
    }

    clickDashboardExport() {
        // Export D as text file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardExport', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanSaveRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Save Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardExport = true;        
    }

    clickDashboardSnapshots() {
        // Make a Snapshot of a D and all related info, which can be restored at later stage
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSnapshots', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();
        this.showModalDashboardSnapshots = true;
    }

    clickDashboardRename() {
        // Bulk rename D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardRename', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardRename = true;
    }

    clickMenuDashboardDetailDescription() {
        // Show the modal form to edit Descriptive detail for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailDescription', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            console.warn('oi', d, this.globalVariableService.currentDashboardInfo.value.currentDashboardID)
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalDashboardDescription = true;
    }

    clickMenuDashboardDetailFavourite() {
        // Toggle Fav for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailFavourite', '@Start');

        this.menuOptionClickPreAction();

        let dashboardID: number = this.globalVariableService.currentDashboardInfo.value.
            currentDashboardID;
        let userID: string = this.globalVariableService.currentUser.userID;

        // Add for current User
        if (!this.showFavouriteDashboard) {
            this.globalVariableService.canvasUsers.forEach( u => {
                if (u.userID == userID) {
                    if (u.favouriteDashboards.indexOf(dashboardID) < 0) {
                        u.favouriteDashboards.push(dashboardID);
                    };
                };

            });
        } else {
            this.globalVariableService.canvasUsers.forEach( u => {
                if (u.userID == userID) {
                    if (u.favouriteDashboards.indexOf(dashboardID) >= 0) {
                        u.favouriteDashboards = u.favouriteDashboards.filter(f =>
                            f != dashboardID
                        );
                    };
                };

            });
        };

        // Toggle local D
        this.showFavouriteDashboard = !this.showFavouriteDashboard;

        // Toggle global D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                // d.is;
            };
        });
    }

    clickMenuDashboardDetailTags() {
        // Manage Tags for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTags', '@Start');

        this.menuOptionClickPreAction();

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalDashboardTags = true;
    }

    clickMenuDashboardDetailComments() {
        // Manage Comments for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailComments', '@Start');

        this.menuOptionClickPreAction();

        this.selectedWidgetID = -1;
        this.showModalDashboardComments = true;
    }

    clickMenuDashboardDetailDataQuality() {
        // Show the form of Data Quality Issues
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailDataQuality', '@Start');

        this.menuOptionClickPreAction();
        this.selectedDatasourceID = -1;
        this.showModalDashboardDataQuality = true;
    }

    clickMenuDashboardDetailTheme() {
        // Manage the Theme for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTheme', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardTheme = true;
    }

    clickMenuDashboardDetailTemplate() {
        // Manage Template for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTemplate', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardTemplate = true;
    }

    clickMenuDashboardSchedule() {
        // Manage Schedules for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardSchedule', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSchedule = true;
    }

    clickMenuDashboardScheduleEdit() {
        // Manage Schedules for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardScheduleEdit', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardScheduleEdit = true;
    }

    clickMenuDashboardPrint() {
        // Print the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardPrint', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardPrint = true;
    }

    clickMenuDashboardDelete() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDelete', '@Start');

        // Not for Draft
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardState ==
            'Draft') {
            this.showMessage(
                'Draft Dashboards cannot be deleted (use Discard menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanDeleteRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Delete Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            )) {
                this.showMessage(
                    'No access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardDelete = true;
    }

    clickMenuDashboardDeleteBulk() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDeleteBulk', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanDeleteRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Delete Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalDashboardDeleteBulk = true;
    }

    clickMenuDashboardTreeview() {
        // Show the current D as a Treeview
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardTreeview', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardTreeview = true;
    }

    clickMenuDashboardSubscribe() {
        // Manage Subscription to the current D, ie get notified when it changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardSubscribe', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSubscribe = true;
    }

    clickMenuDashboardUsageStats() {
        // Manage Subscription to the current D, ie get notified when it changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardUsageStats', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardUsageStats = true;
    }






    // ***********************  CLICK DATA MENU OPTIONS ************************ //
   
    clickMenuDataManagedConnection() {
        // SQL Query Builder, constructed by selecting Table and Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedConnection', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedConnection = true;
    }

    clickMenuDataManagedQueryBuilder() {
        // SQL Query Builder, constructed by selecting Table and Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedQueryBuilder', '@Start');

        this.menuOptionClickPreAction();
        this.selectedDatasource = null;
        this.showModalDataManagedQueryBuilder = true;
    }

    clickMenuDataManagedSQLEditor() {
        // SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedSQLEditor', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedSQLEditor = true;
    }

    clickMenuDataManagedGraphQLEditor() {
        // SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedGraphQLEditor', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedGraphQLEditor = true;
    }

    clickMenuDataManagedNoSQLEditor() {
        // No SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedNoSQLEditor', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedNoSQLEditor = true;
    }
    
    clickMenuDataManagedNeo4jEditor() {
        // Ne04j Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedNeo4jEditor', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedNeo4jEditor = true;
    }

    clickMenuDataManagedOverlayEditor() {
        // Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedOverlayEditor', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataManagedOverlayEditor = true;
    }
    
    clickMenuDataTransformation() {
        // Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataTransformation', '@Start');

        this.menuOptionClickPreAction();

        // let dataConnection: = ...
        // let dataTableID: = ...
        // let dataFields: = ...
        this.showModalDataTransformation = true;
    }
        
    clickMenuDataEditDatasource() {
        // Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataEditDatasource', '@Start');

        this.menuOptionClickPreAction();

        this.selectedDatasource = null;
        this.showModalDataEditDatasource = true;
    }

    clickMenuDatasourceOverview() {
        // Show an overview of a DS, ie data quality, fields, etc
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceOverview', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataOverview = true;
    }

    clickMenuDataCombinationAppend() {
        // Combine one or more existing DS by appending at end of first one
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataCombinationAppend', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCombinationAppend = true;
    }

    clickMenuDatasourceUsage() {
        // Show an Usage of a DS, ie data quality, fields, etc
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceUsage', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataUsage = true;
    }

    clickMenuDatasourceScheduleEdit() {
        // Edit Schedule for DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceScheduleEdit', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataScheduleEdit = true;
    }

    clickMenuDatasourceSchedule() {
        // Show DS Schedules
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceSchedule', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataSchedule = true;
    }

    clickMenuDatasourceRefreshOnce() {
        // Refresh selected DS Once off
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceRefreshOnce', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataRefreshOnce = true;
    }    

    clickMenuDatasourceRefreshRepeat() {
        // Refresh selected DS Repeat off
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDatasourceRefreshRepeat', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataRefreshRepeat = true;
    }    

    clickMenuDataDirectFileCSV() {
        // Open form to create a DS with data that comes from a CSV file.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectFileCSV', '@Start');

        this.menuOptionClickPreAction();
        
        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileCSV = true;
    }

    clickMenuDataDirectFileJSON() {
        // Open form to create a DS with data that comes from a JSON file.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectFileJSON', '@Start');

        this.menuOptionClickPreAction();
        
        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileJSON = true;
    }

    clickMenuDataDirectFileSpreadsheet() {
        // Open form to create a DS with data that comes from a Spreadsheet.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectFileSpreadsheet', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileSpreadsheet = true;
    }

    clickMenuDataDirectGoogleSheets() {
        // Open form to create a DS with data that comes from a Google Sheets Spreadsheet.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectGoogleSheets', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectGoogleSheets = true;
    }

    clickMenuDataDirectQueryBuilder() {
        // Open DATA form for a DS that comes from a QueryBuilder.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectQueryBuilder', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectQueryBuilder = true;
    }

    clickMenuDataDirectSQLEditor() {
        // Open DATA form for a DS that comes from a SQL using SQL statements.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectSQLEditor', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectSQLEditor = true;
    }

    clickMenuDataDirectNoSQL() {
        // Open DATA form for a DS that comes from a NoSQL.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectNoSQL', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectNoSQL = true;
    }

    clickMenuDataDirectService() {
        // Open DATA form for a DS that comes from a Service.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectService', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectService = true;
    }

    clickMenuDataDirectWeb() {
        // Open DATA form for a DS that comes from a Web page.
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectWeb', '@Start');

        this.menuOptionClickPreAction();

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectWeb = true;
    }

    clickMenuDataDirectImport() {
        // Import a DS from an external file (json format)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectImport', '@Start');

        this.showModalDataDirectImport = true;
    }

    clickMenuDataDirectExport() {
        // Export a DS to an external file (json format)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDirectExport', '@Start');

        this.showModalDataDirectExport = true;
    }

    clickMenuDataManagedDataQuality(){
        // Manage Data Quality Issues for a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedDataQuality', '@Start');

        this.menuOptionClickPreAction();

        this.showModalManagedDataDataQuality = true;

    }

    clickMenuDataManagedDataDictionary(){
        // Manage Dictionary for a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedDataDictionary', '@Start');

        this.menuOptionClickPreAction();

        this.showModalManagedDataDataDictionary = true;

    }
    
    clickMenuDataManagedDataOwnership(){
        // Manage Ownership for a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataManagedDataOwnership', '@Start');

        this.menuOptionClickPreAction();

        this.showModalManagedDataOwnership = true;

    }

    clickMenuDataBussGlossary(){
        // Manage Dictionary for a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataBussGlossary', '@Start');

        this.menuOptionClickPreAction();

        this.showModalManageBussGlossary = true;

    }

    clickMenuDataCombinations(joinType: string){
        // Manage combinations of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataCombinations', '@Start');

        this.combinationType = joinType;

        this.menuOptionClickPreAction();

        this.showModalDataCombination = true;
    }

    clickMenuDataShare() {
        // Manage sharing access to DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataShare', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataShare = true;
    }

    clickMenuDataDictionary() {
        // Shows Data Dictionary
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDictionary', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataDictionary = true;
    }
    
    clickMenuBusinessGlossary() {
        // Shows Data Dictionary
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuBusinessGlossary', '@Start');

        this.menuOptionClickPreAction();

        this.showModalBusinessGlossary = true;
    }

    clickMenuDataSummary() {
        // Shows Data Summary
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataSummary', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataSummary = true;
    }

    clickMenuDataDeleteDatasource() {
        // Shows form to Delete Datasources
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataDeleteDatasource', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataDeleteDatasource = true;
    }




    // ***********************  CLICK WIDGET MENU OPTIONS ************************ //

    clickMenuWidgetNew() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetNew', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        // Reset position if not dragged.
        if (!this.paletteDrag) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        } else {
            this.paletteDrag = false;
        };

        // Indicate new W and open Editor
        this.newWidget = true;
        this.showDatasourcePopup = true;
        this.canSave = true;
        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetEdit(
        widgetID: number = null,
        widgetIndex: number = null,
        canSave: boolean = true) {
        // Open W Editor
        //  widgetID - optional W-ID to open, does not depend on what was selected
        //  widgetIndex - optional [W] index to open, does not depend on what was selected
        //  canSave - if Saving is allowed in W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetEdit', '@Start');

        // Permissions
        if (canSave) {
            if (!this.globalVariableService.currentUser.dashboardCanEditRole
                &&
                !this.globalVariableService.currentUser.isAdministrator) {
                this.showMessage(
                    'You do not have Edit Permissions (role must be added)',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
            };

            // Must have access to this D
            if (!this.globalVariableService.dashboardPermissionCheck(
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                'CanEdit')) {
                    this.showMessage(
                        'No Edit access to this Dashboard',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                    return;
            };

            // Has to be in editMode
            if (!this.editMode) {
                this.showMessage(
                    this.globalVariableService.canvasSettings.notInEditModeMsg,
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
            };
        };

        // Indicate edit W and open Editor, which will work with selected W
        if (widgetIndex == null) {


            if (widgetID == null) {

                // Can only edit one W at a time, so ignore if multiple selected
                if (!this.checkForOnlyOneWidget()) {
                    return
                };
                if (!this.checkForOnlyOneWidget('Graph')) {
                    return
                };

                this.currentWidgets.forEach(w => {
                    if (w.isSelected  &&  w.widgetType == 'Graph') {
                        this.selectedWidget = w;
                    };
                });
                            
            } else {
                let widgetIndex: number = this.currentWidgets.findIndex(w => w.id == widgetID);
                if (widgetIndex < 0) {
                    this.showMessage(
                        'Widget does not exist in list',
                        'StatusBar',
                        'Error',
                        3000,
                        ''
                    );
        
                } else {
                    this.selectedWidget = this.currentWidgets[widgetIndex];
                }
            };
            
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        // Check if Locked - after id is obtained
        if (canSave) {
            if (this.selectedWidget.isLocked) {
                this.showMessage(
                    'Widget is locked (unlock using menu option)',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
            };
        };

        this.menuOptionClickPreAction();

        this.newWidget = false;
        this.newWidgetContainerLeft = 0;
        this.newWidgetContainerTop = 0;
        this.showDatasourcePopup = false;
        this.canSave = canSave;

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetContainer(widgetType: string) {
        // Show popup to edit Widget Container properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetContainer', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget(widgetType)) {
            return
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == widgetType) {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetContainer = true;
    }

    clickMenuWidgetCheckpoints(selectedWidgetID: number = null) {
        // Manage Checkpoints for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCheckpoints', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Check exactly one W selected if no specific ID was given
        if (selectedWidgetID == null) {

            if (!this.checkForOnlyOneWidget()) {
                return
            };

            if (!this.checkForOnlyOneWidget('Graph')) {
                return
            };
        };

        this.menuOptionClickPreAction();

        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  (selectedWidgetID == null)
                ||
                (w.id == selectedWidgetID   &&  (selectedWidgetID != null) )
                ) {
                this.selectedWidget = w;
            };
        })

        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetAnnotations(selectedWidgetID: number = null) {
        // Manage Annotations for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetAnnotations', '@Start');

        // Check exactly one W selected if no specific ID was given
        if (selectedWidgetID == null) {

            if (!this.checkForOnlyOneWidget()) {
                return
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return
            };
        }

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        this.menuOptionClickPreAction();

        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  (selectedWidgetID == null)
               ||
               (w.id == selectedWidgetID   &&  (selectedWidgetID != null) )
               ) {
                this.selectedWidget = w;
            };
        })

        this.showModalWidgetAnnotations = true;

    }

    clickMenuWidgetComments() {
        // Manage comments for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        this.menuOptionClickPreAction();

        // Set the selected W id
        this.selectedWidgetID = -1;
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetID = w.id;
            }
        })

        this.showModalDashboardComments = true;

    }

    clickMenuWidgetDataQuality() {
        // Show the form of Data Quality Issues for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        this.menuOptionClickPreAction();

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedDatasourceID = w.datasourceID;
            };
        });
        this.showModalDashboardDataQuality = true;
    }

    clickMenuWidgetDataDictionary(widgetIndex: number = null) {
        // Show the form of Data Dictionary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDataDictionary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.menuOptionClickPreAction();

        this.showModalDataDictionary = true;
    }

    clickMenuWidgetBusinessGlossary(widgetIndex: number = null) {
        // Show the form of Data Dictionary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetBusinessGlossary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.menuOptionClickPreAction();

        this.showModalBusinessGlossary = true;
    }


    clickMenuWidgetDataSummary(widgetIndex: number = null) {
        // Show the form of Data Summary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDataSummary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.menuOptionClickPreAction();

        this.showModalDataSummary = true;
    }

    clickMenuWidgetFullScreen(widgetIndex: number = null) {
        // Show the selected W in full screen
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetFullScreen', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.menuOptionClickPreAction();

        this.showWidgetFullScreen = true;
        this.showWidgetFullScreenWidth = 98;
        this.showWidgetFullScreenHeight = 98;
        this.showWidgetFullScreenBorder = '1px solid black';
        this.showWidgetFullScreenX = 'X';
        this.showWidgetFullScreenCopy = 'Copy Image';

        let localWidget = Object.assign({}, this.selectedWidget);

        // Rescale and limit amount of detail on the graph
        localWidget.containerLeft = 50;
        localWidget.containerTop = 50;
        localWidget.containerHeight = 530;
        localWidget.graphHeight = 500;
        localWidget.containerWidth = 600;
        localWidget.graphWidth = 550;
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';

        let definition = this.globalVariableService.createVegaLiteSpec(localWidget);

        let specification = compile(definition).spec;
        this.view = new View(parse(specification));

        this.view.renderer('svg')
            .initialize(this.widgetFullDOM.nativeElement)
            .hover()
            .run()
            .finalize();
    }

    clickMenuWidgetLinks() {
        // Add links to the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetLinks = true;
    }

    clickMenuWidgetRefresh() {
        // Refresh the DS for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetRefresh', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.canvasSettings.noQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuGraphDuplicate() {
        // Duplicate selected Graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuGraphDuplicate', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        this.clickMenuWidgetDuplicate('Graph')
    }

    clickMenuWidgetLockUnlock() {
        // Toggle Lock / Unlock for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLockUnlock', '@Start');

        // Check permissions
        let permissions: string[] = this.globalVariableService.dashboardPermissionList(this.globalVariableService.currentDashboardInfo.value.currentDashboardID);
        if ( (permissions.indexOf('canedit') < 0)
              ||
              (permissions.indexOf('candelete)') < 0) ) {
            this.showMessage(
                'Insufficient permissions',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                w.isLocked = !w.isLocked;
                this.globalVariableService.saveWidget(w);
            };
        });

        this.menuOptionClickPostAction;
    }

    clickMenuWidgetCopy() {
        // Copy selected Widget to our 'clipboard'
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCopy', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {
                this.clipboardWidget = Object.assign({}, w);

                this.showMessage(
                    'Widget copied',
                    'StatusBar',
                    'Info',
                    3000,
                    ''
                );

            };
        });

        this.menuOptionClickPostAction();
    }

    clickMenuWidgetPaste() {
        // Paste Widget previously copied to our 'clipboard'
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetPaste', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (this.clipboardWidget == null  ||  this.clipboardWidget == undefined) {
            this.showMessage(
                'Nothing copied previously',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (this.clipboardWidget.dashboardID != this.globalVariableService.
            currentDashboardInfo.value.currentDashboardID) {
            this.showMessage(
                'Copied from a different Dashboard',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;

        };

        this.menuOptionClickPreAction();

        this.clipboardWidget.dashboardTabID = this.globalVariableService.
            currentDashboardInfo.value.currentDashboardTabID;
        this.clipboardWidget.shapeTextDisplay = this.globalVariableService
            .calcShapeTextDisplay(this.clipboardWidget.shapeText);
        this.globalVariableService.duplicateSingleWidget(this.clipboardWidget);

        this.menuOptionClickPostAction();
    }

    clickMenuWidgetExpand() {
        // Expands the underlying data for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectWidgetIndex = w.id;
                this.selectDatasetID = w.datasetID;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuWidgetExport() {
        // Export the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetExport = true;
    }

    clickMenuWidgetDelete() {
        // Delete the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDelete', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        this.menuOptionClickPreAction();
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });

        // Check if Locked
        if (this.selectedWidget.isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalWidgetDelete = true;
    }





    // ***********************  CLICK TABLE MENU OPTIONS ************************ //

    clickMenuTableAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableAdd', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.newWidget = true;
        this.showDatasourcePopup = true;

        this.showModalTableEditor = true;

    }

    clickMenuTableEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edits the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableEdit', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (widgetID == null) {
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Table')) {
                return;
            };
   
        } else {
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id == widgetID);
            if (widgetIndex < 0) {
                this.showMessage(
                    'Widget does not exist in list',
                    'StatusBar',
                    'Error',
                    3000,
                    ''
                );
    
            } else {
                this.selectedWidget = this.currentWidgets[widgetIndex];
            }
        };

        this.menuOptionClickPreAction();

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Table') {
                this.selectedWidget = w;
            };
        });

        this.showDatasourcePopup = false;
        this.showModalTableEditor = true;
    }

    clickMenuTableComments() {
        // Manage Comments for selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set the selected W id
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetID = w.id;
            }
        })

        this.showModalDashboardComments = true;

    }

    clickMenuTableDataQuality() {
        // Show the form of Data Quality Issues for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedDatasourceID = w.datasourceID;
            }
        })
        this.showModalDashboardDataQuality = true;
    }

    clickMenuTableExpand() {
        // Expand DS u-sed in table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectWidgetIndex = w.id;
                this.selectDatasetID = w.datasetID;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuTableExport() {
        // Export the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetExport = true;
    }

    clickMenuTableDelete() {
        // Delete selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableDelete', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Table') {
                this.selectedWidget = w;
            };
        });

        // Check if Locked
        if (this.selectedWidget.isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalTableDelete = true;

    }




    // ***********************  CLICK SLICER MENU OPTIONS ************************ //

    clickMenuSlicerAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerAdd', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        this.newWidget = true;

        this.showModalSlicerEditor = true;

    }

    clickMenuSlicerEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edits the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerEdit', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (widgetID == null) {
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Slicer')) {
                return;
            };
                
        } else {
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id == widgetID);
            if (widgetIndex < 0) {
                this.showMessage(
                    'Widget does not exist in list',
                    'StatusBar',
                    'Error',
                    3000,
                    ''
                );
    
            } else {
                this.selectedWidget = this.currentWidgets[widgetIndex];
            }
        };

        this.menuOptionClickPreAction();

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Slicer') {
                this.selectedWidget = w;
            };
        });

        this.showModalSlicerEditor = true;
    }

    clickMenuWidgetTablist() {
        // Open the list of tabs to which the selected W belongs
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetTablist', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        // Send list of current Tabs it belongs to
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.currentWidgetDashboardTabIDs = w.dashboardTabIDs;
            }
        });

        this.showModalWidgetTablist = true;

    }

    clickMenuWidgetDescription(
        widgetID: number = null,
        widgetIndex: number = null
        ) {
        // Open the W Description form
        //  widgetID - optional W-ID to open, does not depend on what was selected
        //  widgetIndex - optional [W] index to open, does not depend on what was selected
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDescription', '@Start');

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Indicate edit W and open Editor, which will work with selected W
        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.showModalWidgetDescription = true;
    }

    clickMenuSlicerComments() {
        // Manage comments for the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set the selected W id
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetID = w.id;
            }
        })

        this.showModalDashboardComments = true;

    }

    clickMenuSlicerDataQuality() {
        // Show the form of Data Quality Issues for selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedDatasourceID = w.datasourceID;
            }
        })
        this.showModalDashboardDataQuality = true;
    }

    clickMenuSlicerExpand() {
        // Expands underlying data for the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectWidgetIndex = w.id;
                this.selectDatasetID = w.datasetID;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuSlicerExport() {
        // Exports the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetExport = true;
    }

    clickMenuSlicerDelete() {
        // Delete the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerDelete', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Slicer') {
                this.selectedWidget = w;
            };
        });

        // Check if Locked
        if (this.selectedWidget.isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalSlicerDelete = true;

    }





    // ***********************  CLICK SHAPE MENU OPTIONS ************************ //

    clickMenuShapeNew() {
        // Add a new Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeNew', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        this.menuOptionClickPreAction();

        this.newWidget = true;
        this.showModalShapeEdit = true;
    }

    clickMenuShapeEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edit selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeEdit', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Make sure we have only one, then delete it
        if (widgetID == null) {

            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Shape')) {
                return;
            };

            this.newWidget = false;
            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == 'Shape') {
                    this.selectedWidget = w;
                };
            });
                
        } else {
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id == widgetID);
            if (widgetIndex < 0) {
                this.showMessage(
                    'Widget does not exist in list',
                    'StatusBar',
                    'Error',
                    3000,
                    ''
                );
    
            } else {
                this.selectedWidget = this.currentWidgets[widgetIndex];
            }
        };
        
        this.menuOptionClickPreAction();

        // Check if Locked
        if (this.selectedWidget.isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalShapeEdit = true;
    }

    clickMenuShapeComments() {
        // Manage comments for the selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeComments', '@Start');


        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set the selected W id
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetID = w.id;
            }
        })

        this.showModalDashboardComments = true;

    }
    clickMenuShapeLinks() {
        // Manage links for the selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeLinks', '@Start');

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return;
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetLinks = true;
    }

    clickMenuShapeDelete() {
        // Delete a Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeDelete', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.dashboardCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You do not have Edit Permissions (role must be added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Must have access to this D
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanEdit')) {
                this.showMessage(
                    'No Edit access to this Dashboard',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return;
        };

        this.menuOptionClickPreAction();

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Shape') {
                this.selectedWidget = w;
            };
        });

        // Check if Locked
        if (this.selectedWidget.isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalShapeDelete = true;
    }





    // ***********************  CLICK VIEW MENU OPTIONS ************************ //

    clickMenuViewHideMenu() {
        // Hides menu
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewHideMenu', '@Start');

        this.menuOptionClickPreAction();

        // Settings, ie Mode
        this.showMainMenu = false;

        this.menuOptionClickPostAction();
    }

    clickMenuViewPrintPreview(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPrintPreview', '@Start');

        this.menuOptionClickPreAction();

        this.menuOptionClickPostAction();
    }

    clickMenuViewShowPalette() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowPalette', '@Start');

        this.menuOptionClickPreAction();

        this.globalVariableService.showPalette.next(!this.showPalette);

        this.menuOptionClickPostAction();
    }

    clickMenuViewShowGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.menuOptionClickPreAction();

        this.globalVariableService.showGrid.next(!this.showGrid);

        this.menuOptionClickPostAction();
    }

    clickMenuViewSnapToGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewSnapToGrid', '@Start');

        this.menuOptionClickPreAction();

        this.snapToGrid = !this.snapToGrid;
        this.globalVariableService.canvasSettings.snapToGrid = this.snapToGrid;
        this.menuOptionClickPostAction();
    }

    clickMenuViewZoom(zoomPercentage: number): string {
        // Zoom Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewZoom', '@Start');

        this.menuOptionClickPreAction();

        if (zoomPercentage == null  ||  zoomPercentage == undefined) {
            zoomPercentage = 0.6;
        }

        this.zoomFactor = 'scale(' + zoomPercentage.toString() + ')';

        this.menuOptionClickPostAction();
        return this.zoomFactor;
    }





    // ***********************  CLICK ARRANGE MENU OPTIONS ************************ //

    clickMenuArrangeBackward() {
        // Decrease z-index of selected Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBackward', '@Start');

        this.menuOptionClickPreAction();

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex = Math.max(
                    this.globalVariableService.canvasSettings.widgetsMinZindex,
                    this.currentWidgets[i].containerZindex - 1
                );

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeForward() {
        // Increase z-index of selected Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeForward', '@Start');

        this.menuOptionClickPreAction();

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex = Math.min(
                    this.globalVariableService.canvasSettings.widgetsMaxZindex,
                    this.currentWidgets[i].containerZindex + 1
                );

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeBack() {
        /// Move selected Ws to the lowest z-index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBack', '@Start');

        this.menuOptionClickPreAction();

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex =
                    this.globalVariableService.canvasSettings.widgetsMinZindex;

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeFront() {
        // Move selected Ws to the highest z-index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeFront', '@Start');

        this.menuOptionClickPreAction();

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex =
                    this.globalVariableService.canvasSettings.widgetsMaxZindex;

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeAlignLeft() {
        // Align the lefts of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignLeft', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerLeft;
                } else {
                    this.currentWidgets[i].containerLeft = x;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenter() {
        // Align the centers of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenter', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerLeft +
                        (this.currentWidgets[i].containerWidth / 2);
                } else {
                    this.currentWidgets[i].containerLeft = x -
                        (this.currentWidgets[i].containerWidth / 2);
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignRight() {
        // Align the Rights of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignRight', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerLeft +
                        this.currentWidgets[i].containerWidth;
                } else {
                    this.currentWidgets[i].containerLeft = x -
                        this.currentWidgets[i].containerWidth;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignTop() {
        // Align the tops of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignTop', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerTop;
                } else {
                    this.currentWidgets[i].containerTop = x;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignMiddle() {
        // Align the Middles of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignMiddle', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerTop +
                        (this.currentWidgets[i].containerHeight / 2);
                } else {
                    this.currentWidgets[i].containerTop = x -
                        (this.currentWidgets[i].containerHeight / 2);
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignBottom() {
        // Align the Bottoms of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignBottom', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerTop +
                        (this.currentWidgets[i].containerHeight);
                } else {
                    this.currentWidgets[i].containerTop = x -
                        (this.currentWidgets[i].containerHeight);
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenterHorisontally() {
        // Center horisontally across page
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterHorisontally', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = window.innerWidth / 2;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerLeft = x -
                    (this.currentWidgets[i].containerWidth / 2);
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]);
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenterVertically() {
        // Center vertically across page
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterVertically', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = window.innerHeight / 2;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerTop = x -
                    (this.currentWidgets[i].containerHeight / 2);
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]);
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeGroup() {
        // Groups the selected Widgets into a single group
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeGroup', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        // Clear, and add
        this.widgetGroup = [];
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.widgetGroup.push(w.id);
            }
        });

        // Inform others
        this.globalVariableService.widgetGroup.next(this.widgetGroup)

        // Tell the user
        this.showMessage(
            'New group of ' + this.widgetGroup.length.toString() + ' widgets',
            'StatusBar',
            'Info',
            3000,
            ''
        );

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeUnGroup() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeUnGroup', '@Start');

        this.menuOptionClickPreAction();

        // Clear
        this.widgetGroup = [];

        // Inform others
        this.globalVariableService.widgetGroup.next(this.widgetGroup)

        // Tell the user
        this.showMessage(
            'Group cleared ',
            'StatusBar',
            'Info',
            3000,
            ''
        );

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeDistributeHorisontal() {
        // Equally distribute the selected Ws horisontally.
        // Assume the selected Ws are W1 (first), W2, ..., Wn (last)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeHorisontal', '@Start');

        // Get selected, sorted by .left  = [Wi]
        let selectedOnes = [];
        for (var i = 0; i < (this.currentWidgets.length); i++) {
            if (this.currentWidgets[i].isSelected) {
                selectedOnes.push({
                    position: i,
                    id: this.currentWidgets[i].id,
                    height: this.currentWidgets[i].containerHeight,
                    width: this.currentWidgets[i].containerWidth,
                    left: this.currentWidgets[i].containerLeft,
                    newLeft: this.currentWidgets[i].containerLeft,
                    top: this.currentWidgets[i].containerTop,
                    newTop: this.currentWidgets[i].containerTop
                });
            }
        };

        // Ensure we have selected > 2, else we may have divid 0 ...
        if (selectedOnes.length < 3) {
            this.showMessage(
                'Select at least 2 ',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;
        }

        this.menuOptionClickPreAction();

        selectedOnes.sort( (obj1,obj2) => {
            if (obj1.left > obj2.left) {
                return 1;
            };
            if (obj1.left < obj2.left) {
                return -1;
            };
            return 0;
        });

        // Count number with spaces: x  =  nr selected -1  =  [Wi].length - 1
        let x: number = selectedOnes.length - 1;

        // Calc d  =  distance between left- and right-most  =  (Wn.left - W1.left)
        let d: number = selectedOnes[selectedOnes.length - 1].left - selectedOnes[0].left;

        // Calc f  =  filled space  =  SUM(Wi.width), 1<n
        let f: number = 0;
        for (var i = 0; i < (selectedOnes.length - 1); i++) {
            f = f + selectedOnes[i].width;
        };

        // Calc gap between each: g  =  (open space) / nr spaces  =  (d - f) / x
        let g: number = (d - f) / x;

        // Adjust the middle Ws (W1 and Wn remains unchanged): Wi = loop (i = 2,.., n-1)
        // Wi.left = W(i-1).left + W(i-1).width + g
        for (var i = 0; i < (selectedOnes.length - 1); i++) {
            if (i > 0) {
                selectedOnes[i].newLeft = selectedOnes[i-1].newLeft +
                    selectedOnes[i-1].width + g;
                this.currentWidgets[selectedOnes[i].position].containerLeft =
                    selectedOnes[i].newLeft;
                this.globalVariableService.currentWidgets[selectedOnes[i].position].
                    containerLeft = selectedOnes[i].newLeft;
            } else {
                selectedOnes[i].newLeft = selectedOnes[i].newLeft;
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]);
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeDistributeVertical() {
        // Vertically arrange selected Ws, equally spaced
        // Assume the selected Ws are W1 (first), W2, ..., Wn (last)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeVertical', '@Start');

        // Get selected, sorted by .top  = [Wi]
        let selectedOnes = [];
        for (var i = 0; i < (this.currentWidgets.length); i++) {
            if (this.currentWidgets[i].isSelected) {
                selectedOnes.push({
                    position: i,
                    id: this.currentWidgets[i].id,
                    height: this.currentWidgets[i].containerHeight,
                    width: this.currentWidgets[i].containerWidth,
                    left: this.currentWidgets[i].containerLeft,
                    newLeft: this.currentWidgets[i].containerLeft,
                    top: this.currentWidgets[i].containerTop,
                    newTop: this.currentWidgets[i].containerTop
                });
            }
        };

        // Ensure we have selected > 2, else we may have divid 0 ...
        if (selectedOnes.length < 3) {
            this.showMessage(
                'Select at least 2 ',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;
        }

        this.menuOptionClickPreAction();

        selectedOnes.sort( (obj1,obj2) => {
            if (obj1.top > obj2.top) {
                return 1;
            };
            if (obj1.top < obj2.top) {
                return -1;
            };
            return 0;
        });

        // Count number with spaces: x  =  nr selected -1  =  [Wi].length - 1
        let x: number = selectedOnes.length - 1;

        // Calc d  =  distance between top- and lower-most  =  (Wn.top - W1.top)
        let d: number = selectedOnes[selectedOnes.length - 1].top - selectedOnes[0].top;

        // Calc f  =  filled space  =  SUM(Wi.height), 1<n
        let f: number = 0;
        for (var i = 0; i < (selectedOnes.length - 1); i++) {
            f = f + selectedOnes[i].height;
        };

        // Calc gap between each: g  =  (open space) / nr spaces  =  (d - f) / x
        let g: number = (d - f) / x;


        // Adjust the middle Ws (W1 and Wn remains unchanged): Wi = loop (i = 2,.., n-1)
        // Wi.top = W(i-1).top + W(i-1).heigth + g
        for (var i = 0; i < (selectedOnes.length - 1); i++) {
            if (i > 0) {
                selectedOnes[i].newTop = selectedOnes[i-1].newTop +
                    selectedOnes[i-1].height + g;
                this.currentWidgets[selectedOnes[i].position].containerTop =
                    selectedOnes[i].newTop;
                this.globalVariableService.currentWidgets[selectedOnes[i].position].
                    containerTop = selectedOnes[i].newTop;
            } else {
                selectedOnes[i].newTop = selectedOnes[i].newTop;
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]);
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeSameSize() {
        // Make selected Ws same size, height and width
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;
        let y: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerWidth;
                    y = this.currentWidgets[i].containerHeight;

                } else {
                    this.currentWidgets[i].containerWidth = x;
                    this.currentWidgets[i].containerHeight = y;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeSameSizeVertically() {
        // Make selected Ws same Height (vertically)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let y: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (y == -1) {
                    y = this.currentWidgets[i].containerHeight;

                } else {
                    this.currentWidgets[i].containerHeight = y;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeSameSizeHorisontally() {
        // Make selected Ws same width (horisontally)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        this.menuOptionClickPreAction();

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerWidth;

                } else {
                    this.currentWidgets[i].containerWidth = x;
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }





    // ***********************  CLICK HELP MENU OPTIONS ************************ //

    clickMenuHelpDemo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuHelpDemo', '@Start');

        this.menuOptionClickPreAction();

        this.router.navigate(['/help']);

        this.menuOptionClickPostAction();
    }





    // ***********************  CLICK COLLABORATE MENU OPTIONS ************************ //

    clickMenuCollaborateAuditTrail() {
        // Show list of Canvas AuditTrail
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateAuditTrail', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateAuditTrail = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateMessages() {
        // Show list of Canvas Messages
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateMessages', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateMessages = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateTasks() {
        // Show list of Canvas Tasks
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateTasks', '@Start');

        this.menuOptionClickPreAction();

        // this.showModalCollaborateActivities = true;
        this.showModalCollaborateTasks = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateTaskAdd() {
        // Add a new Task
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateTaskAdd', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateTasksNew = true;

        this.menuOptionClickPostAction();
    }

    clickMenuViewDontDisturb() {
        // Toggle Dont Disturb
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewDontDisturb', '@Start');

        this.menuOptionClickPreAction();

        this.dontDisturb = !this.globalVariableService.dontDisturb.value;
        this.globalVariableService.dontDisturb.next(
            !this.globalVariableService.dontDisturb.value);

        this.menuOptionClickPostAction();
    }

    clickMenuViewSystemMessages() {
        // Toggle Dont Disturb
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewSystemMessages', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateSystemMessages = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateSendMessageAdd() {
        // Send a Canvas Message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateSendMessage', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateSendMessage = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateSendEmailAdd() {
        // Send an Email
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateSendEmail', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateSendEmail = true;

        this.menuOptionClickPostAction();
    }



    // ***********************  CLICK USER MENU OPTIONS ************************ //

    clickMenuUserLogin() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserLogin', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardLogin = true;
    }


    clickMenuUserMyProfile() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserMyProfile', '@Start');

        this.menuOptionClickPreAction();

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalUserMyProfile = true;
    }

    clickMenuUserPreferences() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserPreferences', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserPreferences = true;
    }

    clickMenuUserMyPermissions() {
        // Show My Permissions form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserMyPermissions', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserMyPermissions = true;
    }

    clickMenuUserPaletteButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserPaletteButtonBar', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserPaletteButtonBar = true;
    }

    clickMenuUsers() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUsers', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUsers = true;
    }

    clickMenuGroups() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuGroups', '@Start');

        this.menuOptionClickPreAction();

        this.showModalGroups = true;
    }

    clickMenuUserSystemSettings() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserSystemSettings', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserSystemSettings = true;
    }

    clickMenuUserLogout() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserLogout', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardLogout = true;
    }





    // ***********************  CLICK PALETTE (specific) MENU OPTIONS ************************ //
    clickMenuPaletteEdit(
        widgetID: number = null, 
        widgetIndex: number = null, 
        canSave: boolean = true,
        widgetType: string = '') {
        // Clicked the Edit option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteEdit', '@Start');

        // Graph type has been supplied
        if (widgetType == 'Graph') {
            this.clickMenuWidgetEdit(widgetID);
            return;
        };
        if (widgetType == 'Slicer') {
            this.clickMenuSlicerEdit(widgetID);
            return;
        };
        if (widgetType == 'Table') {
            this.clickMenuTableEdit(widgetID);
            return;
        };
        if (widgetType == 'Shape') {
            this.clickMenuShapeEdit(widgetID);
            return;
        };
        if (widgetType == '') {
            // Decide which way
            if (this.checkForOnlyOneWidget('Graph', true)) {
                this.clickMenuWidgetEdit();
            } else {
                if (this.checkForOnlyOneWidget('Slicer', true)) {
                    this.clickMenuSlicerEdit();
                } else {
                    if (this.checkForOnlyOneWidget('Table', true)) {
                        this.clickMenuTableEdit();
                    } else {
                        if (this.checkForOnlyOneWidget('Shape', true)) {
                            this.clickMenuShapeEdit();
                        } else {
                            // Lost
                            this.showMessage(
                                'Select a single graph, slicer, table or shape',
                                'StatusBar',
                                'Warning',
                                3000,
                                ''
                            );
                        };
                    };
                };
            };
        };
    }

    clickMenuPaletteExpand() {
        // Clicked the Edit option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteExpand', '@Start');

        // Decide which way
        if (this.checkForOnlyOneWidget('Graph', true)) {
            this.clickMenuWidgetExpand();
        } else {
            if (this.checkForOnlyOneWidget('Table', true)) {
                this.clickMenuTableExpand();
            } else {
                if (this.checkForOnlyOneWidget('Slicer', true)) {
                    this.clickMenuSlicerExpand();
                } else {
                    // Lost
                    this.showMessage(
                        'Select a graph or slicer',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                };
            };
        };

    }

    clickMenuPaletteDelete() {
        // Clicked the Edit option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteDelete', '@Start');

        // Decide which way
        if (this.checkForOnlyOneWidget('Graph', true)) {
            this.clickMenuWidgetDelete();
        } else {
            if (this.checkForOnlyOneWidget('Slicer', true)) {
                this.clickMenuSlicerDelete();
            } else {
                if (this.checkForOnlyOneWidget('Table', true)) {
                    this.clickMenuTableDelete();
                } else {
                    if (this.checkForOnlyOneWidget('Shape', true)) {
                        this.clickMenuShapeDelete();
                    } else {
                        // Lost
                        this.showMessage(
                            'Select a graph, slicer, table or shape',
                            'StatusBar',
                            'Warning',
                            3000,
                            ''
                        );
                    };
                };
            };
        };
    }

    clickMenuPaletteDuplicate() {
        // Clicked the Duplicate option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteDuplicate', '@Start');

        // Decide which way
        if (this.checkForOnlyOneWidget('Graph', true)) {
            this.clickMenuWidgetDuplicate('Graph');
        } else {
            if (this.checkForOnlyOneWidget('Slicer', true)) {
                this.clickMenuWidgetDuplicate('Slicer');
            } else {
                if (this.checkForOnlyOneWidget('Table', true)) {
                    this.clickMenuWidgetDuplicate('Table');
                } else {
                    if (this.checkForOnlyOneWidget('Shape', true)) {
                        this.clickMenuWidgetDuplicate('Shape');
                    } else {
                        // Lost
                        this.showMessage(
                            'Select a graph, slicer, table or shape',
                            'StatusBar',
                            'Warning',
                            3000,
                            ''
                        );
                    };
                };
            };
        };
    }

    clickMenuPaletteWidgetTitle() {
        // Edit Title of selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteWidgetTitle', '@Start');

        // Only one can be selected
        if (!this.checkForOnlyOneWidget()) {
            this.clickMenuWidgetDuplicate('Graph');
        }

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidget = w;
            };
        });

        this.showTitleForm = true;
    }
    



    // ***********************  CONTEXT MENUS  ************************ //

    contextMenuOpen() {
        // Open context / dropdown Menu from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextMenuOpen', '@Start');

        // // Must be first, else default behaviour takes over
        // ev.preventDefault();

        this.showWidgetContextMenu = true;
    }

    contextmenuWidgetAnnotations(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Annotations from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetAnnotations', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetAnnotations(id);

    }

    contextmenuWidgetMessages(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Messages from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetMessages', '@Start');

        // Call the function
        this.clickMenuCollaborateMessages();

    }

    contextmenuWidgetCheckpoints(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Checkpoints from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetCheckpoints', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetCheckpoints(id);

    }

    contextmenuWidgetChanges(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Changes from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetChanges', '@Start');

        // Call the function
        this.clickMenuCollaborateAuditTrail();

    }

    contextmenuWidgetShare(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Share from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetShare', '@Start');

        // Call the function
        this.clickDashboardShare();

    }

    contextmenuWidgetDataSummary(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Summary from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetDataSummary', '@Start');

        this.clickMenuWidgetDataSummary(index);

    }

    contextmenuWidgetDataQuality(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Quality from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetDataQuality', '@Start');

        // Call the function
        // this.clickMenuDashboardDetailDataQuality();

        this.menuOptionClickPreAction();

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.id == id) {
                this.selectedDatasourceID = w.datasourceID;
            };
        });
        this.showModalDashboardDataQuality = true;

    }

    contextmenuWidgetDataDictionary(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Dictionary, of the DS linked to current
        // W, from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetDataDictionary', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetDataDictionary(index);

    }

    contextmenuWidgetUsageStats(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Summary from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetUsageStats', '@Start');

        this.clickMenuDashboardUsageStats();

    }





    // ***********************  WIDGET ACTION MENU  ************************ //

    actionmenuWidgetEditor(ev: MouseEvent, index: number, id: number) {
        // Opens W Editor, for editing
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetEditor', '@Start');

        this.clickMenuWidgetEdit(id, index, true);
    }

    actionmenuWidgetExplore(ev: MouseEvent, index: number, id: number) {
        // Opens W Editor, for exploring only (cannot save)
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetExplore', '@Start');

        this.clickMenuWidgetEdit(id, index, false);
    }

    actionmenuWidgetFullScreen(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetFullScreen', '@Start');

        this.clickMenuWidgetFullScreen(index);

    }

    clickCloseFullScreen() {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseFullScreen', '@Start');

        this.showWidgetFullScreenWidth = 0;
        this.showWidgetFullScreenHeight = 0;
        this.showWidgetFullScreenBorder = '';
        this.showWidgetFullScreenX = '';
        this.showWidgetFullScreenCopy = '';

        this.view.renderer('svg')
            .initialize(this.widgetFullDOM.nativeElement)
            .hover()
            .run()
            .width(0)
            .height(0)
            .finalize();
    }

    actionmenuWidgetDescription(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetDescription', '@Start');

        this.clickMenuWidgetDescription(id, index)
    }

    actionmenuWidgetEditTitle(ev: MouseEvent, index: number, id: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetEditTitle', '@Start');

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id == id) {
                this.selectedWidget = w;
            };
        });

        this.showTitleForm = true;
    }

    actionmenuWidgetFlipToTable(id: number) {
        // Change type to Graph for a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetFlipToTable', '@Start');

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id == id) {
                w.widgetType = 'Table'
            };
        });

        this.menuOptionClickPostAction();
    }

    actionmenuWidgetFlipToGraph(id: number) {
        // Change type to Table for a Graph
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetFlipToGraph', '@Start');

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id == id) {
                w.widgetType = 'Graph'
            };
        });

        this.menuOptionClickPostAction();    }

    actionmenuWidgetCopyImage(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuWidgetCopyImage', '@Start');

        // generate a PNG snapshot and then download the image
        this.view.toImageURL('png').then(function(url) {
            var link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('target', '_blank');
            link.setAttribute('download', 'vega-export.png');
            link.dispatchEvent(new MouseEvent('click'));
        }).catch(function(error) { /* error handling */ });
    }

    actionmenuJumpToLinked(dashboardID: number, dashboardTabID: number) {
        // Jumps to the linked Dashboard and Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'actionmenuJumpToLinked', '@Start');

        // Exit if no Dashboard to jump to
        if (dashboardID == null) {
            return;
        };

        // Tab points to first one, if needed
        if (dashboardTabID == null) {
            dashboardTabID = -1;
        };

        this.globalVariableService.refreshCurrentDashboard(
            'app-actionmenuJumpToLinked', dashboardID, dashboardTabID, ''
        );
    }




    // ***********************  OTHER  ************************ //

    clickPaletteDragStart(ev: MouseEvent) {
        // Register start of Palette drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPaletteDragStart', '@Start');

        this.startX = ev.x;
        this.startY = ev.y;
    }

    clickPaletteDragEnd(ev: MouseEvent) {
        // Move the Palette at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPaletteDragEnd', '@Start');

        // Get final coordinates of cursor after move
        this.endX = ev.x;
        this.endY = ev.y;

        // Move the Palette
        this.paletteLeft = this.paletteLeft - this.startX + this.endX;
        this.paletteTop = this.paletteTop - this.startY + this.endY;

        // Save to DB
        this.globalVariableService.currentUser.lastPaletteLeft = this.paletteLeft;
        this.globalVariableService.currentUser.lastPaletteTop = this.paletteTop;
        this.globalVariableService.saveCanvasUser(this.globalVariableService.currentUser)
    }

    showRecentDashboard(index: number) {
        // Open a Recently used D
        this.globalFunctionService.printToConsole(this.constructor.name,'showRecentDashboard', '@Start');

        // Set the EditMode as it was previously
        this.globalVariableService.editMode.next(this.recentDashboards[index].editMode);

        // Open it
		this.globalVariableService.refreshCurrentDashboard(
            'app-showRecentDashboard',
            this.recentDashboards[index].dashboardID,
            this.recentDashboards[index].dashboardTabID,
            ''
        );
        this.dashboardOpenActions();

    }

    clickShowMenu() {
        // Show main menu
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowMenu', '@Start');

        // Reset vars
        this.showMainMenu = true;
    }

    trackWidget(index, row) {
        //
        // this.globalFunctionService.printToConsole(this.constructor.name,'trackWidget', '@Start');

        // console.log('trackWidget', row);
        return row ? row.id : undefined;
    }

    checkForOnlyOneWidget(widgetType: string = 'All', silent: boolean = false): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForOnlyOneWidget', '@Start');

        // Get nr of W selected
        let nrWidgetsSelected: number = this.currentWidgets.filter(
            w => (w.isSelected  &&  (w.widgetType == widgetType  ||  widgetType == 'All')
                 ) ).length;

        // Show messages if silent = false
        if (nrWidgetsSelected == 0) {
            if (!silent) {
                this.showMessage(
                    widgetType=='All'? 'Nothing selected' : 'No ' + widgetType + ' selected',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
            };
            return false;
        };
        if (nrWidgetsSelected > 1) {
            if (!silent) {
                this.showMessage(
                    widgetType=='All'? 'Multiple selected' : 'More than 1 ' + widgetType + ' selected',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
            };
            return false;
        };

        // All good - only one
        return true;
    }

    checkForMultipleWidgets(): boolean {
        // Returns true if >1 widgets were selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForMultipleWidgets', '@Start');

        if (this.currentWidgets.filter(w => w.isSelected).length < 2) {
            this.showMessage(
                'Select multiple Widgets',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return false;
        };

        // All good
        return true;
    }

    clickWidgetContainerDragStart(ev: MouseEvent, index: number) {
        // Register start of W drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragStart', '@Start');

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {
            return;
        };

        this.menuOptionClickPreAction();

        this.startX = ev.x;
        this.startY = ev.y;

        this.menuOptionClickPostAction();
    }

    clickWidgetContainerDragEnd(ev: MouseEvent, id: number) {
        // Move the W containter at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragEnd', '@Start');

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {

            // Done with resizing
            this.isBusyResizing = false;
            return;
        };

        this.menuOptionClickPreAction();

        // Get final coordinates of cursor after move
        this.endX = ev.x;
        this.endY = ev.y;

        // Create array to loop on
        this.draggableWidgets = [];
        // There is no group
        if (this.widgetGroup.length == 0) {
            this.draggableWidgets = [id];
        } else {
            // Dragged one is part of group, so move group
            if (this.widgetGroup.indexOf(id) >= 0) {
                this.widgetGroup.forEach( wg => {
                    this.draggableWidgets.push(wg)
                });
            } else {
                // Solitary move
                this.draggableWidgets = [id];
            }
        };

        // Move the draggable ones
        this.moveWidgets();
    }

    moveWidgets() {
        // Do Actual Move of draggable Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'moveWidgets', '@Start');

        // Reset current and globalVar values
        this.currentWidgets.forEach(w => {

            if (this.draggableWidgets.indexOf(w.id) >= 0) {

                // Check if Locked
                if (w.isLocked) {
                    this.showMessage(
                        'Locked Widgets cannot be moved (unlock on Graph menu)',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                } else {

                    // Action
                    // TODO - cater for errors + make more generic
                    let actID: number = this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        w.id,
                        'Widget',
                        'Edit',
                        'Move',
                        'App moveWidgets',
                        null,
                        null,
                        w,
                        null,
                        false               // Dont log to DB yet
                    );

                    // Move the container
                    w.containerLeft = w.containerLeft - this.startX + this.endX;
                    w.containerTop =  w.containerTop - this.startY + this.endY;

                    // Sanitize
                    w.containerLeft = Math.min((window.innerWidth - 5), w.containerLeft);
                    w.containerTop =  Math.min((window.innerHeight - 5), w.containerTop);
                    w.containerLeft = Math.max(-50, w.containerLeft);
                    w.containerTop =  Math.max(-50, w.containerTop);
                    // Cater for snapping to Grid
                    if (this.snapToGrid) {
                        w.containerLeft = this.globalVariableService.alignToGripPoint(
                            w.containerLeft);
                        w.containerTop = this.globalVariableService.alignToGripPoint(
                            w.containerTop);
                    };

                    // Add to action log
                    actID = this.globalVariableService.actionUpsert(
                        actID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        w.id,
                        'Widget',
                        'Edit',
                        'Move',
                        null,
                        null,
                        null,
                        null,
                        w
                    );

                    // Save to DB
                    this.globalVariableService.saveWidget(w);
                };
            };
        });
        this.globalVariableService.currentWidgets.forEach( w => {

            if (this.draggableWidgets.indexOf(w.id) >= 0) {
                w.containerLeft = w.containerLeft - this.startX + this.endX;
                w.containerTop = w.containerTop - this.startY + this.endY;

                // Cater for snapping to Grid
                if (this.snapToGrid) {
                    w.containerLeft = this.globalVariableService.alignToGripPoint(
                        w.containerLeft);
                    w.containerTop = this.globalVariableService.alignToGripPoint(
                        w.containerTop);
                };
            }
        });

        this.menuOptionClickPostAction();

    }

    clickWidgetSlicer(ev: MouseEvent, index: number, id: number) {
        // Click Slicer inside W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetSlicerev', '@Start');

        this.clickedSlicerItem = true;
    }

    clickTemplateWidget() {
        // Click Template W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTemplateWidget', '@Start');

        // Has to be in editMode
        this.showMessage(
            'This Widget belongs to the Template (no changes here)',
            'StatusBar',
            'Warning',
            3000,
            ''
        );
        return;
    }

    clickWidget(ev: MouseEvent, index: number, id: number) {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        // Sl item was clicked, so nothing further to do on the W container
        if (this.clickedSlicerItem) {
            this.clickedSlicerItem = false;
            return;
        }

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        let isSelected: boolean = !this.currentWidgets[index].isSelected;
        this.currentWidgets.forEach(w => {
            if ( (w.id == id)  ||  (this.widgetGroup.indexOf(w.id) >= 0) ) {
                w.isSelected = isSelected;
            };
        });

        this.globalVariableService.currentWidgets.forEach(w => {
            if ( (w.id == id)  ||  (this.widgetGroup.indexOf(w.id) >= 0) ) {
                w.isSelected = isSelected;
            };
        });

    }

    clickBulletJump(linkedTabID: number) {
        // Jump to the linked Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBulletJump', '@Start');

        this.menuOptionClickPreAction();

        this.globalVariableService.refreshCurrentDashboard(
            'app-clickBulletJump',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            linkedTabID,
            ''
        );
        this.menuOptionClickPostAction();
    }

    clickResizeWidgetDown(ev: MouseEvent, index: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeWidgetDown', '@Start');

        this.menuOptionClickPreAction();

        // Indicate that we are resizing - thus block the dragging action
        this.isBusyResizing = true;
        this.startX = ev.x;
        this.startY = ev.y;

        this.menuOptionClickPostAction();

    }

    clickResizeWidgetUp(ev: MouseEvent,
        index: number,
        resizeTop: boolean,
        resizeRight: boolean,
        resizeBottom: boolean,
        resizeLeft: boolean) {
        // Mouse up click during resize event.  Change x and y coordinates according to the
        // movement since the resize down event
        //   ev - mouse event
        //   index - index of the W to resize
        //   resizeTop, -Right, -Bottom, -Left - True to move the ... boundary.
        //     Note: 1. both the current and globalVar vars are changed
        //           2. Top and Left involves changing two aspects, ie Left and Width
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeWidgetUp', '@Start');

        // Check if locked
        if (this.currentWidgets[index].isLocked) {
            this.showMessage(
                'Widget is locked (unlock using menu option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.menuOptionClickPreAction();

        // Deep copy existing W
        let oldWidget: Widget = Object.assign({}, this.currentWidgets[index]);
        let gvIndex: number = -1;
        gvIndex = this.globalVariableService.currentWidgets.findIndex(w =>
            w.id == this.currentWidgets[index].id
        );

        // Top moved: adjust the height & top
        if (resizeTop) {
            this.currentWidgets[index].containerTop =
                this.currentWidgets[index].containerTop - this.startY + ev.y;
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerTop =
                    this.currentWidgets[index].containerTop;
            };
            this.currentWidgets[index].containerHeight =
                Math.max(this.minWidgetContainerHeight,
                    this.currentWidgets[index].containerHeight - ev.y + this.startY);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerHeight =
                    Math.max(this.minWidgetContainerHeight,
                        this.currentWidgets[index].containerHeight);
            };

            this.currentWidgets[index].graphHeight = Math.max(this.minGraphHeight,
                this.currentWidgets[index].graphHeight - ev.y + this.startY);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].graphHeight =
                Math.max(this.minGraphHeight, this.currentWidgets[index].graphHeight);
            };
        };

        // Right moved: adjust the width
        if (resizeRight) {
            this.currentWidgets[index].containerWidth =
                Math.max(this.minWidgetContainerWidth,
                    this.currentWidgets[index].containerWidth - this.startX + ev.x);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerWidth =
                    Math.max(this.minWidgetContainerWidth,
                        this.currentWidgets[index].containerWidth);
            };

            this.currentWidgets[index].graphWidth = Math.max(this.minGraphWidth,
                this.currentWidgets[index].graphWidth - this.startX + ev.x);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].graphWidth =
                Math.max(this.minGraphWidth, this.currentWidgets[index].graphWidth);
            };
        };

        // Bottom moved: adjust the height
        if (resizeBottom) {
            this.currentWidgets[index].containerHeight =
                Math.max(this.minWidgetContainerHeight,
                    this.currentWidgets[index].containerHeight - this.startY + ev.y);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerHeight =
                    Math.max(this.minWidgetContainerHeight,
                        this.currentWidgets[index].containerHeight);
            };

            this.currentWidgets[index].graphHeight = Math.max(this.minGraphHeight,
                this.currentWidgets[index].graphHeight - this.startY + ev.y);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].graphHeight =
                Math.max(this.minGraphHeight, this.currentWidgets[index].graphHeight);
            };
        };

        // Left moved: adjust the width & left
        if (resizeLeft) {
            this.currentWidgets[index].containerLeft =
                this.currentWidgets[index].containerLeft - this.startX + ev.x;
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerLeft =
                    this.currentWidgets[index].containerLeft;
            };

            this.currentWidgets[index].containerWidth =
                Math.max(this.minWidgetContainerWidth,
                    this.currentWidgets[index].containerWidth - ev.x + this.startX);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].containerWidth =
                    Math.max(this.minWidgetContainerWidth,
                        this.currentWidgets[index].containerWidth);
            };

            this.currentWidgets[index].graphWidth = Math.max(this.minGraphWidth ,
                this.currentWidgets[index].graphWidth - ev.x + this.startX);
            if (gvIndex != -1) {
                this.globalVariableService.currentWidgets[gvIndex].graphWidth =
                Math.max(this.minGraphWidth, this.currentWidgets[index].graphWidth);
            };
        };

        // Add to Action log
        this.globalVariableService.actionUpsert(
            null,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
            oldWidget.id,
            'Widget',
            'Edit',
            'Resize',
            'App clickResizeWidgetUp',
            null,
            null,
            oldWidget,
            this.currentWidgets[index]
        );

        // Save to DB
        this.globalVariableService.saveWidget(this.currentWidgets[index]);

        // Refresh graphs
        if (this.currentWidgets[index].widgetType == 'Graph') {

            this.globalVariableService.changedWidget.next(this.currentWidgets[index]);
        };

        this.menuOptionClickPostAction();
    }

    showMessage(
        message: string,
        uiArea: string,
        classfication: string,
        timeout: number,
        defaultMessage: string,): void {
        // Shows a message in the right area, ie StatusBar
        this.globalFunctionService.printToConsole(this.constructor.name,'showMessage', '@Start');

        // Pop message in right area
        this.globalVariableService.showStatusBarMessage(
            {
                message: message,
                uiArea: uiArea,
                classfication: classfication,
                timeout: timeout,
                defaultMessage: defaultMessage
            }
        );

        // In addition, make sure the user is not stuck
        if (message == this.globalVariableService.canvasSettings.notInEditModeMsg) {
            this.stuckCount = this.stuckCount + 1;
        } else {
            // this.stuckCount = 0;
        };
        if (!this.globalVariableService.currentUser.lastAppShowPopupMessageGotIt) {
            if (this.stuckCount >= 4) {
                this.showPopupMessage = true;
            } else {
                this.showPopupMessage = false;
            };
        };

    }

    showWidgetForSlicer(id: number, datasourceID: number, datasetID: number) {
        // Returns True if a Widget is related to the selected Sl(s)
        // TODO - put back, but this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'showWidgetForSlicer', '@Start');

        // Get list of selected Sl
        let result: boolean = false;
        this.currentWidgets.forEach(sl => {
            if (sl.isSelected   &&   sl.widgetType == 'Slicer'  &&
                sl.datasourceID == datasourceID   &&   sl.datasetID == datasetID
                &&  sl.id != id) {
                    result = true;
            };
        });

        return result;
    }

    clickToggleShowCheckpoint(
        index: number,
        dashboardID: number,
        id: number,
        showCheckpoints) {
        // Toggle to show Checkpoints or not
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleShowCheckpoint', '@Start');

        // How it works:  when loading a W at RunTime, each W.checkpointIDs[] is set to the 
        // IDs of all its previously stored Checkpoints.  It also stores 
        // currentCheckpoint = 0, which is the index in checkpointIDs while browsing, and 
        // lastCheckpoint which is the index in checkpointIDs of the last ID.  This is a 
        // hack to simplify moving between checkpoint (0 -> lastCheckpoint in checkpointIDs).
        // It is important to note these are indices, not ids.  There is a fourth field,
        // showCheckpoints, which is set to True when while browsing Checkpoints.
        // When checkpointIDs.length > 0, there is a gray dot to indicate that the W have
        // Checkpoints.  When the gray dot is clicked, it now turns blue
        // in color to indicate we are browsing Checkpoints.  The original graph is replaced
        // with the graph of the first Checkpoint. The < > navigation arrows also
        // become visible.  The < > navigation arrows are used to browse, all graphs
        // showing in the same space.  When the blue dot is clicked, it turns gray,
        // the original graph is displayed, showCheckpoints is set to false and the < >
        // arrows disappears.  If a W does not any Checkpoints, there is no gray dot.

        // Load the Checkpoints and insert checkpoint info for each W.
        // TODO - this is a bit of a hack, maybe it can be improved:
        // 1. create Chkpnt with only Did and Wid
        // 2. load D: insert Chkpnt info for each W
        // 3. view Chkpnts: this is where we are now.  We need this for the *ngIfs ...

        // Restore the Original (when moving out of showCheckpoint mode)
        if (showCheckpoints) {
            this.currentWidgetsOriginals.forEach(wo => {

                if (wo.dashboardID == dashboardID  &&  wo.id == id) {
                    wo.showCheckpoints = false;
                    this.globalVariableService.changedWidget.next(wo);
                };
            });
            return;
        };

        // Remember the original W once
        let isFound: boolean = false;
        this.currentWidgetsOriginals.forEach(wo => {
            if (wo.dashboardID == dashboardID
                && wo.id == id) {
                    isFound = true;
            };
        });
        if (!isFound) {
            this.currentWidgetsOriginals.push(this.currentWidgets[index]);
        };

        // Get the W Checkpoints once
        if (this.currentWidgetCheckpoints.length == 0) {
            this.globalVariableService.getCurrentWidgetCheckpoints(dashboardID).then (ca => {

                // Set the data
                this.currentWidgetCheckpoints = ca.slice();

                this.currentWidgets.forEach( w=> {
                    // Toggle showCheckpoints
                    if (w.dashboardID == dashboardID  &&  w.id == id) {
                        w.showCheckpoints = !w.showCheckpoints;
                    };

                    // Set the Checkpoints for this W
                    this.currentWidgetCheckpoints.forEach( wc => {
                        if (wc.widgetID == w.id
                            &&
                            wc.dashboardID == w.dashboardID) {
                            wc.widgetSpec.showCheckpoints = true;
                            wc.widgetSpec.checkpointIDs = w.checkpointIDs;
                            wc.widgetSpec.currentCheckpoint = w.currentCheckpoint;
                            wc.widgetSpec.lastCheckpoint = w.lastCheckpoint;
                            wc.widgetSpec.containerBackgroundcolor = w.containerBackgroundcolor
                            wc.widgetSpec.containerBorder = w.containerBorder
                            wc.widgetSpec.containerBorderRadius = w.containerBorderRadius
                            wc.widgetSpec.containerBoxshadow = w.containerBoxshadow
                            wc.widgetSpec.containerFontsize = w.containerFontsize
                            wc.widgetSpec.containerHeight = w.containerHeight
                            wc.widgetSpec.containerLeft = w.containerLeft
                            wc.widgetSpec.containerHasTitle = w.containerHasTitle
                            wc.widgetSpec.containerTop = w.containerTop
                            wc.widgetSpec.containerWidth = w.containerWidth
                            wc.widgetSpec.containerZindex = w.containerZindex
                        };

                    })
                });

                // Show the first Checkpoint
                // If only one Chkpnt, then we dont show the <> arrows, so one cannot navigiate.
                if (this.currentWidgets[index].checkpointIDs.length > 0) {

                    // Get the W Spec
                    let newW: WidgetCheckpoint[] = this.currentWidgetCheckpoints.filter(wc =>
                        wc.id == this.currentWidgets[index].checkpointIDs[0]
                    );
                    if (newW != undefined) {
                        if (newW.length > 0) {
                            let newWspec: Widget = newW[0].widgetSpec;

                            // Change it on the UI
                            this.globalVariableService.changedWidget.next(newWspec);
                        };
                    };
                };
            });
        } else {
            // Toggle showCheckpoints
            this.currentWidgets.forEach( w=> {
                if (w.dashboardID == dashboardID  &&  w.id == id) {
                    w.showCheckpoints = !w.showCheckpoints;
                };
            });

            // Show the first Checkpoint
            // If only one Chkpnt, then we dont show the <> arrows, so one cannot navigiate.
            if (this.currentWidgets[index].checkpointIDs.length > 0) {

                // Get the W Spec
                let newW: WidgetCheckpoint[] = this.currentWidgetCheckpoints.filter(wc =>
                    wc.id == this.currentWidgets[index].checkpointIDs[0]
                );
                if (newW != undefined) {
                    if (newW.length > 0) {
                        let newWspec: Widget = newW[0].widgetSpec;

                        // Change it on the UI
                        this.globalVariableService.changedWidget.next(newWspec);
                    };
                };
            };
        };

    }

    clickAnimateCheckpoint(
        index: number,
        dashboardID: number,
        id: number,
        direction: string,
        showCheckpoints: boolean,
        checkpointIDs: number[],
        currentCheckpoint: number,
        lastCheckpoint: number) {
        // Animates Checkpoints
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAnimateCheckpoint', '@Start');

        // Reset
        currentCheckpoint = 0;
        var n:number = 0;

        // OLD way, no unsubscribe
        // let timer = Observable.timer(3000,3000);
        // timer.subscribe(t=> {

        //     if (n <= lastCheckpoint) {
        //         this.clickNavCheckpoint(
        //             index,
        //             dashboardID,
        //             id,
        //             'Right',
        //             showCheckpoints,
        //             checkpointIDs,
        //             currentCheckpoint + n,
        //             lastCheckpoint
        //         );
        //     };
        //     n++;
        // });

        let localTimer = timer(3000, 3000);
        this.subscriptionAnimation = localTimer.subscribe(t => {
            if (n <= lastCheckpoint) {
                this.clickNavCheckpoint(
                    index,
                    dashboardID,
                    id,
                    'Right',
                    showCheckpoints,
                    checkpointIDs,
                    currentCheckpoint + n,
                    lastCheckpoint
                );
                n++;
            } else {
                this.subscriptionAnimation.unsubscribe();
            };
        });

    }

    clickNavCheckpoint(
        index: number,
        dashboardID: number,
        id: number,
        direction: string,
        showCheckpoints: boolean,
        checkpointIDs: number[],
        currentCheckpoint: number,
        lastCheckpoint: number) {
        // Navigate Left or Right to a checkpoint
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNavCheckpoint', '@Start');

        // Increment or Decrement
        if (direction == 'Right') {
            if (currentCheckpoint < lastCheckpoint) {
                currentCheckpoint = currentCheckpoint + 1;
            };
        } else {
            if (currentCheckpoint > 0) {
                currentCheckpoint = currentCheckpoint - 1;
            };

        };

        // As we loop on the Chkpnts, all have to be in sync
        // TODO - there must be a better way
        this.currentWidgetCheckpoints.forEach(wc =>
            wc.widgetSpec.currentCheckpoint = currentCheckpoint
        );

        // Get the W Spec
        let newW: WidgetCheckpoint[] = this.currentWidgetCheckpoints.filter(wc =>
            wc.id == checkpointIDs[currentCheckpoint]
        );
        let newWspec: Widget = newW[0].widgetSpec;
        if (newW != undefined) {
            if (newW.length > 0) {
                // Change it on the UI
                this.globalVariableService.changedWidget.next(newWspec);
            };
        };
    }

    deleteWidget(widgetType, widgetID: number = null) {
        // Delete the selected W
        // - Optional widgetType, widgetID to Delete
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteWidget', '@Start');

        let datasetID: number = -1;

        // Delete the local one
        let delIDs: number[] = [];
        let deleteWidget: Widget;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            // Get given ID, else all selected of the given widgetType
            if (  (widgetID != null  &&  this.currentWidgets[i].id == widgetID)
                   ||
                   (widgetType != null
                    &&  this.currentWidgets[i].isSelected
                    &&  this.currentWidgets[i].widgetType == widgetType)
                ) {

                deleteWidget = Object.assign({}, this.currentWidgets[i]);
                datasetID = this.currentWidgets[i].datasetID;
                delIDs.push(this.currentWidgets[i].id);
                this.currentWidgets.splice(i,1);
            };
        };

        // Delete W + Chkpnts from the DB and global ones
        this.globalVariableService.deleteWidget(deleteWidget.id);

        for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
            if (delIDs.indexOf(this.globalVariableService.widgets[i].id) >= 0) {
                this.globalVariableService.widgets.splice(i,1)
            };
        };
        for (var i = 0; i < this.globalVariableService.currentWidgets.length; i++) {
            if (delIDs.indexOf(this.globalVariableService.currentWidgets[i].id) >= 0) {
                this.globalVariableService.currentWidgets.splice(i,1)
            };
        };

        // Filter the data in the dSets to which the Sl points.
        // In addition, apply all Sl that relates to each one
        let newDataset: Dataset;
        this.globalVariableService.currentDatasets.forEach(cd => {
            if (cd.id == datasetID) {
                newDataset = this.globalVariableService.filterSlicer(cd);
            };
        });

    }

    menuOptionClickPreAction() {
        // Actions performed at the START of a menu item click, PRE any other work
        this.globalFunctionService.printToConsole(this.constructor.name,'menuOptionClickPreAction', '@Start');

        this.modalFormOpen = true;
        this.showPopupMessage = false;
    }

    menuOptionClickPostAction() {
        // Actions performed at the END of a menu item click, POST any other work
        this.globalFunctionService.printToConsole(this.constructor.name,'menuOptionClickPostAction', '@Start');

        this.modalFormOpen = false;
        this.showPopupMessage = false;
    }

    clickGotIt() {
        // Unshow popup message to help user get into Edit Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGotIt', '@Start');

        this.showPopupMessage = false;

        this.globalVariableService.currentUser.lastAppShowPopupMessageGotIt = true;
        this.globalVariableService.saveCanvasUser(this.globalVariableService.currentUser)
    }

    clickMenuWidgetDuplicate(widgetType: string) {
        // Duplicate selected Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget(widgetType)) {
            return;
        };

        this.menuOptionClickPreAction();

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Make a (new) duplicate of a Deep copy
                this.clipboardWidget = Object.assign({}, w)
                this.globalVariableService.duplicateSingleWidget(this.clipboardWidget);

                this.showMessage(
                    'Widget copied',
                    'StatusBar',
                    'Info',
                    3000,
                    ''
                );
            };
        });

        this.menuOptionClickPostAction();
    }

//     duplicateSingleWidget(originalWidget: Widget) {
//         // Duplicate the given Widget
//         this.globalFunctionService.printToConsole(this.constructor.name,'duplicateSingleWidget', '@Start');

//         // Find latest copy #
//         let copyPosition: number = 1;
//         for (var i = 0; i < 21; i++) {
//             this.currentWidgets.forEach(w => {
//                 if ( w.titleText.includes(' (copy ' + i.toString() + ')') ) {
//                     copyPosition = i + 1;
//                 };
//             });
//         };

//         // Make a deep copy
//         let copiedWidget: Widget = Object.assign({}, originalWidget);

//         copiedWidget.id = null;
//         copiedWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
//         copiedWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
// console.warn('xx originalWidget copiedWidget',
// originalWidget, copiedWidget)
//         // Assume this is a NEW W, so forget about tabs that original belongs
//         copiedWidget.dashboardTabIDs = [copiedWidget.dashboardTabID];
//         copiedWidget.isSelected = false;
//         copiedWidget.containerLeft = 120;
//         copiedWidget.containerTop = 120;
//         copiedWidget.titleText = copiedWidget.titleText + ' (copy ' +
//             copyPosition.toString() + ')';

//         // Add to all and current W
//         this.globalVariableService.addWidget(copiedWidget).then(res => {
//             copiedWidget.id = res.id;

//             this.globalVariableService.changedWidget.next(copiedWidget);

//             // Add to Action log
//             this.globalVariableService.actionUpsert(
//                 null,
//                 this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
//                 this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
//                 copiedWidget.id,
//                 'Widget',
//                 'Edit',
//                 'Duplicate',
//                 'App clickMenuWidgetDuplicate',
//                 null,
//                 null,
//                 null,
//                 copiedWidget
//             );
//         });

//     }

    paletteFunctionCall(methodName: string, methodParam) {
        // Call function in Var from Customised portion of Palette
        this.globalFunctionService.printToConsole(this.constructor.name,'paletteFunctionCall', '@Start');

        console.warn('Called ', {methodName}, {methodParam})
        // Call the method with the given params
        if(this[methodName]) {
            // method exists on the component
            let param = methodParam;
            this[methodName](param); // call it
        }
    }

    dragstartPaletteButton(ev) {
        // Start dragging a Palette button onto the D
        this.globalFunctionService.printToConsole(this.constructor.name,'paletteFunctionCall', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log("dragstartPaletteButton", ev);
    }

    dragendPaletteButton(ev, functionName: string) {
        // Dragged a Palette button onto the D
        this.globalFunctionService.printToConsole(this.constructor.name,'paletteFunctionCall', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log("dragendPaletteButton", ev);

        if (functionName == 'clickMenuWidgetNew') {

            this.paletteDrag = true;

            // The end position depends on where the user clicked to start the drag
            this.newWidgetContainerLeft = ev.clientX - 10;
            this.newWidgetContainerTop = ev.clientY - 10;
            this.clickMenuWidgetNew();
        } else {
            this.showMessage(
                'No drag Function exists for this button',
                'StatusBar',
                'Info',
                3000,
                ''
            );
        };
    }

    dashboardOpenActions() {
        // Actions to perform when a D is opened, Before anything else
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardOpenActions', '@Start');

        // Reset stuckCount
        this.stuckCount = 0;

        // Set Fav
        this.showFavouriteDashboard = false;
        for (let i = 0; i < this.globalVariableService.currentDashboards.length; i++) {
            if (this.globalVariableService.currentUser.favouriteDashboards.indexOf(
                this.globalVariableService.currentDashboards[i].id) >= 0) {
                    this.showFavouriteDashboard = true;
            };
        };

        // Reset first action flag
        this.globalVariableService.firstAction = true;

        // Add to Audit Trail
        if (this.globalVariableService.currentDashboardInfo.value != null) {
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                null,
                'Dashboard',
                'Open',
                '',
                'App dashboardOpenActions',
                null,
                null,
                null,
                null,
                true
            );    
        };
    }

    clearDashboard() {
        // Clears all the vars for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clearDashboard', '@Start');

        this.currentDashboardName = '';
        this.currentDashboardTabIndex = 0;
        this.currentDatasources = [];
        this.currentTabName = '';
        this.currentWidgetCheckpoints = [];
        this.currentWidgetDashboardTabIDs = [];
        this.currentWidgets = [];
        this.hasDashboard = false;
        this.editMode = false;
    }

    setPaletteHeightAndWidth() {
        // Sets the Height and Width of the Palette according to the user pref
        this.globalFunctionService.printToConsole(this.constructor.name,'setPaletteHeightAndWidth', '@Start');

        if (this.globalVariableService.currentUser.preferencePaletteHorisontal){
            // Horisontal
            this.paletteHeight = 35;
            this.paletteWidth = (this.globalVariableService.currentPaletteButtonsSelected
                .value.length * 23) + 3;
        } else {
            // Vertical
            this.paletteHeight = (this.globalVariableService.currentPaletteButtonsSelected
                .value.length * 25) + 3;
            this.paletteWidth = 32;
            };
    }

    clickPaletteCopyDimensions() {
        // Copy Dimensions of selected Widget (L, T, width, height)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPaletteCopyDimensions', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.menuOptionClickPreAction();

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Remember the Dimensions
                this.widgetDimenstions =  {
                    width: w.containerWidth,
                    height: w.containerHeight,
                }

                this.showMessage(
                    'Widget Dimensions copied',
                    'StatusBar',
                    'Info',
                    3000,
                    ''
                );
            };
        });

        this.menuOptionClickPostAction();
    }

    clickPalettePasteDimensions() {
        // Paste Dimensions of selected Widget (L, T, width, height)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPalettePasteDimensions', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showMessage(
                this.globalVariableService.canvasSettings.notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Nothing to do - not copied before
        if ((this.widgetDimenstions.width == 0)
            ||  (this.widgetDimenstions.height == 0) ) {
                this.showMessage(
                    'No Dimensions copied previously',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        this.menuOptionClickPreAction();

        // Apply to all selected Ws
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Recall the Dimensions
                w.containerWidth = this.widgetDimenstions.width;
                w.containerHeight = this.widgetDimenstions.height;

                this.globalVariableService.saveWidget(w);
                this.showMessage(
                    'Widget Dimensions pasted',
                    'StatusBar',
                    'Info',
                    3000,
                    ''
                );
            };
        });

        this.menuOptionClickPostAction();
    }

    togglePaletteHorisontal() {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'togglePaletteHorisontal', '@Start');

        // TODO - this must be written to DB for user
        this.globalVariableService.currentUser.preferencePaletteHorisontal =
            !this.globalVariableService.currentUser.preferencePaletteHorisontal;
        this.globalVariableService.preferencePaletteHorisontal.next(
            this.globalVariableService.currentUser.preferencePaletteHorisontal
        );
    }

    clickDashboard() {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboard', '@Start');
        
        // Exit if busy with mouse down and up
        if (this.dashboardStartX != this.dashboardEndX  ||
            this.dashboardStartY != this.dashboardEndY) {
            return;
        };

        // Unselect all Ws
        this.clickMenuEditSelectAllNone('None');
        this.dashboardStartX = 0; 
        this.dashboardEndX = 0;
        this.dashboardStartY = 0; 
        this.dashboardEndY = 0;
    }

    mousedownDashboard(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'mousedownDashboard', '@Start');
        
        // Store X & Y
        this.dashboardStartX = ev.x;
        this.dashboardStartY = ev.y
        this.dashboardEndX = 0;
        this.dashboardEndY = 0;
    }

    mouseupDashboard(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseupDashboard', '@Start');
        
        // Store X & Y
        this.dashboardEndX = ev.x;
        this.dashboardEndY = ev.y;

        // Exit if clicked one spot
        if (this.dashboardStartX == this.dashboardEndX  &&
            this.dashboardStartY == this.dashboardEndY) {
            return;
        };

        // Unselect all Ws
        this.clickMenuEditSelectAllNone('None');

        // Select Ws within the range
        this.currentWidgets.forEach(w => {
            if (w.containerTop >= this.dashboardStartY  && 
                w.containerTop <= this.dashboardEndY  &&
                w.containerLeft >= this.dashboardStartX  &&
                w.containerLeft <= this.dashboardEndX) {
                    w.isSelected = true;
            };
            // Reverse selection
            if (w.containerTop <= this.dashboardStartY  && 
                w.containerTop >= this.dashboardEndY  &&
                w.containerLeft <= this.dashboardStartX  &&
                w.containerLeft >= this.dashboardEndX) {
                    w.isSelected = true;
            };
        });

    }
}

// Naming conventions
// [(visible)] ="displayMe"
// (click)="clickButtonName()"
// (formSubmit)="handleFormSubmit"
// (ngSubmit)="ngSubmitABC"
// (onChange)="changeABC"
// (onDragEnd)="dragEnd"
// [(selection)]="selectedABC"
// placeholder: (info), Required, (Optional)
// [(ngModel)]="selectedABC"
