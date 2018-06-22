/*
 * Create a new datasources from a File.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Dataset }                    from './models';
import { Datasource }                 from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';


@Component({
    selector: 'data-direct-file',
    templateUrl: './data.direct.file.component.html',
    styleUrls:  ['./data.direct.file.component.css']
})
export class DataDirectFileComponent implements OnInit {

    @Input() selectedDatasource: Datasource;
 
    @Output() formDataDirectFileClosed: EventEmitter<string> = new EventEmitter();

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

    theFile: string = 'Brws';
    existingDSName: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        if (this.selectedDatasource == null) {
            this.selectedDatasource = {
                id: 0,
                type: '',
                subType: '',
                typeVersion: '',
                name: '',
                username: '',
                password: '',
                description: '...',
                createdBy: '',
                createdOn: '',
                createMethod: 'directFile',
                editor: '',
                dateEdited: '',
                refreshedBy: '',
                refreshedOn: '',
                dataFieldIDs: [0],
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                parameters: '',
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                connectionID: 0,
                dataTableID: 0,
                nrWidgets: 0,
                databaseName: '',
                port: '',
                serverType: '',
                serverName: '',
                dataTableName: '',
                dataSQLStatement: '',
                dataNoSQLStatement: '',
                businessGlossary: '',
                dataDictionary: ''
            };
        }

        // Load from global variables
        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.datasources = this.globalVariableService.datasources.slice();
    }

    clickFileBrowse() {
        // Browse local folders
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx strt Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");
        
        // Access and handle the files 

        for (var i = 0; i < inp.files.length; i++) {
            let file = inp.files[i];
            console.warn('xx file', this.theFile, file.name, file.type, file.size, file.lastModifiedDate, file.lastModifiedDate.toLocaleDateString()
        )
            // do things with file
        }
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

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectFileClosed.emit(action);

    }

    clickDSAdd() {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSAdd', '@Start');

        let today =new Date();

        // New Datasource
        let newData: Datasource =  {
            id: null,
            name: this.fileName,
            username: '',
            password: '',
            type: 'File',
            subType: 'CSV',
            typeVersion: 'Comma-Separated',
            description: 'Hard coded name',
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: this.globalVariableService.formatDate(today),
            createMethod: 'DirectFile',
            editor: '',
            dateEdited: '',
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedOn: this.globalVariableService.formatDate(today),
            dataFieldIDs: [0],
            dataFields: this.dataFieldNames,
            dataFieldTypes: this.dataFieldTypes,
            dataFieldLengths: this.dataFieldLengths,
            parameters: 'None',
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: 1,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            connectionID: 0,
            dataTableID: 0,
            nrWidgets: 0,
            databaseName: '',
            port: '',
            serverType: '',
            serverName: '',
            dataTableName: '',
            dataSQLStatement: '',
            dataNoSQLStatement: '',
            businessGlossary: '',
            dataDictionary: ''

        };

        // General var with name - used in *ngIF, etc
        if (this.existingDSName == '') {
            this.currentDatasetName = this.fileName;
        } else {
            this.currentDatasetName = this.existingDSName;
        }
        this.existingDSName = '';

        // Add to all DS (DB, global), for later use
        this.globalVariableService.addDatasource(newData).then(res => {
            this.currentDatasources = this.globalVariableService.currentDatasources.slice()

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
                datasourceID: res.id,
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
                        console.warn('xx ----------')
                        console.warn('xx added data', dat)
                    });
                });
                this.globalVariableService.saveLocal('Dataset', newdSet);
            } else {
                // Add to CurrentDatasets
                if (dsCurrIDs.indexOf(newdSetID) < 0) {
                    this.globalVariableService.currentDatasets.push(newdSet);
                };
            };




            console.warn('xx ----------')
            console.warn('xx @end newdSet-datasets-currentDatasets', newdSet, this.globalVariableService.datasets,
            this.globalVariableService.currentDatasets)

            // Reset data related to this DS
            console.warn('xx currDS, gv.currDS', this.currentDatasources , this.globalVariableService.currentDatasources)
            this.currentDatasources = this.globalVariableService.currentDatasources.slice();

            console.log('done DS:', this.currentDatasources, this.globalVariableService.datasources)
        });
    
    }

    clickTransformation() {
        // Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTransformation', '@Start');

        this.formDataDirectFileClosed.emit('Transformation');

    }
}


