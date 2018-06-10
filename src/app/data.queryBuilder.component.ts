/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';
import { DataTable }                  from './models';
import { DataField }                  from './models';
import { Datasource }                 from './models';
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue }           from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';

interface localDatasources extends Datasource 
    {
        isSelected?: boolean;
        hasWidget?: boolean;
    }

@Component({
    selector: 'data-queryBuilder',
    templateUrl: './data.queryBuilder.component.html',
    styleUrls:  ['./data.queryBuilder.component.css']
})
export class DataQueryBuilderComponent implements OnInit {

    @Output() formDataAddQueryBuilderClosed: EventEmitter<string> = new EventEmitter();

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

    authentication: string = 'UsrPsw';
    connectionName: string = '';
    connectionType: string = 'MySQL';
    description: string = 'Post Trade Data Vault';
    dataConnections: DataConnection[] = [];
    dataTables: DataTable[] = [];
    dataTablesFiltered: DataTable[] = [];
    dataFields: DataField[] = [];
    dataFieldsFiltered: DataField[] = [];
    datasources: localDatasources[];
    errorMessage: string = "";
    selectedFieldRowIndex: number = 0;
    selectedTableRowIndex: number = 0;
    serverName: string = 'MSSQL54: 8000';

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getDataConnection().then(dc => {
            this.dataConnections = dc.slice();
            if (this.dataConnections.length > 0) {
                this.filterTables(this.dataConnections[0].connectionName);
            } else {
                this.filterTables('');
            };

        });
        this.globalVariableService.getDataTable().then(dt => {
            this.dataTables = dt.slice();
        });
        this.globalVariableService.getDataField().then(df => {
            this.dataFields = df.slice();
        });    }

    clickViewFields(area: string) {
        // Show fields area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');
        
    }

    clickConnectionSelect(ev: any) {
        // Clicked a Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickConnectionSelect', '@Start');

        // Refresh the Tables for the selected Connection
        console.warn('xx ev', ev, this.connectionName)
        this.filterTables(this.connectionName);
        
    }

    filterTables(connectNameToFilter: string) {
        // Filter Tables on Selected Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'filterTables', '@Start');

        let connectionIndex: number = this.dataConnections.findIndex(dt => 
            dt.connectionName == connectNameToFilter
        );
        let connectionID: number = -1;
        if (connectionIndex >= 0) {
            connectionID = this.dataConnections[connectionIndex].id;
        };

        console.warn('xx conn', connectionID, connectNameToFilter, connectionIndex)
        this.dataTablesFiltered = this.dataTables.filter(dt => {
            if (dt.connectionID == connectionID) {
                return dt;
            };
        });
        
    }
    clickSelectedDataTable(index: number, id: number) {
        // Clicked a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;
    }

    clickSelectedDatafield(index: number, id: number) {
        // Clicked a Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatafield', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedFieldRowIndex = index;
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataAddQueryBuilderClosed.emit(action);

    }

}


