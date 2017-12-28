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
import { field }                      from './models'
import { canvasWidget }               from './models'
import { currentDatasource }          from './models'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('circle1', {read: ElementRef}) circle1: ElementRef;  //Vega graph

    editMode: boolean;
    hasDatasources: boolean = false;
    editMenuText: string;
    fields: field[];
    menuCreateDisabled: boolean;
    moveStartX: number;
    moveStartY: number;
    moveEndX: number;
    moveEndY: number;
    moveOffsetX: number;
    moveOffsetY: number;
    moveLastX: number = 0;
    moveLastY: number = 0;
    presentation: boolean;
    // showCircle: boolean = false;
    // showImage: boolean = false;
    // showTextBox: boolean = false;
    // showRectangle: boolean = false;
    showGrid: boolean;
    showModalLanding: boolean;  // Show Landing Page
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
    showModalDataSlicers: boolean = false;
    showModalDataCombination: boolean = false;
    showModalDataRefresh: boolean = false;
    showModalDataShare: boolean = false;
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
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
    currentWidgetSpec: string = "{...}";

    localTrash: canvasWidget[];
    localWidgets: canvasWidget[];
    currentDatasources: currentDatasource[];

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
    }
    
    ngOnInit() {
        // Intial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.menuCreateDisabled.subscribe(
            menuCreateDisabled => this.menuCreateDisabled = menuCreateDisabled
        );
        this.globalVariableService.presentation.subscribe(
            pres => this.presentation = pres
        );
        this.globalVariableService.showGrid.subscribe(
            sG => this.showGrid = sG
        );
        this.showModalLanding = this.globalVariableService.showModalLanding;
        this.globalVariableService.showMainMenu.subscribe(
            sm => this.showMainMenu = sm
        );
        this.globalVariableService.localTrash.subscribe(
            i => this.localTrash = i
        );
        this.globalVariableService.localWidgets.subscribe(
            i => this.localWidgets = i
        );
        this.globalVariableService.currentDatasources.subscribe(
            i => {
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

    handleCloseModalLanding() {
        // Close Modal form Landing page
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalLanding', '@Start');

        this.showModalLanding = false;
        this.document.body.style.backgroundImage ='../images/BarChart.png';
        
    }

    handleCloseWidgetEditor() {
        this.showModalWidgetEditor = false;
    }

    handleCloseDashboardNew(action) {
        this.showModalDashboardNew = false;
    }

    handleCloseDashboardOpen(action) {
        this.showModalDashboardOpen = false;
    }

    handleCloseDashboardSave(action) {
        this.showModalDashboardSave = false;
    }

    handleCloseDashboardSnapshots() {
        this.showModalDashboardSnapshots = false;
    }

    handleCloseDashboardShare() {
        this.showModalDashboardShare = false;
    }
    handleCloseDashboardImport() {
        this.showModalDashboardImport = false;
    }

    handleCloseDashboardDiscard() {
        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardRename(action) {
        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDetails(action) {
        this.showModalDashboardDetails = false;
    }

    handleCloseDashboardDescription() {
        this.showModalDashboardDescription = false;
    }

    handleCloseDashboardTags() {
        this.showModalDashboardTags = false;
    }

    handleCloseDashboardSettings() {
        this.showModalDashboardSettings = false;
    }

    handleCloseDashboardTheme() {
        this.showModalDashboardTheme = false;
    }
    
    handleCloseDashboardTemplate() {
        this.showModalDashboardTemplate = false;
    }

    handleCloseDashboardSchedule() {
        this.showModalDashboardSchedule = false;
    }

    handleCloseDashboardDelete() {
        this.showModalDashboardDelete = false;
    }

    handleCloseDashboardTreeview(){
        this.showModalDashboardTreeview = false;
    }

    handleCloseDashboardSubscribe() {
        this.showModalDashboardSubscribe = false;
    }

    handleCloseShapeEdit(action: string) {
        this.showModalShapeEdit = false;
        if (action == 'saved') {
            alert('saved')
        }
    }

    handleCloseShapeDelete() {
        this.showModalShapeDelete = false;
    }
    
    handleCloseDashboardComments() {
        this.showModalDashboardComments = false;
    }

    handleCloseDashboardPrint() {
        this.showModalDashboardPrint = false;
    }

    handleCloseDataSlicers() {
        this.showModalDataSlicers = false;
    }
    
    handleCloseDataCombination() {
        this.showModalDataCombination = false;
    }
    
    handleCloseDataRefresh() {
        this.showModalDataRefresh = false;
    }

    handleCloseDataShare() {
        this.showModalDataShare = false;
    }

    handleCloseWidgetCheckpoints() {
        this.showModalWidgetCheckpoints = false;
    }
    
    handleCloseWidgetComments() {
        this.showModalWidgetComments = false;
    }
    
    handleCloseWidgetLinks() {
        this.showModalWidgetLinks = false;
    }
    
    handleCloseWidgetDuplicate() {
        this.showModalWidgetDuplicate = false;
    }
    
    handleCloseWidgetExpand() {
        this.showModalWidgetExpand = false;
    }

    handleCloseWidgetExport() {
        this.showModalWidgetExport = false;
    }

    handleCloseWidgetDelete() {
        console.log('Trashed Widgets', this.localTrash)
        this.showModalWidgetDelete = false;
    }

    handleCloseCollaborateAlerts() {
        this.showModalCollaborateAlerts = false;
    }

    handleCloseCollaborateActivityAdd() {
        this.showModalCollaborateActivityAdd = false;
    }

    handleCloseCollaborateMessages() {
        this.showModalCollaborateMessages = false;
    }
    
    handleCloseCollaborateActivities() {
        this.showModalCollaborateActivities = false;
    }

    handleCloseUserLogin(action) {
        this.showModalDashboardLogin = false;
    }

    handleCloseUserLogout(action) {
        this.showModalDashboardLogout = false;
    }

    handleCloseUserPreferences(action) {
        this.showModalUserPreferences = false;
    }

    handleCloseUserdMyProfile(action) {
        this.showModalUserMyProfile = false;
    }

    handleCloseUserWidgetButtonBar(action) {
        this.showModalUserWidgetButtonBar = false;
    }
    
    handleCloseUserShapeButtonBar(action) {
        this.showModalUserShapeButtonBar = false;
    }

    handleCloseUserSystemSettings(action) {
        this.showModalUserSystemSettings = false;
    }

    handleCloseUserOffline() {
        this.showModalUserOffline = false;
    }

    clickDashboardNew() {
        console.log('open')
        this.showModalDashboardNew = true;
    }

    clickDashboardOpen() {
        console.log('open')
        this.showModalDashboardOpen = true;
    }

    clickDashboardEdit() {
        this.globalVariableService.editMode.next(!this.editMode);
    }

    clickDashboardDiscard() {
        this.showModalDashboardDiscard = true;
    }

    clickDashboardShare() {
        this.showModalDashboardShare = true;
    }

    clickDashboardSave() {
        console.log('open')
        this.showModalDashboardSave = true;
    }
    
    clickDashboardSnapshots() {
        this.showModalDashboardSnapshots = true;
    }

    clickDashboardImport() {
        this.showModalDashboardImport = true;
    }
    

    clickDashboardRename() {
        this.showModalDashboardRename = true;
    }

    clickMenuFileDetails() {
        this.showModalDashboardDetails = true;
    }

    clickMenuDashboardDetailDescription() {
        this.showModalDashboardDescription = true;
    }

    clickMenuDashboardDetailTags() {
        this.showModalDashboardTags = true;
    }

    clickMenuDashboardDetailSettings() {
        this.showModalDashboardSettings = true;
    }

    clickMenuDashboardDetailComments() {
        this.showModalDashboardComments = true;
    }

    clickMenuDashboardDetailTheme() {
        this.showModalDashboardTheme = true;
    }

    clickMenuDashboardDetailTemplate() {
        this.showModalDashboardTemplate = true;
    }

    clickMenuDashboardDetailSchedule() {
        this.showModalDashboardSchedule = true;
    }

    clickMenuDashboardPrint() {
        this.showModalDashboardPrint = true;
    }

    clickMenuDashboardDelete() {
        this.showModalDashboardDelete = true;
    }

    clickMenuDashboardTreeview() {
        this.showModalDashboardTreeview = true;
    }

    clickMenuDashboardSubscribe() {
        this.showModalDashboardSubscribe = true;
    }

    clickMenuDataFromFile() {
        console.log('menuDataFromFile')
        this.globalVariableService.dataGetFromSwitch.next('File');
        this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        console.log('clickMenuDataFromServer')
        this.globalVariableService.dataGetFromSwitch.next('Server');
        this.router.navigate(['/data']);
    }

    clickMenuDataCombinations(){
        this.showModalDataCombination = true;
    }

    clickMenuDataSlicerAdd() {
        this.showModalDataSlicers = true;
    }

    clickMenuDataSlicerEdit() {
        this.showModalDataSlicers = true;
    }

    clickMenuDataSlicerDelete() {

    }

    clickMenuDataRefreshAll() {
        this.showModalDataRefresh = true;
    }

    clickMenuDataShare() {
        this.showModalDataShare = true;
    }

    clickMenuWidgetNew() {
        if (this.currentDatasources.length == 0) {
            alert('Please add a Dataset first: Data -> From File')
        } else {
            this.showModalWidgetEditor = true;
        };
    }

    clickMenuWidgetEdit() {
        if (this.currentDatasources.length == 0) {
            alert('Please add a Dataset first: Data -> From File')
        } else {
            this.showModalWidgetEditor = true;
        };
    }

    clickMenuWidgetCheckpoints() {
        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetComments() {
        this.showModalWidgetComments = true;
    }

    clickMenuWidgetLinks() {
        this.showModalWidgetLinks = true;
    }

    clickMenuWidgetRefresh() {
        this.showModalWidgetRefresh = true;
        this.globalVariableService.statusBarRunning.next('Query Running');
        this.globalVariableService.statusBarCancelRefresh.next('Cancel');
    }

    clickMenuWidgetDuplicate() {
        this.showModalWidgetDuplicate = true;
        this.globalVariableService.duplicateDashboard.next(true);
    }

    clickMenuWidgetExpand() {
        this.showModalWidgetExpand = true;
        this.router.navigate(['/expand']);
    }

    clickMenuWidgetExport() {
        this.showModalWidgetExport = true;
    }

    clickMenuWidgetCopy() {
        // Copies reference to existing datasource (of From Widget)
        // For now, only per Dashboard - issue with Global paste is datasource
        // What if not defined in the new Dashboard ?
    }

    clickMenuWidgetCut() {

    }

    clickMenuWidgetPaste() {

    }

    clickMenuWidgetDelete() {
        this.showModalWidgetDelete = true;
    }        

    clickMenuEditUndo() {

    }

    clickMenuEditRedo() {

    }

    clickMenuEditSelectAll() {

    }

    clickMenuEditSelectNone() {

    }

    clickMenuShapeNew() {
        this.showModalShapeEdit = true;
    }
    
    clickMenuShapeEdit() {
        this.showModalShapeEdit = true;
    }

    clickMenuShapeLinks() {
        this.showModalWidgetLinks = true;
    }
    
    clickMenuShapeDelete() {
        this.showModalShapeDelete = true;
    }

    clickMenuViewPresentation() {
        this.globalVariableService.presentation.next(!this.presentation);
        this.globalVariableService.showMainMenu.next(false);
    }

    clickMenuViewPrintPreview(){

    }

    clickMenuViewShowGrid() {
        this.globalVariableService.showGrid.next(!this.showGrid);
    }

    clickMenuViewSnapToGrid() {
        
    }

    clickMenuViewZoom() {

    }

    clickMenuArrangeBackward() {
        
    }

    clickMenuArrangeForward() {
        
    }

    clickMenuArrangeBack() {
        
    }

    clickMenuArrangeFront() {
        
    }

    clickMenuArrangeAlignCenterPageDown() {
        
    }

    clickMenuArrangeAlignCenterPageRight() {
        
    }

    clickMenuArrangeGroup() {
        
    }

    clickMenuArrangeUnGroup() {
        
    }

    clickMenuArrangeDistributeVertical() {
        
    }

    clickMenuArrangeDistributeHorisontal() {
        
    }

    clickMenuArrangeSameSize() {
        
    }

    clickMenuHelpDemo() {
        this.router.navigate(['/help']);
    }
    
    // clickMenuPreferences Messages etc


    clickMenuCollaborateAlerts() {
        this.showModalCollaborateAlerts = true;
    }

    clickMenuCollaborateActivityAdd() {
        this.showModalCollaborateActivityAdd = true;
    }

    clickMenuCollaborateMessages() {
        this.showModalCollaborateMessages = true;
    }

    clickMenuCollaborateActivities() {
        this.showModalCollaborateActivities = true;
    }

    clickMenuUserLogin() {
        this.showModalDashboardLogin = true;
    }


    clickMenuUserMyProfile() {
        console.log('ddd')
        this.showModalUserMyProfile = true;
    }

    clickMenuUserPreferences() {
        this.showModalUserPreferences = true;
    }
    
    clickMenuUserWidgetButtonBar() {
        this.showModalUserWidgetButtonBar = true;
    }

    clickMenuUserShapeButtonBar() {
        this.showModalUserShapeButtonBar = true;
    }

    clickMenuUserSystemSettings() {
        this.showModalUserSystemSettings = true;
    }

    clickMenuUserOffline() {
        this.showModalUserOffline = true;
    }
    
    clickMenuUserLogout() {
        this.showModalDashboardLogout = true;
    }

    showRecentDashboard(index: number) {
        this.globalVariableService.dashboardRecent();
        // this.globalVariableService.refreshDashboard.next(true);
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
