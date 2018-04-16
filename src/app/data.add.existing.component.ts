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
    addNewTransformation: boolean = false;
    aggField: string = 'Drag a field here ...';
    changeVar: number = 2;
    clickedDeleteDS: boolean = false;
    clickedViewDescription
    clickedViewPreview: boolean = true;
    clickedViewOverview: boolean = true;
    clickedViewFields: boolean = false;
    clickedViewFieldProperties: boolean = false;
    clickedViewFieldProfile: boolean = false;
    clickedViewDataQuality: boolean = false;
    colField: string = 'Drag a field here ...';
    currentDatasources: Datasource[] = [];
    currentData: any = [];
    currentDatasetName: string = '';            // Array with current data block
    curentDatasetID: number;
    currentTransformations: Transformation[];
    dataArray: any;
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataGetFromSwitch: string = 'File';
    dataUniqueInColumn: string[] = [];
    dataQualityIssues: DataQualityIssue[];
    dragoverAgg: boolean = false;
    dragoverCol: boolean = false;
    draggedField: string = '';
    dragoverRow: boolean = false;
    errorMessage: string = "";
    existingDSName: string = '';
    filterDataset: string = '';
    filterTransformation: string = '';
    filterPivotFields: string = '';
    fileName: string = '';
    folderName: string = '';
    finalFields: any = [];
    nrWidgetsInUse: number = 9123;
    rowField: string = 'Drag a field here ...';
    pageSize: number = 4;
    pivotCols: string[];
    pivotRows: string[];
    pivotAgg: string[];
    resultMessage: string = 'Results will be shown here: drag and drop fields, then click Refresh'
    pivotResults: any[] =
        [
            {
                Date: '2017/01/01',
                AAPL: 11,
                AMZN: 26,
                GOOG: 30,
                IBM: 47,
                MSFT: 50
            },
            {
                Date: '2017/01/01',
                AAPL: 12,
                AMZN: 25,
                GOOG: 34,
                IBM: 49,
                MSFT: 51
            },
            {
                Date: '2017/01/01',
                AAPL: 13,
                AMZN: 24,
                GOOG: 37,
                IBM: 48,
                MSFT: 50
            }
        ]

    fields: Field[];
    fieldsMetadata: FieldMetadata[];
    selectAddTransformation: boolean = false;
    selectedData: string = 'Trades for 2016';
    selectedDatasource: boolean = true;
    selectorDetailColumnEnd: string = '12';
    selectedExistingDS: boolean = false;
    selectedExistingTransform: boolean = false;
    selectedFieldProperties: boolean = false;
    selectedFieldTransform: boolean = false;
    selectedFile: boolean = true;
    selectedOverallTransform: boolean = false;
    selectedSummary: boolean = false;
    showAddButton: boolean = false;
    showDataPreview: boolean = false;
    showIdentifyFile: boolean = true;
    showFilter: boolean = false;
    showPivot: boolean = false;
    showSelectField: boolean = false;
    showTopSteps: boolean = false;
    showTransformDetail: boolean = false;
    showTransform: boolean = false;
    showView: boolean = false;
    transformationsFormat: Transformation[];
    transformationDescription: string = '';
    showTransitionFormat: boolean = false;
    transitionFieldName: string;
    transitionAction: string;

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
    }

    clickField() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickField', '@Start');
        if (this.showSelectField) {
            this.showSelectField = false;
            this.selectorDetailColumnEnd = '12';
        } else {
            this.showSelectField = true;
            this.selectorDetailColumnEnd = '9';
        }
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

        this.showDataPreview = false;

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

        // Show the Preview button
        this.showDataPreview = true;

        // Show Add button
        this.showAddButton = true;

    }

    clickDSAdd(action: string) {
        //  Add the data to the DS, dSet, etc - locally and globally
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSAdd', '@Start');
        console.log('strt', this.currentDatasources, this.currentData)

        // Get new DSid
        // TODO - do better with DB
        let newDSID: number = 1;
        let dsIDs: number[] = [];
        this.globalVariableService.datasources.forEach(ds => dsIDs.push(ds.id));
        newDSID = Math.max(...dsIDs) + 1;

        // New Datasource
        let newData: Datasource =  {
            id: newDSID,
            name: this.fileName,
            type: 'File',
            subType: 'CSV',
            typeVersion: 'Comma-Separated',
            description: 'Hard coded name',
            createdBy: 'Me',
            createdOn: '2017/01/01',
            refreshedBy: 'JohnM',
            refreshedOn: '2017/01/01',
            dataFields: this.dataFieldNames,
            dataFieldTypes: this.dataFieldTypes,
            dataFieldLengths: this.dataFieldLengths,
            parameters: 'None',
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: 1,
            resourceUserName: '',
            resourcePassword: '',
            serverName: '',
            serverIP: '',
            serverPort: '',
            database: '',
            logFoler: '',
            logfileName: '',
            language: '',
            serverOptions: ''
        };

        // General var with name - used in *ngIF, etc
        if (this.existingDSName == '') {
            this.currentDatasetName = this.fileName;
        } else {
            this.currentDatasetName = this.existingDSName;
        }
        this.existingDSName = '';

        // Add to all DS (DB, global), for later use
        this.globalVariableService.addDatasource(newData).then(res =>
            this.currentDatasources = this.globalVariableService.currentDatasources.slice()
        );

        // Get new dSetID
        // TODO - do better with DB
        let newdSetID: number = 1;
        let dSetIDs: number[] = [];
        this.globalVariableService.datasets.forEach(ds => dSetIDs.push(ds.id));
        newdSetID = Math.max(...dSetIDs) + 1;

        // Get list of dSet-ids to make array work easier
        let dsCurrIDs: number[] = [];       // currentDataset IDs
        this.globalVariableService.currentDatasets.forEach(d => dsCurrIDs.push(d.id));
        let newdSet: Dataset = {
            id: newdSetID,
            datasourceID: newDSID,
            sourceLocation: 'HTTP',
            url: 'data',
            folderName: '',
            fileName: '',
            data: this.currentData,
            dataRaw: this.currentData
        };

        let dataToAdd: any = {
            id: newdSetID,
            data: this.currentData
        };

        // Add to All datasets
        if (dSetIDs.indexOf(newdSetID) < 0) {
            // this.globalVariableService.datasets.push(newdSet);
            this.globalVariableService.addDataset(newdSet);
            this.globalVariableService.addData(dataToAdd).then(res => {
                this.globalVariableService.getData(res.id).then(dat => {
                    console.log('xx ----------')
                    console.log('xx added data', dat)
                                    });
            });
            this.globalVariableService.saveLocal('Dataset', newdSet);
        } else {
             // Add to CurrentDatasets
            if (dsCurrIDs.indexOf(newdSetID) < 0) {
                this.globalVariableService.currentDatasets.push(newdSet);
            };
        };




        console.log('xx ----------')
        console.log('xx @end newdSet-datasets-currentDatasets', newdSet, this.globalVariableService.datasets,
         this.globalVariableService.currentDatasets)

        // Reset data related to this DS
        console.log('xx currDS, gv.currDS', this.currentDatasources , this.globalVariableService.currentDatasources)
        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.currentTransformations = [];
        this.transformationsFormat = [];
        this.pivotAgg = [];
        this.pivotCols = [];
        this.pivotRows = [];
        this.pivotResults = [];
        this.finalFields = [];
        this.dataQualityIssues = [];

        // Show the preview
        this.showDataPreview = true;

        // Show the top steps
        this.showTopSteps = true;

        // UnShow Add button
        this.showAddButton = false;
        console.log('done DS:', this.currentDatasources, this.globalVariableService.datasources)
    }

    clickDSDescription(area: string) {
        // Show description area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSDescription', '@Start');

        this.clickViewOptions('gridViewDescription');
    }

    clickDSPreview(area: string) {
        // Show preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview', '@Start');

        this.clickViewOptions('gridViewPreview');

        
        // Reset
        this.errorMessage = '';
        this.showDataPreview = false;

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
                    this.showDataPreview = false;

                    console.log('DataPopup clickDSPreview error on load', err)
                } else {
                    // Callback
                    this.showDataPreview = true;
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
                    this.showDataPreview = true;
                    this.fileLoadedCallback(fileSuffix, currentData);
                }
            });
        };

        // Message when file type unknown
        if (fileSuffix != 'json'  &&  fileSuffix != 'csv') {
            this.errorMessage = 'Unknown file type';
            this.showDataPreview = false;
        };

    }

    clickViewProperties(area: string) {
        // Show  area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProperties', '@Start');

        this.clickViewOptions('');
        
    }

    clickViewProfile(area: string) {
        // Show profile area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewProfile', '@Start');

        this.clickViewOptions('clickViewProfile');
        
    }


    clickViewOverview(area: string) {
        // Show overview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewOverview', '@Start');

        this.clickViewOptions('clickViewOverview');
        
    }


    clickViewFields(area: string) {
        // Show fields area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');

        this.clickViewOptions('clickViewFields');
        
    }

    clickViewDataQuality(area: string) {
        // Show data quality area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewDataQuality', '@Start');

        this.clickViewOptions('clickViewDataQuality');
        
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

        // Show the preview
        this.showDataPreview = false;

        // Show the top steps
        this.showTopSteps = false;

        // UnShow Add button
        this.showAddButton = false;

        console.log('DataPopup clickDatasourceRow dsName', dsName, this.filterDataset)
    }

    clickSelectedDatasource(id: number, name: string) {
        // Clicked a DS -> Show related info and preview its data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');


        this.errorMessage = this.errorMessage + 'Much ado about ' + name;
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

            this.transformationsFormat = this.globalVariableService.transformationsFormat;
            this.currentTransformations = this.globalVariableService.currentTransformations;
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
            this.transformationsFormat = this.globalVariableService.transformationsFormat;
            this.pivotAgg = [];
            this.pivotCols = [];
            this.pivotRows = [];
            this.pivotResults = []
            this.finalFields = this.globalVariableService.finalFields;
            this.dataQualityIssues = this.globalVariableService.dataQualityIssues;

            // Show the preview
            this.folderName = tempData[0].folderName;
            this.fileName = tempData[0].fileName;
            this.showDataPreview = true;

            // Show the top steps
            this.showTopSteps = true;

            // UnShow Add button
            this.showAddButton = false;
        });

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // this.globalVariableService.dataGetFromSwitch.unsubscribe();
    }

    clickFileAddTransformationDetail() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileAddTransformationDetail', '@Start');

        this.transformationDescription = 'Format date, ie YYYY/MM/DD'
        this.showTransformDetail = true;
    }

    clickFileAddTransformation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileAddTransformation', '@Start');

        let newTransformation: Transformation = {
            id: 2,
            datasourceID: 12,
            category: 'Format',
            name: 'Format Date',
            description: 'bla-bla-bla',
            fieldName: 'Trader',
            parameters: "param1=a"
        };
        this.currentTransformations.push(newTransformation);
    }

    clickFileSaveTransformation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileSaveTransformation', '@Start');

        // TODO - add code to Save the name for next time ...
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataAddExistingClosed.emit(action);

    }


    clickShowIdentifyFile() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowIdentifyFile', '@Start');

        this.showIdentifyFile = true;

        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowFilter() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFilter', '@Start');

        this.showIdentifyFile = false;
        this.showFilter = true;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowTransform() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowTransform', '@Start');

        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = true;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowPivot() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowPivot', '@Start');

        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = true;
        this.showView = false;
    }

    clickShowView() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowView', '@Start');

        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = true;
    }

    clickShowIdentity() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowIdentity', '@Start');

        this.showIdentifyFile = true;
    }

    changedInput(newValue: any) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'changedInput', '@Start');

        console.log('DataPopup changedInput: Old-New', this.changeVar, newValue)
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
        if (area == 'gridViewOverview') {
            this.clickedViewOverview = true;
        };
        
        if (area == 'gridViewFields') {
            this.clickedViewFields = true;
        };
        if (area == 'gridViewFieldProperties') {
            this.clickedViewFieldProperties = true;
        };
        if (area == 'gridViewFieldProfile') {
            this.clickedViewFieldProfile = true;
        };
        if (area == 'gridViewDataQuality') {
            this.clickedViewDataQuality = true;
        };

    }


}


