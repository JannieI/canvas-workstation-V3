/*
 * Manages Schedules for the current D
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
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardName: string = '';
    dashboardState: string = '';
    editing: boolean = false;
    errorMessage: string = '';
    message: string = '';
    scheduleID: number = null;
    selectedRow: number = null;
    selectedDashboardSchedule: DashboardSchedule;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        let dashboardIndex = this.globalVariableService.currentDashboards.findIndex(
            cd => cd. id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
        );
        if (dashboardIndex >= 0) {
            this.dashboardName = this.globalVariableService.currentDashboards[dashboardIndex].name;
            this.dashboardState = this.globalVariableService.currentDashboards[dashboardIndex].state;
        };
        this.clearRecord();

        this.globalVariableService.getResource('dashboardSchedules',
            '?filterObject={"dashboardID": ' +
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID + '}'
            ).then
              (i => {
                  this.dashboardSchedules = i;
                  if (this.dashboardSchedules.length > 0) {
                    this.clickRow(0, this.dashboardSchedules[0].id);
                  };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.scheduleEdit reading dashboardSchedules: ' + err);
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
        let dashboardScheduleIndex: number = this.dashboardSchedules
            .findIndex(sch => sch.id == id);
        if (dashboardScheduleIndex >= 0) {
            this.selectedDashboardSchedule = JSON.parse(JSON.stringify(
                this.dashboardSchedules[dashboardScheduleIndex]
            ));
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedDashboardSchedule = {
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
        let dashboardScheduleIndex: number = this.dashboardSchedules
            .findIndex(sch => sch.id == this.selectedDashboardSchedule.id);
        if (dashboardScheduleIndex >= 0) {
            this.selectedDashboardSchedule = JSON.parse(JSON.stringify(
                this.dashboardSchedules[dashboardScheduleIndex]
            ));
        };

        // Reset
        this.selectedRow = null;
        this.scheduleID = null;

    }

    clickSave() {
        // Save changes to a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDashboardSchedule.repeatFrequency == null
            ||
            this.selectedDashboardSchedule.repeatFrequency == '') {
                this.errorMessage = 'Select a Frequency';
                return;
        };

        if (this.selectedDashboardSchedule.repeatsEvery == null
            ||
            this.selectedDashboardSchedule.repeatsEvery == 0) {
                this.errorMessage = 'Fill in Every ';
                return;
        };

        if (this.selectedDashboardSchedule.repeatFrequency == 'Weekly') {
            if (!this.selectedDashboardSchedule.weeklyMonday
                &&
                !this.selectedDashboardSchedule.weeklyTuesday
                &&
                !this.selectedDashboardSchedule.weeklyWednesday
                &&
                !this.selectedDashboardSchedule.weeklyThursday
                &&
                !this.selectedDashboardSchedule.weeklyFriday
                &&
                !this.selectedDashboardSchedule.weeklySaturday
                &&
                !this.selectedDashboardSchedule.weeklySunday) {
                    this.errorMessage = 'Chose at least one weekday';
                    return;
            };
        };

        if (this.selectedDashboardSchedule.repeatFrequency == 'Monthly') {
            if (this.selectedDashboardSchedule.monthlyOn == 0
            ||
            this.selectedDashboardSchedule.monthlyOn == null) {
                this.errorMessage = 'Fill in day of month';
                return;
            };
        };

        if (this.selectedDashboardSchedule.repeatFrequency == 'Yearly') {
            if (!this.selectedDashboardSchedule.yearlyJanuary
                &&
                !this.selectedDashboardSchedule.yearlyFebruary
                &&
                !this.selectedDashboardSchedule.yearlyMarch
                &&
                !this.selectedDashboardSchedule.yearlyApril
                &&
                !this.selectedDashboardSchedule.yearlyMay
                &&
                !this.selectedDashboardSchedule.yearlyJune
                &&
                !this.selectedDashboardSchedule.yearlyJuly
                &&
                !this.selectedDashboardSchedule.yearlyAugust
                &&
                !this.selectedDashboardSchedule.yearlySeptember
                &&
                !this.selectedDashboardSchedule.yearlyOctober
                &&
                !this.selectedDashboardSchedule.yearlyNovember
                &&
                !this.selectedDashboardSchedule.yearlyDecember) {
                    this.errorMessage = 'Check a month';
                    return;
            };
        };

        if (this.selectedDashboardSchedule.startsOn == null) {
                this.errorMessage = 'Enter start date';
                return;
        };

        if (!this.selectedDashboardSchedule.endsNever)
            if (
                    (this.selectedDashboardSchedule.endsAfter == null
                    ||
                    this.selectedDashboardSchedule.endsAfter == 0)
                &&
                    (this.selectedDashboardSchedule.endsOn == null
                    ||
                    this.selectedDashboardSchedule.endsOn == null)
                ) {
                this.errorMessage = 'Must end Never, On or After';
                return;
        };

        if (this.selectedDashboardSchedule.name == null
            ||
            this.selectedDashboardSchedule.name == '') {
                this.errorMessage = 'Enter a Schedule name';
                return;
        };

        // Add to local and DB
        if (this.adding) {
            this.selectedDashboardSchedule._id = null;
            this.selectedDashboardSchedule.id = null;
            this.selectedDashboardSchedule.dashboardID =
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID;

            // Omit _id (immutable in Mongo)
            const copyData = { ...this.selectedDashboardSchedule };
            delete copyData._id;

            this.globalVariableService.addResource('dashboardSchedules', copyData)
                .then(res => {
                    if (this.selectedRow == null) {
                        this.selectedRow = 0;
                        this.scheduleID = this.selectedDashboardSchedule.id;
                    };
                    this.dashboardSchedules.push(res);
                    this.message = 'Added Schedule';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Dashboard.scheduleEdit adding dashboardSchedules: ' + err);
                });
            };

        // Save the changes
        if (this.editing) {
            let dashboardScheduleIndex: number = this.dashboardSchedules
                .findIndex(sch => sch.id == this.selectedDashboardSchedule.id);
            if (dashboardScheduleIndex >= 0) {
                this.dashboardSchedules[dashboardScheduleIndex] =
                    JSON.parse(JSON.stringify(this.selectedDashboardSchedule));
            };
            this.globalVariableService.saveResource('dashboardSchedules', this.selectedDashboardSchedule)
                .then(res => this.message = 'Saved Schedule')
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Dashboard.scheduleEdit savding dashboardSchedules: ' + err);
                });
            };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedRow = null;
        this.scheduleID = null;

    }

    clickEdit() {
        // Start editing selected Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.dashboardSchedules.length > 0) {
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

    clickDelete(index: number, id: number) {
        // Delete a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.clearRecord();
        this.globalVariableService.deleteResource('dashboardSchedules', id)
            .then(res => {
                this.dashboardSchedules = this.dashboardSchedules.filter(
                    sch => sch.id != id);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.scheduleEdit deleting dashboardSchedules: ' + err);
            });

        this.selectedRow = null;
        this.scheduleID = null;
    }
}
