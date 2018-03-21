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
import { DashboardSubscription }      from './models';

@Component({
    selector: 'dashboard-subscribe',
    templateUrl: './dashboard.subscribe.component.html',
    styleUrls: ['./dashboard.subscribe.component.css']
})
export class DashboardSubscribeComponent implements OnInit {

    @Output() formDashboardSubscribeClosed: EventEmitter<string> = new EventEmitter();

    dashboards: Dashboard[];
    dashboardNames: string[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    selectDashboard: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get all dashboards
        this.dashboards = this.globalVariableService.dashboards;

        // Get subscriptions for current User
        this.globalVariableService.getDashboardSubscription().then(data => {
            this.dashboardSubscriptions = data.filter(ds => 
                ds.userID == this.globalVariableService.userID
            );

            // Refresh names
            this.dashboards.forEach(d => {
                this.dashboardSubscriptions.forEach(ds => {
                    if (ds.dashboardID == d.id) {
                        ds.dashboardname = d.name;
                    };
                });
            });

            // Remaining D to show
            let dsIDs: number[] = [];
            this.dashboardSubscriptions.forEach(ds => {
                dsIDs.push(ds.dashboardID);
            });        
            this.dashboards.forEach(d => {
                if (dsIDs.indexOf(d.id) < 0) {
                    this.dashboardNames.push(d.name);
                };
            });     

            // Get First one
            if (this.dashboardNames.length > 0) {
                this.selectDashboard = this.dashboardNames[0];
            };
        });
        
    }

    dblClickView(index: number, id: number) {
        // Toggle the View value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickView', '@Start');
console.log('xx', this.dashboardSubscriptions[index])
        this.dashboardSubscriptions[index].view = !this.dashboardSubscriptions[index].view;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickEditMode(index: number, id: number) {
        // Toggle the EditMode value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickEditMode', '@Start');

        this.dashboardSubscriptions[index].editmode = !this.dashboardSubscriptions[index].editmode;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickSave(index: number, id: number) {
        // Toggle the Save value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickSave', '@Start');

        this.dashboardSubscriptions[index].save = !this.dashboardSubscriptions[index].save;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickDelete(index: number, id: number) {
        // Toggle the Delete value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'v', '@Start');

        this.dashboardSubscriptions[index].delete = !this.dashboardSubscriptions[index].delete;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickNotify(index: number, id: number) {
        // Toggle the Notify value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickNotify', '@Start');

        if (this.dashboardSubscriptions[index].notify == 'Email') {
            this.dashboardSubscriptions[index].notify = 'Message';
        } else {
            if (this.dashboardSubscriptions[index].notify == 'Message') {
                this.dashboardSubscriptions[index].notify = 'Both'
            } else {
                if (this.dashboardSubscriptions[index].notify == 'Both') {
                    this.dashboardSubscriptions[index].notify = 'Email'
                };
            };
        };

        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSubscribeClosed.emit(action);
    }

    clickSelect(ev) {
        // Changed selection of Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelect', '@Start');

        console.log('xx ev', ev, ev.target.value)
        this.selectDashboard = ev.target.value;
    }

    clickAdd() {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Nothing selected
        if (this.selectDashboard == '') {
            return;
        };

        // TODO - this assumes D-Name is unique ...
        for (var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboards[i].name == this.selectDashboard) {
                break;
            }
        };
        
        // Add globally, then locally
        let localData: DashboardSubscription = {
            id: null,
            dashboardID: 1,
            userID: this.globalVariableService.userID,
            view: false,
            editmode: false,
            save: false,
            delete: false,
            dashboardname: this.dashboards[i].name,
            notify: "",
        };
console.log('xx this.dashboardSubscriptions', localData, JSON.parse(JSON.stringify(localData)))
        this.globalVariableService.addDashboardSubscription(localData).then(data => {
            this.dashboardSubscriptions.push(data)
        });
    }

}
