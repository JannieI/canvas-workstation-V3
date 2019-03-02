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
    userFirstName: string = '';
    userID: string = '';
    users: CanvasUser[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('canvasUsers').then(u => {
            this.users = u.sort((n1,n2) => {
                if (n1.userID.toLowerCase() > n2.userID.toLowerCase()) {
                    return 1;
                };

                if (n1.userID.toLowerCase() < n2.userID.toLowerCase()) {
                    return -1;
                };

                return 0;
            }).slice();
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

        this.userID = this.users[index].userID;
        this.userFirstName = this.users[index].firstName;

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
            this.globalVariableService.saveResource('dashboardPermissions',
                this.dashboardPermissions[index])
                ;
        };

    }

    dblclickDelete(id: number) {
        // Delete selected user
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        this.globalVariableService.deleteResource('canvasUsers', id).then( () => {
            this.message = "User Deleted"
            this.users = this.users.filter(
                usr => usr.id != id
            );

            // Click first row
            if (this.users.length > 0) {
                this.clickRow(0, this.users[0].userID);
            };
        })
        .catch(err => {
            this.errorMessage = "Deletion of user failed " + err;
        });
    }

    clickSave() {
        // Save userID back (~Edit)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        // Validation
        if (this.userID == ''  ||  this.userID == null) {
            this.errorMessage = 'The user name is compulsory';
            return;
        };
        if (this.userFirstName == ''  ||  this.userFirstName == null) {
            this.errorMessage = 'The user First Name is compulsory';
            return;
        };

        // Cannot change to an existing userID
        if (this.users[this.selectedRow].userID != this.userID) {
            let groupIndex: number = this.users.findIndex(usr => usr.userID == this.userID);
            if (groupIndex >= 0) {
                this.errorMessage = 'The userID must be unique (' + this.userID + ' exists already)';
                return;
            };
        };

        let newUser: CanvasUser = { ...this.users[this.selectedRow], 
            userID: this.userID, 
            firstName: this.userFirstName
        };

        this.globalVariableService.saveResource('canvasUsers', newUser).then( () => {
            this.message = "User Updated"
            this.users[this.selectedRow] = newUser;
        })
        .catch(err => {
            this.errorMessage = "Updating of user failed " + err;
        });

    }

    clickAdd() {
        // Add a new groupName
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.message = '';
        this.errorMessage = '';

        // Validation
        if (this.userID == ''  ||  this.userID == null) {
            this.errorMessage = 'The user name is compulsory';
            return;
        };
        if (this.userFirstName == ''  ||  this.userFirstName == null) {
            this.errorMessage = 'The user First Name is compulsory';
            return;
        };
        let groupIndex: number = this.users.findIndex(usr => usr.userID == this.userID);
        if (groupIndex >= 0) {
            this.errorMessage = 'The userID must be unique (it exists already)';
            return;
        };

        // TODO - later make a company template, and apply this to each new user
        let newUser: CanvasUser = {
            id: null,
            companyName: this.globalVariableService.canvasSettings.companyName,
            userID: this.userID,
            password: 'clarity!01',
            firstName: this.userFirstName,
            lastName: '',
            nickName: '',
            email: this.userID + '@' + this.globalVariableService.canvasSettings.companyName,
            workNumber: '',
            cellNumber: '',
            groups: [],
            isSuperuser: false,
            isStaff: false,
            isActive: true,
            dateJoined: new Date(),
            lastLogin: null,
            colorScheme: '',
            gridSize: 10,
            environment: '',
            profilePicture: '',
            queryRuntimeWarning: 3,
            snapToGrid: false,
            favouriteDashboards: [],
            isFirstTimeUser: true,
            isAdministrator: false,
            dashboardCanCreateRole: false,
            dashboardCanViewRole: false,
            dashboardCanEditRole: false,
            dashboardCanSaveRole :false,
            dashboardCanDeleteRole: false,
            dashboardCanGrantAccessRole: false,
            dashboardCanAddDatasourceRole: false,
            datasourceCanCreateRole: false,
            datasourceCanViewRole: false,
            datasourceCanEditRole: false,
            datasourceCanDeleteRole: false,
            datasourceCanGrantAccessRole: false,
            canManageGroupRole: false,
            lastPaletteLeft: 30,
            lastPaletteTop: 30,
            lastAppShowPopupMessageGotIt: false,
            cleanCacheOnLogin: false,
            cleanCacheOnLogout: false,
            preferencePaletteHorisontal: true,
            preferencePlaySound: false,
            preferenceDebugSession: false,
            preferenceAutoSync: false,
            preferenceShowOpenStartupMessage: false,
            preferenceShowOpenDataCombinationMessage: false,
            preferenceShowViewStartupMessage: false,
            preferenceShowDiscardStartupMessage: false,
            preferenceDefaultTemplateID: null,
            preferenceDefaultDateformat: '',
            preferenceDefaultFolder: '',
            preferenceDefaultPrinter: '',
            preferenceDefaultPageSize: '',
            preferenceDefaultPageLayout: '',
            preferenceDefaultSnapshotMins: 0,
            preferenceStartupDashboardID: null,
            preferenceStartupDashboardTabID: null,
            preferenceShowWidgetEditorLite: true,
            editedBy:  this.globalVariableService.currentUser.userID,
            editedOn:  new Date(),
            createdBy: this.users[this.selectedRow].createdBy,
            createdOn: this.users[this.selectedRow].createdOn
        };

        this.globalVariableService.addResource('canvasUsers', newUser).then(res => {
            this.message = "User Added with " + res.id;
            console.log('xx res after Add', res)
            this.users.push(res);
            this. selectedRow = this.users.length - 1;
            this.selectedID = res.id;

        })
        .catch(err => {
            this.errorMessage = "Addition of the user failed " + err;
        });

    }
}

