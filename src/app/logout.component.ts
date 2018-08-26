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

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

    @Output() formUserLogoutClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickLogout();
            return;
        };

    }

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickClose() {
        // Close, stay logged in
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formUserLogoutClosed.emit('Cancel');
    }

    clickLogout() {
        // Log out - only further valid action is to log in
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@clickLogout');

        // Clear all related info
        this.globalVariableService.clearDashboardInfo();

        // Reset / Logout user
        // TODO - do this in better way
        this.globalVariableService.currentUserID.next('');
        
        // Clear global Var
        this.globalVariableService.clearCurrentUser();
        // this.globalVariableService.currentUser.userID = '';
        // this.globalVariableService.currentUser.isSuperuser = false;
        // this.globalVariableService.currentUser.isStaff = false;
        // this.globalVariableService.currentUser.groups = [];
        // this.globalVariableService.currentUser.dashboardCanViewRole = false;
        // this.globalVariableService.currentUser.dashboardCanSaveRole = false;
        // this.globalVariableService.currentUser.dashboardCanGrantAccessRole = false;
        // this.globalVariableService.currentUser.dashboardCanEditRole = false;
        // this.globalVariableService.currentUser.dashboardCanDeleteRole = false;
        // this.globalVariableService.currentUser.dashboardCanCreateRole = false;
        // this.globalVariableService.currentUser.dashboardCanAddDatasourceRole = false;
        // this.globalVariableService.currentUser.canManageGroupRole = false;

		this.formUserLogoutClosed.emit('LoggedOut');
        
    }
}
