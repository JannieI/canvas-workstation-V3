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
    
    dataArray: any;
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    dataUniqueInColumn: string[] = [];

    currentTransformations: currentTransformation[];
    currentDataset: string = '';

    errorMessage: string = "";
    fields: field[];
    fieldsMetadata: fieldMetadata[];
    isFirstTimeData: boolean;
    pivotData: string = '';
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

    selectedExistingDS: boolean = false;
    selectedExistingTransform: boolean = false;
    selectedDatasource: boolean = true;
    selectedOverallTransform: boolean = false;
    selectedFieldTransform: boolean = false;
    selectedFieldProperties: boolean = false;
    selectedSummary: boolean = false;
    selectAddTransformation: boolean = false;

    gridViewFieldProperties: boolean = true;
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

        this.fields = this.globalVariableService.fields;
        this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
        console.log('this.isFirstTimeData', this.isFirstTimeData)
    }

    clickFilePreview() {
        this.showDataPreview = !this.showDataPreview;
        this.currentDataset = 'Newly Added Data';
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

    clickFileAdd(close: boolean) {
        // console.log(this.currentDatasources)
        // let newData: currentDatasource =  {
        //     id: 1,
        //     type: 'Excel file',
        //     name: 'Costing preparation',
        //     description: 'Costing preparation',
        //     createdBy: 'JohnM',
        //     createdOn: '2017/01/01',
        //     refreshedBy: 'JohnM',
        //     refreshedOn: '2017/01/01',
        //     parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '

        // };
        var csv_data = dl.load({url: './assets/vega-datasets/stocks.csv'});
        let startNow: number;
        // var data = dl.read(csv_data, {type: 'csv', parse: 'auto'});
        // startNow = Date.now()
        // console.log('data rows', data.length)
        // console.log('end', Date.now() - startNow)

        // var csv_data = dl.load({url: './assets/vega-datasets/stocks1.csv'});
        // var data = dl.read(csv_data, {type: 'csv', parse: 'auto'});
        // startNow = Date.now()
        // console.log('data rows', data.length)
        // console.log('end', Date.now() - startNow)
        
        // var csv_data = dl.load({url: './assets/vega-datasets/stocks2.csv'});
        // var data = dl.read(csv_data, {type: 'csv', parse: 'auto'});
        // startNow = Date.now()
        // console.log('data rows', data.length)
        // console.log('end', Date.now() - startNow)
        
        startNow = Date.now()
        console.log('LOAD data start:')
        dl.csv({url: './assets/vega-datasets/stocks.csv'},{}, (err, data) => {
            if (err) {
              console.log('error on load', err)
            } else {

                // Load
                console.log('     data hdr', data[0])
                console.log('     data rows', data.length)
                console.log('     END secs: ', (Date.now() - startNow) / 1000)
                console.log('')

                // Fields
                console.log('')
                console.log('FIELDS start:')
                startNow = Date.now()
                var dataTypes = dl.type.all(data)
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
                data.sort(dl.comparator(['+symbol', '-price']));
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
                    .execute(data);
                console.log('     groupby', this.dataArray)
                console.log('     END groupby: ', (Date.now() - startNow) / 1000)

                // Get Unique Symbols
                console.log('')
                console.log('UNIQUE start:')
                startNow = Date.now()
                var dataUniqueInColumn = dl.unique(data);
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
                    .execute(data);
                console.log('     unique', dataUniqueInColumn)
                console.log('     END unique: ', (Date.now() - startNow) / 1000)
                
                // Loop to load Array
                console.log('')
                console.log('LOOP start:')
                startNow = Date.now()
                for (var i = 0; i < this.dataArray.length; i++) {
                    let newData: currentDatasource =  {
                        id: i,
                        type: this.dataArray[i]['s'],
                        name: this.dataArray[i]['m'],
                        description: this.dataArray[i]['symbol'],
                        createdBy: i.toString(),
                        createdOn: '2017/01/01',
                        refreshedBy: 'JohnM',
                        refreshedOn: '2017/01/01',
                        parameters: this.dataArray[i]['symbol']
            
                    };
                    this.currentDatasources.push(newData);
                }
                console.log('     currentDatasources', this.currentDatasources)
                console.log('     END loop: ', (Date.now() - startNow) / 1000)

                // Preview
                console.log('')
                console.log('PREVIEW start:')
                startNow = Date.now()
                this.showDataPreview = true;
                console.log('        END preview: ', (Date.now() - startNow) / 1000)
            }
          });

        // dl.load({url: './assets/vega-datasets/stocks1.csv'}, function(err, data) {
        // if (err) {
        //     console.log('error on load')
        // } else {
        //     let data_csv = dl.read(csv_data, {type: 'csv', parse: 'auto'});
        //     console.log('data_csv', data_csv[0])
        //     console.log('data rows', data_csv.length)
        //     console.log('end secs: ', (Date.now() - startNow) / 1000)
        // }
        // });

        // var csv_data = dl.csv({url: './assets/vega-datasets/stocks3.csv'});
        // startNow = Date.now()
        // console.log('data rows', data.length)
        // console.log('end', Date.now() , startNow)

        // this.currentDatasources.push(newData);
        // this.currentDataset = newData.name;
        this.isFirstTimeData = true;
        this.isFirstTimeData = false;
        if (close) {
            this.router.navigate(['/explore']);
        };
    }

    clickDatasourceRow(dsName: string) {
        this.currentDataset = dsName;
        console.log('dsName', dsName, this.filterDataset)
    }

    clickFileAddTransformation() {
        let newTransformation: currentTransformation = {
            id: 2,
            category: 'Format',
            name: 'Trim left (Trader)',
            description: 'bla-bla-bla',
            fieldID: 21,
            fieldName: 'Trader',
            parameters: "param1=a"        
        };
        this.currentTransformations.push(newTransformation);

        this.showTransformDetail = true;
    }

    clickClose(action: string) {
        // this.formDataPopupClosed.emit(action);
        this.router.navigate(['/explore']);

    }

    clickRefreshPivot() {
        this.pivotData = 'All done !'
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
        console.log('drag_start')
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

    drop_handler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "link"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        console.log('drop_handler dropped !!', data)
    }

    drop_pivot(ev) {
        ev.preventDefault();

        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('drop_handler dropped !!')
    }

    dragover_pivot(ev) {
        console.log('dragover_handler')
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
}
