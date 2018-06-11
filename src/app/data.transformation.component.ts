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
    selector: 'data-transformation',
    templateUrl: './data.transformation.component.html',
    styleUrls:  ['./data.transformation.component.css']
})
export class DataTransformationComponent implements OnInit {

    @Output() formDataOverlayEditorClosed: EventEmitter<string> = new EventEmitter();

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
    datasourceName: string = '';
    description: string = 'Post Trade Data Vault';
    dataConnections: DataConnection[] = [];
    dataTables: DataTable[] = [];
    dataTablesFiltered: DataTable[] = [];
    dataFields: DataField[] = [];
    dataFieldsFiltered: DataField[] = [];
    datasources: localDatasources[];
    errorMessage: string = "";
    selectedFieldRowIndex: number = 0;
    selectedFields: DataField[] = [];
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
            this.globalVariableService.getDataTable().then(dt => {
                this.globalVariableService.getDataField().then(df => {

                    // Get local Vars
                    this.dataConnections = dc.slice();
                    this.dataTables = dt.slice();
                    this.dataFields = df.slice();

                    // Select the Tables, Fields
                    if (this.dataConnections.length > 0) {
                        this.clickConnectionSelect(this.dataConnections[0].connectionName);

                    } else {
                        this.clickConnectionSelect('');
                    };
                });
            });
        });

    }

    clickConnectionSelect(ev: any) {
        // Refresh the Tables and Fields for the selected Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickConnectionSelect', '@Start');

        console.warn('xx ev', ev, this.connectionName)

        // Fill list of Tables for first Connection
        if (this.connectionName != '') {
            this.filterTables(this.connectionName);
        } else {
            this.filterTables('');
        };

        // Fill list of Fields for first Table
        if (this.dataTablesFiltered.length > 0) {
            this.filterFields(this.dataTablesFiltered[0].id);
        } else {
            this.filterFields(-1);
        };

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
    
    filterFields(tableID: number) {
        // Filter Fields on Selected Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'filterFields', '@Start');

        this.dataFieldsFiltered = this.dataFields.filter(df => {
            if (df.tableID == tableID) {
                return df;
            };
        });

    }
    
    clickGo() {
        // Clicked Go: execute SQL typed in, and return results and errors
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo', '@Start');

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataOverlayEditorClosed.emit(action);

    }

}


