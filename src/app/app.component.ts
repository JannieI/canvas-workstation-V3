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

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    menuToggle: boolean = false;
    showModalLanding: boolean = true;
    showPalette: boolean = true;

    constructor(
        private router: Router,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService,
        @Inject(DOCUMENT) private document: Document
        
    ) {
    }
    
    ngOnInit() {
    }   

    menuFileNew() {


    }

    menuDataGetData() {
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

    clickPaletteClose() {
        this.showPalette = ! this.showPalette;
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
