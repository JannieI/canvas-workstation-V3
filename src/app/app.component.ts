/*
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { DOCUMENT }                   from '@angular/platform-browser';
import { ElementRef }                 from '@angular/core';
import { Inject }                     from "@angular/core";
import { OnInit }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Own Services
import { GlobalVariableService }      from './global-variable.service';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Models
import { Field }                      from './models'
import { CanvasWidget }               from './models'
import { Datasource }                 from './models'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('circle1', {read: ElementRef}) circle1: ElementRef;  //Vega graph

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
    // showCircle: boolean = false;
    // showImage: boolean = false;
    // showTextBox: boolean = false;
    // showRectangle: boolean = false;
    showGrid: boolean;
    // showModalLanding: boolean;  // Show Landing Page
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

    localTrash: CanvasWidget[];
    currentDatasources: Datasource[];

    // Testings ....
    test: number[] = [1,2,3,4,5,6];
    condition: boolean = true;

    constructor(
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private router: Router,

    ) {
        console.log('App constructor')
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
        // this.showModalLanding = this.globalVariableService.showModalLanding;
        this.globalVariableService.showMainMenu.subscribe(
            sm => this.showMainMenu = sm
        );
        this.globalVariableService.localTrash.subscribe(
            i => this.localTrash = i
        );
        this.globalVariableService.currentDatasources.subscribe(
            i => {
                    console.log('App ngOnInit currentDatasource', i.length)
                    if (i.length > 0) { this.hasDatasources = true} else {this.hasDatasources = false}
                    this.currentDatasources = i
                 }
        );
        this.globalVariableService.editMode.subscribe(
            i => {
                    this.editMode = i;
                    if (!i) {this.editMenuText = 'Edit Mode'}
                    else {this.editMenuText = 'View Mode'};
                 }
        );
    }

    // handleCloseModalLanding() {
    //     // Close Modal form Landing page
    //     this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalLanding', '@Start');

    //     this.showModalLanding = false;
    //     this.document.body.style.backgroundImage ='../images/BarChart.png';
    //     if (this.globalVariableService.openDashboardFormOnStartup == true) {
    //     console.log('App handleCloseModalLanding')
    //         this.showModalDashboardOpen = true;
    //         this.router.navigate(['/explore']);
    //     }

    // }

    handleCloseWidgetEditor() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

        this.showModalWidgetEditor = false;
    }

    handleCloseDashboardNew(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardNew', '@Start');

        this.showModalDashboardNew = false;
    }

    handleCloseDashboardOpen(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardOpen', '@Start');

        this.showModalDashboardOpen = false;
    }

    handleCloseDashboardSave(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSave', '@Start');

        this.showModalDashboardSave = false;
    }

    handleCloseDashboardSnapshots() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSnapshots', '@Start');

        this.showModalDashboardSnapshots = false;
    }

    handleCloseDashboardShare() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardShare', '@Start');

        this.showModalDashboardShare = false;
    }

    handleCloseDashboardImport() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardImport', '@Start');

        this.showModalDashboardImport = false;
    }

    handleCloseDashboardDiscard() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDiscard', '@Start');

        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardRename(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardRename', '@Start');

        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDetails(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDetails', '@Start');

        this.showModalDashboardDetails = false;
    }

    handleCloseDashboardDescription() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDescription', '@Start');

        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTags', '@Start');

        this.showModalDashboardTags = false;
    }

    handleCloseDashboardSettings() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSettings', '@Start');

        this.showModalDashboardSettings = false;
    }

    handleCloseDashboardTheme() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTheme', '@Start');

        this.showModalDashboardTheme = false;
    }

    handleCloseDashboardTemplate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTemplate', '@Start');

        this.showModalDashboardTemplate = false;
    }

    handleCloseDashboardSchedule() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardSchedule', '@Start');

        this.showModalDashboardSchedule = false;
    }

    handleCloseDashboardDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardDelete', '@Start');

        this.showModalDashboardDelete = false;
    }

    handleCloseDashboardTreeview(){
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTreeview', '@Start');

        this.showModalDashboardTreeview = false;
    }

    handleCloseDashboardSubscribe() {
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

    handleCloseShapeDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseShapeDelete', '@Start');

        this.showModalShapeDelete = false;
    }

    handleCloseDashboardComments() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardComments', '@Start');

        this.showModalDashboardComments = false;
    }

    handleCloseDashboardPrint() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardPrint', '@Start');

        this.showModalDashboardPrint = false;
    }

    handleCloseDataSlicers() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataSlicers', '@Start');

        this.showModalDataSlicers = false;
    }

    // handleCloseData() {
    //     // 
    //     this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseData', '@Start');

    //     this.showModalData = false;
    // }
    
    handleCloseDataCombination() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataCombination', '@Start');

        this.showModalDataCombination = false;
    }

    handleCloseDataRefresh() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataRefresh', '@Start');

        this.showModalDataRefresh = false;
    }

    handleCloseDataShare() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDataShare', '@Start');

        this.showModalDataShare = false;
    }

    handleCloseWidgetCheckpoints() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetCheckpoints', '@Start');

        this.showModalWidgetCheckpoints = false;
    }

    handleCloseWidgetComments() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetComments', '@Start');

        this.showModalWidgetComments = false;
    }

    handleCloseWidgetLinks() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetLinks', '@Start');

        this.showModalWidgetLinks = false;
    }

    handleCloseWidgetDuplicate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDuplicate', '@Start');

        this.showModalWidgetDuplicate = false;
    }

    handleCloseWidgetExpand() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExpand', '@Start');

        this.showModalWidgetExpand = false;
    }

    handleCloseWidgetExport() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetExport', '@Start');

        this.showModalWidgetExport = false;
    }

    handleCloseWidgetDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetDelete', '@Start');

        console.log('App handleCloseWidgetDelete', this.localTrash)
        this.showModalWidgetDelete = false;
    }

    handleCloseCollaborateAlerts() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateAlerts', '@Start');

        this.showModalCollaborateAlerts = false;
    }

    handleCloseCollaborateActivityAdd() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivityAdd', '@Start');

        this.showModalCollaborateActivityAdd = false;
    }

    handleCloseCollaborateMessages() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateMessages', '@Start');

        this.showModalCollaborateMessages = false;
    }

    handleCloseCollaborateActivities() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseCollaborateActivities', '@Start');

        this.showModalCollaborateActivities = false;
    }

    handleCloseUserLogin(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogin', '@Start');

        this.showModalDashboardLogin = false;
    }

    handleCloseUserLogout(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserLogout', '@Start');

        this.showModalDashboardLogout = false;
    }

    handleCloseUserPreferences(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserPreferences', '@Start');

        this.showModalUserPreferences = false;
    }

    handleCloseUserdMyProfile(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserdMyProfile', '@Start');

        this.showModalUserMyProfile = false;
    }

    handleCloseUserWidgetButtonBar(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserWidgetButtonBar', '@Start');

        this.showModalUserWidgetButtonBar = false;
    }

    handleCloseUserShapeButtonBar(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserShapeButtonBar', '@Start');

        this.showModalUserShapeButtonBar = false;
    }

    handleCloseUserSystemSettings(action) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseUserSystemSettings', '@Start');

        this.showModalUserSystemSettings = false;
    }

    handleCloseUserOffline() {
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
        this.globalVariableService.showModalData.next(true);
        // this.showModalData = true;
        // this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuDataFromServer', '@Start');

        console.log('App clickMenuDataFromServer')
        this.globalVariableService.dataGetFromSwitch.next('Server');
        this.router.navigate(['/data']);
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

        if (this.currentDatasources.length == 0) {
            alert('Please add a Dataset first: Data -> From File')
        } else {
            this.showModalWidgetEditor = true;
        };
    }

    clickMenuWidgetEdit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetEdit', '@Start');

        if (this.currentDatasources.length == 0) {
            alert('Please add a Dataset first: Data -> From File')
        } else {
            this.showModalWidgetEditor = true;
        };
    }

    clickMenuWidgetCheckpoints() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetCheckpoints', '@Start');

        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetComments() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetComments', '@Start');

        this.showModalWidgetComments = true;
    }

    clickMenuWidgetLinks() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        this.showModalWidgetLinks = true;
    }

    clickMenuWidgetRefresh() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetRefresh', '@Start');

        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next(this.globalVariableService.NoQueryRunningMessage);
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuWidgetDuplicate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');

        this.showModalWidgetDuplicate = true;
        this.globalVariableService.duplicateWidget.next(true);
    }

    clickMenuWidgetExpand() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

        this.showModalWidgetExpand = true;
        this.router.navigate(['/expand']);
    }

    clickMenuWidgetExport() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExport', '@Start');

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
        this.globalVariableService.showMainMenu.next(false);
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
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeAligTop', '@Start');

        this.globalVariableService.menuActionResize.next(true);
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
