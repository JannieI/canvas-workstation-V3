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
    selectedTableRowIndex: number = 0;
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
        this.globalVariableService.getTributaryData(source)
        .then(res => {
            this.showPreview = true;
        })
        .catch(err => {
            this.errorMessage = err.message + ': ' + err.error;
        });

    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectQueryBuilderClosed.emit(null);

    } 

    clickSave(action: string) {
        // Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');



        let today =new Date();

        // New Datasource
        let newData: Datasource =  {
            id: null,
            name: this.selectedDatasource.name,
            username: '',
            password: '',
            type: 'Server',
            subType: 'SQL',
            typeVersion: '',
            description: this.selectedDatasource.description,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: this.globalVariableService.formatDate(today),
            createMethod: 'directQueryBuilder',
            editor: '',
            dateEdited: '',
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedOn: this.globalVariableService.formatDate(today),
            dataFieldIDs: [0],
            dataFields: this.selectedFields,
            dataFieldTypes: [],
            dataFieldLengths: [],
            parameters: 'None',
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: 1,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            connectionID: 0,
            dataTableID: 0,
            nrWidgets: 0,
            databaseName: '',
            port: '',
            serverType: '',
            serverName: '',
            dataTableName: '',
            dataSQLStatement: '',
            dataNoSQLStatement: '',
            businessGlossary: '',
            dataDictionary: ''

        };

        // Add to all DS (DB, global), for later use
        this.globalVariableService.addDatasource(newData).then(res => {
            console.warn('xx res', res)

            // Get new dSetID
            // TODO - do better with DB
            let newdSetID: number = 1;
            let dSetIDs: number[] = [];
            this.globalVariableService.datasets.forEach(ds => dSetIDs.push(ds.id));
            newdSetID = Math.max(...dSetIDs) + 1;

            // Get list of dSet-ids to make array work easier
            let dsCurrIDs: number[] = [];       // currentDataset IDs
            this.globalVariableService.currentDatasets.forEach(d => dsCurrIDs.push(d.id));
            let newdSet: Dataset = {
                id: newdSetID,
                datasourceID: res.id,
                sourceLocation: 'HTTP',
                url: 'data',
                folderName: '',
                fileName: '',
                data: this.currentData,
                dataRaw: this.currentData
            };

            let dataToAdd: any = {
                id: newdSetID,
                data: this.currentData
            };

            // Add to All datasets
            if (dSetIDs.indexOf(newdSetID) < 0) {
                // this.globalVariableService.datasets.push(newdSet);
                this.globalVariableService.addDataset(newdSet);
                this.globalVariableService.addData(dataToAdd).then(res => {
                    this.globalVariableService.getData(res.id).then(dat => {
                        console.warn('xx ----------')
                        console.warn('xx added data', dat)
                    });
                });
                this.globalVariableService.saveLocal('Dataset', newdSet);
            } else {
                // Add to CurrentDatasets
                if (dsCurrIDs.indexOf(newdSetID) < 0) {
                    this.globalVariableService.currentDatasets.push(newdSet);
                };
            };


            console.warn('xx ----------')
            console.warn('xx @end newdSet-datasets-currentDatasets', newdSet, this.globalVariableService.datasets,
            this.globalVariableService.currentDatasets)

            // Reset data related to this DS
            console.warn('xx currDS, gv.currDS' , this.globalVariableService.currentDatasources)

            console.log('done DS:', this.globalVariableService.datasources)
        });







        if (action == 'Saved') {
            this.formDataDirectQueryBuilderClosed.emit(null);

        } else {
            this.formDataDirectQueryBuilderClosed.emit(this.selectedDatasource);

        };

    }
}


