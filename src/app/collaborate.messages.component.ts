/*
 * Shows form with messages
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
import { CanvasMessage }           from './models';

@Component({
    selector: 'collaborate-messages',
    templateUrl: './collaborate.messages.component.html',
    styleUrls: ['./collaborate.messages.component.css']
})
export class CollaborateMessagesComponent implements OnInit {

    @Output() formCollaborateMessagesClosed: EventEmitter<string> = new EventEmitter();

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
    messageUnRead: boolean = false;
    newMessage: boolean = false;
    recipient: string = '';
    sendBefore: string = '';
    sender: string = '';
    sentAfter: string = '';
    subject: string = null;

    messageAction: string;
    existingMessagge: CanvasMessage;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.sentAfter = new Date(this.globalVariableService.currentUser.lastLogin).toDateString();

        this.clickFilter(false);

    }

    clickSystem() {
        // Fill SYSTEM value into form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSystem', '@Start');

        this.sender = 'SYSTEM';
    }

    clickRecipientMe() {
        // Toggle Recipient = current UserID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRecipientMe', '@Start');

        if (this.recipient == '') {
            this.recipient = this.globalVariableService.currentUser.userID;
        } else {
            this.recipient = '';
        };

    }

    clickLastLogin() {
        // Toggle Last Login value on form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLastLogin', '@Start');

        if (this.sentAfter == '') {
            this.sentAfter = new Date(this.globalVariableService.currentUser.lastLogin).toDateString();
        } else {
            this.sentAfter = '';
        };

    }

    clickFilter(showNewMessage: boolean) {
        // Toggle filter on / off
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');

        // TODO - the filtering must be done in DB
        this.globalVariableService.getResource('canvasMessages')
            .then(msg => {
                this.canvasMessages = msg;

                if (this.sender != '') {
                    this.canvasMessages = this.canvasMessages.filter(
                        m => m.sender.toLowerCase().indexOf(this.sender.toLowerCase()) >= 0
                    );
                };
                if (this.recipient != '') {
                    this.canvasMessages = this.canvasMessages.filter(m => {
                        let isFound: boolean = false;
                        m.recipients.forEach(r => {
                            if (r.userID.toLowerCase().indexOf(this.recipient.toLowerCase()) >= 0) {
                                isFound = true;
                            };
                        });
                        return isFound;
                    });
                };
                if (this.messageUnRead) {
                    this.canvasMessages = this.canvasMessages.filter(m => {
                        let isFound: boolean = false;
                        m.recipients.forEach(r => {
                            if (r.readOn == null) {
                                isFound = true;
                            };
                        });
                        return isFound;
                    });
                };
                if (this.body != '') {
                    this.canvasMessages = this.canvasMessages.filter(
                        m => m.body.toLowerCase().includes(this.body.toLowerCase())
                    );
                };
                if (this.subject != ''  &&  this.subject != null) {
                    this.canvasMessages = this.canvasMessages.filter(
                        m => m.subject.toLowerCase().includes(this.subject.toLowerCase())
                    );
                };
                if (this.sentAfter != '') {
                    this.canvasMessages = this.canvasMessages.filter(
                        m => new Date(m.sentOn).getTime() >= new Date(this.sentAfter).getTime()
                    );
                };
                if (this.sendBefore != '') {
                    this.canvasMessages = this.canvasMessages.filter(
                        m => new Date(m.sentOn).getTime() <= new Date(this.sendBefore).getTime()
                    );
                };

                // Sort Desc
                this.canvasMessages.sort(
                    (a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime()
                );

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Collaborate.messages reading canvasMessages: ' + err)
            });

        // Show/hide new message form
        this.newMessage = showNewMessage;
    }

    clickJumpToLinked(id: number) {
        // Jumps to the linked Dashboard and Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickJumpToLinked', '@Start');

        this.errorMessage = '';

        let messagesFound: CanvasMessage[] = this.canvasMessages.filter(msg => msg.id == id);

        if (messagesFound.length == 0) {
            return;
        }

        let dashboardID: number = messagesFound[0].dashboardID;
        let dashboardTabID: number = messagesFound[0].dashboardTabID;

        if (dashboardID == null  ||  dashboardTabID == null) {
            return;
        };

        this.globalVariableService.refreshCurrentDashboard(
            'messages-clickJumpToLinked', dashboardID, dashboardTabID, ''
        );

		this.formCollaborateMessagesClosed.emit('Closed');

    }

    clickReply(id: number) {
        // Reply to a message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickReply', '@Start');

        this.errorMessage = '';

        this.messageAction = 'reply'
        let messageIndex: number = this.canvasMessages.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            this.existingMessagge = this.canvasMessages[messageIndex];
        } else {
            this.existingMessagge = null;
        };

        this.newMessage = true;
    }

    clickForward(id: number) {
        // Forward a message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickForward', '@Start');

        this.errorMessage = '';

        this.messageAction = 'forward'
        let messageIndex: number = this.canvasMessages.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            this.existingMessagge = this.canvasMessages[messageIndex];
        } else {
            this.existingMessagge = null;
        };

        this.newMessage = true;
    }

    handleReplyForward(ev: any) {
        // Forward a message
        this.globalFunctionService.printToConsole(this.constructor.name,'handleReplyForward', '@Start');

        this.clickFilter(false);
        this.messageAction = '';

    }

    clickCopyText(id: number) {
        // Copy Text to clipboard
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCopyText', '@Start');

        this.errorMessage = '';

        let messageIndex: number = this.canvasMessages.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            document.execCommand('copy',false,"Subject: " + this.canvasMessages[messageIndex].subject
                + "; Body: " + this.canvasMessages[messageIndex].body);
        };

    }

    clickRecall(id: number) {
        // Recall a message, if not read by anyone
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRecall', '@Start');

        this.errorMessage = '';

        let readCount: number = 0;
        let messageIndex: number = this.canvasMessages.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            this.canvasMessages[messageIndex].recipients.forEach(rec => {
                if (rec.readOn != null) {
                    readCount = readCount + 1;
                };
            });
            if (readCount == 0) {
                this.globalVariableService.deleteResource('canvasMessages', id)
                    .then(res => {
                        this.clickFilter(false);
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 100);
                        console.error('Error in Collaborate.messages deleting canvasMessages: ' + err)
                    });
            } else {
                this.errorMessage = 'Message was read - cannot Recall';
            };
        };

    }

    clickNewMessageClose() {
        // Cancel creating a new message, back to message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNewMessageClose', '@Start');

        this.newMessage = !this.newMessage;
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        // Mark all the messages as read
        this.globalVariableService.updateCanvasMessagesAsRead(
            this.globalVariableService.currentUser.userID
        );
		this.formCollaborateMessagesClosed.emit(action);
    }
}
