/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
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
    selector: 'ca-datagrid',
    templateUrl: './ca.datagrid.component.html',
    styleUrls: ['./ca.datagrid.component.css']
})
export class CaDatagridComponent implements OnInit {

    @Input() datagriColumns: DatagridColumn[];             // Cols, with info on each
    @Input() datagridData: any;                            // Data Array
    @Input() datagridPagination: boolean;                  // True if pagination is on
    @Input() datagridPaginationSize: number;               // Size of each page, ie 10 (rows)
    @Input() datagridShowHeader: boolean;                  // True to show Headers
    @Input() datagridShowData: boolean;                    // True to show Data
    @Input() datagridShowFooter: boolean;                  // True to show Footer
    @Input() datagridRowHeight: number;                    // Height in px
    @Input() datagriduserCanChangeProperties: boolean;     // False if use can change Nothing in grid, ie cannot even resize
    @Input() datagridShowTotalsRow: boolean;               // True to show additional row of totals at bottom
    @Input() datagridShowTotalsCol: boolean;               // True to show additional col of totals on right
    @Input() datagridCanEditInCell: boolean;               // True is user can edit inside cells
    @Input() datagridCanExportData: boolean;               // True if the data may be exported

    currentPage: number = 1;
    today = Date.now();
    selectedData: any;
    showTypeDashboard: boolean = false;

    // TODO - the 3 properties below belongs to clrDgLastPage, but dont work
    lastPage: any;
    firstItem: any;
    lastItem:any;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        console.log('xx dg datagriColumns', this.datagriColumns)
    }

    clickHeader(index: number) {
        // Clicked a Header
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHeader', '@Start');

        console.log('xx', index, this.currentPage, this.lastPage, this.selectedData)
    }
}
