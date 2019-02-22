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
import { GlobalVariableService }      from './global-variable.service';

// Other
import { Subscription }               from 'rxjs';



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
        if ( 
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&  
            (!event.ctrlKey)  
            &&  
            (!event.shiftKey) 
           ) {
            this.clickDiscard('Discard');
            return;
        };

    }

    isFirstTimeDashboardDiscard: boolean;
    isFirstTimeDashboardDiscardSubscription: Subscription;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.isFirstTimeDashboardDiscardSubscription = 
            this.globalVariableService.isFirstTimeDashboardDiscard.subscribe(
               i => this.isFirstTimeDashboardDiscard = i
        )
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component. 
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.isFirstTimeDashboardDiscardSubscription.unsubscribe();
    }
    
    clickClose(action: string) {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDiscardClosed.emit(action);
    }

    clickDiscard(action: string) {
        // Delete the current D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDiscard', '@Start');

        this.globalVariableService.discardDashboard()
            .then(dashboardOrignal => {

                // Navigate to original
                console.log('xx DISCARD dashboardOrignal', dashboardOrignal)
                this.globalVariableService.refreshCurrentDashboard(
                    'discardDashboard-clickDiscard', +dashboardOrignal, -1, ''
                );
                // this.globalVariableService.editMode.next(false);
                this.formDashboardDiscardClosed.emit(action); 
            })
            .catch(err => {
                    alert ('Error encountered with delete in discardDashboard: ' + err);
            })
    }

}
