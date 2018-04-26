/*
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { DOCUMENT }                   from '@angular/platform-browser';
import { ElementRef }                 from '@angular/core';
import { HostListener }               from '@angular/core';
import { Inject }                     from "@angular/core";
import { Input }                      from "@angular/core";
import { OnInit }                     from '@angular/core';
import { OnDestroy }                  from '@angular/core';
import { QueryList }                  from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';

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
import { Widget }                     from './models'
import { WidgetCheckpoint }           from './models';

import { WidgetSingleComponent }      from './widget.single.component';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';
import { Action } from 'rxjs/scheduler/Action';
import { StatusbarComponent } from './statusbar.component';


// Constants
const vlTemplate: dl.spec.TopLevelExtendedSpec =
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

    // Properties for top-level specification (e.g., standalone single view specifications)
    "background": "",
    "padding": "",
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
    "data": "",
    "mark":
        {
            "type": "",  //bar circle square tick line area point rule text
            "style": "",
            "clip": ""
        },
    "encoding":
        {
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
    @ViewChild('widgetDOM')  widgetDOM: WidgetSingleComponent;
    @ViewChild('statusbarDOM') statusbarDOM: StatusbarComponent;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

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
        if (event.code == 'PageDown'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            // this.statusbarDOM.clickShowNextTab();
            this.globalVariableService.refreshCurrentDashboard(
                'statusbar-clickShowNextTab',
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                0,
                'Next'
            );
            return;
        };
        if (event.code == 'PageUp'  &&  (!event.ctrlKey)  &&  (!event.shiftKey) ) {
            // this.statusbarDOM.clickShowPreviousTab();
            this.globalVariableService.refreshCurrentDashboard(
                'statusbar-clickShowNextTab',
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                0,
                'Next'
            );
            return;
        };


        // Move with Arrow
        if (event.key == 'ArrowRight'  ||  event.key == 'ArrowDown'  ||
            event.key == 'ArrowLeft'   ||  event.key == 'ArrowUp') {
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


    clickedSlicerItem: boolean = false;
    clipboardWidget: Widget;
    companyName: string = '';
    currentDashboardName: string = '';
    currentDatasources: Datasource[];
    currentShapeSpec: any;          // TODO - fill this var !!  not working at moment
    currentTabName: string = '';
    currentDashboardTabIndex: number = 0;
    currentTabBackgroundColor: string = '';
    currentTabColor: string = '';
    currentWidgetCheckpoints: WidgetCheckpoint[] = [];
    currentWidgets: Widget[] = [];
    currentWidgetsOriginals: Widget[] = [];
    currentWidgetDashboardTabIDs: number[] = [];  // Of current W
    draggableWidgets: number[] = [];
    editMode: boolean;
    editModePrePresentation: boolean;
    hasDashboard: boolean = false;
    hasDatasources: boolean = false;
    editMenuText: string;
    fields: Field[];
    isBusyResizing: boolean = false;
    isFirstTimeUser: boolean = false;
    minWidgetContainerHeight: number = 96;     // Smallest that W Container can get
    minWidgetContainerWidth: number = 108;     // Smallest that W Container can get
    minGraphHeight: number = 1;                // Smallest that Graph can get
    minGraphWidth: number = 1;                 // Smallest that Graph can get
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
    paletteHeight = 275;                         // Palette dimensions in px
    paletteWidth = 39;                         // Palette dimensions in px
    presentationMode: boolean;
	recentDashboards: DashboardRecent[];
    refreshGraphs: boolean = false;
    selectedDashboard: Dashboard;
    selectDatasetID: number;
    selectDatasourceID: number;
    selectedWidget: Widget;
    selectedWidgetID: number;
    selectWidgetIndex: number;
    selectedDatasourceID: number;       // DS of selecte W, -1 for D
    showGrid: boolean;
    showComments: boolean;
    showDatasourcePopup: boolean = false;
    showDataQuality: boolean;
    showModalDashboardNew: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardSnapshots: boolean = false;
    showModalDashboardShare: boolean = false;
    showModalDashboardImport: boolean = false;
    showModalDashboardDiscard: boolean = false;
    showModalDashboardLogin: boolean = false;
    showModalDashboardLogout: boolean = false;
    showModalDashboardComments: boolean = false;
    showModalDashboardDataQuality: boolean = false;
    showModalDashboardRename: boolean = false;
    showModalDashboardDetails: boolean = false;
    showModalDashboardDescription: boolean = false;
    showModalDashboardTags
    showModalDashboardSettings: boolean = false;
    showModalDashboardTheme: boolean = false;
    showModalDashboardTemplate: boolean = false;
    showModalDashboardSchedule: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalDashboardDeleteBulk: boolean = false;
    showModalDashboardTreeview: boolean = false;
    showModalDashboardSubscribe: boolean = false;
    showMainMenu: boolean = true;
    showModalWidgetContainer: boolean = false;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetLinks: boolean = false;
    showModalWidgetRefresh: boolean = false;
    showModalWidgetExpand: boolean = false;
    showModalWidgetExport: boolean = false;
    showModalWidgetDelete: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalDataAddExisting: boolean = false;
    showModalData: boolean = false;
    showModalDataSlicers: boolean = false;
    showModalWidgetTablist: boolean = false;
    showModalTableEditor: boolean = false;
    showModalDataCombination: boolean = false;
    showModalDataRefresh: boolean = false;
    showModalDataShare: boolean = false;
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
    showModalTableDelete: boolean = false;
    showModalSlicerDelete: boolean = false;
    showFavouriteDashboard: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalCollaborateAlerts: boolean = false;
    showModalCollaborateActivityAdd: boolean = false;
    showModalCollaborateSendMessage: boolean = false;
    showModalCollaborateSendEmail: boolean = false;
    showModalCollaborateMessages: boolean = false;
    showModalCollaborateActivities: boolean = false;
    showModalLanding: boolean;
    showModalUserMyProfile: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUserPaletteButtonBar: boolean = false;
    showModalUsers: boolean = false;
    showModalGroups: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showModalUserOffline: boolean = false;
    showPalette: boolean = true;
    showPopupMessage: boolean = false;
    showTitleForm: boolean = false;
    showWidgetContextMenu: boolean = false;
    snapToGrid: boolean = true;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    statusBarCancelRefresh: boolean = false;
    statusBarRunning: boolean = false;
    stuckCount: number = 0;
    titleFormLeft: number = 50;
    titleFormTop: number = 50;
    widgetGroup: number[] = [];
    zoomFactor: string = 'scale(1)';


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private router: Router,

    ) {

        // TODO - change hard coding & do via login (Server), and Standalone
        // this.globalVariableService.currentUser = {
        //     id: 1,
        //     userID: 'JannieI',
        //     password: '',
        //     firstName: '',
        //     lastName: '',
        //     nickName: '',
        //     email: '',
        //     workNumber: '',
        //     cellNumber: '',
        //     groups: ['everyone', 'admin', 'marketing'],
        //     isSuperuser: false,
        //     isStaff: false,
        //     isActive: false,
        //     dateJoined: '2017/01/01',
        //     lastLogin: '2017/01/01',
        //     colorScheme: '',
        //     startupDashboardID: 6,
        //     startupDashboardTabID: 0,
        //     gridSize: 3,
        //     environment: '',
        //     profilePicture: '',
        //     queryRuntimeWarning: 3,
        //     snapToGrid: false,
        //     favouriteDashboards: [1],
        //     isFirstTimeUser: true,
        //     isAdministrator: true,
        //     isDashboardCreator: true,
        //     isDashboardEditor: true,
        //     isDashboardSaver :true,
        //     isDashboardQA: false,
        //     isDashboardDelete: true,
        //     isDashboardAccess: true,
        //     preferencePaletteHorisontal: false,
        //     preferenceAutoSync: true,
        //     preferenceShowOpenStartupMessage: false,
        //     preferenceShowOpenDataCombinationMessage: false,
        //     preferenceShowViewStartupMessage: false,
        //     preferenceShowDiscardStartupMessage: false,
        //     preferenceDefaultTemplate: '',
        //     preferenceDefaultDateformat: 'YYYY/MM/DD',
        //     preferenceDefaultFolder: '',
        //     preferenceDefaultPrinter: 'HP 650',
        //     preferenceDefaultPageSize: 'A4',
        //     preferenceDefaultPageLayout: 'Portrait'
            
        // }
        
        // console.log('Welcome ', this.globalVariableService.currentUser.userID)
    }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get Users and Groups, async
        this.globalVariableService.getCanvasGroups();

        // TODO - fix hard coding, must be done via Login
        this.globalVariableService.getCanvasUsers().then(res => {
            this.globalVariableService.currentUser = this.globalVariableService.canvasUsers
                .filter(u => u.userID == 'JannieI')[0];
            console.log('Welcome ' + this.globalVariableService.currentUser.userID)


            this.globalVariableService.currentPaletteButtonsSelected.subscribe(i => {
                this.paletteButtons = i.sort( (obj1,obj2) => {
                    if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
                        return 1;
                    };
                    if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
                        return -1;
                    };
                    return 0;
                });
    
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
      
        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
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
            this.recentDashboards = i
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

                console.log('xx app changedWidget replaced', w, this.currentWidgets)
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
                                console.log('xx this.globalVariableService.currentDashboardInfo.value', this.globalVariableService.currentDashboardInfo.value)
                                this.refreshGraphs = false;

                                // Cater for -1, ie First T
                                if (this.globalVariableService.currentDashboardInfo.value
                                    .currentDashboardTabIndex == -1) {
                                        this.globalVariableService.currentDashboardInfo
                                            .value.currentDashboardTabIndex = 0
                                };
                                if (this.globalVariableService.currentDashboardInfo.value
                                    .currentDashboardTabID == -1) {
                                        this.globalVariableService.currentDashboardInfo
                                            .value.currentDashboardTabID = this.globalVariableService.
                                            currentDashboardTabs[this.globalVariableService.currentDashboardInfo
                                                .value.currentDashboardTabIndex].id
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
                                console.log('xx app end', this.currentWidgets);

                            }

                        )
                }
            }
        )
    }

    ngAfterViewInit() {
        //
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

        this.globalVariableService.presentationMode.unsubscribe();
        this.globalVariableService.showGrid.unsubscribe();
        this.globalVariableService.showPalette.unsubscribe();
        this.globalVariableService.hasDatasources.unsubscribe();
        this.globalVariableService.editMode.unsubscribe();
        this.globalVariableService.changedWidget.unsubscribe();
        this.globalVariableService.currentDashboardInfo.unsubscribe();

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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSave', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSave = false;
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

    handleCloseDashboardImport(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardImport', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardImport = false;
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

    handleCloseDashboardDetails(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDetails', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardDetails = false;
    }

    handleCloseDashboardDescription(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDescription', '@Start');

        this.menuOptionClickPostAction();

        // Refresh any changes to the current D
        if (action == 'Saved') {
            this.currentDashboardName = this.selectedDashboard.name;
            this.currentTabBackgroundColor = this.selectedDashboard.backgroundColor;
            this.currentTabColor = this.selectedDashboard.backgroundImage;
        };

        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTags', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardTags = false;
    }

    handleCloseDashboardSettings(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSettings', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDashboardSettings = false;
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

    handleCloseShapeEdit(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeEdit', '@Start');

        this.globalVariableService.changedWidget.next(changedWidget);

        this.menuOptionClickPostAction();

        this.showModalShapeEdit = false;
    }

    handleCloseShapeDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeDelete', '@Start');

        // Delete if so requested
        if (action == 'Delete') {
            this.deleteWidget('Shape');
        };

        this.menuOptionClickPostAction();

        this.showModalShapeDelete = false;
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

        this.globalVariableService.changedWidget.next(changedWidget);

        this.menuOptionClickPostAction();

        this.showModalDataSlicers = false;
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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

        // Add to Action log
        this.globalVariableService.actionUpsert(
            null,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
            'Widget',
            this.newWidget? 'Add' : 'Edit',
            'App handleCloseWidgetEditor',
            null,
            null,
            this.newWidget? null : this.selectedWidget,
            changedWidget
        );

        this.globalVariableService.changedWidget.next(changedWidget);

        this.menuOptionClickPostAction();
        console.log('xx app W', this.selectedWidget, changedWidget, this.currentWidgets)
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
    
    handleCloseDataAddExisting(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseData', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataAddExisting = false;
    }

    handleCloseData(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseData', '@Start');

        this.menuOptionClickPostAction();

        this.showModalData = false;
    }

    handleCloseDataCombination(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataCombination', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataCombination = false;
    }

    handleCloseDataRefresh(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataRefresh', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataRefresh = false;
    }

    handleCloseDataShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataShare', '@Start');

        this.menuOptionClickPostAction();

        this.showModalDataShare = false;
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
                'Widget',
                'Delete',
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

    handleCloseTableEditor(changedTable: Widget) {    //widgetsToRefresh: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseTableEditor', '@Start');

        this.globalVariableService.changedWidget.next(changedTable);

        this.menuOptionClickPostAction();

        this.showModalTableEditor = false;
    }

    handleCloseTableDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseTableDelete', '@Start');

        // Delete if so requested
        if (action == 'Delete') {
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

    handleCloseCollaborateAlerts(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateAlerts', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateAlerts = false;
    }

    handleCloseCollaborateMessages(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateMessages', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateMessages = false;
    }

    handleCloseCollaborateActivities(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivities', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateActivities = false;
    }

    handleCloseCollaborateActivityAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivityAdd', '@Start');

        this.menuOptionClickPostAction();

        this.showModalCollaborateActivityAdd = false;
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
    }

    handleCloseUserPreferences(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserPreferences', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserPreferences = false;
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

    handleCloseUserOffline(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserOffline', '@Start');

        this.menuOptionClickPostAction();

        this.showModalUserOffline = false;
    }





    // ***********************  CLICK EDIT MENU OPTIONS ************************ //

    clickMenuEditMode() {
        // Toggle Edit Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditMode', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.isDashboardEditor
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

        // Can only edit if we have DS
        if (!this.hasDatasources) {
            this.showMessage(
                'First Add Datasources from Data menu',
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

        // Switch off all selections if going to View Mode
        if (this.editMode) {
            this.clickMenuEditSelectAllNone('None');
        }

        // Exceed 4 ...
        this.stuckCount = 5;

        // Toggle mode
        this.globalVariableService.editMode.next(!this.editMode);

        // Register in recent
        this.globalVariableService.amendDashboardRecent(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID, 
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID); 

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
            // Previous was not an UNDO, so just reverse it
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                'Widget',
                'Undo',
                'App clickMenuEditUndo',
                filteredActions[0].id,
                null,
                filteredActions[0].newWidget,
                filteredActions[0].oldWidget
            );
            if (filteredActions[0].objectType == 'Widget') {
                if (filteredActions[0].oldWidget == null) {
                    this.deleteWidget('Graph',filteredActions[0].newWidget.id);
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
                'Widget',
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
                    this.deleteWidget('Graph',filteredActions[0].newWidget.id);
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
                            'Widget',
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
        if (!this.globalVariableService.currentUser.isDashboardCreator
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

        this.menuOptionClickPreAction();

        console.log('App clickDashboardOpen')
        this.showModalDashboardOpen = true;
    }

    clickDashboardDiscard() {
        // Discard changes made since the previous Save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDiscard', '@Start');

        // Permissions
        if (!this.globalVariableService.currentUser.isDashboardEditor
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

        // Permissions
        if (!this.globalVariableService.currentUser.isDashboardAccess
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
        if (!this.globalVariableService.currentUser.isDashboardSaver
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

        this.menuOptionClickPreAction();

        console.log('App clickDashboardSave')
        this.showModalDashboardSave = true;
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

    clickDashboardImport() {
        // Import a D from a text file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardImport', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardImport = true;
    }

    clickDashboardRename() {
        // Bulk rename D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardRename', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardRename = true;
    }

    clickMenuDashboardDetailDescription() {
        // Show the modal form to edit Descriptive detail for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailDescription', '@Start');

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

    clickMenuDashboardDetailSettings() {
        // Manage settings for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSettings', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSettings = true;
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

    clickMenuDashboardDetailSchedule() {
        // Manage Schedules for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSchedule', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSchedule = true;
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

        // Permissions
        if (!this.globalVariableService.currentUser.isDashboardDelete
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
        if (!this.globalVariableService.currentUser.isDashboardDelete
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




    // ***********************  CLICK DATA MENU OPTIONS ************************ //

    clickMenuDataAddExisting() {
        // Open DATA form for a DS that comes from a file.  The id is -1 for a new one
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromFile', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataAddExisting = true;
    }

    clickMenuDataFromFile(id: number) {
        // Open DATA form for a DS that comes from a file.  The id is -1 for a new one
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromFile', '@Start');

        // Has to be in editMode
        // if (!this.editMode) {
        //     this.showMessage(
        //         this.globalVariableService.canvasSettings.notInEditModeMsg,
        //         'StatusBar',
        //         'Warning',
        //         3000,
        //         ''
        //     );
        //     return;
        // };

        this.menuOptionClickPreAction();

        console.log('App clickMenuDataFromFile')
        this.globalVariableService.dataGetFromSwitch.next('File');
        // this.globalVariableService.showModalData.next(true);
        this.showModalData = true;
        // this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        // Add a DS from a Server
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromServer', '@Start');

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

        console.log('App clickMenuDataFromServer')
        this.globalVariableService.dataGetFromSwitch.next('Server');
        // this.router.navigate(['/data']);
        // this.globalVariableService.showModalData.next(true);
    }

    clickMenuDataCombinations(){
        // Manage combinations of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataCombinations', '@Start');

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

        this.showModalDataCombination = true;
    }

    clickMenuDataRefreshAll() {
        // Refresh all DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataRefreshAll', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataRefresh = true;
    }

    clickMenuDataShare() {
        // Manage sharing access to DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataShare', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataShare = true;
    }





    // ***********************  CLICK WIDGET MENU OPTIONS ************************ //

    clickMenuWidgetNew() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetNew', '@Start');

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
        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetEdit() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetEdit', '@Start');

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

        // Can only edit one W at a time, so ignore if multiple selected
        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });
        this.newWidget = false;
        this.newWidgetContainerLeft = 0;
        this.newWidgetContainerTop = 0;
        this.showDatasourcePopup = false;

        this.showModalWidgetEditor = true;
    }


    clickMenuWidgetContainer(widgetType: string) {
        // Show popup to edit Widget Container properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetContainer', '@Start');

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

    clickMenuWidgetCheckpoints() {
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

        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        this.menuOptionClickPreAction();

        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });
        this.showModalWidgetCheckpoints = true;
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
            }
        })
        this.showModalDashboardDataQuality = true;
    }

    clickMenuWidgetLinks() {
        // Add links to the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        if (!this.checkForOnlyOneWidget('Graph')) {
            return
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


        this.clickMenuWidgetDuplicate('Graph')
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
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
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
                'Previous copy for different Dashboard',
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

        this.duplicateSingleWidget(this.clipboardWidget);

        this.menuOptionClickPostAction();
    }

    clickMenuWidgetExpand() {
        // Expands the underlying data for the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
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
            return
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetExport = true;
    }

    clickMenuWidgetDelete() {
        // Delete the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDelete', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) {
            return
        };

        this.menuOptionClickPreAction();
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });
        this.showModalWidgetDelete = true;
    }





    // ***********************  CLICK TABLE MENU OPTIONS ************************ //

    clickMenuTableAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableAdd', '@Start');

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

    clickMenuTableEdit() {
        // Edits the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableEdit', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return
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
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return
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
            return
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
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return
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
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetExport = true;
    }

    clickMenuTableDelete() {
        // Delete selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableDelete', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalTableDelete = true;

    }




    // ***********************  CLICK SLICER MENU OPTIONS ************************ //

    clickMenuSlicerAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerAdd', '@Start');

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

        this.showModalDataSlicers = true;

    }

    clickMenuSlicerEdit() {
        // Edits the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerEdit', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return
        };

        this.menuOptionClickPreAction();

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Slicer') {
                this.selectedWidget = w;
            };
        });

        this.showModalDataSlicers = true;
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

    clickMenuSlicerComments() {
        // Manage comments for the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerComments', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return
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
            return
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
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return
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
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetExport = true;
    }

    clickMenuSlicerDelete() {
        // Delete the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerDelete', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalSlicerDelete = true;

    }





    // ***********************  CLICK SHAPE MENU OPTIONS ************************ //

    clickMenuShapeNew() {
        // Add a new Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeNew', '@Start');

        this.menuOptionClickPreAction();

        this.newWidget = true;
        this.showModalShapeEdit = true;
    }

    clickMenuShapeEdit() {
        // Edit selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeEdit', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return
        };

        this.menuOptionClickPreAction();

        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Shape') {
                this.selectedWidget = w;
            };
        });
        this.showModalShapeEdit = true;
    }

    clickMenuShapeComments() {
        // Manage comments for the selected Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeComments', '@Start');


        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return
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

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) {
            return
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalWidgetLinks = true;
    }

    clickMenuShapeDelete() {
        // Delete a Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeDelete', '@Start');

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
            return
        };
        if (!this.checkForOnlyOneWidget('Shape')) {
            return
        };

        this.menuOptionClickPreAction();

        this.showModalShapeDelete = true;
    }





    // ***********************  CLICK VIEW MENU OPTIONS ************************ //

    clickMenuViewPresentation() {
        // Show the dashboard in Presentation Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPresentation', '@Start');

        this.menuOptionClickPreAction();

        // Remember editMode setting, and switch to ViewOnly during presentation
        this. editModePrePresentation = this.editMode;
        this.globalVariableService.editMode.next(false);

        // Settings, ie Mode
        this.globalVariableService.presentationMode.next(true);
        this.showMainMenu = false;

        // Clean out previously used vars for Checkpoints
        this.currentWidgetsOriginals = [];
        this.currentWidgetCheckpoints = [];

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

    clickMenuViewShowDataQuality() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowDataQuality', '@Start');

        this.menuOptionClickPreAction();

        this.showDataQuality = !this.showDataQuality;

        this.menuOptionClickPostAction();
    }

    clickMenuViewShowComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowComments', '@Start');

        this.menuOptionClickPreAction();

        this.showComments = !this.showComments;
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
                console.log('xx f', i, this.currentWidgets[i].id, this.currentWidgets[i].containerZindex)
                                              
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
                console.log('xx f', i, this.currentWidgets[i].id, this.currentWidgets[i].containerZindex)
                                
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
                console.log('xx f', i, this.currentWidgets[i].id, this.currentWidgets[i].containerZindex)
                  
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
                console.log('xx f', i, this.currentWidgets[i].id, this.currentWidgets[i].containerZindex)
    
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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
            return
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

    clickMenuCollaborateAlerts() {
        // Show list of Canvas Alerts
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateAlerts', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateAlerts = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateMessages() {
        // Show list of Canvas Messages
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateMessages', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateMessages = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateActivities() {
        // Show list of Canvas Activities
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivities', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateActivities = true;

        this.menuOptionClickPostAction();
    }

    clickMenuCollaborateActivityAdd() {
        // Add a new Activity
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivityAdd', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateActivityAdd = true;

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

        console.log('App clickMenuUserMyProfile')
        this.showModalUserMyProfile = true;
    }

    clickMenuUserPreferences() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserPreferences', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserPreferences = true;
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

    clickMenuUserOffline() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserOffline', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserOffline = true;
    }

    clickMenuUserLogout() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserLogout', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardLogout = true;
    }





    // ***********************  CLICK PALETTE (specific) MENU OPTIONS ************************ //
    clickMenuPaletteEdit() {
        // Clicked the Edit option on palette - decide what to do
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuPaletteEdit', '@Start');

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






    // ***********************  OTHER ************************ //

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
        }

    showRecentDashboard(index: number) {
        // Open a Recently used D
        this.globalFunctionService.printToConsole(this.constructor.name,'showRecentDashboard', '@Start');

        // Set the EditMode as it was previously
        this.globalVariableService.editMode.next(this.recentDashboards[index].editMode);

        // Open it
		this.globalVariableService.refreshCurrentDashboard(
            'openDashboard-showRecentDashboard',
            this.recentDashboards[index].dashboardID,
            this.recentDashboards[index].dashboardTabID,
            ''
        );
        this.dashboardOpenActions();

    }

    clickClosePresentation() {
        // Close Presentation Mode, and return to prior state
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClosePresentation', '@Start');

        // Go back to EditMode if user was there where Presentation started
        if (this.editModePrePresentation) {
            this.globalVariableService.editMode.next(true);
            this.editMode = true;
        };

        // Reset all the Originals Checkpoint
        this.currentWidgetsOriginals.forEach(wo => {
                wo.showCheckpoints = false;
                this.globalVariableService.changedWidget.next(wo);
        });

        // Reset vars
        this.globalVariableService.presentationMode.next(false);
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
        this.currentWidgets.forEach( w => {

            if (this.draggableWidgets.indexOf(w.id) >= 0) {

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    'Widget',
                    'Move',
                    'App moveWidgets',
                    null,
                    null,
                    w,
                    null
                );

                // Move the container
                w.containerLeft = w.containerLeft - this.startX + this.endX;
                w.containerTop = w.containerTop - this.startY + this.endY;

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
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    w
                );

                // Save to DB
                this.globalVariableService.saveWidget(w);

            }
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

        // TODO - fix index..
        this.currentWidgets[index].isSelected = !this.currentWidgets[index].isSelected;
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.id == id) {
                w.isSelected = this.currentWidgets[index].isSelected;
            };
        });

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
            'Widget',
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
        if (message == this.globalVariableService.canvasSettings.notInEditModeMsg
            &&  !this.presentationMode) {
            this.stuckCount = this.stuckCount + 1;
        } else {
            // this.stuckCount = 0;
        };
        if (this.stuckCount == 4) {
            this.showPopupMessage = true;
        } else {
            this.showPopupMessage = false;
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

    contextMenuOpen() {
        // Open context / dropdown Menu from the Title Bar
        this.globalFunctionService.printToConsole(this.constructor.name,'contextMenuOpen', '@Start');

        // // Must be first, else default behaviour takes over
        // ev.preventDefault();

        this.showWidgetContextMenu = true;
        return;
    }

    contextMenuJumpToLinked(dashboardID: number, dashboardTabID: number) {
        // Jumps to the linked Dashboard and Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'contextMenuJumpToLinked', '@Start');

        // Exit if no Dashboard to jump to
        if (dashboardID == null) {
            return;
        };

        // Tab points to first one, if needed
        if (dashboardTabID == null) {
            dashboardTabID = -1;
        };

        this.globalVariableService.refreshCurrentDashboard(
            'app-contextMenuJumpToLinked', dashboardID, dashboardTabID, ''
        );
    }

    contextmenuWidgetTitle(ev: MouseEvent, index: number, id: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetTitle', '@Start');

        this.menuOptionClickPreAction();

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.id == id) {
                this.selectedWidget = w;
            };
        });

        this.showTitleForm = true;
    }

    clickToggleShowCheckpoint(
        index: number,
        dashboardID: number,
        id: number,
        showCheckpoints) {
        // Toggle to show Checkpoints or not
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleShowCheckpoint', '@Start');

        // How it works:
        // At Runtime, each W.checkpointIDs[] is set to the IDs of all its previously stored
        // Checkpoints.  It also stores currentCheckpoint = 0, which is the index
        // in checkpointIDs while browsing, and lastCheckpoint which is the
        // index in checkpointIDs of the last one.  This is a hack to simplify
        // moving between checkpoint (0 -> lastCheckpoint in checkpointIDs).
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
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteWidget', '@Start');

        let datasetID: number = -1;

        // Delete the local one
        let delIDs: number[] = [];
        let deleteWidget: Widget;

        for (var i = 0; i < this.currentWidgets.length; i++) {

            // Get given ID, else all selected
            if (  (widgetID == null  ||  this.currentWidgets[i].id == widgetID)
                   &&
                   (widgetID != null  ||  this.currentWidgets[i].isSelected)
                   &&
                   this.currentWidgets[i].widgetType == widgetType
                ) {

                deleteWidget = Object.assign({}, this.currentWidgets[i]);
                datasetID = this.currentWidgets[i].datasetID;
                delIDs.push(this.currentWidgets[i].id);
                this.currentWidgets.splice(i,1);
            };
        };

        // Delete from the DB and global ones - only marked as isTrashed in DB
        deleteWidget.isTrashed = true;
        this.globalVariableService.saveWidget(deleteWidget);

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
        // this.stuckCount = 0;
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
            return
        };
        if (!this.checkForOnlyOneWidget(widgetType)) {
            return
        };

        this.menuOptionClickPreAction();

        // Checked above that only one is selected, so the loop is okay
        this.currentWidgets.forEach(w => {

            if (w.isSelected) {

                // Make a (new) duplicate
                this.duplicateSingleWidget(w);

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

    duplicateSingleWidget(originalWidget: Widget) {
        // Duplicate the given Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'duplicateSingleWidget', '@Start');

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
        let copiedWidget: Widget = Object.assign({}, originalWidget);

        copiedWidget.id = null;
        copiedWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        copiedWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;

        // Assume this is a NEW W, so forget about tabs that original belongs
        copiedWidget.dashboardTabIDs = [copiedWidget.dashboardTabID];
        copiedWidget.isSelected = false;
        copiedWidget.containerLeft = 120;
        copiedWidget.containerTop = 120;
        copiedWidget.titleText = copiedWidget.titleText + ' (copy ' +
            copyPosition.toString() + ')';

        // Add to all and current W
        // this.globalVariableService.widgets.push(copiedWidget);
        // this.globalVariableService.currentWidgets.push(copiedWidget);
        this.globalVariableService.addWidget(copiedWidget).then(res => {
            copiedWidget.id = res.id;

            this.globalVariableService.changedWidget.next(copiedWidget);

            // Add to Action log
            this.globalVariableService.actionUpsert(
                null,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                'Widget',
                'Duplicate',
                'App clickMenuWidgetDuplicate',
                null,
                null,
                null,
                copiedWidget
            );
        });

    }

    paletteFunctionCall(methodName: string, methodParam) {
        // Call function in Var from Customised portion of Palette
        this.globalFunctionService.printToConsole(this.constructor.name,'paletteFunctionCall', '@Start');

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
    }

    clearDashboard() {
        // Clears all the vars for the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'dashboardOpenActions', '@Start');

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
            this. paletteHeight = 35;
            this. paletteWidth = this.globalVariableService.currentPaletteButtonsSelected
                .value.length * 23;
        } else {
            // Vertical
            this. paletteHeight = this.globalVariableService.currentPaletteButtonsSelected
                .value.length * 25;
            this. paletteWidth = 32;
            };
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
