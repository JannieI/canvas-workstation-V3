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
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'dashboard-save',
    templateUrl: './dashboard.save.component.html',
    styleUrls: ['./dashboard.save.component.css']
})
export class DashboardSaveComponent implements OnInit {

    @Output() formDashboardSaveClosed: EventEmitter<string> = new EventEmitter();

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

    isFirstTimeDashboardSave: boolean;
    dashboards: Dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
        this.globalVariableService.isFirstTimeDashboardSave.subscribe(
            i => this.isFirstTimeDashboardSave = i
        )
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.isFirstTimeDashboardSave.unsubscribe();
    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSaveClosed.emit(action);
    }

    clickSave() {
        // Save the D (replace the original as Completed and delete the Draft)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Change the State to completed
        // let dashboardIndex: number = this.globalVariableService.currentDashboards.findIndex(
        //     d => d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        // );
        // if (dashboardIndex >= 0) {
        //     let localDashboard: Dashboard = this.globalVariableService.currentDashboards[
        //         dashboardIndex
        //     ];

        //     // Delete the original D, and reset
        //     if (localDashboard.originalID != null) {
        //         this.globalVariableService.deleteDashboard(localDashboard.originalID);
        //         localDashboard.originalID = null;
        //     };

        //     localDashboard.draftID = null;
        //     localDashboard.state = 'Complete';
        //     this.globalVariableService.saveDashboard(localDashboard);
        // };

        this.globalVariableService.saveDraftDashboard().then(res => {
            this.globalVariableService.refreshCurrentDashboard(
                'discardDashboard-clickDiscard', res, -1, ''
            );
            this.globalVariableService.editMode.next(false);
            this.formDashboardSaveClosed.emit('Saved');
        });

    }
}
