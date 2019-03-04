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

@Component({
    selector: 'dashboard-export',
    templateUrl: './dashboard.export.component.html',
    styleUrls: ['./dashboard.export.component.css']
})
export class DashboardExportComponent implements OnInit {

    @Output() formDashboardExportClosed: EventEmitter<string> = new EventEmitter();

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
    errorMessage: string = '';
    fileName: string = '';
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {

        this.globalVariableService.getResource('dashboards')
            .then (res => {
                this.dashboards = res;
            })
            .catch(err => {
                console.error('Error in Dashboard.export reading dashboards: ' + err)
                this.errorMessage = err.slice(0, 100);
            });

    }

    clickExport() {
        // Export the image, and close the file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport', '@Start');

        // Reset
        this.errorMessage = '';

        // Validate
        if (this.fileName == null  ||  this.fileName == '') {
            this.errorMessage = "The file name is compulsory";
            return;
        };

        // Export
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardID < 0) {
            this.errorMessage = 'Unexpected error, current dashboard not found in local cache';
            return;
        };
        let dashboardIndex: number = this.dashboards.findIndex(d =>
            d.id == this.globalVariableService.currentDashboardInfo.value.currentDashboardID);
        let newD: Dashboard = this.dashboards[dashboardIndex];
        console.warn('xx d', this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
        newD)
        var obj = JSON.stringify(newD);
        this.saveText(JSON.stringify(obj), this.fileName);

  	  	this.formDashboardExportClosed.emit('Exported');

    }

    saveText(text, filename){
        // Actual Export of selected DS to a file by creating <a> tag
        this.globalFunctionService.printToConsole(this.constructor.name,'saveText',           '@Start');

        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/json;charset=utf-u,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardExportClosed.emit(action);
    }
}
