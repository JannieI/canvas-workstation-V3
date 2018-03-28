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
    datagridColumns: DatagridColumn[] = [];
    datagridInput: DatagridInput =
    {
        datagridColumns: this.datagridColumns,
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
        datagridEmptyMessage: 'No Comments created so far',
        datagridVisibleFields: []
        
    };
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        if (this.selectedWidgetID == -1) {
            this.headerText = 'this Dashboard';
        } else {
            this.headerText = 'selected Widget';
        };

        // this.globalVariableService.getCanvasComments().then(cC => {
        //      cC.forEach(i => {
        //          if (i.dashboardID == this.globalVariableService.currentDashboardInfo
        //                 .value.currentDashboardID
        //              &&
        //              (i.widgetID == this.selectedWidgetID  ||  
        //                 this.selectedWidgetID == -1) ) {
        //              this.canvasComments.push(i)
        //          };
        //     });
        //     console.log('xx comm', this.globalVariableService.currentDashboardInfo
        //     .value.currentDashboardID, this.selectedWidgetID, this.canvasComments)
        // });
        this.globalVariableService.getCanvasComments().then (ca => {
            this.datagridInput.datagridData = ca.filter( c =>
                  (c.dashboardID == this.globalVariableService.currentDashboardInfo
                        .value.currentDashboardID
                   &&
                  (c.widgetID == this.selectedWidgetID  ||  this.selectedWidgetID == -1) )
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
            console.log('xx comm',  this.selectedWidgetID)
        });
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardCommentsClosed.emit(action);
    }
}
