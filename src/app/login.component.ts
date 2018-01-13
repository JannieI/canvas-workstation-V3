/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    @Output() formUserLoginClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
    
    }

    clickClose(action: string) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formUserLoginClosed.emit(action);
    }

    clickLocalServer() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLocalServer', '@Start');

        this.globalVariableService.loggedIntoServer.next(
            !this.globalVariableService.loggedIntoServer.value
        )
    }
}
