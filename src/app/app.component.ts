/* 
 * Main Component, with menu
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Own Services
import { GlobalVariableService }      from './global-variable.service';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

// Own Components

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    showNavData: boolean = false;
    showNavDashboard: boolean = false;
    showNavFormat: boolean = false;
    showSubMenuData: boolean = false;
    showSubMenuDashboard: boolean = false;

    constructor(
        private router: Router,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService
        
    ) {
    }
    
    ngOnInit() {
        this.globalVariableService.showNavData.subscribe( value => this.showNavData = value)
        this.globalVariableService.showNavDashboard.subscribe( value => this.showNavDashboard = value)
        this.globalVariableService.showNavFormat.subscribe( value => this.showNavFormat = value)
        this.globalVariableService.showSubMenuData.subscribe( value => this.showSubMenuData = value)
        this.globalVariableService.showSubMenuDashboard.subscribe( value => this.showSubMenuDashboard = value)
    }   

    clickButtonMenu(clickedOption: string) {
        this.globalFunctionService.hideSecondaryMenus();

console.log('clickedOption',clickedOption)
        if (clickedOption == 'data') {
            this.globalVariableService.showSubMenuData.next(true);
            this.globalVariableService.showNavData.next(true);
        } else if (clickedOption == 'dashboard') {
            this.globalVariableService.showSubMenuDashboard.next(true);
            this.globalVariableService.showNavDashboard.next(false);
        }
    }

    clickButtonSubMenu(clickedOption: string) {
        this.showNavData = false;
    }
    
    dragEnd(event) {
        // event.preventDefault();
        console.log('dragEnd',event)
        // document.getElementById("demo").innerHTML = "Finished dragging the p element.";
    }

}
