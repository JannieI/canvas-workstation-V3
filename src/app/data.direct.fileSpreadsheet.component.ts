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


@Component({
    selector: 'data-direct-fileSpreadsheet',
    templateUrl: './data.direct.fileSpreadsheet.component.html',
    styleUrls:  ['./data.direct.fileSpreadsheet.component.css']
})
export class DataDirectFileSpreadsheetComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectFileSpreadsheetClosed: EventEmitter<Datasource> = new EventEmitter();

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

    currentData: any = [];
    currentDatasetName: string;
    currentDatasources: Datasource[] = [];
    dataArray: any;
    dataFieldLengths: number[] = [];
    dataFieldNames: string[] = ['ColA','ColB'];
    dataFieldTypes: string[] = [];
    datasources: Datasource[];
    datasourceName: string = '';
    datasourceDescription: string = '';
    errorMessage: string = "";
    existingDSName: string = '';
    fileName: string = '';
    finalFields: any = [];
    folderName: string = '';
    reader = new FileReader();
    selectedFile: boolean = true;
    theFile: any;
    worksheets: string[] = [];
    worksheetColumns: any[] = [];
    fields: string[] = [];
    loadedFile: any;

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
                createdOn: null,
                createMethod: 'directFileSpreadsheet',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedOn: null,
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
                webUrl: '',
                webTableIndex: '',
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
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                businessGlossary: '',
                dataDictionary: ''
            };
        } else {
            this.fileName = this.selectedDatasource.fileName;
        };

        // Load from global variables
        this.currentDatasources = this.globalVariableService.currentDatasources.slice();
        this.datasources = this.globalVariableService.datasources.slice();
    }

    clickFileBrowse() {
        // Browse local folders
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx Start Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length == 0) {
            return;
        };

        // Access and handle the files
        this.theFile = inp.files[0];
        this.fileName = this.theFile.name
        console.warn('xx pre readAsBinaryString', this.theFile, this.theFile.name, this.theFile.type, this.theFile.size, this.theFile.lastModifiedDate, this.theFile.lastModifiedDate.toLocaleDateString())

        // Read file as Binary
        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (theFile) =>{ this.inspectFile(theFile) };

        // Read in the image file as a data URL.
        this.reader.readAsBinaryString(this.theFile);
        console.warn('xx Post readAsBinaryString')
    }

    inspectFile(loadedFile) {
        console.warn('  Begin inspectFile for ', loadedFile)
        this.loadedFile = loadedFile;
        // Create spec for Tributary, and then submit to Inspector
        let specification = {
            "source": {
                "inspector": "tributary.inspectors.spreadsheet:XlsxInspector",
                "specification": {
                    "content": btoa(loadedFile.target.result)
                }
            }
        };
        this.globalVariableService.getTributaryInspect(specification).then(res => {
            console.warn('xx inspect from Trib', res) 
            this.worksheets = [];
            res.forEach(row => {
                this.worksheets.push(row.name);
                this.worksheetColumns.push(row.fields);
            });
            console.warn('xx fields', this.worksheetColumns)
        });
    }

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
        console.warn('xx progress')

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

    clickWorksheet(index: number) {
        // Load the Fields/Columns for a selected Worksheet
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWorksheet',           '@Start');

        this.fields = this.worksheetColumns[index].map(cols => cols.name);
        console.warn('xx fields ', this.fields)
    }

    loadFile(loadedFile) {
        console.warn('  begin loadFile', loadedFile, this.theFile)

        // skip_rows = [number = rows to skip, string = ignore rows that starts with this]
        // First row = 0
        // headers = single integer to indicate the header, array of strings = use THIS text
        // let specification: any = {
        //     "source": {
        //         "connector": "tributary.connectors.spreadsheet:XlsxConnector",
        //         "specification": {
        //             "content":  btoa(theFile.target.result),
        //             "headers": 0,
        //             "skip_rows": []
        //         }
        //     }
        // };
        // this.globalVariableService.getTributaryData(specification).then(res => {
        //     console.warn('xx data from Trib', res) 
        // });

        // Create spec for Tributary, and then submit to Inspector
        let specification = {
            "source": {
                "inspector": "tributary.inspectors.spreadsheet:XlsxInspector",
                "specification": {
                    "content": btoa(loadedFile.target.result)
                }
            }
        };
        this.globalVariableService.getTributaryInspect(specification).then(res => {
            console.warn('xx inspect from Trib', res) 
            this.worksheets = [];
            this.worksheetColumns = [];
            res.forEach(row => {
                this.worksheets.push(row.name);
                this.worksheetColumns.push(row.fields);
            });
            console.warn('xx fields', this.worksheetColumns)
        });

        
        console.warn('  end loadFile', loadedFile, this.theFile)
    }

    clickDSPreview() {
        // Load the new DS in the ID section, and show in Preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview',           '@Start');

        console.warn('xx this.loadedFile', this.loadedFile)
        // Reset
        this.errorMessage = '';

        // Validation
        if (this.fileName == ''  ||  this.fileName == null) {
            this.errorMessage = 'Please enter a file name  OR  select one using the Browse button';
            return;
        };
        // skip_rows = [number = rows to skip, string = ignore rows that starts with this]
        // First row = 0
        // headers = single integer to indicate the header, array of strings = use THIS text
        let specification: any = {
            "source": {
                "connector": "tributary.connectors.spreadsheet:XlsxConnector",
                "specification": {
                    "content":  btoa(this.loadedFile.target.result),
                    "headers": 0,
                    "skip_rows": []
                }
            }
        };
        this.globalVariableService.getTributaryData(specification).then(res => {
            console.warn('xx data from Trib', res) 
            this.currentData = res;
        });
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectFileSpreadsheetClosed.emit(null);

    }

    clickAdd(action: string) {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.folderName == ''  ||  this.folderName == null) {
            this.errorMessage = 'Please enter a folder  OR  select one using the Browse button';
            return;
        };
        if (this.fileName == ''  ||  this.fileName == null) {
            this.errorMessage = 'Please enter a file name  OR  select one using the Browse button';
            return;
        };

        let today = new Date();

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
            createdOn: today,
            createMethod: 'directFile',
            editor: '',
            dateEdited: null,
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedOn: today,
            dataFieldIDs: [0],
            dataFields: this.dataFieldNames,
            dataFieldTypes: this.dataFieldTypes,
            dataFieldLengths: this.dataFieldLengths,
            parameters: 'None',
            folder: '',
            fileName: this.fileName,
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: 1,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            webUrl: '',
            webTableIndex: '',
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
            dataNeo4jStatement: '',
            dataGraphQLStatement: '',
            businessGlossary: '',
            dataDictionary: ''

        };

        // General var with name - used in *ngIF, etc
        if (this.existingDSName == '') {
            this.currentDatasetName = this.fileName;
        } else {
            this.currentDatasetName = this.existingDSName;
        };
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

        if (action == 'Saved') {
            this.formDataDirectFileSpreadsheetClosed.emit(null);
        } else {
            this.formDataDirectFileSpreadsheetClosed.emit(this.selectedDatasource);
        };
    }
}


