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
import { currentDatasource }          from './models';
import { transformation }             from './models';
import { field }                      from './models';
import { fieldMetadata }              from './models';
import { currentTransformation }      from './models';
import { dataQualityIssue }           from './models';

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

    currentDatasources: currentDatasource[];
    datasources: currentDatasource[];
    
    currentData: any = [];
    dataArray: any;
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataUniqueInColumn: string[] = [];
    pageSize: number = 4;
    dataQualityIssues: dataQualityIssue[];
    currentTransformations: currentTransformation[];
    currentDataset: string = '';
    draggedField: string = '';
    fileName: string = 'stocks.csv';
    rowField: string = 'Drag a field here ...';
    colField: string = 'Drag a field here ...';
    aggField: string = 'Drag a field here ...';
    pivotCols: string[];
    pivotRows: string[];
    pivotAgg: string[];
    resultMessage: string = 'Results will be shown here: drag and drop fields, then click Refresh'
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverAgg: boolean = false;
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
    fields: field[];
    fieldsMetadata: fieldMetadata[];
    isFirstTimeData: boolean;
    selectorDetailColumnEnd: string = '12';
    selectedFile: boolean = true;
    selectedData: string = 'Trades for 2016';
    showDataPreview: boolean = false;
    showIdentifyFile: boolean = true;
    showTransform: boolean = false;
    showPivot: boolean = false;
    showView: boolean = false;
    showSelectField: boolean = false;
    transformationsFormat: transformation[];
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
    gridViewFieldProperties: boolean = false;
    gridViewExplain: boolean = false;
    gridViewSummaryGraphs: boolean = false;
    gridViewDataQuality: boolean = false;

    showTransitionFormat: boolean = false;
    transitionFieldName: string;
    transitionAction: string;

    filterDataset: string = '';
    filterTransformation: string = '';
    filterPivotFields: string = '';
    changeVar: number = 2;
    isEditMode: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {

        // Load global variables
        this.datasources = this.globalVariableService.datasources
        .filter(d => d.id <= 14);
        this.currentDatasources = this.globalVariableService.currentDatasources;
        if (this.currentDatasources.length > 0) {
            this.isFirstTimeData = false;
        } else {
            this.isFirstTimeData = true;
        }
        this.transformationsFormat = this.globalVariableService.transformationsFormat;
        this.currentTransformations = this.globalVariableService.currentTransformations;
        this.dataQualityIssues = this.globalVariableService.dataQualityIssues;
        this.fields = this.globalVariableService.fields;
        this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
        console.log('this.isFirstTimeData', this.isFirstTimeData)
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

    clickFileAdd(action: string) {
        // Datasource
        console.log('DATASOURCE start:')
        let newData: currentDatasource =  {
            id: 1,
            type: 'CSV File',
            name: 'Stocks.csv',
            description: 'Hard coded name',
            createdBy: 'Me',
            createdOn: '2017/01/01',
            refreshedBy: 'JohnM',
            refreshedOn: '2017/01/01',
            parameters: 'None'

        };
        this.isFirstTimeData = false;
        this.showDataPreview = true;
        this.currentDataset = this.fileName;
        this.currentDatasources.push(newData);
        console.log('     currentDatasources', this.currentDatasources)
    }

    clickFileSelect(action: string) {
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

        this.currentDataset = '';
        this.isFirstTimeData = false;
        
    }

    clickDatasourceRow(dsName: string) {
        this.currentDataset = dsName;
        console.log('dsName', dsName, this.filterDataset)
    }

    clickFileAddTransformationDetail() {
        this.transformationDescription = 'Format date, ie YYYY/MM/DD'
        this.showTransformDetail = true;
    }

    clickFileAddTransformation() {
        let newTransformation: currentTransformation = {
            id: 2,
            category: 'Format',
            name: 'Format Date',
            description: 'bla-bla-bla',
            fieldID: 21,
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
        this.showTransform = false;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowTransform() {
        this.showIdentifyFile = false;
        this.showTransform = true;
        this.showPivot = false;
        this.showView = false;
    }

    clickShowPivot() {
        this.showIdentifyFile = false;
        this.showTransform = false;
        this.showPivot = true;
        this.showView = false;
    }

    clickShowView() {
        this.showIdentifyFile = false;
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
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewSummaryGraphs = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewFieldProperties') {
            this.gridViewOverview = false;
            this.gridViewFieldProperties = true;
            this.gridViewExplain = false;
            this.gridViewSummaryGraphs = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewExplain') {
            this.gridViewOverview = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = true;
            this.gridViewSummaryGraphs = false;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewSummaryGraphs') {
            this.gridViewOverview = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewSummaryGraphs = true;
            this.gridViewDataQuality = false;
        }
        if (area == 'gridViewDataQuality') {
            this.gridViewOverview = false;
            this.gridViewFieldProperties = false;
            this.gridViewExplain = false;
            this.gridViewSummaryGraphs = false;
            this.gridViewDataQuality = true;
        }

    }

    clickTest() {
        console.log('currentData', this.currentData[0])
        let result: any;
        result = this.globalFunctionService.convertArrayToPivot(this.currentData);
        console.log(result);
    }

}
