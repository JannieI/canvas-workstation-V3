/*
 * Create / Edit a SQL database query, using the Query Builder.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { DataTable }                  from './models';
import { DataField }                  from './models';
import { DataSchema }                 from './models';
import { Dataset }                    from './models';
import { TributaryServerType }        from './models';


@Component({
    selector: 'data-managedQueryBuilder',
    templateUrl: './data.managed.queryBuilder.component.html',
    styleUrls:  ['./data.managed.queryBuilder.component.css']
})
export class DataManagedQueryBuilderComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataManagedQueryBuilderClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }

//     authentication: string = 'UsrPsw';
//     connectionName: string = '';
//     serverType: string = 'MySQL';
//     datasourceName: string = '';
//     description: string = 'Post Trade Data Vault';
//     dataConnections: DataConnection[] = [];
//     dataTables: DataTable[] = [];
//     dataTablesFiltered: DataTable[] = [];
//     dataFields: DataField[] = [];
//     dataFieldsFiltered: DataField[] = [];
//     errorMessage: string = "";
//     selectedFieldRowIndex: number = 0;
//     selectedFields: DataField[] = [];
//     selectedTableRowIndex: number = 0;
//     serverName: string = 'MSSQL54: 8000';

//     connectionString: string = '';

// 	constructor(
//         private globalFunctionService: GlobalFunctionService,
//         private globalVariableService: GlobalVariableService,
//         private router: Router,
// 	) {}

// 	ngOnInit() {
//         // Initialise
//         this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

//         if (this.selectedDatasource == null) {
//             this.selectedDatasource = {
//                 id: null,
//                 type: '',
//                 subType: '',
//                 typeVersion: '',
//                 name: '',
//                 username: '',
//                 password: '',
//                 description: '...',
//                 createdBy: '',
//                 createdOn: null,
//                 createMethod: 'managedQueryBuilder',
//                 editor: '',
//                 dateEdited: null,
//                 refreshedBy: '',
//                 refreshedOn: null,
//                 dataFieldIDs: [0],
//                 dataFields: [''],
//                 dataFieldTypes: [''],
//                 dataFieldLengths: [0],
//                 parameters: '',
//                 folder: '',
//                 fileName: '',
//                 excelWorksheet: '',
//                 transposeOnLoad: false,
//                 startLineNr: 0,
//                 csvSeparationCharacter: '',
//                 csvQuotCharacter: '',
//                 webUrl: '',
//                 webTableIndex: '',
//                 connectionID: 0,
//                 dataTableID: 0,
//                 nrWidgets: 0,
//                 databaseName: '',
//                 port: '',
//                 serverType: '',
//                 serverName: '',
//                 dataTableName: '',
//                 dataSQLStatement: '',
//                 dataNoSQLStatement: '',
//                 dataNeo4jStatement: '',
//                 dataGraphQLStatement: '',
//                 businessGlossary: '',
//                 dataDictionary: ''
//             };
//         };
//         this.globalVariableService.getDataConnections().then(dc => {
//             this.globalVariableService.getDataTable().then(dt => {
//                 this.globalVariableService.getDataField().then(df => {

//                     // Get local Vars
//                     this.dataConnections = dc.slice();
//                     this.dataTables = dt.slice();
//                     this.dataFields = df.slice();

//                     // Select the Tables, Fields
//                     if (this.dataConnections.length > 0) {
//                         this.clickConnectionSelect(this.dataConnections[0].connectionName);
//                         this.constructConnectionString(0);

//                     } else {
//                         this.clickConnectionSelect('');
//                     };
//                 });
//             });
//         });

//     }

//     clickViewFields(area: string) {
//         // Show fields area
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickViewFields', '@Start');

//     }

//     clickConnectionSelect(ev: any) {
//         // Refresh the Tables and Fields for the selected Connection
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickConnectionSelect', '@Start');


//         let dataConnectionIndex: number = this.dataConnections.findIndex(dc =>
//             dc.connectionName == this.connectionName
//         );

//         this.connectionString = 'Unknown';

//         if (dataConnectionIndex >= 0) {
//             this.constructConnectionString(dataConnectionIndex);
//         };

//         console.warn('xx ev', this.connectionName, this.connectionString)

//         // TODO - correct this to work with the ID
//         // Fill list of Tables for first Connection
//         if (this.connectionName != '') {
//             this.filterTables(this.connectionName);
//         } else {
//             this.filterTables('');
//         };

//         // Fill list of Fields for first Table
//         if (this.dataTablesFiltered.length > 0) {
//             this.filterFields(this.dataTablesFiltered[0].id);
//         } else {
//             this.filterFields(-1);
//         };

//     }

//     filterTables(connectNameToFilter: string) {
//         // Filter Tables on Selected Connection
//         this.globalFunctionService.printToConsole(this.constructor.name,'filterTables', '@Start');

//         let connectionIndex: number = this.dataConnections.findIndex(dt =>
//             dt.connectionName == connectNameToFilter
//         );
//         let connectionID: number = -1;
//         if (connectionIndex >= 0) {
//             connectionID = this.dataConnections[connectionIndex].id;
//         };

//         console.warn('xx conn', connectionID, connectNameToFilter, connectionIndex)
//         this.dataTablesFiltered = this.dataTables.filter(dt => {
//             if (dt.connectionID == connectionID) {
//                 return dt;
//             };
//         });

//     }

//     filterFields(tableID: number) {
//         // Filter Fields on Selected Connection
//         this.globalFunctionService.printToConsole(this.constructor.name,'filterFields', '@Start');

//         this.dataFieldsFiltered = this.dataFields.filter(df => {
//             if (df.tableID == tableID) {
//                 return df;
//             };
//         });

//     }

//     constructConnectionString(index: number) {
//         // Construct single text of connection properties
//         this.globalFunctionService.printToConsole(this.constructor.name,'constructConnectionString', '@Start');

//         this.connectionString = '   Type: ' + this.dataConnections[index].serverType
//         + ',   Server: ' + this.dataConnections[index].serverName
//         + ',   Port: ' + this.dataConnections[index].port
//         + ',   Database: ' + this.dataConnections[index].database
//         + ',   Auth: ' + this.dataConnections[index].authentication
//         + ',   Description: ' + this.dataConnections[index].description;

//     }

//     clickSelectedDataTable(index: number, id: number) {
//         // Clicked a Table
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

//         // Set seletected index - used for highlighting row
//         this.selectedTableRowIndex = index;

//         // Select Fields in the table
//         this.filterFields(id);
//     }

//     clickSelectedDatafield(index: number, id: number) {
//         // Clicked a Field
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatafield', '@Start');

//         // Set seletected index - used for highlighting row
//         this.selectedFieldRowIndex = index;
//     }

//     clickClose() {
//         // Close the form, nothing saved
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

//         this.formDataManagedQueryBuilderClosed.emit(null);

//     }

//     clickSave(action: string) {
//         // Close the form, and open Transformations form
//         this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

//         console.warn('xx END sel ds', this.selectedDatasource)
//         if (action == 'Saved') {
//             this.formDataManagedQueryBuilderClosed.emit(null);

//         } else {
//             this.formDataManagedQueryBuilderClosed.emit(this.selectedDatasource);

//         }

//     }

// }



    connectionName: string = 'tributary.connectors.sql:SqlConnector';
    currentData: any[] = [];
    currentDataSnippet: any[] = [];
    dataFields: DataField[] = [];
    dataFieldsFiltered: {
        fieldName: string;  // FieldName
        fieldType: string;  // FieldType
    }[] = [];
    dataFieldsSelected: string[] = [];
    dataSchemas: DataSchema[] = [];
    dataTables: DataTable[] = [];
    errorMessage: string = "";
    helpMessage: string = '';
    nrRows: number = 0;
    selectedFieldRowIndex: number = 0;
    selectedFields: any[] = [];
    selectedTableRowIndex: number = -1;
    selectedTableName: string = '';
    serverTypes: TributaryServerType[]
    showPreview: boolean = false;
    spinner: boolean = false;

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

        if (!this.editingDS) {
        this.helpMessage = 'Enter detail, then click Refresh to show the Tables.  Select one, then select the fields to display. Click Preview to see a portion of the data.';

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
                createdOn:null,
                createMethod: 'directQueryBuilder',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedOn: null,
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
                webUrl: '',
                webTableIndex: '',
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
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                businessGlossary: '',
                dataDictionary: ''

            };
        } else {

            this.helpMessage = 'Amend the above info if needed, then click Refresh and select the Table & Fields.  Else, click Preview to see a portion of the data.';

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


            // Click Table, which will filter Fields
            let dsIndex: number = this.dataSchemas.findIndex(
                dsch => dsch.tableName == this.selectedDatasource.dataTableName
            );
            if (dsIndex >= 0) {
                // this.showPreview = true;
                this.selectedTableRowIndex = dsIndex;
                this.clickSelectedDataTable(dsIndex, this.dataSchemas[this.selectedTableRowIndex].tableName);

                // Build the selected fields
                for (let i = 0; i < this.selectedDatasource.dataFields.length; i++) {
                    this.selectedFields.push(
                        {
                            fieldName: this.selectedDatasource.dataFields[i],
                            fieldType: this.selectedDatasource.dataFieldTypes[i]
                        }
                    );
                    this.dataFieldsSelected.push(this.selectedDatasource.dataFields[i]);
                };
            };
        };

    }

    clickRefresh() {
        // Get the tables and fields from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefresh', '@Start');

        // Reset
        this.showPreview = false;
        this.helpMessage = '';
        this.spinner = true;
        this.errorMessage = '';

        // Remember table we started with
        let localSelectedTableRowIndex = this.selectedTableRowIndex;

        // Build Spec
        let specificationInspect: any = {
            "source": {
                "inspector": "tributary.inspectors.sql:SqlInspector",
                "specification": {
                    "drivername": "postgresql",
                    "username": "ftfhgfzh",
                    "password": "L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl",
                    "database": "ftfhgfzh",
                    "host": "pellefant.db.elephantsql.com",
                    "port": 5432
                }
            }
        };

        this.globalVariableService.getTributaryInspect(specificationInspect)
            .then(res => {
                // Show if the user has not clicked another row - this result came back async
                if ( localSelectedTableRowIndex == this.selectedTableRowIndex) {
                    this.helpMessage = 'Enter detail, then click Refresh to show the Tables.  Select one, then select the fields to display. Click Preview to see a portion of the data.';
                };
                this.spinner = false;

                // Fill the tables and Fields
                this.dataSchemas = [];
                res.forEach(row => {

                    this.dataSchemas.push(
                    {
                        serverName: this.selectedDatasource.serverName,
                        tableName: row.name,
                        tableDescription: row.name,
                        tableFields: [],
                        tableMetadata: []
                    });
                    row.fields.forEach(fld => {
                        this.dataSchemas[this.dataSchemas.length - 1].tableFields.push(
                            {
                                fieldName: fld.name,
                                fieldType: fld.dtype
                            }
                        )
                    });
                });

                // Click first table
                if (this.dataSchemas.length > 0) {
                    this.selectedTableRowIndex = 0;
                    this.selectedTableName = this.dataSchemas[0].tableName;
                    if (this.dataSchemas.length > 0) {
                        this.dataFieldsFiltered = this.dataSchemas.filter(datsch => {
                            if (datsch.tableName == this.dataSchemas[0].tableName) {
                                return datsch;
                            };
                        })[0].tableFields;

                    } else {
                        this.dataFieldsFiltered = [];
                    };
                };
            })
            .catch(err => {
                this.spinner = false;
                this.errorMessage = err.message + '. ';
                this.helpMessage = '';
                if (err.status == 401) {
                    this.errorMessage = 'Error: ' + 'Either you login has expired, or you dont have access to the Database. '
                        + err.message;
                } else {
                    this.errorMessage = err.message;
                };
            });

    }

    clickSelectedDataTable(index: number, tableName: string) {
        // Clicked a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        this.helpMessage = 'Select Fields, and click Preview to see a portion of the data.';

        // Reset selected Fields
        if (this.selectedTableRowIndex != index) {
            this.selectedFields = [];
            this.dataFieldsSelected = [];
            this.showPreview = false;
        };

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;
        this.selectedTableName = tableName;

        // Select Fields in the table
        this.dataFieldsFiltered = this.dataSchemas.filter(datsch => {
            if (datsch.tableName == tableName) {
                return datsch;
            };
        })[0].tableFields;

    }

    clickSelectedDatafield(index: number) {
        // Clicked a Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatafield', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedFieldRowIndex = index;

        // Set array for preview headings
        this.dataFieldsSelected = this.selectedFields.map(f => f.fieldName);

    }

    clickPreview() {
        // Get the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickPreview', '@Start');

        // Reset
        this.showPreview = false;
        this.helpMessage = '';
        this.spinner = true;
        this.errorMessage = '';

        // No Fields, no data
        if (this.selectedFields.length == 0) {
            this.errorMessage = 'Make sure you have selected a Table and some fields.  If these are not showing, click Refresh.';
            return;
        };
        this.helpMessage = 'Getting the data ...';

        // Set array for preview headings
        this.dataFieldsSelected = this.selectedFields.map(f => f.fieldName);

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType == this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];

        // Build SQL string
        let sqlTable: string = this.selectedTableName;
        let sqlFields: string = '';
        this.selectedDatasource.dataSQLStatement = "select * from invoices";
        this.selectedFields.forEach(fld => {
            if (sqlFields != '') {
                sqlFields = sqlFields + ', ';
            };
            sqlFields = sqlFields + '"' + fld.fieldName + '"';
        });
        this.selectedDatasource.dataSQLStatement = 'SELECT ' + sqlFields + ' FROM ' + sqlTable;
        console.warn('xx',this.selectedDatasource.dataSQLStatement)

        // Build source string
        let specificationConnect: any = {
            "source": {
                "connector": "tributary.connectors.sql:SqlConnector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": this.selectedDatasource.databaseName,
                    "host": this.selectedDatasource.serverName,
                    "port": +this.selectedDatasource.port,
                    "query": this.selectedDatasource.dataSQLStatement
                }
            }
        };

        // Get data from Tributary
        this.globalVariableService.getTributaryData(specificationConnect).then(res => {
            this.spinner = false;
            this.currentData = res;
            this.helpMessage = '';
            this.showPreview = true;
            this.nrRows = res.length;
            this.currentDataSnippet = res.slice(0, 8);

        })
        .catch(err => {
            this.showPreview = true;
            this.errorMessage = err.message + '. ';
            this.helpMessage = '';
            this.spinner = false;
            if (err.status == 401) {
                this.errorMessage = 'Error: ' + 'Either you login has expired, or you dont have access to the Database. '
                    + err.message;
            } else {
                this.errorMessage = err.message;
            };
        });

    }

    clickClose() {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedQueryBuilderClosed.emit(null);

    }

    clickSave(action: string) {
        // Save the DS and info, Close the form, and open Transformations form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';
        this.helpMessage = '';

        // Validation
        if (this.selectedTableRowIndex < 0) {
            this.showPreview = false;
            this.errorMessage = 'No Table selected';
            return;
        };
        if (this.selectedFields.length == 0) {
            this.showPreview = false;
            this.errorMessage = 'No Fields selected';
            return;
        };

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

        // Make sure at least one field selected
        if (dataFields.length == 0) {
            this.showPreview = false;
            this.helpMessage = '';
            this.errorMessage = 'No fields selected';
            return;
        };

        let today = new Date();

        // Create new Datasource, dataSet & Data
        // TODO - Encrypt password at a later stage
        let newDatasource: Datasource =  {
            id: null,
            name: this.selectedDatasource.name,
            username: this.selectedDatasource.username,
            password: this.selectedDatasource.password,
            type: this.selectedDatasource.type,
            subType: this.selectedDatasource.subType,
            typeVersion: this.selectedDatasource.typeVersion,
            description: this.selectedDatasource.description,
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: today,
            createMethod: 'directQueryBuilder',
            editor: '',
            dateEdited: null,
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedOn: today,
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
            webUrl: this.selectedDatasource.webUrl,
            webTableIndex: this.selectedDatasource.webTableIndex,
            connectionID: this.selectedDatasource.connectionID,
            dataTableID: this.selectedDatasource.dataTableID,
            nrWidgets: this.selectedDatasource.nrWidgets,
            databaseName: this.selectedDatasource.databaseName,
            port: this.selectedDatasource.port,
            serverType: this.selectedDatasource.serverType,
            serverName: this.selectedDatasource.serverName,
            dataTableName: this.dataSchemas[this.selectedTableRowIndex].tableName,
            dataSQLStatement: this.selectedDatasource.dataSQLStatement,
            dataNoSQLStatement: this.selectedDatasource.dataNoSQLStatement,
            dataNeo4jStatement: this.selectedDatasource.dataNeo4jStatement,
            dataGraphQLStatement: this.selectedDatasource.dataGraphQLStatement,
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
        });

        // Close form and open Transitions if requested
        if (action == 'Saved') {
            this.formDataManagedQueryBuilderClosed.emit(null);

        } else {
            this.formDataManagedQueryBuilderClosed.emit(this.selectedDatasource);

        };

    }
}



