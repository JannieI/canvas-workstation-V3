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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    datasources: Datasource[];
    errorMessage: string = '';
    fileName: string = '';
    selectedDatasource: Datasource = null;
    selectedRowIndex: number;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.globalVariableService.getResource('datasources')
        .then(res => {
            this.datasources = res;
        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in Datasource.export reading datasources: ' + err);
        });        
    }

    clickSelectedDatasource(index: number, id: number) {
        // User selected a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource',           '@Start');

        this.selectedDatasource = this.datasources[index];
        this.selectedRowIndex = index;

    }

    saveText(text, filename){
        // Actual Export of selected DS to a file by creating <a> tag
        this.globalFunctionService.printToConsole(this.constructor.name,'saveText',           '@Start');

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    clickExport() {
        // Export selected DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport',           '@Start');

        // Reset
        this.errorMessage = '';

        // Validate
        if (this.selectedDatasource == null) {
            this.errorMessage = "First select a Datasource by clicking on it, then try again.";
            return;
        };
        if (this.fileName == null  ||  this.fileName === '') {
            this.errorMessage = "The file name is compulsory";
            return;
        };
        
        // Export
        var obj = JSON.stringify(this.selectedDatasource);  
        this.saveText(JSON.stringify(obj), this.fileName);

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectExportClosed.emit(action);

    }

}


