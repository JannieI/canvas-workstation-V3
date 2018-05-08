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
import { CanvasMessage }           from './models';
import { DatagridInput }              from './models';

@Component({
    selector: 'collaborate-messagesNew',
    templateUrl: './collaborate.messagesNew.component.html',
    styleUrls: ['./collaborate.messagesNew.component.css']
})
export class CollaborateMessagesComponentNew implements OnInit {

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
    canvasMessagesNew: CanvasMessage[] = [];
    messageUnRead: boolean = false;
    newMessage: boolean = false;
    recipient: string = '';
    sendBefore: string = '';
    sender: string = '';
    sentAfter: string = '';
    subject: string = '';

    messageAction: string;
    existingMessaqge: CanvasMessage;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.sentAfter = this.globalVariableService.currentUser.lastLogin;

        this.clickFilter();

        // TODO - keep for a while to copy back, then delete
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'JannieI',
            //         sentOn: '2017/01/01',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'Review of upcoming budget',
            //         body: 'Please review and add missing logistics figures',
            //         dashboardID: 1,
            //         dashboardTabID: 1,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: true,
            //         dashboardName: 'Logistics Overview',
            //         replySender: 'HeatherS',
            //         replyMessageStart: 'Adhearance to the budget time-lines are critical ...'
            //     }
            // );
            // this.canvasMessagesNew[0].recipients.push( 
            //     {
            //         userID: 'MeganP',
            //         readOn: '2017/01/02'
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'VivK',
            //         sentOn: '2017/01/02',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'New model',
            //         body: 'I have added the transport costs to the new model, but it skews the figures as we now have once-off tonage included for March.  I suggest we leave it out, and just add an annotation.  Let me know by close today so that I can make any adjustmensts prior to our 9 oclock tomorrow...',
            //         dashboardID: null,
            //         dashboardTabID: 1,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: true,
            //         dashboardName: '',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'JohnatanB',
            //         sentOn: 'Yesterday',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'Review of upcoming budget',
            //         body: 'Pam, please action',
            //         dashboardID: 1,
            //         dashboardTabID: 1,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: true,
            //         dashboardName: 'Pre Budget Presentation',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'OxleyA',
            //         sentOn: 'Yesterday',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'Staff turnover looks too high',
            //         body: 'Mary, the staff turnover figures for August looks very high, particularly as compared to last year.  At the previous Exco we have discussed the downwards trend.  Can Jerry please review the first graph and let me know.  Oxley',
            //         dashboardID: 1,
            //         dashboardTabID: null,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: false,
            //         dashboardName: '',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'PamH',
            //         sentOn: '8:52AM',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'Review of upcoming budget',
            //         body: 'Hi Johno, I have reviewed the logistics figures are actually included.  It is lower because of the industrial action and holidays.  Also, two b-liners were in for repars.',
            //         dashboardID: null,
            //         dashboardTabID: 1,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: false,
            //         dashboardName: '',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'BiancaC',
            //         sentOn: '11:02AM',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'New model',
            //         body: 'Agreed, lets leave it out',
            //         dashboardID: null,
            //         dashboardTabID: 1,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: false,
            //         dashboardName: '',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
            // this.canvasMessagesNew.push(
            //     {
            //         id: 1,
            //         threadID: 1,
            //         sender: 'BiancaC',
            //         sentOn: 'Just Now',
            //         recipients: [
            //             {
            //                 userID: 'SamH',
            //                 readOn: null
            //             }
            //         ],
            //         toGroups: [],
            //         subject: 'New model',
            //         body: 'Viv, I spotted another issue: the alignment of the top graphs on the last tab is off.  Also, please resize the logo proportionally.  And print a copy for Dough; he will arrive just before the meeting',
            //         dashboardID: 1,
            //         dashboardTabID: null,
            //         url: '',
            //         replyToMessageID: null,
            //         iHaveReadThis: false,
            //         dashboardName: '',
            //         replySender: '',
            //         replyMessageStart: ''
            //     }
            // );
        // End
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
            this.sentAfter = this.globalVariableService.currentUser.lastLogin;
        } else {
            this.sentAfter = '';
        };

    }
    
    clickFilter() {
        // Toggle filter on / off
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');

        // TODO - the filtering must be done in DB
        this.globalVariableService.getCanvasMessages().then(msg => {
            this.canvasMessagesNew = msg;

            if (this.sender != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(
                    m => m.sender == this.sender
                );
            };
            if (this.recipient != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(m => {
                    let isFound: boolean = false;
                    m.recipients.forEach(r => {
                        if (r.userID == this.recipient) {
                            isFound = true;
                        };
                    });
                    return isFound;
                });
            };
            if (this.messageUnRead) {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(m => {
                    let isFound: boolean = false;
                    m.recipients.forEach(r => {
                        if (r.readOn == '') {
                            isFound = true;
                        };
                    });
                    return isFound;
                });
            };
            if (this.body != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(
                    m => m.body.toLowerCase().includes(this.body.toLowerCase())
                );
            };
            if (this.subject != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(
                    m => m.subject.toLowerCase().includes(this.subject.toLowerCase())
                );
            };
            if (this.sentAfter != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(
                    m => m.sentOn >= this.sentAfter
                );
            };
            if (this.sendBefore != '') {
                this.canvasMessagesNew = this.canvasMessagesNew.filter(
                    m => m.sentOn <= this.sendBefore
                );
            };
            });



    }

    clickJumpToLinked(id: number) {
        // Jumps to the linked Dashboard and Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickJumpToLinked', '@Start');

        let messagesFound: CanvasMessage[] = this.canvasMessagesNew.filter(msg => msg.id == id);

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

        this.messageAction = 'reply'
        let messageIndex: number = this.canvasMessagesNew.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            this.existingMessaqge = this.canvasMessagesNew[messageIndex];
        } else {
            this.existingMessaqge = null;
        };

        this.newMessage = true;
    }

    clickForward(id: number) {
        // Forward a message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickForward', '@Start');

        this.messageAction = 'forward'
        let messageIndex: number = this.canvasMessagesNew.findIndex(msg => msg.id == id);
        if (messageIndex >= 0) {
            this.existingMessaqge = this.canvasMessagesNew[messageIndex];
        } else {
            this.existingMessaqge = null;
        };

        this.newMessage = true;

    }

    handleReplyForward(ev: any) {
        // Forward a message
        this.globalFunctionService.printToConsole(this.constructor.name,'handleReplyForward', '@Start');
        
        this.newMessage = false;
        
    }

    clickCopyText() {
        // Copy Text to clipboard
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCopyText', '@Start');
        let e: ClipboardEvent;
        e.clipboardData.setData('text/plain', 'Hallo World!');
        console.warn('xx e', e)
        //       e.preventDefault();
        //       document.removeEventListener('copy');
        //     });
        //     document.execCommand('copy');
        //   };
    }

    clickRecall() {
        // Recall a message, if not read by anyone
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRecall', '@Start');

    }

    clickNewMessageClose() {
        // Cancel creating a new message, back to message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNewMessageClose', '@Start');

        this.newMessage = !this.newMessage;
    }

    clickNewMessageSave() {
        // create a new message, back to message
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNewMessageSave', '@Start');

        this.newMessage = !this.newMessage;
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateMessagesClosed.emit(action);
    }
}
