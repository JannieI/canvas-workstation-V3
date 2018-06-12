/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { Widget }                     from './models';

interface localDatasources extends Datasource 
    {
        nrWidgets?: number;
    }

@Component({
    selector: 'data-editDatasource',
    templateUrl: './data.editDatasource.component.html',
    styleUrls:  ['./data.editDatasource.component.css']
})
export class DataEditDatasourceComponent implements OnInit {

    @Input() selectedDatasource: Datasource;
    
    @Output() formDataEditDatasourceClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

    datasources: localDatasources[];
    errorMessage: string = "";
    selectedRowIndex: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();

        // Count the Ws
        let widgets: Widget[];
        this.datasources.forEach(ds => {
            widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
            ds.nrWidgets = widgets.length;
        });
        console.warn('xx INIT this.selectedDatasource', this.selectedDatasource)

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        this.errorMessage = '';
    }

    clickClose() {
        // Close the form, no further action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataEditDatasourceClosed.emit('Close');

    }

    clickContinue() {
        // Close the form, and proceed to the relevant Edit DS form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        if (this.selectedRowIndex >= 0) {
            this.selectedDatasource = this.datasources[this.selectedRowIndex];
        console.warn('xx EDIT this.selectedDatasource', this.selectedDatasource)
            
            this.formDataEditDatasourceClosed.emit('Continue');
        } else {
            this.selectedDatasource = null;
            console.warn('xx NULL this.selectedDatasource', this.selectedDatasource)
            this.formDataEditDatasourceClosed.emit('Close');
        };


    }

}


