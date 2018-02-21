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
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue }           from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'data',
    templateUrl: './data.popup.component.html',
    styleUrls:  ['./data.popup.component.css']
})
export class DataPopupComponent implements OnInit {

    @Input() datasources: Datasource[];
    @Output() formDataPopupClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    @ViewChild('typeTransformationDropdown') typeTransformationDropdown: ElementRef;
    @ViewChild('transformations') transformations: ElementRef;

    // datasources: Datasource[];
    currentDatasources: Datasource[] = [];
    currentData: any = [];
    dataArray: any;
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataFieldLengths: string[] = [];
    dataUniqueInColumn: string[] = [];
    pageSize: number = 4;
    dataQualityIssues: DataQualityIssue[];
    currentTransformations: Transformation[];
    curentDatasetID: number;
    currentDatasetName: string = '';            // Array with current data block
    draggedField: string = '';
    fileName: string = 'stocks.csv';
    rowField: string = 'Drag a field here ...';
    colField: string = 'Drag a field here ...';
    aggField: string = 'Drag a field here ...';
    resultMessage: string = 'Results will be shown here: drag and drop fields, then click Refresh'
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverAgg: boolean = false;
    finalFields: any = [];
    pivotCols: string[];
    pivotRows: string[];
    pivotAgg: string[];
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

    errorMessage: string = "";
    fields: Field[];
    fieldsMetadata: FieldMetadata[];
    selectorDetailColumnEnd: string = '12';
    selectedFile: boolean = true;
    selectedData: string = 'Trades for 2016';
    showAddButton: boolean = false;
    showDataPreview: boolean = false;
    showIdentifyFile: boolean = true;
    showFilter: boolean = false;
    showTopSteps: boolean = false;
    showTransform: boolean = false;
    showPivot: boolean = false;
    showView: boolean = false;
    showSelectField: boolean = false;
    transformationsFormat: Transformation[];
    showTransformDetail: boolean = false;
    transformationDescription: string = '';
    selectedExistingDS: boolean = false;
    selectedExistingTransform: boolean = false;
    selectedDatasource: boolean = true;
    selectedOverallTransform: boolean = false;
    selectedFieldTransform: boolean = false;
    selectedFieldProperties: boolean = false;
    selectedSummary: boolean = false;
    selectAddTransformation: boolean = false;

    gridViewOverview: boolean = true;
    gridViewFields: boolean = false;
    gridViewFieldProperties: boolean = false;
    gridViewExplain: boolean = false;
    gridViewFieldProfile: boolean = false;
    gridViewDataQuality: boolean = false;

    showTransitionFormat: boolean = false;
    transitionFieldName: string;
    transitionAction: string;

    filterDataset: string = '';
    filterTransformation: string = '';
    filterPivotFields: string = '';
    changeVar: number = 2;
    dataGetFromSwitch: string = 'File';
    currentDS: boolean = true;
    existingDSName: string = '';
    addNewTransformation: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.currentDatasources = this.globalVariableService.currentDatasources;
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

    clickFileBrowse(filename: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        console.log('xx brws', filename)
        // TODO alert('Later: File component to browse ...')
    }

    clickCurrentDSDelete(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCurrentDSDelete', '@Start');

        this.globalVariableService.currentDatasourceDelete(index);
    }

