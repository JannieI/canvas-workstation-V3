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
    selector: 'dashboard-delete',
    templateUrl: './dashboard.delete.component.html',
    styleUrls: ['./dashboard.delete.component.css']
})
export class DashboardDeleteComponent implements OnInit {

    @Output() formDashboardDeleteClosed: EventEmitter<string> = new EventEmitter();

    dashboard: Dashboard;
    errorMessage: string = '';
    dashboardTabs: string = '';
    dashboardWidgets: string = '';
    dashboardMessages: string = '';
    dashboardComments: string = '';
    dashboardSnapshots: string = '';
    dashboardPermissions: string = '';
    dashboardCheckpoints: string = '';
    dashboardTags: string = '';
    dashboardSchedules: string = '';
    dashboardSubscriptions: string = '';
    dashboardHyperLinks: string = '';
    dashboardTemplates: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDeleteClosed.emit(action);
    }

    clickDelete() {
        // Delete selected D and all related records, if user has access
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Determine access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        )) {
            this.errorMessage = 'No access';
            return;
        };





        // this.globalVariableService.deleteWidget(index);
    }

}
