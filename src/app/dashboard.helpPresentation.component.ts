/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models

@Component({
    selector: 'dashboard-helpPresentation',
    templateUrl: './dashboard.helpPresentation.component.html',
    styleUrls: ['./dashboard.helpPresentation.component.css']
})
export class DashboardHelpPresentationComponent implements OnInit {

    @Output() formDashboardHelpPresentationClosed: EventEmitter<string> = new EventEmitter();
    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardHelpPresentationClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboard.next(false);
		this.formDashboardHelpPresentationClosed.emit();
    }
}
