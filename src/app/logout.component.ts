/*
 * Log out of Canvas
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

    errorMessage: string = '';
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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

        // Indicate logged out of all servers
        this.globalVariableService.loggedIntoServer.next(false);
        
        // Clear global Var
        this.globalVariableService.clearCurrentUser();

		this.formUserLogoutClosed.emit('LoggedOut');
        
    }
}
