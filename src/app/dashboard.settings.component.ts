/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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
    selector: 'dashboard-settings',
    templateUrl: './dashboard.settings.component.html',
    styleUrls: ['./dashboard.settings.component.css']
})
export class DashboardSettingsComponent implements OnInit {

    @Output() formDashboardSettingsClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
 

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');


		this.formDashboardSettingsClosed.emit(action);
    }

    clickSave(action: string) {
        // Save settings, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');


		this.formDashboardSettingsClosed.emit(action);
    }
}
