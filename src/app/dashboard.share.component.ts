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

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    accessType: string = '';
    canChangePermissions: boolean = false;
    dashboardPermissions: DashboardPermission[];
    errorMessage: string = 'asdfasdfasdfasdfasdfasdfasfdsdfasdfasdafasdf';
    groupID: number;
    groupName: string = '';
    groups: CanvasGroup[];
    originalAccessType: string = '';
    selectedRow: number = 0;
    userID: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.accessType = this.selectedDashboard.accessType;
        this.originalAccessType = this.selectedDashboard.accessType;

        this.globalVariableService.getResource('canvasGroups')
            .then( res => {
                this.dashboardPermissions = this.globalVariableService.dashboardPermissions
                    .filter(dP => dP.dashboardID == this.selectedDashboard.id);
                this.groups = res;
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.share reading canvasGroups: ' + err);
            });

        // Check permissions
        if (this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.canChangePermissions =  true;
        } else {
            this.errorMessage = 'You cannot Grant access to others';
        };

    }

    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardShareClosed.emit(action);
    }

    clickSave() {
        // Save the change, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Delete permissions records if changed away from Access List
        if (this.originalAccessType == 'AccessList'  &&  this.accessType != 'AccessList') {
            // Get all the IDs and delete
            let dPIDs: number[] = [];
            this.globalVariableService.dashboardPermissions.forEach(dp => {
                dPIDs.push(dp.id);
            });
            dPIDs.forEach(id => this.globalVariableService.deleteResource(
                'dashboardPermissions', id));
        };

        // Save data
        this.selectedDashboard.accessType = this.accessType;
        this.globalVariableService.saveResource('dashboards', this.selectedDashboard);

        this.formDashboardShareClosed.emit('Saved');
    }

    clickAdd() {
        // Add UserID and GroupName to the grid, and clear
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.errorMessage = '';

        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

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
                 (this.groupName != ''
                    &&
                    dp.groupName.toLowerCase() == this.groupName.toLowerCase()
                 )
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
            canEditRight: false,
            canViewRight: false,
            canSaveRight: false,
            canDeleteRight: false,
            canAddDatasource: false,
            canGrantAccess: false,
            grantor: this.globalVariableService.currentUser.userID,
            grantedOn: today,
            editedBy: '',
            editedOn: null,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: today
        };

        // Update locally
        this.globalVariableService.addResource('dashboardPermissions', newdP)
            .then(res => {
                this.dashboardPermissions.push(res);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.share adding dashboardPermissions: ' + err);
            });
    }

    dblclickDelete(id: number)  {
        // Delete clicked permission
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        this.errorMessage = '';

        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        // Delete locally, globally and DB
        this.globalVariableService.deleteResource('dashboardPermissions', id)
            .then(res => {
                let index: number = -1;
                for(var i = 0; i < this.dashboardPermissions.length; i++) {
                    if (this.dashboardPermissions[i].id == id) {
                        index = i;
                    };
                };
                if (index >= 0) {
                    this.dashboardPermissions.splice(index, 1);
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.share adding dashboardPermissions: ' + err);
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
            if (g.name.toLowerCase() == this.groupName.toLowerCase()) {
                this.groupID = g.id;
            };
        });
        console.log(ev.srcElement.value, this.accessType, this.groupID)
    }

    clickToggleView(id: number, $event) {
        // User dblclicked View - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleView', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        // Toggle access
        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canViewRight = ! this.dashboardPermissions[i].canViewRight;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleEdit(id: number, $event) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canEditRight = ! this.dashboardPermissions[i].canEditRight;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleSave(id: number, $event) {
        // User dblclicked Save - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleSave', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canSaveRight = ! this.dashboardPermissions[i].canSaveRight;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleDelete(id: number, $event) {
        // User dblclicked Delete - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDelete', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canDeleteRight = ! this.dashboardPermissions[i].canDeleteRight;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };

    }

    clickToggleAddDS(id: number, $event) {
        // User dblclicked AddDS - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleAddDS', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canAddDatasource = ! this.dashboardPermissions[i].canAddDatasource;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };

    }

    clickToggleGrantAccess(id: number, $event) {
        // User dblclicked Grant Access - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleGrantAccess', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id, 'cangrantaccess') ) {
                this.errorMessage = 'You cannot Grant access to others';
                return;
        };

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canGrantAccess = ! this.dashboardPermissions[i].canGrantAccess;
                index = i;

                // Update Grantor and -On
                this.dashboardPermissions[i].grantor = this.globalVariableService.currentUser.userID;
                this.dashboardPermissions[i].grantedOn = new Date();
            };
        };

        if (index != -1) {
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };

    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}
