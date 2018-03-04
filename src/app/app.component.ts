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
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';
import { QueryList }                  from '@angular/core';

// Own Services
import { GlobalVariableService }      from './global-variable.service';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Models
import { Field, Dataset }                      from './models'
import { Datasource }                 from './models'
import { Widget }                     from './models'

import { WidgetSingleComponent }      from './widget.single.component';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';
import { ShapeEditComponent } from 'app/shape.edit.component';


// Constants
const notInEditModeMsg: string = 'Not in Edit Mode (see Edit menu Option)';
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
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);
      
      // TODO - add code to move SELECTED Ws the gridsize, say 3px
      if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
        // this.increment();
      }
  
      if (event.keyCode === KEY_CODE.LEFT_ARROW) {
        // this.decrement();
      }
    }
    companyName: string = this.globalVariableService.companyName;
    currentDashboardName: string = '';
    currentDatasources: Datasource[];
    currentShapeSpec: any;          // TODO - fill this var !!  not working at moment
    currentTabName: string = '';
    currentWidgets: Widget[] = [];
    editMode: boolean;
    hasDatasources: boolean = false;
    editMenuText: string;
    fields: Field[];
    isBusyResizing: boolean = false;
    moveStartX: number;
    moveStartY: number;
    moveEndX: number;
    moveEndY: number;
    moveOffsetX: number;
    moveOffsetY: number;
    moveLastX: number = 0;
    moveLastY: number = 0;
    newWidget: boolean = false;
    presentationMode: boolean;
    refreshGraphs: boolean = false;
    selectWidgetIndex: number;
    selectDatasetID: number;
    selectDatasourceID: number;
    selectedWidget: Widget;
    selectedWidgetID: number;
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
    showModalDashboardRename: boolean = false;
    showModalDashboardDetails: boolean = false;
    showModalDashboardDescription: boolean = false;
    showModalDashboardTags
    showModalDashboardSettings: boolean = false;
    showModalDashboardTheme: boolean = false;
    showModalDashboardTemplate: boolean = false;
    showModalDashboardSchedule: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalDashboardTreeview: boolean = false;
    showModalDashboardSubscribe: boolean = false;
    showMainMenu: boolean = true;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetComments: boolean = false;
    showModalWidgetLinks: boolean = false;
    showModalWidgetRefresh: boolean = false;
    showModalWidgetExpand: boolean = false;
    showModalWidgetExport: boolean = false;
    showModalWidgetDelete: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalData: boolean = false;
    showModalDataSlicers: boolean = false;
    showModalSlicerTablist: boolean = false;
    showModalTableEditor: boolean = false;
    showModalDataCombination: boolean = false;
    showModalDataRefresh: boolean = false;
    showModalDataShare: boolean = false;
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
    showTestArrows: boolean = false;
    showFav: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalCollaborateAlerts: boolean = false;
    showModalCollaborateActivityAdd: boolean = false;
    showModalCollaborateMessages: boolean = false;
    showModalCollaborateActivities: boolean = false;
    showModalLanding: boolean;
    showModalUserMyProfile: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUserWidgetButtonBar: boolean = false;
    showModalUserShapeButtonBar: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showModalUserOffline: boolean = false;
    showPopupMessage: boolean = false;
    showTitleForm: boolean = false;
    startX: number;
    startY: number;
    statusBarCancelRefresh: boolean = false;
    statusBarRunning: boolean = false;
    stuckCount: number = 0;
    titleFormLeft: number = 50;
    titleFormTop: number = 50;
    widgetGroup: number[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private router: Router,

    ) {

        // TODO - change hard coding & do via login (Server), and Standalone
        this.globalVariableService.currentUser = {
            id: 1,
            userID: 'JannieI',
            password: '',
            firstName: '',
            lastName: '',
            nickName: '',
            email: '',
            workNumber: '',
            cellNumber: '',
            groups: ['everyone', 'admin'],
            isSuperuser: false,
            isStaff: false,
            isActive: false,
            dateJoined: '2017/01/01',
            lastLogin: '2017/01/01',
            colorScheme: '',
            startupDashboardID: 0,
            startupDashboardTabID: 0,
            gridSize: 3,
            environment: '',
            profilePicture: '',
            queryRuntimeWarning: 3,
            snapToGrid: false
        }
        console.log('Welcome ', this.globalVariableService.currentUser.userID)
    }

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
        this.globalVariableService.showGrid.subscribe(
            sG => this.showGrid = sG
        );
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

                // Add the given one
                this.currentWidgets.push(newW);

                // Refresh, only for graphs
                // if (w.widgetType == 'Graph') {
                //     this.widgetDOM.refreshWidget(w, 'app ')
                // };

                console.log('xx app changedWidget replaced', w, this.currentWidgets)
            };
        });

        // This refreshes the whole D, with W and related info
        this.globalVariableService.currentDashboardInfo.subscribe(
            i => {
                if (i) {

                    this.globalVariableService.refreshCurrentDashboardInfo(
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.
                            currentDashboardTabID).then(j =>
                            {
                                this.refreshGraphs = false;
                                let x: number = this.globalVariableService.currentDashboardInfo.value.
                                    currentDashboardTabIndex;
                                this.currentDashboardName = this.globalVariableService.
                                    currentDashboards[0].name;
                                this.currentTabName = this.globalVariableService.
                                    currentDashboardTabs[x].name;
                                this.currentDatasources = this.globalVariableService.
                                    currentDatasources;

                                // Loop on All/Indicated Ws
                                this.currentWidgets = [];
                                for (var i = 0; i < this.globalVariableService.currentWidgets.length; i++) {
                                    let w: Widget = Object.assign({}, 
                                        this.globalVariableService.currentWidgets[i]);
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

        if (this.widgetDOM != undefined  &&  (!this.refreshGraphs) ) {
            this.refreshGraphs = true;
            // TODO - only refresh changed one after W-Editor
            this.currentWidgets.forEach(w => {
                if (w.id == 1) {

                    // this.widgetDOM.refreshWidget(w, 'app ngAfterViewChecked')
                }
            })
        }
    }

    
    // ***********************  HANDLE RETURN AFTER MODAL FORM CLOSES ************************ //
    
    handleCloseModalLanding(action: string) {
        // Close Modal form Landing page
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalLanding', '@Start');

        this.showModalLanding = false;
        // this.document.body.style.backgroundImage ='../images/BarChart.png';

        if (this.globalVariableService.openDashboardFormOnStartup) {
            console.log('handleCloseModalLanding 1')
            this.showModalDashboardOpen = true;
        };

        if (this.globalVariableService.openNewDashboardFormOnStartup) {
            console.log('handleCloseModalLanding 2')
            this.showModalData = true;
        };
    }

    handleCloseWidgetEditor(changedWidget: Widget) {    //widgetsToRefresh: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

        // Note: amend this.currentWidgets as it is a ByRef to 
        // this.gv.currentWidgets, which Angular does not register that it has changed

        // for (var i = 0; i < this.currentWidgets.length; i++) {
        //     if (this.currentWidgets[i].id == changedWidget.id) {
        //         this.currentWidgets.splice(i, 1);
        //     };
        // };
        // this.currentWidgets.push(changedWidget);
        this.globalVariableService.changedWidget.next(changedWidget);

        this.showModalWidgetEditor = false;
    }

    handleCloseDashboardNew(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardNew', '@Start');

        this.showModalDashboardNew = false;
    }

    handleCloseDashboardOpen(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardOpen', '@Start');

        this.showModalDashboardOpen = false;
    }

    handleCloseDashboardSave(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSave', '@Start');

        this.showModalDashboardSave = false;
    }

    handleCloseDashboardSnapshots(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSnapshots', '@Start');

        this.showModalDashboardSnapshots = false;
    }

    handleCloseDashboardShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardShare', '@Start');

        this.showModalDashboardShare = false;
    }

    handleCloseDashboardImport(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardImport', '@Start');

        this.showModalDashboardImport = false;
    }

    handleCloseDashboardDiscard(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDiscard', '@Start');

        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardRename(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardRename', '@Start');

        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDetails(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDetails', '@Start');

        this.showModalDashboardDetails = false;
    }

    handleCloseDashboardDescription() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDescription', '@Start');

        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTags', '@Start');

        this.showModalDashboardTags = false;
    }

    handleCloseDashboardSettings(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSettings', '@Start');

        this.showModalDashboardSettings = false;
    }

    handleCloseDashboardTheme(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTheme', '@Start');

        this.showModalDashboardTheme = false;
    }

    handleCloseDashboardTemplate(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTemplate', '@Start');

        this.showModalDashboardTemplate = false;
    }

    handleCloseDashboardSchedule(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSchedule', '@Start');

        this.showModalDashboardSchedule = false;
    }

    handleCloseDashboardDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDelete', '@Start');

        this.showModalDashboardDelete = false;
    }

    handleCloseDashboardTreeview(action: string){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTreeview', '@Start');

        this.showModalDashboardTreeview = false;
    }

    handleCloseDashboardSubscribe(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSubscribe', '@Start');

        this.showModalDashboardSubscribe = false;
    }

    handleCloseShapeEdit(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeEdit', '@Start');

        this.showModalShapeEdit = false;
        if (action == 'saved') {
            alert('saved')
        }
    }

    handleCloseShapeDelete(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeDelete', '@Start');

        this.showModalShapeDelete = false;
    }

    handleCloseDashboardComments(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardComments', '@Start');

        this.showModalDashboardComments = false;
    }

    handleCloseDashboardPrint(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardPrint', '@Start');

        this.showModalDashboardPrint = false;
    }

    handleCloseDataSlicers(changedWidget: Widget) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataSlicers', '@Start');

        this.globalVariableService.changedWidget.next(changedWidget);
        
        this.showModalDataSlicers = false;
    }

    handleCloseSlicerTablist(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseSlicerTablist', '@Start');

        this.showModalSlicerTablist = false;
    }

    handleCloseData(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseData', '@Start');

        this.showModalData = false;
    }

    handleCloseDataCombination(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataCombination', '@Start');

        this.showModalDataCombination = false;
    }

    handleCloseDataRefresh(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataRefresh', '@Start');

        this.showModalDataRefresh = false;
    }

    handleCloseDataShare(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataShare', '@Start');

        this.showModalDataShare = false;
    }

    handleCloseWidgetCheckpoints(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetCheckpoints', '@Start');

        this.showModalWidgetCheckpoints = false;
    }

    handleCloseWidgetComments(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetComments', '@Start');

        this.showModalWidgetComments = false;
    }

    handleCloseWidgetLinks(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetLinks', '@Start');

        this.showModalWidgetLinks = false;
    }

    handleCloseWidgetExpand(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExpand', '@Start');

        this.showModalWidgetExpand = false;
    }

    handleCloseWidgetExport(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExport', '@Start');

        this.showModalWidgetExport = false;
    }

    handleCloseWidgetDelete(action: string) {
        // Handles the response to the Delete Widget form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDelete', '@Start');

        // Delete, if so requested
        if (action == 'delete') {
            this.deleteWidget('Graph');
        };

        // Hide modal form
        this.showModalWidgetDelete = false;
    }

    handleCloseTableEditor(changedTable: Widget) {    //widgetsToRefresh: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseTableEditor', '@Start');

        this.globalVariableService.changedWidget.next(changedTable);

        this.showModalTableEditor = false;
    }

    handleCloseCollaborateAlerts(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateAlerts', '@Start');

        this.showModalCollaborateAlerts = false;
    }

    handleCloseCollaborateActivityAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivityAdd', '@Start');

        this.showModalCollaborateActivityAdd = false;
    }

    handleCloseCollaborateMessages(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateMessages', '@Start');

        this.showModalCollaborateMessages = false;
    }

    handleCloseCollaborateActivities(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivities', '@Start');

        this.showModalCollaborateActivities = false;
    }

    handleCloseUserLogin(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogin', '@Start');

        this.showModalDashboardLogin = false;
    }

    handleCloseUserLogout(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogout', '@Start');

        this.showModalDashboardLogout = false;
    }

    handleCloseUserPreferences(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserPreferences', '@Start');

        this.showModalUserPreferences = false;
    }

    handleCloseUserdMyProfile(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserdMyProfile', '@Start');

        this.showModalUserMyProfile = false;
    }

    handleCloseUserWidgetButtonBar(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserWidgetButtonBar', '@Start');

        this.showModalUserWidgetButtonBar = false;
    }

    handleCloseUserShapeButtonBar(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserShapeButtonBar', '@Start');

        this.showModalUserShapeButtonBar = false;
    }

    handleCloseUserSystemSettings(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserSystemSettings', '@Start');

        this.showModalUserSystemSettings = false;
    }

    handleCloseUserOffline(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserOffline', '@Start');

        this.showModalUserOffline = false;
    }





    // ***********************  CLICK EDIT MENU OPTIONS ************************ //
    
    clickMenuEditUndo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditUndo', '@Start');

        this.menuOptionClickPreAction();

        this.showTestArrows = false;
    }

    clickMenuEditRedo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditRedo', '@Start');

        this.menuOptionClickPreAction();

        this.showTestArrows = true;
    }

    clickMenuEditSelectAllNone(size: string) {
        // Deselect n objects on the D based on size, All, None, Auto
        // Auto will select All if none is selected, None is any is selected
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectAllNone', '@Start');

        this.menuOptionClickPreAction();
        
        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };
        
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
    }





    // ***********************  CLICK DASHBOARD MENU OPTIONS ************************ //
    
    clickDashboardNew() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardNew', '@Start');

        this.menuOptionClickPreAction();
        
        console.log('App clickDashboardNew')
        this.showModalDashboardNew = true;
    }

    clickDashboardOpen() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardOpen', '@Start');

        this.menuOptionClickPreAction();
        
        console.log('App clickDashboardOpen')
        this.showModalDashboardOpen = true;
    }

    clickDashboardEdit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardEdit', '@Start');

        this.menuOptionClickPreAction();

        // Switch off all selections if going to View Mode
        if (this.editMode) {
            this.clickMenuEditSelectAllNone('None');
        }

        // Toggle mode
        this.globalVariableService.editMode.next(!this.editMode);
    }

    clickDashboardDiscard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDiscard', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardDiscard = true;
    }

    clickDashboardShare() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardShare', '@Start');

        this.showModalDashboardShare = true;
    }

    clickDashboardSave() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSave', '@Start');

        this.menuOptionClickPreAction();

        console.log('App clickDashboardSave')
        this.showModalDashboardSave = true;
    }

    clickDashboardSnapshots() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSnapshots', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSnapshots = true;
    }

    clickDashboardImport() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardImport', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardImport = true;
    }

    clickDashboardRename() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardRename', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardRename = true;
    }

    clickMenuDashboardDetailDescription() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailDescription', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardDescription = true;
    }

    clickMenuDashboardDetailTags() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTags', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardTags = true;
    }

    clickMenuDashboardDetailSettings() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSettings', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSettings = true;
    }

    clickMenuDashboardDetailComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailComments', '@Start');

        this.menuOptionClickPreAction();
        this.selectedWidgetID = -1;
        this.showModalDashboardComments = true;
    }

    clickMenuDashboardDetailTheme() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTheme', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardTheme = true;
    }

    clickMenuDashboardDetailTemplate() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTemplate', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardTemplate = true;
    }

    clickMenuDashboardDetailSchedule() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSchedule', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSchedule = true;
    }

    clickMenuDashboardPrint() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardPrint', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardPrint = true;
    }

    clickMenuDashboardDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDelete', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardDelete = true;
    }

    clickMenuDashboardTreeview() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardTreeview', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardTreeview = true;
    }

    clickMenuDashboardSubscribe() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardSubscribe', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDashboardSubscribe = true;
    }




    // ***********************  CLICK DATA MENU OPTIONS ************************ //
    
    clickMenuDataFromFile(id: number) {
        // Open DATA form for a DS that comes from a file.  The id is -1 for a new one
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromFile', '@Start');

        this.menuOptionClickPreAction();

        console.log('App clickMenuDataFromFile')
        this.globalVariableService.dataGetFromSwitch.next('File');
        // this.globalVariableService.showModalData.next(true);
        this.showModalData = true;
        // this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromServer', '@Start');

        this.menuOptionClickPreAction();

        console.log('App clickMenuDataFromServer')
        this.globalVariableService.dataGetFromSwitch.next('Server');
        // this.router.navigate(['/data']);
        // this.globalVariableService.showModalData.next(true);
    }

    clickMenuDataCombinations(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataCombinations', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataCombination = true;
    }

    clickMenuDataRefreshAll() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataRefreshAll', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataRefresh = true;
    }

    clickMenuDataShare() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataShare', '@Start');

        this.menuOptionClickPreAction();

        this.showModalDataShare = true;
    }





    // ***********************  CLICK WIDGET MENU OPTIONS ************************ //
    
    clickMenuWidgetNew() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetNew', '@Start');

        this.menuOptionClickPreAction();

        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                notInEditModeMsg,
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        // Indicate new W and open Editor
        this.newWidget = true;
        this.showDatasourcePopup = true;
        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetEdit() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetEdit', '@Start');

        this.menuOptionClickPreAction();

        // Can only edit one W at a time, so ignore if multiple selected
        if (!this.checkForOnlyOneWidget()) { 
            return
        };

        // Indicate edit W and open Editor, which will work with selected W
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Graph') {
                this.selectedWidget = w;
            };
        });
        this.newWidget = false;
        this.showDatasourcePopup = false;

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetCheckpoints() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCheckpoints', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };

        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetComments', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };

        this.showModalWidgetComments = true;
    }

    clickMenuWidgetLinks() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };

        this.showModalWidgetLinks = true;
    }

    clickMenuWidgetRefresh() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetRefresh', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.NoQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuWidgetDuplicate() {
        // Duplicate selected Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };
        
        // Get new ID
        // TODO - improve this when using a DB!
        let newID: number = 1;
        let wIDs: number[] = [];
        this.globalVariableService.widgets.forEach(w => {
            wIDs.push(w.id);
        });
        if (wIDs.length > 0) {
            newID = Math.max(...wIDs) + 1;
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

        this.currentWidgets.forEach(w => {

            if (w.isSelected) {
        
                // Make a deep copy
                let copiedWidget: Widget = Object.assign({}, w);
                copiedWidget.id = newID;
                copiedWidget.isSelected = false;
                copiedWidget.containerLeft = 120;
                copiedWidget.containerTop = 120;
                copiedWidget.titleText = copiedWidget.titleText + ' (copy ' + 
                    copyPosition.toString() + ')';

                // Add to all and current W
                this.globalVariableService.widgets.push(copiedWidget);
                this.globalVariableService.currentWidgets.push(copiedWidget);
                this.globalVariableService.changedWidget.next(copiedWidget);

            };
        });
    }

    clickMenuWidgetExpand() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };

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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExport', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };

        this.showModalWidgetExport = true;
    }

    clickMenuWidgetCopy() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCopy', '@Start');

        this.menuOptionClickPreAction();

        // Copies reference to existing datasource (of From Widget)
        // For now, only per Dashboard - issue with Global paste is datasource
        // What if not defined in the new Dashboard ?
    }

    clickMenuWidgetCut() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCut', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuWidgetPaste() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetPaste', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuWidgetDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDelete', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Graph')) { 
            return
        };

        this.showModalWidgetDelete = true;
    }





    // ***********************  CLICK TABLE MENU OPTIONS ************************ //

    clickMenuTableAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableAdd', '@Start');
        
        this.menuOptionClickPreAction();

        this.newWidget = true;
        this.showDatasourcePopup = true;
        
        this.showModalTableEditor = true;

    }

    clickMenuTableEdit() {
        // Edits the selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableEdit', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) { 
            return
        };
        
        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Table') {
                this.selectedWidget = w;
            };
        });
        console.log('xx this.selectedWidget', this.newWidget, this.selectedWidget)
        this.showDatasourcePopup = false;
        this.showModalTableEditor = true;
    }


    clickMenuTableDuplicate() {
        // Duplicate selected Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableDuplicate', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget('Table')) { 
            return
        };
        
        // Get new ID
        // TODO - improve this when using a DB!
        let newID: number = 1;
        let wIDs: number[] = [];
        this.globalVariableService.widgets.forEach(w => {
            wIDs.push(w.id);
        });
        if (wIDs.length > 0) {
            newID = Math.max(...wIDs) + 1;
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

        this.currentWidgets.forEach(w => {

            if (w.isSelected) {
        
                // Make a deep copy
                let copiedWidget: Widget = Object.assign({}, w);
                copiedWidget.id = newID;
                copiedWidget.isSelected = false;
                copiedWidget.containerLeft = 120;
                copiedWidget.containerTop = 120;
                copiedWidget.titleText = copiedWidget.titleText + ' (copy ' + 
                    copyPosition.toString() + ')';

                // Add to all and current W
                this.globalVariableService.widgets.push(copiedWidget);
                this.globalVariableService.currentWidgets.push(copiedWidget);
                this.globalVariableService.changedWidget.next(copiedWidget);

            };
        });
    }

    clickMenuTableExpand() {
        // Expand DS u-sed in table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableExpand', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) { 
            return
        };

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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableExport', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) { 
            return
        };

        this.showModalWidgetExport = true;
    }

    clickMenuTableDelete() {
        // Delete Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuTableDelete', '@Start');

        this.menuOptionClickPreAction();

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Table')) { 
            return
        };

        this.deleteWidget('Table')
        
    }


    // ***********************  CLICK SLICER MENU OPTIONS ************************ //
        
    clickMenuSlicerAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerAdd', '@Start');
        
        this.menuOptionClickPreAction();

        this.newWidget = true;
        
        this.showModalDataSlicers = true;

    }

    clickMenuSlicerEdit() {
        // Edits the selected Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerEdit', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        
        this.newWidget = false;
        this.currentWidgets.forEach(w => {
            if (w.isSelected  &&  w.widgetType == 'Slicer') {
                this.selectedWidget = w;
            };
        });

        this.showModalDataSlicers = true;
    }

    clickMenuSlicerTablist() {
        // Open the list of tabs to which a Sl belongs
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerTablist', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };

        this.showModalSlicerTablist = true;

    }

    clickMenuSlicerExpand() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerExpand', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) { 
            return
        };

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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerExport', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) { 
            return
        };

        this.showModalWidgetExport = true;
    }

    clickMenuSlicerDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerDelete', '@Start');

        this.menuOptionClickPreAction();

        // Make sure we have only one, then delete it
        if (!this.checkForOnlyOneWidget()) { 
            return
        };
        if (!this.checkForOnlyOneWidget('Slicer')) { 
            return
        };

        this.deleteWidget('Slicer')
        
    }





    // ***********************  CLICK SHAPE MENU OPTIONS ************************ //
    
    clickMenuShapeNew() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeNew', '@Start');

        this.menuOptionClickPreAction();

        this.showModalShapeEdit = true;
    }

    clickMenuShapeEdit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeEdit', '@Start');

        this.menuOptionClickPreAction();

        this.showModalShapeEdit = true;
    }

    clickMenuShapeLinks() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeLinks', '@Start');

        this.menuOptionClickPreAction();

        this.showModalWidgetLinks = true;
    }

    clickMenuShapeDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeDelete', '@Start');

        this.menuOptionClickPreAction();

        this.showModalShapeDelete = true;
    }





    // ***********************  CLICK VIEW MENU OPTIONS ************************ //
    
    clickMenuViewPresentation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPresentation', '@Start');

        this.menuOptionClickPreAction();

        this.globalVariableService.presentationMode.next(!this.presentationMode);
        this.showMainMenu = false;
    }

    clickMenuViewPrintPreview(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPrintPreview', '@Start');
   
        this.menuOptionClickPreAction();
    }

    clickMenuViewShowGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.menuOptionClickPreAction();

        this.globalVariableService.showGrid.next(!this.showGrid);
    }

    clickMenuViewShowDataQuality() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.menuOptionClickPreAction();

        this.showDataQuality = !this.showDataQuality;
    }

    clickMenuViewShowComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.menuOptionClickPreAction();

        this.showComments = !this.showComments;
    }

    clickMenuViewSnapToGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewSnapToGrid', '@Start');

        this.menuOptionClickPreAction();
    }

    clickMenuViewZoom() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewZoom', '@Start');

        this.menuOptionClickPreAction();

    }





    // ***********************  CLICK ARRANGE MENU OPTIONS ************************ //
    
    clickMenuArrangeBackward() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBackward', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuArrangeForward() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeForward', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuArrangeBack() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBack', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuArrangeFront() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeFront', '@Start');

        this.menuOptionClickPreAction();

    }

    clickMenuArrangeAlignLeft() {
        // Align the lefts of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignLeft', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

        let x: number = -1; 

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerLeft;
                } else {
                    this.currentWidgets[i].containerLeft = x;
                };
            };
        };
    }

    clickMenuArrangeAlignCenter() {
        // Align the centers of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenter', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

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
            };
        };
    }

    clickMenuArrangeAlignRight() {
        // Align the Rights of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignRight', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

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
            };
        };
    }

    clickMenuArrangeAlignTop() {
        // Align the tops of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignTop', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

        let x: number = -1; 

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                if (x == -1) {
                    x = this.currentWidgets[i].containerTop;
                } else {
                    this.currentWidgets[i].containerTop = x;
                };
            };
        };
    }

    clickMenuArrangeAlignMiddle() {
        // Align the Middles of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignMiddle', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

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
            };
        };
    }


    clickMenuArrangeAlignBottom() {
        // Align the Bottoms of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignBottom', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

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
            };
        };
    }

    clickMenuArrangeAlignCenterHorisontally() {
        // Center horisontally across page
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterHorisontally', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

        let x: number = window.innerWidth / 2; 

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerLeft = x - 
                    (this.currentWidgets[i].containerWidth / 2);
            };
        };        
    }

    clickMenuArrangeAlignCenterVertically() {
        // Center vertically across page
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterVertically', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

        let x: number = window.innerHeight / 2; 

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                this.currentWidgets[i].containerTop = x - 
                    (this.currentWidgets[i].containerHeight / 2);
            };
        };   
    }

    clickMenuArrangeGroup() {
        // Groups the selected Widgets into a single group
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeGroup', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
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
        this.showStatusBarMessage(
            'New group of ' + this.widgetGroup.length.toString() + ' widgets',
            'StatusBar',
            'Info',
            3000,
            ''
        );

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
        this.showStatusBarMessage(
            'Group cleared ',
            'StatusBar',
            'Info',
            3000,
            ''
        );
    }

    clickMenuArrangeDistributeHorisontal() {
        // Equally distribute the selected Ws horisontally.
        // Assume the selected Ws are W1 (first), W2, ..., Wn (last)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeHorisontal', '@Start');
        
        this.menuOptionClickPreAction();

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
            this.showStatusBarMessage(
                'Select at least 2 ',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;            
        }
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
            }
        }
        
    }

    clickMenuArrangeDistributeVertical() {
        // Vertically arrange selected Ws, equally spaced
        // Assume the selected Ws are W1 (first), W2, ..., Wn (last)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeVertical', '@Start');
        
        this.menuOptionClickPreAction();

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
            this.showStatusBarMessage(
                'Select at least 2 ',
                'StatusBar',
                'Info',
                3000,
                ''
            );
            return;            
        }
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
            }
        }

    }

    clickMenuArrangeSameSize() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeSameSize', '@Start');

        this.menuOptionClickPreAction();

        if (!this.checkForMultipleWidgets()) {
            return
        };

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
            };
        };
    }





    // ***********************  CLICK HELP MENU OPTIONS ************************ //
    
    clickMenuHelpDemo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuHelpDemo', '@Start');

        this.menuOptionClickPreAction();

        this.router.navigate(['/help']);
    }





    // ***********************  CLICK COLLABORATE MENU OPTIONS ************************ //
    
    clickMenuCollaborateAlerts() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateAlerts', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateAlerts = true;
    }

    clickMenuCollaborateActivityAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivityAdd', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateActivityAdd = true;
    }

    clickMenuCollaborateMessages() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateMessages', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateMessages = true;
    }

    clickMenuCollaborateActivities() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivities', '@Start');

        this.menuOptionClickPreAction();

        this.showModalCollaborateActivities = true;
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

    clickMenuUserWidgetButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserWidgetButtonBar', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserWidgetButtonBar = true;
    }

    clickMenuUserShapeButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserShapeButtonBar', '@Start');

        this.menuOptionClickPreAction();

        this.showModalUserShapeButtonBar = true;
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
        this.globalFunctionService.printToConsole(this.constructor.name,'showRecentDashboard', '@Start');
        
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
                    // Lost
                    this.showStatusBarMessage(
                        'Select a graph, slicer or table',
                        'StatusBar',
                        'Warning',
                        3000,
                        ''
                    );                
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
            if (this.checkForOnlyOneWidget('Slicer', true)) {
                this.clickMenuSlicerExpand();
            } else {
                // Lost
                this.showStatusBarMessage(
                    'Select a graph or slicer',
                    'StatusBar',
                    'Warning',
                    3000,
                    ''
                );                
            };
        };

        
    }


    // ***********************  OTHER ************************ //
    
    showRecentDashboard(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'showRecentDashboard', '@Start');

    }

    clickClosePresentation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClosePresentation', '@Start');

        this.showMainMenu = true;
        this.globalVariableService.presentationMode.next(false);
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
                this.showStatusBarMessage(
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
                this.showStatusBarMessage(
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
            this.showStatusBarMessage(
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

        this.startX = ev.x;
        this.startY = ev.y;
    }

    clickWidgetContainerDragEnd(ev: MouseEvent, index: number, id: number) {
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

        // Create array to loop on
        let draggables: number[] = [];
        // There is no group
        if (this.widgetGroup.length == 0) {
            draggables = [id];
        } else {
            // Dragged one is part of group, so move group
            if (this.widgetGroup.indexOf(id) >= 0) {
                this.widgetGroup.forEach( wg => {
                    draggables.push(wg)
                });
            } else {
                // Solitary move
                draggables = [id];
            }
        };

        // Reset current and globalVar values
        this.currentWidgets.forEach( w => {
            
            if (draggables.indexOf(w.id) >= 0) {
                w.containerLeft = w.containerLeft - this.startX + ev.x;
                w.containerTop = w.containerTop - this.startY + ev.y;
            }
        });
        this.globalVariableService.currentWidgets.forEach( w => {
            
            if (draggables.indexOf(w.id) >= 0) {
                w.containerLeft = w.containerLeft - this.startX + ev.x;
                w.containerTop = w.containerTop - this.startY + ev.y;
            }
        });

    }

    clickWidget(ev: MouseEvent, index: number, id: number) {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                notInEditModeMsg,
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

        // Indicate that we are resizing - thus block the dragging action
        this.isBusyResizing = true;
        this.startX = ev.x;
        this.startY = ev.y;
        console.log('xx clickResizeWidgetDownp',  this.startY, ev.y);

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

        console.log('clickResizeUp starts index', index, this.startY, ev.y)

        // Top moved: adjust the height & top
        if (resizeTop) {
            this.currentWidgets[index].containerTop =
                this.currentWidgets[index].containerTop - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].containerTop =
                this.currentWidgets[index].containerTop;

            this.currentWidgets[index].containerHeight =
                this.currentWidgets[index].containerHeight - ev.y + this.startY;
            this.globalVariableService.currentWidgets[index].containerHeight =
                this.currentWidgets[index].containerHeight;

            this.currentWidgets[index].graphHeight =
                this.currentWidgets[index].graphHeight - ev.y + this.startY;
            this.globalVariableService.currentWidgets[index].graphHeight =
                this.currentWidgets[index].graphHeight;
        };

        // Right moved: adjust the width
        if (resizeRight) {
            this.currentWidgets[index].containerWidth =
                this.currentWidgets[index].containerWidth - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].containerWidth =
                this.currentWidgets[index].containerWidth;

            this.currentWidgets[index].graphWidth =
                this.currentWidgets[index].graphWidth - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].graphWidth =
                this.currentWidgets[index].graphWidth;
        };

        // Bottom moved: adjust the height
        if (resizeBottom) {
            this.currentWidgets[index].containerHeight =
                this.currentWidgets[index].containerHeight - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].containerHeight =
                this.currentWidgets[index].containerHeight;

            this.currentWidgets[index].graphHeight =
                this.currentWidgets[index].graphHeight - this.startY + ev.y;
            this.globalVariableService.currentWidgets[index].graphHeight =
                this.currentWidgets[index].graphHeight;
        };

        // Left moved: adjust the width & left
        if (resizeLeft) {
            this.currentWidgets[index].containerLeft =
                this.currentWidgets[index].containerLeft - this.startX + ev.x;
            this.globalVariableService.currentWidgets[index].containerLeft =
                this.currentWidgets[index].containerLeft;

            this.currentWidgets[index].containerWidth =
                this.currentWidgets[index].containerWidth - ev.x + this.startX;
            this.globalVariableService.currentWidgets[index].containerWidth =
                this.currentWidgets[index].containerWidth;

            this.currentWidgets[index].graphWidth =
                this.currentWidgets[index].graphWidth - ev.x + this.startX;
            this.globalVariableService.currentWidgets[index].graphWidth =
                this.currentWidgets[index].graphWidth;
        };

        console.log('clickResizeUp width buttons ev x-move',
            this.currentWidgets[index].containerWidth, ev, 0 - this.startX + ev.x);
        
        // Refresh graphs
        if (this.currentWidgets[index].widgetType == 'Graph') {
            this.widgetDOM.refreshWidget(this.currentWidgets[index], 'app Resize');
        };
    }

    showStatusBarMessage(
        message: string, 
        uiArea: string,
        classfication: string,
        timeout: number,
        defaultMessage: string,): void {
        // Shows a message in the right area, ie StatusBar
        this.globalFunctionService.printToConsole(this.constructor.name,'showStatusBarMessage', '@Start');
        
        // Pop message in right area
        if (uiArea == 'StatusBar') {
            this.globalVariableService.statusBarMessage.next(
                {
                    message, 
                    uiArea, 
                    classfication, 
                    timeout, 
                    defaultMessage
                }
            );
        };

        // In addition, make sure the user is not stuck
        if (message == notInEditModeMsg) {
            this.stuckCount = this.stuckCount + 1;
        } else {
            this.stuckCount = 0;
        };
        if (this.stuckCount > 3) {
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

    contextmenuWidgetTitle(ev: MouseEvent, index: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name,'contextmenuWidgetTitle', '@Start');

        ev.preventDefault();
        this.showTitleForm = true;
        this.titleFormLeft = this.currentWidgets[index].containerLeft;
        this.titleFormTop = this.currentWidgets[index].containerTop;

    }

    deleteWidget(widgetType) {
        // Delete the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteWidget', '@Start');
        
        let datasetID: number = -1;
        // Delete the local one
        let delIDs: number[] = [];
        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected  &&  
                this.currentWidgets[i].widgetType == widgetType) {

                datasetID = this.currentWidgets[i].datasetID;
                delIDs.push(this.currentWidgets[i].id);
                this.currentWidgets.splice(i,1);
            };
        };
        
        // Delete the global ones
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
            }
        }
        );

        // Update the dataSet for local W, and refresh
        this.currentWidgets.forEach(w => {
            if (w.datasetID == datasetID) {
                w.graphData = newDataset.data
                this.widgetDOM.refreshWidget(w, 'app deleteWidget')
            }
        });

    }

    menuOptionClickPreAction() {
        // Actions performed at the START of a menu item click, PRE any other work
        this.globalFunctionService.printToConsole(this.constructor.name,'menuOptionClickPreAction', '@Start');
        
        this.showPopupMessage = false;
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
