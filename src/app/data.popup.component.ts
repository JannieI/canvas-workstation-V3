/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
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
import { DatasourceFilter}            from './models'

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'data',
    templateUrl: './data.popup.component.html',
    styleUrls:  ['./data.popup.component.css']
})
export class DataPopupComponent implements OnInit {

    @Output() formDataPopupClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    @ViewChild('typeTransformationDropdown') typeTransformationDropdown: ElementRef;
    @ViewChild('transformations') transformations: ElementRef;

    datasources: Datasource[];
    currentDatasources: Datasource[];
    currentData: any = [];
    dataArray: any;
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataUniqueInColumn: string[] = [];
    pageSize: number = 4;
    dataQualityIssues: DataQualityIssue[];
    datasourceFilters: DatasourceFilter[];
    currentTransformations: Transformation[];
    curentDatasetID: number;
    currentDatasetName: string = '';
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
    showDataPreview: boolean = false;
    showIdentifyFile: boolean = true;
    showFilter: boolean = false;
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
    isEditMode: boolean = false;
    dataGetFromSwitch: string = 'File';
    currentDS: boolean = true;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {

        // Load global variables
        this.datasources = this.globalVariableService.datasources;
        this.globalVariableService.currentDatasources.subscribe(
            i => this.currentDatasources = i
        );
        this.transformationsFormat = this.globalVariableService.transformationsFormat;
        this.globalVariableService.currentTransformations.subscribe(
            i => this.currentTransformations = i
        );
        this.dataQualityIssues = this.globalVariableService.dataQualityIssues;
        this.datasourceFilters = this.globalVariableService.datasourceFilters;
        this.fields = this.globalVariableService.fields;
        this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
        this.globalVariableService.dataGetFromSwitch.subscribe(
            ds => this.dataGetFromSwitch  = ds
        )

    }


    clickField() {
        if (this.showSelectField) {
            this.showSelectField = false;
            this.selectorDetailColumnEnd = '12';
        } else {
            this.showSelectField = true;
            this.selectorDetailColumnEnd = '9';
        }
    }

    clickFileBrowse() {
        // alert('Later: File component to browse ...')
    }

    clickCurrentDSDelete(index: number) {
        this.globalVariableService.currentDatasourceDelete(index);
    }

    clickDSSelect(action: string) {
        var csv_data = dl.load({url: './assets/vega-datasets/stocks.csv'});
        let startNow: number;

        startNow = Date.now()
        console.log('LOAD data start:')
        let fileFolder: string = './assets/vega-datasets/';
        let filePath: string = fileFolder + this.fileName;
        dl.csv({url: filePath}, {}, (err, currentData) => {
            if (err) {
              console.log('error on load', err)
            } else {

                // Load
                console.log('')
                console.log('LOAD start:')
                this.currentData = currentData;
                this.globalVariableService.datasets.push(
                    {
                        datasourceID : 3,
                        data: currentData
                    }
                );
                console.log(this.globalVariableService.currentDataset)
                currentData = [];
                console.log('     data rows', this.currentData.length)
                console.log('     END load: ', (Date.now() - startNow) / 1000)

                // Fields
                console.log('')
                console.log('FIELDS start:')
                startNow = Date.now()
                var dataTypes = dl.type.all(this.currentData)
                this.dataFieldNames = Object.keys(dataTypes);
                console.log('     fields', this.dataFieldNames)
                for (var i = 0; i < this.dataFieldNames.length; i++) {
                    console.log('     ', i, this.dataFieldNames[i])
                }
                console.log('     END fields: ', (Date.now() - startNow) / 1000)

                // Types
                console.log('')
                console.log('TYPES start:')
                startNow = Date.now()
                console.log('     types');
                for (var i = 0; i < this.dataFieldNames.length; i++) {
                    this.dataFieldTypes.push(dataTypes[ this.dataFieldNames[i] ] );
                    console.log('     ', i, this.dataFieldTypes[i])
                }
                console.log('     END types: ', (Date.now() - startNow) / 1000)

                // Sort
                console.log('')
                console.log('SORT start:')
                startNow = Date.now()
                this.currentData.sort(dl.comparator(['+symbol', '-price']));
                console.log('     END sort: ', (Date.now() - startNow) / 1000)

                // Group By
                console.log('')
                console.log('GROUPBY start:')
                startNow = Date.now()
                this.dataArray = dl.groupby('symbol')
                    .summarize( [
                        {name: 'symbol', ops: ['valid']},
                        {name: 'price',  ops: ['sum', 'median'], as: ['s', 'm']}
                        ] )
                    .execute(this.currentData);
                console.log('     groupby', this.dataArray)
                console.log('     END groupby: ', (Date.now() - startNow) / 1000)

                // Get Unique Symbols
                console.log('')
                console.log('UNIQUE start:')
                startNow = Date.now()
                var dataUniqueInColumn = dl.unique(this.currentData);
                console.log('     unique', dataUniqueInColumn)
                console.log('     END unique: ', (Date.now() - startNow) / 1000)

                // Get Unique Symbols 2
                console.log('')
                console.log('UNIQUE 2 start:')
                startNow = Date.now()
                dataUniqueInColumn = dl.groupby('symbol')
                    .summarize( [
                        {name: 'symbol', ops: ['values']}
                        ] )
                    .execute(this.currentData);
                console.log('     unique', dataUniqueInColumn)
                console.log('     END unique: ', (Date.now() - startNow) / 1000)

            }
          });

        this.globalVariableService.menuCreateDisabled.next(false);

        // Preview
        console.log('')
        console.log('PREVIEW start:')
        startNow = Date.now()
        this.showDataPreview = !this.showDataPreview;
        console.log('        END preview: ', (Date.now() - startNow) / 1000)

        this.currentDatasetName = '';

    }

