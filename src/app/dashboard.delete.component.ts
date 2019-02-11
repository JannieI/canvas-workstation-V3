/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickDelete();
            return;
        };
    }

    dashboard: Dashboard;
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
    errorMessage: string = '';
    favouriteDashboards: number = 0;
    startupDashboards: number = 0;

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

        this.globalVariableService.getDashboardSnapshots().then(snp => {
            this.globalVariableService.getResource('canvasMessages').then(mes => {
                this.globalVariableService.getResource('canvasComments').then(com => {
                    this.globalVariableService.getDashboardSchedules().then(sch => {
                        this.globalVariableService.getDashboardSubscriptions().then(sub => {
                            this.globalVariableService.getDashboardTags().then(tag => {

                                this.dashboardTags = tag.filter(
                                    tg => tg.dashboardID == dashboardID
                                ).length;
                                this.dashboardSnapshots = snp.filter(
                                    s => s.dashboardID == dashboardID
                                ).length;
                                this.dashboardMessages = mes.filter(
                                    m => m.dashboardID == dashboardID
                                ).length;
                                this.dashboardComments = com.filter(
                                    c => c.dashboardID == dashboardID
                                ).length;
                                this.dashboardSchedules = sch.filter(
                                    s => s.dashboardID == dashboardID
                                ).length;
                                this.dashboardSubscriptions = sub.filter(
                                    s => s.dashboardID == dashboardID
                                ).length;
                                this.dashboardTabs = this.globalVariableService.dashboardTabs.
                                    filter(t => t.dashboardID == dashboardID
                                ).length;
                                this.dashboardWidgets = this.globalVariableService.widgets.
                                    filter(w => w.dashboardID == dashboardID
                                ).length;
                                this.dashboardPermissions = this.globalVariableService.dashboardPermissions.filter(
                                    p => p.dashboardID == dashboardID
                                ).length;
                                this.dashboardCheckpoints = this.globalVariableService.widgetCheckpoints.filter(
                                    chk => chk.dashboardID == dashboardID
                                ).length;
                                this.dashboardHyperLinks = this.globalVariableService.widgets.filter(
                                    w => w.hyperlinkDashboardID == dashboardID
                                ).length;
                                this.dashboardTemplates = this.globalVariableService.dashboards.filter(
                                    d => d.templateDashboardID == dashboardID
                                ).length;
                                this.startupDashboards = this.globalVariableService.canvasUsers.filter(
                                    u => u.preferenceStartupDashboardID == dashboardID
                                ).length;
                                this.favouriteDashboards = this.globalVariableService.canvasUsers.filter(
                                    u => u.favouriteDashboards.indexOf(dashboardID) >= 0
                                ).length;
                            });
                        });
                    });
                });
            });
        });

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
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            'CanDelete'
        )) {
            this.errorMessage = 'No access';
            return;
        };

        // Cannot remove if Draft present
        if (this.dashboard.draftID != null){
            this.errorMessage = 'First discard the Draft for this Dashboard';
            return;
        };

        // TODO - remove later on!!
        let id: number = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        if (
            (id < 9  || id == 40  ||  id == 41)
            &&
            this.globalVariableService.currentDashboardInfo.value.currentDashboardState == 'Complete'
            ) {
            alert('Dont delete Complete version of ids 1-8, 40, 41 while testing !')
            return;
        };

        // Delete D, as all related Entities
        this.globalVariableService.deleteDashboardInfo(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );

		this.formDashboardDeleteClosed.emit('Deleted');

    }

}
