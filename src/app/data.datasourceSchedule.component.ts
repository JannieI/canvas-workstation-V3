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
import { Datasource }                 from './models';
import { DatasourceSchedule }         from './models';

@Component({
    selector: 'data-datasourceSchedule',
    templateUrl: './data.datasourceSchedule.component.html',
    styleUrls: ['./data.datasourceSchedule.component.css']
})
export class DataDatasourceScheduleComponent implements OnInit {

    @Output() formDataDatasourceScheduleClosed: EventEmitter<string> = new EventEmitter();

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

    datasourceSchedules: DatasourceSchedule[];
    datasources: Datasource[];
    errorMessage: string = '';
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('datasources')
            .then(data => this.datasources = data)
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Datasource.schedules reading datasources: ' + err);
            });
        this.globalVariableService.getResource('datasourceSchedules')
            .then(data => this.datasourceSchedules = data)
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Datasource.schedules reading datasourceSchedules: ' + err);
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataDatasourceScheduleClosed.emit(action);
    }
  
    clickRow(index: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }    
}
