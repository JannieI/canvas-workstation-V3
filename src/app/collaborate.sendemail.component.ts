/*
 * Shows form to send an email
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
 
@Component({
    selector: 'collaborate-sendemail',
    templateUrl: './collaborate.sendemail.component.html',
    styleUrls: ['./collaborate.sendemail.component.css']
})
export class CollaborateSendEmailComponent implements OnInit {

    @Output() formDashboardSendEmailClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if ( 
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&  
            (!event.ctrlKey)  
            &&  
            (!event.shiftKey) 
           ) {
            this.clickSave('Saved');
            return;
        };

    }

    toUsers: string;
    toGroups: string;
    subject: string;
    body: string;
    linked: boolean;

    
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
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardSendEmailClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

		this.formDashboardSendEmailClosed.emit(action);
    }

}
