/*
 * Visualise page, to view / present Dashboards previously created
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
import { GlobalVariableService }      from './global-variable.service';

// Models
import { Dashboard }                  from './models';


@Component({
    selector: 'dashboard-discard',
    templateUrl: './dashboard.discard.component.html',
    styleUrls: ['./dashboard.discard.component.css']
})
export class DashboardDiscardComponent implements OnInit {

    @Output() formDashboardDiscardClosed: EventEmitter<string> = new EventEmitter();

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

    isFirstTimeDashboardDiscard: boolean;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDiscardClosed.emit(action);
    }

    clickDiscard(action: string) {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDiscard', '@Start');

        // Get info on D
        let dashboardIndex: number = this.globalVariableService.dashboards.findIndex(
            d => d.id ==
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        if (dashboardIndex >= 0) {
            let dashboard: Dashboard = this.globalVariableService.dashboards[dashboardIndex];
            let originalID: number = dashboard.originalID;










            // Delete the current Draft
            this.globalVariableService.deleteDashboardInfo(dashboard.id);
            // Change the original
            let dashboardOrignalIndex: number = this.globalVariableService.dashboards
                .findIndex(d => d.id ==originalID);
            if (dashboardOrignalIndex < 0) {
                alert('Serious error in dashboard.discard-clickDiscard: cannot find original ID in gv.dashboards')
                return;
            };
            let dashboardOrignal: Dashboard = this.globalVariableService.dashboards[
                dashboardOrignalIndex];
            dashboardOrignal.draftID = null;

            this.globalVariableService.saveDashboard(dashboardOrignal).then(resOriginal =>
            {
                // Navigate to original
                this.globalVariableService.refreshCurrentDashboard(
                    'discardDashboard-clickDiscard', dashboardOrignal.id, -1, ''
                );
                this.globalVariableService.editMode.next(false);
                this.formDashboardDiscardClosed.emit(action); 

            });

        } else {
            alert('Serious error in dashboard.discard-clickDiscard: cannot find gv D-id in gv.dashboards')
            return;
        };

    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboardDiscard.next(false);
    }
}
