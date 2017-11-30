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
    showCollaborate: boolean = false;
    showModalLanding: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalDashboardRename: boolean = false;
    showModalDashboardDetails: boolean = false;
    showModalWidgetEditor: boolean = false;
    showModalDataPopup: boolean = false;
    showWizard: boolean = false;
    showModalDataPopup1: boolean = false;
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
        this.fields = this.globalVariableService.fields;
    }   

    clickMenuFileNew() {
    }
    
    clickMenuCreateWidget() {
        this.showModalWidgetEditor = true;
    }

    menuDataFromFile() {
        console.log('menuDataFromFile')
        this.showModalDataPopup = true;
    }

    menuDataFromServer() {
        // console.log('menuDataFromServer 1', this.showWizard, this.showModalDataPopup1)
        this.showWizard = true;
        // this.showModalDataPopup1 = true;
        console.log('menuDataFromServer', this.showWizard, this.showModalDataPopup1)
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
        this.showModalDataPopup1 = false;
    }

    handleCloseWidgetEditor() {
        this.showModalWidgetEditor = false;
    }

    handleCloseCollaborate() {
        this.showCollaborate = false;
        console.log('handleCloseCollaborate')
    }

    handleCloseDashboardOpen(action) {
        this.showModalDashboardOpen = false;
    }

    handleCloseDashboardRename(action) {
        this.showModalDashboardRename = false;
    }

    handleCloseDashboardDetails(action) {
        this.showModalDashboardDetails = false;
    }

    clickPaletteClose() {
        this.showPalette = ! this.showPalette;
    }

    clickMenuFileOpen() {
        console.log('open')
        this.showModalDashboardOpen = true;
    }

    clickMenuFileRename() {
        this.showModalDashboardRename = true;
    }

    clickMenuFileDetails() {
        this.showModalDashboardDetails = true;
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
