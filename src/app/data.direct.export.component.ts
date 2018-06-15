/*
 * Import a new datasources from a File.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'data-direct-export',
    templateUrl: './data.direct.export.component.html',
    styleUrls:  ['./data.direct.export.component.css']
})
export class DataDirectExportComponent implements OnInit {

    @Output() formDataDirectExportClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[];
    currentDatasources: Datasource[] = [];
    currentData: any = [];
    dataArray: any;
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    errorMessage: string = "";
    fileName: string = '';
    folderName: string = '';
    finalFields: any = [];
    selectedFile: boolean = true;
    currentDatasetName: string;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.datasources = this.globalVariableService.datasources.slice();
    }

    clickFileBrowse() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        // TODO alert('Later: File component to browse ...')
    }

    clickDSPreview() {
        // Load the new DS in the ID section, and show in Preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview',           '@Start');

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
        var csv_data = dl.load({url: this.folderName + this.fileName});
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
 
    clickFileSaveTransformation() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileSaveTransformation', '@Start');

        // TODO - add code to Save the name for next time ...
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectExportClosed.emit(action);

    }

}


