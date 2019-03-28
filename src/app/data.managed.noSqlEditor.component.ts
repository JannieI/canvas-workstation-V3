/*
 * Create a new Datasource to a managed NoSQL database
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
import { TributaryServerType }        from './models';


@Component({
    selector: 'data-managedNoSqlEditor',
    templateUrl: './data.managed.noSqlEditor.component.html',
    styleUrls:  ['./data.managed.noSqlEditor.component.css']
})
export class DataManagedNoSQLEditorComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataManagedNoSQLEditorClosed: EventEmitter<Datasource> = new EventEmitter();

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

   
    canSave: boolean = false;
    connectionName: string = '';
    connectionString: string = '';
    dataConnections: DataConnection[];
    dataConnectionNames: string[] = [];
    errorMessage: string = '';
    fileData: any = [];
    fileDataFull: any = [];
    reader = new FileReader();
    savedMessage: string = '';
    // selectedFields: string = "BillingAddress,BillingCity,BillingCountry,BillingPostalCode,BillingState,CustomerId,InvoiceDate,InvoiceId,Total";
    serverTypes: TributaryServerType[];
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
        this.serverTypes = this.globalVariableService.serverTypes.slice();
        this.globalVariableService.getResource('dataConnections')
            .then(dc => {
                this.dataConnections = dc.slice();
                this.dataConnectionNames = this.dataConnections.map(con => con.connectionName);
                this.dataConnectionNames = ['', ...this.dataConnectionNames];
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in managed.noSQL reading dataConnections: ' + err);
            });

        if (this.selectedDatasource == null) {
            let today: Date = new Date();
            this.selectedDatasource = {
                id: null,
                type: 'Server',
                subType: '',
                typeVersion: '',
                name: '',
                username: 'ftfhgfzh',
                password: 'L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl',
                description: '',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                createMethod: 'managedNoSQLEditor',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                datasourceFilters: [],
                accessType: '',
                cacheResultsOnServer: true,
                serverExpiryDateTime: null,
                unRefreshable: true,
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
                connectionID: 0,
                dataTableID: 0,
                nrWidgets: 0,
                databaseName: 'ftfhgfzh',
                port: '5432',
                serverType: 'PostgresSQL',
                serverName: 'pellefant.db.elephantsql.com',
                dataTableName: 'ftfhgfzh',
                dataSQLStatement: '',
                dataNoSQLStatement: 'db.inventory.find( { status: { $in: [ "A", "D" ] } } )',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                businessGlossary: 'Obtained using SQL Editor',
                dataDictionary: '',
                datasourceCombinationSpec: null,
                rowLimitFromSource: 0,
                timeoutLimitSeconds: 0,
                endLineNr: 0,
                startColumnNr: 1,
                endColumnNr: 0,
                encoding: 'Ascii',
                serviceUrl: '',
                serviceParams: '',
                serviceQueryParams: '',
                serviceHeaders: '',
                sourceIsAccessable: true,
                queryParameters: '',
                metaDataFields: [],
                transformations: [],
                dataErrorMessage: '',
                nrRecordsReturned: 0,
                sourceLocation: '',
                dataFull: [],
                dataFiltered: []


            };
        };

    }

    clickGo() {
        // Load the File content
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo',           '@Start');

        // Reset
        this.errorMessage = '';
        this.showPreview = false;
        this.canSave = false;

        // Show user
        this.spinner = true;

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
        this.selectedDatasource.dataNoSQLStatement = this.selectedDatasource.dataNoSQLStatement.trim();
        let specificationConnect: any = {
            "source": {
                "connector": "tributary.connectors.mongodb:MongoDBConnector",
                "specification": {
                    "drivername": driver,
                    "username": this.selectedDatasource.username,
                    "password": this.selectedDatasource.password,
                    "database": database,
                    "host": serverName,
                    "port": port,
                    "query": this.selectedDatasource.dataNoSQLStatement
                }
            }
        };

        this.globalVariableService.getTributaryData(specificationConnect).then(res => {

            // Fill the data
            this.fileData = res.slice(0,10);
            this.fileDataFull = res;
            // this.selectedDatasource.dataFields = this.selectedFields.split(",");

            // Construct a list of field name / column headings from the data
            this.selectedDatasource.dataFields = [];

            if (res.length > 0) {
                for(var key in res[0]) {
                    this.selectedDatasource.dataFields.push(key);
                }
            };
            // Show the results
            this.showPreview = true;
            this.spinner = false;

            // Can Add now
            this.canSave = true;

        })
        .catch(err => {
            this.spinner = false;
            this.errorMessage = err.slice(0, 100);
            console.error('Error in managed.noSQL getTributaryData: ' + err);
        }); 
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedNoSQLEditorClosed.emit(null);

    }

    clickAdd(action: string) {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.savedMessage = '';

        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        if (this.selectedDatasource.name == ''  ||  this.selectedDatasource.name == null) {
            this.errorMessage = 'The name is compulsory';
            return;
        };
        if (this.selectedDatasource.description == ''  ||  this.selectedDatasource.description == null) {
            this.errorMessage = 'The description is compulsory';
            return;
        };

        // Construct DS and add to DB
        if (this.editingDS) {
            let today: Date = new Date();
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;

            // Save DS to DB, but create a new data records.
            let updatedData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.saveDatasource(this.selectedDatasource, updatedData)
                .then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource updated';
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in managed.noSQL saveDatasource: ' + err);
                });
    
        } else {
            // Add new one
            let newData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.addDatasource(
                this.selectedDatasource,
                newData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource added';

                })
                .catch(err => {
                    this.spinner = false;
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in managed.NoSQL clickAdd: ' + err);
                });
        };

        // Close form and open Transitions if requested
        if (action == 'Saved') {
            this.formDataManagedNoSQLEditorClosed.emit(null);

        } else {
            this.formDataManagedNoSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}


