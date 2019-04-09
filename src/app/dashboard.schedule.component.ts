/*
 * Shows all Schedules in the system
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
import { DashboardSchedule }          from './models';

@Component({
    selector: 'dashboard-schedule',
    templateUrl: './dashboard.schedule.component.html',
    styleUrls: ['./dashboard.schedule.component.css']
})
export class DashboardScheduleComponent implements OnInit {

    @Output() formDashboardScheduleClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    dashboardSchedules: DashboardSchedule[];
    errorMessage: string = '';
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('dashboardSchedules',
            '?filterObject={"dashboardID": ' +
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID + '}'
            )
            .then(i => this.dashboardSchedules = i)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.schedule reading dashboardSchedules: ' + err);
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardScheduleClosed.emit(action);
    }
  
    clickRow(index: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }    
}
