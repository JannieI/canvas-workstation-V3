/*
 * Combine selected Datasources by appending it to the first one.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { Widget }                     from './models';


@Component({
    selector: 'data-combination-append',
    templateUrl: './data.combination.append.component.html',
    styleUrls:  ['./data.combination.append.component.css']
})
export class DataCombinationAppendComponent implements OnInit {

    @Output() formDataCombinationAppendClosed: EventEmitter<string> = new EventEmitter();

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

    // datasources: Datasource[];
    currentData: any = [];
    currentDSids: number[] = [];                    // List of DS-IDs in use
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    datasources: Datasource[];
    errorMessage: string = '';
    fileName: string = '';
    folderName: string = '';
    fieldTypes: {MonthTraded: string; TradeType: string; Volume: string; Price: string; Value: string;}[] = [];
    headers: string[] = [];
    selectedDatasources: Datasource[];
    selectedDatasource: Datasource;
    selectedRowID: number = 0;
    selectedRowIndex: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    selectedRowNrWidgetsInUse: number = 0;
    widgets: Widget[] = [];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // TODO 
        // NB - fix the code where this.globalVariableService.VARIABLE is updated directly
        // from this code
        // TODO

        let currentWidgetIDs: number[] = [];
        this.globalVariableService.currentWidgets.forEach(w => {
            currentWidgetIDs.push(w.datasourceID);
        });
        this.globalVariableService.currentDatasources.forEach(cds => {
            this.currentDSids.push(cds.id);
        });

        // Load from global variables
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;
    
                // Reset
                this.selectedRowID = -1;
                this.selectedRowIndex = -1;
                this.selectedRowName = '';
                this.selectedRowNrWidgetsInUse = 0;

                // Select first row if exists
                if (this.datasources.length > 0) {
                    this.clickSelectedDatasource(0, this.datasources[0].id);
                };

                // TODO - fix!!
                this.fieldTypes = [{MonthTraded: 'MonthTraded', TradeType: 'TradeType', Volume: 'Volume', Price: 'Price', Value: 'Value'}];

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in dataCombination.append reading datasources: ' + err);
            });

        this.globalVariableService.getResource('widgets')
            .then(res => {
                this.widgets = res;
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in dataCombination.append reading widgets: ' + err);
            });
    
    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        let dsIndex: number = -1;
        dsIndex = this.datasources.findIndex(ds => ds.id == id);
        if (dsIndex != -1) {
            this.selectedDatasource = this.datasources[dsIndex];
            this.dataFieldNames = this.selectedDatasource.dataFields;
            this.selectedRowID = this.datasources[dsIndex].id;
            this.selectedRowName = this.datasources[dsIndex].name;
            this.selectedRowDescription = this.datasources[dsIndex].description;

            this.selectedRowNrWidgetsInUse = this.widgets.filter(w =>
                w.datasourceID == this.datasources[index].id
                &&
                w.dashboardID == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            ).length;

        };
        this.errorMessage = '';
    }

    clickDSCheckbox(index: number, id: number, isSelected: boolean, ev: any){
        // Checked / UnChecked DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSCheckbox', '@Start');

        // Get the data, if so requested
        if (ev.target.checked) {
            // Get data for Dset
            this.globalVariableService.getData('datasourceID=' + id.toString())
                .then(res => {

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in dataCombination.append getData: ' + err);
                });
        };
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataCombinationAppendClosed.emit(action);

    }

}


