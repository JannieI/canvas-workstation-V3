/*
 * Shows content of a message
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
import { CanvasMessage }              from './models';

@Component({
    selector: 'collaborate-messageContent',
    templateUrl: './collaborate.messageContent.component.html',
    styleUrls: ['./collaborate.messageContent.component.css']
})
export class CollaborateMessageContentComponent implements OnInit {

    @Output() formMessageContentClosed: EventEmitter<string> = new EventEmitter();
    @Input() messageAction: string;
    @Input() existingMessagge: CanvasMessage;

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

        this.globalVariableService.getResource('canvasMessages').then(msg => {
            this.canvasMessages = msg;

            this.globalVariableService.getResource('canvasUsers')
                .then(usr => {
                    this.users = usr.sort((n1,n2) => {
                        if (n1.userID.toLowerCase() > n2.userID.toLowerCase()) {
                            return 1;
                        };
                    
                        if (n1.userID.toLowerCase() < n2.userID.toLowerCase()) {
                            return -1;
                        };
                    
                        return 0;
                    }); 
                    usr.forEach(u => {
                        this.userNames.push(u.userID);
                    });
                    this.userNames = ['', ...this.userNames];

                    this.globalVariableService.getResource('canvasGroups')
                        .then(grp => {
                            grp = grp.sort((n1,n2) => {
                                if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                                    return 1;
                                };
                            
                                if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                                    return -1;
                                };
                            
                                return 0;
                            });
                            grp.forEach(g => {
                                this.groupNames.push(g.name);
                            });
                        })
                        .catch(err => {
                            this.errorMessage = err.slice(0, 100);
                            console.error('Error in Collaborate.messageContant canvasGroups: ' + err)
                        });
                
                    this.groupNames = this.groupNames.sort((n1,n2) => {
                        if (n1.toLowerCase() > n2.toLowerCase()) {
                            return 1;
                        };
                    
                        if (n1.toLowerCase() < n2.toLowerCase()) {
                            return -1;
                        };
                    
                        return 0;
                    });

                    this.groupNames = ['', ...this.groupNames];
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Collaborate.messageContant canvasUsers: ' + err)
                });

            if (this.existingMessagge != null  &&  this.messageAction == 'reply') {
                this.selectedUser = this.existingMessagge.sender;
            };

        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Collaborate.messageContant Startup: ' + err)
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
		this.formMessageContentClosed.emit(action);
    }

    clickSend(action: string) {
        // Send message and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSend', '@Start');

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
                    readOn: Date;     // dateTime read, null if not read
                }
            ] = [
                    {
                        userID: '',
                        readOn: null
                    }
                ];

        if (this.selectedUser != null
            &&
            this.selectedUser != undefined
            &&
            this.selectedUser != '') {
            recipients[0].userID = this.selectedUser;
        };

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
                            readOn: null
                        });
                    };
                };
            };
        };

        // Construct new message
        let today = new Date();
        let newMessage: CanvasMessage = {
            id: null,
            threadID: this.existingMessagge==null? null : this.existingMessagge.threadID,
            sender: this.globalVariableService.currentUser.userID,
            sentOn: today,
            recipients: recipients,
            toGroups: [],
            subject: this.subject,
            body: this.body,
            dashboardID: dashboardID,
            dashboardTabID: dashboardTabID,
            url: null,
            replyToMessageID: this.existingMessagge==null? null : this.existingMessagge.id,

            // At runtime
            iHaveReadThis: false,
            dashboardName: null,
            replySender: null,
            replyMessageStart: ''
        }

        // Fill in old info if reply/forward 
        if (this.messageAction == 'reply'  ||  this.messageAction == 'forward') {
            newMessage.threadID = this.existingMessagge.threadID;
            newMessage.replyToMessageID = this.existingMessagge.id;
        }

        // Send
        this.globalVariableService.addResource('canvasMessages', newMessage)
            .then(res => {

                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Message has been sent',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // TODO - this may cause delays: test and put outside Promise if needed
                this.formMessageContentClosed.emit(action);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Collaborate.messageContant Send: ' + err)
            });

    }


}
