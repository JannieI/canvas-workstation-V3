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

    adding: boolean = false;
    currentDashboardSchedules: DashboardSchedule[] = [];
    dashboardName: string = '';
    dashboardState: string = '';
    editing: boolean = false;
    errorMessage: string = '';
    scheduleID: number = null;
    selectedRow: number = null;
    selectedDashboardSchedules: DashboardSchedule;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        let dashboard: Dashboard = this.globalVariableService.letDashboard(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        this.dashboardName = dashboard.name;
        this.dashboardState = dashboard.state;
        this.clearRecord();

        this.globalVariableService.getCurrentDashboardSchedules(
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID).then
              (i => {
                  this.currentDashboardSchedules = i;
                  if (this.currentDashboardSchedules.length > 0) {
                    this.clickRow(0, this.currentDashboardSchedules[0].id);
                  };
              });
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedRow = index;
        this.adding = false;
        this.editing = false;
        this.scheduleID = id;
        this.errorMessage = '';

        // Fill the form
        let dashboardScheduleIndex: number = this.globalVariableService.dashboardSchedules
            .findIndex(sch => sch.id == id);
        if (dashboardScheduleIndex >= 0) {
            this.selectedDashboardSchedules = Object.assign({}, 
                this.globalVariableService.dashboardSchedules[dashboardScheduleIndex]
            );
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedDashboardSchedules = {
            id: null,
            dashboardID: null,
            datasourceID: null,
            name: null,
            description: null,
            repeatFrequency: null,
            repeatsEvery: null,
            weeklyMonday: false,
            weeklyTuesday: false,
            weeklyWednesday: false,
            weeklyThursday: false,
            weeklyFriday: false,
            weeklySaturday: false,
            weeklySunday: false,
            monthlyOn: 0,
            yearlyJanuary: false,
            yearlyFebruary: false,
            yearlyMarch: false,
            yearlyApril: false,
            yearlyMay: false,
            yearlyJune: false,
            yearlyJuly: false,
            yearlyAugust: false,
            yearlySeptember: false,
            yearlyOctober: false,
            yearlyNovember: false,
            yearlyDecember: false,
            startsOn: null,
            endsNever: false,
            endsAfter: 0,
            endsOn: null
        };
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
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedRow, this.scheduleID);
        
        // Re Fill the form
        let dashboardScheduleIndex: number = this.currentDashboardSchedules
            .findIndex(sch => sch.id == this.selectedDashboardSchedules.id);
        if (dashboardScheduleIndex >= 0) {
            this.selectedDashboardSchedules = Object.assign({}, 
                this.currentDashboardSchedules[dashboardScheduleIndex]
            );
        };
    }

    clickSave() {
        // Save changes to a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDashboardSchedules.repeatFrequency == null
            ||
            this.selectedDashboardSchedules.repeatFrequency == '') {
                this.errorMessage = 'Select a Frequency';
                return;
        };

        if (this.selectedDashboardSchedules.repeatsEvery == null
            ||
            this.selectedDashboardSchedules.repeatsEvery == 0) {
                this.errorMessage = 'Fill in Every ';
                return;
        };

        if (this.selectedDashboardSchedules.repeatFrequency == 'Weekly') {
            if (!this.selectedDashboardSchedules.weeklyMonday
                &&
                !this.selectedDashboardSchedules.weeklyTuesday
                &&
                !this.selectedDashboardSchedules.weeklyWednesday
                &&
                !this.selectedDashboardSchedules.weeklyThursday
                &&
                !this.selectedDashboardSchedules.weeklyFriday
                &&
                !this.selectedDashboardSchedules.weeklySaturday
                &&
                !this.selectedDashboardSchedules.weeklySunday) {
                    this.errorMessage = 'Chose at least one weekday';
                    return;
            };
        };

        if (this.selectedDashboardSchedules.repeatFrequency == 'Monthly') {
            if (this.selectedDashboardSchedules.monthlyOn == 0
            ||
            this.selectedDashboardSchedules.monthlyOn == null) {
                this.errorMessage = 'Fill in day of month';
                return;
            };
        };

        if (this.selectedDashboardSchedules.repeatFrequency == 'Yearly') {
            if (!this.selectedDashboardSchedules.yearlyJanuary
                &&
                !this.selectedDashboardSchedules.yearlyFebruary
                &&
                !this.selectedDashboardSchedules.yearlyMarch
                &&
                !this.selectedDashboardSchedules.yearlyApril
                &&
                !this.selectedDashboardSchedules.yearlyMay
                &&
                !this.selectedDashboardSchedules.yearlyJune
                &&
                !this.selectedDashboardSchedules.yearlyJuly
                &&
                !this.selectedDashboardSchedules.yearlyAugust
                &&
                !this.selectedDashboardSchedules.yearlySeptember
                &&
                !this.selectedDashboardSchedules.yearlyOctober
                &&
                !this.selectedDashboardSchedules.yearlyNovember
                &&
                !this.selectedDashboardSchedules.yearlyDecember) {
                    this.errorMessage = 'Check a month';
                    return;
            };
        };

        if (this.selectedDashboardSchedules.startsOn == null
            ||
            this.selectedDashboardSchedules.startsOn == '') {
                this.errorMessage = 'Enter start date';
                return;
        };

        if (!this.selectedDashboardSchedules.endsNever)
            if (
                    (this.selectedDashboardSchedules.endsAfter == null
                    ||
                    this.selectedDashboardSchedules.endsAfter == 0)
                &&
                    (this.selectedDashboardSchedules.endsOn == null
                    ||
                    this.selectedDashboardSchedules.endsOn == '')
                ) {
                this.errorMessage = 'Must end Never, On or After';
                return;
        };

        if (this.selectedDashboardSchedules.name == null
            ||
            this.selectedDashboardSchedules.name == '') {
                this.errorMessage = 'Enter a Schedule name';
                return;
        };

        // Add to local and DB
        if (this.adding) {
            // this.currentDashboardSchedules.push(this.selectedDashboardSchedules);
            this.selectedDashboardSchedules.id = null;
            this.selectedDashboardSchedules.dashboardID = 
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.globalVariableService.addDashboardSchedule(this.selectedDashboardSchedules).then(
                res => {
                    if (this.selectedRow == null) {
                        this.selectedRow = 0;
                        this.scheduleID = this.selectedDashboardSchedules.id;
                        console.warn('xx hier')
                    };
                            
                }
            );
        };

        // Save the changes
        if (this.editing) {
            let dashboardScheduleIndex: number = this.currentDashboardSchedules
                .findIndex(sch => sch.id == this.selectedDashboardSchedules.id);
            if (dashboardScheduleIndex >= 0) {
                this.currentDashboardSchedules[dashboardScheduleIndex] = 
                    Object.assign({}, this.selectedDashboardSchedules);
            };
            this.globalVariableService.saveDashboardSchedule(this.selectedDashboardSchedules)
        };

        // Reset
        this.editing = false;
        this.adding = false;

    }

    clickEdit() {
        // Start editing selected Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.currentDashboardSchedules.length > 0) {
            this.editing = true;
        };
        this.errorMessage = '';

    }

    clickAdd() {
        // Add a new Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.adding = true;
        this.editing = false;
        this.errorMessage = '';

    }
}
