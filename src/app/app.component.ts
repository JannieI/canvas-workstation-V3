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

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';


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
    @ViewChild('widgetDOM')  widgetDOM: WidgetComponent;

    companyName: string = this.globalVariableService.companyName;
    editMode: boolean;
    hasDatasources: boolean = false;
    editMenuText: string;
    fields: Field[];
    moveStartX: number;
    moveStartY: number;
    moveEndX: number;
    moveEndY: number;
    moveOffsetX: number;
    moveOffsetY: number;
    moveLastX: number = 0;
    moveLastY: number = 0;
    presentationMode: boolean;
    showGrid: boolean;
    showDataQuality: boolean;
    showComments: boolean;
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
    showMultiTabMenu: boolean = false;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetComments: boolean = false;
    showModalWidgetLinks: boolean = false;
    showModalWidgetRefresh: boolean = false;
    showModalWidgetDuplicate: boolean = false;
    showModalWidgetExpand: boolean = false;
    showModalWidgetExport: boolean = false;
    showModalWidgetDelete: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalData: boolean = false;
    showModalDataSlicers: boolean = false;
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
    showModalUserMyProfile: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUserWidgetButtonBar: boolean = false;
    showModalUserShapeButtonBar: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showModalUserOffline: boolean = false;
    currentDashboardName: string = '';
    currentTabName: string = '';
    statusBarRunning: boolean = false;
    statusBarCancelRefresh: boolean = false;

    currentWidgets: Widget[] = [];
    showModalLanding: boolean;

    // Testings ....
    refreshGraphs: boolean = false;
    currentSlicers: Widget[] = [];
    startX: number;
    startY: number;
    widgetIndex: number;
    selectedWidgetIDs: number[] = [];


    constructor(
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
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
                console.log(i, this.presentationMode)
                    this.editMode = i;
                    if (!i) {this.editMenuText = 'Edit Mode'}
                    else {this.editMenuText = 'View Mode'};
                 }
        );

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
                                this.currentWidgets = this.globalVariableService.
                                    currentWidgets;

                                // Get Sl
                                this.currentSlicers = this.globalVariableService.currentSlicers;
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
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

        if (this.widgetDOM != undefined  &&  (!this.refreshGraphs) ) {
            this.refreshGraphs = true;
            this.widgetDOM.refreshWidgets();
        }
    }

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

    handleCloseWidgetEditor(action: string) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

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

        this.showModalWidgetDuplicate = false;
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
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDelete', '@Start');

        console.log('App handleCloseWidgetDelete')
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
            this.currentWidgets.forEach(i => i.isSelected = false);
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

    clickMenuFileDetails() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuFileDetails', '@Start');

        this.showModalDashboardDetails = true;
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

    clickMenuDataFromFile() {
        // 
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

    clickMenuDataSlicerAdd() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataSlicerAdd', '@Start');

        this.showModalDataSlicers = true;
    }

    clickMenuDataSlicerEdit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataSlicerEdit', '@Start');

        this.showModalDataSlicers = true;
    }

    clickMenuDataSlicerDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataSlicerDelete', '@Start');

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

    clickMenuWidgetNew() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetNew', '@Start');

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetEdit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetEdit', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

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

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.NoQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuWidgetDuplicate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.showModalWidgetDuplicate = true;
        this.globalVariableService.duplicateWidget.next(true);
    }

    clickMenuWidgetExpand() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        if (!this.checkForOnlyOneWidget()) { return};

        this.widgetIndex = 0;
        this.showModalWidgetExpand = true;
        // this.router.navigate(['/expand']);
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
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectAll', '@Start');

        this.globalVariableService.menuActionSelectAll.next(true);
    }

    clickMenuEditSelectNone() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuEditSelectNone', '@Start');

        this.globalVariableService.menuActionSelectAll.next(false);
    }

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

    clickMenuHelpDemo() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuHelpDemo', '@Start');

        this.router.navigate(['/help']);
    }

    // clickMenuPreferences Messages etc


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

    clickSlicer(index: number, id: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicer', '@Start');

        // TODO - fix index..
        this.currentSlicers[index].isSelected = !this.currentSlicers[index].isSelected;
        this.globalVariableService.currentSlicers.forEach(sl => {
            if (sl.id == id) {sl.isSelected = sl.isSelected}
        })

    }

    clickSlicerItem(index: number, id: number, datasourceID: number, datasetID: number, 
        fieldValue: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerItem', '@Start');

        // Adjust the Sl selection (local + Global)
        this.globalVariableService.currentSlicers.forEach(w => {
            if (w.id == id) {
                
                // Update the selected item
                w.slicerSelection.forEach(sel => {
                    if (sel.fieldValue == fieldValue) {
                        sel.isSelected = !sel.isSelected;
                    }
                })
            
            }
        });
 
        // Filter this dSet, applying all Sl that relates to it
        this.globalVariableService.currentDatasets.forEach(cd => {
            if (cd.id == datasetID) {
                
                this.globalVariableService.filterSlicer(cd);
            }
        }
        );

        // Refresh Ws that are related to Sl
        let wIDs: number[] = [];
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.datasourceID == datasourceID  &&  w.datasetID == datasetID) {
                wIDs.push(w.id);
            }
        })
        this.widgetDOM.refreshWidgets(-1,-1,wIDs);
        this.currentSlicers = this.globalVariableService.currentSlicers;
        console.log('xx', this.currentSlicers)
    }

    clickResizeDown(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeDown', '@Start');

        console.log('clickResizeDown', this.currentSlicers[index].containerLeft, ev);
        this.startX = ev.x;
        this.startY = ev.y;

    }

    clickResizeUp(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeUp', '@Start');

        console.log('clickResizeUp starts index', index)

        // Reset current and globalVar values
        this.currentSlicers[index].containerWidth =
            this.currentSlicers[index].containerWidth - this.startX + ev.x;
        this.globalVariableService.currentSlicers[index].containerWidth =
            this.currentSlicers[index].containerWidth;

        // console.log('clickResizeUp this.globalVariableService.currentSlicers[index].value',
        //     index, this.globalVariableService.currentSlicers.value[index])

        this.currentSlicers[index].nrButtonsToShow =
            (this.currentSlicers[index].containerWidth - 50) / 22;

        console.log('clickResizeUp width buttons ev x-move',
            this.currentSlicers[index].containerWidth, this.currentSlicers[index].nrButtonsToShow,
            ev, 0 - this.startX + ev.x);
    }

    checkForOnlyOneWidget(): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForOnlyOneWidget', '@Start');

        if (this.globalVariableService.selectedWidgetIDs.length == 0) {
            this.globalVariableService.statusBarMessage.next(
                {
                   message: 'No Widget selected',
                   uiArea: 'StatusBar',
                   classfication: 'Warning',
                   timeout: 3000,
                   defaultMessage: ''
                }
            );
            return false;
        };
        if (this.globalVariableService.selectedWidgetIDs.length > 1) {
            this.globalVariableService.statusBarMessage.next(
                {
                   message: 'More than 1 Widget selected',
                   uiArea: 'StatusBar',
                   classfication: 'Warning',
                   timeout: 3000,
                   defaultMessage: ''
                }
            );
            return false;
        };

        // All good
        return true;
    }

    checkForMultipleWidgets(): boolean {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'checkForMultipleWidgets', '@Start');

        if (this.globalVariableService.selectedWidgetIDs.length < 2) {
            this.globalVariableService.statusBarMessage.next(
                {
                   message: 'Select multiple Widgets',
                   uiArea: 'StatusBar',
                   classfication: 'Warning',
                   timeout: 3000,
                   defaultMessage: ''
                }
            );
            return false;
        };

        // All good
        return true;
    }

    clickSlicerTabs() {
        // Returns true if one and only widget was selected, else false
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerTabs', '@Start');

        this.showMultiTabMenu = !this.showMultiTabMenu;
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