    clickDSAdd(action: string) {
        // Datasource
        console.log('DATASOURCE start:')
        let newData: Datasource =  {
            id: 1,
            type: 'File',
            subType: 'CSV',
            typeVersion: 'Comma-Separated',
                name: 'Stocks.csv',
            description: 'Hard coded name',
            createdBy: 'Me',
            createdOn: '2017/01/01',
            refreshedBy: 'JohnM',
            refreshedOn: '2017/01/01',
            parameters: 'None'
        };

        // Show the preview
        this.showDataPreview = true;

        // General var with name - used in *ngIF, etc
        this.currentDatasetName = this.fileName;

        // Add to current DS
        this.globalVariableService.currentDatasourceAdd(newData);

        // Add to all DS, for later use
        this.globalVariableService.datasourceAdd(newData);

        // Reset data related to this DS
        this.datasourceFilters = [];
        this.currentTransformations = [];
        this.transformationsFormat = [];
        this.pivotAgg = [];
        this.pivotCols = [];
        this.pivotRows = [];
        this.pivotResults = [];
        this.finalFields = [];
        this.dataQualityIssues = [];
    }

    clickDatasourceRow(dsName: string) {
        this.currentDatasetName = dsName;
        console.log('dsName', dsName, this.filterDataset)
    }

    clickSelectDatasource(i: number, name: string) {

        // Show the preview
        this.showDataPreview = true;

        // General var with name - used in *ngIF, etc
        this.curentDatasetID = i;
        this.currentDatasetName = this.currentDatasources[i].name;

        // Reset data related to this DS
        this.datasourceFilters = this.globalVariableService.datasourceFilters;
        this.transformationsFormat = this.globalVariableService.transformationsFormat;
        this.pivotAgg = [];
        this.pivotCols = [];
        this.pivotRows = [];
        this.pivotResults = []
        this.finalFields = this.globalVariableService.finalFields;
        this.dataQualityIssues = this.globalVariableService.dataQualityIssues;
        
    }

    clickFileAddTransformationDetail() {
        this.transformationDescription = 'Format date, ie YYYY/MM/DD'
        this.showTransformDetail = true;
    }

    clickFileAddTransformation() {
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
        console.log('Saved the name for next time ...')
    }

    clickClose(action: string) {
        // this.formDataPopupClosed.emit(action);
        this.router.navigate(['/explore']);

    }

    clickRefreshPivot() {
        this.resultMessage = ''
    }

    clickRefreshSummary() {
        alert('clickRefreshSummary')
    }

    clickTransitionFormat() {
        this.showTransitionFormat = true;
    }

    dragstart_handler(ev) {
        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        console.log('drag_start for ', this.draggedField)
    }

    dragstart_handlerCol(ev) {
        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.colField = '';
        console.log('drag_start for ', this.draggedField)
    }

    dragstart_handlerRow(ev) {
        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.rowField = '';
        console.log('drag_start for ', this.draggedField)
    }

    dragstart_handlerAgg(ev) {
        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.aggField = '';
        console.log('drag_start for ', this.draggedField)
    }

    dragend_handler(ev) {
        console.log('dragend_handler', ev.dataTransfer.dropEffect)
    }

    dragover_handler(ev, actionName: string) {
        console.log('dragover_handler', ev, ev.srcElement.innerText)
        ev.preventDefault();
        this.transitionFieldName = 'Added the field to transition: '
        this.transitionAction = actionName;
    }

    dragover_handlerColEnter(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverAgg = false;
    }

    dragover_handlerColLeave(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragover_handlerRowEnter(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverAgg = false;
    }

    dragover_handlerRowLeave(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragover_handlerAggEnter(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = false;
        this.dragoverAgg = true;
    }

    dragover_handlerAggLeave(ev, actionName: string) {
        ev.preventDefault();
        this.dragoverAgg = false;
    }

    drop_handlerRow(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.rowField = this.draggedField;
        console.log('drop_handler dropped !!', ev.srcElement.innerText)

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
        console.log('this.pivotRows', this.pivotRows)

    }

    drop_handlerCol(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.colField = this.draggedField;
        console.log('drop_handler dropped !!', ev.srcElement.innerText)

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
        console.log('this.pivotCols', this.pivotCols)
    }

    drop_handlerAgg(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.aggField = this.draggedField;
        console.log('drop_handler dropped !!', ev.srcElement.innerText)
    }

    drop_pivot(ev) {
        ev.preventDefault();

        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('drop_handler dropped !!')
    }

    dragover_pivot(ev) {
        console.log('dragover_pivot')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
    }

    clickShowIdentifyFile() {
        this.showIdentifyFile = true;
        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowFilter() {
        this.showIdentifyFile = false;
        this.showFilter = true;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowTransform() {
        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = true;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowPivot() {
        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = true;
        this.showView = false;
    }

    clickShowView() {
        this.showIdentifyFile = false;
        this.showFilter = false;
        this.showTransform = false;
        this.showPivot = false;
        this.showView = true;
    }

    clickShowIdentity() {
        this.showIdentifyFile = true;
    }

    changedInput(newValue: any) {
        console.log('changedInput: Old-New', this.changeVar, newValue)
    }

    clickViewOptions(area: string) {
        console.log('area', area)

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
        console.log('currentData', this.currentData[0])
        let result: any;
        result = this.globalFunctionService.convertArrayToPivot(this.currentData);
        console.log(result);
    }

    clickDS() {
        this.currentDS = !this.currentDS;
    }
}


