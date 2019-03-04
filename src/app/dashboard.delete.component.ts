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

        this.globalVariableService.getDashboardSummary(dashboardID)
            .then(res => {
                console.log('xx res', res);
                
                this.dashboardTags = res.data.numberDashboardTags;
                this.dashboardSnapshots = res.data.numberDashboardSnapshots;
                this.dashboardMessages = res.data.numberCanvasMessages;
                this.dashboardComments = res.data.numberCanvasComments;
                this.dashboardSchedules = res.data.numberDashboardSchedules;
                this.dashboardSubscriptions = res.data.numberDashboardSubscriptions;
                this.dashboardTabs = res.data.numberDashboardTabs;
                this.dashboardWidgets = res.data.numberWidgets;
                this.dashboardPermissions = res.data.numberDashboardPermissions;
                this.dashboardCheckpoints = res.data.numberWidgetCheckpoints;
                this.dashboardHyperLinks = res.data.numberHyperlinkedWidgets;
                this.dashboardTemplates = res.data.numberUsedAsTemplate;
                this.startupDashboards = res.data.numberUsedAsStartup;
                this.favouriteDashboards = res.data.numberUsedAsFav;

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.delete reading dashboardSummary: ' + err);
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

        // Delete D, as all related Entities
        this.globalVariableService.deleteDashboardInfo(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        ).then( () => this.formDashboardDeleteClosed.emit('Deleted') )
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Dashboard.delete deleting: ' + err);
        });

    }

}
