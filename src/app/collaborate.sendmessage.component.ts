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

    toUsers: string;
    toGroups: string;
    subject: string;
    body: string;
    linked: boolean;
    canvasMessages: CanvasMessage[] = [];
    groups: CanvasGroup[] = [];
    users: CanvasUser[] = [];
    selectedUser: string = '';
    selectedGroup: string = '';

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

                this.globalVariableService.getCanvasGroups().then(grp => {
                    this.groups = grp;
                });
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

        let dashboardID: number = null;
        if (this.linked) {
            dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        };
        let dashboardTabID: number = null;
        if (this.linked) {
            dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
        };
        let recipients: [               // Original list of Users, groups are split into users @time
            {
                userID: string;
                readOn: string;     // dateTime read, null if not read
            }
        ];
        if (this.selectedUser != null  &&  this.selectedUser != undefined) {
            recipients.push({
                userID: this.selectedUser,
                readOn: ''
            });
        };
        if (this.selectedGroup != null  &&  this.selectedGroup != undefined) {

            // Loop on users to find members
            this.users.forEach(usr => {
                if (usr.groups.indexOf(this.selectedGroup) >= 0) {
                    recipients.push({
                        userID: usr.userID,
                        readOn: ''
                    });
                };
            });
        };


        // Construct new message
        let today = new Date();
        let newMessage: CanvasMessage = {
            id: null,
            threadID: null,
            sender: this.globalVariableService.currentUser.userID,
            sentOn: this.globalVariableService.formatDate(today),
            recipients: recipients,
            toGroups: [this.selectedGroup],
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
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Message has been sent',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );

		this.formDashboardMessageEmailClosed.emit(action);
    }


}
