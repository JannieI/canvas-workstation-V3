/*
 * Manage (add, edit, delete) Transformations for a Datasource.
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
import { Datasource }                 from './models';
import { Widget }                     from './models';


@Component({
    selector: 'data-deleteDatasource',
    templateUrl: './data.deleteDatasource.component.html',
    styleUrls:  ['./data.deleteDatasource.component.css']
})
export class DataDeleteDatasourceComponent implements OnInit {

    @Output() formDataDeleteDatasourceClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[];
    errorMessage: string = "";
    selectedRowIndex: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
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

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        this.errorMessage = '';
    }

    clickDelete(index: number, id: number) {
        // Delete a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.globalVariableService.deleteDatasource(id);
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDeleteDatasourceClosed.emit(action);

    }

}


