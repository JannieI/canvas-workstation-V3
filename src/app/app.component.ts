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
import { GlobalFunctionService } 	  from './global-function.service';

// Own Components

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    menuToggle: boolean = false;

    constructor(
        private router: Router,
        private globalVariableService: GlobalVariableService,
        private globalFunctionService: GlobalFunctionService
        
    ) {
    }
    
    ngOnInit() {
    }   

}
