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
