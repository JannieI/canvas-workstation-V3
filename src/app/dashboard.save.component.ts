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
import { Dashboard }                  from './models';

// Other
import { Subscription }               from 'rxjs';

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
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            && 
            (!event.shiftKey)
           ) {
            this.clickSave();
            return;
        };

    }

    deleteSnapshots: boolean = true;
    errorMessage: string = '';
    isFirstTimeDashboardSave: boolean;
    qaRequired: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSaveClosed.emit(action);
    }

    clickSave() {
        // Save the D (replace the original as Completed and delete the Draft)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.saveDraftDashboard(this.deleteSnapshots)
            .then(res => {
                this.globalVariableService.refreshCurrentDashboard(
                    'saveDraftDashboard-clickSave', res, -1, ''
                );
                this.formDashboardSaveClosed.emit('Saved');
            })
            .catch(err => {
                console.error('Error in Dashboard.saveDraft saving Draft dashboard: ' + err)
                this.errorMessage = err.slice(0, 100);
            });

    }
}
