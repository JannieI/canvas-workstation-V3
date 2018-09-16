/*
 * Login form
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Token }                      from './models';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    @Output() formUserLoginClosed: EventEmitter<string> = new EventEmitter();

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
            this.clickLogin();
            return;
        };

    }

    currentUserID: string = '';
    errorMessage: string = '';
    localServer: string = 'Local';
    password: string = '';
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // TODO - fix when values read from form
        this.globalVariableService.loggedIntoServer.next(
            !this.globalVariableService.loggedIntoServer.value
        )

		this.formUserLoginClosed.emit(action);
    }

    clickLocalServer() {
        // User clicked Local / Server
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLocalServer', '@Start');

        // TODO - verify that server exists, and list multiple if so allowed
    }

    clickLogin() {
        // Log in
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLocalServer', '@Start');

        // Reset
        this.errorMessage = '';

        // Validate user
        this.globalVariableService.login(this.currentUserID, this.password).then(res => {
            if (!res) {

                this.errorMessage = 'Login failed';
                return;
            } else {
                let tkn: Token = JSON.parse(localStorage.getItem('eazl-token'));
                console.warn('xx tkn', tkn.token, tkn.user)

                // Register session start time
                let today = new Date();
                this.globalVariableService.sessionDateTimeLoggedin =
                    this.globalVariableService.formatDate(today);

                // TODO - fix when values read from form
                this.globalVariableService.loggedIntoServer.next(
                    this.localServer=='Local'? false : true
                );

                // Set userID
                this.globalVariableService.currentUserID.next(this.currentUserID);

                // Optional start D
                if (this.globalVariableService.currentUser.preferenceStartupDashboardID != null) {
                    let startTabID: number = -1;
                    if (this.globalVariableService.currentUser.preferenceStartupDashboardTabID != null) {
                        startTabID = this.globalVariableService.currentUser.preferenceStartupDashboardTabID;
                    };

                    this.globalVariableService.refreshCurrentDashboard(
                        'statusbar-clickTabDelete',
                        this.globalVariableService.currentUser.preferenceStartupDashboardID,
                        startTabID,
                        ''
                    );
                };

        		this.formUserLoginClosed.emit('LoggedIn');

            };
        });

    }
}
