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
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'dashboard-subscribe',
    templateUrl: './dashboard.subscribe.component.html',
    styleUrls: ['./dashboard.subscribe.component.css']
})
export class DashboardSubscribeComponent implements OnInit {

    @Output() formDashboardSubscribeClosed: EventEmitter<string> = new EventEmitter();

    dashboards: Dashboard[];
    dashboardCodes: string[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    selectDashboard: string = '';
    selectedRow: number = 0;


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
                ds.userID == this.globalVariableService.currentUser.userID
            );

            // Refresh Codes
            this.dashboards.forEach(d => {
                this.dashboardSubscriptions.forEach(ds => {
                    if (ds.dashboardID == d.id) {
                        ds.dashboardCode = d.code;
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
                    this.dashboardCodes.push(d.code);
                };
            });     

            // Get First one
            if (this.dashboardCodes.length > 0) {
                this.selectDashboard = this.dashboardCodes[0];
            };
        });
        
    }

    dblClickView(index: number, id: number) {
        // Toggle the View value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickView', '@Start');

        this.dashboardSubscriptions[index].view = !this.dashboardSubscriptions[index].view;

        if (!this.checkSubscriptionDelete(index, id)) {
            this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
        };

    }

    dblClickEditMode(id: number) {
        // Toggle the EditMode value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickEditMode', '@Start');

        // this.dashboardSubscriptions[index].editmode = !this.dashboardSubscriptions[index].editmode;
        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].editmode = 
                    !this.dashboardSubscriptions[i].editmode;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardSubscription(
                this.dashboardSubscriptions[index])
                ;
        };
    }

    dblClickSave(id: number) {
        // Toggle the Save value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickSave', '@Start');

        // this.dashboardSubscriptions[index].save = !this.dashboardSubscriptions[index].save;
        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].save = 
                    !this.dashboardSubscriptions[i].save;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardSubscription(
                this.dashboardSubscriptions[index])
                ;
        };
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

        if (this.dashboardSubscriptions[index].notify == ''  ||  
            this.dashboardSubscriptions[index].notify == null) {
                this.dashboardSubscriptions[index].notify = 'Message';
            } else {
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
        // Add record to Subscriptions, and reduce available options
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Nothing selected
        if (this.selectDashboard == '') {
            return;
        };

        // TODO - this assumes D-Code is unique ...
        let dID: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].code == this.selectDashboard) {
                dID = i;
                break;
            };
        };

        // Add globally, then locally
        if (dID >= 0) {
            let localData: DashboardSubscription = {
                id: null,
                dashboardID: this.dashboards[dID].id,
                userID: this.globalVariableService.currentUser.userID,
                view: false,
                editmode: false,
                save: false,
                delete: false,
                dashboardCode: this.dashboards[dID].code,
                notify: 'Message',
            };

            // Add to DB
            this.globalVariableService.addDashboardSubscription(localData).then(data => {
                
                // Add locally
                this.dashboardSubscriptions.push(data);
        
                // Add globally
                this.globalVariableService.currentDashboardSubscription.push(data);

                // Reduce selection list
                let selID: number = -1;
                for (var i = 0; i < this.dashboardCodes.length; i++) {
                    if (this.dashboardCodes[i] == this.selectDashboard) {
                        selID = i;
                        break;
                    }
                };
                if (selID >=0) {
                    this.dashboardCodes.splice(selID, 1);
                };

            });
        } else {
            console.log('ERROR - dID = -1 which means its not in the list!  Ai toggie')
        };
    }

    checkSubscriptionDelete(index: number, id: number): boolean {
        // Deletes a Subscription if all options = false
        // If ALL false, then deletes and returns TRUE.
        this.globalFunctionService.printToConsole(this.constructor.name,'checkSubscriptionDelete', '@Start');

        // Nothing further to do if anyone is true
        if (this.dashboardSubscriptions[index].view  ||  
            this.dashboardSubscriptions[index].editmode  ||
            this.dashboardSubscriptions[index].save  ||
            this.dashboardSubscriptions[index].delete) {
            return false;
        };

        // Add to Selection List
        this.dashboardCodes.push(this.dashboardSubscriptions[index].dashboardCode);

        // Delete locally
        this.dashboardSubscriptions.splice(index, 1);
        
        // Delete globally and in DB
        // TODO - Proper error handling
        this.globalVariableService.deleteDashboardSubscription(id);
        console.log('xx del', this.dashboardSubscriptions, this.globalVariableService.currentDashboardSubscription)
        return true;
    }
 
    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
