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
import { Dataset }                    from './models';
import { DataQualityIssue }           from './models';

interface localDatasources extends Datasource
    {
        isSelected?: boolean;
        hasWidget?: boolean;
    }

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
    dataQualityIssues: DataQualityIssue[];
    datasources: localDatasources[];
    errorMessage: string = "";
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


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        let currentWidgetIDs: number[] = [];
        this.globalVariableService.currentWidgets.forEach(w => {
            currentWidgetIDs.push(w.datasourceID);
        });
        this.globalVariableService.currentDatasources.forEach(cds => {
            this.currentDSids.push(cds.id);
        });

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();
        this.datasources.forEach(ds => {
            if (currentWidgetIDs.indexOf(ds.id) >= 0) {
                ds.hasWidget = true;
            } else {
                ds.hasWidget = false;
            };
            if (this.currentDSids.indexOf(ds.id) >= 0) {
                ds.isSelected = true;
            } else {
                ds.isSelected = false;
            };
        });

        // Reset
        this.selectedRowID = -1;
        this.selectedRowIndex = -1;
        this.selectedRowName = '';
        this.selectedRowNrWidgetsInUse = 0;

        // Select first row if exists
        if (this.datasources.length > 0) {
            this.clickSelectedDatasource(0, this.datasources[0].id);
        };
        console.warn('xx DS, dSet', this.globalVariableService.datasources, this.globalVariableService.currentDatasources, this.globalVariableService.datasets, this.globalVariableService.currentDatasets)
        // TODO - fix!!
        this.fieldTypes = [{MonthTraded: 'MonthTraded', TradeType: 'TradeType', Volume: 'Volume', Price: 'Price', Value: 'Value'}];

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

            this.selectedRowNrWidgetsInUse = this.globalVariableService.widgets.filter(w =>
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
            let localDatasource: Datasource;
            let localDataset: Dataset;
            let globalCurrentDSIndex: number = this.globalVariableService.currentDatasources
                .findIndex(dS => dS.id == id
            );
            let globalDSIndex: number = this.globalVariableService.datasources.findIndex(ds =>
                ds.id == id
            );

            // DS exists in gv datasources, but not in currentDatasources
            if (globalDSIndex >= 0  &&  globalCurrentDSIndex < 0) {
                localDatasource = this.globalVariableService.datasources[globalDSIndex];

                let globalCurrentDsetIndex: number = this.globalVariableService.currentDatasets
                    .findIndex(dS => dS.id == id
                );
                let globalDsetIndex: number = this.globalVariableService.datasets.findIndex(dS =>
                    dS.datasourceID == id
                );

                // Add DS and Dset to gv
                this.globalVariableService.currentDatasources.push(localDatasource);

                this.globalVariableService.hasDatasources.next(true);

                // Dset exists in gv datasets, but not in currentDatasets
                if (globalDsetIndex >= 0  &&  globalCurrentDsetIndex < 0) {
                    localDataset = this.globalVariableService.datasets[globalDsetIndex];

                    // Get data for Dset
                    this.globalVariableService.getData(localDataset.id).then(res => {

                        // Add data to dataset
                        localDataset.dataRaw = res;
                        localDataset.data = res;

                        this.globalVariableService.currentDatasets.push(localDataset);

                    });
                };
            };
        } else {
            let globalCurrentDSIndex: number = this.globalVariableService.currentDatasources
                .findIndex(dS => dS.id == id
            );
            if (globalCurrentDSIndex >= 0) {
                this.globalVariableService.currentDatasources.splice(globalCurrentDSIndex, 1);
            };
            let globalCurrentDsetIndex: number = this.globalVariableService.currentDatasets
                .findIndex(dS => dS.datasourceID == id
            );
            if (globalCurrentDsetIndex >= 0) {
                this.globalVariableService.currentDatasets.splice(globalCurrentDsetIndex, 1);
            };
        };

        // TODO - what about other arrays, ie permisions, pivots, transformations, etc ??
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataCombinationAppendClosed.emit(action);

    }

}


