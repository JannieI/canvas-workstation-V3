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
    datagriColumns: DatagridColumn[] = [];
    datagridInput: DatagridInput = 
    {
        datagriColumns: this.datagriColumns,
        datagridData: null,
        datagridPagination: false,
        datagridPaginationSize: 10,
        datagridShowHeader: false,
        datagridShowRowActionMenu: false,
        datagridShowData: true,
        datagridShowFooter: true,
        datagridRowHeight: 12,
        datagriduserCanChangeProperties: false,
        datagridShowTotalsRow: false,
        datagridShowTotalsCol: false,
        datagridCanEditInCell: false,
        datagridCanExportData: false,
        datagridEmptyMessage: 'No Alerts created so far'
    };


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasAlerts().then (ca => {
            this.datagridInput.datagridData = ca;
            if (ca.length > 0) {
                const columns = Object.keys(ca[0]);
                for (var i = 0; i < ca.length; i++) {
                    this.datagriColumns.push(
                    {
                        id: i,
                        displayName: columns[i],
                        fieldName: columns[i],
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
                    });
                };
            };
        });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');


		this.formCollaborateAlertsClosed.emit(action);
    }

}