    clickDSPreview(filename: string) {
        // Load the new DS in the ID section, and show in Preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview', '@Start');
        if (filename ==''  ||  filename == undefined) {
            filename = 'stocks.csv';
        };
        console.log('xx brws', filename)

        var csv_data = dl.load({url: './assets/vega-datasets/' + filename});
        let startNow: number;

        startNow = Date.now()
        console.log('DataPopup clickDSPreview LOAD data start:')
        let fileFolder: string = './assets/vega-datasets/';
        let filePath: string = fileFolder + this.fileName;
        dl.csv({url: filePath}, {}, (err, currentData) => {
            if (err) {
              console.log('DataPopup clickDSPreview error on load', err)
            } else {

                // Load
                console.log('')
                console.log('DataPopup clickDSPreview LOAD start:')
                this.currentData = currentData;
                this.globalVariableService.datasets.push(
                    {
                        datasourceID : 3,
                        data: currentData
                    }
                );
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
                console.log('DataPopup clickDSPreview      types');
                for (var i = 0; i < this.dataFieldNames.length; i++) {
                    this.dataFieldTypes.push(dataTypes[ this.dataFieldNames[i] ] );
                    console.log('DataPopup clickDSPreview      ', i, this.dataFieldTypes[i])
                }
                console.log('DataPopup clickDSPreview      END types: ', (Date.now() - startNow) / 1000)

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

            }
        });

        // Preview
        console.log('')
        console.log('DataPopup clickDSPreview PREVIEW start:')
        startNow = Date.now()
        console.log('DataPopup clickDSPreview         END preview: ', (Date.now() - startNow) / 1000)

        // No DS currently selected
        this.currentDatasetName = '';

        // Show the Preview button
        this.showDataPreview = true; //!this.showDataPreview;

        // Show Add button
        this.showAddButton = true;
    }

    clickDSAdd(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSAdd', '@Start');
        console.log('strt', this.currentDatasources)

        // Datasource
        let newData: Datasource =  {
            id: 100,
            name: 'Stocks.csv',
            type: 'File',
            subType: 'CSV',
            typeVersion: 'Comma-Separated',
            description: 'Hard coded name',
            createdBy: 'Me',
            createdOn: '2017/01/01',
            refreshedBy: 'JohnM',
            refreshedOn: '2017/01/01',
            dataFields: [],
            dataFieldTypes: [],
            dataFieldLengths: [],
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

        // Add to current DS
        this.globalVariableService.currentDatasourceAdd(newData);

        // Show current Tab
        this.currentDS = true;

        // Add to all DS, for later use
        this.globalVariableService.datasourceAdd(newData);

        // Reset data related to this DS
        // this.currentDatasources.push(newData);
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
        console.log('done', this.currentDatasources)
    }

    clickDatasourceRow(dsName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasourceRow', '@Start');

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

    clickCurrentDatasource(id: number, index: number) {
        // Load related data for the selected DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCurrentDatasource', '@Start');

        this.globalVariableService.refreshCurrentDatasourceInfo(id).then(i => {
            this.currentDatasources = this.globalVariableService.currentDatasources;
            this.currentDatasources.forEach(ds => {
                if (ds.id == id) {
                    // TODO - remove this, currently datalib reads array as string a,b,c
                    let y: string = ds.dataFields.toString();
                    this.dataFieldNames = y.split(',');
                    let l = ds.dataFieldLengths.toString();
                    this.dataFieldLengths = l.split(',');
                };
            });
            this.currentData = this.globalVariableService.currentDatasets[0].data;
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
            this.showDataPreview = true;

            // Show the top steps
            this.showTopSteps = true;

            // UnShow Add button
            this.showAddButton = false;
        }
    )

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

        this.formDataPopupClosed.emit(action);

    }

    clickRefreshPivot() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshPivot', '@Start');

        this.resultMessage = ''
    }

    clickRefreshSummary() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshSummary', '@Start');

        alert('clickRefreshSummary')
    }

    clickTransitionFormat() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTransitionFormat', '@Start');

