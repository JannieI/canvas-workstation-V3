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

        console.warn('xx selD Sch', this.selectedDashboardSchedule)
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
            this.selectedDashboardSchedule = Object.assign({}, 
                this.globalVariableService.dashboardSchedules[dashboardScheduleIndex]
            );
        };

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataConnectionClosed.emit(action);

    }

}


