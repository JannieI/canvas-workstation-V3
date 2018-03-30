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

@Component({
    selector: 'dashboard-discard',
    templateUrl: './dashboard.discard.component.html',
    styleUrls: ['./dashboard.discard.component.css']
})
export class DashboardDiscardComponent implements OnInit {

    @Output() formDashboardDiscardClosed: EventEmitter<string> = new EventEmitter();

    isFirstTimeDashboardDiscard: boolean;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.globalVariableService.isFirstTimeDashboardDiscard.subscribe(
            i => this.isFirstTimeDashboardDiscard = i
        )
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component. 
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.isFirstTimeDashboardDiscard.unsubscribe();
    }
    
    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardDiscardClosed.emit(action);
    }

    clickDiscard(action: string) {
        this.globalVariableService.editMode.next(false);
		this.formDashboardDiscardClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboardDiscard.next(false);
    }
}