        this.showTransitionFormat = true;
    }

    dragstart_handler(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handler', '@Start');

        console.log("DataPopup dragstart_handler", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        console.log('DataPopup dragstart_handler for ', this.draggedField)
    }

    dragstart_handlerCol(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handlerCol', '@Start');

        console.log("DataPopup dragstart_handlerCol", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.colField = '';
        console.log('DataPopup dragstart_handlerCol for ', this.draggedField)
    }

    dragstart_handlerRow(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handlerRow', '@Start');

        console.log("DataPopup dragstart_handlerRow", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.rowField = '';
        console.log('DataPopup dragstart_handlerRow for ', this.draggedField)
    }

    dragstart_handlerAgg(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handlerAgg', '@Start');

        console.log("DataPopup dragstart_handlerAgg", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.aggField = '';
        console.log('DataPopup dragstart_handlerAgg for ', this.draggedField)
    }

    dragend_handler(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragend_handler', '@Start');

        console.log('DataPopup dragend_handler', ev.dataTransfer.dropEffect)
    }

    dragover_handler(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnIdragover_handlernit', '@Start');

        console.log('DataPopup dragover_handler', ev, ev.srcElement.innerText)
        ev.preventDefault();
        this.transitionFieldName = 'Added the field to transition: '
        this.transitionAction = actionName;
    }

    dragover_handlerColEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColEnter', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverAgg = false;
    }

    dragover_handlerColLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColLeave', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragover_handlerRowEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerRowEnter', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverAgg = false;
    }

    dragover_handlerRowLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerRowLeave', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragover_handlerAggEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerAggEnter', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = false;
        this.dragoverAgg = true;
    }

    dragover_handlerAggLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerAggLeave', '@Start');

        ev.preventDefault();
        this.dragoverAgg = false;
    }

    drop_handlerRow(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerRow', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.rowField = this.draggedField;
        console.log('DataPopup drop_handlerRow dropped !!', ev.srcElement.innerText)

        // Pivot Rows
        this.pivotRows = [];
        let pC = dl.groupby('symbol')
            .summarize( [
                {name: 'symbol', ops: ['values']}
                ] )
            .execute(this.currentData);
        for (var i = 0; i < pC.length; i++) {
            this.pivotRows.push(pC[i].symbol)
        }
        this.resultMessage = '';
        console.log('DataPopup drop_handlerRow this.pivotRows', this.pivotRows)

    }

    drop_handlerCol(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerCol', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.colField = this.draggedField;
        console.log('DataPopup drop_handlerCol dropped !!', ev.srcElement.innerText)

        // Pivot Cols
        this.pivotCols = ['Date'];
        let pC = dl.groupby('symbol')
            .summarize( [
                {name: 'symbol', ops: ['values']}
                ] )
            .execute(this.currentData);
        for (var i = 0; i < pC.length; i++) {
            this.pivotCols.push(pC[i].symbol)
        }
        this.resultMessage = '';
        this.dragoverCol = false;
        console.log('DataPopup drop_handlerCol this.pivotCols', this.pivotCols)
    }

    drop_handlerAgg(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerAgg', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.aggField = this.draggedField;
        console.log('DataPopup drop_handlerAgg dropped !!', ev.srcElement.innerText)
    }

    drop_pivot(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_pivot', '@Start');

        ev.preventDefault();

        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('DataPopup drop_pivot dropped !!')
    }

    dragover_pivot(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_pivot', '@Start');

        console.log('DataPopup dragover_pivot')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
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

        console.log('DataPopup clickViewOptions area', area)

        if (area == 'gridViewOverview') {
            this.gridViewOverview = true;
            this.gridViewFields = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewFieldProfile = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewFields') {
            this.gridViewOverview = false;
            this.gridViewFields = true;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewFieldProfile = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewFieldProperties') {
            this.gridViewOverview = false;
            this.gridViewFields = false;
            this.gridViewFieldProperties = true;
            this.gridViewExplain = false;
            this.gridViewFieldProfile = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewExplain') {
            this.gridViewOverview = false;
            this.gridViewFields = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = true;
            this.gridViewFieldProfile = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewFieldProfile') {
            this.gridViewOverview = false;
            this.gridViewFields = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewFieldProfile = true;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewDataQuality') {
            this.gridViewOverview = false;
            this.gridViewFields = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewFieldProfile = false;
            this.gridViewDataQuality = true;
        }

    }

    clickTest() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTest', '@Start');

        console.log('DataPopup clickTest currentData', this.currentData[0])
        let result: any;
        result = this.globalFunctionService.convertArrayToPivot(this.currentData);
        console.log('DataPopup clickTest',result);
    }

    clickDS() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDS', '@Start');

        this.currentDS = !this.currentDS;
    }
}


