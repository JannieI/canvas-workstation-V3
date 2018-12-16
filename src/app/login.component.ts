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

    canvasServerName: string = '';              // Canvas Server selected
    canvasServerURI: string = '';               // Canvas Server URI
    canvasServerList: string[] = [];
    companyName: string = 'Clarity Analytics';  // Clarity Analytics
    errorMessage: string = '';
    message: string = '';
    password: string = '123';                   // 123
    showTypeDashboard: boolean = false;
    userID: string = 'JannieI';                 // JannieI

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.canvasServerList = this.globalVariableService.ENVCanvasServerList
            .map( x => x.serverName);

        // Validate
        if (this.canvasServerList == null) {
            this.errorMessage = 'Set Canvas Servers in environment file';
        };
        if (this.canvasServerList.length == 0) {
            this.errorMessage = 'Set Canvas Servers in environment file';
        };

        this.canvasServerName = this.globalVariableService.ENVStartupCanvasServerName;
    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formUserLoginClosed.emit(action);
    }

    clickLogin() {
        // Log in
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLogin', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';

        // Validate info
        if (this.canvasServerName =='') {
            this.errorMessage = 'Please enter a Canvas Server';
            return;
        };
        if (this.companyName =='') {
            this.errorMessage = 'Please enter a Company Name';
            return;
        };
        if (this.userID =='') {
            this.errorMessage = 'Please enter a userID';
            return;
        };
        if (this.password =='') {
            this.errorMessage = 'Please enter a password';
            return;
        };

        // Validate user
        this.globalVariableService.loginCanvasServer(
            this.canvasServerName, this.companyName, this.userID, this.password).then(res => {
            if (!res) {

                this.errorMessage = 'Login failed';
                return;
            } else {

                // Register session start time
                let today = new Date();
                this.globalVariableService.sessionDateTimeLoggedin =
                    this.globalVariableService.formatDate(today);

                // Indicate logged in; so StatusBar shows Server Name
                this.globalVariableService.loggedIntoServer.next(true);

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

    clickRegister() {
        // Register a server-company-user
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRegister', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';

        // Validate info
        if (this.canvasServerName =='') {
            this.errorMessage = 'Please enter a Canvas Server';
            return;
        };
        if (this.companyName =='') {
            this.errorMessage = 'Please enter a Company Name';
            return;
        };
        if (this.userID =='') {
            this.errorMessage = 'Please enter a userID';
            return;
        };
        if (this.password =='') {
            this.errorMessage = 'Please enter a password';
            return;
        };

        // Set current Server Name and URI
        this.globalVariableService.registerCanvasUser(
            this.canvasServerName, this.companyName, this.userID, this.password).then(res => {

            console.warn('xx res', res);
            
            if (res.substring(0, 5) == 'Error') {
                this.errorMessage = res.substring(7);
            };
            if (res.substring(0, 6) == 'Failed') {
                this.errorMessage = res.substring(8);
            };
            if (res.substring(0, 7) == 'Success') {
                this.message = res.substring(9);
            };
        });

    }
}
