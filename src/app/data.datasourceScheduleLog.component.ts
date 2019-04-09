/*
 * Shows all Schedule Logs in the system
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
import { DatasourceScheduleLog }      from './models';

@Component({
    selector: 'data-datasourceSchedule-log',
    templateUrl: './data.datasourceScheduleLog.component.html',
    styleUrls: ['./data.datasourceScheduleLog.component.css']
})
export class DataDatasourceScheduleLogComponent implements OnInit {

    @Output() formDataDatasourceScheduleLogClosed: EventEmitter<string> = new EventEmitter();

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

    datasourceScheduleLogs: DatasourceScheduleLog[];
    errorMessage: string = '';
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('datasourceScheduleLogs')
            .then(data => this.datasourceScheduleLogs = data)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.schedules reading datasourceScheduleLogs: ' + err);
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataDatasourceScheduleLogClosed.emit(action);
    }
  
    clickRow(index: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }    
}
