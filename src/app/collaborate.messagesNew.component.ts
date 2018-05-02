/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasMessageNew }           from './models';
import { DatagridInput }              from './models';

@Component({
    selector: 'collaborate-messagesNew',
    templateUrl: './collaborate.messagesNew.component.html',
    styleUrls: ['./collaborate.messagesNew.component.css']
})
export class CollaborateMessagesComponentNew implements OnInit {

    @Output() formCollaborateMessagesClosed: EventEmitter<string> = new EventEmitter();

    canvasMessagesNew: CanvasMessageNew[] = [];
    filterOn: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // TODO - fix once working
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'JannieI',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'Review of upcoming budget',
                body: 'Please review and add missing logistics figures',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: false,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew[0].recipients.push( 
            {
                userID: 'MeganP',
                readOn: '2017/01/01'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'VivK',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'New model',
                body: 'I have added the transport costs to the new model, but it skews the figures as we now have once-off tonage included for March.  I suggest we leave it out, and just add an annotation.  Let me know by close today so that I can make any adjustmensts prior to our 9 oclock tomorrow...',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'JohnatanB',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'Review of upcoming budget',
                body: 'Pam, please action',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'OxleyA',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'Staff turnover looks too high',
                body: 'Mary, the staff turnover figures for August looks very high, particularly as compared to last year.  At the previous Exco we have discussed the downwards trend.  Can Jerry please review the first graph and let me know.  Oxley',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'PamH',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'Review of upcoming budget',
                body: 'Hi Johno, I have reviewed the logistics figures are actually included.  It is lower because of the industrial action and holidays.  Also, two b-liners were in for repars.',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'BiancaC',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'New model',
                body: 'Agreed, lets leave it out',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        this.canvasMessagesNew.push(
            {
                id: 1,
                threadID: 1,
                sender: 'BiancaC',
                sentOn: '2017/01/01',
                recipients: [
                    {
                        userID: 'SamH',
                        readOn: null
                    }
                ],
                toGroups: [],
                subject: 'New model',
                body: 'Viv, I spotted another issue: the alignment of the top graphs on the last tab is off.  Also, please resize the logo proportionally.  And print a copy for Dough; he will arrive just before the meeting',
                dashboardID: 1,
                dashboardTabID: 1,
                url: '',
                iHaveReadThis: true,
                dashboardName: 'Economic Review'
            }
        );
        
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateMessagesClosed.emit(action);
    }
}
