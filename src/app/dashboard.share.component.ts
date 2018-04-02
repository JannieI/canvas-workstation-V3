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
import { DashboardPermission }        from './models';

@Component({
    selector: 'dashboard-share',
    templateUrl: './dashboard.share.component.html',
    styleUrls: ['./dashboard.share.component.css']
})
export class DashboardShareComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardShareClosed: EventEmitter<string> = new EventEmitter();

    accessList: boolean = false;
    accessType: string;
    showTypeDashboard: boolean = false;
    dashboardPermissions: DashboardPermission[];
    userID: string = '';
    groupName: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.accessType = this.selectedDashboard.accessType;
        this.dashboardPermissions = this.globalVariableService.dashboardPermissions;
    }
 
    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardShareClosed.emit(action);
    }
 
    clickSave() {
        // Save the change, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Update global D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID) {
                d.accessType = this.accessType;
            };
        });
        console.log('xx this.globalVariableService.currentDashboards', this.globalVariableService.currentDashboardInfo
        .value.currentDashboardID, this.globalVariableService.currentDashboards)
		this.formDashboardShareClosed.emit('Saved');
    }

    clickAdd() {
        // Add UserID and GroupName to the grid, and clear
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Update locally
        let newdP: DashboardPermission = {
            id: 22,
            dashboardID: this.selectedDashboard.id,
            userID: this.userID,
            groupID: 1,
            groupName: this.groupName,
            canView: false,
            canEdit: false,
            canDelete: false
        };

        this.dashboardPermissions.push(newdP);
        // Update global, DB
        // this.globalVariableService.currentDashboards.forEach(d => {
        //     if (d.id == this.globalVariableService.currentDashboardInfo
        //         .value.currentDashboardID) {
        //         d.accessType = this.accessType;
        //     };
        // });
        console.log('xx this.globalVariableService.currentDashboards', this.globalVariableService.currentDashboardInfo
        .value.currentDashboardID, this.globalVariableService.currentDashboards)
		this.formDashboardShareClosed.emit('Saved');
    }

    clickDelete(index: number, id: number)  {
        // Delete clicked permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.dashboardPermissions = this.dashboardPermissions.splice(index, 1);
    }

    clickSelectAccess(ev) {
        // User changed the security access for the D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectAccess', '@Start');

        console.log(ev.srcElement.value)
        // Set accessList
        if (ev.srcElement.value == 'Access List') {
            this.accessList = true;
        } else {
            this.accessList = false;
        }
    }
}
