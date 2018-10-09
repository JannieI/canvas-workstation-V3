/*
 * Create a new datasources from a CSV File.
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


@Component({
    selector: 'data-direct-fileCSV',
    templateUrl: './data.direct.fileCSV.component.html',
    styleUrls:  ['./data.direct.fileCSV.component.css']
})
export class DataDirectFileCSVComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectFileCSVClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

    canSave: boolean = false;
    errorMessage: string = "";
    fields: string[] = [];
    // fileColumns: any[] = [];
    fileData: any = [];
    fileDataFull: any = [];
    // files: string[] = [];
    headerRow: string = '0';
    loadedFile: any;
    loadedFileName: string = '';
    newDataFieldTypes: string[] = [];
    newDescription: string = '';
    newName: string = '';
    reader = new FileReader();
    savedMessage: string = '';
    totalRows: number = 0;
    // theFile: any;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        if (this.selectedDatasource != null) {
            console.warn('xx this.selectedDatasource', this.selectedDatasource)
            this.newName = this.selectedDatasource.name;
            this.newDescription = this.selectedDatasource.description;
            this.loadedFileName = this.selectedDatasource.fileName;
        };

    }

    clickFileBrowse() {
        // Browse local folders
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx Start Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // Reset
        this.errorMessage = '';
        this.fileData = [];
        this.fileDataFull = [];
        this.fields = [];
        this.canSave = false;

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length == 0) {
            return;
        };

        // Get the File Name
        this.loadedFileName = inp.files[0].name

        // Set the Call Back routines
        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (selectedInputFile) => {
            this.loadedFile = selectedInputFile;
            this.loadFileContent()
        };

        // Read the file as binary
        this.reader.readAsBinaryString(inp.files[0]);
    }

    // inspectFile(loadedFile) {
    //     console.warn('  Begin inspectFile for ', loadedFile)

    //     // Remember for loading
    //     this.loadedFile = loadedFile;

    //     // Set up specification for csv file type
    //     let specification: any;
    //     let lastFour: string = this.loadedFileName.slice(-4);

    //     if (lastFour.toLowerCase() == '.csv') {
    //         console.warn('xx Tributary Inspect csv')

    //         specification = {
    //             "source": {
    //                 "inspector": "tributary.inspectors.csv:CsvInspector",
    //                 "specification": {
    //                     "content":  this.loadedFile.target.result
    //                 }
    //             }
    //         };
    //     } else {
    //         this.errorMessage = 'Invalid file extension (must be .csv)';
    //         return;
    //     };

    //     // Call Tributary
    //     this.globalVariableService.getTributaryInspect(specification).then(res => {
    //         // this.files = [];
    //         console.warn('xx Tributary Inspect res', res)
    //         res.forEach(row => {
    //             // this.files.push(row.name);
    //             // this.fileColumns.push(row.fields);
    //         });

    //         // if (this.files.length > 0) {
    //         //     this.loadFileContent(0);
    //         // };
    //     })
    //     .catch(err => {
    //         this.errorMessage = err.message;
    //     });
    // }

    abortRead() {
        this.reader.abort();
        console.warn('xx abort')
    }

    errorHandler(evt) {
        console.warn('xx error')
        switch(evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
          case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
          case evt.target.error.ABORT_ERR:
            break; // noop
          default:
            alert('An error occurred reading this file.');
        };
    }

    updateProgress(evt) {
        // console.warn('xx progress')

        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                console.warn('xx % loaded', percentLoaded)
                // progress.style.width = percentLoaded + '%';
                // progress.textContent = percentLoaded + '%';
            };
        };
    }

    loadFileContent() {
        // Load the File content
        this.globalFunctionService.printToConsole(this.constructor.name,'loadFileContent',           '@Start');

        // Read file content into an Array: split on NewLine, then Comma
        let arr: any = this.loadedFile.target.result.split(/\r?\n/).map(x => x.split(","));

        // Fill the list of Fields
        this.fields = arr[+this.headerRow]

        // Fill the data
        this.fileData = arr.slice(+this.headerRow + 1, +this.headerRow + 10);
        this.fileDataFull = arr.slice(+this.headerRow + 1, arr.length - 2);

        // Can Add now
        this.canSave = true;

        // Convert Array to JSON
        let arr2:any[] = [];
        let fields = this.fields;
        for (var i = +this.headerRow + 1; i < arr.length; i++) {
            let obj: any = {};
            arr[i].forEach(function(value, idx) {
                obj[ fields[idx] ] = value
            });
            arr2.push(obj);
        }

        let arr3: any = JSON.parse(JSON.stringify(arr2))

        this.fileDataFull = arr3.slice(+this.headerRow, +this.headerRow + 10);

        this.fileDataFull = arr3.slice(+this.headerRow, arr3.length - 1);

        this.totalRows = this.fileDataFull.length;


        // Guess types
        for (var i = 0; i < arr[+this.headerRow + 1].length; i++) {
            let newType: string = 'string';

            if (typeof arr[+this.headerRow + 1][i] == 'number') {
               newType = 'number';
            } else if (typeof arr[+this.headerRow + 1][i] == 'boolean') {
                   newType = 'boolean';
            } else if (arr[+this.headerRow + 1][i] == 'true') {
               newType = 'boolean';
            } else if (arr[+this.headerRow + 1][i] == 'false') {
               newType = 'boolean';
            } else if (arr[+this.headerRow + 1][i] == +arr[+this.headerRow + 1][i]) {
               newType = 'number';
            } else {
               newType = 'string';
            };

            this.newDataFieldTypes.push(newType);
        };
        console.warn('xx', this.newDataFieldTypes);

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectFileCSVClosed.emit(null);

    }

    clickAdd() {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        this.errorMessage = '';
        if (this.newName == '') {
            this.errorMessage = 'Please enter a Name for the Datasource';
            return;
        };
        if (this.newDescription == '') {
            this.errorMessage = 'Please enter a Description for the Datasource';
            return;
        };
        if (this.loadedFileName == ''  ||  this.loadedFileName == null) {
            this.errorMessage = 'Please select a file using the Browse button';
            return;
        };

        // Construct DS and add to DB
        let today: Date = new Date();

        // Guess types
        let newDataFieldTypes: string[] = [];
        for (var i = 0; i < this.fileDataFull[+this.headerRow + 1].length; i++) {
        this.fileDataFull[+this.headerRow + 1][i]

        }


        if (this.selectedDatasource != null) {

            // Mark the changes
            this.selectedDatasource.name = this.newName;
            this.selectedDatasource.description = this.newDescription;
            this.selectedDatasource.webUrl = '';
            this.selectedDatasource.webTableIndex = '';
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;
            this.selectedDatasource.dataFields = this.fields;
            this.selectedDatasource.dataFieldTypes = this.newDataFieldTypes;

            // Save DS to DB, but create a new dSet and new data records.
            let ds: number[] = [];
            let dSetID: number = 1;
            for (var i = 0; i < this.globalVariableService.datasets.length; i++) {
                if(this.globalVariableService.datasets[i].datasourceID ==
                    this.selectedDatasource.id) {
                    ds.push(this.globalVariableService.datasets[i].id)
                };
            };
            if (ds.length > 0) {
                dSetID = Math.max(...ds);
            };
            let datasetIndex: number = this.globalVariableService.datasets.findIndex(dSet => {
                if (dSet.id == dSetID) {
                    return dSet;
                };
            });
            let updatedDataset: Dataset = this.globalVariableService.datasets[datasetIndex];

            let dataID: number = -1;
            let dataIndex: number = updatedDataset.url.indexOf('/');
            if (dataIndex >= 0) {
                dataID = +updatedDataset.url.substring(dataIndex + 1);
            } else {
                alert('Error in save Web - url has no / character');
                return;
            };
            let updatedData: any = {
                id: dataID,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.saveData(updatedData).then(resData => {

                updatedDataset.url = 'data/' + dataID;
                this.globalVariableService.saveDatasource(this.selectedDatasource).then(
                    resDS => {
                        updatedDataset.datasourceID = this.selectedDatasource.id;
                        this.globalVariableService.saveDataset(updatedDataset);
                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource updated';
            });

        } else {
            // Add new one
            let newDatasource: Datasource = {
                id: null,
                type: 'File',
                subType: 'csv',
                typeVersion:  '',
                name: this.newName,
                username: '',
                password: '',
                description: this.newDescription,
                dataFieldIDs: [],
                dataFields: this.fields,
                dataFieldTypes: this.newDataFieldTypes,
                dataFieldLengths: [],
                parameters: '',
                accessType: 'Private',
                cacheResultsOnServer: true,
                unRefreshable: true,
                nrCacheCopies: 999,
                cacheResultsLocal: false,
                oldnessMaxPeriodInterval: '',
                oldnessMaxPeriodUnits: 0,
                oldnessRelatedDate: '',
                oldnessRelatedTime: '',
                refreshedLocalOn: null,
                createMethod: 'directFileCSV',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                folder: '',
                fileName: this.loadedFileName,
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                webUrl: '',
                webTableIndex: '',
                connectionID: null,
                dataTableID: null,
                businessGlossary: 'Obtained from CSV File' + this.loadedFileName ,
                dataDictionary: '',
                databaseName: '',
                port: '',
                serverType: '',
                serverName: '',
                dataTableName: '',
                dataSQLStatement: '',
                dataNoSQLStatement: '',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                dataOverlaySpecification: '',
                nrWidgets: null
            };

            let newdDataset: Dataset = {
                id: null,
                datasourceID: null,
                sourceLocation: 'HTTP',
                url: 'data',
                folderName: '',
                fileName: this.loadedFileName,
                cacheServerStorageID: null,
                cacheLocalStorageID: null,
                isLocalDirty: null,
                data: [],
                dataRaw: []
            };
            let newData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.addData(newData).then(resData => {

                newdDataset.url = 'data/' + resData.id.toString();
                this.globalVariableService.addDatasource(newDatasource).then(resDS => {
                    newdDataset.datasourceID = resDS.id;
                    this.globalVariableService.addDataset(newdDataset);

                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource created';
            });
        };




    }
}


