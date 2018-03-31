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
    datagridColumns: DatagridColumn[];
    datagridInput: DatagridInput = null;
    datagridData: any;
    datagridPagination: boolean = false;
    datagridPaginationSize: number = 10;
    datagridShowHeader: boolean = false;
    datagridShowRowActionMenu: boolean = false;
    datagridShowData: boolean = true;
    datagridShowFooter: boolean = false;
    datagridRowHeight: number = 12;
    datagriduserCanChangeProperties: boolean = false;
    datagridShowTotalsRow: boolean = false;
    datagridShowTotalsCol: boolean = false;
    datagridCanEditInCell: boolean = false;
    datagridCanExportData: boolean = false;
    datagridEmptyMessage: string = 'No Issues created so far';
    datagridVisibleFields: string[];
    datagridShowFields: string[];

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
            this.headerText = 'the selected Widget';
            dsArray = [this.selectedDatasourceID];
        };

        this.globalVariableService.getDataQualityIssues().then (ca => {
            // Set the data for the grid
            this.datagridData = ca.filter(c =>
                dsArray.indexOf(c['datasourceID']) >= 0
            );

            // Set the column object
            this.datagridColumns = this.globalVariableService.createDatagridColumns(
                ca[0], this.datagridShowFields, this.datagridVisibleFields);

        });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDataQualityClosed.emit(action);
    }
}
