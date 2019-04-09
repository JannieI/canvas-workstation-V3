/*
 * Import a new datasources from a File.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';


@Component({
    selector: 'data-direct-import',
    templateUrl: './data.direct.import.component.html',
    styleUrls:  ['./data.direct.import.component.css']
})
export class DataDirectImportComponent implements OnInit {

    @Output() formDataDirectImportClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    currentData: any = [];
    datasourceName: string = '';
    datasourceDescription: string = '';
    errorMessage: string = '';
    fileName: string = 'datasource.sharePrices.json';
    folderName: string = './assets/';
    importedDatasource: Datasource;
    reader = new FileReader();
    theFile: any;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickFileBrowse() {
        // Browse for file to import
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFileBrowse', '@Start');

        if ( (<any>window).File && (<any>window).FileReader && (<any>window).FileList && window.Blob) {
            console.warn('xx Start Great success! All the File APIs are supported.')
          } else {
            alert('The File APIs are not fully supported in this browser.');
        };

        // TODO alert('Later: File component to browse ...')
        var inp: any = document.getElementById("get-files");

        // Return if nothing selected
        if (inp.files.length === 0) {
            return;
        };

        // Access and handle the files
        this.theFile = inp.files[0];

        // Read file as Text

        this.reader.onerror = this.errorHandler;
        this.reader.onprogress = this.updateProgress;
        this.reader.onload = (theFile) =>{ this.loadFile(theFile) };

        // Read in the image file as a data URL.
        this.reader.readAsText(this.theFile);
    }

    loadFile(theFile) {
        // Callback for loading File
        console.warn('loadFile', '@Start');
        
        this.currentData = theFile.target.result;
        this.importedDatasource = JSON.parse(JSON.parse(theFile.target.result));
        this.datasourceName = this.importedDatasource.name;
        this.datasourceDescription = this.importedDatasource.description;
        
    }

    abortRead() {
        this.reader.abort();
    }

    errorHandler(evt) {
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
                // progress.style.width = percentLoaded + '%';
                // progress.textContent = percentLoaded + '%';
            };
        };
    }

    clickClose(action: string) {
        // Close form, nothing imported
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectImportClosed.emit(action);

    }

    clickDSAdd() {
        // Close form, add imported DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSAdd', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.datasourceName === '') {
            this.errorMessage = 'Name of the Datasource is compulsory';
            return;
        };
        if (this.datasourceDescription === '') {
            this.errorMessage = 'Description of the Datasource is compulsory';
            return;
        };

        // Prepare, add to DB and close form
        let datasource: Datasource = this.importedDatasource;
        datasource.id = null;
        datasource.name = this.datasourceName;
        datasource.description = this.datasourceDescription;
        this.globalVariableService.addResource('datasources', datasource)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.import addResource: ' + err);
            });


        this.formDataDirectImportClosed.emit('Added');

    }
}


