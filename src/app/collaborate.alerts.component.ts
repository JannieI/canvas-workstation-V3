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
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';


@Component({
    selector: 'collaborate-alerts',
    templateUrl: './collaborate.alerts.component.html',
    styleUrls: ['./collaborate.alerts.component.css']
})
export class CollaborateAlertsComponent implements OnInit {

    @Output() formCollaborateAlertsClosed: EventEmitter<string> = new EventEmitter();

    canvasAlerts: CanvasAlert[];
    datagriColumns: DatagridColumn[] =
    [
        {
            id: 1,
            displayName: 'ID',
            fieldName: 'id',
            databaseDBTableName: '',
            databaseDBFieldName: '',
            tooltip: '',
            datatype: 'string',
            prefix: '',
            divideBy: 0,
            displayLength: 12,
            maxLength: 0,
            sortOrder: '',
            filter: '',
            backgroundColor: '',
            color: '',
            conditionalFormatColor: '',
            nrDataQualityIssues: 0,
            maxValue: 0,
            minValue: 0,
            average: 0,
            linkedDashboardID: 0,
            linkedDashboardTabID: 0,
            isFrozen: false,
        },
        {
            id: 2,
            displayName: 'Sent On',
            fieldName: 'sentOn',
            databaseDBTableName: '',
            databaseDBFieldName: '',
            tooltip: '',
            datatype: 'string',
            prefix: '',
            divideBy: 0,
            displayLength: 12,
            maxLength: 0,
            sortOrder: '',
            filter: '',
            backgroundColor: '',
            color: '',
            conditionalFormatColor: '',
            nrDataQualityIssues: 0,
            maxValue: 0,
            minValue: 0,
            average: 0,
            linkedDashboardID: 0,
            linkedDashboardTabID: 0,
            isFrozen: false,
        },
        {
            id: 3,
            displayName: 'Recipient',
            fieldName: 'recipient',
            databaseDBTableName: '',
            databaseDBFieldName: '',
            tooltip: '',
            datatype: 'string',
            prefix: '',
            divideBy: 0,
            displayLength: 12,
            maxLength: 0,
            sortOrder: '',
            filter: '',
            backgroundColor: '',
            color: '',
            conditionalFormatColor: '',
            nrDataQualityIssues: 0,
            maxValue: 0,
            minValue: 0,
            average: 0,
            linkedDashboardID: 0,
            linkedDashboardTabID: 0,
            isFrozen: false,
        },
        {
            id: 4,
            displayName: 'Read?',
            fieldName: 'read',
            databaseDBTableName: '',
            databaseDBFieldName: '',
            tooltip: '',
            datatype: 'string',
            prefix: '',
            divideBy: 0,
            displayLength: 12,
            maxLength: 0,
            sortOrder: '',
            filter: '',
            backgroundColor: '',
            color: '',
            conditionalFormatColor: '',
            nrDataQualityIssues: 0,
            maxValue: 0,
            minValue: 0,
            average: 0,
            linkedDashboardID: 0,
            linkedDashboardTabID: 0,
            isFrozen: false,
        },
        {
            id: 5,
            displayName: 'Alert Text',
            fieldName: 'alertText',
            databaseDBTableName: '',
            databaseDBFieldName: '',
            tooltip: '',
            datatype: 'string',
            prefix: '',
            divideBy: 0,
            displayLength: 12,
            maxLength: 0,
            sortOrder: '',
            filter: '',
            backgroundColor: '',
            color: '',
            conditionalFormatColor: '',
            nrDataQualityIssues: 0,
            maxValue: 0,
            minValue: 0,
            average: 0,
            linkedDashboardID: 0,
            linkedDashboardTabID: 0,
            isFrozen: false,
        }
    ];
    datagridInput: DatagridInput = 
    {
        datagriColumns: this.datagriColumns,
        datagridData: null,
        datagridPagination: false,
        datagridPaginationSize: 10,
        datagridShowHeader: true,
        datagridShowRowActionMenu: false,
        datagridShowData: true,
        datagridShowFooter: false,
        datagridRowHeight: 12,
        datagriduserCanChangeProperties: false,
        datagridShowTotalsRow: false,
        datagridShowTotalsCol: false,
        datagridCanEditInCell: false,
        datagridCanExportData: false,
        datagridEmptyMessage: 'No Alerts created so far'
    };

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
            this.datagridInput.datagridData = i
        );
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');


		this.formCollaborateAlertsClosed.emit(action);
    }

}
