/*
 * Create a direct Datasource for a NoSQL database.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { TributaryServerType }        from './models';


@Component({
    selector: 'data-direct-Nosql', 
    templateUrl: './data.direct.Nosql.component.html',
    styleUrls:  ['./data.direct.Nosql.component.css']
})
export class DataDirectNoSQLComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;
    
    @Output() formDataDirectNoSQLEditorClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }  


    canSave: boolean = false;
    errorMessage: string = '';
    fileData: any = [];
    fileDataFull: any = [];
    reader = new FileReader();
    savedMessage: string = '';
    selectedFields: string = "BillingAddress,BillingCity,BillingCountry,BillingPostalCode,BillingState,CustomerId,InvoiceDate,InvoiceId,Total";
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
        // TODO - consider enhancing this.globalVariableService.serverTypes;
        this.serverTypes = [
            {
                serverType: 'Mongo', 
                driverName: 'mongo',
                inspector: 'tributary.inspectors.mongodb:MongoDBInspector',
                connector: 'tributary.connectors.mongodb:MongoDBConnector',
                editedBy: '',
                editedOn: null,
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: new Date()
            }
        ];

        if (this.selectedDatasource === null) {
            let today: Date = new Date();
            this.selectedDatasource = {
                id: null,
                type: 'Server',
                subType: '',
                typeVersion: '',
                name: '',
                username: 'mongodb',
                password: 'pass',
                description: '',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                createMethod: 'directNoSQL',
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
                databaseName: 'data',
                port: '27017',
                serverType: 'Mongo',
                serverName: 'mongodb',
                dataTableName: '',
                dataSQLStatement: '',
                dataNoSQLStatement: 'db.bios.find( { _id: 5 } )',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                businessGlossary: 'Obtained using NoSQL Editor',
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

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType === this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];

        // TODO - At moment, Mongo does not have an Inspector
        // let specificationInspect: any = {
        //     "source": {
        //         "inspector": "tributary.inspectors.mongodb:MongoDBInspector",
        //         "specification": {
        //             "username": this.selectedDatasource.username,
        //             "password": this.selectedDatasource.password,
        //             "database": this.selectedDatasource.databaseName,
        //             "host": this.selectedDatasource.serverName,
        //             "port": +this.selectedDatasource.port
        //         }
        //     }
        // };
        let specificationInspect: any = {
            "source": {
                "inspector": "tributary.inspectors.mongodb:MongoDBInspector",
                "specification": {
                    "database": this.selectedDatasource.databaseName,
                    "host": this.selectedDatasource.serverName,
                    "port": +this.selectedDatasource.port
                }
            }
        };

        // Call Tributary
        this.globalVariableService.getTributaryInspect(specificationInspect)
            .then(res => {

                // Set up specification
                this.selectedDatasource.dataNoSQLStatement = this.selectedDatasource.dataNoSQLStatement.trim();
                // let specificationConnect: any = {
                //     "source": {
                //         "connector": "tributary.connectors.mongodb:MongoDBConnector",
                //         "specification": {
                //             "collection": 'cars',
                //             "username": this.selectedDatasource.username,
                //             "password": this.selectedDatasource.password,
                //             "database": this.selectedDatasource.databaseName,
                //             "host": this.selectedDatasource.serverName,
                //             "port": +this.selectedDatasource.port,
                //             "query": this.selectedDatasource.dataNoSQLStatement
                //         }
                //     }
                // };
                let specificationConnect: any = {
                    "source": {
                        "connector": "tributary.connectors.mongodb:MongoDBConnector",
                        "specification": {
                            "collection": 'cars',
                            "database": this.selectedDatasource.databaseName,
                            "host": this.selectedDatasource.serverName,
                            "port": +this.selectedDatasource.port,
                            "query": {}
                        }
                    }
                };


                this.globalVariableService.getTributaryData(specificationConnect).then(res => {

                    // Fill the data
                    this.fileData = res.slice(0,10);
                    this.fileDataFull = res;

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
                .catch(errorMessage => {
                    this.spinner = false;
                    this.errorMessage = 'Error connecting to server: check login or permissions'
                        + errorMessage;
                });
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.noSQL getTributaryInspect: ' + err);
                this.spinner = false;
                this.errorMessage = 'Error connecting to server: check login or permissions'
                    + err;
            });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectNoSQLEditorClosed.emit(null);

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
        if (this.selectedDatasource.name === ''  ||  this.selectedDatasource.name === null) {
            this.errorMessage = 'The name is compulsory';
            return;
        };
        if (this.selectedDatasource.description === ''  ||  this.selectedDatasource.description === null) {
            this.errorMessage = 'The description is compulsory';
            return;
        };

        // Construct DS and add to DB
        if (this.editingDS) {
            let today: Date = new Date();
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;

            // Save DS to DB, but create a new dSet and new data records.
            let updatedData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.addDatasource(
                this.selectedDatasource,
                updatedData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource updated';

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.noSQL clickAdd: ' + err);
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
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.noSQL clickAdd: ' + err);
                });
        };

        // Close form and open Transitions if requested
        if (action === 'Saved') {
            this.formDataDirectNoSQLEditorClosed.emit(null);

        } else {
            this.formDataDirectNoSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}


