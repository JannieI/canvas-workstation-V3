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
import { Datasource }                  from './models';
import { DatasourceSchedule }          from './models';

@Component({
    selector: 'data-datasourceScheduleEdit',
    templateUrl: './data.datasourceScheduleEdit.component.html',
    styleUrls: ['./data.datasourceScheduleEdit.component.css']
})
export class DataDatasourceScheduleEditComponent implements OnInit {

    @Output() formDataDatasourceScheduleEditClosed: EventEmitter<string> = new EventEmitter();

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
    currentDatasourceSchedules: DatasourceSchedule[] = [];
    datasourceID: number;
    datasourceName: string = '';
    datasourceNames: string[] = [];
    editing: boolean = false;
    errorMessage: string = '';
    scheduleID: number = null;
    selectedRow: number = null;
    selectedDatasourceSchedule: DatasourceSchedule;
    selectedDatasource: string = '';


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get Datasource list
        this.globalVariableService.datasources.forEach(ds => {
            this.datasourceNames.push(ds.name + ' (' + ds.id + ')');
        });
        this.datasourceNames = this.datasourceNames.sort( (obj1,obj2) => {
            if (obj1 > obj2) {
                return 1;
            };
            if (obj1 < obj2) {
                return -1;
            };
            return 0;
        });

        let datasource: Datasource = this.globalVariableService.datasources[0];
        this.datasourceName = datasource.name;
        this.clearRecord();

        this.globalVariableService.getCurrentDatasourceSchedules().then
              (i => {
                  this.currentDatasourceSchedules = i;
                  if (this.currentDatasourceSchedules.length > 0) {
                    this.clickRow(0, this.currentDatasourceSchedules[0].id);
                  };
        });
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        console.warn('xx selD Sch', this.selectedDatasourceSchedule)
        // Set the row index
        this.selectedRow = index;
        this.adding = false;
        this.editing = false;
        this.scheduleID = id;
        this.errorMessage = '';

