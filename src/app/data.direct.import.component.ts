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

// Vega
import * as dl from 'datalib';


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
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    currentData: any = [];
    datasourceName: string = '';
    datasourceDescription: string = '';
    errorMessage: string = "";
    fileName: string = 'datasource.sharePrices.json';
    folderName: string = './assets/';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickDSPreview() {
        // Load the new DS in the ID section, and show in Preview area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSPreview',           '@Start');

        // Reset
        this.errorMessage = '';

        let filePath: string = this.folderName + this.fileName;
        let fileSuffix = this.fileName.substr(this.fileName.lastIndexOf('.')+1,this.fileName.length-this.fileName.indexOf('.'));

        if (fileSuffix == 'json') {
            dl.json({url: filePath}, {}, (err, currentData) => {
                if (err) {
                    this.errorMessage = err.status + ':' + err.statusText;

                    console.log('DataPopup clickDSPreview error on load', err)
                } else {
                    // Callback
                    this.fileLoadedCallback(currentData);
                }
            });
        };

        // Message when file type unknown
        if (fileSuffix != 'json') {
            this.errorMessage = 'File type must be .json';
        };
    }

    fileLoadedCallback(currentData: any) {
        // Handles callback from async datalib load
        this.globalFunctionService.printToConsole(this.constructor.name,'fileLoadedCallback', '@Start');

        // Load
        console.log('DataPopup clickDSPreview LOAD start:', currentData)
        this.currentData = JSON.parse(JSON.stringify(currentData));
        let obj = JSON.parse(this.currentData);
        console.warn('xx obj', obj.dataFieldTypes)
        // JSON.parse(JSON.stringify(resolvedData));

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
        if (this.datasourceName == '') {
            this.errorMessage = 'Name of the Datasource is compulsory';
            return;
        };
        if (this.datasourceDescription == '') {
            this.errorMessage = 'Description of the Datasource is compulsory';
            return;
        };

        // Prepare, add to DB and close form
        let datasource: Datasource = JSON.parse(this.currentData);
        datasource.id = null;
        datasource.name = this.datasourceName;
        datasource.description = this.datasourceDescription;
        this.globalVariableService.addDatasource(datasource);

        this.formDataDirectImportClosed.emit('Added');

    }
}


