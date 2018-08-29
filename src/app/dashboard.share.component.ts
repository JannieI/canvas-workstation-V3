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
    dashboardPermissions: DashboardPermission[];
    errorMessage: string = '';
    groupID: number;
    groupName: string = '';
    groups: CanvasGroup[];
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

        this.globalVariableService.getCanvasGroups().then( res => {
            this.accessType = this.selectedDashboard.accessType;
            this.dashboardPermissions = this.globalVariableService.dashboardPermissions
                .filter(dP => dP.dashboardID == this.selectedDashboard.id);
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

        this.selectedDashboard.accessType = this.accessType;
        this.globalVariableService.saveDashboard(this.selectedDashboard);

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
            grantedOn: today
        };

        // Update locally
        this.globalVariableService.addDashboardPermission(newdP).then(res => {
            this.dashboardPermissions.push(res);
        });
    }

    dblclickDelete(id: number)  {
        // Delete clicked permission
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Delete locally, globally and DB
        this.globalVariableService.deleteDashboardPermission(id).then(res => {
            let index: number = -1;
            for(var i = 0; i < this.dashboardPermissions.length; i++) {
                if (this.dashboardPermissions[i].id == id) {
                    index = i;
                };
            };
            if (index >= 0) {
                this.dashboardPermissions.splice(index, 1);
            };
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canViewRight = ! this.dashboardPermissions[i].canViewRight;
                index = i;
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canEditRight = ! this.dashboardPermissions[i].canEditRight;
                index = i;
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canSaveRight = ! this.dashboardPermissions[i].canSaveRight;
                index = i;
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canDeleteRight = ! this.dashboardPermissions[i].canDeleteRight;
                index = i;
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canAddDatasource = ! this.dashboardPermissions[i].canAddDatasource;
                index = i;
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

        let index: number = -1;
        for(var i = 0; i < this.dashboardPermissions.length; i++) {
            if (this.dashboardPermissions[i].id == id) {
                this.dashboardPermissions[i].canGrantAccess = ! this.dashboardPermissions[i].canGrantAccess;
                index = i;
            };
        };

        if (index != -1) {
            this.globalVariableService.saveDashboardPermission(
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
