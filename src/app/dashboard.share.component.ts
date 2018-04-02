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
import { CanvasGroup }                from './models';

@Component({
    selector: 'dashboard-share',
    templateUrl: './dashboard.share.component.html',
    styleUrls: ['./dashboard.share.component.css']
})
export class DashboardShareComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardShareClosed: EventEmitter<string> = new EventEmitter();

    accessType: string = '';
    dashboardPermissions: DashboardPermission[];
    errorMessage: string = '';
    groupID: number;
    groupName: string = '';
    groups: CanvasGroup[];
    userID: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasGroups().then( res => {
            this.accessType = this.selectedDashboard.accessType;
            this.dashboardPermissions = this.globalVariableService.dashboardPermissions.slice();
            this.groups = res;
        });

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

        // Update global permissions
        this.globalVariableService.dashboardPermissions.forEach(gdP => {
            this.dashboardPermissions.forEach(dP => {
                if (dP.id == gdP.id) {
                    gdP.canView = dP.canView;
                    gdP.canEdit = dP.canEdit;
                    gdP.canDelete = dP.canDelete;
                };
            });
        });
        
        this.formDashboardShareClosed.emit('Saved');
    }

    clickAdd() {
        // Add UserID and GroupName to the grid, and clear
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Validation
        if (this.userID == ''  &&  this.groupName == '') {
            this.errorMessage = 'Please fill in either a UserID or a Group Name'
            return;
        };
        if (this.userID != ''  &&  this.groupName != '') {
            this.errorMessage = 'Please fill in either a UserID or a Group Name'
            return;
        };
        this.errorMessage = '';
        let isFound: boolean = false;
        this.dashboardPermissions.forEach(dp => {
            if (
                 (this.userID != ''  &&  dp.userID == this.userID)
                 ||
                 (this.groupName != ''  &&  dp.groupName == this.groupName)
                ) {
                     isFound = true;
            };
        });
        if (isFound) {
            this.errorMessage = 'UserID/Group Name already exists'
            return;
        };

        // Create New
        var today = new Date();
        let newdP: DashboardPermission = {
            id: null,
            dashboardID: this.selectedDashboard.id,
            userID: this.userID==''? null : this.userID,
            groupID: this.groupID==null? null : this.groupID,
            groupName: this.groupName==null? null : this.groupName,
            canView: false,
            canEdit: false,
            canDelete: false,
            grantor: this.globalVariableService.currentUser.userID,
            grantedOn: today.toString()
        };

        // Update locally
        this.globalVariableService.addDashboardPermissions(newdP).then(res => {
            this.dashboardPermissions.push(res);
        });
    }

    clickDelete(index: number, id: number)  {
        // Delete clicked permission
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Delete locally, globally and DB
        this.globalVariableService.deleteDashboardPermissions(id).then(res => {
            this.dashboardPermissions.splice(index, 1);
        });

    }

    clickSelectGroup(ev) {
        // User changed the security access for the D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectGroup', '@Start');

        // Reset
        this.groupID = null;
        this.groupName = null;

        // Set group info
        this.groupName = ev.srcElement.value.toString();
        this.groups.forEach(g => {
            if (g.name == this.groupName) {
                this.groupID = g.id;
            };
        });
        console.log(ev.srcElement.value, this.accessType, this.groupID)
    }

    clickToggleView(id: number, index: number, $event) {
        // User dblclicked View - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleView', '@Start');

        this.dashboardPermissions[index].canView = !this.dashboardPermissions[index].canView;
    }

    clickToggleEdit(id: number, index: number, $event) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        this.dashboardPermissions[index].canEdit = !this.dashboardPermissions[index].canEdit;
    }

    clickToggleDelete(id: number, index: number, $event) {
        // User dblclicked Delete - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDelete', '@Start');

        this.dashboardPermissions[index].canDelete = !this.dashboardPermissions[index].canDelete;
    }
}
