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
import { DataConnection }             from './models';
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


    connectionName: string = '';
    dataConnections: DataConnection[];
    dataConnectionNames: string[] = [];
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


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set base info
        this.serverTypes = this.globalVariableService.serverTypes;
        this.globalVariableService.getDataConnections().then(dc => {
            this.dataConnections = dc.slice();
            this.dataConnectionNames = this.dataConnections.map(con => con.connectionName);
            this.dataConnectionNames = ['', ...this.dataConnectionNames];
            console.warn('xx this.dataConnectionNames = ', this.dataConnectionNames )
        });

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
                createMethod: 'managedQueryBuilder',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                dataFieldIDs: [0],
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                parameters: '',
                cacheResultsOnServer: true,
                unRefreshable: true,
                nrCacheCopies: 999,
                cacheResultsLocal: false,
                oldnessMaxPeriodInterval: '',
                oldnessMaxPeriodUnits: 0,
                oldnessRelatedDate: '',
                oldnessRelatedTime: '',
                refreshedLocalOn: null,
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                webUrl: '',
                webTableIndex: '',
                connectionID: 1,
                dataTableID: 0,
                nrWidgets: 0,
                databaseName: '',
                port: '',
                serverType: '',
                serverName: '',
                dataTableName: '',
                dataSQLStatement: '',
                dataNoSQLStatement: '',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                dataOverlaySpecification: '',
                businessGlossary: '',
                dataDictionary: ''

            };
        } else {

            this.helpMessage = 'Amend the above info if needed, then click Refresh and select the Table & Fields.  Else, click Preview to see a portion of the data.';

            // Select the selection
            let connection: DataConnection = this.dataConnections[this.selectedDatasource.connectionID] 
                || null;
            if (connection != null) {
                this.connectionName = connection.connectionName;
            };

            // Get the Schema from Tributary, and refresh
            this.clickRefresh();
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

        // Get connection detail
        let connection: DataConnection[] = this.dataConnections.filter(
            con => con.connectionName == this.connectionName 
        );
        let serverType: string = '';
        let serverName: string = '';
        let port: number = 0;
        let database: string = '';
        if (connection.length > 0) {
            serverType = connection[0].serverType;
            serverName = connection[0].serverName;
            port = +connection[0].port;
            database = connection[0].database;
        };

        // Get the driver
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType == serverType)
            .map(styp => styp.driverName)[0];
        
        // Build Spec
        let specificationInspect: any = {
            "source": {
                "inspector": "tributary.inspectors.sql:SqlInspector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": database,
                    "host": serverName,
                    "port": port
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


        // Get connection detail
        let connection: DataConnection[] = this.dataConnections.filter(
            con => con.connectionName == this.connectionName 
        );
        let serverType: string = '';
        let serverName: string = '';
        let port: number = 0;
        let database: string = '';
        if (connection.length > 0) {
            serverType = connection[0].serverType;
            serverName = connection[0].serverName;
            port = +connection[0].port;
            database = connection[0].database;
        };

        // Get the driver
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType == serverType)
            .map(styp => styp.driverName)[0];
        
        // Build Spec
        let specificationConnect: any = {
            "source": {
                "connector": "tributary.connectors.sql:SqlConnector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": database,
                    "host": serverName,
                    "port": port,
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
            createMethod: 'managedQueryBuilder',
            editor: '',
            dateEdited: null,
            refreshedBy: this.globalVariableService.currentUser.userID,
            refreshedServerOn: today,
            dataFieldIDs: this.selectedDatasource.dataFieldIDs,
            dataFields: dataFields,
            dataFieldTypes: dataFieldTypes,
            dataFieldLengths: dataFieldLengths,
            parameters: this.selectedDatasource.parameters,
            cacheResultsOnServer: this.selectedDatasource.cacheResultsOnServer,
            unRefreshable: this.selectedDatasource.unRefreshable,
            nrCacheCopies: this.selectedDatasource.nrCacheCopies,
            cacheResultsLocal: this.selectedDatasource.cacheResultsLocal,
            oldnessMaxPeriodInterval: this.selectedDatasource.oldnessMaxPeriodInterval,
            oldnessMaxPeriodUnits: this.selectedDatasource.oldnessMaxPeriodUnits,
            oldnessRelatedDate: this.selectedDatasource.oldnessRelatedDate,
            oldnessRelatedTime: this.selectedDatasource.oldnessRelatedTime,
            refreshedLocalOn: this.selectedDatasource.refreshedLocalOn,
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
            dataOverlaySpecification: this.selectedDatasource.dataOverlaySpecification,
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
            cacheServerStorageID: null,
            cacheLocalStorageID: null,
            isLocalDirty: null,
            data: this.currentData,
            dataRaw: this.currentData
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



