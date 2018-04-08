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
import { Dashboard, DashboardTab }                  from './models';

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

        this.dashboards = this.globalVariableService.dashboards;
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
        let newDashboard: Dashboard = {
            id: null,
            version: 0,
            state: '',
            code: this.dashboardCode,
            name: this.dashboardName,
            description: this.dashboardDescription,
            accessType: 'Private',
            password: '',
            refreshMode: '',
            refreshTimer: 0,
            defaultTabID: 0,
            defaultExportFileType: '',
            url: '',
            qaRequired: false,
            isSample: false,
            backgroundColor: '',
            backgroundImage: '',
            templateDashboardID: 0,
            creator: '',
            dateCreated: '',
            editor: '',
            dateEdited: '',
            refresher: '',
            dateRefreshed: '',
            nrWidgets: 0,
            nrShapes: 0,
            nrRecords: 0,
            nrTimesOpened: 0,
            tabs: [],
            permissions: []
        };

        // Add new to DB, and open
        this.globalVariableService.addDashboard(newDashboard).then(d => {
            console.log('xx id', d.id, this.dashboardName)
            let newDashboardTab: DashboardTab = {
                id: null,
                dashboardID: d.id,
                name: 'First',
                description: '',
                backgroundColor: '',
                color: ''
                        
            }

            // Add Tab to DB
            this.globalVariableService.addDashboardTab(newDashboardTab).then(t => {

                this.globalVariableService.refreshCurrentDashboard(
                    'addDashboard-clickCreate', d.id, -1, ''
                );
                
                this.formDashboardNewClosed.emit('Created');
            })
        })
        
    }
}
