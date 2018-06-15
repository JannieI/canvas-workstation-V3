/*
 * Import a new datasources from a File.
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
    fileName: string = '';
    selectedDatasource: Datasource;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();
    }

    clickSelectedDatasource(index: number, id: number) {
        // User selected a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport',           '@Start');

        this.selectedDatasource = this.datasources[index];

    }

    saveText(text, filename){
        // Export selected DS to a file by creating <a> tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport',           '@Start');

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
      }

    clickExport() {
        // Export selected DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport',           '@Start');

        var obj = {a: "Hello", b: "World"};
        this.saveText( JSON.stringify(obj), "filename.json" );

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectExportClosed.emit(action);

    }

}