        // Fill the form
        let datasourceScheduleIndex: number = this.globalVariableService.datasourceSchedules
            .findIndex(sch => sch.id == id);
        if (datasourceScheduleIndex >= 0) {
            // this.selectedDatasourceSchedule = Object.assign({},
            //     this.globalVariableService.datasourceSchedules[datasourceScheduleIndex]
            // );
            this.selectedDatasourceSchedule = JSON.parse(JSON.stringify(
                this.globalVariableService.datasourceSchedules[datasourceScheduleIndex]
            ));

            let datasourceIndex: number = this.globalVariableService.datasources.findIndex(
                ds => ds.id == this.globalVariableService.datasourceSchedules[
                      datasourceScheduleIndex].datasourceID
            );

            if (datasourceIndex >= 0) {
                this.selectedDatasource = this.globalVariableService.datasources[datasourceIndex]
                    .name + ' (' + this.globalVariableService.datasources[datasourceIndex].id + ')';

            } else {
                this.selectedDatasource = '';
            };
        };
        console.warn('xx this selDS', this.selectedDatasource)

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedDatasourceSchedule = {
            id: null,
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
            endsOn: null,
            editedBy: null,
            editedOn: null,
            createdBy: null,
            createdOn: null

        };
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDataDatasourceScheduleEditClosed.emit(action);
    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedRow, this.scheduleID);

        // Re Fill the form
        let datasourceScheduleIndex: number = this.currentDatasourceSchedules
            .findIndex(sch => sch.id == this.selectedDatasourceSchedule.id);
        if (datasourceScheduleIndex >= 0) {
            // this.selectedDatasourceSchedule = Object.assign({},
            //     this.currentDatasourceSchedules[datasourceScheduleIndex]
            // );
            this.selectedDatasourceSchedule = JSON.parse(JSON.stringify(
                this.currentDatasourceSchedules[datasourceScheduleIndex]
            ));
        };

        // Reset
        this.selectedRow = null;
        this.scheduleID = null;
        this.selectedDatasource = '';

    }

    clickSave() {
        // Save changes to a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDatasource == null
            ||
            this.selectedDatasource == '') {
                this.errorMessage = 'Select a Datasource';
                return;
        };

        if (this.selectedDatasourceSchedule.repeatFrequency == null
            ||
            this.selectedDatasourceSchedule.repeatFrequency == '') {
                this.errorMessage = 'Select a Frequency';
                return;
        };

        if (this.selectedDatasourceSchedule.repeatsEvery == null
            ||
            this.selectedDatasourceSchedule.repeatsEvery == 0) {
                this.errorMessage = 'Fill in Every ';
                return;
        };

        if (this.selectedDatasourceSchedule.repeatFrequency == 'Weekly') {
            if (!this.selectedDatasourceSchedule.weeklyMonday
                &&
                !this.selectedDatasourceSchedule.weeklyTuesday
                &&
                !this.selectedDatasourceSchedule.weeklyWednesday
                &&
                !this.selectedDatasourceSchedule.weeklyThursday
                &&
                !this.selectedDatasourceSchedule.weeklyFriday
                &&
                !this.selectedDatasourceSchedule.weeklySaturday
                &&
                !this.selectedDatasourceSchedule.weeklySunday) {
                    this.errorMessage = 'Chose at least one weekday';
                    return;
            };
        };

        if (this.selectedDatasourceSchedule.repeatFrequency == 'Monthly') {
            if (this.selectedDatasourceSchedule.monthlyOn == 0
            ||
            this.selectedDatasourceSchedule.monthlyOn == null) {
                this.errorMessage = 'Fill in day of month';
                return;
            };
        };

        if (this.selectedDatasourceSchedule.repeatFrequency == 'Yearly') {
            if (!this.selectedDatasourceSchedule.yearlyJanuary
                &&
                !this.selectedDatasourceSchedule.yearlyFebruary
                &&
                !this.selectedDatasourceSchedule.yearlyMarch
                &&
                !this.selectedDatasourceSchedule.yearlyApril
                &&
                !this.selectedDatasourceSchedule.yearlyMay
                &&
                !this.selectedDatasourceSchedule.yearlyJune
                &&
                !this.selectedDatasourceSchedule.yearlyJuly
                &&
                !this.selectedDatasourceSchedule.yearlyAugust
                &&
                !this.selectedDatasourceSchedule.yearlySeptember
                &&
                !this.selectedDatasourceSchedule.yearlyOctober
                &&
                !this.selectedDatasourceSchedule.yearlyNovember
                &&
                !this.selectedDatasourceSchedule.yearlyDecember) {
                    this.errorMessage = 'Check a month';
                    return;
            };
        };

        if (this.selectedDatasourceSchedule.startsOn == null) {
                this.errorMessage = 'Enter start date';
                return;
        };

        if (!this.selectedDatasourceSchedule.endsNever)
            if (
                    (this.selectedDatasourceSchedule.endsAfter == null
                    ||
                    this.selectedDatasourceSchedule.endsAfter == 0)
                &&
                    (this.selectedDatasourceSchedule.endsOn == null
                    ||
                    this.selectedDatasourceSchedule.endsOn == null)
                ) {
                this.errorMessage = 'Must end Never, On or After';
                return;
        };

        if (this.selectedDatasourceSchedule.name == null
            ||
            this.selectedDatasourceSchedule.name == '') {
                this.errorMessage = 'Enter a Schedule name';
                return;
        };

        let index: number = this.selectedDatasource.indexOf(' (');
        if (index >= 0) {
            this.datasourceName = this.selectedDatasource.substring(0, index);
            this.datasourceID = +this.selectedDatasource.substring(
                index + 2, this.selectedDatasource.length - 1
            );
        };
        this.selectedDatasourceSchedule.datasourceID = this.datasourceID;
        console.warn('xx this.datasourceID', this.datasourceID)
        // Add to local and DB
        if (this.adding) {
            // this.currentDatasourceSchedules.push(this.selectedDatasourceSchedules);
            this.selectedDatasourceSchedule.id = null;
            this.globalVariableService.addDatasourceSchedule(this.selectedDatasourceSchedule).then(
                res => {
                    if (this.selectedRow == null) {
                        this.selectedRow = 0;
                        this.scheduleID = this.selectedDatasourceSchedule.id;
                    };

                }
            );
        };

        // Save the changes
        if (this.editing) {
            let datasourceScheduleIndex: number = this.currentDatasourceSchedules
                .findIndex(sch => sch.id == this.selectedDatasourceSchedule.id);
            if (datasourceScheduleIndex >= 0) {
                // this.currentDatasourceSchedules[datasourceScheduleIndex] =
                //     Object.assign({}, this.selectedDatasourceSchedule);
                this.currentDatasourceSchedules[datasourceScheduleIndex] =
                    JSON.parse(JSON.stringify(this.selectedDatasourceSchedule));
            };
            this.globalVariableService.saveDatasourceSchedule(this.selectedDatasourceSchedule)
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

        if (this.currentDatasourceSchedules.length > 0) {
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
        this.globalVariableService.deleteDashboardSchedule(id).then(res => {
            this.currentDatasourceSchedules = this.globalVariableService.currentDatasourceSchedules
        });

        this.selectedRow = null;
        this.scheduleID = null;
    }
}
