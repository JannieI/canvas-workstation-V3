/*
 * Create / Edit a SQL database query, using the Query Builder.
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

@Component({
    selector: 'data-directQueryBuilder',
    templateUrl: './data.direct.queryBuilder.component.html',
    styleUrls:  ['./data.direct.queryBuilder.component.css']
})
export class DataDirectQueryBuilderComponent implements OnInit {

    @Input() selectedDatasource: Datasource;
 
    @Output() formDataDirectQueryBuilderClosed: EventEmitter<string> = new EventEmitter();

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


    dataConnections: DataConnection[] = [];
    dataTables: DataTable[] = [];
    dataFields: DataField[] = [];
    dataFieldsFiltered: DataField[] = [];
    errorMessage: string = "";
    selectedFieldRowIndex: number = 0;
    selectedFields: DataField[] = [];
    showPreview: boolean = false;
    dataFieldNames: string[] =
    [
        'Name', 
        'Miles_per_Gallon', 
        'Cylinders', 
        'Displacement', 
        'Horsepower', 
        'Weight_in_lbs', 
        'Acceleration', 
        'Year', 
        'Origin', 
    ];
    selectedTableRowIndex: number = 0;
    connectionName: string = 'tributary.connectors.sql:SqlConnector';
    currentData: any = 
    [
        {
            "Name": "fiat strada custom",
            "Miles_per_Gallon": 37.3,
            "Cylinders": 4,
            "Displacement": 91,
            "Horsepower": 69,
            "Weight_in_lbs": 2130,
            "Acceleration": 14.7,
            "Year": "1979-01-01",
            "Origin": "Europe",
            "_id": 4740
        },
        {
            "Name": "buick skylark limited",
            "Miles_per_Gallon": 28.4,
            "Cylinders": 4,
            "Displacement": 151,
            "Horsepower": 90,
            "Weight_in_lbs": 2670,
            "Acceleration": 16,
            "Year": "1979-01-01",
            "Origin": "USA",
            "_id": 4741
        },
        {
            "Name": "chevrolet citation",
            "Miles_per_Gallon": 28.8,
            "Cylinders": 6,
            "Displacement": 173,
            "Horsepower": 115,
            "Weight_in_lbs": 2595,
            "Acceleration": 11.3,
            "Year": "1979-01-01",
            "Origin": "USA",
            "_id": 4742
        },
        {
            "Name": "oldsmobile omega brougham",
            "Miles_per_Gallon": 26.8,
            "Cylinders": 6,
            "Displacement": 173,
            "Horsepower": 115,
            "Weight_in_lbs": 2700,
            "Acceleration": 12.9,
            "Year": "1979-01-01",
            "Origin": "USA",
            "_id": 4743
        },
        {
            "Name": "pontiac phoenix",
            "Miles_per_Gallon": 33.5,
            "Cylinders": 4,
            "Displacement": 151,
            "Horsepower": 90,
            "Weight_in_lbs": 2556,
            "Acceleration": 13.2,
            "Year": "1979-01-01",
            "Origin": "USA",
            "_id": 4744
        },
        {
            "Name": "vw rabbit",
            "Miles_per_Gallon": 41.5,
            "Cylinders": 4,
            "Displacement": 98,
            "Horsepower": 76,
            "Weight_in_lbs": 2144,
            "Acceleration": 14.7,
            "Year": "1980-01-01",
            "Origin": "Europe",
            "_id": 4745
        },
        {
            "Name": "toyota corolla tercel",
            "Miles_per_Gallon": 38.1,
            "Cylinders": 4,
            "Displacement": 89,
            "Horsepower": 60,
            "Weight_in_lbs": 1968,
            "Acceleration": 18.8,
            "Year": "1980-01-01",
            "Origin": "Japan",
            "_id": 4746
        },
        {
            "Name": "chevrolet chevette",
            "Miles_per_Gallon": 32.1,
            "Cylinders": 4,
            "Displacement": 98,
            "Horsepower": 70,
            "Weight_in_lbs": 2120,
            "Acceleration": 15.5,
            "Year": "1980-01-01",
            "Origin": "USA",
            "_id": 4747
        },
        {
            "Name": "datsun 310",
            "Miles_per_Gallon": 37.2,
            "Cylinders": 4,
            "Displacement": 86,
            "Horsepower": 65,
            "Weight_in_lbs": 2019,
            "Acceleration": 16.4,
            "Year": "1980-01-01",
            "Origin": "Japan",
            "_id": 4748
        },
        {
            "Name": "chevrolet citation",
            "Miles_per_Gallon": 28,
            "Cylinders": 4,
            "Displacement": 151,
            "Horsepower": 90,
            "Weight_in_lbs": 2678,
            "Acceleration": 16.5,
            "Year": "1980-01-01",
            "Origin": "USA",
            "_id": 4749
        },
        {
            "Name": "ford fairmont",
            "Miles_per_Gallon": 26.4,
            "Cylinders": 4,
            "Displacement": 140,
            "Horsepower": 88,
            "Weight_in_lbs": 2870,
            "Acceleration": 18.1,
            "Year": "1980-01-01",
            "Origin": "USA",
            "_id": 4750
        },
        {
            "Name": "amc concord",
            "Miles_per_Gallon": 24.3,
            "Cylinders": 4,
            "Displacement": 151,
            "Horsepower": 90,
            "Weight_in_lbs": 3003,
            "Acceleration": 20.1,
            "Year": "1980-01-01",
            "Origin": "USA",
            "_id": 4751
        },
        {
            "Name": "dodge aspen",
            "Miles_per_Gallon": 19.1,
            "Cylinders": 6,
            "Displacement": 225,
            "Horsepower": 90,
            "Weight_in_lbs": 3381,
            "Acceleration": 18.7,
            "Year": "1980-01-01",
            "Origin": "USA",
            "_id": 4752
        },
        {
            "Name": "audi 4000",
            "Miles_per_Gallon": 34.3,
            "Cylinders": 4,
            "Displacement": 97,
            "Horsepower": 78,
            "Weight_in_lbs": 2188,
            "Acceleration": 15.8,
            "Year": "1980-01-01",
            "Origin": "Europe",
            "_id": 4753
        }
    ]
    serverTypes: { serverType: string; driverName: string}[]
    
    // driverName
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
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
                dataNoSQLStatement: ''
                            
            };
        }

    }

    clickViewFields(area: string) {
        // Show fields area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');

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
    
    clickSelectedDataTable(index: number, id: number) {
        // Clicked a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;

        // Select Fields in the table
        this.filterFields(id);
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

        this.formDataDirectQueryBuilderClosed.emit(action);

    } 

    clickTransformation() {
        // Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTransformation', '@Start');

        this.formDataDirectQueryBuilderClosed.emit('Transformation');

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

    

        this.globalVariableService.getTriburaryData(data).then(res => {
            console.warn('xx res', res, this.selectedDatasource)
        });

        this.showPreview = true;
    }

    clickRefresh() {
        // Get the tables and fields from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefresh', '@Start');
    
        // Fill Table and Field Names
        // TODO - remove hardcoding once received from DB
        this.dataTables = constDataTables;
        this.dataFields = constDataFields;

        // Select the Tables, Fields
        if (this.dataTables.length > 0) {
            this.clickConnectionSelect(this.dataConnections[0].connectionName);

        } else {
            this.clickConnectionSelect('');
        };
    }
}


