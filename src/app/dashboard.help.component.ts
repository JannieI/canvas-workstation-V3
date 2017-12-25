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
    selector: 'dashboard-help',
    templateUrl: './dashboard.help.component.html',
    styleUrls: ['./dashboard.help.component.css']
})
export class DashboardHelpComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardHelpClosed: EventEmitter<string> = new EventEmitter();

    isFirstTimeDashboardHelp: boolean;
    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.globalVariableService.isFirstTimeDashboardHelp.subscribe(
            i => this.isFirstTimeDashboardHelp = i
        )
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardHelpClosed.emit(action);
    }

    clickHelp(action: string) {
        this.globalVariableService.editMode.next(false);        
		this.formDashboardHelpClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboardHelp.next(false);
    }
}
