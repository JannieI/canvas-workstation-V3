/*
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { DOCUMENT }                   from '@angular/platform-browser';
import { ElementRef }                 from '@angular/core';
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
import { Field }                      from './models'
import { Datasource }                 from './models'
import { Widget }                     from './models'

import { WidgetComponent }            from './widget.component';
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

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('circle1', {read: ElementRef}) circle1: ElementRef;  //Vega graph
    @ViewChild('widgetDOM')  widgetDOM: WidgetSingleComponent;

    companyName: string = this.globalVariableService.companyName;
    currentDashboardName: string = '';
    currentDatasources: Datasource[];
    currentShapes: Widget[] = [];
    currentSlicers: Widget[] = [];
    currentTables: Widget[] = [];
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
    selectedWidgetIDs: number[] = [];
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
    showTitleForm: boolean = false;
    startX: number;
    startY: number;
    statusBarCancelRefresh: boolean = false;
    statusBarRunning: boolean = false;
    titleFormLeft: number = 50;
    titleFormTop: number = 50;

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
        this.globalVariableService.changedWidgetID.subscribe(wID => {
            if (wID >= 100) {
                // Note: amend this.currentWidgets as it is a ByRef to 
                // this.gv.currentWidgets, which Angular does not register that it has changed
                this.globalVariableService.currentWidgets.forEach( globW => {
                    if (globW.id == wID) {

                        // Deep copy
                        let newW: Widget = Object.assign({}, globW);

                        for (var i = 0; i < this.currentWidgets.length; i++) {
                            if (this.currentWidgets[i].id == wID) {
                                this.currentWidgets.splice(i, 1);
                            };
                        this.currentWidgets.push(globW);
                        this.widgetDOM.refreshWidget(globW, 'app ')
                    };
                    };
                });
                console.log('xx replaced', this.currentWidgets)
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
                                // this.currentWidgets = this.globalVariableService.
                                //     currentWidgets; 
                                console.log('xx app [w]', this.globalVariableService.currentDashboardInfo.
                                    value.widgetsToRefresh, this.globalVariableService.currentWidgets)
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

        // if (this.newWidget) {
        //     // TODO - improve, this is not failproof
        //     // this.currentWidgets.push(this.globalVariableService.currentWidgets[
        //     //     this.globalVariableService.currentWidgets.length - 1]);
        //     this.currentWidgets = this.globalVariableService.currentWidgets
        // } else {
        //     // TODO - this can be done much better
        //     // Replace the currentWidget with the editted info
        //     let cW: number = -1;
        //     for (var i = 0; i < this.currentWidgets.length; i++) {
        //         if (this.currentWidgets[i].isSelected) {
        //             this.globalVariableService.currentWidgets.forEach(w => {
        //                 if (w.id == this.currentWidgets[i].id) {
        //                     this.currentWidgets[i] = w;
        //                     cW = i;
        //                 }
        //             })
        //         }
        //     };

        // }


        // TODO - refresh only the editted one
        // this.widgetDOM.refreshWidgets();
        // this.globalVariableService.refreshCurrentDashboard(
        //     'app-handleCloseWidgetEditor',
        //     this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
        //     this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
        //     '',
        //     []
        // );



        // Note: amend this.currentWidgets as it is a ByRef to 
        // this.gv.currentWidgets, which Angular does not register that it has changed
        // Deep copy
        let newW: Widget = Object.assign({}, changedWidget);

        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].id == changedWidget.id) {
                this.currentWidgets.splice(i, 1);
            };
        };
        this.currentWidgets.push(changedWidget);
        console.log('xx handW', this.currentWidgets)
        // this.widgetDOM.refreshWidget(globW, 'app ')



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

    handleCloseDataSlicers(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataSlicers', '@Start');

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

    handleCloseWidgetDuplicate(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDuplicate', '@Start');

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
            this.deleteWidget();
        };

        // Hide modal form
        this.showModalWidgetDelete = false;
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

        this.showTestArrows = false;
    }

    clickMenuEditRedo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditRedo', '@Start');

        this.showTestArrows = true;
    }

    clickMenuEditSelectAll() {
        // Select all the objects on the D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectAll', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                'Not in Edit Mode (see Edit menu Option)',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return;
        };

        this.currentWidgets.forEach(w => w.isSelected = true);
        this.currentSlicers.forEach(sl => sl.isSelected = true);
        this.currentShapes.forEach(sh => sh.isSelected = true);
    }

    clickMenuEditSelectNone() {
        // Deselect all objects on the D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectNone', '@Start');

        this.currentWidgets.forEach(w => w.isSelected = false);
        this.currentSlicers.forEach(sl => sl.isSelected = false);
        this.currentShapes.forEach(sh => sh.isSelected = false);
    }





    // ***********************  CLICK DASHBOARD MENU OPTIONS ************************ //
    
    clickDashboardNew() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardNew', '@Start');

        console.log('App clickDashboardNew')
        this.showModalDashboardNew = true;
    }

    clickDashboardOpen() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardOpen', '@Start');

        console.log('App clickDashboardOpen')
        this.showModalDashboardOpen = true;
    }

    clickDashboardEdit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardEdit', '@Start');

        // Switch off all selections if going to View Mode
        if (this.editMode) {
            this.clickMenuEditSelectNone();
        }

        // Toggle mode
        this.globalVariableService.editMode.next(!this.editMode);
    }

    clickDashboardDiscard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDiscard', '@Start');

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

        console.log('App clickDashboardSave')
        this.showModalDashboardSave = true;
    }

    clickDashboardSnapshots() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardSnapshots', '@Start');

        this.showModalDashboardSnapshots = true;
    }

    clickDashboardImport() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardImport', '@Start');

        this.showModalDashboardImport = true;
    }

    clickDashboardRename() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardRename', '@Start');

        this.showModalDashboardRename = true;
    }

    clickMenuDashboardDetailDescription() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailDescription', '@Start');

        this.showModalDashboardDescription = true;
    }

    clickMenuDashboardDetailTags() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTags', '@Start');

        this.showModalDashboardTags = true;
    }

    clickMenuDashboardDetailSettings() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSettings', '@Start');

        this.showModalDashboardSettings = true;
    }

    clickMenuDashboardDetailComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailComments', '@Start');

        this.showModalDashboardComments = true;
    }

    clickMenuDashboardDetailTheme() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTheme', '@Start');

        this.showModalDashboardTheme = true;
    }

    clickMenuDashboardDetailTemplate() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailTemplate', '@Start');

        this.showModalDashboardTemplate = true;
    }

    clickMenuDashboardDetailSchedule() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDetailSchedule', '@Start');

        this.showModalDashboardSchedule = true;
    }

    clickMenuDashboardPrint() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardPrint', '@Start');

        this.showModalDashboardPrint = true;
    }

    clickMenuDashboardDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardDelete', '@Start');

        this.showModalDashboardDelete = true;
    }

    clickMenuDashboardTreeview() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardTreeview', '@Start');

        this.showModalDashboardTreeview = true;
    }

    clickMenuDashboardSubscribe() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDashboardSubscribe', '@Start');

        this.showModalDashboardSubscribe = true;
    }




    // ***********************  CLICK DATA MENU OPTIONS ************************ //
    
    clickMenuDataFromFile(id: number) {
        // Open DATA form for a DS that comes from a file.  The id is -1 for a new one
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromFile', '@Start');

        console.log('App clickMenuDataFromFile')
        this.globalVariableService.dataGetFromSwitch.next('File');
        // this.globalVariableService.showModalData.next(true);
        this.showModalData = true;
        // this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromServer', '@Start');

        console.log('App clickMenuDataFromServer')
        this.globalVariableService.dataGetFromSwitch.next('Server');
        // this.router.navigate(['/data']);
        // this.globalVariableService.showModalData.next(true);
    }

    clickMenuDataCombinations(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataCombinations', '@Start');

        this.showModalDataCombination = true;
    }

    clickMenuDataRefreshAll() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataRefreshAll', '@Start');

        this.showModalDataRefresh = true;
    }

    clickMenuDataShare() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataShare', '@Start');

        this.showModalDataShare = true;
    }





    // ***********************  CLICK WIDGET MENU OPTIONS ************************ //
    
    clickMenuWidgetNew() {
        // Open W Editor
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetNew', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                'Not in Edit Mode (see Edit menu Option)',
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

        // Can only edit one W at a time, so ignore if multiple selected
        if (!this.checkForOnlyOneWidget()) { return};

        // Indicate edit W and open Editor
        this.newWidget = false;
        this.showDatasourcePopup = false;

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetCheckpoints() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCheckpoints', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetComments', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetComments = true;
    }

    clickMenuWidgetLinks() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetLinks = true;
    }

    clickMenuWidgetRefresh() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetRefresh', '@Start');

        if (!this.checkForOnlyOneWidget()) {
            return;
        };

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.NoQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuWidgetDuplicate() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');
        console.log('xx clickMenuWidgetDuplicate', this.globalVariableService.currentWidgets)
        if (!this.checkForOnlyOneWidget()) { return};

        this.globalVariableService.duplicateWidget.next(true);
    }

    clickMenuWidgetExpand() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

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

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetExport = true;
    }

    clickMenuWidgetCopy() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCopy', '@Start');

        // Copies reference to existing datasource (of From Widget)
        // For now, only per Dashboard - issue with Global paste is datasource
        // What if not defined in the new Dashboard ?
    }

    clickMenuWidgetCut() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCut', '@Start');

    }

    clickMenuWidgetPaste() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetPaste', '@Start');

    }

    clickMenuWidgetDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDelete', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetDelete = true;
    }





    // ***********************  CLICK SLICER MENU OPTIONS ************************ //
        
    clickMenuSlicerAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerAdd', '@Start');

        this.showModalDataSlicers = true;

    }

    clickMenuSlicerTablist() {
        // Open the list of tabs to which a Sl belongs
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerTablist', '@Start');

        if (!this.checkForOnlyOneWidget('Slicer')) { return};

        this.showModalSlicerTablist = true;

    }

    clickMenuSlicerExpand() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerExpand', '@Start');

        if (!this.checkForOnlyOneWidget('Slicer')) { return};

        this.currentSlicers.forEach(w => {
            if (w.isSelected) {
                this.selectWidgetIndex = w.id;
                this.selectDatasetID = w.datasetID;
                this.selectDatasourceID = w.datasourceID;
            };
        });
        this.showModalWidgetExpand = true;
    }

    clickMenuSlicerEdit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerEdit', '@Start');

        this.showModalDataSlicers = true;
    }

    clickMenuSlicerDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSlicerDelete', '@Start');

    }





    // ***********************  CLICK SHAPE MENU OPTIONS ************************ //
    
    clickMenuShapeNew() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeNew', '@Start');

        this.showModalShapeEdit = true;
    }

    clickMenuShapeEdit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeEdit', '@Start');

        this.showModalShapeEdit = true;
    }

    clickMenuShapeLinks() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeLinks', '@Start');

        this.showModalWidgetLinks = true;
    }

    clickMenuShapeDelete() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuShapeDelete', '@Start');

        this.showModalShapeDelete = true;
    }





    // ***********************  CLICK VIEW MENU OPTIONS ************************ //
    
    clickMenuViewPresentation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPresentation', '@Start');

        this.globalVariableService.presentationMode.next(!this.presentationMode);
        this.showMainMenu = false;
    }

    clickMenuViewPrintPreview(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewPrintPreview', '@Start');
    }

    clickMenuViewShowGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.globalVariableService.showGrid.next(!this.showGrid);
    }

    clickMenuViewShowDataQuality() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.showDataQuality = !this.showDataQuality;
    }

    clickMenuViewShowComments() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewShowGrid', '@Start');

        this.showComments = !this.showComments;
    }

    clickMenuViewSnapToGrid() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewSnapToGrid', '@Start');
    }

    clickMenuViewZoom() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuViewZoom', '@Start');

    }





    // ***********************  CLICK ARRANGE MENU OPTIONS ************************ //
    
    clickMenuArrangeBackward() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBackward', '@Start');

    }

    clickMenuArrangeForward() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeForward', '@Start');

    }

    clickMenuArrangeBack() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBack', '@Start');

    }

    clickMenuArrangeFront() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeFront', '@Start');

    }

    clickMenuArrangeAligTop() {
        // Align the tops of the selected widgets
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAligTop', '@Start');

        if (!this.checkForMultipleWidgets()) {return};

        this.widgetDOM.clickAlignTop()
    }

    clickMenuArrangeAlignCenterPageDown() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterPageDown', '@Start');

    }

    clickMenuArrangeAlignCenterPageRight() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAlignCenterPageRight', '@Start');

    }

    clickMenuArrangeGroup() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeGroup', '@Start');

    }

    clickMenuArrangeUnGroup() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeUnGroup', '@Start');

    }

    clickMenuArrangeDistributeVertical() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeVertical', '@Start');

    }

    clickMenuArrangeDistributeHorisontal() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeDistributeHorisontal', '@Start');

    }

    clickMenuArrangeSameSize() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeSameSize', '@Start');

    }





    // ***********************  CLICK HELP MENU OPTIONS ************************ //
    
    clickMenuHelpDemo() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuHelpDemo', '@Start');

        this.router.navigate(['/help']);
    }





    // ***********************  CLICK COLLABORATE MENU OPTIONS ************************ //
    
    clickMenuCollaborateAlerts() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateAlerts', '@Start');

        this.showModalCollaborateAlerts = true;
    }

    clickMenuCollaborateActivityAdd() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivityAdd', '@Start');

        this.showModalCollaborateActivityAdd = true;
    }

    clickMenuCollaborateMessages() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateMessages', '@Start');

        this.showModalCollaborateMessages = true;
    }

    clickMenuCollaborateActivities() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuCollaborateActivities', '@Start');

        this.showModalCollaborateActivities = true;
    }





    // ***********************  CLICK USER MENU OPTIONS ************************ //
    
    clickMenuUserLogin() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserLogin', '@Start');

        this.showModalDashboardLogin = true;
    }


    clickMenuUserMyProfile() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserMyProfile', '@Start');

        console.log('App clickMenuUserMyProfile')
        this.showModalUserMyProfile = true;
    }

    clickMenuUserPreferences() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserPreferences', '@Start');

        this.showModalUserPreferences = true;
    }

    clickMenuUserWidgetButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserWidgetButtonBar', '@Start');

        this.showModalUserWidgetButtonBar = true;
    }

    clickMenuUserShapeButtonBar() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserShapeButtonBar', '@Start');

        this.showModalUserShapeButtonBar = true;
    }

    clickMenuUserSystemSettings() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserSystemSettings', '@Start');

        this.showModalUserSystemSettings = true;
    }

    clickMenuUserOffline() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserOffline', '@Start');

        this.showModalUserOffline = true;
    }

    clickMenuUserLogout() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuUserLogout', '@Start');

        this.showModalDashboardLogout = true;
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


    clickResizeDown(ev: MouseEvent, index: number) {
        // Register mouse down event when resize starts
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeDown', '@Start');

        // Indicate that we are resizing - thus block the dragging action
        this.isBusyResizing = true;
        this.startX = ev.x;
        this.startY = ev.y;

    }

    clickResizeUp(ev: MouseEvent,
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
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeUp', '@Start');

        console.log('clickResizeUp starts index', index)

        // // Reset current and globalVar values
        // this.currentSlicers[index].containerWidth =
        //     this.currentSlicers[index].containerWidth - this.startX + ev.x;
        // this.globalVariableService.currentSlicers[index].containerWidth =
        //     this.currentSlicers[index].containerWidth;

        // console.log('clickResizeUp this.globalVariableService.currentSlicers[index].value',
        //     index, this.globalVariableService.currentSlicers.value[index])

        this.currentSlicers[index].nrButtonsToShow =
            (this.currentSlicers[index].containerWidth - 50) / 22;


        // Top moved: adjust the height & top
        if (resizeTop) {
            this.currentSlicers[index].containerTop =
                this.currentSlicers[index].containerTop - this.startY + ev.y;
            this.globalVariableService.currentSlicers[index].containerTop =
                this.currentSlicers[index].containerTop;

            this.currentSlicers[index].containerHeight =
                this.currentSlicers[index].containerHeight - ev.y + this.startY;
            this.globalVariableService.currentSlicers[index].containerHeight =
                this.currentSlicers[index].containerHeight;

            this.currentSlicers[index].graphHeight =
                this.currentSlicers[index].graphHeight - ev.y + this.startY;
            this.globalVariableService.currentSlicers[index].graphHeight =
                this.currentSlicers[index].graphHeight;
        };

        // Right moved: adjust the width
        if (resizeRight) {
            this.currentSlicers[index].containerWidth =
                this.currentSlicers[index].containerWidth - this.startX + ev.x;
            this.globalVariableService.currentSlicers[index].containerWidth =
                this.currentSlicers[index].containerWidth;

            this.currentSlicers[index].graphWidth =
                this.currentSlicers[index].graphWidth - this.startX + ev.x;
            this.globalVariableService.currentSlicers[index].graphWidth =
                this.currentSlicers[index].graphWidth;
        };

        // Bottom moved: adjust the height
        if (resizeBottom) {
            this.currentSlicers[index].containerHeight =
                this.currentSlicers[index].containerHeight - this.startY + ev.y;
            this.globalVariableService.currentSlicers[index].containerHeight =
                this.currentSlicers[index].containerHeight;

            this.currentSlicers[index].graphHeight =
                this.currentSlicers[index].graphHeight - this.startY + ev.y;
            this.globalVariableService.currentSlicers[index].graphHeight =
                this.currentSlicers[index].graphHeight;
        };

        // Left moved: adjust the width & left
        if (resizeLeft) {
            this.currentSlicers[index].containerLeft =
                this.currentSlicers[index].containerLeft - this.startX + ev.x;
            this.globalVariableService.currentSlicers[index].containerLeft =
                this.currentSlicers[index].containerLeft;

            this.currentSlicers[index].containerWidth =
                this.currentSlicers[index].containerWidth - ev.x + this.startX;
            this.globalVariableService.currentSlicers[index].containerWidth =
                this.currentSlicers[index].containerWidth;

            this.currentSlicers[index].graphWidth =
                this.currentSlicers[index].graphWidth - ev.x + this.startX;
            this.globalVariableService.currentSlicers[index].graphWidth =
                this.currentSlicers[index].graphWidth;
        };


        console.log('clickResizeUp width buttons ev x-move',
            this.currentSlicers[index].containerWidth, this.currentSlicers[index].nrButtonsToShow,
            ev, 0 - this.startX + ev.x);
    }

    checkForOnlyOneWidget(widgetType: string = 'Graph'): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForOnlyOneWidget', '@Start');

        // Get all select W, for given type
        this.selectedWidgetIDs = [];
        if (widgetType == 'Slicer') {
            this.currentSlicers.forEach(w => {
                if (w.isSelected  &&  w.widgetType == widgetType) {
                    this.selectedWidgetIDs.push(w.id)
                }
            });
        } else {
            this.currentWidgets.forEach(w => {
                if (w.isSelected  &&  w.widgetType == widgetType) {
                    this.selectedWidgetIDs.push(w.id)
                }
            })

        };

        if (this.selectedWidgetIDs.length == 0) {
            this.showStatusBarMessage(
                   'No ' + widgetType + ' selected',
                   'StatusBar',
                   'Warning',
                   3000,
                   ''
            );
            return false;
        };
        if (this.selectedWidgetIDs.length > 1) {
            this.showStatusBarMessage(
                'More than 1 ' + widgetType + ' selected',
                'StatusBar',
                'Warning',
                3000,
                ''
            );
            return false;
        };

        // All good - only one
        return true;
    }

    checkForMultipleWidgets(): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForMultipleWidgets', '@Start');

        if (this.globalVariableService.selectedWidgetIDs.length < 2) {
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

    deleteWidget() {
        // Delete the selected W
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteWidget', '@Start');

        // Delete the local one
        let delIDs: number[] = [];
        for (var i = 0; i < this.currentWidgets.length; i++) {
            if (this.currentWidgets[i].isSelected) {
                delIDs.push(this.currentWidgets[i].id);
                this.currentWidgets.splice(i,1);
            };
        };

        // Delete the global one
        for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
            if (delIDs.indexOf(this.globalVariableService.widgets[i].id) >= 0) {
                console.log('xx deleteWidget selected id:', this.globalVariableService.widgets[i].id)
                this.globalVariableService.widgets.splice(i,1)
            };
        };

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

    clickWidgetContainerDragEnd(ev: MouseEvent, index: number) {
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

        console.log('clickWidgetContainerDragEnd starts index', index, this.startX, ev.x, this.currentWidgets)

        // Reset current and globalVar values
        this.currentWidgets[index].containerLeft =
            this.currentWidgets[index].containerLeft - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].containerLeft =
            this.currentWidgets[index].containerLeft;

        this.currentWidgets[index].containerTop =
            this.currentWidgets[index].containerTop - this.startY + ev.y;
        this.globalVariableService.currentWidgets[index].containerTop =
            this.currentWidgets[index].containerTop;

    }

    clickWidget(ev: MouseEvent, index: number, id: number) {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.showStatusBarMessage(
                'Not in Edit Mode (see Edit menu Option)',
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

        console.log('clickResizeUp starts index', index)

        this.currentWidgets[index].nrButtonsToShow =
            (this.currentWidgets[index].containerWidth - 50) / 22;


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
            this.currentWidgets[index].containerWidth, this.currentWidgets[index].nrButtonsToShow,
            ev, 0 - this.startX + ev.x);
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
        }
    }

    showWidgetForSlicer(id: number, datasourceID: number, datasetID: number) {
        // Returns True if a Widget is related to the selected Sl(s)
        // TODO - put back, but this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'showWidgetForSlicer', '@Start');

        // Get list of selected Sl
        let result: boolean = false;
        this.globalVariableService.currentWidgets.forEach(sl => {
            if (sl.isSelected   &&   sl.widgetType == 'Slicer'  && 
                sl.datasourceID == datasourceID   &&   sl.datasetID == datasetID) {
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
