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
    dashboardTabs: number = 0;
    dashboardWidgets: number = 0;
    dashboardMessages: number = 0;
    dashboardComments: number = 0;
    dashboardSnapshots: number = 0;
    dashboardPermissions: number = 0;
    dashboardCheckpoints: number = 0;
    dashboardTags: number = 0;
    dashboardSchedules: number = 0;
    dashboardSubscriptions: number = 0;
    dashboardHyperLinks: number = 0;
    dashboardTemplates: number = 0;
    startupDashboard: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set the D and nr of times the current D is used in other entities.
        let dashboardID: number = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.dashboard = this.globalVariableService.dashboards.filter(
            d => d.id == dashboardID
        )[0];
this.dashboard.name = 'xXx'
        this.dashboardTabs = this.globalVariableService.dashboardTabs.filter(
            t => t.dashboardID == dashboardID
        ).length;
        this.dashboardWidgets = this.globalVariableService.widgets.filter(
            w => w.dashboardID == dashboardID
        ).length;
        this.dashboardMessages = this.globalVariableService.canvasMessages.filter(
            m => m.dashboardID == dashboardID
        ).length;
        this.dashboardComments = this.globalVariableService.canvasComments.filter(
            c => c.dashboardID == dashboardID
        ).length;
        this.dashboardSnapshots = this.globalVariableService.dashboardSnapshots.filter(
            s => s.dashboardID == dashboardID
        ).length;
        this.dashboardPermissions = this.globalVariableService.dashboardPermissions.filter(
            p => p.dashboardID == dashboardID
        ).length;
        this.dashboardCheckpoints = this.globalVariableService.widgetCheckpoints.filter(
            chk => chk.dashboardID == dashboardID
        ).length;
        this.dashboardTags = this.globalVariableService.dashboardTags.filter(
            tg => tg.dashboardID == dashboardID
        ).length;
        this.dashboardSchedules = this.globalVariableService.dashboardSchedules.filter(
            sch => sch.dashboardID == dashboardID
        ).length;
        this.dashboardSubscriptions = this.globalVariableService.currentDashboardSubscription
            .filter(sub => sub.dashboardID == dashboardID
        ).length;
        this.dashboardHyperLinks = this.globalVariableService.widgets.filter(
            w => w.hyperlinkDashboardID == dashboardID
        ).length;
        this.dashboardTemplates = this.globalVariableService.dashboards.filter(
            d => d.templateDashboardID == dashboardID
        ).length;
        this.startupDashboard = this.globalVariableService.canvasUsers.filter(
            u => u.startupDashboardID == dashboardID
        ).length;
        
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
