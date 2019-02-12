/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasComment }              from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';
import { DataQualityIssue }           from './models';

import { HttpClient }                 from '@angular/common/http';
import { AgGridNg2 }                  from 'ag-grid-angular';


@Component({
    selector: 'dashboard-dataquality',
    templateUrl: './dashboard.dataquality.component.html',
    styleUrls: ['./dashboard.dataquality.component.css']
})
export class DashboardDataQualityComponent implements OnInit {

    @Output() formDashboardDataQualityClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedDatasourceID: number;
    @ViewChild('agGrid') agGrid: AgGridNg2;

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

    canvasComments: CanvasComment[] = [];
    dataQualityIssues: DataQualityIssue[] = [];

    headerText: string;
    datagridColumns: DatagridColumn[];
    datagridInput: DatagridInput = null;
    datagridData: any[];
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

    columnDefs = [
        {headerName: 'Make', field: 'make', width: 90, checkboxSelection: true, sort: "desc",
        suppressMovable: false, suppressResize: false },
        {headerName: 'Model', field: 'model', width: 190, minWidth: 90, maxWidth: 300, 
            unSortIcon: true, pinned: 'left', lockPosition: true },
        {headerName: 'Price', field: 'price', width: 90, type: "numericColumn"}
    ];
    multiSortKey: string = "ctrl";  // Default = shift
    paginationPageSize: number = 16;
    pinnedTopRowData = [
        {
          make: "Floating Top Athlete",
          model: "Total",
          price: "52",
        }
      ];
      pinnedBottomRowData = [
        {
            make: "Floating Bottom",
            model: 999,
            price: "553214",
        }
      ]
    columnDefs1 = [
        {headerName: "id",          field: "id"},
        {headerName: "name",        field: "name", checkboxSelection: true },
        {headerName: "datasourceID",field: "datasourceID"},
        {headerName: "status",      field: "status"},
        {headerName: "type",        field: "type"},
        {headerName: "description", field: "description"},
        {headerName: "nrIssues",    field: "nrIssues"},
        {headerName: "loggedBy",    field: "loggedBy"},
        {headerName: "loggedOn",    field: "loggedOn"},
        {headerName: "solvedBy",    field: "solvedBy"},
        {headerName: "solvedOn",    field: "solvedOn"}
    ]

    rowData: any;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: HttpClient,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        // this.rowData = this.http.get('https://api.myjson.com/bins/15psn9');
        // Display the source, and set the array of DSids
        let dsArray: number[] = [];
        if (this.selectedDatasourceID == -1) {
            this.headerText = 'the current Dashboard';
            this.globalVariableService.currentDatasources.forEach(ds =>
                dsArray.push(ds.id)
            );
        } else {
            this.headerText = 'the selected Widget';
            dsArray = [this.selectedDatasourceID];
        };

        this.globalVariableService.getResource('dataQualityIssues')
            .then (ca => {
                this.dataQualityIssues = ca.filter(c =>
                    dsArray.indexOf(c['datasourceID']) >= 0)
            })
            .catch(err => console.log('Error reading dataQualityIssues: ' + err));

            // Set the column object
            // this.datagridColumns = this.globalVariableService.createDatagridColumns(
            //     ca[0], this.datagridShowFields, this.datagridVisibleFields);

        // });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDataQualityClosed.emit(action);
    }


    getSelectedRows() {
        const selectedNodes = this.agGrid.api.getSelectedNodes();
        const selectedData = selectedNodes.map( node => node.data );
        const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ');
        alert(`Selected nodes: ${selectedDataStringPresentation}`);
    }


}
