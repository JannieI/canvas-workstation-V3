/*
 * Create a new datasources from a Spreadsheet.
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
            this.clickClose();
            return;
        };

    }

    canSave: boolean = false;
    errorMessage: string = "";
    fields: string[] = [];
    fileName: string = '';
    headerRow: string = '0';
    loadedFile: any;
    newDescription: string = '';
    newName: string = '';
    reader = new FileReader();
    savedMessage: string = '';
    theFile: any;
    selectedWorksheetRowIndex: number;
    worksheetColumns: any[] = [];
    worksheetData: any = [];
    worksheetDataFull: any = [];
    worksheets: string[] = [];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (!this.selectedDatasource == null) {
            this.fileName = this.selectedDatasource.fileName;
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
        this.worksheetColumns = [];
        this.worksheets = [];
        this.worksheetData = [];
        this.fields = [];
        this.canSave = false;

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length == 0) {
            return;
        };

        // Access and handle the files
        this.theFile = inp.files[0];
        this.fileName = this.theFile.name

        // Read file as Binary
        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (theFile) =>{ this.inspectFile(theFile) };

        // Read in the image file as a data URL.
        this.reader.readAsBinaryString(this.theFile);
    }

    inspectFile(loadedFile) {
        console.warn('  Begin inspectFile for ', loadedFile)

        this.loadedFile = loadedFile;
        
        // Set up Tributary specification according to file type
        let specification: any;
        let lastFive: string = this.fileName.slice(-5);
        if (lastFive.toLowerCase() == '.xlsx') {
            console.warn('xx xlsx')
            specification = {
                "source": {
                    "inspector": "tributary.inspectors.spreadsheet:XlsxInspector",
                    "specification": {
                        "content": btoa(loadedFile.target.result)
                    }
                }
            };
        } else {
            let lastFour: string = this.fileName.slice(-4);
        
            if (lastFour.toLowerCase() == '.xls') {
                console.warn('xx xls')

                specification = {
                    "source": {
                        "inspector": "tributary.inspectors.spreadsheet:XlsInspector",
                        "specification": {
                            "content": btoa(loadedFile.target.result)
                        }
                    }
                };
            } else if (lastFour.toLowerCase() == '.ods') {
                console.warn('xx ods')

                specification = {
                    "source": {
                        "inspector": "tributary.inspectors.spreadsheet:OdsInspector",
                        "specification": {
                            "content": btoa(loadedFile.target.result)
                        }
                    }
                };
            } else {
                this.errorMessage = 'Invalid file extension (must be .xlsx .xls .ods)';
                return;
            };
        };

        this.globalVariableService.getTributaryInspect(specification).then(res => {
            this.worksheets = [];
            res.forEach(row => {
                this.worksheets.push(row.name);
                this.worksheetColumns.push(row.fields);
            });

            if (this.worksheets.length > 0) {
                this.clickWorksheet(0);
            };
        })
        .catch(err => {
            this.errorMessage = err.message;
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

        // Set highlighted row
        this.selectedWorksheetRowIndex = index;
        this.fields = this.worksheetColumns[index].map(cols => cols.name);

        // Can Add now
        this.canSave = true;

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.fileName == ''  ||  this.fileName == null) {
            this.errorMessage = 'Please select a file using the Browse button';
            return;
        };
        // skip_rows = [number = rows to skip, string = ignore rows that starts with this]
        // First row = 0
        // headers = single integer to indicate the header, array of strings = use THIS text
        if (this.headerRow == null  ||  this.headerRow == '') {
            this.headerRow = '0';
        };

        // Set up specification according to file type
        let specification: any;
        let lastFive: string = this.fileName.slice(-5);
        if (lastFive.toLowerCase() == '.xlsx') {
            console.warn('xx xlsx')
            specification = {
                "source": {
                    "connector": "tributary.connectors.spreadsheet:XlsxConnector",
                    "specification": {
                        "content":  btoa(this.loadedFile.target.result),
                        "headers": +this.headerRow,
                        "sheet": index,
                        "skip_rows": []
                    }
                }
            };
        } else {
            let lastFour: string = this.fileName.slice(-4);
        
            if (lastFour.toLowerCase() == '.xls') {
                console.warn('xx xls')

                specification = {
                    "source": {
                        "connector": "tributary.connectors.spreadsheet:XlsConnector",
                        "specification": {
                            "content":  btoa(this.loadedFile.target.result),
                            "headers": +this.headerRow,
                            "sheet": index,
                            "skip_rows": []
                        }
                    }
                };
            } else if (lastFour.toLowerCase() == '.ods') {
                console.warn('xx ods')

                specification = {
                    "source": {
                        "connector": "tributary.connectors.spreadsheet:OdsConnector",
                        "specification": {
                            "content":  btoa(this.loadedFile.target.result),
                            "headers": +this.headerRow,
                            "sheet": index,
                            "skip_rows": []
                        }
                    }
                };
            } else {
                this.errorMessage = 'Invalid file extension (must be .xlsx .xls .ods)';
                return;
            };
        };
        this.globalVariableService.getTributaryData(specification).then(res => {

            // Fill the data
            this.worksheetData = res.slice(0,10);
            this.worksheetDataFull = res;
        });

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectFileSpreadsheetClosed.emit(null);

    }

    clickAdd() {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

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
        if (this.fileName == ''  ||  this.fileName == null) {
            this.errorMessage = 'Please select a file using the Browse button';
            return;
        };

        // Construct DS and add to DB
        let today: Date = new Date();

        if (this.selectedDatasource != null) {
            // Mark the changes
            this.selectedDatasource.name = this.newName;
            this.selectedDatasource.description = this.newDescription;
            this.selectedDatasource.webUrl = '';
            this.selectedDatasource.webTableIndex = '';
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;
            this.selectedDatasource.dataFields = this.fields;

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
                data: this.worksheetDataFull
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
                subType: 'xlsx',
                typeVersion:  '',
                name: this.newName,
                username: '',
                password: '',
                description: this.newDescription,
                dataFieldIDs: [],
                dataFields: this.fields,
                dataFieldTypes: [],
                dataFieldLengths: [],
                parameters: '',
                cacheResultsOnServer: true,
                unRefreshable: true,
                nrCacheCopies: 999,
                cacheResultsLocal: false,
                oldnessMaxPeriodInterval: '',
                oldnessMaxPeriodUnits: 0,
                oldnessRelatedDate: '',
                oldnessRelatedTime: '',
                refreshedLocalOn: null,
                createMethod: 'directFileSpreadsheet',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                webUrl: '',
                webTableIndex: '',
                connectionID: null,
                dataTableID: null,
                businessGlossary: 'Obtained from Spreadsheet' + this.fileName ,
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
                fileName: '',
                cacheServerStorageID: null,
                cacheLocalStorageID: null,
                isLocalDirty: null,
                data: this.worksheetDataFull,
                dataRaw: this.worksheetDataFull
            };
            let newData: any = {
                id: null,
                data: this.worksheetDataFull
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


