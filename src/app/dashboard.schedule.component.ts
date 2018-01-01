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
import { DashboardSchedule }          from './models';

@Component({
    selector: 'dashboard-schedule',
    templateUrl: './dashboard.schedule.component.html',
    styleUrls: ['./dashboard.schedule.component.css']
})
export class DashboardScheduleComponent implements OnInit {

    @Output() formDashboardScheduleClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Partial<Dashboard>[];
    dashboardSchedules: DashboardSchedule[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardSchedules = this.globalVariableService.dashboardSchedules;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardScheduleClosed.emit(action);
    }
}
