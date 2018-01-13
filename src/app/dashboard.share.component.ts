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
import { DashboardPermission }        from './models';

@Component({
    selector: 'dashboard-share',
    templateUrl: './dashboard.share.component.html',
    styleUrls: ['./dashboard.share.component.css']
})
export class DashboardShareComponent implements OnInit {

    @Output() formDashboardShareClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardPermissions: DashboardPermission[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardPermissions = this.globalVariableService.dashboardPermissions;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardShareClosed.emit(action);
    }
}
