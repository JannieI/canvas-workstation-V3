/*
 * Manages Schedules for the current D
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
import { DashboardSchedule }          from './models';

@Component({
    selector: 'dashboard-scheduleEdit',
    templateUrl: './dashboard.scheduleEdit.component.html',
    styleUrls: ['./dashboard.scheduleEdit.component.css']
})
export class DashboardScheduleEditComponent implements OnInit {

    @Output() formDashboardScheduleEditClosed: EventEmitter<string> = new EventEmitter();

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
               if (this.editing) {
                   this.clickSave();
               } else {
                   this.clickAdd();
               };
            return;
        };

    }

    currentDashboardSchedules: DashboardSchedule[];
    dashboardName: string = 'Test Db';
    dashboardStatus: string = 'AlmostCompleted';
    editing: boolean = false;
    scheduleID: number = null;
    selectedRow: number = null;
    selectedDashboardSchedules: DashboardSchedule = null;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCurrentDashboardSchedules(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID).then
              (i => this.currentDashboardSchedules = i);
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedRow = index;
        this.editing = false;
        this.scheduleID = id;
        
        // Fill the form

        
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardScheduleEditClosed.emit(action);
    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
    }

    clickSave() {
        // Save changes to a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.editing = false;
        
    }

    clickEdit() {
        // Start editing selected Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        this.editing = true;
        
    }
    
    clickAdd() {
        // Add a new Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.editing = false;

    }
}
