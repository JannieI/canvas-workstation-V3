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
import { dashboard }                  from './models';

@Component({
    selector: 'dashboard-discard',
    templateUrl: './dashboard.discard.component.html',
    styleUrls: ['./dashboard.discard.component.css']
})
export class DashboardDiscardComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardDiscardClosed: EventEmitter<string> = new EventEmitter();

    isFirstTimeDashboardDiscard: boolean;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDashboardDiscard.subscribe(
            i => this.isFirstTimeDashboardDiscard = i
        )
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardDiscardClosed.emit(action);
    }

    clickSaveFile() {
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboardDiscard.next(false);
    }
}
