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
    dataArray: any;
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
    selectedExistingDS: boolean = false;
    selectedFieldProperties: boolean = false;
    selectedFieldTransform: boolean = false;
    selectedFile: boolean = true;
    selectedRowID: number = 0;
    selectedRowIndex: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    showFilter: boolean = false;
    showSelectField: boolean = false;

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

        // Select first row if exists
        if (this.datasources.length > 0) {
            this.clickSelectedDatasource(
                0, 
                this.datasources[0].id, 
                this.datasources[0].name, 
                this.datasources[0].description
            );
        };

        // Show first tab
        this.clickDSDescription('gridViewDescription');
    }


    clickFileBrowse() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        // TODO alert('Later: File component to browse ...')
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

    fileLoadedCallback(fileSuffix: string, currentData: any) {
        // Handles callback from async datalib load
        this.globalFunctionService.printToConsole(this.constructor.name,'fileLoadedCallback', '@Start');

        let startNow: number;
        startNow = Date.now()

        // Load
        console.log('')
        console.log('DataPopup clickDSPreview LOAD start:')
        this.currentData = currentData;
        // this.globalVariableService.datasets.push(
        //     {
        //         datasourceID : 3,
        //         data: currentData
        //     }
        // );
        currentData = [];
        console.log('DataPopup clickDSPreview      data rows', this.currentData.length)
        console.log('DataPopup clickDSPreview      END load: ', (Date.now() - startNow) / 1000)

        // Fields
        console.log('')
        console.log('DataPopup clickDSPreview FIELDS start:')
        startNow = Date.now()
        var dataTypes = dl.type.all(this.currentData)
        this.dataFieldNames = Object.keys(dataTypes);
        console.log('DataPopup clickDSPreview      fields', this.dataFieldNames)
        for (var i = 0; i < this.dataFieldNames.length; i++) {
            console.log('     ', i, this.dataFieldNames[i])
        }
        console.log('DataPopup clickDSPreview      END fields: ', (Date.now() - startNow) / 1000)

        // Types
        console.log('')
        console.log('DataPopup clickDSPreview TYPES start:')
        startNow = Date.now()
        this.dataFieldTypes = [];
        console.log('DataPopup clickDSPreview      types');
        for (var i = 0; i < this.dataFieldNames.length; i++) {
            this.dataFieldTypes.push(dataTypes[ this.dataFieldNames[i] ] );
            console.log('DataPopup clickDSPreview      ', i, this.dataFieldTypes[i])
        }
        console.log('DataPopup clickDSPreview      END types: ', (Date.now() - startNow) / 1000)

        // Lengths
        console.log('')
        console.log('DataPopup clickDSPreview LENGTHS start:')
        startNow = Date.now()
        this.dataFieldLengths = [];
        console.log('DataPopup clickDSPreview      lengths');
        for (var i = 0; i < this.dataFieldTypes.length; i++) {
            if (this.dataFieldTypes[i] == 'string'  ||  this.dataFieldTypes[i] == 'date') {
                this.dataFieldLengths.push(25);
            } else {
                this.dataFieldLengths.push(12);
            }
            console.log('DataPopup clickDSPreview      ', i, this.dataFieldLengths[i])
        }
        console.log('DataPopup clickDSPreview      END lengths: ', (Date.now() - startNow) / 1000)

        // Sort
        console.log('')
        console.log('DataPopup clickDSPreview SORT start:')
        startNow = Date.now()
        this.currentData.sort(dl.comparator(['+symbol', '-price']));
        console.log('DataPopup clickDSPreview      END sort: ', (Date.now() - startNow) / 1000)

        // Group By
        console.log('')
        console.log('DataPopup clickDSPreview GROUPBY start:')
        startNow = Date.now()
        this.dataArray = dl.groupby('symbol')
            .summarize( [
                {name: 'symbol', ops: ['valid']},
                {name: 'price',  ops: ['sum', 'median'], as: ['s', 'm']}
                ] )
            .execute(this.currentData);
        console.log('DataPopup clickDSPreview      groupby', this.dataArray)
        console.log('DataPopup clickDSPreview      END groupby: ', (Date.now() - startNow) / 1000)

        // Get Unique Symbols
        console.log('')
        console.log('DataPopup clickDSPreview UNIQUE start:')
        startNow = Date.now()
        var dataUniqueInColumn = dl.unique(this.currentData);
        console.log('DataPopup clickDSPreview      unique', dataUniqueInColumn)
        console.log('DataPopup clickDSPreview      END unique: ', (Date.now() - startNow) / 1000)

        // Get Unique Symbols 2
        console.log('')
        console.log('DataPopup clickDSPreview UNIQUE 2 start:')
        startNow = Date.now()
        dataUniqueInColumn = dl.groupby('symbol')
            .summarize( [
                {name: 'symbol', ops: ['values']}
                ] )
            .execute(this.currentData);
        console.log('DataPopup clickDSPreview      unique', dataUniqueInColumn)
        console.log('DataPopup clickDSPreview      END unique: ', (Date.now() - startNow) / 1000)

        // Preview
        console.log('')
        console.log('DataPopup clickDSPreview PREVIEW start:')
        startNow = Date.now()
        console.log('DataPopup clickDSPreview         END preview: ', (Date.now() - startNow) / 1000)

        // No DS currently selected
        this.currentDatasetName = '';

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

        // // Get the folder and file, setting some defaults
        // if (this.folderName == ''  ||  this.folderName == undefined) {
        //     this.folderName = './assets/vega-datasets/';
        // }
        // if (this.fileName ==''  ||  this.fileName == undefined) {
        //     this.fileName = 'stocks.csv';
        // };

        // Load synchronously
        // var csv_data = dl.load({url: folderName + this.fileName});
        console.log('DataPopup clickDSPreview LOAD data start:', this.folderName, this.fileName)
        // let fileFolder: string = './assets/vega-datasets/';
        let filePath: string = this.folderName + this.fileName;

        let fileSuffix = this.fileName.substr(this.fileName.lastIndexOf('.')+1,this.fileName.length-this.fileName.indexOf('.'));

        if (fileSuffix == 'json') {
            dl.json({url: filePath}, {}, (err, currentData) => {
                if (err) {
                    this.errorMessage = err.status + ':' + err.statusText;

                    console.log('DataPopup clickDSPreview error on load', err)
                } else {
                    // Callback
                    this.fileLoadedCallback(fileSuffix, currentData);
                }
            });
        };
        if (fileSuffix == 'csv') {
            dl.csv({url: filePath}, {}, (err, currentData) => {
                if (err) {
                    this.errorMessage = err.status + ':' + err.statusText;
                    console.log('DataPopup clickDSPreview error on load', err)
                } else {
                    // Callback
                    this.fileLoadedCallback(fileSuffix, currentData);
                }
            });
        };

        // Message when file type unknown
        if (fileSuffix != 'json'  &&  fileSuffix != 'csv') {
            this.errorMessage = 'Unknown file type';
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

    clickSelectedDatasource(index: number, id: number, name: string, description: string) {
        // Clicked a DS -> Show related info and preview its data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        this.selectedRowID = id;
        this.selectedRowIndex = index;
        this.selectedRowName = name;
        this.selectedRowDescription = description;

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


