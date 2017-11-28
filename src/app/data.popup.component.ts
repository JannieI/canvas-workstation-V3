/* 
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { currentDatasource }          from './model.currentDashboard';
import { transformation }             from './models'
import { field }                      from './models'
import { fieldMetadata }              from './models'

interface Idata{
    name: string;
}

@Component({
    selector: 'data-popup',
    templateUrl: './data.popup.component.html',
    styleUrls:  ['./data.popup.component.css']
})
export class DataPopupComponent implements OnInit {

    @Output() formDataPopupClosed: EventEmitter<string> = new EventEmitter();
    
    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    @ViewChild('typeTransformationDropdown') typeTransformationDropdown: ElementRef;
    @ViewChild('transformations') transformations: ElementRef;

    currentDatasources: currentDatasource[];
    errorMessage: string = "";
    fields: field[];
    fieldsMetadata: fieldMetadata[];
    selectedFile: boolean = true;
    selectedData: string = 'Trades for 2016';
    transformation: transformation[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {

        // Load global variables
        this.currentDatasources = this.globalVariableService.currentDatasources;
        this.transformation = this.globalVariableService.transformations;
        this.fields = this.globalVariableService.fields;
        this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
    }

    clickAddFileSave() {
        let newData: currentDatasource =  {
            id: 1,
            type: 'Excel file',
            name: 'Costing preparation',
            description: 'Costing preparation'
        }

        newData.name = 'Trades for 2016'
    }

    clickClose(action: string) {
		this.formDataPopupClosed.emit(action);
    }

 }
