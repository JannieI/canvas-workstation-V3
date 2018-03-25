/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { CanvasAlert }                from './models';

@Component({
    selector: 'ca-datagrid',
    templateUrl: './ca.datagrid.component.html',
    styleUrls: ['./ca.datagrid.component.css']
})
export class CaDatagridComponent implements OnInit {


    canvasAlerts: CanvasAlert[];
    dgHeaders: string[] = [
        "Dd", 
        "Sent On", 
        "Recipient", 
        "Read", 
        "AlertText"
    ];
    filterTextContains: string;
    filterRead: string;
    filterRecipient: string;
    today = Date.now();
    showTypeDashboard: boolean = false;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasAlerts().then (i =>
            this.canvasAlerts = i
        );
    }

}
