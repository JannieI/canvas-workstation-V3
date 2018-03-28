// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { Datasource }                 from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'widget-expand',
    templateUrl: './widget.expand.component.html',
    styleUrls: ['./widget.expand.component.css']
})
export class WidgetExpandComponent implements OnInit {

    dataset;
    @Input() selectWidgetIndex: number;
    @Input() selectDatasetID: number;
    @Input() selectDatasourceID: number;
    @Output() formWidgetExpandClosed: EventEmitter<string> = new EventEmitter();

    currentDatasetLength: number;
    datasources: Datasource[] = [];
    dataFieldNames: string[] = [];
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
    datagridEmptyMessage: string = 'No Activities created so far';
    datagridVisibleFields: string[];
    records: number = 6;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCurrentDataset(
            this.selectDatasourceID, this.selectDatasetID).then (ca => {

            // Set the data for the grid
            this.datagridData = ca;

            // Set the column object
            this.datagridColumns = this.globalVariableService.createDatagridColumns(
                ca[0], this.datagridVisibleFields);
        });
        console.log('xx this.datagridData ', this.datagridData , this.datagridColumns)
    }

  	clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetExpandClosed.emit(action);
    }

}
