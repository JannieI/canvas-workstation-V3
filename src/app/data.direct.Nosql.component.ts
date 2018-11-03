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
import { Dataset }                    from './models';
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
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };

    }  


    canSave: boolean = false;
    errorMessage: string = "";
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

        if (this.selectedDatasource == null) {
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
                dataFieldIDs: [0],
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                parameters: '',
                accessType: '',
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
                dataOverlaySpecification: '',
                businessGlossary: 'Obtained using NoSQL Editor',
                dataDictionary: ''

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
            .filter(styp => styp.serverType == this.selectedDatasource.serverType)
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
        this.globalVariableService.getTributaryInspect(specificationInspect).then(res => {
            console.warn('xx res I', res)

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
                    console.warn('xx res[0]', res[0])
                    for(var key in res[0]) {
                        console.warn('xx key', key)
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
                this.errorMessage = 'Error connecting to server: check login or permissions'
                    + err.message;
            });
        })
        .catch(err => {
            console.warn('xx err', err)
            this.spinner = false;
            this.errorMessage = 'Error connecting to server: check login or permissions'
                + err.message;
        });

    }

    clickClose() {
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

            // Save DS to DB, but create a new dSet and new data records.
            let ds: number[] = [];
            let dSetID: number = 1;
            for (var i = 0; i < this.globalVariableService.datasets.length; i++) {
                if(this.globalVariableService.datasets[i].datasourceID ==
                    this.selectedDatasource.id) {
                    ds.push(this.globalVariableService.datasets[i].id)
                };
            };
            if (ds.length > 0) {
                dSetID = Math.max(...ds);
            };
            let datasetIndex: number = this.globalVariableService.datasets.findIndex(dSet => {
                if (dSet.id == dSetID) {
                    return dSet;
                };
            });
            let updatedDataset: Dataset = this.globalVariableService.datasets[datasetIndex];

            let dataID: number = -1;
            let dataIndex: number = updatedDataset.url.indexOf('/');
            if (dataIndex >= 0) {
                dataID = +updatedDataset.url.substring(dataIndex + 1);
            } else {
                alert('Error in save Web - url has no / character');
                return;
            };
            let updatedData: any = {
                id: dataID,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.saveData(updatedData).then(resData => {

                updatedDataset.url = 'data/' + dataID;
                this.globalVariableService.saveDatasource(this.selectedDatasource).then(
                    resDS => {
                        updatedDataset.datasourceID = this.selectedDatasource.id;
                        this.globalVariableService.saveDataset(updatedDataset);
                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource updated';
            });

        } else {
            // Add new one
            let newdDataset: Dataset = {
                id: null,
                datasourceID: null,
                sourceLocation: 'HTTP',
                url: 'data',
                folderName: '',
                fileName: '',
                cacheServerStorageID: null,
                cacheLocalStorageID: null,
                isLocalDirty: null,
                data: this.fileDataFull,
                dataRaw: this.fileDataFull
            };
            let newData: any = {
                id: null,
                data: this.fileDataFull
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.addData(newData).then(resData => {

                newdDataset.url = 'data/' + resData.id.toString();
                this.globalVariableService.addDatasource(this.selectedDatasource).then(resDS => {
                    newdDataset.datasourceID = resDS.id;
                    this.globalVariableService.addDataset(newdDataset);

                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource created';
            });
        };

        // Close form and open Transitions if requested
        if (action == 'Saved') {
            this.formDataDirectNoSQLEditorClosed.emit(null);

        } else {
            this.formDataDirectNoSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}


