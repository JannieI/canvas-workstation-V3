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
import { Dashboard, DashboardTab, DashboardRecent }                  from './models';

@Component({
    selector: 'dashboard-new',
    templateUrl: './dashboard.new.component.html',
    styleUrls: ['./dashboard.new.component.css']
})
export class DashboardNewComponent implements OnInit {

    @Output() formDashboardNewClosed: EventEmitter<string> = new EventEmitter();

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
    

                // Update recent list
                // let today = new Date();
                // let newRecent: DashboardRecent = {
                //     id: null,
                //     userID: this.globalVariableService.currentUser.userID,
                //     dashboardID: 99,
                //     dashboardTabID: 99,
                //     editMode: false,
                //     accessed: today.toString(),
                //     stateAtRunTime: 'Draft',
                //     nameAtRunTime: 'd.name'
                // };
                // console.log('xx newRec', newRecent)
                // this.globalVariableService.addDashboardRecent(newRecent).then(dR => {
                //     return;
                // })


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

        // Add new to DB, and open
        this.globalVariableService.addDashboard(newDashboard).then(d => {

            let newDashboardTab: DashboardTab = this.globalVariableService.dashboardTabTemplate;
            newDashboardTab.dashboardID = d.id;

            // Add Tab to DB
            this.globalVariableService.addDashboardTab(newDashboardTab).then(t => {

                // Update recent list
                let today = new Date();
                let newRecent: DashboardRecent = {
                    id: null,
                    userID: this.globalVariableService.currentUser.userID,
                    dashboardID: d.id,
                    dashboardTabID: t.id,
                    editMode: false,
                    accessed: today.toString(),
                    stateAtRunTime: 'Draft',
                    nameAtRunTime: d.name
                };

                // TODO - fix this timing issue, as I have no idea why this is happening here
                this.globalVariableService.sleep(2000);
                console.log('xx newRec', newRecent, newDashboard)
                this.globalVariableService.addDashboardRecent(newRecent).then(dR => {

                    this.globalVariableService.refreshCurrentDashboard(
                        'addDashboard-clickCreate', d.id, t.id, ''
                    );

                    console.log('xx end new', this.globalVariableService.dashboards, this.globalVariableService.currentDashboardTabs, this.globalVariableService.datasets, this.globalVariableService.currentDatasets)
                    this.formDashboardNewClosed.emit('Created');
                });
            })
        });
        
    }
}
