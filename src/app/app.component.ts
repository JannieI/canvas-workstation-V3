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

// Renderer eksperiment
import { Renderer2 }                   from '@angular/core';


// Own Services
import { GlobalVariableService }      from './global-variable.service';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Own Components
import { field }                      from './models'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('dragCircle', {read: ElementRef}) dragCircle: ElementRef;  //Vega graph
    @ViewChild('circle1', {read: ElementRef}) circle1: ElementRef;  //Vega graph

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
    showCircle: boolean = false;
    showImage: boolean = false;
    showTextBox: boolean = false;
    showRectangle: boolean = false;
    showCollaborate: boolean = false;
    showGrid: boolean;
    showModalLanding: boolean;  // Show Landing Page
    showModalDashboardNew: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardSnapshots: boolean = false;
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
    showMainMenu: boolean = true;
    showModalWidgetCheckpoints: boolean = false;
    showModalWidgetNotes: boolean = false;
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
    showModalShapeEdit: boolean = false;
    showModalShapeDelete: boolean = false;
    showFav: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalCollaborateAlerts: boolean = false;
    showModalCollaborateMessages: boolean = false;
    showModalCollaborateActivities: boolean = false;
    showModalUserMyProfile: boolean = false;
    showModalUserPreferences: boolean = false;
    showModalUserWidgetButtonBar: boolean = false;
    showModalUserShapeButtonBar: boolean = false;
    showModalUserSystemSettings: boolean = false;
    showModalUserOffline: boolean = false;
    currentWidgetSpec: string = "{...}";

    // Testings ....
    test: number[] = [1,2,3,4,5,6];
    condition: boolean = true;

    constructor(
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private router: Router,


        // Renderer eksperiment
        private el: ElementRef,
        private renderer2: Renderer2,
        
    ) {
    }
    
    ngOnInit() {
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
    }   

    handleCloseModal() {
        this.showModalLanding = false;
        this.document.body.style.backgroundImage ='../images/BarChart.png';
        
    }

    handleCloseWidgetEditor() {
        this.showModalWidgetEditor = false;
    }

    handleCloseCollaborate() {
        this.showCollaborate = false;
        console.log('handleCloseCollaborate')
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

    handleCloseWidgetCheckpoints() {
        this.showModalWidgetCheckpoints = false;
    }
    
    handleCloseWidgetNotes() {
        this.showModalWidgetNotes = false;
    }
    
    handleCloseWidgetLinks() {
        this.showModalWidgetLinks = false;
    }

    handleCloseWidgetRefresh() {
        this.showModalWidgetRefresh = false;
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
        this.showModalWidgetDelete = false;
    }

    handleCloseCollaborateAlerts() {
        this.showModalCollaborateAlerts = false;
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
        this.globalVariableService.editMode.next(true);
    }

    clickDashboardDiscard() {
        this.showModalDashboardDiscard = true;
    }

    clickDashboardShare() {

    }

    clickDashboardSave() {
        console.log('open')
        this.showModalDashboardSave = true;
    }
    
    clickDashboardSnapshots() {
        this.showModalDashboardSnapshots = true;
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

    clickMenuDataPermissions() {

    }

    clickMenuDataRefreshAll() {
        this.showModalDataRefresh = true;
    }

    clickMenuWidgetNew() {

        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetEdit() {
        this.showModalWidgetEditor = true;
    }

    clickMenuWidgetCheckpoints() {
        this.showModalWidgetCheckpoints = true;
    }

    clickMenuWidgetNotes() {
        this.showModalWidgetNotes = true;
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
        console.log('clickMenuShapeLinks')

        const div = this.renderer2.createElement('div');
        const svg = this.renderer2.createElement('svg');
        const circle = this.renderer2.createElement('circle');
        const text = this.renderer2.createText('Hallo World !');
        // const rect = this.renderer2.createElement('rect')
         
        this.renderer2.appendChild(div, text);
        // this.renderer2.appendChild(svg, circle);
        // this.renderer2.appendChild(rect, text);
        // this.renderer2.appendChild(svg, this.dragCircle);

        // this.renderer2.appendChild(svg, rect);
        this.renderer2.appendChild(div, svg);
        this.renderer2.appendChild(this.el.nativeElement, div);
        
        
        this.renderer2.addClass(div, 'aCircle');
        this.renderer2.addClass(svg, 'aCircleDet');
        this.renderer2.addClass(circle, 'aCircleDet');
        // this.renderer2.addClass(rect, 'aCircleRect');
        
        // this.renderer2.setAttribute(rect, 'width', "400") 
        // this.renderer2.setAttribute(rect, 'height', "50")
        // this.renderer2.setStyle(rect, "fill", "rgb(0,0,255)")
        // this.renderer2.setStyle(rect, "stroke-width", "10;stroke:rgb(0,0,0)")
        // this.renderer2.setStyle(
        //     div,
        //     'border-right',
        //     '2px dashed olive'
        // );
        // this.renderer2.setStyle(
        //     div,
        //     'background-color',
        //     'orange'
        // );

        this.renderer2.setAttribute(circle, 'id', 'circle1' );

        // this.renderer2.setAttribute(circle, 'cx', '50' );
        // this.renderer2.setAttribute(circle, 'cy', '50' );
        // this.renderer2.setAttribute(circle, 'r', '40' );
        // this.renderer2.setAttribute(circle, 'stroke', 'red' );
        // this.renderer2.setAttribute(circle, 'stroke-width', '1' );
        // this.renderer2.setAttribute(circle, 'fill', 'none' );

        // circle.innerHTML = '<circle cx="50" cy="50" r="30" stroke="blue" stroke-width="2" fill="none" />'
        svg.innerHTML = '<circle cx="50" cy="50" r="30" stroke="green" stroke-width="2" fill="none" />'
        // console.log('circle.innerHTML', circle.innerHTML)
        // this.renderer2.listen('document', rect,  (event) => console.log('yes') )
        // console.log('circle', circle)
        console.log('svg', svg)

        // this.showCircle = true;
  
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

    dragStartCircle(ev: DragEvent) {
        this.moveStartX = ev.x;
        this.moveStartY = ev.y;
        console.log('dragStartWidget', ev, this.moveStartX)
    }

    dragEndCircle(ev: DragEvent) {
        this.moveEndX = ev.x;
        this.moveEndY = ev.y;
        this.moveOffsetX = this.moveEndX - this.moveStartX;
        this.moveOffsetY = this.moveEndY - this.moveStartY;
        this.moveLastX = this.moveLastX + this.moveOffsetX;
        this.moveLastY = this.moveLastY + this.moveOffsetY;
        console.log('dragEndWidget', ev, (this.moveLastY));
        // this.renderer.setElementStyle(
        //     this.dragCircle.nativeElement,'background-color', 'orange'
        // );

        this.renderer.setElementStyle(this.dragCircle.nativeElement,
            'left', (this.moveLastX) + 'px');
        this.renderer.setElementStyle(this.dragCircle.nativeElement,
            'top', (this.moveLastY) + 'px');
    
        // this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //     'top', (80 + widgetMoveX).toString() + "px");
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
