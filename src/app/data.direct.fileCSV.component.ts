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
import { Datasource }                 from './models';

// Templates
import { datasourceTemplate }         from './templates';


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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickAdd();
            return;
        };
    }

    canSave: boolean = false;
    clearQuotes: boolean = true;
    datasourceName: string = '';
    editMessage: string = 'Note: the data have to be reloaded with Browse before clicking Save.';
    errorMessage: string = '';
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
    showMore: boolean = false;
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
            this.newName = this.selectedDatasource.name;
            this.newDescription = this.selectedDatasource.description;
            this.loadedFileName = this.selectedDatasource.fileName;
        };

        // For existing Datasource, load a snippet of the data
        if (this.selectedDatasource != null) {
            let params: string = 'datasourceID=' + this.selectedDatasource.id.toString()
                + '&nrRowsToReturn=10';
            this.globalVariableService.getData(params)
                .then(dat => {
                    this.fileData = [];
                    this.fields = Object.keys(dat[0]);
                    let row: any = [];
                    for (var i = 0; i < dat.length; i++) {
                        row = [];
                        for (var j = 0; j < this.fields.length; j++) {
                            row.push(dat[i][this.fields[j]]);
                        };
                        this.fileData.push(row)
                    };
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Datasource.csv getData: ' + err);
                });
        };

    }

    clickFileBrowse() {
        // Browse local folders
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('Great success! All the File APIs are supported in this browser.')
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
        if (inp.files.length === 0) {
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
        // See https://en.wikipedia.org/wiki/Newline#Representation for NL, CR info
        let arr: any = this.loadedFile.target.result.split(/\r\n|\n\r|\025|\n|\r/).map(x => x.split(/\",/));
        console.log('xx 1 arr[+this.headerRow];', arr[+this.headerRow])
        console.log('xx 1 arr[3];', arr[3])
        // Remove single ticks, spaces and dots from Headers
        let re = /'/gi;
        for (var col = 0; col < arr[0].length; col++) {
            arr[0][col] = arr[0][col].replace(re, '');
        };
        re = /\./gi;
        for (var col = 0; col < arr[0].length; col++) {
            arr[0][col] = arr[0][col].replace(re, '');
        };
        re = / /gi;
        for (var col = 0; col < arr[0].length; col++) {
            arr[0][col] = arr[0][col].replace(re, '');
        };
        console.log('xx 2 arr[+this.headerRow];', arr[+this.headerRow])

        // Remove extra Quote, created for example by Libre Office SaveAs CSV: ""FieldName""
        // is saved as "\"FieldName\"" in Mongo, which then causes problems when read by
        // WidgetEditor (Vega)
        re = /"/gi;
        for (var col = 0; col < arr[0].length; col++) {
            arr[0][col] = arr[0][col].replace(re, '');
        };
        console.log('xx 3 arr[+this.headerRow];', arr[+this.headerRow])

        // Clear Quotes from data according to option
        if (this.clearQuotes) {
            for (var row = 0; row < arr.length; row++) {
                for (var col = 0; col < arr[0].length; col++) {
                    if (arr[row][col] != null  &&  arr[row][col] != '') {
                        arr[row][col] = arr[row][col].replace(re, '');
                    };
                };
            };
        };
        console.log('xx 4 arr[+this.headerRow];', arr[+this.headerRow])

        // Fill the list of Fields
        this.fields = arr[+this.headerRow];
        
        // Fill the data
        this.fileData = arr.slice(+this.headerRow + 1, +this.headerRow + 10);
        this.fileDataFull = arr.slice(+this.headerRow + 1, arr.length - 2);

        // Can Add now
        this.canSave = true;

        // Convert Array to JSON
        let arr2:any[] = [];
        let fields = this.fields;
        for (var col = +this.headerRow + 1; col < arr.length; col++) {
            let obj: any = {};
            arr[col].forEach(function(value, idx) {
                obj[ fields[idx] ] = value
            });
            arr2.push(obj);
        }

        let arr3: any = JSON.parse(JSON.stringify(arr2))

        this.fileDataFull = arr3.slice(+this.headerRow, +this.headerRow + 10);

        this.fileDataFull = arr3.slice(+this.headerRow, arr3.length - 1);

        this.totalRows = this.fileDataFull.length;


        // Guess types
        for (var col = 0; col < arr[+this.headerRow + 1].length; col++) {
            let newType: string = 'string';

            if (typeof arr[+this.headerRow + 1][col] === 'number') {
               newType = 'number';
            } else if (typeof arr[+this.headerRow + 1][col] === 'boolean') {
                   newType = 'boolean';
            } else if (arr[+this.headerRow + 1][col] === 'true') {
               newType = 'boolean';
            } else if (arr[+this.headerRow + 1][col] === 'false') {
               newType = 'boolean';
            } else if (arr[+this.headerRow + 1][col] === +arr[+this.headerRow + 1][col]) {
               newType = 'number';
            } else {
               newType = 'string';
            };

            this.newDataFieldTypes.push(newType);
        };

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectFileCSVClosed.emit(null);

    }

    clickAdd() {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.editMessage = '';
        this.errorMessage = '';
        this.savedMessage = '';

        // Validation
        if (this.newName === '') {
            this.errorMessage = 'Please enter a Name for the Datasource';
            return;
        };
        if (this.newDescription === '') {
            this.errorMessage = 'Please enter a Description for the Datasource';
            return;
        };
        if (this.loadedFileName === ''  ||  this.loadedFileName == null) {
            this.errorMessage = 'Please select a file using the Browse button';
            return;
        };
        this.fields.forEach(f => {
            if (f.indexOf(' ') >= 0) {
                if (this.errorMessage === '') {
                    this.errorMessage = "Field Name '" + f + "' containts a space.  Please correct and reload.";
                } else {
                    this.errorMessage = "More than one field Name contain spaces.  Please correct and reload."
                };
            };
        })

        if (this.errorMessage != '') {
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

            let updatedData: any = {
                id: this.selectedDatasource.id,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.saveDatasource(
                this.selectedDatasource,
                updatedData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource updated';

                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Datasource.csv saveDatasourceNEW: ' + err);
                });
        } else {
            // Add new one
            let newDatasource: Datasource = datasourceTemplate;
            console.log('xx newDatasource', newDatasource)
            newDatasource.type = 'File';
            newDatasource.subType = 'csv';
            newDatasource.name = this.newName;
            newDatasource.description = this.newDescription;
            newDatasource.dataFields = this.fields;
            newDatasource.dataFieldTypes = this.newDataFieldTypes;
            newDatasource.serverExpiryDateTime = this.globalVariableService.dateAdd(today, 'day', 2);
            newDatasource.createdBy = this.globalVariableService.currentUser.userID;
            newDatasource.createdOn = today;
            newDatasource.fileName = this.loadedFileName;
            newDatasource.businessGlossary = 'Obtained from CSV File' + this.loadedFileName ;
            newDatasource.encoding = 'Ascii';
            newDatasource.createMethod = 'directFileCSV';
                
            let newData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.addDatasource(
                newDatasource,
                newData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource created';

                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Datasource.csv addDatasourceNEW: ' + err);
                });
        };

    }

    clickMoreOpen() {
        // Show the More form for further info and actions
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoreOpen', '@Start');

        this.showMore = true;
    }

    clickMoreClose() {
        // Close the More form for further info and actions
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoreClose', '@Start');

        this.showMore = false;
    }
}

