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
import { CanvasComment }              from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

@Component({
    selector: 'dashboard-dataquality',
    templateUrl: './dashboard.dataquality.component.html',
    styleUrls: ['./dashboard.dataquality.component.css']
})
export class DashboardDataQualityComponent implements OnInit {

    @Output() formDashboardDataQualityClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedDatasourceID: number;
    
    canvasComments: CanvasComment[] = [];
    headerText: string;
    datagridColumns: DatagridColumn[] = [];
    datagridInput: DatagridInput =
    {
        datagridColumns: this.datagridColumns,
        datagridData: null,
        datagridPagination: false,
        datagridPaginationSize: 5,
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
        datagridEmptyMessage: 'No records created so far'
    };

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Display the source, and set the array of DSids
        let dsArray: number[] = [];
        if (this.selectedDatasourceID == -1) {
            this.headerText = 'this Dashboard';
            this.globalVariableService.currentDatasources.forEach(ds =>
                dsArray.push(ds.id)
            );
        } else {
            this.headerText = 'selected Widget';
            dsArray = [this.selectedDatasourceID];
        };
console.log('xx ds', dsArray)
        // this.globalVariableService.getCanvasComments().then(cC => {
        //      cC.forEach(i => {
        //          if (i.widgetID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) {
        //              this.canvasComments.push(i)
        //          };
        //     });
        //     console.log('xx comm', cC, this.canvasComments)
        // });

        this.globalVariableService.getDataQualityIssues().then (ca => {
            this.datagridInput.datagridData = ca.filter(c =>
                dsArray.indexOf(c['datasourceID']) >= 0
            );
            if (ca.length > 0) {
                const columns = Object.keys(ca[0]);
                for (var i = 0; i < columns.length; i++) {
                    this.datagridColumns.push(
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

		this.formDashboardDataQualityClosed.emit(action);
    }
}
