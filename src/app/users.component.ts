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
import { CanvasUser }                 from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';


@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    @Output() formDashboardUsersClosed: EventEmitter<string> = new EventEmitter();

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
    dashboards: Dashboard[];
    dashboardPermissions: DashboardPermission[];
    errorMessage: string = '';
    groups: string[];
    message: string = '';
    selectedRow: number = 0;
    selectedID: string = '';
    users: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasUsers().then(u => {
            this.users = u.sort((n1,n2) => {
                if (n1.userID.toLowerCase() > n2.userID.toLowerCase()) {
                    return 1;
                };

                if (n1.userID.toLowerCase() < n2.userID.toLowerCase()) {
                    return -1;
                };

                return 0;
            });
            this.selectedRow = 0;
            if (u.length > 0) {
                this.groups = u[0].groups;
            };

            // Click first row
            if (this.users.length > 0) {
                this.clickRow(0, this.users[0].userID);
            };

         });


    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardUsersClosed.emit(action);
    }

    clickRow(index: number, userID: string) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'setClickedRow', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        this.selectedID = userID;
        this.selectedRow = index;
        this.users.forEach(u => {
            if (u.userID == userID) {
                this.groups = u.groups;
            };
        });

        // Reduce Permissions to current User (only direct, not indirect via Groups)
        this.globalVariableService.getDashboards().then(d => {
            this.dashboards = d;
            this.dashboardPermissions = this.globalVariableService.dashboardPermissions
                .filter(dp => dp.userID == userID);

            this.dashboardPermissions.forEach(dp => {
                this.dashboards.forEach(d => {
                    if (d.id == dp.dashboardID) {
                        dp.dashboardName = d.name;
                    };
                });
            });
        });

    }


    clickToggleView(id: number, $event) {
        // User dblclicked View - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleView', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleEdit(id: number, $event) {
        // User dblclicked Edit - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEdit', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleSave(id: number, $event) {
        // User dblclicked Save - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleSave', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };
    }

    clickToggleDelete(id: number, $event) {
        // User dblclicked Delete - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDelete', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };

    }

    clickToggleAddDS(id: number, $event) {
        // User dblclicked AddDS - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleAddDS', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };

    }

    clickToggleGrantAccess(id: number, $event) {
        // User dblclicked Grant Access - so toggle it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleGrantAccess', '@Start');

        this.errorMessage = '';

        // Can only do this if user has Grant Access
        if (!this.globalVariableService.dashboardPermissionCheck(id, 'cangrantaccess') ) {
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
            this.globalVariableService.saveDashboardPermission(
                this.dashboardPermissions[index])
                ;
        };

    }

    dblclickDelete(id: number) {
        // Delete selected group
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        this.globalVariableService.deleteCanvasGroup(id).then( () => {
            this.message = "User Deleted"
            this.users = this.users.filter(
                grp => grp.id != id
            );

            // Click first row
            if (this.users.length > 0) {
                this.clickRow(0, this.users[0].userID);
            };
        })
        .catch(err => {
            this.errorMessage = "Deletion of user failed " + err.message;
        });
    }

}

