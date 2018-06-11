/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';


@Component({ 
    selector: 'data-connection',
    templateUrl: './data.connection.component.html',
    styleUrls:  ['./data.connection.component.css']
})
export class DataConnectionComponent implements OnInit {

    @Output() formDataConnectionClosed: EventEmitter<string> = new EventEmitter();

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

    adding: boolean = false;
    dataConnections: DataConnection[];
    editing: boolean = false;
    errorMessage: string = "";
    selectedConnection: DataConnection;
    selectedConnectionRowIndex: number = 0;

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDataConnection().then(dc => {
            this.dataConnections = dc.slice();
        });
    }

    clickSelectedDataConnection(index: number, id: number) {
        // Clicked a Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataConnection', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedConnectionRowIndex = index;
    }
    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        console.warn('xx selD Sch', this.selectedConnection)
        // Set the row index
        this.selectedConnectionRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.scheduleID = id;
        this.errorMessage = '';

        // Fill the form
        let connectionIndex: number = this.globalVariableService.dataConnections
            .findIndex(sch => sch.id == id);
        if (connectionIndex >= 0) {
            this.selectedConnection = Object.assign({}, 
                this.globalVariableService.dataConnections[connectionIndex]
            );
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedConnection = {
            id: null,
            connectionName: '',
            serverType: '',
            serverName: '',
            authentication: '',
            description: ''
        };
    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataConnectionClosed.emit(action);

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
            .findIndex(sch => sch.id == this.selectedDashboardSchedule.id);
        if (dashboardScheduleIndex >= 0) {
            this.selectedDashboardSchedule = Object.assign({}, 
                this.currentDashboardSchedules[dashboardScheduleIndex]
            );
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

        if (this.selectedDashboardSchedule.startsOn == null
            ||
            this.selectedDashboardSchedule.startsOn == '') {
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
                    this.selectedDashboardSchedule.endsOn == '')
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
            // this.currentDashboardSchedules.push(this.selectedDashboardSchedules);
            this.selectedDashboardSchedule.id = null;
            this.selectedDashboardSchedule.dashboardID = 
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.globalVariableService.addDashboardSchedule(this.selectedDashboardSchedule).then(
                res => {
                    if (this.selectedRow == null) {
                        this.selectedRow = 0;
                        this.scheduleID = this.selectedDashboardSchedule.id;
                        console.warn('xx hier')
                    };
                            
                }
            );
        };

        // Save the changes
        if (this.editing) {
            let dashboardScheduleIndex: number = this.currentDashboardSchedules
                .findIndex(sch => sch.id == this.selectedDashboardSchedule.id);
            if (dashboardScheduleIndex >= 0) {
                this.currentDashboardSchedules[dashboardScheduleIndex] = 
                    Object.assign({}, this.selectedDashboardSchedule);
            };
            this.globalVariableService.saveDashboardSchedule(this.selectedDashboardSchedule)
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

    clickDelete(index: number, id: number) {
        // Delete a Schedule
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.clearRecord();
        this.globalVariableService.deleteDashboardSchedule(id).then(res => {
            this.currentDashboardSchedules = this.globalVariableService.currentDashboardSchedules
        });

        this.selectedRow = null;
        this.scheduleID = null;
    }
}


