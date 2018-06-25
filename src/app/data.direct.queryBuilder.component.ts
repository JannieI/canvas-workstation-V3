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
import { TributaryServerType }        from './models';
import { TributarySource }            from './models';


// TODO - remove when real DB
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
    currentData: any[] = constDataInvoices;
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
    selectedFields: any[] = [];
    selectedTableRowIndex: number = -1;
    serverTypes: TributaryServerType[]
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
        } else {

            // Get the Schema from Tributary
            this.dataSchemas = this.globalVariableService.getTributaryDirectDBSchema(
                this.selectedDatasource.serverName);
            
            // Cater for missing field types
            if (this.selectedDatasource.dataFields.length > 
                this.selectedDatasource.dataFieldTypes.length) {

                for (let i = 1; i <= this.selectedDatasource.dataFields.length; i++) {
                    if (this.selectedDatasource.dataFieldTypes.length < i) {
                        this.selectedDatasource.dataFieldTypes.push('any');
                    };
                };
            };

            // Build the selected fields
            for (let i = 0; i < this.selectedDatasource.dataFields.length; i++) {
                this.selectedFields.push(
                    {
                        fieldName: this.selectedDatasource.dataFields[i],
                        fieldType: this.selectedDatasource.dataFieldTypes[i]
                    }
                );
            };

            // Click Table, which will filter Fields
            let dsIndex: number = this.dataSchemas.findIndex(
                dsch => dsch.tableName == this.selectedDatasource.dataTableName
            );

            if (dsIndex >= 0) {
                this.clickSelectedDataTable(dsIndex, this.selectedDatasource.dataTableID);
            };

            console.warn('xx dsIndex, this.selectedDatasource', dsIndex, 
            this.selectedDatasource)

            //
        };

    }
    
    filterFields(tableName: string) {
        // Filter Fields on Selected Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'filterFields', '@Start');

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
        this.selectedFields = [];
        this.filterFields(this.dataSchemas[this.selectedTableRowIndex].tableName);

        // Refresh data if already Preview-ed before
        if (this.showPreview) {
            this.clickPreview();
        };
    }

    clickSelectedDatafield(index: number, id: number) {
        // Clicked a Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatafield', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedFieldRowIndex = index;
        
        this.dataFieldsSelected = this.selectedFields.map(f => f.fieldName);
        console.warn('xx selectedFields', this.selectedFields, this.dataFieldsSelected)
    }

    clickRefresh() {
        // Get the tables and fields from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefresh', '@Start');
    
        // Fill Table and Field Names
        // TODO - remove hardcoding once received from DB

        this.dataSchemas = this.globalVariableService.getTributaryDirectDBSchema(
            'pellefant.db.elephantsql.com');

        // Select the Tables, Fields
        if (this.dataSchemas.length > 0) {
            this.filterFields(this.dataSchemas[0].tableName);

        } else {
            this.filterFields('');
        };
    }
    
    clickPreview() {
        // Get the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPreview', '@Start');

        // No Fields, no data
        if (this.selectedFields.length == 0) {
            this.errorMessage = 'First Refresh, select a Table and then some fields...';
            return;
        };

        // Reset
        this.errorMessage = '';
        this.showPreview = false;

        // Build source string
        let selectServerType: TributaryServerType = this.serverTypes.find(tst =>
            tst.serverType == this.selectedDatasource.serverType);
        let source: TributarySource = this.globalVariableService.constructTributarySQLSource(
            selectServerType.connector,
            selectServerType.driverName,
            this.selectedDatasource.username,
            this.selectedDatasource.password,
            this.selectedDatasource.databaseName,
            this.selectedDatasource.serverName,
            +this.selectedDatasource.port,
            "select I.\"InvoiceDate\" as \"Date\", sum(I.\"Total\") as \"Amount\" from invoices I group by I.\"InvoiceDate\""
        );

        // {
        //     "source": {
        //         "connector": "tributary.connectors.sql:SqlConnector",
        //         "drivername": "postgres",
        //         "username": "ftfhgfzh",
        //         "password": "L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl",
        //         "database": "ftfhgfzh",
        //         "host": "pellefant.db.elephantsql.com",
        //         "port": 5432,
        //         "query": "select I.\"InvoiceDate\" as \"Date\", sum(I.\"Total\") as \"Amount\" from invoices I group by I.\"InvoiceDate\""
        //     }
        // }
        this.globalVariableService.getTributaryData(source).then(res => {
            this.showPreview = true;
        })
        .catch(err => {
            this.errorMessage = err.message + '. ';
            if (err.status == 401) {
                this.errorMessage = 'Error: ' + 'Either you login has expired, or you dont have access to the Database. ' 
                    + err.message;
            } else {
                this.errorMessage = err.message;
            };
        });

    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectQueryBuilderClosed.emit(null);

    } 

    clickSave(action: string) {
        // Save the DS and info, Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';

        // Validation
        if (this.selectedTableRowIndex < 0) {
            this.errorMessage = 'No Table selected';
            return;
        };
        if (this.selectedFields.length = 0) {
            this.errorMessage = 'No Fields selected';
            return;
        };

        let selectTributaryServerType: TributaryServerType = this.serverTypes.find(tst =>
            tst.serverType == this.selectedDatasource.serverType);

        // Convert dataFields & - Types to string array
        let dataFields: string[] = [];
        this.selectedFields.forEach(sdf => {
            dataFields.push(sdf.fieldName)
        });
        let dataFieldTypes: string[] = [];
        let dataFieldLengths: number[] = [];
        this.selectedFields.forEach(sdf => {
            dataFieldTypes.push(sdf.fieldType)

            // TODO - improve later
            if (sdf.fieldType == 'string') {
                dataFieldLengths.push(25);
            } else {
                dataFieldLengths.push(12);
            };
        });

        let today = new Date();

        // Create new Datasource, dataSet & Data
        let newDatasource: Datasource =  {
            id: null,
            name: this.selectedDatasource.name,
            username: this.selectedDatasource.username,
            password: '',
            type: this.selectedDatasource.type,
            subType: this.selectedDatasource.subType,
            typeVersion: this.selectedDatasource.typeVersion,
            description: this.selectedDatasource.description,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: this.globalVariableService.formatDate(today),
            createMethod: 'directQueryBuilder',
            editor: '',
            dateEdited: '',
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedOn: this.globalVariableService.formatDate(today),
            dataFieldIDs: this.selectedDatasource.dataFieldIDs,
            dataFields: dataFields,
            dataFieldTypes: dataFieldTypes,
            dataFieldLengths: dataFieldLengths,
            parameters: this.selectedDatasource.parameters,
            folder: this.selectedDatasource.folder,
            fileName: this.selectedDatasource.fileName,
            excelWorksheet: this.selectedDatasource.excelWorksheet,
            transposeOnLoad: this.selectedDatasource.transposeOnLoad,
            startLineNr: this.selectedDatasource.startLineNr,
            csvSeparationCharacter: this.selectedDatasource.csvSeparationCharacter,
            csvQuotCharacter: this.selectedDatasource.csvQuotCharacter,
            connectionID: this.selectedDatasource.connectionID,
            dataTableID: this.selectedDatasource.dataTableID,
            nrWidgets: this.selectedDatasource.nrWidgets,
            databaseName: this.selectedDatasource.databaseName,
            port: this.selectedDatasource.port,
            serverType: selectTributaryServerType.driverName,
            serverName: this.selectedDatasource.serverName,
            dataTableName: this.dataSchemas[this.selectedTableRowIndex].tableName,
            dataSQLStatement: this.selectedDatasource.dataSQLStatement,
            dataNoSQLStatement: this.selectedDatasource.dataNoSQLStatement,
            businessGlossary: this.selectedDatasource.businessGlossary,
            dataDictionary: this.selectedDatasource.dataDictionary

        };
        let newdSet: Dataset = {
            id: null,
            datasourceID: null,
            sourceLocation: 'HTTP',
            url: 'data',
            folderName: '',
            fileName: '',
            data: null,
            dataRaw: null
        };
        let newData: any = {
            id: null,
            data: this.currentData
        };

        // Add Data, then dataset, then DS
        this.globalVariableService.addData(newData).then(resData => {

            newdSet.url = 'data/' + resData.id.toString();
            this.globalVariableService.addDatasource(newDatasource).then(resDS => {
                newdSet.datasourceID = resDS.id;
                this.globalVariableService.addDataset(newdSet);

            });

            // Add dataset and data to DB
            console.warn('xx currDS, ' , this.globalVariableService.currentDatasources)
            console.warn('xx curr dSet, ' , this.globalVariableService.currentDatasets)
            console.log('xx DS:', this.globalVariableService.datasources)
        });

        // Close form and open Transitions if requested
        if (action == 'Saved') {
            this.formDataDirectQueryBuilderClosed.emit(null);

        } else {
            this.formDataDirectQueryBuilderClosed.emit(this.selectedDatasource);

        };

    }
}


