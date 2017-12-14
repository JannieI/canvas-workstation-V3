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
    showModalDashboardSchedule: boolean = false;
    showModalDashboardDelete: boolean = false;
    showModalWidgetSteps: boolean = false;
    showModalDashboardPrint: boolean = false;
    showFav: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalDataPopup: boolean = false;
    showPalette: boolean = false;

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

    clickPaletteClose() {
        this.showPalette = ! this.showPalette;
    }

    clickMenuFileNew() {
        console.log('open')
        this.showModalDashboardNew = true;
    }

    clickMenuFileOpen() {
        console.log('open')
        this.showModalDashboardOpen = true;
    }

    clickMenuFileEdit() {

    }

    clickMenuFileDiscard() {
        console.log('clickMenuFileDiscard')
        this.showModalDashboardDiscard = true;
    }

    clickMenuFileShare() {

    }

    clickMenuFileSave() {
        console.log('open')
        this.showModalDashboardSave = true;
    }
    
    clickMenuFileCheckpoints() {
        this.showModalDashboardCheckpoints = true;
    }

    clickMenuFileRename() {
        this.showModalDashboardRename = true;
    }

    clickMenuFileDetails() {
        this.showModalDashboardDetails = true;
    }

    clickMenuFileDetailDescription() {
        this.showModalDashboardDescription = true;
    }

    clickMenuFileDetailTags() {
        this.showModalDashboardTags = true;
    }

    clickMenuFileDetailSettings() {
        this.showModalDashboardSettings = true;
    }

    clickMenuFileDetailTheme() {
        this.showModalDashboardTheme = true;
    }

    clickMenuFileDetailSchedule() {
        this.showModalDashboardSchedule = true;
    }

    clickMenuFilePermissions() {

    }

    clickMenuFilePrint() {
        this.showModalDashboardPrint = true;
    }

    clickMenuFileDelete() {
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

    }

    clickMenuEditUndo() {

    }

    clickMenuEditRedo() {

    }

    clickMenuEditWidget() {

    }

    clickMenuEditWidgetCopyFormat() {

    }

    clickMenuEditWidgetPastFormat() {

    }

    clickMenuEditWidgetCopy() {

    }

    clickMenuEditWidgetCut() {

    }

    clickMenuEditWidgetPaste() {

    }

    clickMenuEditSelectAll() {

    }

    clickMenuEditSelectNone() {

    }

    clickMenuEditSteps() {
        this.showModalWidgetSteps = true;
    }

    clickMenuEditReplace() {

    }

    clickMenuEditDeleteWidget() {

    }

    clickMenuViewPresentation() {
        this.globalVariableService.presentation.next(!this.presentation);
    }

    clickMenuViewPrintLayout(){

    }

    clickMenuViewShowGrid() {
        this.globalVariableService.showGrid.next(!this.showGrid);
    }

    clickMenuViewZoom() {

    }

    clickMenuViewAllComments() {
        this.showModalDashboardComments = true;
    }

    clickMenuViewWidgetEditor() {
        this.showModalWidgetEditor = true;
    }

    clickMenuCreateComment() {
        
    }

    clickMenuFormatBold() {
        
    }
        
    clickMenuFormatItalic() {
        
    }

    clickMenuFormatUnderline() {
        
    }

    clickMenuFormatSnapToGrid() {
        
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
    
    clickMenuUserMyProfile() {
        console.log('ddd')
        this.showModalDashboardMyProfile = true;
    }

    clickMenuUserLogin() {
        this.showModalDashboardLogin = true;
    }

    clickMenuUserLogout() {
        this.showModalDashboardLogout = true;
    }

    clickMenuUserPreferences() {
        this.showModalDashboardPreferences = true;
    }

    clickMenuHelpDemo() {
        this.router.navigate(['/help']);
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
