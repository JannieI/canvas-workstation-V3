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
import { DashboardSubscription }      from './models';


@Component({
    selector: 'dashboard-subscribe',
    templateUrl: './dashboard.subscribe.component.html',
    styleUrls: ['./dashboard.subscribe.component.css']
})
export class DashboardSubscribeComponent implements OnInit {

    @Output() formDashboardSubscribeClosed: EventEmitter<string> = new EventEmitter();

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
            this.clickAdd();
            return;
        };

    }

    dashboards: Dashboard[];
    availableDashboards: string[] = [];
    dashboardSubscriptions: DashboardSubscription[] = [];
    selectedDashboard: string = '';
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get all dashboards
        this.dashboards = this.globalVariableService.dashboards.slice();

        // Get subscriptions for current User
        this.globalVariableService.getResource('dashboardSubscriptions')
            .then(data => {
                this.dashboardSubscriptions = data.filter(ds => 
                    ds.userID == this.globalVariableService.currentUser.userID
                );

                // Refresh D Codes
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
                        this.availableDashboards.push('(' + d.id.toString() + ') ' + d.code);
                    };
                });     

                // Get First one
                if (this.availableDashboards.length > 0) {
                    this.selectedDashboard = this.availableDashboards[0];
                };
            })
            .catch(err => console.log('Error in getting schedules: ' + err));
        
    }

    dblClickView(id: number) {
        // Toggle the View value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickView', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].view = 
                    !this.dashboardSubscriptions[i].view;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
        };

    }

    dblClickEditMode(id: number) {
        // Toggle the EditMode value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickEditMode', '@Start');

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

        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].saved = 
                    !this.dashboardSubscriptions[i].saved;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardSubscription(
                this.dashboardSubscriptions[index])
                ;
        };
    }

    dblClickDelete(id: number) {
        // Toggle the Delete value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'v', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].deleted = 
                    !this.dashboardSubscriptions[i].deleted;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardSubscription(
                this.dashboardSubscriptions[index])
                ;
        };
    }

    dblClickNotify(id: number) {
        // Toggle the Notify value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickNotify', '@Start');

        let index: number = -1;
        for(var i = 0; i < this.dashboardSubscriptions.length; i++) {
            if (this.dashboardSubscriptions[i].id == id) { 
                this.dashboardSubscriptions[i].deleted = 
                    !this.dashboardSubscriptions[i].deleted;
                index = i;
            };
        };

        if (index != -1) {
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
        };
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSubscribeClosed.emit(action);
    }

    clickSelect(ev) {
        // Changed selection of Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelect', '@Start');
        
        if (ev == undefined) {
            return;
        };

        this.selectedDashboard = ev.target.value;

    }

    clickAdd() {
        // Add record to Subscriptions, and reduce available options
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Nothing selected
        if (this.selectedDashboard == null) {
            return;
        };

        let space: number = -1;
        space = this.selectedDashboard.indexOf(') ');
        if (space < 1) {
            return;
        };
        
        let sID: number = +this.selectedDashboard.substring(1, space );
        let sCode: string = this.selectedDashboard.substring(space + 2);

        let dIndex: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].id == sID) {
                dIndex = i;
                break;
            };
        };

        // Add globally, then locally
        if (dIndex >= 0) {
            let localData: DashboardSubscription = {
                id: null,
                dashboardID: this.dashboards[dIndex].id,
                userID: this.globalVariableService.currentUser.userID,
                view: false,
                editmode: false,
                saved: false,
                deleted: false,
                dashboardCode: this.dashboards[dIndex].code,
                notify: 'Message',
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date
            };

            // Add to DB
            this.globalVariableService.addResource('dashboardSubscriptions', localData)
                .then(data => {
                    
                    // Add locally
                    this.dashboardSubscriptions.splice(0, 0, data);

                    // Reduce available list
                    let selID: number = -1;
                    for (var i = 0; i < this.availableDashboards.length; i++) {
                        if (this.availableDashboards[i] == this.selectedDashboard) {
                            selID = i;
                            break;
                        };
                    };
                    if (selID >=0) {
                        this.availableDashboards.splice(selID, 1);
                    };

                    // Get First one
                    if (this.availableDashboards.length > 0) {
                        this.selectedDashboard = this.availableDashboards[0];
                    };
                })
                .catch(err => console.log('Error in getting schedules: ' + err));
        } else {
            console.log('ERROR - dID = -1 which means its not in the list!  Ai toggie')
        };
    }

    dblclickUnSubscribe(id: number){
        // Deletes a Subscription
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickUnSubscribe', '@Start');

        // Delete globally and in DB
        // TODO - Proper error handling
        this.globalVariableService.deleteDashboardSubscription(id).then( res => {

            // Update locally
            this.dashboardSubscriptions = this.globalVariableService.
                dashboardSubscriptions.filter(ds => 
                    ds.userID == this.globalVariableService.currentUser.userID
                );

            let index: number = -1;
            for(var i = 0; i < this.dashboards.length; i++) {
                if (this.dashboards[i].id == id) { 
                    index = i;
                };
            };

            // Nothing to do
            if (index == -1) {
                return;
            };
    
            // Add to available List
            this.availableDashboards.push('(' + this.dashboards[index].id + ') ' + 
                this.dashboards[index].code
            );
        
            // Get First one
            if (this.availableDashboards.length > 0) {
                this.selectedDashboard = this.availableDashboards[0];
            };

        });
        
    }
 
    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
