/*
 * Shows form with all system generated messages for the current user
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
import { StatusBarMessage }           from './models';

@Component({
    selector: 'collaborate-system-messages',
    templateUrl: './collaborate.systemMessages.component.html',
    styleUrls: ['./collaborate.systemMessages.component.css']
})
export class CollaborateSystemMessagesComponent implements OnInit {

    @Output() formCollaborateSystemMessagesClosed: EventEmitter<string> = new EventEmitter();

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

    errorMessage: string = '';
    statusBarMessages: StatusBarMessage[];
    selectedRow: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource(
            'statusBarMessageLogs', 
            '?filterObject={"userID":"' + this.globalVariableService.currentUser.userID + '"}'
        ).then (sbm => {

            // Set the data for the grid
            this.statusBarMessages = sbm.slice(100);

        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Collaborate.systemMessages reading statusBarMessageLogs: ' + err)
        });

    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateSystemMessagesClosed.emit(action);
    }
}
