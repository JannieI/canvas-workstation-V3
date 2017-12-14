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

// Own Components
import { field }                      from './models'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('dragCircle', {read: ElementRef}) dragCircle: ElementRef;  //Vega graph
    
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
    showModalLanding: boolean = true;
    showModalDashboardNew: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardCheckpoints: boolean = false;
    showModalDashboardDiscard: boolean = false;
    showModalDashboardMyProfile: boolean = false;
    showModalDashboardLogin: boolean = false;
    showModalDashboardLogout: boolean = false;
    showModalDashboardPreferences: boolean = false;
    showModalDashboardComments: boolean = false;
    showModalDashboardRename: boolean = false;
    showModalDashboardDetails: boolean = false;
    showModalDashboardDescription: boolean = false;
    showModalDashboardTags: boolean = false;
    showModalDashboardSettings: boolean = false;
    showModalDashboardTheme: boolean = false;
    showModalDashboardTemplate: boolean = false;
    showModalDashboardSchedule: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalWidgetSteps: boolean = false;
    showModalDashboardPrint: boolean = false;
    showModalDataRefresh: boolean = false;
    showFav: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalDataPopup: boolean = false;

    currentWidgetSpec: string = "{...}";

    constructor(
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private router: Router,
        
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
        
    }   

    handleCloseModal() {
        this.showModalLanding = false;
        this.document.body.style.backgroundImage ='../images/BarChart.png';
        
    }

    handleCloseDataPopup() {
        this.showModalDataPopup = false;
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

    handleCloseDashboardCheckpoints() {
        this.showModalDashboardCheckpoints = false;
    }

    handleCloseDashboardDiscard() {
        this.showModalDashboardDiscard = false;
    }

    handleCloseDashboardMyProfile(action) {
        this.showModalDashboardMyProfile = false;
    }

    handleCloseDashboardLogin(action) {
        this.showModalDashboardLogin = false;
    }

    handleCloseDashboardLogout(action) {
        this.showModalDashboardLogout = false;
    }

    handleCloseDashboardPreferences(action) {
        this.showModalDashboardPreferences = false;
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

    handleCloseDashboardComments() {
        this.showModalDashboardComments = false;
    }
    
    handleCloseWidgetSteps() {
        this.showModalWidgetSteps = false;
    }

    handleCloseDashboardPrint() {
        this.showModalDashboardPrint = false;
    }

    handleCloseDataRefresh() {
        this.showModalDataRefresh = false;
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
    
    clickDashboardCheckpoints() {
        this.showModalDashboardCheckpoints = true;
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
        // this.showModalDataPopup = true;
        this.router.navigate(['/data']);
    }

    clickMenuDataFromServer() {
        console.log('clickMenuDataFromServer')
    }

    clickMenuDataCombinations(){

    }

    clickMenuDataPermissions() {

    }

    clickMenuDataRefreshAll() {
        this.showModalDataRefresh = true;
    }

    clickMenuWidgetNew() {

    }

    clickMenuWidgetEdit() {
        
    }

    clickMenuWidgetSteps() {
        this.showModalWidgetSteps = true;
    }

    clickMenuWidgetComments() {
        this.showModalDashboardComments = true;
    }

    clickMenuWidgetCopy() {
        
    }

    clickMenuWidgetCut() {

    }

    clickMenuWidgetPaste() {

    }

    clickMenuWidgetDelete() {
        
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
        
    }
    
    clickMenuShapeEdit() {
        
    }
    
    clickMenuShapeDelete() {
        
    }

    clickMenuViewPresentation() {
        this.globalVariableService.presentation.next(!this.presentation);
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


    clickMenuUserLogin() {
        this.showModalDashboardLogin = true;
    }


    clickMenuUserMyProfile() {
        console.log('ddd')
        this.showModalDashboardMyProfile = true;
    }

    clickMenuUserPreferences() {
        this.showModalDashboardPreferences = true;
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
