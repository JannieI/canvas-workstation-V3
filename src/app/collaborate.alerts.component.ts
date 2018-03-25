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
    dgHeaders: 
        {
            id: number; 
            name: string; 
            tooltip: string;
            type: string; 
            displayLength: number;
            maxLength: number;
            sortOrder: string;
            filter: string;
            backgroundColor: string;
            color: string;
            conditionalFormatColor: string;
            nrDataQualityIssues: number;
            maxValue: number;
            minValue: number;
            average: number;
            linkedDashboardID: number;
            linkedDashboardTabID: number;
            isFrozen: boolean;

        }[] = [];
        "Dd", 
        "Sent On", 
        "Recipient", 
        "Read", 
        "AlertText"
        dgHeaders
        dgData
        dgPagination
        dgPaginationSize
        dgShowHeader
        dgShowData
        dgShowFooter
        dgRowHeight
        dguserCanChangeProperties
        dgShowTotalsRow
        dgShowTotalsCol
        dgCanEditInCell
        dgCanExportData
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

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        
		this.formCollaborateAlertsClosed.emit(action);
    }

    clickFilter(fromDate: string, toDate: string) {
        // Filter the Grid
        // this.globalFunctionService.printToConsole(this.constructor.name,'clickFilter', '@Start');

        console.log('xx fromDate', fromDate, toDate, this.filterTextContains, 
        this.filterRead, this.filterRecipient)

        this.globalVariableService.getCanvasAlerts().then (i => {
            let temp: CanvasAlert[] = i;

            if (fromDate != undefined  &&  fromDate != ''  &&  fromDate != null) {
                console.log('from', fromDate)
                temp = temp.filter(a => a.sentOn >= fromDate);
            };
            if (toDate != undefined  &&  toDate != ''  &&  toDate != null) {
                console.log('to', toDate)
                temp = temp.filter(a => a.sentOn <= toDate);
            };
            if (this.filterTextContains != ''  &&  this.filterTextContains != undefined) {
                console.log('text', this.filterTextContains)
                temp = temp.filter(a => a.alertText.indexOf(this.filterTextContains) >= 0);
            };
            if (this.filterRead) {
                console.log('read', this.filterRead)
                temp = temp.filter(a => a.read);
            };
            if (this.filterRecipient != ''  &&  this.filterRecipient != undefined) {
                console.log('rec', this.filterRecipient)
                temp = temp.filter(a => a.recipient.indexOf(this.filterRecipient) >=0);
            };

            // Final result
            this.canvasAlerts = temp;
        });
    }
}
