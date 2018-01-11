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
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    isFirstTimeDashboardOpen: boolean;
    showAdvancedFilters: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboardOpen = i
        )
    }

    clickClose(action: string) {
        console.log('DashboardOpen clickClose')

		this.formDashboardOpenClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboard.next(false);
    }

    clickShowAdvancedFilters() {
        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

    clickOpenView(dashboardID: number) {
        console.log('DashboardOpen clickOpenView id', dashboardID)
        // this.globalVariableService.currentDashboardID.next(id);
		this.globalVariableService.refreshCurrentDashboardInfo(dashboardID, 1);
        this.globalVariableService.editMode.next(false);
		this.formDashboardOpenClosed.emit('View');
    }

    clickOpenEdit(dashboardID: number) {
        console.log('DashboardOpen clickOpenEdit id', dashboardID)
        // this.globalVariableService.currentDashboardID.next(id);
		this.globalVariableService.refreshCurrentDashboardInfo(dashboardID, 1);
        this.globalVariableService.editMode.next(true);
		this.formDashboardOpenClosed.emit('View');
    }
}
