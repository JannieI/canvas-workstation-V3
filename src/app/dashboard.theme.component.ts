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
import { DashboardTheme }             from './models';

@Component({
    selector: 'dashboard-theme',
    templateUrl: './dashboard.theme.component.html',
    styleUrls: ['./dashboard.theme.component.css']
})
export class DashboardThemeComponent implements OnInit {

    @Output() formDashboardThemeClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Partial<Dashboard>[];
    dashboardThemes: DashboardTheme[];
   

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardThemes = this.globalVariableService.dashboardThemes;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardThemeClosed.emit(action);
    }
}
