/*
 * Combine selected Datasources by appending it to the first one.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';


@Component({
    selector: 'data-combination',
    templateUrl: './data.combination.component.html',
    styleUrls:  ['./data.combination.component.css']
})
export class DataCombinationComponent implements OnInit {

    @Input() combinationType: string;
    @Output() formDataCombinationClosed: EventEmitter<string> = new EventEmitter();

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

    // datasources: Datasource[];
    currentData: any = [];
    currentDSids: number[] = [];                    // List of DS-IDs in use
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    datasources: Datasource[];
    errorMessage: string = '';
    // TODO - fix!!
    fieldTypes: string[] = ['MonthTraded', 'TradeType', 'Volume' ,'Price', 'Value'];
    headers: string[] = [];
    newName: string = '';
    newDescription: string = '';
    selectedDatasources: Datasource[];
    selectedDatasource: Datasource;
    selectedRowID: number = 0;
    selectedRowIndexLH: number = 0;
    selectedRowIndexRH: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;

            // Reset
            this.selectedRowID = -1;
            this.selectedRowIndexLH = -1;
            this.selectedRowIndexRH = -1;
            this.selectedRowName = '';

            // Select first row if exists
            if (this.datasources.length > 0) {
                this.clickSelectedDatasourceLH(0, this.datasources[0].id);
            };
        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Data.combination reading datasources: ' + err);
        });

    }

    clickSelectedDatasourceLH(index: number, id: number) {
        // Clicked LH DS -> Show LH fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasourceLH', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndexLH = index;

        let dsIndex: number = -1;
        dsIndex = this.datasources.findIndex(ds => ds.id === id);
        if (dsIndex != -1) {
            this.selectedDatasource = this.datasources[dsIndex];
            this.dataFieldNames = this.selectedDatasource.dataFields;
            this.selectedRowID = this.datasources[dsIndex].id;
            this.selectedRowName = this.datasources[dsIndex].name;
            this.selectedRowDescription = this.datasources[dsIndex].description;

        };
        this.errorMessage = '';
    }

    clickSelectedDatasourceRH(index: number, id: number) {
        // Clicked RH DS -> Show RH fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasourceRH', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndexRH = index;

        let dsIndex: number = -1;
        dsIndex = this.datasources.findIndex(ds => ds.id === id);
        if (dsIndex != -1) {
            this.selectedDatasource = this.datasources[dsIndex];
            this.dataFieldNames = this.selectedDatasource.dataFields;
            this.selectedRowID = this.datasources[dsIndex].id;
            this.selectedRowName = this.datasources[dsIndex].name;
            this.selectedRowDescription = this.datasources[dsIndex].description;

        };
        this.errorMessage = '';
    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataCombinationClosed.emit(action);

    }

    clickSave() {
        // Save and close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.formDataCombinationClosed.emit('Save');

    }


}



    




    