/*
 * Create / Edit a SQL database query, using the Query Builder.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';
import { DataSchema }                 from './models';
import { Datasource }                 from './models';
import { DataTable }                  from './models';
import { DataField }                  from './models';
import { Dataset }                    from './models';
import { Field }                      from './models';

const constDataTables: DataTable[] = 
[
    {
        id: 1,
        connectionID: null,
        nameDB: 'Invoices',
        nameLocal: '',
        type: 'Table',
        description: '',
        businessGlossary: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
    },
    {
        id: 2,
        connectionID: null,
        nameDB: 'Accounts',
        nameLocal: '',
        type: 'Table',
        description: '',
        businessGlossary: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
    }
];
const constDataFields: DataField[] = 
[
    {
        id: 0,
        tableID: 1,
        nameDB: 'id',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    },
    {
        id: 2,
        tableID: 1,
        nameDB: 'InvoiceDate',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    },
    {
        id: 3,
        tableID: 1,
        nameDB: 'Total',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    },
    {
        id: 0,
        tableID: 2,
        nameDB: 'id',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    },
    {
        id: 2,
        tableID: 2,
        nameDB: 'TransactDate',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    },
    {
        id: 3,
        tableID: 2,
        nameDB: 'Amount',
        nameLocal: '',
        type: '',
        format: '',
        filterOperand: '',
        filterValue: '',
        calculation: '',
        orderSequence: 0,
        orderDirection: '',
        description: '',
        businessGlossary: '',
        keyField: false,
        explainedBy: '',
        creator: '',
        dateCreated: '',
        editor: '',
        dateEdited: '',
        hidden: false
    }

];

const constDataInvoices: any = 
[
    {
        id: 0,
        InvoiceDate: '2017/01/01',
        Total: 20
    },
    {
        id: 1,
        InvoiceDate: '2017/01/01',
        Total: 40
    },
    {
        id: 2,
        InvoiceDate: '2017/01/01',
        Total: 50
    },
    {
        id: 3,
        InvoiceDate: '2017/01/01',
        Total: 60
    },
    {
        id: 4,
        InvoiceDate: '2017/01/01',
        Total: 80
    },
    {
        id: 5,
        InvoiceDate: '2017/01/01',
        Total: 100
    },
    {
        id: 6,
        InvoiceDate: '2017/01/01',
        Total: 120
    }

];
const constDataAcounts: any = 
[
    {
        id: 1,
        TransactDate: '2017/01/01',
        Amount: 1
    },
    {
        id: 2,
        TransactDate: '2017/01/01',
        Amount: 2
    },
    {
        id: 3,
        TransactDate: '2017/01/01',
        Amount: 3
    },
    {
        id: 4,
        TransactDate: '2017/01/01',
        Amount: 4
    },
    {
        id: 5,
        TransactDate: '2017/01/01',
        Amount: 5
    },
    {
        id: 6,
        TransactDate: '2017/01/01',
        Amount: 6
    },
    {
        id: 7,
        TransactDate: '2017/01/01',
        Amount: 7
    }
];


@Component({
    selector: 'data-directQueryBuilder',
    templateUrl: './data.direct.queryBuilder.component.html',
    styleUrls:  ['./data.direct.queryBuilder.component.css']
})
export class DataDirectQueryBuilderComponent implements OnInit {

    @Input() selectedDatasource: Datasource;
 
    @Output() formDataDirectQueryBuilderClosed: EventEmitter<Datasource> = new EventEmitter();

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


    connectionName: string = 'tributary.connectors.sql:SqlConnector';
    currentData: any = [];
    dataFields: DataField[] = [];
    dataFieldsFiltered: {
        fieldName: string;  // FieldName
        fieldType: string;  // FieldType
    }[] = [];
    dataFieldsSelected: string[];
    dataSchemas: DataSchema[] = [];
    dataTables: DataTable[] = [];
    errorMessage: string = "";
    selectedFieldRowIndex: number = 0;
    selectedFields: DataField[] = [];
    selectedTableRowIndex: number = 0;
    serverTypes: { serverType: string; driverName: string}[]
    showPreview: boolean = false;
    
    // driverName
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set base info
        this.serverTypes = this.globalVariableService.serverTypes;

        if (this.selectedDatasource == null) {
            this.selectedDatasource = {
                id: 0,
                type: '',
                subType: '',
                typeVersion: '',
                name: 'New DS',
                username: 'ftfhgfzh',
                password: 'L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl',
                description: 'Post Trade Data Vault',
                createdBy: '',
                createdOn: '',
                createMethod: 'directQueryBuilder',
                editor: '',
                dateEdited: '',
                refreshedBy: '',
                refreshedOn: '',
                dataFieldIDs: [0],
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                parameters: '',
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                connectionID: 0,
                dataTableID: 0,
                nrWidgets: 0,
                databaseName: 'ftfhgfzh',
                port: '5432',
                serverType: 'PostgresSQL',
                serverName: 'pellefant.db.elephantsql.com',
                dataTableName: 'ftfhgfzh',
                dataSQLStatement: '',
                dataNoSQLStatement: '',
                businessGlossary: '',
                dataDictionary: ''
                            
            };
        };

    }
    
    filterFields(tableName: string) {
        // Filter Fields on Selected Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'filterFields', '@Start');

        console.warn('xx id', tableName)
        this.dataFieldsFiltered = this.dataSchemas.filter(datsch => {
            if (datsch.tableName == tableName) {
                return datsch;
            };
        })[0].tableFields;

    }
    
    clickSelectedDataTable(index: number, id: number) {
        // Clicked a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;

        // Select Fields in the table
        this.filterFields(this.dataSchemas[this.selectedTableRowIndex].tableName);

        // Refresh data if already Preview-ed before
        if (this.showPreview) {
            this.clickGetData();
        };
    }

    clickSelectedDatafield(index: number, id: number) {
        // Clicked a Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatafield', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedFieldRowIndex = index;

        this.dataFieldsSelected = this.selectedFields.map(f => f.nameDB);
        console.warn('xx selectedFields', this.selectedFields, this.dataFieldsSelected)
    }
    
    clickGetData() {
        // Get the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGetData', '@Start');
        let data = 
        {
            "source": {
                "connector": "tributary.connectors.sql:SqlConnector",
                "drivername": "postgres",
                "username": "ftfhgfzh",
                "password": "L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl",
                "database": "ftfhgfzh",
                "host": "pellefant.db.elephantsql.com",
                "port": 5432,
                "query": "select I.\"InvoiceDate\" as \"Date\", sum(I.\"Total\") as \"Amount\" from invoices I group by I.\"InvoiceDate\""
            }
        }

        this.globalVariableService.getTributaryData(data).then(res => {
            console.warn('xx res', res, this.selectedDatasource)
        });

        console.warn('xx this.currentData', this.currentData)
        this.showPreview = true;
    }

    clickRefresh() {
        // Get the tables and fields from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefresh', '@Start');
    
        // Fill Table and Field Names
        // TODO - remove hardcoding once received from DB
        this.dataTables = constDataTables;
        this.dataFields = constDataFields;

        this.dataSchemas = this.globalVariableService.getTributaryDirectDBSchema(
            'pellefant.db.elephantsql.com');
        console.warn('xx dat sch', this.dataSchemas)

        // Select the Tables, Fields
        if (this.dataSchemas.length > 0) {
            this.filterFields(this.dataSchemas[0].tableName);

        } else {
            this.filterFields('');
        };
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectQueryBuilderClosed.emit(null);

    } 

    clickSave(action: string) {
        // Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        console.warn('xx END sel ds', this.selectedDatasource)
        if (action == 'Saved') {
            this.formDataDirectQueryBuilderClosed.emit(null);

        } else {
            this.formDataDirectQueryBuilderClosed.emit(this.selectedDatasource);

        }

    }
}


