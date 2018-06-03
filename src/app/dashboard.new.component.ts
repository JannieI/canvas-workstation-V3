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
import { DashboardTab }               from './models';
import { DashboardRecent }            from './models';

@Component({
    selector: 'dashboard-new',
    templateUrl: './dashboard.new.component.html',
    styleUrls: ['./dashboard.new.component.css']
})
export class DashboardNewComponent implements OnInit {

    @Output() formDashboardNewClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickCreate();
            return;
        };

    }

    dashboards: Dashboard[];
    dashboardCode: string = '';
    dashboardName: string = '';
    dashboardDescription: string = '';
    errorMessage: string = '';
    importFolder: string;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose() {
        // Close form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardNewClosed.emit('Cancel');
    }

    clickCreate() {
        // Create a new Dashboard, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCreate', '@Start');

        if (this.dashboardCode == '') {
            this.errorMessage = 'Code compulsory';
            return;
        };
        if (this.dashboardName == '') {
            this.errorMessage = 'Name compulsory';
            return;
        };
        if (this.dashboardDescription == '') {
            this.errorMessage = 'Description compulsory';
            return;
        };

        // Reset
        this.errorMessage = '';

        // Create new D
        let newDashboard: Dashboard = this.globalVariableService.dashboardTemplate;
        newDashboard.code = this.dashboardCode;
        newDashboard.name = this.dashboardName;
        newDashboard.description = this.dashboardDescription;
        newDashboard.creator = this.globalVariableService.currentUser.userID;

        // Add new (Complete + Draft) to DB, and open Draft
        newDashboard.state = 'Complete';
        this.globalVariableService.addDashboard(newDashboard).then(newD => {
            newDashboard.state = 'Draft';
            newDashboard.originalID = newD.id;
            this.globalVariableService.addDashboard(newDashboard).then(draftD => {
                newD.draftID = draftD.id;
                this.globalVariableService.saveDashboard(newD).then(originalD => {

                    let newDashboardTab: DashboardTab = this.globalVariableService.dashboardTabTemplate;
                    newDashboardTab.dashboardID = draftD.id;

                    // Add Tab to DB
                    this.globalVariableService.addDashboardTab(newDashboardTab).then(t => {

                        this.globalVariableService.amendDashboardRecent(draftD.id, t.id).then(dR => {

                            this.globalVariableService.refreshCurrentDashboard(
                                'addDashboard-clickCreate', draftD.id, t.id, ''
                            );

                            this.formDashboardNewClosed.emit('Created');
                        });
                    })
                });
            });
        });

    }
}
