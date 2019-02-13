/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Clarity UI
// import { ClrDatagridColumn } from 'clarity-angular/data/datagrid/';
// import { ClrDatagridPagination, ClrDatagridRow, ClrDatagridCell } from 'clarity-angular/data/datagrid/datagrid-column';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

 
@Component({
    selector: 'ca-datagrid',
    templateUrl: './ca.datagrid.component.html',
    styleUrls: ['./ca.datagrid.component.css']
})
export class CaDatagridComponent implements OnInit {

    // @Input() DatagridInput: DatagridInput;
    @Input() datagridColumns: DatagridColumn[];             // Cols, with info on each
    @Input() datagridData: any;                             // Data Array
    @Input() datagridPagination?: boolean = true;                   // True if pagination is on
    @Input() datagridPaginationSize?: number = 5;                // Size of each page, ie 10 (rows)
    @Input() datagridShowHeader?: boolean = true;                   // True to show Headers
    @Input() datagridShowRowActionMenu?: boolean = false             // True to show the action menu per row
    @Input() datagridShowData?: boolean = true;                     // True to show Data
    @Input() datagridShowFooter?: boolean = true;                   // True to show Footer
    @Input() datagridRowHeight?: number = 12;                     // Height in px
    @Input() datagriduserCanChangeProperties?: boolean;      // False if use can change Nothing in grid, ie cannot even resize
    @Input() datagridShowTotalsRow?: boolean;                // True to show additional row of totals at bottom
    @Input() datagridShowTotalsCol?: boolean;                // True to show additional col of totals on right
    @Input() datagridCanEditInCell?: boolean;                // True is user can edit inside cells
    @Input() datagridCanExportData?: boolean;                // True if the data may be exported
    @Input() datagridEmptyMessage?: string = 'No records to display';                  // Message to display if the grid is empty

    currentPage: number = 1;
    today = Date.now();
    selectedData: any;
    datagridColumnHidden = {hidden: false};

    // TODO - the 3 properties below belongs to clrDgLastPage, but dont work
    firstItem: any;
    lastItem:any;
    lastPage: any;
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    ngAfterViewInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

    }

    clickHeader(index: number) {
        // Clicked a Header
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHeader', '@Start');

        console.warn('xx', index, this.currentPage, this.lastPage, this.selectedData)
    }

    clickRowEdit() {
        // Clicked Row Edit Action Menu
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRowEdit', '@Start');

        // TODO - code this somehow
    }
    
    clickColumnDelete() {
        // Clicked Row Delete Action Menu
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColumnDelete', '@Start');

        // TODO - code this somehow
    }
 
    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }
}

