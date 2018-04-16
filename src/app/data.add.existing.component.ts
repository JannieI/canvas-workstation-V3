/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
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
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue }           from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'data-add-existing',
    templateUrl: './data.add.existing.component.html',
    styleUrls:  ['./data.add.existing.component.css']
})
export class DataAddExistingComponent implements OnInit {

    @Input() datasources: Datasource[];
    @Output() formDataAddExistingClosed: EventEmitter<string> = new EventEmitter();

    // datasources: Datasource[];
    changeVar: number = 2;
    clickedDeleteDS: boolean = false;
    clickedViewDescription: boolean = false;
    clickedViewPreview: boolean = false;
    clickedViewOverview: boolean = false;
    clickedViewFields: boolean = false;
    clickedViewFieldProperties: boolean = false;
    clickedViewFieldProfile: boolean = false;
    clickedViewDataQuality: boolean = false;
    currentDatasources: Datasource[] = [];
    currentData: any = [];
    currentDatasetName: string = '';            // Array with current data block
    curentDatasetID: number;
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataGetFromSwitch: string = 'File';
    dataUniqueInColumn: string[] = [];
    dataQualityIssues: DataQualityIssue[];
    errorMessage: string = "";
    existingDSName: string = '';
    fileName: string = '';
    folderName: string = '';
    finalFields: any = [];
    nrWidgetsInUse: number = 9123;
    pageSize: number = 4;
    resultMessage: string = 'Results will be shown here: drag and drop fields, then click Refresh'
    fields: Field[];
    fieldsMetadata: FieldMetadata[];
    selectedData: string = 'Trades for 2016';
    selectedDatasource: Datasource;
    selectedExistingDS: boolean = false;
    selectedFieldProperties: boolean = false;
    selectedFieldTransform: boolean = false;
    selectedFile: boolean = true;
    selectedRowID: number = 0;
    selectedRowIndex: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    selectedRowNrWidgetsInUse: number = 0;
    showFilter: boolean = false;
    showSelectField: boolean = false;

    users = [{id: 1,
        name: 'Astrid',
        creation: '2017/01/01',
        color: 'brown'
    }];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.datasources = this.globalVariableService.datasources;

        // Reset
        this.selectedRowID = -1;
        this.selectedRowIndex = -1;
        this.selectedRowName = '';
        this.selectedRowNrWidgetsInUse = 0;

        // Select first row if exists
        if (this.datasources.length > 0) {
            this.clickSelectedDatasource(0, this.datasources[0].id);
        };

