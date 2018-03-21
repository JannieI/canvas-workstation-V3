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
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {

    @Output() formDashboardMyProfileClosed: EventEmitter<string> = new EventEmitter();


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    } 

    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardMyProfileClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Fix save later ...',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardMyProfileClosed.emit(action);
    }

}
