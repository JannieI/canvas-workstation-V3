/*
 * Main Component, with menu and all Widgets.  Shows statusBar component
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
import { DashboardLayout }            from './models'
import { DashboardRecent }            from './models'
import { Datasource }                 from './models'
import { PaletteButtonBar }           from './models'
import { WebSocketMessage }           from './models'
import { Widget }                     from './models'
import { WidgetCheckpoint }           from './models';
import { WidgetLayout }               from './models';

import { WidgetSingleComponent }      from './widget.single.component';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import { StatusbarComponent }         from './statusbar.component';

// WS
// import { WebSocketChatService }       from './webSocketChat.service'
// Websocket Server
import * as io                        from 'socket.io-client';

// Local Data - Dexie
import { CanvasAppDatabase }          from './dexieDatabase';
import { LocalDashboard }             from './dexieDatabase';
import { LocalDashboardTab }          from './dexieDatabase';
import { LocalWidget }                from './dexieDatabase';
import { LocalWidgetCheckpoint }      from './dexieDatabase';
import { LocalWidgetLayout }          from './dexieDatabase';
import { IDataCachingTable }          from './dexieDatabase';
import { DataCachingDatabase }        from './dexieDatabase';


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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {

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
        if (event.key === 'Tab'  ||  event.key === 'Control') {
            return;
        }

        // Known ones
        if (event.code === 'KeyZ'  &&  (event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickMenuEditUndo();
            return;
        };
        if (event.code === 'KeyY'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuEditRedo();
            return;
        };
        if (event.code === 'KeyZ'  &&  (event.ctrlKey)  &&  (event.shiftKey) ) {
            this.clickMenuEditRedo();
            return;
        };
        if (event.code === 'KeyC'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuWidgetCopy();
            return;
        };
        if (event.code === 'KeyV'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            console.log('xx this.clipboardWidget', this.clipboardWidget)
            if (this.clipboardWidget != null  &&  this.clipboardWidget != undefined) {
                this.clickMenuWidgetPaste();
                return;
            };
        };
        if (event.code === 'Delete'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.clickMenuPaletteDelete();
            return;
        };
        if (event.code === 'Home'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageFirst();
            return;
        };
        if (event.code === 'PageUp'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageUp();
            return;
        };
        if (event.code === 'PageDown'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageDown();
            return;
        };
        if (event.code === 'End'  &&  (event.ctrlKey)  &&  (!event.shiftKey) ) {
            this.dashboardPageLast();
            return;
        };
        if (event.code === 'Backspace'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  &&
            this.globalVariableService.lastDashboardOpened.wasHyperlink === true
            &&  this.globalVariableService.lastDashboardOpened.lastDashboardID != null
            &&  this.globalVariableService.lastDashboardOpened.lastDashboardTabID != null) {
                this.globalVariableService.lastDashboardOpened.wasHyperlink = false;
                this.globalVariableService.refreshCurrentDashboard(
                    'app-Backspace',
                    this.globalVariableService.lastDashboardOpened.lastDashboardID,
                    this.globalVariableService.lastDashboardOpened.lastDashboardTabID,
                    ''
                );
        }

        // Move with Arrow
        if (event.key === 'ArrowRight'  ||  event.key === 'ArrowDown'  ||
            event.key === 'ArrowLeft'   ||  event.key === 'ArrowUp') {

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

    allowNavigatorAdd: boolean = false;
    allowEditMode: boolean = false;
    allowEditUndo: boolean = false;
    allowEditRedo: boolean = false;
    allowSelectAll: boolean = false;
    allowSelectNone: boolean = false;
    allowContainerStylesAdd: boolean = false;
    allowContainerStylesEdit: boolean = false;
    allowManageColours: boolean = false;
    allowMenuDashboardNew: boolean = false;
    allowMenuDashboardRecent: boolean = false;
    allowMenuDashboardOpen: boolean = false;
    allowMenuDashboardDetails: boolean = false;
    allowMenuDashboardComments: boolean = false;
    allowMenuDashboardDescription: boolean = false;
    allowMenuDashboardDataQuality: boolean = false;
    allowMenuDashboardFavourite: boolean = false;
    allowMenuDashboardTags: boolean = false;
    allowMenuDashboardTemplates: boolean = false;
    allowMenuDashboardThemes: boolean = false;
    allowMenuDashboardUsageStats: boolean = false;
    allowMenuDashboardSave: boolean = false;
    allowMenuDashboardSaveAs: boolean = false;
    allowMenuDashboardExport: boolean = false;
    allowMenuDashboardRename: boolean = false;
    allowMenuDashboardDiscard: boolean = false;
    allowMenuDashboardShare: boolean = false;
    allowMenuDashboardSnapshots: boolean = false;
    allowMenuDashboardSchedulesManage: boolean = false;
    allowMenuDashboardSchedulesShowAll: boolean = false;
    allowMenuDashboardScheduleLog: boolean = false;
    allowMenuDashboardSubscribe: boolean = false;
    allowMenuDashboardPrint: boolean = false;
    allowMenuDashboardDelete: boolean = false;
    allowMenuDashboardDeleteBulk: boolean = false;
    allowMenuDatasourceCreate: boolean = false;
    allowMenuDatasourceCreateCSV: boolean = false;
    allowMenuDatasourceCreateJSON: boolean = false;
    allowMenuDatasourceCreateSpeadsheet: boolean = false;
    allowMenuDatasourceCreateGoogleSheets: boolean = false;
    allowMenuDatasourceCreateQueryBuilder: boolean = false;
    allowMenuDatasourceCreateDirectSQL: boolean = false;
    allowMenuDatasourceCreateDirectNoSQL: boolean = false;
    allowMenuDatasourceCreateDirectService: boolean = false;
    allowMenuDatasourceCreateDirectWeb: boolean = false;
    allowMenuDatasourceCreateDirectImport: boolean = false;
    allowMenuDatasourceCreateDirectExport: boolean = false;
    allowMenuDatasourceCreateManagedConnections: boolean = false;
    allowMenuDatasourceCreateManagedQueryBuilder: boolean = false;
    allowMenuDatasourceCreateManagedSQL: boolean = false;
    allowMenuDatasourceCreateManagedGraphQL: boolean = false;
    allowMenuDatasourceCreateManagedNoSQL: boolean = false;
    allowMenuDatasourceCreateManagedNeo4j: boolean = false;
    allowMenuDatasourceBusinessGlossary: boolean = false;
    allowMenuDatasourceDataDictionary: boolean = false;
    allowMenuDatasourceOwnership: boolean = false;
    allowMenuDatasourceDataQuality: boolean = false;
    allowMenuDatasourceEdit: boolean = false;
    allowMenuDatasourceDescriptions: boolean = false;
    allowMenuDatasourceOverview: boolean = false;
    allowMenuDatasourceShare: boolean = false;
    allowMenuDatasourceNetworks: boolean = false;
    allowMenuDatasourceCombinationsAppend: boolean = false;
    allowMenuDatasourceCombinationsJoin: boolean = false;
    allowMenuDatasourceCombinationsIntersection: boolean = false;
    allowMenuDatasourceCombinationsMinusSubtract: boolean = false;
    allowMenuDatasourceUsage: boolean = false;
    allowMenuDatasourceSchedulesManage: boolean = false;
    allowMenuDatasourceSchedulesShowAll: boolean = false;
    allowMenuDatasourceScheduleLogs: boolean = false;
    allowMenuDatasourceRefreshOnce: boolean = false;
    allowMenuDatasourceRefreshRepeat: boolean = false;
    allowMenuDatasourceDelete: boolean = false;
    allowMenuGraphAdd: boolean = false;
    allowMenuNavigatorAdd: boolean = false;
    allowMenuGraphEdit: boolean = false;
    allowMenuNavigatorEdit: boolean = false;
    allowMenuGraphContainer: boolean = false;
    allowMenuGraphDescription: boolean = false;
    allowMenuGraphTitleEdit: boolean = false;
    allowMenuGraphFullScreen: boolean = false;
    allowMenuGraphAnnotations: boolean = false;
    allowMenuGraphCheckpoints: boolean = false;
    allowMenuGraphComments: boolean = false;
    allowMenuGraphHyperlinks: boolean = false;
    allowMenuGraphTemplatesAdd: boolean = false;
    allowMenuGraphTemplatesInsert: boolean = false;
    allowMenuGraphCrossFilter: boolean = false;
    allowMenuGraphExpand: boolean = false;
    allowMenuGraphExport: boolean = false;
    allowMenuGraphBusinessGlossary: boolean = false;
    allowMenuGraphDataDictionary: boolean = false;
    allowMenuGraphDataQuality: boolean = false;
    allowMenuGraphDataSummary: boolean = false;
    allowMenuGraphRefresh: boolean = false;
    allowMenuGraphCopy: boolean = false;
    allowMenuGraphDuplicate: boolean = false;
    allowMenuGraphLockUnlock: boolean = false;
    allowMenuGraphPaste: boolean = false;
    allowMenuGraphDelete: boolean = false;
    allowMenuNavigatorDelete: boolean = false;
    allowMenuTableAdd: boolean = false;
    allowMenuTableEdit: boolean = false;
    allowMenuTableComments: boolean = false;
    allowMenuTableContainer: boolean = false;
    allowMenuTableCrossFilter: boolean = false;
    allowMenuTableDataQuality: boolean = false;
    allowMenuTableExpand: boolean = false;
    allowMenuTableExport: boolean = false;
    allowMenuTableDuplicate: boolean = false;
    allowMenuTableLockUnlock: boolean = false;
    allowMenuTableDelete: boolean = false;
    allowMenuSlicerAdd: boolean = false;
    allowMenuSlicerEdit: boolean = false;
    allowMenuSlicerComments: boolean = false;
    allowMenuSlicerContainer: boolean = false;
    allowMenuSlicerDataQuality: boolean = false;
    allowMenuSlicerDuplicate: boolean = false;
    allowMenuSlicerExpand: boolean = false;
    allowMenuSlicerExport: boolean = false;
    allowMenuSlicerLockUnlock: boolean = false;
    allowMenuSlicerDelete: boolean = false;
    allowMenuShapeAdd: boolean = false;
    allowMenuShapeEdit: boolean = false;
    allowMenuShapeComments: boolean = false;
    allowMenuShapeContainer: boolean = false;
    allowMenuShapeCopy: boolean = false;
    allowMenuShapeDuplicate: boolean = false;
    allowMenuShapeTitleEdit: boolean = false;
    allowMenuShapeHyperlinks: boolean = false;
    allowMenuShapeLockUnlock: boolean = false;
    allowMenuShapePaste: boolean = false;
    allowMenuShapeDelete: boolean = false;
    allowMenuShapeDeleteAll: boolean = false;
    allowMenuViewHideMenu: boolean = false;
    allowMenuViewPrintPreview: boolean = false;
    allowMenuViewTreeview: boolean = false;
    allowMenuViewShowPalette: boolean = false;
    allowMenuViewShowGrid: boolean = false;
    allowMenuViewSnapToGrid: boolean = false;
    allowMenuViewGridSize: boolean = false;
    allowMenuViewZoom: boolean = false;
    allowMenuViewZoom100: boolean = false;
    allowMenuArrangeBackward: boolean = false;
    allowMenuArrangeForward: boolean = false;
    allowMenuArrangeBack: boolean = false;
    allowMenuArrangeFront: boolean = false;
    allowMenuArrangeAlignLeft: boolean = false;
    allowMenuArrangeAlignCenter: boolean = false;
    allowMenuArrangeAlignRight: boolean = false;
    allowMenuArrangeAlignTop: boolean = false;
    allowMenuArrangeAlignMiddle: boolean = false;
    allowMenuArrangeAlignBottom: boolean = false;
    allowMenuArrangeCenterHorisontally: boolean = false;
    allowMenuArrangeCenterVertically: boolean = false;
    allowMenuArrangeGroup: boolean = false;
    allowMenuArrangeUngroup: boolean = false;
    allowMenuArrangeDistributeHorisontally: boolean = false;
    allowMenuArrangeDistributeVertically: boolean = false;
    allowMenuArrangeSameVertically: boolean = false;
    allowMenuArrangeSameHorisontally: boolean = false;
    allowMenuArrangeSameBoth: boolean = false;
    allowMenuHelpDemo: boolean = false;
    allowMenuHelpGettingStarted: boolean = false;
    allowMenuHelpGettingData: boolean = false;
    allowMenuHelpCreatingDashboard: boolean = false;
    allowMenuHelpCreatingWidget: boolean = false;
    allowMenuHelpTransformingData: boolean = false;
    allowMenuHelpTutorials: boolean = false;
    allowMenuHelpDocumentation: boolean = false;
    allowMenuHelpSupport: boolean = false;
    allowMenuActionsShowAuditTrails: boolean = false;
    allowMenuActionsShowMessages: boolean = false;
    allowMenuActionsShowTasks: boolean = false;
    allowMenuActionsSendMessage: boolean = false;
    allowMenuActionsSendEmail: boolean = false;
    allowMenuActionsAddTask: boolean = false;
    allowMenuActionsDontDisturb: boolean = false;
    allowMenuActionsSystemMessages: boolean = false;
    allowMenuSystemGroups: boolean = false;
    allowMenuSystemMyPermissions: boolean = false;
    allowMenuSystemMyProfile: boolean = false;
    allowMenuSystemPaletteButtonBar: boolean = false;
    allowMenuSystemPreferences: boolean = false;
    allowMenuSystemUsers: boolean = false;
    allowMenuSystemSettings: boolean = false;
    allowMenuSystemLogin: boolean = false;
    allowMenuSystemLogout: boolean = false;

    canSave: boolean = true;                    // False when Explore menu option on Graph
    changedWidgetSubscription: Subscription;    // Observable
    combinationType: string;                    // Type passed to Combinations form
    companyName: string = '';
    clickedSlicerItem: boolean = false;
    clipboardWidget: Widget;
    currentDashboardInfoSubscription: Subscription;    // Observable
    currentDashboardName: string = '';
    currentDatasources: Datasource[];
    currentShapeSpec: any;          // TODO - fill this var !!  not working at moment
    currentTabName: string = '';
    currentDashboardTabIndex: number = 0;
    currentDashboardBackgroundColor: string = 'white';
    currentDashboardBackgroundColorCode: string = '';
    currentDashboardBackgroundColorDefault: string = 'white';
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
    dashboardEndX: number;
    dashboardEndY: number;
    dashboardLayouts: DashboardLayout[] = [];
    dashboardStartX: number;
    dashboardStartY: number;
    editingDS: boolean;
    editMenuText: string;
    editModeSubscription: Subscription;         // Observable
    editMode: boolean;                          // True = EditMode, False = ViewMode
    endX: number;                               // Position for dragging
    endY: number;                               // Position for dragging
    hasDashboard: boolean = false;
    hasNewMessage: boolean;                     // True if a new message arrived
    isBusyResizing: boolean = false;
    isFirstTimeUser: boolean = false;
    minWidgetContainerHeight: number = 16;      // Smallest that W Container can get
    minWidgetContainerWidth: number = 16;       // Smallest that W Container can get
    minGraphHeight: number = 1;                 // Smallest that Graph can get
    minGraphWidth: number = 1;                  // Smallest that Graph can get
    modalFormOpen: boolean = false;
    moveEndX: number;                           // Position for dragging
    moveEndY: number;                           // Position for dragging
    moveLastX: number = 0;
    moveLastY: number = 0;
    moveOffsetX: number;
    moveOffsetY: number;
    moveStartX: number;
    moveStartY: number;
    newWidget: boolean = false;
    newWidgetContainerLeft: number = 0;
    newWidgetContainerTop: number = 0;
    paletteButtons: PaletteButtonBar[] = [];
    paletteDrag: boolean;
    paletteLeft: number = 10;                   // Palette position in px
    paletteTop: number = 80;                    // Palette position in px
    paletteHeight = 275;                        // Palette dimensions in px
    paletteWidth = 39;                          // Palette dimensions in px
    popupLeft: number = 0;
    popupHyperlinkDashboardID: number;
    popupHyperlinkDashboardTabID: number;
    popupTop: number = 0;
    popupWidgetID: number;
    popupWidgetType: string;
	recentDashboards: DashboardRecent[];
    refreshGraphs: boolean = false;
    selectDatasourceID: number;
    selectedDatasource: Datasource;
    selectedDashboard: Dashboard;
    selectedDatasourceID: number;       // DS of selecte W, -1 for D
    selectedDropdownID: number;
    selectedWidget: Widget;
    selectedWidgetID: number;
    selectedWidgetIndex: number;
    selectedWidgetLayout: WidgetLayout;
    showDashboardContextMenu: boolean = false;
    showDatasourcePopup: boolean = false;
    showFavouriteDashboard: boolean = false;
    showGrid: boolean;
    showGridSubscription: Subscription;    // Observable
    showMainMenu: boolean = true;
    showModalBusinessGlossary: boolean = false;
    showModalNetworks: boolean = false;
    showModalCombinationAppend: boolean = false;
    showModalCollaborateAuditTrail: boolean = false;
    showModalCollaborateMessages: boolean = false;
    showModalCollaborateSendEmail: boolean = false;
    showModalCollaborateSendMessage: boolean = false;
    showModalCollaborateSystemMessages: boolean = false;
    showModalCollaborateTasksNew: boolean = false;
    showModalCollaborateActivities: boolean = false;
    showModalCollaborateTasks: boolean = false;
    showModalCrossFilter: boolean = false;
    showModalDashboardNew: boolean = false;
    showModalDashboardComments: boolean = false;
    showModalDashboardDataQuality: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalDashboardDeleteBulk: boolean = false;
    showModalDashboardDescription: boolean = false;
    showModalDashboardDiscard: boolean = false;
    showModalDashboardExport: boolean = false;
    showModalDashboardLogin: boolean = false;
    showModalDashboardLogout: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalDashboardRename: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardSaveAs: boolean = false;
    showModalDashboardSchedule: boolean = false;
    showModalDashboardScheduleLog:boolean = false;
    showModalDashboardScheduleEdit: boolean = false;
    showModalDashboardShare: boolean = false;
    showModalDashboardSnapshots: boolean = false;
    showModalDashboardSubscribe: boolean = false;
    showModalDashboardTags
    showModalDashboardTemplate: boolean = false;
    showModalDashboardTheme: boolean = false;
    showModalDashboardTreeview: boolean = false;
    showModalDashboardUsageStats: boolean = false;
    showModalDataCombination: boolean = false;
    showModalDataDeleteDatasource: boolean = false;
    showModalWidgetStoredTemplateSave: boolean = false
    showModalWidgetStoredTemplateInsertWidget: boolean = false
    showModalDataDictionary: boolean = false;
    showModalWidgetFilterSummary: boolean = false;
    showModalDataDirectExport: boolean = false;
    showModalDataCreateSQLEditor: boolean = false;
    showModalDataDirectFileCSV: boolean = false;
    showModalDataDirectFileJSON: boolean = false;
    showModalDataDirectFileSpreadsheet: boolean = false;
    showModalDataDirectGoogleSheets: boolean = false;
    showModalDataDirectImport: boolean = false;
    showModalDataDirectNoSQL: boolean = false;
    showModalDataDirectQueryBuilder: boolean = false;
    showModalDataDirectService: boolean = false;
    showModalDataDirectSQLEditor: boolean = false;
    showModalDataDirectWeb: boolean = false;
    showModalDataEditDatasource: boolean = false;
    showModalDataDatasourceDescription: boolean = false;
    showModalDataManagedConnection: boolean = false;
    showModalDataManagedGraphQLEditor: boolean = false;
    showModalDataManagedNeo4jEditor: boolean = false;
    showModalDataManagedNoSQLEditor: boolean = false;
    showModalDataManagedQueryBuilder: boolean = false;
    showModalDataManagedSQLEditor: boolean = false;
    showModalDataOverview: boolean = false;
    showModalDataRefreshOnce: boolean = false;
    showModalDataRefreshRepeat: boolean = false;
    showModalDataSchedule: boolean = false;
    showModalDataScheduleLog: boolean = false;
    showModalDataScheduleEdit: boolean = false;
    showModalDataShare: boolean = false;
    showModalDataSummary: boolean = false;
    showModalDataTransformation: boolean = false;
    showModalDataUsage: boolean = false;
    showModalLanding: boolean;
    showModalManageBussGlossary: boolean = false;
    showModalManagedDataDataDictionary: boolean = false;
    showModalManagedDataDataQuality: boolean = false;
    showModalManagedDataOwnership: boolean = false;
    showModalNavigatorEditor: boolean = false;
    showModalTableEditor: boolean = false;
    showModalSlicerEditor: boolean = false;
    showModalGroups: boolean = false;
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
    showModalShapeDeleteAll: boolean = false;
    showModalTableDelete: boolean = false;
    showModalSlicerDelete: boolean = false;
    showModalUserMyPermissions: boolean = false;
    showModalUserMyProfile: boolean = false;
    showModalUserPaletteButtonBar: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUsers: boolean = false;
    showModalWidgetAnnotations: boolean = false;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetContainer: boolean = false;
    showModalWidgetContainerStylesAdd: boolean = false;
    showModalManageColours: boolean = false;
    showModalWidgetContainerStylesEdit: boolean = false;
    showModalWidgetDelete: boolean = false;
    showModalWidgetDescription: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalWidgetExpand: boolean = false;
    showModalWidgetExport: boolean = false;
    showModalWidgetHyperlinks: boolean = false;
    showModalWidgetRefresh: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showPalette: boolean = true;
    showPaletteSubscription: Subscription;          // Observable
    showPopupMessage: boolean = false;
    showTitleForm: boolean = false;
    snapToGrid: boolean = true;
    showWidgetContextMenu: boolean = false;
    showWidgetFullScreen: boolean = true;
    showWidgetFullScreenBorder: string = '';
    showWidgetFullScreenCopy: string = '';          // Will be set when menu option called
    showWidgetFullScreenHeight: number = 0;
    showWidgetFullScreenWidth: number = 0;
    showWidgetFullScreenX: string = '';             // Will be set when menu option called
    startX: number;                                 // Position for dragging
    startY: number;                                 // Position for dragging
    statusBarCancelRefresh: boolean = false;
    statusBarRunning: boolean = false;
    subscriptionSnapshot: Subscription;             // Observable
    subscriptionAnimation: Subscription;            // Observable
    stuckCount: number = 0;                         // Give help if stuck for too long
    templateInUse: boolean = false;
    templateInUseSubscription: Subscription;
    templateWidgets: Widget[] = [];                 // Array of W in the Template D
    view: View;                                     // Vega
    widgetDimenstions: {
        width: number;
        height: number;
        } = {
            width: 0,
            height: 0,
        };
    widgetGroup: number[] = [];
    widgetLayouts: WidgetLayout[] = [];
    zoomFactor: string = 'scale(1)';

    // WS Stuffies
    public sender: string = '';
    public content: string;
    public clientMessage = '';


    // Testing Stuffies
    dexieDB: any[];
    testIndexDB: boolean = false;
    dbDataCachingTable;
    dbCanvasAppDatabase;
    localDataCachingTable: IDataCachingTable[];
    localDashboard: LocalDashboard[];
    localDashboardTab: LocalDashboardTab[];
    localWidget: LocalWidget[];
    localWidgetCheckpoint: LocalWidgetCheckpoint[];
    localWidgetLayout: LocalWidgetLayout[];

    // Create the socket (on the web socket Server) on the correct port (which is same as the
    // HTTP url as the web socket Server listens to the HTTP server traffic)
    socket: any;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
    ) {
    }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // Process for Authentication, Login, tokens between Canvas-Server and Canvas-Client:

        // On App startup (ngOnInit):
        // 0. Open WebSocket connection
        // 1. RxJs subscription to Refresh Variables:
        //    Rest of the RxJs subscriptions are called (to listen for updates), including:
        //    - Current User (object that has profile of the current user)
        //    - Refresh one W or whole D
        // 2. Get info from localStorage (using Dexie)
        //    - if none or incomplete info, DELETE local and proceed to Login form
        //    - verify token @ server:
        //      - if not valid, DELETE local and open the Login form.
        //      - else, load variables and proceed to the Landing page.
        //  WHAT about the startup Dashboard ...  TODO NB <-- confirm how this works

        // All http-requests other than Register & Login:
        // Canvas will send each http request with the token added.  If the token is not good,
        // the Canvas-Server will fail the request.

        // Register (button on Login form):
        // This process registers a user as one that may use this Canvas system.
        // The client will:
        // - NOT delete serverName, companyName, userID, token and expirtyDate from the local
        //   IndexedDB
        // - post the register request to the server
        // - keep the form detail filled in
        // The server will:
        // - check if the user exists.
        // - return error if so
        // - add the user to the DB otherwise (CanvasUsers table).
        // - For now, it simply adds the record.  In time, it will get more advanced:
        //   - a workflow (email / messag to Administrator who adds user and permissions, and
        //     email / message back to person saying all good, with url to log in)
        //   - an Auth call to a third party system (ie Adam Sports Admin) who send back
        //     the profile info as well as the token that are stored locally.
        // The Client:
        // - accepts the message from the server, and shows success/error
        // - a new user can just click Login to proceed (if registered)
        // - an existing user (that registered a new user) can just Cancel to close the form
        //   and continue working
        //
        // Note: Registration is necessary for the user to Login, and Login is necessary to
        // proceed with any other request.

        // Login:
        // The user clicks the Login button (has to be registered already).
        // The Client:
        // - deletes serverName, companyName, userID, token and expirtyDate from the local
        //   IndexedDB
        // - sends request to server
        // The server:
        //  - authenticates the user, using one of:
        //    - Canvas-Server authentication using company name, username and password (which
        //      is stored in the server in encrypted format on the server)
        //    - using third party authentication, ie Google or GitHub
        // - creates a new user record if authenticated via a third party and not yet in the
        //   Canvas-Server DB CanvasUsers table
        // - updates lastLoginDt for the user
        // - generates a JWT
        // - returns the JWT and user profile
        // The client:
        // - receives the JWT (JSON web token) and profile
        // - updates the ID vars (Server, Company, User)
        // - stores this token locally in IndexedDB (using Dexie)
        // - stores the server, company name, username in IndexDB
        // - updates GV.currentUser = profile
        // - GV.RefreshVars.next() which triggers a .subscribe in App.ts
        // - emit close event, which triggers handleCloseUserLogin():
        //   - close Login form
        //   - opens Landing page   NB: later consider an option to skip (ie D in url)

        // Note: the logic in the Landing page will:
        // - optionally refresh a Recent D
        // - emit a close event, which will open the New D or Open D forms


        // Refresh Variables (local and global) to be used in the whole App.  This happens
        // after successful login, or verify by server of info read from localStorage:
        //   - updates GV.currentUser = profile
        //   - updates GV.currentUserID
        //   - updates GV.currentCanvasServer = currentCanvasServer
        //   - updates GV.currentCanvasCompanyName = currentCanvasCompanyName
        //   - loads users, do snapshots, etc below



        // 1. RxJs subscription to Refresh Variables:
        // *****************************************************************************

        this.globalVariableService.loadVariableOnStartup.subscribe(res => {
            if (res) {
                console.log('APP loadVariableOnStartup.subscribe start ')
                // Notes:
                // When logging into the Server, a dedicated open connection is established with
                // Workstation.  Workstation has two methods:
                // 1. it listens to Server (with socket.on).  Once a message has been received
                //    by Workstation, it triggers globalvariables.actionWebSocket() asynchronously.
                //    The messages received by Workstation is defined by the WebSocketMessage model.
                // 2. it sends messages to Server (with socket.emit).

                // Establishthe connection
                this.socket = io(this.globalVariableService.canvasServerURI);

                // Notes on Namespaces (EventNames):
                // Each socket on Workstation listens to a specific Namespace.  One can define
                // additional sockets to listen to more Namespaces.
                // For now, we have ONE namespace / eventNames: canvasNS.  This used by both Server
                // and Workstation.  So, the Namespace does not determine the type of message (that
                // is determined by the messageType, and Action).

                // Start listening to the connection (connect is reserved)
                this.socket.on('connect', (data) => {
                    try {

                        // Once a message is received on the canvasNS Namespace, the callback will be
                        // triggered.
                        this.socket.on('canvasNS', (message) => {
                            console.log('APP received websocket message:', message);
                            this.showMessage(
                                'Web Socket now connected',
                                'StatusBar',
                                'Info',
                                3000,
                                ''
                            );

                            this.globalVariableService.actionWebSocket(message).then(res => {
                                console.log('xx actionWebSocket() has completed')
                            });

                        });

                        // Set pingTimeout and pingInterval on the server to modify default behaviour
                        // this.socket.on('ping', () => {
                        //     console.log('xx socket ping was received from server')
                        // });
                        // this.socket.on('pong', (latency) => {
                        //     console.log('xx socket pong was received from server', latency)
                        // });

                        // .emit sends a message to Server on the canvasNS Namespace.  It can take args (data to
                        //  be send to the server) and an optional callback which will be called
                        //  with the server's answer.
                        this.socket.emit('canvasNS', {data: 'First socket message'});
                    }
                    // TODO - this console.log does not run correctly ! Fix it
                    catch {
                        console.log('xx VOILA !')
                    };
                })

                this.socket.on('connect_error', (error) => {
                    console.log('xx socket connect_error', error)
                });
                this.socket.on('connect_timeout', (timeout) => {
                    console.log('xx socket connect_timeout', timeout)
                });
                this.socket.on('error', (error) => {
                    console.log('xx socket error', error)
                });
                this.socket.on('disconnect', (reason) => {
                    console.log('xx socket disconnect', reason)
                    this.showMessage(
                        'Web Socket disconnected !',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );

                });
                this.socket.on('reconnect_attempt', (attemptNumber) => {
                    console.log('xx socket reconnect_attempt', attemptNumber)
                });
                this.socket.on('reconnecting', (attemptNumber) => {
                    console.log('xx socket disconnect', attemptNumber)
                });
                this.socket.on('reconnect_error', (error) => {
                    console.log('xx socket reconnect_error', error)
                });
                this.socket.on('reconnect_failed', () => {
                    console.log('xx socket reconnect_failed')
                });

                // Listen for new messages, to change user icon as indicator
                this.globalVariableService.hasNewMessage.subscribe(nm => {
                    this.hasNewMessage = nm;
                });

                // Rest of the RxJs subscriptions are called (to listen for updates)
                // To obtain required info as and when it is filled by other forms, ie Login

                // Dont Disturb
                this.globalVariableService.dontDisturb.subscribe(ddb =>
                    this.dontDisturb = ddb
                );

                // Snap to grid
                this.snapToGrid = this.globalVariableService.currentUser.preferenceSnapToGrid;

                // Current user
                this.currentUserID = this.globalVariableService.currentUser.userID;
                console.log('xx this.currentUserID', this.currentUserID)
                // Template used
                this.templateInUseSubscription = this.globalVariableService.templateInUse.subscribe(
                    i => this.templateInUse = i
                );

                // Palette and Grid info
                this.showPaletteSubscription = this.globalVariableService.showPalette.subscribe(
                    i => this.showPalette = i
                );
                this.showGridSubscription = this.globalVariableService.showGrid.subscribe(
                    i => this.showGrid = i
                );

                // Mode: Edit / ViewOnly
                this.editModeSubscription = this.globalVariableService.editMode.subscribe(
                    i => {
                            this.editMode = i;
                            if (!i) {this.editMenuText = 'Edit Mode'}
                            else {this.editMenuText = 'View Mode'};
                        }
                );

                // This refreshes one W
                this.changedWidgetSubscription = this.globalVariableService.changedWidget.subscribe(
                    w => {
                    if (w != null) {
                        // Note: amend this.currentWidgets as it is a ByRef to
                        // this.gv.currentWidgets, which Angular does not register that it has changed
                        console.warn('xx APP this.changedWidgetSubscription start', this.globalVariableService.currentWidgets)
                        // Deep copy
                        // let newW: Widget = Object.assign({}, w);
                        let newW: Widget = JSON.parse(JSON.stringify(w));

                        // Delete W if it in our stash
                        for (var i = 0; i < this.currentWidgets.length; i++) {
                            if (this.currentWidgets[i].id === w.id) {
                                this.currentWidgets.splice(i, 1);
                            };
                        };
                        if (newW.dashboardTabID ==
                            this.globalVariableService.currentDashboardInfo.value.
                            currentDashboardTabID) {
                            this.currentWidgets.push(newW);
                        };

                        console.warn('xx app ngOnInit changedWidget replaced', w, this.currentWidgets, this.globalVariableService.widgets, this.globalVariableService.currentWidgets)
                    };
                });

                // This refreshes the whole D, with W and related info
                this.currentDashboardInfoSubscription = this.globalVariableService.currentDashboardInfo.subscribe(
                    i => {
                        console.log('xx currentDashboardInfo.subscribe', i, this.globalVariableService.currentDashboardInfo.value)
                        if (i) {

                            this.companyName = this.globalVariableService.canvasSettings.companyName;
                            this.hasDashboard = true;

                            this.globalVariableService.refreshCurrentDashboardInfo(
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID)
                                    .then(j => {

                                        // Fill Layouts
                                        this.dashboardLayouts = [];
                                        this.widgetLayouts = [];

                                        this.globalVariableService.getResource('dashboardLayouts',
                                            '?filterObject={"dashboardID": ' +
                                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
                                             + '}'
                                        )
                                        .then(res => {
                                            this.dashboardLayouts = res.slice();
                                            if (this.dashboardLayouts.length > 0) {
                                                this.globalVariableService.getResource('widgetLayouts',
                                                    '?filterObject={"dashboardLayoutID": ' +
                                                    this.dashboardLayouts[0].id + '}'
                                                ).then(res => {
                                                    this.widgetLayouts = res.slice();
                                                });
                                            };
                                        })
                                        .catch(err => console.log('Error reading Dashboard Layouts: ' + err) );

                                        let dashboardIndex: number = this.globalVariableService
                                            .dashboards.findIndex(
                                                d => d.id === this.globalVariableService.
                                                    currentDashboardInfo.value.currentDashboardID
                                            );

                                        if (dashboardIndex >= 0) {
                                            this.currentDashboardBackgroundColor = this.globalVariableService.dashboards[dashboardIndex].backgroundColor;

                                            let bgIndex: number = this.globalVariableService.canvasBackgroundcolors
                                                .findIndex(bc => bc.name === this.currentDashboardBackgroundColor);
                                            this.currentDashboardBackgroundColorCode = 
                                                this.currentDashboardBackgroundColorDefault;
                                            if (bgIndex >= 0) {
                                                this.currentDashboardBackgroundColorCode = this.globalVariableService
                                                    .canvasBackgroundcolors[bgIndex].cssCode;
                                            };

                                            let templateDashboardID: number = this.globalVariableService.dashboards[dashboardIndex].templateDashboardID;

                                            if (templateDashboardID != null  &&  templateDashboardID > 0) {
                                                // Load Template
                                                this.templateWidgets = this.globalVariableService.widgets.filter(w =>
                                                    w.dashboardID === templateDashboardID
                                                );

                                            } else {
                                                this.templateWidgets = [];
                                            };

                                        };

                                        this.refreshGraphs = false;

                                        // Cater for -1, ie First T
                                        if (this.globalVariableService.currentDashboardInfo.value
                                            .currentDashboardTabIndex === -1) {
                                                this.globalVariableService.currentDashboardInfo
                                                    .value.currentDashboardTabIndex = 0
                                        };
                                        if (this.globalVariableService.currentDashboardInfo.value
                                            .currentDashboardTabID === -1) {
                                                if (this.globalVariableService.
                                                    currentDashboardTabs.length > 0) {
                                                this.globalVariableService.currentDashboardInfo
                                                    .value.currentDashboardTabID = this.globalVariableService.
                                                    currentDashboardTabs[this.globalVariableService.currentDashboardInfo
                                                        .value.currentDashboardTabIndex].id
                                            };
                                        };

                                        this.currentDashboardName = this.globalVariableService.
                                            currentDashboards[0].name;
                                        this.currentDashboardTabIndex = this.globalVariableService.currentDashboardInfo.value.
                                            currentDashboardTabIndex;
                                        if (this.currentDashboardTabIndex >= 0) {
                                            this.currentTabName = this.globalVariableService.
                                                currentDashboardTabs[this.currentDashboardTabIndex].name;
                                            this.currentTabBackgroundColor = this.globalVariableService.
                                                currentDashboardTabs[this.currentDashboardTabIndex].backgroundColor;
                                            this.currentTabColor = this.globalVariableService.
                                                currentDashboardTabs[this.currentDashboardTabIndex].color;
                                            };
                                        if (this.currentTabBackgroundColor === ''  ||  this.currentTabBackgroundColor == null) {
                                            this.currentTabBackgroundColor = '#192b35';
                                        };
                                        if (this.currentTabColor === ''  ||  this.currentTabColor == null) {
                                            this.currentTabColor = 'white';
                                        };
                                        this.currentDatasources = this.globalVariableService.
                                            currentDatasources.slice();

                                        // Loop on All/Indicated Ws
                                        this.currentWidgets = [];
                                        for (var i = 0; i < this.globalVariableService.currentWidgets.length; i++) {
                                            // let w: Widget = Object.assign({},
                                            //     this.globalVariableService.currentWidgets[i]);
                                            let w: Widget = JSON.parse(JSON.stringify(
                                                this.globalVariableService.currentWidgets[i]));
                                                w.isSelected = false;
                                            this.currentWidgets.push(w)
                                        }
                                        console.warn('xx app end', this.currentWidgets);

                                    }

                                )
                        }
                    }
                );

                // TODO - set GV.canvasUser record
                this.globalVariableService.getResource('canvasUsers').then(res => {

                    // Get Users and Groups, async
                    this.globalVariableService.getResource('canvasGroups');
                    console.warn('App ngOnInit: start reading Users and Groups ...');

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
                                    act.createor === this.globalVariableService.currentUser.userID
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

                // Set the features according to the license: Menu, widgetTypes, DSes, etc
                this.setFeatures();

            } else  {
                // get canvasSettings from DB too
                console.warn('xx res is false', res)
            };;
        });



        // 2. Get info from localStorage (using Dexie) and verify that still valid.
        //    If not valid, open the Login form.  Else, proceed to the Landing page.
        // ****************************************************************************
        //    - Read from Dexie: currentCanvasServer, companyName, currentUserID,
        //      lastLoginDt, token
        //      - if nothing found  -->  proceed to login form
        //      - if lastLoginDt > 24hrs old  -->  login
        //      - if currentUserID == null or ''  -->  Login
        //      - if currentCanvasServer == null or ''  -->  Login
        //      - if expiryDate (on token) is too old   -->  login
        //    - Else, send a Verify token request to the Canvas-Server (ASYNC)
        //      - If server returned error: open Login form
        //      - if server returns user profile:
        //        - re-stores all local storage (currentCanvasServer, companyName,
        //          currentUserID, lastLoginDt, token)
        //        - updates the ID vars (Server, Company, User)
        //        - GV.RefreshVars.next() which triggers a .subscribe above
        //        - load Landing page
        //

        // Local App info DB
		this.globalVariableService.databaseInit()
        this.dbCanvasAppDatabase = this.globalVariableService.dbCanvasAppDatabase;
        // this.dbCanvasAppDatabase = new CanvasAppDatabase
        // this.dbCanvasAppDatabase.open();

        // Count
        this.dbCanvasAppDatabase.table("currentCanvasUser").count(res => {

            // If No record in localStorage, then login
            if (res != 1) {

                this.showModalDashboardLogin = true;
            } else {

                // Note: for now, we only allow one userID in local cache ...
                // .where('canvasServerName').equals('Canvas Server Local')
                this.dbCanvasAppDatabase.table("currentCanvasUser")
                .toArray()
                .then(res => {

                    console.warn('App ngOnInit: after reading Dexie table: ', res)

                    // Validate that all fields filled in
                    let localInfoGood: boolean = true;
                    if (res[0].canvasServerName == null  ||  res[0].canvasServerName === '') {
                        console.warn('App ngOnInit: canvasServerName is bad - ', res[0].canvasServerName);
                        localInfoGood = false;
                        this.showModalDashboardLogin = true;
                    };
                    if (res[0].canvasServerURI == null  ||  res[0].canvasServerURI === '') {
                        console.warn('App ngOnInit: canvasServerURI is bad - ', res[0].canvasServerURI);
                        localInfoGood = false;
                        this.showModalDashboardLogin = true;
                    };
                    if (res[0].currentCompany == null  ||  res[0].currentCompany === '') {
                        console.warn('App ngOnInit: currentCompany is bad - ', res[0].currentCompany);
                        localInfoGood = false;
                        this.showModalDashboardLogin = true;
                    };
                    if (res[0].currentUserID == null  ||  res[0].currentUserID === '') {
                        console.warn('App ngOnInit: currentUserID is bad - ', res[0].currentUserID);
                        localInfoGood = false;
                        this.showModalDashboardLogin = true;
                    };
                    if (res[0].currentToken == null  ||  res[0].currentToken === '') {
                        console.warn('App ngOnInit: currentToken is bad - ', res[0].currentToken);
                        localInfoGood = false;
                        this.showModalDashboardLogin = true;
                    };

                    // Verify the user on the given Server if all good
                    if (localInfoGood) {
                        this.globalVariableService.verifyCanvasUser(
                            res[0].canvasServerName,
                            res[0].canvasServerURI,
                            res[0].currentCompany,
                            res[0].currentUserID,
                            res[0].currentToken).then(
                            result => {
                                console.warn('App ngOnInit: verified user ', res[0].currentUserID, ' with result ', result);

                                if (result) {
                                    // Show Landing page
                                    this.showModalLanding = true;
                                } else {
                                    this.showModalDashboardLogin = true;
                                };
                            }
                        );
                    };
                });
            }

        });

        // Local CachingTable DB
        this.dbDataCachingTable = new DataCachingDatabase;
        this.dbDataCachingTable.open();
    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        //
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name, 'ngAfterViewChecked', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnDestroy', '@Start');

        this.changedWidgetSubscription.unsubscribe();
        this.currentDashboardInfoSubscription.unsubscribe();
        this.editModeSubscription.unsubscribe();
        this.showGridSubscription.unsubscribe();
        this.showPaletteSubscription.unsubscribe();
        this.subscriptionAnimation.unsubscribe();
        this.subscriptionSnapshot.unsubscribe();
        this.templateInUseSubscription.unsubscribe();
    }





    // ***********************  HANDLE RETURN AFTER MODAL FORM CLOSES ************************ //
    dashboardPageFirst() {
        // Move to First Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'dashboardPageFirst', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'First'
        );
    }

    dashboardPageDown() {
        // Move to next Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'dashboardPageDown', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Next'
        );
    }

    dashboardPageUp() {
        // Move to previous Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'dashboardPageUp', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'app-keyEvent',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Previous'
        );
    }

    dashboardPageLast() {
        // Move to previous Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'dashboardPageLast', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseModalLanding', '@Start');

        this.showModalLanding = false;
        // this.document.body.style.backgroundImage ='../images/BarChart.png';

        if (action === 'New') {
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

    handleCloseWidgetContainerStylesAdd() {
        // Handle close of ContainerStyles Add form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetContainerStylesAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetContainerStylesAdd = false;
    }

    handleCloseManageColours() {
        // Handle close of Manage Colours form
        this.globalFunctionService.printToConsole(this.constructor.name, 'ManageColours', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManageColours = false;
    }

    handleCloseWidgetContainerStylesEdit() {
        // Handle close of ContainerStyles Edit form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetContainerStylesEdit', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetContainerStylesEdit = false;
    }

    handleCloseDashboardNew(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardNew', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardNew = false;

        // Show help for first time users
        if (action === 'Created') {
            // When creating a D, one can also Edit it
            this.globalVariableService.editMode.next(true);

            if (this.globalVariableService.currentUser.isFirstTimeUser) {
                this.isFirstTimeUser = true;
            };
        } else {
            // If chose Add Dashboard on Landing page, and then pressed Esc (nothing new
            // added), then re-show the Landing page
            if (this.globalVariableService.currentDashboardInfo.value == null) {
                this.showModalLanding = true;
            };
        };

    }

    handleCloseDashboardOpen(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardOpen', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardOpen = false;

        // If chose Add Dashboard on Landing page, and then pressed Esc (nothing new
        // added), then re-show the Landing page
        if (this.globalVariableService.currentDashboardInfo.value == null) {
            this.showModalLanding = true;
        } else {;

            this.dashboardOpenActions();
        };
    }

    handleCloseDashboardSave(action: string) {
        // Handle close form for Save a D - from Draft -> Complete
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardSave', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSave = false;
    }

    handleCloseDashboardSaveAs(action: string) {
        // Handle close form for Save AS a Complete D under a new name
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardSaveAs', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSaveAs = false;
    }

    handleCloseDashboardExport(action: string) {
        // Handle close form for Export of D to a text file
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardExport = false;
    }

    handleCloseDashboardSnapshots(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardSnapshots', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSnapshots = false;
    }

    handleCloseDashboardShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardShare', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardShare = false;
    }

    handleCloseDashboardDiscard(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardDiscard', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardRename(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardRename', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDescription(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardDescription', '@Start');

        this.menuOptionClickPostAction();

        // Refresh any changes to the current D
        if (action === 'Saved') {
            this.currentDashboardName = this.selectedDashboard.name;
            this.currentDashboardBackgroundColor = this.selectedDashboard.backgroundColor;

            let bgIndex: number = this.globalVariableService.canvasBackgroundcolors
                .findIndex(bc => bc.name === this.currentDashboardBackgroundColor);
            this.currentDashboardBackgroundColorCode =
                this.currentDashboardBackgroundColorDefault;
            if (bgIndex >= 0) {
                this.currentDashboardBackgroundColorCode = this.globalVariableService
                    .canvasBackgroundcolors[bgIndex].cssCode;
            };

            this.currentDashboardBackgroundImage = this.selectedDashboard.backgroundImage;
        };

        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardTags', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTags = false;
    }

    handleCloseDashboardTheme(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardTheme', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTheme = false;
    }

    handleCloseDashboardTemplate(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardTemplate', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTemplate = false;
    }

    handleCloseDashboardSchedule(action: string) {
        // Handle closing of D schedules
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardSchedule', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSchedule = false;
    }

    handleCloseDashboardScheduleLog(action: string) {
        // Handle closing of D schedule logs form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardScheduleLog', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardScheduleLog = false;
    }

    handleCloseDashboardScheduleEdit(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardScheduleEdit', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardScheduleEdit = false;
    }

    handleCloseDashboardDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardDelete', '@Start');

        if (action === 'Deleted') {
            this.clearDashboard();
            this.showMessage(
                'Click Dashboard Add or Open to continue with another dashboard',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
        }
        this.menuOptionClickPostAction();

        this.showModalDashboardDelete = false;
    }

    handleCloseDashboardDeleteBulk(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardDeleteBulk', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDeleteBulk = false;
    }

    handleCloseDashboardTreeview(action: string){
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardTreeview', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTreeview = false;
    }

    handleCloseDashboardSubscribe(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardSubscribe', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSubscribe = false;
    }

    handleCloseDashboardUsageStats(action: string) {
        // Handle event when closing usage stats form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardUsageStats', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardUsageStats = false;
    }

    handleCloseShapeEdit(changedWidget: Widget) {
        // Handle event when closing Shape Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseShapeEdit', '@Start');

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
        // Handle form close of Delete one Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseShapeDelete', '@Start');

        // Delete if so requested
        if (action === 'Delete') {

            this.deleteWidget('Shape');
        };

        this.menuOptionClickPostAction();

        this.showModalShapeDelete = false;
    }

    handleCloseShapeDeleteAll(action: string) {
        // Handle close form Delete ALL Shapes
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseShapeDeleteAll', '@Start');

        // Delete if so requested
        if (action === 'Delete') {

            let deleteWidget: Widget;

            for (var i = this.currentWidgets.length - 1; i >= 0 ; i--) {

                // Delete ALL the Shapes
                if ( this.currentWidgets[i].widgetType === 'Shape') {

                    this.deleteWidget('Shape', this.currentWidgets[i].id);
                };
            };
        };

        this.menuOptionClickPostAction();

        this.showModalShapeDeleteAll = false;
    }

    handleCloseWidgetAnnotations(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardAnnotations', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetAnnotations = false;
    }

    handleCloseDashboardComments(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardComments', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardComments = false;
    }

    handleCloseDashboardDataQuality(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardDataQuality', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDataQuality = false;
    }

    handleCloseDashboardPrint(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardPrint', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardPrint = false;
    }

    handleCloseDataSlicers(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataSlicers', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseModalWidgetTitle', '@Start');

        if (changedWidget != null) {
            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.menuOptionClickPostAction();

        this.showTitleForm = false;
    }

    handleCloseNavigatorEditor(changedWidget: Widget) {    
        // Handle closing routine for Navigator Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseNavigatorEditor', '@Start');

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
                'App handleCloseNavigatorEditor',
                null,
                null,
                this.newWidget? null : this.selectedWidget,
                changedWidget
            );

            this.globalVariableService.changedWidget.next(changedWidget);
        }

        this.menuOptionClickPostAction();
        console.warn('xx app W', this.selectedWidget, changedWidget, this.currentWidgets)
        this.showModalNavigatorEditor = false;
    }

    handleCloseWidgetEditor(changedWidget: Widget) {    //widgetsToRefresh: number) {
        // Handle closing routine for Widget Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetEditor', '@Start');

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

    handleCloseWidgetDescription(tabIDs: number[]) {
        // Handle close of Description form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetDescription', '@Start');

        this.showModalWidgetDescription = false;
    }

    handleCloseDataCreateDSSQLEditor(returnDS: Datasource) {
        // Handle close of SQL Editor form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataCreateDSSQLEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataCreateSQLEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataDirectFileCSV(returnDS: Datasource) {
        // Handle close of Direct File CSV file load
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectFileCSV', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectFileJSON', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectFileSpreadsheet', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectGoogleSheets', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectQueryBuilder', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectSQLEditor', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectNoSQL', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectService', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectWeb', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectImport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectImport = false;

    }

    handleCloseDataDirectExport(action: string) {
        // Handle close of Direct NoSQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDirectExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDirectExport = false;

    }
    
    handleCloseDataNetworks(action: string) {
        // Handle close of Networks form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataNetworks', '@Start');

        this.menuOptionClickPostAction();

        this.showModalNetworks = false;
    }

    handleCloseDataCombinationAppend(action: string) {
        // Handle close of CombinationAppend form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataCombinationAppend', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCombinationAppend = false;
    }

    handleCloseDataDatasourceOverview(action: string) {
        // Handle close of Datasource Overview
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceOverview', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataOverview = false;
    }

    handleCloseDataDatasourceUsage(action: string) {
        // Handle close of Datasource Usage
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceUsage', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataUsage = false;
    }

    handleCloseDataDatasourceSchedule(action: string) {
        // Handle close of Datasource Schedules
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceSchedule', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataSchedule = false;
    }

    handleCloseDataDatasourceScheduleLog(action: string) {
        // Handle close of Datasource ScheduleLogs
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceScheduleLog', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataScheduleLog = false;
    }

    handleCloseDataDatasourceScheduleEdit(action: string) {
        // Handle close of Datasource Schedule Edit
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceScheduleEdit', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataScheduleEdit = false;
    }

    handleCloseDataDatasourceRefreshOnce(action: string) {
        // Handle close of Datasource RefreshOnce
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceRefreshOnce', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataRefreshOnce = false;
    }

    handleCloseDataDatasourceRefreshRepeat(action: string) {
        // Handle close of Datasource RefreshRepeat
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceRefreshRepeat', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataRefreshRepeat = false;
    }

    handleCloseDataManagedConnection(action: string) {
        // Handle Close of SQL Query Builder
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedConnection', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedConnection = false;
    }

    handleCloseDataManagedQueryBuilder(returnDS: Datasource) {
        // Handle Close of SQL Query Builder
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedQueryBuilder', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedSQLEditor', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedGraphQLEditor', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedNoSQLEditor', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedNeo4jEditor', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataManagedNeo4jEditor = false;

        // Open Transformations if so requested
        if (returnDS != null) {
            this.selectedDatasource = returnDS;
            this.showModalDataTransformation = true;
        };
    }

    handleCloseDataTransformation(action: string) {
        // Handle Close of Overlay Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataTransformation', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataTransformation = false;
    }

    handleCloseDataEditDatasource(returnedDatasource: Datasource) {
        // Handle Close of Edit Datasource
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataEditDatasource', '@Start');

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
                if (returnedDatasource.createMethod === 'directFileCSV') {
                    this.showModalDataDirectFileCSV = true;
                } else if (returnedDatasource.createMethod === 'directFileJSON') {
                    this.showModalDataDirectFileJSON = true;
                } else if (returnedDatasource.createMethod === 'directFileSpreadsheet') {
                    this.showModalDataDirectFileSpreadsheet = true;
                } else if (returnedDatasource.createMethod === 'directGoogleSheets') {
                    this.showModalDataDirectGoogleSheets = true;
                } else if (returnedDatasource.createMethod === 'directQueryBuilder') {
                    this.showModalDataDirectQueryBuilder = true;
                } else if (returnedDatasource.createMethod === 'directSQLEditor') {
                    this.showModalDataDirectSQLEditor = true
                } else if (returnedDatasource.createMethod === 'directNoSQL') {
                    this.showModalDataDirectNoSQL = true
                } else if (returnedDatasource.createMethod === 'directWeb') {
                    this.showModalDataDirectWeb = true
                } else if (returnedDatasource.createMethod === 'managedQueryBuilder') {
                    this.showModalDataManagedQueryBuilder = true;
                } else if (returnedDatasource.createMethod === 'managedSQLEditor') {
                    this.showModalDataManagedSQLEditor = true;
                } else if (returnedDatasource.createMethod === 'managedGraphQLEditor') {
                    this.showModalDataManagedGraphQLEditor = true;
                } else if (returnedDatasource.createMethod === 'managedNoSQLEditor') {
                    this.showModalDataManagedNoSQLEditor = true;
                } else if (returnedDatasource.createMethod === 'managedNeo4jEditor') {
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

    handleCloseDataDatasourceDescription () {
        // Handle Close of Edit Datasource
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDatasourceDescription', '@Start');

        this.menuOptionClickPostAction();

        // Close the DS Description form
        this.showModalDataDatasourceDescription = false;

    }

    handleCloseDataManagedDataQuality(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedDataQuality', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataDataQuality = false;
    }

    handleCloseDataManagedDataOwnership(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedDataOwnership', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataOwnership = false;
    }

    handleCloseDataManagedDataDictionary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManageDataDictionary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManagedDataDataDictionary = false;
    }

    handleCloseDataManagedBusGlossary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataManagedBusGlossary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalManageBussGlossary = false;
    }

    handleCloseDataCombination(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataCombination', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataCombination = false;
    }

    handleCloseDataShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataShare', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataShare = false;
    }
    
    handleCloseWidgetFilterSummary(action: string) {
        // Handle close of Widget Filter Summary form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetFilterSummary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetFilterSummary = false;
    }


    handleCloseDataDictionary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDictionary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDictionary = false;
    }

    handleCloseBusinessGlossary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseBusinessGlossary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalBusinessGlossary = false;
    }

    handleCloseDataSummary(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataSummary', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataSummary = false;
    }

    handleCloseDataDeleteDatasource(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDataDeleteDatasource', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataDeleteDatasource = false;
    }

    handleCloseWidgetStoredTemplateSave(action: string) {
        // Hanlde close of Widget Template Save form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetStoredTemplateSave', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetStoredTemplateSave = false;
    }


    handleCloseWidgetStoredTemplateInsertWidget(changedWidget: Widget) {
        // Hanlde close of Widget Template Insert Widget form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetStoredTemplateInsertWidget', '@Start');

        this.menuOptionClickPostAction();

        // Refresh
        if (changedWidget != null) {
            this.globalVariableService.changedWidget.next(changedWidget);
        };

        this.showModalWidgetStoredTemplateInsertWidget = false;
    }


    handleCloseWidgetContainer(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetContainer', '@Start');

        this.globalVariableService.changedWidget.next(changedWidget);

        this.menuOptionClickPostAction();

        this.showModalWidgetContainer = false;
    }

    handleCloseWidgetCheckpoints(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetCheckpoints', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetCheckpoints = false;
    }

    handleCloseWidgetLinks(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetLinks', '@Start');


        this.menuOptionClickPostAction();

        this.showModalWidgetHyperlinks = false;
    }

    handleCloseWidgetRefresh(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetRefresh', '@Start');


        this.menuOptionClickPostAction();

        this.showModalWidgetRefresh = false;
    }

    
    handleCloseWidgetCrossFilter(action: string) {
        // Handle close of the Cross Filter definition form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetCrossFilter', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCrossFilter = false;
    }

    handleCloseWidgetExpand(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetExpand', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetExpand = false;
    }

    handleCloseWidgetExport(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetExport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalWidgetExport = false;
    }

    handleCloseNavigatorDelete(action: string) {
        // Handles the response to the Delete Navigator form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseNavigatorDelete', '@Start');

        // Delete, if so requested
        if (action === 'delete') {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                this.selectedWidget.id,
                'Widget',
                'Delete',
                '',
                'App handleCloseNavigatorDelete',
                null,
                null,
                this.selectedWidget,
                null
            );

            this.deleteWidget('Navigator');
        };

        this.menuOptionClickPostAction();

        // Hide modal form
        this.showModalWidgetDelete = false;
    }

    handleCloseWidgetDelete(action: string) {
        // Handles the response to the Delete Widget form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseWidgetDelete', '@Start');

        // Delete, if so requested
        if (action === 'delete') {

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseTableEditor', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseTableDelete', '@Start');

        // Delete if so requested
        if (action === 'Delete') {

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseSlicerDelete', '@Start');

        // Delete if so requested
        if (action === 'Delete') {

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseDashboardHelp', '@Start');

        this.menuOptionClickPostAction();

        this.isFirstTimeUser = false;
    }

    handleCloseCollaborateAuditTrail(action: string) {
        // Close AuditTrail form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateAuditTrail', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateAuditTrail = false;
    }

    handleCloseCollaborateMessages(action: string) {
        // Close Messages form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateMessages', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateMessages = false;
    }

    handleCloseCollaborateTaskAdd(action: string) {
        // Close Add Task form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateTaskAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateTasksNew = false;
    }

    handleCloseCollaborateSystemMessages(action: string) {
        // Close Add Task form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateSystemMessages', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSystemMessages = false;
    }

    handleCloseCollaborateActivities(action: string) {
        // Close Activities form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateActivities', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateActivities = false;
    }

    handleCloseCollaborateTasks(action: string) {
        // Close Activities form
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseCollaborateTasks', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateTasks = false;
    }

    handleCloseSendMessageAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseSendMessageAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSendMessage = false;
    }

    handleCloseSendEmailAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseSendEmailAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateSendEmail = false;
    }

    handleCloseUserLogin(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserLogin', '@Start');

        this.menuOptionClickPostAction();

        // Hide Login form
        this.showModalDashboardLogin = false;

        // Show Landing page
        if (action != 'Cancel') {
            this.showModalLanding = true;
        };
    }

    handleCloseUserLogout(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserLogout', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardLogout = false;

        if (action === 'LoggedOut') {
            this.showModalDashboardLogin = true;
        };
    }

    handleCloseUserPreferences(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserPreferences', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserPreferences = false;
    }

    handleCloseUserMyPermissions(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserMyPermissions', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserMyPermissions = false;
    }

    handleCloseUserdMyProfile(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserdMyProfile', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserMyProfile = false;
    }

    handleCloseUserPaletteButtonBar(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserPaletteButtonBar', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserPaletteButtonBar = false;
    }

    handleCloseUsers(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUsers', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUsers = false;
    }

    handleCloseGroups(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseGroup', '@Start');

        this.menuOptionClickPostAction();

        this.showModalGroups = false;
    }

    handleCloseUserSystemSettings(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'handleCloseUserSystemSettings', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserSystemSettings = false;
    }






    // ***********************  CLICK EDIT MENU OPTIONS ************************ //

    clickMenuEditMode() {
        // Toggle Edit Mode
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditMode', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Exceed 4 ...
        this.stuckCount = 5;

        // Switch off all selections if going to View Mode
        if (this.editMode) {
            this.clickMenuEditSelectAllNone('None');

            // Find the Dasboard
            let draftDashboardIndex: number = this.globalVariableService.dashboards.findIndex(
                d => d.id === this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardID
            );

            // If it has an OriginalID, open that D and set editmode
            if (draftDashboardIndex >= 0) {
                let draftDashboard: Dashboard = this.globalVariableService
                    .dashboards[draftDashboardIndex];
                if (draftDashboard.originalID != null) {

                    // Simply open Draft in EditMode
                    this.globalVariableService.refreshCurrentDashboard(
                        'app-clickMenuEditMode', draftDashboard.originalID, 0, 'First'
                    );
                    // this.globalVariableService.editMode.next(false);

                };
            };

        } else {

            let originalDashboardIndex: number = this.globalVariableService.dashboards.findIndex(
                d => d.id === this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardID
            );

            console.log('xx originalDashboardIndex', originalDashboardIndex )
            if (originalDashboardIndex >= 0) {
                let originalDashboard: Dashboard = this.globalVariableService
                    .dashboards[originalDashboardIndex];
                console.log('xx originalDashboard', originalDashboard)
                if (originalDashboard.state === 'Complete') {
                    if (originalDashboard.draftID != null) {

                        console.log('xx call refreshDinfo with ', originalDashboard.draftID)
                        // Simply open Draft in EditMode
                        this.globalVariableService.refreshCurrentDashboard(
                            'app-clickMenuEditMode', originalDashboard.draftID, 0, 'First'
                        );
                        // this.globalVariableService.editMode.next(true);


                    } else {

                        this.globalVariableService.dashboardCopy(originalDashboard.id, '', 'Draft')
                            .then(res => {

                                let newDashboardID:number = res.dashboard.id;
                                let newDashboardTabID:number = res.dashboardTabs[0].id;

                                let result: string = this.globalVariableService.refreshCurrentDashboard(
                                    'app-clickMenuEditMode', newDashboardID, 0, 'First'
                                );

                                if (result != 'Error') {
                                    let today = new Date();
                                    let snapshotName: string = this.globalVariableService.dashboards[
                                        originalDashboardIndex].name + ' '
                                        + this.globalVariableService.formatDate(today);
                                    this.globalVariableService.newDashboardSnapshot(
                                        snapshotName, 'Starting Edit Mode', 'StartEditMode'
                                    );
                                };
                                // Toggle mode
                                // this.globalVariableService.editMode.next(true);
                            })
                            .catch(err => {
                                this.showMessage(
                                    'Error creating Draft (in dashboardCopy route)',
                                    'StatusBar',
                                    'Error',
                                    3000,
                                    ''
                                );
                            })
                        // });
                    };
                };
            };
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditUndo', '@Start');

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
        if (ourActions.length === 0) {
            console.log('Nothing to undo')
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Get last actionID for it
        let tempActionIDs: number[] = [];
        for (var i = 0; i < ourActions.length; i++) {
            tempActionIDs.push(ourActions[i].id)
        };
        let maxActID: number = Math.max(...tempActionIDs);

        // Get last action
        let filteredActions: CanvasAction[] = [];
        filteredActions = ourActions.filter(act => act.id === maxActID);

        if (filteredActions[0].undoID == null) {
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

            if (filteredActions[0].objectType === 'Widget') {
                if (filteredActions[0].oldWidget == null) {
                    this.deleteWidget(null, filteredActions[0].newWidget.id);
                } else {

                    // TODO - do this better in a DB
                    if (this.currentWidgetCheckpoints.length > 0) {
                        this.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };

                    if (this.globalVariableService.currentWidgetCheckpoints.length > 0) {
                        this.globalVariableService.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };

                    if (this.globalVariableService.widgetCheckpoints.length > 0) {
                        this.globalVariableService.widgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                                this.globalVariableService.saveResource('widgetCheckpoints', chk);
                            };
                        });
                    };

                    // Add (previous action was a Delete) / Save to DB
                    if (filteredActions[0].actionType === 'Delete') {
                        this.globalVariableService.addResource('widgets', filteredActions[0].oldWidget);

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
            if (tempActionIDs.length === 0) {
                console.log('Nothing more to undo')

                this.menuOptionClickPostAction();
                return;
            };

            filteredActions = this.globalVariableService.actions.filter(
                    act => act.id === undoActID);

            // Diff Object Types
            if (filteredActions[0].objectType === 'Widget') {

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

                if (filteredActions[0].oldWidget == null) {
                    this.deleteWidget(null, filteredActions[0].newWidget.id);
                } else {

                    // TODO - do this better in a DB
                    if (this.currentWidgetCheckpoints.length > 0) {
                        this.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };
                    if (this.globalVariableService.currentWidgetCheckpoints.length > 0) {
                        this.globalVariableService.currentWidgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                            };
                        });
                    };
                    if (this.globalVariableService.widgetCheckpoints.length > 0) {
                        this.globalVariableService.widgetCheckpoints.forEach(chk => {
                            if (chk.widgetID === filteredActions[0].oldWidget.id) {
                                chk.parentWidgetIsDeleted = false;
                                this.globalVariableService.saveResource('widgetCheckpoints', chk);
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditRedo', '@Start');

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
        if (ourActions.length === 0) {
            console.log('Nothing to Redo');
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
                            if (ourActions[i].objectType === 'Widget') {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditSelectAllNone', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        if (size === 'None') {
            this.currentWidgets.forEach(w => {w.isSelected  = false});
            this.globalVariableService.currentWidgets.forEach(w => {
                w.isSelected  = false
            });
        };
        if (size === 'All') {
            this.currentWidgets.forEach(w => w.isSelected = true);
            this.globalVariableService.currentWidgets.forEach(w => w.isSelected = true);
        };
        if (size === 'Auto') {
            let selectedWidgets: Widget[] = this.currentWidgets.filter(
                w => (w.isSelected) );
            if (selectedWidgets.length === 0) {
                this.currentWidgets.forEach(w => w.isSelected = true);
                this.globalVariableService.currentWidgets.forEach(w => w.isSelected = true);
            } else {
                this.currentWidgets.forEach(w => w.isSelected = false);
                this.globalVariableService.currentWidgets.forEach(w => w.isSelected = false);
            }
        };

        this.menuOptionClickPostAction();
    }

    clickMenuEditContainerStylesAdd() {
        // Show popup to Add new Container Styles
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditContainerStylesAdd', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        // TODO - Permissions could be added here, based on user role

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetContainerStylesAdd = true;
    }

    clickMenuEditManageColours() {
        // Show popup to Manage Colours (back- and foreground) in Canvas
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditManageColours', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        // TODO - Permissions could be added here, based on user role

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalManageColours = true;
    }

    clickMenuEditContainerStylesEdit() {
        // Show popup to edit / delete existing Container Styles
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuEditContainerStylesEdit', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        // TODO - Permissions could be added here, based on user role

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetContainerStylesEdit = true;
    }





    // ***********************  CLICK DASHBOARD MENU OPTIONS ************************ //

    clickDashboardNew() {
        // Create a new D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardNew', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.editMode = true;
        this.hasDashboard = true;
        console.log('App clickDashboardNew')
        this.showModalDashboardNew = true;
    }

    clickRecentDashboard() {
        // Open or Import an existing D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardOpen', '@Start');

        this.globalVariableService.getResource('dashboardsRecent')
            .then(res => {
                this.recentDashboards = res.sort( (obj1,obj2) => {
                    if (obj1.accessed > obj2.accessed) {
                        return -1;
                    };
                    if (obj1.accessed < obj2.accessed) {
                        return 1;
                    };
                    return 0;
                });
            })
            .catch(err => console.error('Error with getResource(dashboardsRecent): ', err));
    }

    clickDashboardOpen() {
        // Open or Import an existing D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardOpen', '@Start');

        // Only for Draft
        if (this.globalVariableService.currentUser.userID === '') {
            this.showMessage(
                'Log in first',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        console.log('App clickDashboardOpen')
        this.showModalDashboardOpen = true;
    }

    clickDashboardDiscard() {
        // Discard changes made since the previous Save
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardDiscard', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardDiscard = true;
    }

    clickDashboardShare() {
        // Share a D - set the Access Type (ie Private) and Access List
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardShare', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id === this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = JSON.parse(JSON.stringify(d));
            };
        });

        this.showModalDashboardShare = true;
    }

    clickDashboardSave() {
        // Save changes, and make them available to others
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardSave', '@Start');

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
            d => d.id === this.globalVariableService.currentDashboardInfo.value.currentDashboardID
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardSave = true;
    }

    clickDashboardSaveAs() {
        // Save D AS (make a copy)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardSaveAs', '@Start');

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
            d => d.id === this.globalVariableService.currentDashboardInfo.value.currentDashboardID
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardSaveAs = true;
    }

    clickDashboardExport() {
        // Export D as text file
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardExport', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardExport = true;
    }

    clickDashboardSnapshots() {
        // Make a Snapshot of a D and all related info, which can be restored at later stage
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardSnapshots', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.showModalDashboardSnapshots = true;
    }

    clickDashboardRename() {
        // Bulk rename D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboardRename', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardRename = true;
    }

    clickMenuDashboardDetailDescription() {
        // Show the modal form to edit Descriptive detail for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailDescription', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            console.warn('oi', d, this.globalVariableService.currentDashboardInfo.value.currentDashboardID)
            if (d.id === this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalDashboardDescription = true;
    }

    clickMenuDashboardDetailFavourite() {
        // Toggle Fav for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailFavourite', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let dashboardID: number = this.globalVariableService.currentDashboardInfo.value.
            currentDashboardID;
        let userID: string = this.globalVariableService.currentUser.userID;

        // Add for current User
        if (!this.showFavouriteDashboard) {
            this.globalVariableService.canvasUsers.forEach( u => {
                if (u.userID === userID) {
                    if (u.favouriteDashboards.indexOf(dashboardID) < 0) {
                        u.favouriteDashboards.push(dashboardID);
                    };
                };

            });
        } else {
            this.globalVariableService.canvasUsers.forEach( u => {
                if (u.userID === userID) {
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
            if (d.id === this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                // d.is;
            };
        });
    }

    clickMenuDashboardDetailTags() {
        // Manage Tags for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailTags', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id === this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalDashboardTags = true;
    }

    clickMenuDashboardDetailComments() {
        // Manage Comments for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailComments', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedWidgetID = -1;
        this.showModalDashboardComments = true;
    }

    clickMenuDashboardDetailDataQuality() {
        // Show the form of Data Quality Issues
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailDataQuality', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.selectedDatasourceID = -1;
        this.showModalDashboardDataQuality = true;
    }

    clickMenuDashboardDetailTheme() {
        // Manage the Theme for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailTheme', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardTheme = true;
    }

    clickMenuDashboardDetailTemplate() {
        // Manage Template for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDetailTemplate', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardTemplate = true;
    }

    clickMenuDashboardSchedule() {
        // Manage Schedules for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardSchedule', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardSchedule = true;
    }

    clickMenuDashboardScheduleLog() {
        // Manage Schedule logs for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardScheduleLog', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardScheduleLog = true;
    }

    clickMenuDashboardScheduleEdit() {
        // Manage Schedules for the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardScheduleEdit', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardScheduleEdit = true;
    }

    clickMenuDashboardPrint() {
        // Print the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardPrint', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardPrint = true;
    }

    clickMenuDashboardDelete() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDelete', '@Start');

        // Not for Draft
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardState ==
            'Draft') {
            this.showMessage(
                'Draft Dashboards cannot be deleted (use Save -> Discard, then Delete)',
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardDelete = true;
    }

    clickMenuDashboardDeleteBulk() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardDeleteBulk', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardDeleteBulk = true;
    }

    clickMenuDashboardTreeview() {
        // Show the current D as a Treeview
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardTreeview', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardTreeview = true;
    }

    clickMenuDashboardSubscribe() {
        // Manage Subscription to the current D, ie get notified when it changes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardSubscribe', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardSubscribe = true;
    }

    clickMenuDashboardUsageStats() {
        // Manage Subscription to the current D, ie get notified when it changes
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDashboardUsageStats', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardUsageStats = true;
    }






    // ***********************  CLICK DATA MENU OPTIONS ************************ //

    clickMenuDataManagedConnection() {
        // SQL Query Builder, constructed by selecting Table and Fields
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedConnection', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataManagedConnection = true;
    }

    clickMenuDataManagedQueryBuilder() {
        // SQL Query Builder, constructed by selecting Table and Fields
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedQueryBuilder', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedDatasource = null;
        this.showModalDataManagedQueryBuilder = true;
    }

    clickMenuDataManagedSQLEditor() {
        // SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedSQLEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataManagedSQLEditor = true;
    }

    clickMenuDataManagedGraphQLEditor() {
        // GraphQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedGraphQLEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataManagedGraphQLEditor = true;
    }

    clickMenuDataManagedNoSQLEditor() {
        // No SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedNoSQLEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataManagedNoSQLEditor = true;
    }

    clickMenuDataManagedNeo4jEditor() {
        // Neo4j Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedNeo4jEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataManagedNeo4jEditor = true;
    }

    clickMenuDataTransformation() {
        // Transformations
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataTransformation', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // let dataConnection: = ...
        // let dataTableID: = ...
        // let dataFields: = ...
        this.showModalDataTransformation = true;
    }

    clickMenuDataEditDatasource() {
        // Edit DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataEditDatasource', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot edit Datasources (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedDatasource = null;
        this.showModalDataEditDatasource = true;
    }

    clickMenuDataDatasourceDescription() {
        // DS Description
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDatasourceDescription', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanEditRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot edit Datasources (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedDatasource = null;
        this.showModalDataDatasourceDescription = true;
    }

    clickMenuDatasourceOverview() {
        // Show an overview of a DS, ie data quality, fields, etc
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceOverview', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataOverview = true;
    }

    clickMenuDataNetworks() {
        // Show form to Add / Edit Networks
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataNetworks', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalNetworks = true;
    }

    clickMenuDataCombinationAppend() {
        // Combine one or more existing DS by appending at end of first one
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataCombinationAppend', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCombinationAppend = true;
    }

    clickMenuDatasourceUsage() {
        // Show an Usage of a DS, ie data quality, fields, etc
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceUsage', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataUsage = true;
    }

    clickMenuDatasourceScheduleEdit() {
        // Edit Schedule for DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceScheduleEdit', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataScheduleEdit = true;
    }

    clickMenuDatasourceSchedule() {
        // Show DS Schedules
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceSchedule', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataSchedule = true;
    }

    clickMenuDatasourceScheduleLog() {
        // Show DS ScheduleLogs
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceScheduleLog', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataScheduleLog = true;
    }

    clickMenuDatasourceRefreshOnce() {
        // Refresh selected DS Once off
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceRefreshOnce', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataRefreshOnce = true;
    }

    clickMenuDatasourceRefreshRepeat() {
        // Refresh selected DS Repeat off
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDatasourceRefreshRepeat', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataRefreshRepeat = true;
    }



    clickMenuDataDirectFileCSV() {
        // Open form to create a DS with data that comes from a CSV file.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectFileCSV', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileCSV = true;
    }

    clickMenuDataCreateSQLEditor() {
        // Open form to create a DS using the SQL Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataCreateSQLEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataCreateSQLEditor = true;
    }

    clickMenuDataDirectFileJSON() {
        // Open form to create a DS with data that comes from a JSON file.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectFileJSON', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileJSON = true;
    }

    clickMenuDataDirectFileSpreadsheet() {
        // Open form to create a DS with data that comes from a Spreadsheet.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectFileSpreadsheet', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectFileSpreadsheet = true;
    }

    clickMenuDataDirectGoogleSheets() {
        // Open form to create a DS with data that comes from a Google Sheets Spreadsheet.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectGoogleSheets', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectGoogleSheets = true;
    }

    clickMenuDataDirectQueryBuilder() {
        // Open DATA form for a DS that comes from a QueryBuilder.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectQueryBuilder', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectQueryBuilder = true;
    }

    clickMenuDataDirectSQLEditor() {
        // Open DATA form for a DS that comes from a SQL using SQL statements.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectSQLEditor', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectSQLEditor = true;
    }

    clickMenuDataDirectNoSQL() {
        // Open DATA form for a DS that comes from a NoSQL.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectNoSQL', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectNoSQL = true;
    }

    clickMenuDataDirectService() {
        // Open DATA form for a DS that comes from a Service.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectService', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectService = true;
    }

    clickMenuDataDirectWeb() {
        // Open DATA form for a DS that comes from a Web page.
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectWeb', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.editingDS = false;
        this.selectedDatasource = null;
        this.showModalDataDirectWeb = true;
    }

    clickMenuDataDirectImport() {
        // Import a DS from an external file (json format)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectImport', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.showModalDataDirectImport = true;
    }

    clickMenuDataDirectExport() {
        // Export a DS to an external file (json format)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDirectExport', '@Start');

        this.showModalDataDirectExport = true;
    }

    clickMenuDataManagedDataQuality(){
        // Manage Data Quality Issues for a DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedDataQuality', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalManagedDataDataQuality = true;

    }

    clickMenuDataManagedDataDictionary(){
        // Manage Dictionary for a DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedDataDictionary', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalManagedDataDataDictionary = true;

    }

    clickMenuDataManagedDataOwnership(){
        // Manage Ownership for a DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataManagedDataOwnership', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalManagedDataOwnership = true;

    }

    clickMenuDataBussGlossary(){
        // Manage Dictionary for a DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataBussGlossary', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalManageBussGlossary = true;

    }

    clickMenuDataCombinations(joinType: string){
        // Manage combinations of DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataCombinations', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanCreateRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.combinationType = joinType;

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataCombination = true;
    }

    clickMenuDataShare() {
        // Manage sharing access to DS
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataShare', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanGrantAccessRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataShare = true;
    }

    clickMenuDataDictionary() {
        // Shows Data Dictionary
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDictionary', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataDictionary = true;
    }

    clickMenuDataDeleteDatasource() {
        // Shows form to Delete Datasources
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuDataDeleteDatasource', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.datasourceCanDeleteRole
            &&
            !this.globalVariableService.currentUser.isAdministrator) {
            this.showMessage(
                'You cannot add a new Datasource (role must be added to your user)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataDeleteDatasource = true;
    }




    // ***********************  CLICK WIDGET MENU OPTIONS ************************ //

    clickMenuNavigatorNew() {
        // Open Navigator Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuNavigatorNew', '@Start');

        // Reset
        this.showDashboardContextMenu = false;

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Reset position if not dragged.
        if (!this.paletteDrag) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        } else {
            this.paletteDrag = false;
        };

        // Set Dimensions
        // this.selectedWidgetLayout = widgetLayout;
        // if (widgetLayout != null) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        // } else {

        // };

        // Indicate new W and open Editor
        this.newWidget = true;
        this.showDatasourcePopup = true;
        this.canSave = true;
        this.showModalNavigatorEditor = true;
    }

    clickMenuWidgetNew(widgetLayout: WidgetLayout = null) {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetNew', '@Start');

        // Reset
        this.showDashboardContextMenu = false;

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Reset position if not dragged.
        if (!this.paletteDrag) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        } else {
            this.paletteDrag = false;
        };

        // Set Dimensions
        this.selectedWidgetLayout = widgetLayout;
        if (widgetLayout != null) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        } else {

        };

        // Indicate new W and open Editor
        this.newWidget = true;
        this.showDatasourcePopup = true;
        this.canSave = true;
        this.showModalWidgetEditor = true;
    }

    clickMenuNavigatorEdit(
        widgetID: number = null,
        widgetIndex: number = null,
        canSave: boolean = true) {
        // Open Navigator Editor
        //  widgetID - optional W-ID to open, does not depend on what was selected
        //  widgetIndex - optional [W] index to open, does not depend on what was selected
        //  canSave - if Saving is allowed in W Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuNavigatorEdit', '@Start');

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
                if (!this.checkForOnlyOneWidget('Navigator')) {
                    return
                };

                this.currentWidgets.forEach(w => {
                    if (w.isSelected  &&  w.widgetType === 'Navigator') {
                        this.selectedWidget = w;
                    };
                });

            } else {
                let widgetIndex: number = this.currentWidgets.findIndex(w => w.id === widgetID);
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
        if (this.selectedWidget == null) {
            this.showMessage(
                'No Navigator selected',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;
        };

        // Check if Locked - after id is obtained
        if (canSave) {
            if (this.selectedWidget.isLocked) {
                this.showMessage(
                    'Navigator is locked (unlock using menu option)',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
            };
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = false;
        this.newWidgetContainerLeft = 0;
        this.newWidgetContainerTop = 0;
        this.showDatasourcePopup = false;
        this.canSave = canSave;

        this.showModalNavigatorEditor = true;
    }

    clickMenuWidgetEdit(
        widgetID: number = null,
        widgetIndex: number = null,
        canSave: boolean = true) {
        // Open W Editor
        //  widgetID - optional W-ID to open, does not depend on what was selected
        //  widgetIndex - optional [W] index to open, does not depend on what was selected
        //  canSave - if Saving is allowed in W Editor
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetEdit', '@Start');

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
                    if (w.isSelected  &&  w.widgetType === 'Graph') {
                        this.selectedWidget = w;
                    };
                });

            } else {
                let widgetIndex: number = this.currentWidgets.findIndex(w => w.id === widgetID);
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
        if (this.selectedWidget == null) {
            this.showMessage(
                'No Widget selected',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = false;
        this.newWidgetContainerLeft = 0;
        this.newWidgetContainerTop = 0;
        this.showDatasourcePopup = false;
        this.canSave = canSave;

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetContainer(widgetType: string, selectedWidgetID: number = null) {
        // Show popup to edit Widget Container properties
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetContainer', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

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

        // Check exactly one W selected if no specific ID was given
        if (selectedWidgetID == null) {

            if (!this.checkForOnlyOneWidget(widgetType)) {
                return
            };
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // this.currentWidgets.forEach(w => {
        //     if (w.isSelected  &&  w.widgetType === widgetType) {
        //         this.selectedWidget = w;
        //     };
        // });
        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  (selectedWidgetID == null)
                ||
                (w.id === selectedWidgetID   &&  (selectedWidgetID != null) )
                ) {
                this.selectedWidget = w;
            };
        })
        this.showModalWidgetContainer = true;
    }

    clickMenuWidgetCheckpoints(selectedWidgetID: number = null) {
        // Manage Checkpoints for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetCheckpoints', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  (selectedWidgetID == null)
                ||
                (w.id === selectedWidgetID   &&  (selectedWidgetID != null) )
                ) {
                this.selectedWidget = w;
            };
        })

        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetAnnotations(selectedWidgetID: number = null) {
        // Manage Annotations for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetAnnotations', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  (selectedWidgetID == null)
               ||
               (w.id === selectedWidgetID   &&  (selectedWidgetID != null) )
               ) {
                this.selectedWidget = w;
            };
        })

        this.showModalWidgetAnnotations = true;

    }

    clickMenuWidgetComments() {
        // Manage comments for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedDatasourceID = w.datasourceID;
            };
        });
        this.showModalDashboardDataQuality = true;
    }

    clickWidgetFilterSummary(widgetIndex: number = null) {
        // Show the form for Widget Filter Summary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidgetFilterSummary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetFilterSummary = true;
    }


    clickMenuWidgetDataDictionary(widgetIndex: number = null) {
        // Show the form of Data Dictionary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDataDictionary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataDictionary = true;
    }

    clickMenuWidgetBusinessGlossary(widgetIndex: number = null) {
        // Show the form of Data Dictionary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetBusinessGlossary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalBusinessGlossary = true;
    }


    clickMenuWidgetDataSummary(widgetIndex: number = null) {
        // Show the form of Data Summary for selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDataSummary', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDataSummary = true;
    }

    clickMenuWidgetFullScreen(widgetIndex: number = null) {
        // Show the selected W in full screen
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetFullScreen', '@Start');

        if (widgetIndex == null) {

            // Can only edit one W at a time, so ignore if multiple selected
            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Graph')) {
                return;
            };

            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showWidgetFullScreen = true;
        this.showWidgetFullScreenWidth = 98;
        this.showWidgetFullScreenHeight = 98;
        this.showWidgetFullScreenBorder = 'none';  //'1px solid black';
        this.showWidgetFullScreenX = 'X';
        this.showWidgetFullScreenCopy = 'Copy Image';

        // let localWidget = Object.assign({}, this.selectedWidget);
        let localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Rescale and limit amount of detail on the graph
        localWidget.containerLeft = 20;
        localWidget.containerTop = 20;
        localWidget.containerHeight = 450;
        localWidget.graphHeight = 430;
        localWidget.containerWidth = 540;
        localWidget.graphWidth = 490;
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';
        localWidget.containerBackgroundcolorName = 'white';

        // let definition = this.globalVariableService.createVegaLiteSpec(localWidget);

        // let specification = compile(definition).spec;
        // this.view = new View(parse(specification));

        // this.view.renderer('svg')
        //     .initialize(this.widgetFullDOM.nativeElement)
        //     .hover()
        //     .run()
        //     .finalize();


        // Render graph for Vega-Lite
        if (localWidget.visualGrammar === 'Vega-Lite') {

            // Create specification
            let specification: any = this.globalVariableService.createVegaLiteSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let vegaSpecification = compile(specification).spec;
            let view = new View(parse(vegaSpecification));

            view.renderer('svg')
                .initialize(this.widgetFullDOM.nativeElement)
                .width(372)
                .hover()
                .run()
                .finalize();
        };

        // Render graph for Vega
        if (localWidget.visualGrammar === 'Vega') {

            // Create specification
            let specification: any = this.globalVariableService.createVegaSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let view = new View(parse(specification));
            view.renderer('svg')
                .initialize(this.widgetFullDOM.nativeElement)
                .width(372)
                .hover()
                .run()
                .finalize();
        };

    }

    clickMenuWidgetHyperlinks() {
        // Add links to the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetHyperlinks', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetHyperlinks = true;
    }

    clickMenuWidgetStoredTemplateAdd() {
        // Add the selected W to list of Templates
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetStoredTemplateAdd', '@Start');

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

        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetStoredTemplateSave = true;
    }


    clickMenuWidgetStoredTemplateInsertWidget() {
        // Insert a W Template into current D
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetStoredTemplateInsertWidget', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetStoredTemplateInsertWidget = true;
    }

    clickMenuWidgetRefresh() {
        // Refresh the DS for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetRefresh', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.canvasSettings.noQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuGraphDuplicate() {
        // Duplicate selected Graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuGraphDuplicate', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetLockUnlock', '@Start');

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

        // Check permissions
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

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetCopy', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {
                // this.clipboardWidget = Object.assign({}, w);
                this.clipboardWidget = JSON.parse(JSON.stringify(w));

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetPaste', '@Start');

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

        if (this.clipboardWidget == null  ||  this.clipboardWidget === undefined) {
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.clipboardWidget.dashboardTabID = this.globalVariableService.
            currentDashboardInfo.value.currentDashboardTabID;
        this.clipboardWidget.shapeTextDisplay = this.globalVariableService
            .calcShapeTextDisplay(this.clipboardWidget.shapeText);
        this.globalVariableService.duplicateSingleWidget(this.clipboardWidget);

        this.menuOptionClickPostAction();
    }

    clickMenuWidgetCrossFilter() {
        // Defines cross filters (on other Widgets) for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetCrossFilter', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            if (!this.checkForOnlyOneWidget('Table')) {
                return;
            };
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidget = w;
                console.log('xx app ', w)
            };
        });
        this.showModalCrossFilter = true;
    }

    clickMenuWidgetExpand() {
        // Expands the underlying data for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetIndex = w.id;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuWidgetExport() {
        // Export the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Graph') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetExport = true;
    }

    clickMenuNavigatorDelete() {
        // Delete the selected Navigator
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuNavigatorDelete', '@Start');

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
        if (!this.checkForOnlyOneWidget('Navigator')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Navigator') {
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

    clickMenuWidgetDelete() {
        // Delete the selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDelete', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Graph') {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableAdd', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = true;
        this.showDatasourcePopup = true;

        this.showModalTableEditor = true;

    }

    clickMenuTableEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edits the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableEdit', '@Start');

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
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id === widgetID);
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Table') {
                this.selectedWidget = w;
            };
        });

        this.showDatasourcePopup = false;
        this.showModalTableEditor = true;
    }

    clickMenuTableComments() {
        // Manage Comments for selected Table
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetIndex = w.id;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuTableExport() {
        // Export the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetExport = true;
    }

    clickMenuTableDelete() {
        // Delete selected Table
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuTableDelete', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Table') {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerAdd', '@Start');

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

        // Must be at least one DS
        if (this.globalVariableService.currentDatasources.length === 0) {
            this.showMessage(
                'First link a Datasource (automatically linked when a Widget is added)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = true;

        this.showModalSlicerEditor = true;

    }

    clickMenuSlicerEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edits the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerEdit', '@Start');

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
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id === widgetID);
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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Slicer') {
                this.selectedWidget = w;
            };
        });

        this.showModalSlicerEditor = true;
    }

    clickMenuWidgetDescription(
        widgetID: number = null,
        widgetIndex: number = null
        ) {
        // Open the W Description form
        //  widgetID - optional W-ID to open, does not depend on what was selected
        //  widgetIndex - optional [W] index to open, does not depend on what was selected
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDescription', '@Start');

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
                if (w.isSelected  &&  w.widgetType === 'Graph') {
                    this.selectedWidget = w;
                };
            });
        } else {
            this.selectedWidget = this.currentWidgets[widgetIndex];
        };

        this.showModalWidgetDescription = true;
    }

    clickMenuWidgetEditTitle() {
        // Edit title for the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetEditTitle', '@Start');

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

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set the selected W id
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidget = w;
            }
        })

        this.showTitleForm = true;

    }

    clickMenuSlicerComments() {
        // Manage comments for the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerDataQuality', '@Start');

        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetIndex = w.id;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuSlicerExport() {
        // Exports the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerExport', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalWidgetExport = true;
    }

    clickMenuSlicerDelete() {
        // Delete the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuSlicerDelete', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Slicer') {
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

    clickMenuShapeNew(widgetLayout: WidgetLayout = null) {
        // Add a new Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeNew', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set Dimensions
        this.selectedWidgetLayout = widgetLayout;
        if (widgetLayout != null) {
            this.newWidgetContainerLeft = 0;
            this.newWidgetContainerTop = 0;
        } else {

        };

        this.newWidget = true;
        this.showModalShapeEdit = true;
    }

    clickMenuShapeEdit(widgetID: number = null, widgetIndex: number = null, canSave: boolean = true) {
        // Edit selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeEdit', '@Start');

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

        // Make sure we have only one, then edit it
        if (widgetID == null) {

            if (!this.checkForOnlyOneWidget()) {
                return;
            };
            if (!this.checkForOnlyOneWidget('Shape')) {
                return;
            };

            this.newWidget = false;
            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType === 'Shape') {
                    this.selectedWidget = w;
                };
            });

        } else {
            let widgetIndex: number = this.currentWidgets.findIndex(w => w.id === widgetID);

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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

        // Swith on Editing, and open form
        this.newWidget = false;
        this.showModalShapeEdit = true;
    }

    clickMenuShapeComments() {
        // Manage comments for the selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeComments', '@Start');


        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set the selected W id
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidgetID = w.id;
            }
        })

        this.showModalDashboardComments = true;

    }

    clickMenuShapeHyperLinks() {
        // Manage hyperlinks for the selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeHyperLinks', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Shape') {
                this.selectedWidget = w;
            };
        });

        this.showModalWidgetHyperlinks = true;
    }

    clickMenuShapeEditTitle() {
        // Edit title of selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeEditTitle', '@Start');

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

        // Make sure we have only one Shape selected
        if (!this.checkForOnlyOneWidget()) {
            return;
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return;
        };

        // Set the selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected) {
                this.selectedWidget = w;
            }
        })

        // Only SubType = Value can have titles
        if (this.selectedWidget.widgetSubType != 'Value') {
            this.showMessage(
                'Only Value shapes has a title',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Assume we want to have a title either way
        this.selectedWidget.containerHasTitle = true;
        this.showTitleForm = true;
    }

    clickMenuShapeDelete() {
        // Delete a Shape
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeDelete', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType === 'Shape') {
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

    clickMenuShapeDeleteAll() {
        // Delete ALL Shapes on the current Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuShapeDeleteAll', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set selectedWidget, for action log afterwards
        this.currentWidgets.forEach(w => {
            if (w.widgetType === 'Shape') {

                // Check if Locked
                if (w.isLocked) {
                    this.showMessage(
                        'A Widget is locked (unlock using menu option)',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );
                    return;
                };
            };

        });

        this.showModalShapeDeleteAll = true;
    }




    // ***********************  CLICK VIEW MENU OPTIONS ************************ //

    clickMenuViewHideMenu() {
        // Hides menu
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewHideMenu', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Settings, ie Mode
        this.showMainMenu = false;

        this.menuOptionClickPostAction();
    }

    clickMenuViewPrintPreview(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewPrintPreview', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.menuOptionClickPostAction();
    }

    clickMenuViewShowPalette() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewShowPalette', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.globalVariableService.showPalette.next(!this.showPalette);

        this.menuOptionClickPostAction();
    }

    clickMenuViewShowGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewShowGrid', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.globalVariableService.showGrid.next(!this.showGrid);

        this.menuOptionClickPostAction();
    }

    clickMenuViewSnapToGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewSnapToGrid', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.snapToGrid = !this.snapToGrid;
        this.globalVariableService.updateCurrentUserProperties(
            {
                preferenceSnapToGrid: this.snapToGrid
            }
        );

        // this.globalVariableService.canvasSettings.snapToGrid = this.snapToGrid;
        this.menuOptionClickPostAction();
    }

    clickMenuViewZoom(zoomPercentage: number): string {
        // Zoom Ws
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewZoom', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        if (zoomPercentage == null  ||  zoomPercentage === undefined) {
            zoomPercentage = 0.6;
        }

        this.zoomFactor = 'scale(' + zoomPercentage.toString() + ')';

        this.menuOptionClickPostAction();
        return this.zoomFactor;
    }





    // ***********************  CLICK ARRANGE MENU OPTIONS ************************ //

    clickMenuArrangeBackward() {
        // Decrease z-index of selected Ws
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeBackward', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                this.currentWidgets[i].containerZindex = Math.max(
                    this.globalVariableService.canvasSettings.widgetsMinZindex,
                    this.currentWidgets[i].containerZindex - 1
                );

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeForward() {
        // Increase z-index of selected Ws
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeForward', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                this.currentWidgets[i].containerZindex = Math.min(
                    this.globalVariableService.canvasSettings.widgetsMaxZindex,
                    this.currentWidgets[i].containerZindex + 1
                );

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeBack() {
        /// Move selected Ws to the lowest z-index
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeBack', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex =
                    this.globalVariableService.canvasSettings.widgetsMinZindex;

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeFront() {
        // Move selected Ws to the highest z-index
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeFront', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerZindex =
                    this.globalVariableService.canvasSettings.widgetsMaxZindex;

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });

                // Refresh the Dashboard
                this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
            };
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeAlignLeft() {
        // Align the lefts of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignLeft', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerLeft;
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerLeft = x;
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignLeft',
                            'App clickMenuArrangeAlignLeft',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };
                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenter() {
        // Align the centers of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignCenter', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerLeft +
                        (this.currentWidgets[i].containerWidth / 2);
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerLeft = x -
                        (this.currentWidgets[i].containerWidth / 2);
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };
                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignRight() {
        // Align the Rights of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignRight', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerLeft +
                        this.currentWidgets[i].containerWidth;
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerLeft = x -
                        this.currentWidgets[i].containerWidth;
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignTop() {
        // Align the tops of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignTop', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerTop;
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerTop = x;
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignMiddle() {
        // Align the Middles of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignMiddle', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerTop +
                        (this.currentWidgets[i].containerHeight / 2);
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerTop = x -
                        (this.currentWidgets[i].containerHeight / 2);
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignBottom() {
        // Align the Bottoms of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignBottom', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                // Deep copy of old-, newW
                let oldWidget: Widget = null;
                let newWidget: Widget = null;

                if (x === -1) {
                    x = this.currentWidgets[i].containerTop +
                        (this.currentWidgets[i].containerHeight);
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                    this.currentWidgets[i].containerTop = x -
                        (this.currentWidgets[i].containerHeight);
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                };

                // Save to DB
                this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                    // Add to Action log
                    if (oldWidget != null) {
                        this.globalVariableService.actionUpsert(
                            null,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                            oldWidget.id,
                            'Widget',
                            'Edit',
                            'AlignCenter',
                            'App clickMenuArrangeAlignCenter',
                            null,
                            null,
                            oldWidget,
                            newWidget,
                            false
                        );
                    };

                });
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenterHorisontally() {
        // Center horisontally across page
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignCenterHorisontally', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = window.innerWidth / 2;

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                this.currentWidgets[i].containerLeft = x -
                    (this.currentWidgets[i].containerWidth / 2);
                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                // Add to Action log
                if (oldWidget != null) {
                    this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        oldWidget.id,
                        'Widget',
                        'Edit',
                        'AlignCenter',
                        'App clickMenuArrangeAlignCenter',
                        null,
                        null,
                        oldWidget,
                        newWidget,
                        false
                    );
                };

            });
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeAlignCenterVertically() {
        // Center vertically across page
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeAlignCenterVertically', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = window.innerHeight / 2;

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                this.currentWidgets[i].containerTop = x -
                    (this.currentWidgets[i].containerHeight / 2);
                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                // Add to Action log
                if (oldWidget != null) {
                    this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        oldWidget.id,
                        'Widget',
                        'Edit',
                        'AlignCenter',
                        'App clickMenuArrangeAlignCenter',
                        null,
                        null,
                        oldWidget,
                        newWidget,
                        false
                    );
                };

            });
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeGroup() {
        // Groups the selected Widgets into a single group
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeGroup', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeUnGroup', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeDistributeHorisontal', '@Start');

        // Get selected, sorted by .left  = [Wi]
        let selectedOnes = [];

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
            oldWidget = JSON.parse(JSON.stringify(
                this.currentWidgets[selectedOnes[i].position])
            );

            if (i > 0) {

                selectedOnes[i].newLeft = selectedOnes[i-1].newLeft +
                    selectedOnes[i-1].width + g;
                this.currentWidgets[selectedOnes[i].position].containerLeft =
                    selectedOnes[i].newLeft;
                // this.globalVariableService.currentWidgets[selectedOnes[i].position].
                //     containerLeft = selectedOnes[i].newLeft;

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[selectedOnes[i]
                    .position]));
            } else {
                // selectedOnes[i].newLeft = selectedOnes[i].newLeft;

            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[selectedOnes[i
                ].position]).then(res => {

                // Add to Action log
                if (oldWidget != null) {
                    this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        oldWidget.id,
                        'Widget',
                        'Edit',
                        'AlignCenter',
                        'App clickMenuArrangeAlignCenter',
                        null,
                        null,
                        oldWidget,
                        newWidget,
                        false
                    );
                };

            });
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeDistributeVertical() {
        // Vertically arrange selected Ws, equally spaced
        // Assume the selected Ws are W1 (first), W2, ..., Wn (last)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeDistributeVertical', '@Start');

        // Get selected, sorted by .top  = [Wi]
        let selectedOnes = [];

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
            oldWidget = JSON.parse(JSON.stringify(
                this.currentWidgets[selectedOnes[i].position])
            );

            if (i > 0) {
                selectedOnes[i].newTop = selectedOnes[i-1].newTop +
                    selectedOnes[i-1].height + g;
                this.currentWidgets[selectedOnes[i].position].containerTop =
                    selectedOnes[i].newTop;
                this.globalVariableService.currentWidgets[selectedOnes[i].position].
                    containerTop = selectedOnes[i].newTop;

                newWidget = JSON.parse(JSON.stringify(this.currentWidgets[selectedOnes[i]
                    .position]));
                } else {
                // selectedOnes[i].newTop = selectedOnes[i].newTop;
            };

            // Save to DB
            this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                // Add to Action log
                if (oldWidget != null) {
                    this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        oldWidget.id,
                        'Widget',
                        'Edit',
                        'AlignCenter',
                        'App clickMenuArrangeAlignCenter',
                        null,
                        null,
                        oldWidget,
                        newWidget,
                        false
                    );
                };

            });
        };

        this.menuOptionClickPostAction();

    }

    clickMenuArrangeSameSize() {
        // Make selected Ws same size, height and width
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;
        let y: number = -1;

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {

                if (x === -1) {
                    x = this.currentWidgets[i].containerWidth;
                    y = this.currentWidgets[i].containerHeight;
                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    this.currentWidgets[i].containerWidth = x;
                    this.currentWidgets[i].containerHeight = y;

                    // Calc the graph dimensions
                    this.currentWidgets[i].graphHeight =
                    this.globalVariableService.calcGraphHeight(this.currentWidgets[i]);

                    this.currentWidgets[i].graphWidth =
                    this.globalVariableService.calcGraphWidth(this.currentWidgets[i]);

                    // Refresh graphs
                    if (this.currentWidgets[i].widgetType === 'Graph') {
                        this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
                    };
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    // Save to DB
                    this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                        // Add to Action log
                        if (oldWidget != null) {
                            this.globalVariableService.actionUpsert(
                                null,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                                oldWidget.id,
                                'Widget',
                                'Edit',
                                'AlignCenter',
                                'App clickMenuArrangeAlignCenter',
                                null,
                                null,
                                oldWidget,
                                newWidget,
                                false
                            );
                        };

                    });
                };
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeSameSizeVertically() {
        // Make selected Ws same Height (vertically)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let y: number = -1;

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (y === -1) {
                    y = this.currentWidgets[i].containerHeight;

                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    this.currentWidgets[i].containerHeight = y;

                    // Calc the graph dimensions
                    this.currentWidgets[i].graphHeight =
                        this.globalVariableService.calcGraphHeight(this.currentWidgets[i]);

                    // Refresh graphs
                    if (this.currentWidgets[i].widgetType === 'Graph') {
                        this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
                    };
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    // Save to DB
                    this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                        // Add to Action log
                        if (oldWidget != null) {
                            this.globalVariableService.actionUpsert(
                                null,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                                oldWidget.id,
                                'Widget',
                                'Edit',
                                'AlignCenter',
                                'App clickMenuArrangeAlignCenter',
                                null,
                                null,
                                oldWidget,
                                newWidget,
                                false
                            );
                        };

                    });
                };
            };
        };

        this.menuOptionClickPostAction();
    }

    clickMenuArrangeSameSizeHorisontally() {
        // Make selected Ws same width (horisontally)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuArrangeSameSize', '@Start');

        if (!this.checkForMultipleWidgets()) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        let x: number = -1;

        // Deep copy of old-, newW
        let oldWidget: Widget = null;
        let newWidget: Widget = null;

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x === -1) {
                    x = this.currentWidgets[i].containerWidth;

                } else {
                    oldWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    this.currentWidgets[i].containerWidth = x;

                    this.currentWidgets[i].graphWidth =
                        this.globalVariableService.calcGraphWidth(this.currentWidgets[i]);

                    // Refresh graphs
                    if (this.currentWidgets[i].widgetType === 'Graph') {
                        this.globalVariableService.changedWidget.next(this.currentWidgets[i]);
                    };
                    newWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));

                    // Save to DB
                    this.globalVariableService.saveWidget(this.currentWidgets[i]).then(res => {

                        // Add to Action log
                        if (oldWidget != null) {
                            this.globalVariableService.actionUpsert(
                                null,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                                oldWidget.id,
                                'Widget',
                                'Edit',
                                'AlignCenter',
                                'App clickMenuArrangeAlignCenter',
                                null,
                                null,
                                oldWidget,
                                newWidget,
                                false
                            );
                        };

                    });
                };
            };
        };

        this.menuOptionClickPostAction();
    }





    // ***********************  CLICK HELP MENU OPTIONS ************************ //

    clickMenuHelpDemo() {
        // Help: Demo
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuHelpDemo', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.globalVariableService.testBingMaps();
        if (this.menuOptionClickPreAction()) {
            return;
        };


        // Send WebSocket Message
        // this.webSocketChat.sendMsg("Test Message");

        this.socket.emit('canvasNS', 'Test HELP message');



        // this.router.navigate(['/help']);

        this.menuOptionClickPostAction();
        // db.[table].where(index).above(value).and(filterFunction).count()
        // .and((disc: IDiscountlist) => {
        //     return disc.MatrixType === matrixType

        this.dbDataCachingTable.table("localDataCachingTable")
            .where('key').equals('dashboards')
            // .and(res => res.serverCacheable)
            .toArray(res => console.log('where', res[0]))

    }

    clickHelpGettingStarted() {
        // Help: Getting Started
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpGettingStarted', '@Start')

        // Get GV values
        let resource: string = 'dashboards';            // Works !
        // let resource: string = 'datasources';        // Works !
        // this.globalVariableService.getResource(resource).then(res => {
        //     let testDashboards: Dashboard[];
        //     testDashboards = res;

        // });

        this.globalVariableService.refreshLocalCache()
        // // Count
        // this.dbCanvasAppDatabase.table("localDashboards").count(res => {
        // });

        // // Count
        // this.dbDataCachingTable.table("localDataCachingTable").count(res => {
        // });

        // this.dbDataCachingTable.table("localDataCachingTable")
        //     .where('localExpiryDateTime').below(new Date())
        //     .count(res => {
        // });

        // this.dbDataCachingTable.table("localDataCachingTable")
        //     .where('localExpiryDateTime').above(new Date())
        //     .count(res => {
        // });

        // let localDashboardArray: Dashboard[] = [];
        // this.dbCanvasAppDatabase.table("localDashboards")
        //     .toArray()
        //     .then(res => {
        //         localDashboardArray = res.map(row => row.dashboard);
        //     });

    }

    clickHelpGetData() {
        // Help: Get Data
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpGetData', '@Start')

        // Reload Dashboards
        this.dbCanvasAppDatabase.table("localDashboards").count(res => {
            console.warn('xx First count', res);
        });
        this.dbCanvasAppDatabase.table("currentCanvasUser").count(res => {
            console.warn('xx Second count', res);
        });

        // Create Var with data
        let localDashboardSingle =
            {
                id: this.globalVariableService.dashboards[1].id + 2,
                dashboard: this.globalVariableService.dashboards[1],
            };

        // Add / Update DB with Put
        this.dbCanvasAppDatabase.table("localDashboards")
            .put(localDashboardSingle)
            .then(res => {
                console.warn('xx End Add/Update for 1 Dashboard');

                // Count
                this.dbCanvasAppDatabase.table("localDashboards").count(res => {
                    console.warn('xx End Add/Update for 1 Dashboard', res);
                });
            });
    }

    clickHelpCreateDashboard() {
        // Help: Create Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpTutorials', '@Start')

        // Delete a D
        let key: number = 2;
        this.dbCanvasAppDatabase.table("localDashboards")
            .delete(key)
            .then(res => {
                console.warn('xx Delete of key = ' + key.toString() + ' in localDashboards');

                // Count
                this.dbCanvasAppDatabase.table("localDashboards").count(res => {
                    console.warn('xx count after Delete of localDashboard', res);
                });
            });

        this.dbCanvasAppDatabase.table("localDashboards")
            .where('id').above(70)
            .delete()
            .then(res => {
                console.warn('xx count after delete above 70: deleted = ', res);
            });
    }

    clickHelpCreateWidget() {
        // Help: Create Widget
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpTutorials', '@Start')

        // Replace DataCachingTable

        // Create Var with data
        this.localDataCachingTable = [];
        this.localDataCachingTable = [{
            key: 'dashboards',
            objectID: null,
            messageDateTime: null,
            localCacheableDisc: false,
            localCacheableMemory: false,
            localCurrentVariableName: 'currentDashboards',
            localExpiryDateTime: new Date(),
            localLastUpdatedDateTime: new Date(),
            localLifeSpan: 86400,
            localTableName: 'dashboards',
            localThresholdLines: 10000,
            localVariableName: 'dashboards',
            serverCacheableDisc: false,
            serverCacheableMemory: false,
            serverExpiryDateTime: new Date(),
            serverLastUpdatedDateTime: new Date(),
            serverLastWSsequenceNr: 1,
            serverLifeSpan: 86400,
            serverThresholdLines: 10000,
            serverVariableName: 'dashboards'

        }];

        // Load DB with bulkPut
        this.dbDataCachingTable.table("localDataCachingTable")
            .bulkPut(this.localDataCachingTable)
            .then(res => {
                console.warn('xx End BulkPut for localDataCachingTable');

                // Count
                this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                    console.warn('xx count after bulkPut for localDataCachingTable', res);
                });
            });

        // Reload Dashboards

        // Create Var with data
        this.localDashboard = [];
        for (var i = 0; i < this.globalVariableService.dashboards.length; i++) {
            this.localDashboard.push(
                {
                    id: this.globalVariableService.dashboards[i].id,
                    dashboard: this.globalVariableService.dashboards[i],
                }
            )
        };

        // Load DB with bulkPut
        this.dbCanvasAppDatabase.table("localDashboards")
            .bulkPut(this.localDashboard)
            .then(res => {
                console.warn('xx End BulkPut for localDashboards');

                // Count
                this.dbCanvasAppDatabase.table("localDashboards").count(res => {
                    console.warn('xx count after bulkPut for localDashboard', res);
                });
            });

    }

    clickHelpTransformData() {
    // Help: Transform Data
    this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpTutorials', '@Start')

        // Clear DB
        this.dbDataCachingTable.table("localDataCachingTable").clear()
            .then(result =>
                {
                    console.log('xx CLEARED localDataCachingTable', result);

                    this.dbDataCachingTable.table("localDataCachingTable").count(res => {
                        console.warn('xx count localDataCachingTable after CLEAR', res);
                    });
                }
            )
            .catch(err => console.warn('xx err clearing localDataCachingTable', err))

        this.dbCanvasAppDatabase.table("localDashboards").clear()
            .then(result =>
                {
                    console.log('xx CLEARED localDashboards', result);

                    this.dbCanvasAppDatabase.table("localDashboards").count(res => {
                        console.warn('xx count localDashboards at START', res);
                    });                }
            )
            .catch(err => console.warn('xx err clearing localDashboards', err))

    }

    clickHelpDocumentation() {
        // Help: Documentation
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpDocumentation', '@Start')

        let foundDataCachingTable: boolean = true;
        // Count
        this.dbDataCachingTable.table("localDataCachingTable").count(res => {
            console.warn('xx count localDataCachingTable at START', res);
        });
        this.dbCanvasAppDatabase.table("localDashboards").count(res => {
            console.warn('xx count localDashboards at START', res);
        });

        // Query DB
        this.dbDataCachingTable.table("localDataCachingTable")
            .where('key').belowOrEqual('dashboards')
            .toArray(res => {
                this.localDataCachingTable = res;

                console.warn('App localDataCachingTable: ', this.localDataCachingTable);
                if (this.localDataCachingTable.length === 0) {
                    console.warn('xx Adding new here')
                    foundDataCachingTable = false;
                }
             })
            .then(data => {
                console.log('xx found', foundDataCachingTable);
                if (!foundDataCachingTable) {
                    this.dbDataCachingTable.table("localDataCachingTable").put(
                        {
                            table: 'dashboards',
                            messageDateTime: null,
                            serverCacheable: true,
                            serverLastUpdatedDateTime: new Date(),
                            serverExpiryDateTime: new Date(),
                            serverLastWSsequenceNr: 1,
                            serverUtl: 'dashboards',
                            localCacheable: true,
                            localLastUpdatedDateTime: new Date(),
                            localExpiryDateTime: new Date(),
                            localVariableName: 'dashboards',
                            localCurrentVariableName: 'currentDashboards',
                            localTableName: 'dashboards'

                        }
                    ).then(res => {
                        console.log('xx stored dbDataCachingTable', res);
                    });
                };
            })
            .catch(err => {
                console.log('xx error', err)
            })

    }

    clickHelpTutorials() {
        // Help: Demo
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickHelpTutorials', '@Start')
        // this.globalVariableService.dashboards[0].name

        // Set test var

        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }

        // Query DB
        this.dbCanvasAppDatabase.table("localDashboards")
            .where('id').belowOrEqual(2)
            .toArray(res => {
                console.warn('xx localDashboards res', res)
        })
        .then(data => {
            console.log('xx localDashboards End WHERE', {data});
        });


        // Listening to Deletions and Version Changes
        // db.on("versionchange", function(event) {
        //     if (confirm ("Another page tries to upgrade the database to version " +
        //                   event.newVersion + ". Accept?")) {
        //       // Refresh current webapp so that it starts working with newer DB schema.
        //       window.location.reload();
        //     } else {
        //       // Will let user finish its work in this window and
        //       // block the other window from upgrading.
        //       return false;
        //     }
        //   });

        // db.version(1).stores({contacts: 'id, first, last'});
        // db.open()
        //     .then(res => {
                // // Count
                // db.table("contacts").count(res => {
                // });

                // // Query DB
                // db.table("contacts")
                //     .where('id').belowOrEqual(2)

                //     })

            //     if (this.testIndexDB) {


            //         // Clear var
            //         this.dexieDB = [];

            //         // Delete DB
            //         // db.close()
            //         // db.delete().then(() => {
            //         //     console.log("Database successfully deleted");
            //         // db.open()
            //         // .then(res => {


            //         // // Clear DB
            //         db.table("contacts").clear().then(result => {


            //                 // }).catch((err) => {
            //                 //     console.error("Could not delete database");
            //                 // }).finally(() => {
            //                 //     // Do what should be done next...
            //                 // });

            //             // Msg

            //             // Load Ds individually
            //             for (var i = 0; i < 0; i++) {

            //                 db.table("contacts").put(
            //                     {
            //                         first: "First name",
            //                         last: "Last name",
            //                         dashboard: this.globalVariableService.dashboards[0],
            //                         id: i
            //                     }
            //                 ).then(res => {

            //                 });
            //             };

            //             // Msg

            //             // Load var
            //             for (var i = 0; i < 10000; i++) {
            //                 this.dexieDB.push(
            //                     {
            //                         first: "First name",
            //                         last: "Last name",
            //                         dashboard: this.globalVariableService.dashboards[0],
            //                         id: i
            //                     }
            //                 )
            //             };

            //             // Load DB with bulkPut
            //             db.table("contacts").bulkPut(this.dexieDB).then(res => {

            //                 // Count
            //                 db.table("contacts").count(res => {
            //                 });
            //             });


            //             // Msg
            //         });
            //     // });
            //     };
            // })
            // .catch((error) => {
            // });

        // // Delete DB
        // db.table("contacts").delete().catch(err => console.warn('xx Del failed', err);
        // )



        // let keys: number[] = [1, 2, 7]
        // db.table("contacts").bulkDelete(keys)

        // Count
        // db.table("contacts").count(res => {
        // })


    }








    // ***********************  CLICK COLLABORATE MENU OPTIONS ************************ //

    clickMenuCollaborateAuditTrail() {
        // Show list of Canvas AuditTrail
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateAuditTrail', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateAuditTrail = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateMessages() {
        // Show list of Canvas Messages
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateMessages', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateMessages = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateTasks() {
        // Show list of Canvas Tasks
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateTasks', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // this.showModalCollaborateActivities = true;
        this.showModalCollaborateTasks = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateTaskAdd() {
        // Add a new Task
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateTaskAdd', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateTasksNew = true;

        this.menuOptionClickPostAction();
    }

    clickMenuViewDontDisturb() {
        // Toggle Dont Disturb
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewDontDisturb', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.dontDisturb = !this.globalVariableService.dontDisturb.value;
        this.globalVariableService.dontDisturb.next(
            !this.globalVariableService.dontDisturb.value);

        this.menuOptionClickPostAction();
    }

    clickMenuViewSystemMessages() {
        // Toggle Dont Disturb
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuViewSystemMessages', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateSystemMessages = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateSendMessageAdd() {
        // Send a Canvas Message
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateSendMessage', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateSendMessage = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateSendEmailAdd() {
        // Send an Email
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuCollaborateSendEmail', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalCollaborateSendEmail = true;

        this.menuOptionClickPostAction();
    }



    // ***********************  CLICK USER MENU OPTIONS ************************ //

    clickMenuUserLogin() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserLogin', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardLogin = true;
    }

    clickMenuUserMyProfile() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserMyProfile', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Set D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id === this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                this.selectedDashboard = d;
            };
        });

        this.showModalUserMyProfile = true;
    }

    clickMenuUserPreferences() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserPreferences', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalUserPreferences = true;
    }

    clickMenuUserMyPermissions() {
        // Show My Permissions form
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserMyPermissions', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalUserMyPermissions = true;
    }

    clickMenuUserPaletteButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserPaletteButtonBar', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalUserPaletteButtonBar = true;
    }

    clickMenuUsers() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUsers', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalUsers = true;
    }

    clickMenuGroups() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuGroups', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalGroups = true;
    }

    clickMenuUserSystemSettings() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserSystemSettings', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalUserSystemSettings = true;
    }

    clickMenuUserLogout() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuUserLogout', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.showModalDashboardLogout = true;
    }





    // ***********************  CLICK PALETTE (specific) MENU OPTIONS ************************ //
    dblclickMenuPaletteEdit(
        widgetID: number = null,
        widgetIndex: number = null,
        canSave: boolean = true,
        widgetType: string = '') {
        // dblclicked the Edit option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name, 'dblclickMenuPaletteEdit', '@Start');

        // Graph type has been supplied
        if (widgetType === 'Graph') {
            this.clickMenuWidgetEdit(widgetID);
            return;
        };
        if (widgetType === 'Navigator') {
            this.clickMenuNavigatorEdit(widgetID);
            return;
        };
        if (widgetType === 'Slicer') {
            this.clickMenuSlicerEdit(widgetID);
            return;
        };
        if (widgetType === 'Table') {
            this.clickMenuTableEdit(widgetID);
            return;
        };
        if (widgetType === 'Shape') {
            this.clickMenuShapeEdit(widgetID);
            return;
        };
        if (widgetType === '') {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuPaletteExpand', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuPaletteDelete', '@Start');

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
                        if (this.checkForOnlyOneWidget('Navigator', true)) {
                            this.clickMenuNavigatorDelete();
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
        };
    }

    clickMenuPaletteDuplicate() {
        // Clicked the Duplicate option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuPaletteDuplicate', '@Start');

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

    clickMenuPaletteWidgetTitle(widgetID: number = null) {
        // Edit Title of selected W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuPaletteWidgetTitle', '@Start');

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

        // ID provided
        if (widgetID != null) {
            let selectedWidgetIndex: number = this.currentWidgets.findIndex(w =>
                w.id === widgetID
            );
            if (selectedWidgetIndex < 0) {
                this.showMessage(
                    'Widget does not exist',
                    'StatusBar',
                    'Error',
                    3000,
                    ''
                );
                return;
            }
            this.selectedWidget = this.currentWidgets[selectedWidgetIndex];
        } else {

            // Only one can be selected
            if (!this.checkForOnlyOneWidget()) {
                // TODO - why this !!!???
                this.clickMenuWidgetDuplicate('Graph');
            }

            if (!this.menuOptionClickPreAction()) {
            return;
        };

            // Indicate edit W and open Editor, which will work with selected W
            this.currentWidgets.forEach(w => {
                if (w.isSelected) {
                    this.selectedWidget = w;
                };
            });
        };

        this.showTitleForm = true;
    }






    // ***********************  LAYOUT ACTIONS  ************************ //
    clickMenuWidgetContainerDelete(index: number, widgetLayoutID: number) {
        // Clicked Delete button on Widget Layout object
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetContainerDelete', '@Start');

        // Delete from DB and Filter local Array
        this.globalVariableService.deleteResource('widgetLayouts', widgetLayoutID)
            .then(res =>
                {
                    this.widgetLayouts = this.widgetLayouts.
                        filter(wl => wl.id != widgetLayoutID);
                }
            );
    }

    clickMenuWidgetContainerAddGraph(index: number, widgetLayoutID: number) {
        // Clicked Add Graph button on Widget Layout object
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetContainerAddGraph', '@Start');

        // Create Graph, with optional dimensions set
        this.clickMenuWidgetNew(this.widgetLayouts[index]);
    }

    clickMenuWidgetContainerAddShape(index: number, widgetLayoutID: number) {
        // Clicked Add Shape button on Widget Layout object
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetContainerAddShape', '@Start');

        // Create Shape, with optional dimensions set
        this.clickMenuShapeNew(this.widgetLayouts[index]);
    }





    // ***********************  CONTEXT MENUS  ************************ //

    popupMenuOpen(ev: any, index: number, id: number, widgetLeft: number, widgetTop: number) {
        // Open context / dropdown Menu from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'popupMenuOpen', '@Start');

        // // Must be first, else default behaviour takes over
        ev.preventDefault();

        // Clicked in main area, outside a Widget
        if (index === -1) {
            this.popupLeft = ev.clientX - 40;
            this.popupTop = ev.clientY - 40;

            this.showDashboardContextMenu = true;
            // this.showMessage(
            //     'Please use menu at the top',
            //     'StatusBar',
            //     'Info',
            //     3000,
            //     ''
            // );

        } else {

            this.popupLeft = widgetLeft;
            this.popupTop = widgetTop;
            this.selectedDropdownID = index;
            this.showWidgetContextMenu = true;
            this.popupHyperlinkDashboardID = this.currentWidgets[index].hyperlinkDashboardID;

            this.popupHyperlinkDashboardTabID = this.currentWidgets[index]
                .hyperlinkDashboardTabID;
            this.popupWidgetType = this.currentWidgets[index].widgetType;
            this.popupWidgetID = this.currentWidgets[index].id;
        };
    }

    contextmenuWidgetAnnotations(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Annotations from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetAnnotations', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetAnnotations(id);

    }

    contextmenuWidgetMessages(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Messages from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetMessages', '@Start');

        // Call the function
        this.clickMenuCollaborateMessages();

    }

    contextmenuWidgetCheckpoints(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Checkpoints from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetCheckpoints', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetCheckpoints(id);

    }

    contextmenuWidgetChanges(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Changes from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetChanges', '@Start');

        // Call the function
        this.clickMenuCollaborateAuditTrail();

    }

    contextmenuWidgetShare(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Share from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetShare', '@Start');

        // Call the function
        this.clickDashboardShare();

    }

    contextmenuWidgetDataSummary(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Summary from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetDataSummary', '@Start');

        this.clickMenuWidgetDataSummary(index);

    }

    contextmenuWidgetDataQuality(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Quality from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetDataQuality', '@Start');

        // Call the function
        // this.clickMenuDashboardDetailDataQuality();

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.selectedDatasourceID = -1;
        this.currentWidgets.forEach(w => {
            if (w.id === id) {
                this.selectedDatasourceID = w.datasourceID;
            };
        });
        this.showModalDashboardDataQuality = true;

    }

    contextmenuWidgetHasFilters(index: number, id: number) {
        // Open form with filters as the selected Widget has filters
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetHasFilters', '@Start');

        // Call the function for THIS W
        this.clickWidgetFilterSummary(index);

    }
    contextmenuWidgetDataDictionary(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Dictionary, of the DS linked to current
        // W, from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetDataDictionary', '@Start');

        // Call the function for THIS W
        this.clickMenuWidgetDataDictionary(index);

    }

    contextmenuWidgetUsageStats(ev: any, index: number, id: number) {
        // Open context / dropdown Menu for Data Summary from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name, 'contextmenuWidgetUsageStats', '@Start');

        this.clickMenuDashboardUsageStats();

    }





    // ***********************  WIDGET ACTION MENU  ************************ //

    actionmenuWidgetEditor(ev: MouseEvent, index: number, id: number) {
        // Opens W Editor, for editing
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetEditor', '@Start');

        this.clickMenuWidgetEdit(id, index, true);
    }

    actionmenuWidgetExplore(ev: MouseEvent, index: number, id: number) {
        // Opens W Editor, for exploring only (cannot save)
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetExplore', '@Start');

        this.clickMenuWidgetEdit(id, index, false);
    }

    actionmenuWidgetFullScreen(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetFullScreen', '@Start');

        this.clickMenuWidgetFullScreen(index);

    }

    clickCloseFullScreen() {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickCloseFullScreen', '@Start');

        this.showWidgetFullScreenWidth = 0;
        this.showWidgetFullScreenHeight = 0;
        this.showWidgetFullScreenBorder = '';
        this.showWidgetFullScreenX = '';
        this.showWidgetFullScreenCopy = '';
        // this.showWidgetFullScreen = false;

        // this.view.renderer('svg')
        //     .initialize(this.widgetFullDOM.nativeElement)
        //     .hover()
        //     .run()
        //     .width(0)
        //     .height(0)
        //     .finalize();


        // let localWidget = Object.assign({}, this.selectedWidget);
        let localWidget: Widget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Rescale and limit amount of detail on the graph
        localWidget.containerLeft = 1;
        localWidget.containerTop = 1;
        localWidget.containerHeight = 1;
        localWidget.graphHeight = 1;
        localWidget.containerWidth = 1;
        localWidget.graphWidth = 1;
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';
        localWidget.containerBackgroundcolorName = 'white';
        localWidget.graphLayers = localWidget.graphLayers.slice(0, 1); // Remove other layers
        localWidget.graphLayers[0].graphXfield = '';
        localWidget.graphLayers[0].graphX2Field = '';
        localWidget.graphLayers[0].graphYfield = '';
        localWidget.graphLayers[0].graphX2Field = '';
        localWidget.graphLayers[0].graphY2Field = '';
        localWidget.graphLayers[0].graphRowField = '';
        localWidget.graphLayers[0].graphColumnField = '';
        localWidget.graphLayers[0].graphProjectionFieldLatitude = '';
        localWidget.graphLayers[0].graphProjectionFieldLongitude = '';
        localWidget.graphLayers[0].graphMark = 'circle';

        // let definition = this.globalVariableService.createVegaLiteSpec(localWidget);

        // let specification = compile(definition).spec;
        // this.view = new View(parse(specification));

        // this.view.renderer('svg')
        //     .initialize(this.widgetFullDOM.nativeElement)
        //     .hover()
        //     .run()
        //     .finalize();

        // TODO - this should be done more efficiently, but simply clearing the SVG object
        // Render graph for Vega-Lite
        if (localWidget.visualGrammar === 'Vega-Lite') {

            // Create specification
            let specification: any = this.globalVariableService.createVegaLiteSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let vegaSpecification = compile(specification).spec;
            let view = new View(parse(vegaSpecification));

            view.renderer('svg')
                .initialize(this.widgetFullDOM.nativeElement)
                .width(1)
                .hover()
                .run()
                .finalize();
        };

        // Render graph for Vega
        if (localWidget.visualGrammar === 'Vega') {

            // Create specification
            let specification: any = this.globalVariableService.createVegaSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let view = new View(parse(specification));
            view.renderer('svg')
                .initialize(this.widgetFullDOM.nativeElement)
                .width(1)
                .hover()
                .run()
                .finalize();
        };
    }

    actionmenuWidgetDescription(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetDescription', '@Start');

        this.clickMenuWidgetDescription(id, index)
    }

    actionmenuWidgetEditTitle(ev: MouseEvent, index: number, id: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetEditTitle', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id === id) {
                this.selectedWidget = w;
            };
        });

        this.showTitleForm = true;
    }

    actionmenuWidgetExpand(ev: MouseEvent, index: number, id: number) {
        // Expand the data for this Widget
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetExpand', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id === id) {
                w.isSelected = true;
                this.selectedWidget = w;
            } else {
                w.isSelected = false;
            };
        });

        this.clickMenuWidgetExpand();
        this.menuOptionClickPostAction();
    }

    actionmenuWidgetFlipToTable(id: number) {
        // Change type to Graph for a Table
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetFlipToTable', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id === id) {
                w.widgetType = 'Table'
            };
        });

        this.menuOptionClickPostAction();
    }

    actionmenuWidgetFlipToGraph(id: number) {
        // Change type to Table for a Graph
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetFlipToGraph', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id === id) {
                w.widgetType = 'Graph'
            };
        });

        this.menuOptionClickPostAction();    }

    actionmenuWidgetCopyImage(ev: MouseEvent, index: number, id: number) {
        // Opens W full screen)
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuWidgetCopyImage', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'actionmenuJumpToLinked', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        // Exit if no Dashboard to jump to
        if (dashboardID == null) {
            return;
        };

        // Tab points to first one, if needed
        if (dashboardTabID == null) {
            dashboardTabID = -1;
        };

        // Remember this
        this.globalVariableService.lastDashboardOpened.wasHyperlink = true;
        this.globalVariableService.lastDashboardOpened.lastDashboardID =
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.globalVariableService.lastDashboardOpened.lastDashboardTabID =
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        if (this.globalVariableService.lastDashboardOpened.lastDashboardTabID == null) {
            this.globalVariableService.lastDashboardOpened.lastDashboardTabID = -1;
        };

        // Jump to Dashboard
        this.globalVariableService.refreshCurrentDashboard(
            'app-actionmenuJumpToLinked', dashboardID, dashboardTabID, ''
        );
    }




    // ***********************  OTHER  ************************ //

    clickPaletteDragStart(ev: MouseEvent) {
        // Register start of Palette drag event
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPaletteDragStart', '@Start');

        this.startX = ev.x;
        this.startY = ev.y;
    }

    clickPaletteDragEnd(ev: MouseEvent) {
        // Move the Palette at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPaletteDragEnd', '@Start');

        // Get final coordinates of cursor after move
        this.endX = ev.x;
        this.endY = ev.y;

        // Move the Palette
        this.paletteLeft = this.paletteLeft - this.startX + this.endX;
        this.paletteTop = this.paletteTop - this.startY + this.endY;

        // Save to DB
        this.globalVariableService.currentUser.lastPaletteLeft = this.paletteLeft;
        this.globalVariableService.currentUser.lastPaletteTop = this.paletteTop;
        this.globalVariableService.saveResource(
            'canvasUsers', 
            this.globalVariableService.currentUser
        );
    }

    showRecentDashboard(index: number) {
        // Open a Recently used D
        this.globalFunctionService.printToConsole(this.constructor.name, 'showRecentDashboard', '@Start');

        // Set the EditMode as it was previously
        // this.globalVariableService.editMode.next(this.recentDashboards[index].editMode);

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickShowMenu', '@Start');

        // Reset vars
        this.showMainMenu = true;
    }

    trackWidget(index, row) {
        //
        // this.globalFunctionService.printToConsole(this.constructor.name, 'trackWidget', '@Start');

        // console.log('trackWidget', row);
        return row ? row.id : undefined;
    }

    checkForOnlyOneWidget(widgetType: string = 'All', silent: boolean = false): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name, 'checkForOnlyOneWidget', '@Start');

        // Get nr of W selected
        let nrWidgetsSelected: number = this.currentWidgets.filter(
            w => (w.isSelected  &&  (w.widgetType === widgetType  ||  widgetType === 'All')
                 ) ).length;

        // Show messages if silent = false
        if (nrWidgetsSelected === 0) {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'checkForMultipleWidgets', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidgetContainerDragStart', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        this.startX = ev.x;
        this.startY = ev.y;

        this.menuOptionClickPostAction();
    }

    clickWidgetContainerDragEnd(ev: MouseEvent, id: number) {
        // Move the W containter at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidgetContainerDragEnd', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {

            // Done with resizing
            this.isBusyResizing = false;
            return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Get final coordinates of cursor after move
        this.endX = ev.x;
        this.endY = ev.y;

        // Create array to loop on
        this.draggableWidgets = [];
        // There is no group
        if (this.widgetGroup.length === 0) {
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'moveWidgets', '@Start');

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
                    // let actID: number = this.globalVariableService.actionUpsert(
                    //     null,
                    //     this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    //     this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    //     w.id,
                    //     'Widget',
                    //     'Edit',
                    //     'Move',
                    //     'App moveWidgets',
                    //     null,
                    //     null,
                    //     w,
                    //     null,
                    //     false               // Dont log to DB yet
                    // );

                    let oldWidget: Widget = JSON.parse(JSON.stringify(w));

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

                    let newWidget: Widget = JSON.parse(JSON.stringify(w));

                    // Save to DB
                    this.globalVariableService.saveWidget(w).then(res => {

                        // Add to action log
                        this.globalVariableService.actionUpsert(
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
                            oldWidget,
                            newWidget
                        );
                    });
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidgetSlicerev', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

        this.clickedSlicerItem = true;
    }

    clickTemplateWidget() {
        // Click Template W object
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickTemplateWidget', '@Start');

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

    clickWidgetGraph(ev: any, index: number, widgetID: number) {
        // Click Graph in W
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidgetGraph', '@Start');

        console.warn('xxclickWidgetGraph', ev);

    }

    clickWidget(ev: MouseEvent, index: number, id: number) {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickWidget', '@Start');

        // Reset popup menu
        this.showWidgetContextMenu = false;

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
            if ( (w.id === id)  ||  (this.widgetGroup.indexOf(id) >= 0) ) {
                w.isSelected = isSelected;
            };
        });

        this.globalVariableService.currentWidgets.forEach(w => {
            if ( (w.id === id)  ||  (this.widgetGroup.indexOf(id) >= 0) ) {
                w.isSelected = isSelected;
            };
        });

    }

    clickBulletJump(linkedTabID: number) {
        // Jump to the linked Tab
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickBulletJump', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickResizeWidgetDown', '@Start');

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickResizeWidgetUp', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Deep copy existing W
        // let oldWidget: Widget = Object.assign({}, this.currentWidgets[index]);
        let oldWidget: Widget = JSON.parse(JSON.stringify(this.currentWidgets[index]));

        // Top moved: adjust the height & top
        if (resizeTop) {

            // Adjust Container Top
            this.currentWidgets[index].containerTop =
                this.currentWidgets[index].containerTop - this.startY + ev.y;

            // Adjust Container Height
            this.currentWidgets[index].containerHeight =
                Math.max(this.minWidgetContainerHeight,
                    this.currentWidgets[index].containerHeight - ev.y + this.startY);
        };

        // Right moved: adjust the width
        if (resizeRight) {

            // Adjust Container Width
            this.currentWidgets[index].containerWidth =
                Math.max(this.minWidgetContainerWidth,
                    this.currentWidgets[index].containerWidth - this.startX + ev.x);
        };

        // Bottom moved: adjust the height
        if (resizeBottom) {

            // Adjust Container Height
            this.currentWidgets[index].containerHeight =
                Math.max(this.minWidgetContainerHeight,
                    this.currentWidgets[index].containerHeight - this.startY + ev.y);
        };

        // Left moved: adjust the width & left
        if (resizeLeft) {

            // Adjust Container Left
            this.currentWidgets[index].containerLeft =
                this.currentWidgets[index].containerLeft - this.startX + ev.x;

            // Adjust Container Width
            this.currentWidgets[index].containerWidth =
                Math.max(this.minWidgetContainerWidth,
                    this.currentWidgets[index].containerWidth - ev.x + this.startX);
        };

        // Calc the graph dimensions
        // this.currentWidgets[index].graphHeight =
        // this.globalVariableService.calcGraphHeight(this.currentWidgets[index]);

        // this.currentWidgets[index].graphWidth =
        // this.globalVariableService.calcGraphWidth(this.currentWidgets[index]);

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
        if (this.currentWidgets[index].widgetType === 'Graph') {

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'showMessage', '@Start');

        // Audible clue
        if (this.globalVariableService.currentUser != undefined) {
            if (this.globalVariableService.currentUser.preferencePlaySound) {
                let audio = new Audio('./assets/Click2.wav');
                audio.play();
            };
        };

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
        if (message === this.globalVariableService.canvasSettings.notInEditModeMsg) {
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

    showWidgetForSlicer(id: number) {
        // Returns True if a Widget is related to the selected Sl(s)
        // TODO - put back, but this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name, 'showWidgetForSlicer', '@Start');

        // Get list of selected Sl
        let result: boolean = false;
        this.currentWidgets.forEach(sl => {
            if (sl.isSelected   &&   sl.widgetType === 'Slicer'
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickToggleShowCheckpoint', '@Start');

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

                if (wo.dashboardID === dashboardID  &&  wo.id === id) {
                    wo.showCheckpoints = false;
                    this.globalVariableService.changedWidget.next(wo);
                };
            });
            return;
        };

        // Remember the original W once
        let isFound: boolean = false;
        this.currentWidgetsOriginals.forEach(wo => {
            if (wo.dashboardID === dashboardID
                && wo.id === id) {
                    isFound = true;
            };
        });
        if (!isFound) {
            this.currentWidgetsOriginals.push(this.currentWidgets[index]);
        };

        // Get the W Checkpoints once
        if (this.currentWidgetCheckpoints.length === 0) {

            // Set the data
            this.currentWidgetCheckpoints = this.globalVariableService.currentWidgetCheckpoints;

            this.currentWidgets.forEach( w=> {
                // Toggle showCheckpoints
                if (w.dashboardID === dashboardID  &&  w.id === id) {
                    w.showCheckpoints = !w.showCheckpoints;
                };

                // Set the Checkpoints for this W
                this.currentWidgetCheckpoints.forEach(wc => {
                    if (wc.widgetID === w.id
                        &&
                        wc.dashboardID === w.dashboardID) {
                        wc.widgetSpec.showCheckpoints = true;
                        wc.widgetSpec.checkpointIDs = w.checkpointIDs;
                        wc.widgetSpec.currentCheckpoint = w.currentCheckpoint;
                        wc.widgetSpec.lastCheckpoint = w.lastCheckpoint;

                        // TODO - decide if this must stay or go; inherit original or not ??
                        // wc.widgetSpec.containerBackgroundcolor = w.containerBackgroundcolor
                        // wc.widgetSpec.containerBackgroundcolorName = w.containerBackgroundcolorName;
                        // wc.widgetSpec.containerBorder = w.containerBorder
                        // wc.widgetSpec.containerBorderRadius = w.containerBorderRadius
                        // wc.widgetSpec.containerBoxshadow = w.containerBoxshadow

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
                    wc.id === this.currentWidgets[index].checkpointIDs[0]
                );
                if (newW != undefined) {
                    if (newW.length > 0) {
                        let newWspec: Widget = newW[0].widgetSpec;

                        // Change it on the UI
                        this.globalVariableService.changedWidget.next(newWspec);
                    };
                };
            };
        } else {
            // Toggle showCheckpoints
            this.currentWidgets.forEach( w=> {
                if (w.dashboardID === dashboardID  &&  w.id === id) {
                    w.showCheckpoints = !w.showCheckpoints;
                };
            });

            // Show the first Checkpoint
            // If only one Chkpnt, then we dont show the <> arrows, so one cannot navigiate.
            if (this.currentWidgets[index].checkpointIDs.length > 0) {

                // Get the W Spec
                let newW: WidgetCheckpoint[] = this.currentWidgetCheckpoints.filter(wc =>
                    wc.id === this.currentWidgets[index].checkpointIDs[0]
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickAnimateCheckpoint', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickNavCheckpoint', '@Start');

        // Increment or Decrement
        if (direction === 'Right') {
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
            wc.id === checkpointIDs[currentCheckpoint]
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'deleteWidget', '@Start');

        // Delete the local one
        // let delIDs: number[] = [];
        let deleteWidget: Widget;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            // Get given ID, else all selected of the given widgetType
            if (  (widgetID != null  &&  this.currentWidgets[i].id === widgetID)
                   ||
                   (widgetType != null
                    &&  this.currentWidgets[i].isSelected
                    &&  this.currentWidgets[i].widgetType === widgetType)
                ) {

                // deleteWidget = Object.assign({}, this.currentWidgets[i]);
                deleteWidget = JSON.parse(JSON.stringify(this.currentWidgets[i]));
                // delIDs.push(this.currentWidgets[i].id);
                this.currentWidgets.splice(i,1);
            };
        };

        // Delete W + Chkpnts from the DB and global ones
        this.globalVariableService.deleteWidget(deleteWidget.id).then(w => {

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                deleteWidget.id,
                'Widget',
                'Delete',
                '',
                'App deleteWidget',
                null,
                null,
                deleteWidget,
                null
            );
        });

    }

    menuOptionClickPreAction(): boolean {
        // Actions performed at the START of a menu item click, PRE any other work
        this.globalFunctionService.printToConsole(this.constructor.name, 'menuOptionClickPreAction', '@Start');

        this.modalFormOpen = true;
        this.showPopupMessage = false;

        // If no user logged in, then must login first
        if (this.currentUserID === ''  ||  this.currentUserID == null) {
            this.showModalDashboardLogin = true;
            return false;
        };

        // Reset previous Dashboard to not be a hyperlink (for Backspace key)
        this.globalVariableService.lastDashboardOpened.wasHyperlink = false;

        // Return
        return true;
    }

    menuOptionClickPostAction() {
        // Actions performed at the END of a menu item click, POST any other work
        this.globalFunctionService.printToConsole(this.constructor.name, 'menuOptionClickPostAction', '@Start');

        this.modalFormOpen = false;
        this.showPopupMessage = false;
    }

    clickGotIt() {
        // Unshow popup message to help user get into Edit Mode
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickGotIt', '@Start');

        this.showPopupMessage = false;

        this.globalVariableService.currentUser.lastAppShowPopupMessageGotIt = true;
        this.globalVariableService.saveResource(
            'canvasUsers', 
            this.globalVariableService.currentUser
        );
    }

    clickMenuWidgetDuplicate(widgetType: string) {
        // Duplicate selected Widget
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickMenuWidgetDuplicate', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Make a (new) duplicate of a Deep copy
                // this.clipboardWidget = Object.assign({}, w)
                this.clipboardWidget = JSON.parse(JSON.stringify(w));;
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

    paletteFunctionCall(methodName: string, methodParam) {
        // Call function in Var from Customised portion of Palette
        this.globalFunctionService.printToConsole(this.constructor.name, 'paletteFunctionCall', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'paletteFunctionCall', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log("dragstartPaletteButton", ev);
    }

    dragendPaletteButton(ev, functionName: string) {
        // Dragged a Palette button onto the D
        this.globalFunctionService.printToConsole(this.constructor.name, 'paletteFunctionCall', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log("dragendPaletteButton", ev);

        if (functionName === 'clickMenuWidgetNew') {

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'dashboardOpenActions', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clearDashboard', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'setPaletteHeightAndWidth', '@Start');

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPaletteCopyDimensions', '@Start');

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

        if (!this.menuOptionClickPreAction()) {
            return;
        };

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
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickPalettePasteDimensions', '@Start');

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
        if ((this.widgetDimenstions.width === 0)
            ||  (this.widgetDimenstions.height === 0) ) {
                this.showMessage(
                    'No Dimensions copied previously',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );
                return;
        };

        if (!this.menuOptionClickPreAction()) {
            return;
        };

        // Apply to all selected Ws
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Recall the Dimensions
                w.containerWidth = this.widgetDimenstions.width;
                w.containerHeight = this.widgetDimenstions.height;


                // Calc the graph dimensions
                w.graphHeight = this.globalVariableService.calcGraphHeight(w);
                w.graphWidth = this.globalVariableService.calcGraphWidth(w);

                // Refresh graphs
                if (w.widgetType === 'Graph') {

                    this.globalVariableService.changedWidget.next(w);
                };

                // Save to DB
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
        this.globalFunctionService.printToConsole(this.constructor.name, 'togglePaletteHorisontal', '@Start');

        // Toggle horisontal / vertical
        let newAngle: boolean = !this.globalVariableService.preferencePaletteHorisontal.value;

        // Update user pref
        this.globalVariableService.updateCurrentUserProperties(
            {
                preferencePaletteHorisontal: newAngle   /// !this.globalVariableService.currentUser.preferencePaletteHorisontal
            }
        );

        // Propagate through system
        this.globalVariableService.preferencePaletteHorisontal.next(
            newAngle
        );
    }

    clickDashboard() {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name, 'clickDashboard', '@Start');

        // Exit if busy with mouse down and up
        if (this.dashboardStartX != this.dashboardEndX  ||
            this.dashboardStartY != this.dashboardEndY) {
            return;
        };

        // Close popup menu
        this.showWidgetContextMenu = false;
        this.showDashboardContextMenu = false;

        // Unselect all Ws
        this.clickMenuEditSelectAllNone('None');
        this.dashboardStartX = 0;
        this.dashboardEndX = 0;
        this.dashboardStartY = 0;
        this.dashboardEndY = 0;
    }

    mousedownDashboard(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name, 'mousedownDashboard', '@Start');

        // Store X & Y
        this.dashboardStartX = ev.x;
        this.dashboardStartY = ev.y
        this.dashboardEndX = 0;
        this.dashboardEndY = 0;

        // Start Rubberband
        // this.rubberbandShow = true;
        // this.rubberbandHeight = 20;
        // this.rubberbandWidth = 20;
        // this.rubberbandLeft = ev.x;
        // this.rubberbandTop = ev.y;
    }

    // mousemoveDashboard(ev: any) {
    //     // Toggles Palette - horisontal / vertical
    //     this.globalFunctionService.printToConsole(this.constructor.name, 'mousemoveDashboard', '@Start');

    //     // Store X & Y
    // }

    mouseupDashboard(ev: any) {
        // Toggles Palette - horisontal / vertical
        this.globalFunctionService.printToConsole(this.constructor.name, 'mouseupDashboard', '@Start');

        // Store X & Y
        this.dashboardEndX = ev.x;
        this.dashboardEndY = ev.y;

        // Exit if clicked one spot
        if (this.dashboardStartX === this.dashboardEndX  &&
            this.dashboardStartY === this.dashboardEndY) {
            return;
        };


        // Start Rubberband
        // this.rubberbandShow = false;
        // this.rubberbandHeight = 0;
        // this.rubberbandWidth = 0;
        // this.rubberbandLeft = 0;
        // this.rubberbandTop = 0;

        // Unselect all Ws
        this.clickMenuEditSelectAllNone('None');

        // Select Ws within the range
        let insideX: boolean = false;
        let insideY: boolean = false;
        this.currentWidgets.forEach(w => {
            insideX = false;
            insideY = false;
            if (
                    (w.containerLeft >= this.dashboardStartX  &&
                     w.containerLeft <= this.dashboardEndX
                    )
                    ||
                    (w.containerLeft <= this.dashboardStartX  &&
                     w.containerLeft >= this.dashboardEndX
                    )
                ) {
                    insideX = true;
            };

            if (
                    (w.containerTop >= this.dashboardStartY  &&
                     w.containerTop <= this.dashboardEndY
                    )
                    ||
                    (w.containerTop <= this.dashboardStartY  &&
                     w.containerTop >= this.dashboardEndY
                    )
                ) {
                    insideY = true;
            };

            if (insideX  &&  insideY) {
                w.isSelected = true;
            };

        });
    }

    setFeatures() {
        // Toggles Menu Option (disables/not) based on license
        this.globalFunctionService.printToConsole(this.constructor.name, 'setFeatures', '@Start');

        // Activate the menu options

        // TODO - Fix this !!!
        let userAllowedFeatures: string[] = [];
        userAllowedFeatures.push('allowMenuEditMode');
        userAllowedFeatures.push('allowMenuEditUndo');
        userAllowedFeatures.push('allowMenuEditRedo');
        userAllowedFeatures.push('allowMenuSelectAll');
        userAllowedFeatures.push('allowMenuSelectNone');
        userAllowedFeatures.push('allowMenuContainerStylesAdd');
        userAllowedFeatures.push('allowMenuContainerStylesEdit');
        userAllowedFeatures.push('allowMenuManageColours');

        userAllowedFeatures.push('allowMenuDashboardNew');
        userAllowedFeatures.push('allowMenuDashboardRecent');
        userAllowedFeatures.push('allowMenuDashboardOpen');
        userAllowedFeatures.push('allowMenuDashboardDetails');
        userAllowedFeatures.push('allowMenuDashboardComments');
        userAllowedFeatures.push('allowMenuDashboardDescription');
        userAllowedFeatures.push('allowMenuDashboardDataQuality');
        userAllowedFeatures.push('allowMenuDashboardFavourite');
        userAllowedFeatures.push('allowMenuDashboardTags');
        userAllowedFeatures.push('allowMenuDashboardTemplates');
        userAllowedFeatures.push('allowMenuDashboardThemes');
        userAllowedFeatures.push('allowMenuDashboardUsageStats');
        userAllowedFeatures.push('allowMenuDashboardSave');
        userAllowedFeatures.push('allowMenuDashboardSaveAs');
        userAllowedFeatures.push('allowMenuDashboardExport');
        userAllowedFeatures.push('allowMenuDashboardRename');
        userAllowedFeatures.push('allowMenuDashboardDiscard');
        userAllowedFeatures.push('allowMenuDashboardShare');
        userAllowedFeatures.push('allowMenuDashboardSnapshots');
        userAllowedFeatures.push('allowMenuDashboardSchedulesManage');
        userAllowedFeatures.push('allowMenuDashboardSchedulesShowAll');
        userAllowedFeatures.push('allowMenuDashboardScheduleLog');
        userAllowedFeatures.push('allowMenuDashboardSubscribe');
        userAllowedFeatures.push('allowMenuDashboardPrint');
        userAllowedFeatures.push('allowMenuDashboardDelete');
        userAllowedFeatures.push('allowMenuDashboardDeleteBulk');

        userAllowedFeatures.push('allowMenuDatasourceCreate');
        userAllowedFeatures.push('allowMenuDatasourceCreateCSV');
        userAllowedFeatures.push('allowMenuDatasourceCreateJSON');
        userAllowedFeatures.push('allowMenuDatasourceCreateSpeadsheet');
        userAllowedFeatures.push('allowMenuDatasourceCreateGoogleSheets');
        userAllowedFeatures.push('allowMenuDatasourceCreateQueryBuilder');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectSQL');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectNoSQL');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectService');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectWeb');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectImport');
        userAllowedFeatures.push('allowMenuDatasourceCreateDirectExport');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedConnections');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedQueryBuilder');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedSQL');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedGraphQL');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedNoSQL');
        userAllowedFeatures.push('allowMenuDatasourceCreateManagedNeo4j');
        userAllowedFeatures.push('allowMenuDatasourceBusinessGlossary');
        userAllowedFeatures.push('allowMenuDatasourceDataDictionary');
        userAllowedFeatures.push('allowMenuDatasourceOwnership');
        userAllowedFeatures.push('allowMenuDatasourceDataQuality');
        userAllowedFeatures.push('allowMenuDatasourceEdit');
        userAllowedFeatures.push('allowMenuDatasourceDescriptions');
        userAllowedFeatures.push('allowMenuDatasourceOverview');
        userAllowedFeatures.push('allowMenuDatasourceShare');
        userAllowedFeatures.push('allowMenuDatasourceNetworks');
        userAllowedFeatures.push('allowMenuDatasourceCombinationsAppend');
        userAllowedFeatures.push('allowMenuDatasourceCombinationsJoin');
        userAllowedFeatures.push('allowMenuDatasourceCombinationsIntersection');
        userAllowedFeatures.push('allowMenuDatasourceCombinationsMinusSubtract');
        userAllowedFeatures.push('allowMenuDatasourceUsage');
        userAllowedFeatures.push('allowMenuDatasourceSchedulesManage');
        userAllowedFeatures.push('allowMenuDatasourceSchedulesShowAll');
        userAllowedFeatures.push('allowMenuDatasourceScheduleLogs');
        userAllowedFeatures.push('allowMenuDatasourceRefreshOnce');
        userAllowedFeatures.push('allowMenuDatasourceRefreshRepeat');
        userAllowedFeatures.push('allowMenuDatasourceDelete');

        userAllowedFeatures.push('allowMenuGraphAdd');
        userAllowedFeatures.push('allowMenuNavigatorAdd');
        userAllowedFeatures.push('allowMenuGraphEdit');
        userAllowedFeatures.push('allowMenuNavigatorEdit');
        userAllowedFeatures.push('allowMenuGraphContainer');
        userAllowedFeatures.push('allowMenuGraphDescription');
        userAllowedFeatures.push('allowMenuGraphTitleEdit');
        userAllowedFeatures.push('allowMenuGraphFullScreen');
        userAllowedFeatures.push('allowMenuGraphAnnotations');
        userAllowedFeatures.push('allowMenuGraphCheckpoints');
        userAllowedFeatures.push('allowMenuGraphComments');
        userAllowedFeatures.push('allowMenuGraphHyperlinks');
        userAllowedFeatures.push('allowMenuGraphTemplatesAdd');
        userAllowedFeatures.push('allowMenuGraphTemplatesInsert');
        userAllowedFeatures.push('allowMenuGraphCrossFilter');
        userAllowedFeatures.push('allowMenuGraphExpand');
        userAllowedFeatures.push('allowMenuGraphExport');
        userAllowedFeatures.push('allowMenuGraphBusinessGlossary');
        userAllowedFeatures.push('allowMenuGraphDataDictionary');
        userAllowedFeatures.push('allowMenuGraphDataQuality');
        userAllowedFeatures.push('allowMenuGraphDataSummary');
        userAllowedFeatures.push('allowMenuGraphRefresh');
        userAllowedFeatures.push('allowMenuGraphCopy');
        userAllowedFeatures.push('allowMenuGraphDuplicate');
        userAllowedFeatures.push('allowMenuGraphLockUnlock');
        userAllowedFeatures.push('allowMenuGraphPaste');
        userAllowedFeatures.push('allowMenuGraphDelete');
        userAllowedFeatures.push('allowMenuNavigatorDelete');

        userAllowedFeatures.push('allowMenuTableAdd');
        userAllowedFeatures.push('allowMenuTableEdit');
        userAllowedFeatures.push('allowMenuTableComments');
        userAllowedFeatures.push('allowMenuTableContainer');
        userAllowedFeatures.push('allowMenuTableCrossFilter');
        userAllowedFeatures.push('allowMenuTableDataQuality');
        userAllowedFeatures.push('allowMenuTableExpand');
        userAllowedFeatures.push('allowMenuTableExport');
        userAllowedFeatures.push('allowMenuTableDuplicate');
        userAllowedFeatures.push('allowMenuTableLockUnlock');
        userAllowedFeatures.push('allowMenuTableDelete');

        userAllowedFeatures.push('allowMenuSlicerAdd');
        userAllowedFeatures.push('allowMenuSlicerEdit');
        userAllowedFeatures.push('allowMenuSlicerComments');
        userAllowedFeatures.push('allowMenuSlicerContainer');
        userAllowedFeatures.push('allowMenuSlicerDataQuality');
        userAllowedFeatures.push('allowMenuSlicerDuplicate');
        userAllowedFeatures.push('allowMenuSlicerExpand');
        userAllowedFeatures.push('allowMenuSlicerExport');
        userAllowedFeatures.push('allowMenuSlicerLockUnlock');
        userAllowedFeatures.push('allowMenuSlicerDelete');

        userAllowedFeatures.push('allowMenuShapeAdd');
        userAllowedFeatures.push('allowMenuShapeEdit');
        userAllowedFeatures.push('allowMenuShapeComments');
        userAllowedFeatures.push('allowMenuShapeContainer');
        userAllowedFeatures.push('allowMenuShapeCopy');
        userAllowedFeatures.push('allowMenuShapeDuplicate');
        userAllowedFeatures.push('allowMenuShapeTitleEdit');
        userAllowedFeatures.push('allowMenuShapeHyperlinks');
        userAllowedFeatures.push('allowMenuShapeLockUnlock');
        userAllowedFeatures.push('allowMenuShapePaste');
        userAllowedFeatures.push('allowMenuShapeDelete');
        userAllowedFeatures.push('allowMenuShapeDeleteAll');

        userAllowedFeatures.push('allowMenuViewHideMenu')
        userAllowedFeatures.push('allowMenuViewPrintPreview')
        userAllowedFeatures.push('allowMenuViewTreeview')
        userAllowedFeatures.push('allowMenuViewShowPalette')
        userAllowedFeatures.push('allowMenuViewShowGrid')
        userAllowedFeatures.push('allowMenuViewSnapToGrid')
        userAllowedFeatures.push('allowMenuViewGridSize')
        userAllowedFeatures.push('allowMenuViewZoom')
        userAllowedFeatures.push('allowMenuViewZoom100')

        userAllowedFeatures.push('allowMenuArrangeBackward');
        userAllowedFeatures.push('allowMenuArrangeForward');
        userAllowedFeatures.push('allowMenuArrangeBack');
        userAllowedFeatures.push('allowMenuArrangeFront');
        userAllowedFeatures.push('allowMenuArrangeAlignLeft');
        userAllowedFeatures.push('allowMenuArrangeAlignCenter');
        userAllowedFeatures.push('allowMenuArrangeAlignRight');
        userAllowedFeatures.push('allowMenuArrangeAlignTop');
        userAllowedFeatures.push('allowMenuArrangeAlignMiddle');
        userAllowedFeatures.push('allowMenuArrangeAlignBottom');
        userAllowedFeatures.push('allowMenuArrangeCenterHorisontally');
        userAllowedFeatures.push('allowMenuArrangeCenterVertically');
        userAllowedFeatures.push('allowMenuArrangeGroup');
        userAllowedFeatures.push('allowMenuArrangeUngroup');
        userAllowedFeatures.push('allowMenuArrangeDistributeHorisontally');
        userAllowedFeatures.push('allowMenuArrangeDistributeVertically');
        userAllowedFeatures.push('allowMenuArrangeSameVertically');
        userAllowedFeatures.push('allowMenuArrangeSameHorisontally');
        userAllowedFeatures.push('allowMenuArrangeSameBoth');

        userAllowedFeatures.push('allowMenuHelpDemo');
        userAllowedFeatures.push('allowMenuHelpGettingStarted');
        userAllowedFeatures.push('allowMenuHelpGettingData');
        userAllowedFeatures.push('allowMenuHelpCreatingDashboard');
        userAllowedFeatures.push('allowMenuHelpCreatingWidget');
        userAllowedFeatures.push('allowMenuHelpTransformingData');
        userAllowedFeatures.push('allowMenuHelpTutorials');
        userAllowedFeatures.push('allowMenuHelpDocumentation');
        userAllowedFeatures.push('allowMenuHelpSupport');

        userAllowedFeatures.push('allowMenuActionsShowAuditTrails')
        userAllowedFeatures.push('allowMenuActionsShowMessages')
        userAllowedFeatures.push('allowMenuActionsShowTasks')
        userAllowedFeatures.push('allowMenuActionsSendMessage')
        userAllowedFeatures.push('allowMenuActionsSendEmail')
        userAllowedFeatures.push('allowMenuActionsAddTask')
        userAllowedFeatures.push('allowMenuActionsDontDisturb')
        userAllowedFeatures.push('allowMenuActionsSystemMessages')

        userAllowedFeatures.push('allowMenuSystemGroups');
        userAllowedFeatures.push('allowMenuSystemMyPermissions');
        userAllowedFeatures.push('allowMenuSystemMyProfile');
        userAllowedFeatures.push('allowMenuSystemPaletteButtonBar');
        userAllowedFeatures.push('allowMenuSystemPreferences');
        userAllowedFeatures.push('allowMenuSystemUsers');
        userAllowedFeatures.push('allowMenuSystemSettings');
        userAllowedFeatures.push('allowMenuSystemLogin');
        userAllowedFeatures.push('allowMenuSystemLogout');

        userAllowedFeatures.forEach(feature => {
            this[feature] = true;
        });

        console.log('xx allowEditMode', this.allowEditMode)
        // this['allowNavigatorAdd'] = true;
        // console.log('xx allowNavigatorAdd', this.allowNavigatorAdd)
        // let test: string = 'allowNavigatorAdd111';
        // this[test] = false;
        // console.log('xx allowNavigatorAdd 2', this.allowNavigatorAdd)
        
        
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
