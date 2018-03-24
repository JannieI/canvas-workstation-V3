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
    selector: 'collaborate-alerts',
    templateUrl: './collaborate.alerts.component.html',
    styleUrls: ['./collaborate.alerts.component.css']
})
export class CollaborateAlertsComponent implements OnInit {

    @Output() formCollaborateAlertsClosed: EventEmitter<string> = new EventEmitter();

    canvasAlerts: CanvasAlert[];
    filterFromDate: string;
    filterToDate: string;
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

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        
		this.formCollaborateAlertsClosed.emit(action);
    }

    clickFilter(fromDate: string, toDate: string) {
        // Filter the Grid
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');

        console.log('xx fromDate', fromDate, toDate, this.filterTextContains, 
        this.filterRead, this.filterRecipient)

        this.globalVariableService.getCanvasAlerts().then (i => {
            this.canvasAlerts = i;
            if (this.filterFromDate != null) {
                console.log('from')
            };
            if (this.filterToDate != null) {
                console.log('to')
            };
            if (this.filterTextContains != null) {
                console.log('text')
            };
            if (this.filterRead != null) {
                console.log('read')
            };
            if (this.filterRecipient != null) {
                console.log('rec')
            };
        });
    }
}
