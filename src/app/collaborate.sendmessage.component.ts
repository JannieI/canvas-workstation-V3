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
import { CanvasUser }                 from './models';
import { CanvasGroup }                from './models';
import { CanvasMessage }              from './models';

@Component({
    selector: 'collaborate-sendmessage',
    templateUrl: './collaborate.sendmessage.component.html',
    styleUrls: ['./collaborate.sendmessage.component.css']
})
export class CollaborateSendMessageComponent implements OnInit {

    @Output() formDashboardMessageEmailClosed: EventEmitter<string> = new EventEmitter();

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

    body: string = '';
    canvasMessages: CanvasMessage[] = [];
    errorMessage: string = '';
    groupNames: string[] = [];
    linked: boolean;
    selectedUser: string = '';
    selectedGroup: string = '';
    subject: string = '';
    toGroups: string;
    toUsers: string;
    userNames: string[] = [];
    users: CanvasUser[] = [];
    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasMessages().then(msg => {
            this.canvasMessages = msg;

            this.globalVariableService.getCanvasUsers().then(usr => {
                this.users = usr;
                usr.forEach(u => {
                    this.userNames.push(u.userID);
                });
                this.userNames = ['', ...this.userNames];

                this.globalVariableService.getCanvasGroups().then(grp => {
                    grp.forEach(g => {
                        this.groupNames.push(g.name);
                    });
                });
                // this.groupNames = ['', ...this.groupNames];
            });

        });
    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardMessageEmailClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        if (this.selectedUser == ''  &&  this.selectedGroup == '') {
            this.errorMessage = 'User and Group cannot both be empty';
            return;
        };

        if (this.subject == '') {
            this.errorMessage = 'Subject must be completed';
            return;
        };
        if (this.body == '') {
            this.errorMessage = 'Body must be completed';
            return;
        };

        // Set linked D & T
        let dashboardID: number = null;
        let dashboardTabID: number = null;
        if (this.linked) {
            dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
        };

        // Create empty array
        let recipients: 
            [
                {
                    userID: string;
                    readOn: string;     // dateTime read, null if not read
                }
            ] = [
                    {
                        userID: '',
                        readOn: ''
                    }
                ];
        console.warn('xx 1 rec', this.selectedUser, recipients)
        if (this.selectedUser != null  
            &&  
            this.selectedUser != undefined  
            &&  
            this.selectedUser != '') {
            recipients[0].userID = this.selectedUser;
        };
        console.warn('xx 2 rec', recipients)
        if (this.selectedGroup != null  &&  this.selectedGroup != undefined) {

            // Loop on users to find members
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].groups.map(x => x.toLowerCase()).indexOf(
                    this.selectedGroup.toLowerCase()) >= 0) {
                    if (i == 0) {
                        recipients[0].userID = this.users[i].userID;
                    } else {
                        recipients.push({
                            userID: this.users[i].userID,
                            readOn: ''
                        });
                    };
                    console.warn('xx 3 rec', recipients)
                };
            };
        };


        // this.selectedGroup
        
        // Construct new message
        let today = new Date();
        let newMessage: CanvasMessage = {
            id: null,
            threadID: null,
            sender: this.globalVariableService.currentUser.userID,
            sentOn: this.globalVariableService.formatDate(today),
            recipients: recipients,
            toGroups: [],
            subject: this.subject,
            body: this.body,
            dashboardID: dashboardID,
            dashboardTabID: dashboardTabID,
            url: null,
            replyToMessageID: null,
        
            // At runtime
            iHaveReadThis: false,
            dashboardName: null,
            replySender: null,
            replyMessageStart: ''
        }

        // Send
        this.globalVariableService.addCanvasMessage(newMessage).then(res => {

            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'Message has been sent',
                    uiArea: 'StatusBar',
                    classfication: 'Info',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
        });

		this.formDashboardMessageEmailClosed.emit(action);
    }


}
