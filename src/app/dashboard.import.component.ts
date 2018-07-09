/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

// Vega
import * as dl from 'datalib';

@Component({
    selector: 'dashboard-import',
    templateUrl: './dashboard.import.component.html',
    styleUrls: ['./dashboard.import.component.css']
})
export class DashboardImportComponent implements OnInit {

    @Output() formDashboardImportClosed: EventEmitter<string> = new EventEmitter();

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

    dashboards: Dashboard[];
    errorMessage: string = "";
    fileName: string = 'asdf.txt';
    folderName: string = '/home/jannie/Downloads/';
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
    }

    clickImport() {
        // Import D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickImport', '@Start');

        // Reset
        this.errorMessage = '';

        // Get the folder and file, setting some defaults
        if (this.folderName == ''  ||  this.folderName == undefined) {
            this.errorMessage = 'The folder name is compulsory';
            return;
        };
        if (this.fileName ==''  ||  this.fileName == undefined) {
            this.errorMessage = 'The file name is compulsory';
            return;
        };

        let filePath: string = this.folderName + this.fileName;

        let fileSuffix = this.fileName.substr(this.fileName.lastIndexOf('.')+1,this.fileName.length-this.fileName.indexOf('.'));

        dl.json({url: filePath}, {}, (err, currentData) => {
            if (err) {
                this.errorMessage = 'Error loading file: ' + err.status + ':' + err.statusText;
                this.errorMessage = 'Error loading file';
            } else {
                // Callback
                this.fileLoadedCallback(fileSuffix, currentData);
            }
        });
    }

    fileLoadedCallback(fileSuffix: string, currentData: any) {
        // Handles callback from async datalib load
        this.globalFunctionService.printToConsole(this.constructor.name,'fileLoadedCallback', '@Start');

        // Load
        console.log('xx currentData', currentData)
    }

    clickClose(action: string) {
        // Close form, importing nothing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardImportClosed.emit(action);
    }
}
