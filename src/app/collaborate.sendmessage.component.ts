/*
 * Shows form to send Canvas messages
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
import { CanvasMessage }              from './models';

@Component({
    selector: 'collaborate-sendmessage',
    templateUrl: './collaborate.sendmessage.component.html',
    styleUrls: ['./collaborate.sendmessage.component.css']
})
export class CollaborateSendMessageComponent implements OnInit {

    @Output() formDashboardSendMessage: EventEmitter<string> = new EventEmitter();
    @Input() messageAction: string;
    @Input() existingMessagge: CanvasMessage;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Enter'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

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

        this.formDashboardSendMessage.emit(action);
    }

}