        // Show first tab
        this.clickDSDescription('gridViewDescription');
    }

    clickCurrentDSDelete(id: number) {
        // Delete the selected current DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCurrentDSDelete', '@Start');

        // Reset
        this.errorMessage = '';

        // Prevent other actions
        this.clickedDeleteDS = true;

        // Validation
        let linkedWidgets: number = this.globalVariableService.currentWidgets.filter(w =>
            w.datasourceID == id
            &&
            w.dashboardID == this.globalVariableService.currentDashboardInfo
                .value.currentDashboardID
            // w.datasourceID == this.currentDatasources[index].id
        ).length;
        if (linkedWidgets > 0) {
            this.errorMessage = 'No deletion possilbe (linked Widgets)';
            return;
        };


        // Delete local
        let index: number = -1;
        for (var i = 0; i < this.currentDatasources.length; i++) {
            if (this.currentDatasources[i].id == id) {
                index = i;
            };
        };
        if (index != -1) {
            this.currentDatasources.splice(index,1)
        };

        // Delete global
        this.globalVariableService.deleteCurrentDatasource(id);
    }

    clickDSDescription(area: string) {
        // Show description area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSDescription', '@Start');

        // Make area visible
        this.clickViewOptions(area);
    }

    clickDSPreview(area: string) {
        // Show preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
        // Reset
        this.errorMessage = '';

        // Get the data, either lives in the dataset, or in a url
        let selectedDataset: Dataset[] = this.globalVariableService.datasets.filter(dS => 
            dS.datasourceID == this.selectedRowID
        );

        // TODO - do better with DB
        let maxDsetIndex: number = selectedDataset.length - 1;
        if (selectedDataset.length > 0) {

            if (selectedDataset[maxDsetIndex].dataRaw != null) {
                this.currentData = selectedDataset[maxDsetIndex].dataRaw;
            } else {
                this.globalVariableService.getData(selectedDataset[maxDsetIndex].id).then(dt => {
                    this.currentData = dt;
                    console.log('xx selectedDataset', this.clickedViewPreview, this.selectedRowID, maxDsetIndex, 
                    this.selectedDatasource, this.dataFieldNames, this.currentData)
                });
            };
        };

    }

    clickViewProperties(area: string) {
        // Show  area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProperties', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
    }

    clickViewProfile(area: string) {
        // Show profile area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProfile', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
    }

    clickViewOverview(area: string) {
        // Show overview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewOverview', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
    }

    clickViewFields(area: string) {
        // Show fields area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
    }

    clickViewDataQuality(area: string) {
        // Show data quality areclickViewOptionsa
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewDataQuality', '@Start');

        // Make area visible
        this.clickViewOptions(area);
        
    }



    clickNonCurrentDatasource(id: number, dsName: string) {
        // Click on an existing DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNonCurrentDatasource', '@Start');

        // Reset
        this.errorMessage = '';

        let tempData: any[] = this.globalVariableService.datasets.filter(d =>
            d.datasourceID == id);
        this.folderName = tempData[0].folderName;
        this.fileName = tempData[0].fileName;

        this.currentDatasetName = '';
        this.existingDSName = dsName;

        console.log('DataPopup clickDatasourceRow dsName', dsName)
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


            // Show first tab
            this.clickDSDescription('gridViewDescription');
        };
        this.errorMessage = '';
    }

    clickRemoveDS(id: number) {
        // Remove selected DS from current D, if not used
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRemoveDS', '@Start');

        this.errorMessage = 'Much ado about ' + name;
    }

    clickDSCheckbox(id: number, i: number, ev: any){
        // Checked / UnChecked DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSCheckbox', '@Start');

        this.errorMessage = this.errorMessage + ev.target.checked;
        
    }






    clickCurrentDatasource(id: number, index: number) {
        // Clicked and existing DS -> Load related data for the selected DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCurrentDatasource', '@Start');

        // If this was a delete, no further actions
        if (this.clickedDeleteDS) {
            this.clickedDeleteDS = false;
            return;
        };

        // Reset
        this.errorMessage = '';
        this.globalVariableService.refreshCurrentDatasourceInfo(id).then(i => {

            // this.currentDatasources = this.globalVariableService.currentDatasources;
            this.currentDatasources.forEach(ds => {
                if (ds.id == id) {
                    this.dataFieldNames = ds.dataFields;
                    this.dataFieldTypes = ds.dataFieldTypes;
                    this.dataFieldLengths = ds.dataFieldLengths;
                };
            });

            // TODO - using index below assumes currentDS and currentDSET has same lengths - wise ?
            let tempData: any[] = this.globalVariableService.currentDatasets.filter(d =>
               d.datasourceID == id);
            this.currentData = tempData[0].data;

            this.dataQualityIssues = this.globalVariableService.dataQualityIssues;
            this.fields = this.globalVariableService.fields;
            this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
            this.globalVariableService.dataGetFromSwitch.subscribe(
                i => {
                        this.dataGetFromSwitch = i;
                }
            )

            // General var with name - used in *ngIf, etc
            this.curentDatasetID = index;
            this.currentDatasetName = this.currentDatasources[index].name;

            // Reset data related to this DS
            this.finalFields = this.globalVariableService.finalFields;
            this.dataQualityIssues = this.globalVariableService.dataQualityIssues;

            // Show the preview
            this.folderName = tempData[0].folderName;
            this.fileName = tempData[0].fileName;

        });

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.dataGetFromSwitch.unsubscribe();
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataAddExistingClosed.emit(action);

    }

    clickViewOptions(area: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewOptions', '@Start');

        this.clickedViewDescription = false;
        this.clickedViewPreview = false;
        this.clickedViewOverview = false;
        this.clickedViewFields = false;
        this.clickedViewFieldProperties = false;
        this.clickedViewFieldProfile = false;
        this.clickedViewDataQuality = false;
        if (area == 'gridViewDescription') {
            this.clickedViewDescription = true;
        };
        if (area == 'gridViewPreview') {
            this.clickedViewPreview = true;
        };
        if (area == 'gridViewFieldProperties') {
            this.clickedViewFieldProperties = true;
        };
        if (area == 'gridViewFieldProfile') {
            this.clickedViewFieldProfile = true;
        };
        if (area == 'gridViewOverview') {
            this.clickedViewOverview = true;
        };
        
        if (area == 'gridViewFields') {
            this.clickedViewFields = true;
        };
        if (area == 'gridViewDataQuality') {
            this.clickedViewDataQuality = true;
        };

    }


}


