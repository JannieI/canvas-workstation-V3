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
    selector: 'dashboard-comments',
    templateUrl: './dashboard.comments.component.html',
    styleUrls: ['./dashboard.comments.component.css']
})
export class DashboardCommentsComponent implements OnInit {

    @Output() formDashboardCommentsClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedWidgetID: number;

    canvasComments: CanvasComment[] = [];
    headerText: string;
    showTypeDashboard: boolean = false;
    // datagridInput: DatagridInput =
    // {
    //     datagridColumns: this.datagridColumns,
    //     datagridData: null,
    //     datagridPagination: false,
    //     datagridPaginationSize: 10,
    //     datagridShowHeader: false,
    //     datagridShowRowActionMenu: false,
    //     datagridShowData: true,
    //     datagridShowFooter: true,
    //     datagridRowHeight: 12,
    //     datagriduserCanChangeProperties: false,
    //     datagridShowTotalsRow: false,
    //     datagridShowTotalsCol: false,
    //     datagridCanEditInCell: false,
    //     datagridCanExportData: false,
    //     datagridEmptyMessage: 'No Comments created so far',
    //     datagridVisibleFields: []

    // };
    datagridColumns: DatagridColumn[];
    datagridData: any;
    datagridPagination: boolean = false;
    datagridPaginationSize: number = 10;
    nrRecords: number;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set header
        if (this.selectedWidgetID == -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'the selected Widget';
        };

        // Set the data for the grid
        this.globalVariableService.getCanvasComments().then (ca => {
            this.datagridData = ca.filter( c =>
                  (c.dashboardID == this.globalVariableService.currentDashboardInfo
                        .value.currentDashboardID
                   &&
                  (c.widgetID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) )
            );
            this.nrRecords = this.datagridData.length;
        });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }

    clickEditComment(index: number, id: number) {
        // Last row can be Edited
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEditComment', '@Start');

        
    }
}
