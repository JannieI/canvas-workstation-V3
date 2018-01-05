/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'systemsettings',
    templateUrl: './systemsettings.component.html',
    styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent implements OnInit {

    @Output() formDashboardSystemSettingsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardSystemSettingsClosed.emit(action);
    }

    //TODO
    //1. Set global var isFirstTimeDashboard = T/F depending on user input

}
