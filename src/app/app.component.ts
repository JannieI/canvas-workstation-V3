/* 
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { DOCUMENT }                   from '@angular/platform-browser';
import { Inject }                     from "@angular/core";
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

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
    fields: field[];
    
    menuCreateDisabled: boolean = false;
    presentation: boolean;
    showCollaborate: boolean = false;
    showGrid: boolean;
    showModalLanding: boolean = false;
    showModalDashboardNew: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardSave: boolean = false;
    showModalDashboardCheckpoints: boolean = false;
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
    showFav: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalDataPopup: boolean = false;
    showPalette: boolean = false;
    currentWidgetSpec: string = "{...}";

    constructor(
        private router: Router,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        @Inject(DOCUMENT) private document: Document
        
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

    clickMenuCreateWidget() {
        this.showModalWidgetEditor = true;
    }

    menuDataFromFile() {
        console.log('menuDataFromFile')
        this.showModalDataPopup = true;
    }

    menuDataFromServer() {
        console.log('menuDataFromServer')
    }
    menuDataGetData() {
        console.log('menuDataGetData')
        this.globalVariableService.changeMenuCreateDisabled(true);
        this.router.navigate(['/data']);
    }

    menuCreateShapeRectangle() {
        // <div style="width:500px;height:100px;border:1px solid #000;">This is a rectangle!</div>
    }

    menuCreateShapeCircle() {
        // <svg height="100" width="100">
        //     <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
        // </svg>
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

    clickMenuFileSave() {
        console.log('open')
        this.showModalDashboardSave = true;
    }

    clickMenuFilePermissions() {

    }
    
    clickMenuFileCheckpoints() {
        this.showModalDashboardCheckpoints = true;
    }

    clickViewPresentation() {
        this.globalVariableService.presentation.next(!this.presentation);
    }
    clickViewShowGrid() {
        this.globalVariableService.showGrid.next(!this.showGrid);
    }

    clickViewAllComments() {
        this.showModalDashboardComments = true;
    }

    menuUserMyProfile() {
        console.log('ddd')
        this.showModalDashboardMyProfile = true;
    }

    menuUserLogin() {
        this.showModalDashboardLogin = true;
    }

    menuUserLogout() {
        this.showModalDashboardLogout = true;
    }

    menuUserPreferences() {
        this.showModalDashboardPreferences = true;
    }

    clickMenuFileRename() {
        this.showModalDashboardRename = true;
    }

    clickMenuFileDetails() {
        this.showModalDashboardDetails = true;
    }

    clickMenuFileDescription() {
        this.showModalDashboardDescription = true;
    }

    clickMenuFileTags() {
        this.showModalDashboardTags = true;
    }

    clickMenuFileSettings() {
        this.showModalDashboardSettings = true;
    }

    clickMenuFileTheme() {
        this.showModalDashboardTheme = true;
    }

    clickMenuFileSchedule() {
        this.showModalDashboardSchedule = true;
    }

    clickMenuFileDelete() {
        this.showModalDashboardDelete = true;
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
