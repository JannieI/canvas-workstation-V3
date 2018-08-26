/*
 * Visualise page, to view / present Dashboards previously created
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
    selector: 'dashboard-help',
    templateUrl: './dashboard.help.component.html',
    styleUrls: ['./dashboard.help.component.css']
})
export class DashboardHelpComponent implements OnInit {

    @Output() formDashboardHelpClosed: EventEmitter<string> = new EventEmitter();

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

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardHelpClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.updateCurrentUserProperties({isFirstTimeUser: false});
        // this.globalVariableService.currentUser.isFirstTimeUser = false;
		this.formDashboardHelpClosed.emit('GotIt');
    }
}
