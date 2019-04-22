/*
 * Create a new Datasource using a SQL Editor.
 */

// NOTE: this form is experimental, and not completed
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
import { DataConnection }             from './models';
import { DataSchema }                 from './models';
import { Datasource }                 from './models';
import { TributaryServerType }        from './models';

// Templates
import { datasourceTemplate }         from './templates';

@Component({
    selector: 'data-createDS-sqlEditor',
    templateUrl: './data.createDS.sqlEditor.component.html',
    styleUrls:  ['./data.createDS.sqlEditor.component.css']
})
export class DataCreateDSSQLEditorComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataCreateDSSQLEditorClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };


        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {

            if (this.step === 'Where') {
                this.clickNextToWhat();
                return;
            } else {
                if (this.step === 'What') {
                    // this.clickCalculatedApply();
                    return;
                };
                // this.clickSave('Saved');
                return;
            }
        };        
    }


    canSave: boolean = false;
    dataConnections: DataConnection[];
    dataSchemas: DataSchema[] = [];
    fieldsInTable: string[];
    fileData: any = [];
    fileDataFull: any = [];
    howErrorMessage: string = '';
    isEditing: boolean = false;
    reader = new FileReader();
    savedMessage: string = '';
    selectedField: string = '';
    selectedConnectionRowIndex: number = -1;
    selectedTable: string = '';
    serverTypes: TributaryServerType[];
    showPreview: boolean = false;
    specificationConnect: any;
    spinner: boolean = false;
    step: string = 'Where';
    tributarySessionInspectURL: string = '';
    tributarySessionExecuteURL: string = '';
    tributarySessionCreateDatasourceURL: string = '';
    whatErrorMessage: string = 'Error Testing What';
    whereErrorMessage: string = '';

    // TODO - code these ...
    nrParameters: number = 0;
    transitionDescription: number = 0;
    position: number = 0;
    adding: boolean = false;
    transformationName: string = ''
    transformations: any[] = [];
    selectedDataRowIndex: number = -1;
    datasourceTransformations: any[] = [];
    dataFields: any[] = [];

    howParameter1Title: string = '';
    parameter1Heading: string = '';
    parameter1Value: string = '';
    parameter1Placeholder: string = '';
    parameter1Title: string = '';

    howParameter2Title: string = '';
    parameter2Heading: string = '';
    parameter2Value: string = '';
    parameter2Placeholder: string = '';
    parameter2Title: string = '';

    howParameter3Title: string = '';
    parameter3Heading: string = '';
    parameter3Value: string = '';
    parameter3Placeholder: string = '';
    parameter3Title: string = '';

    howParameter4Title: string = '';
    parameter4Heading: string = '';
    parameter4Value: string = '';
    parameter4Placeholder: string = '';
    parameter4Title: string = '';

    howParameter5Title: string = '';
    parameter5Heading: string = '';
    parameter5Value: string = '';
    parameter5Placeholder: string = '';
    parameter5Title: string = '';

    howParameter6Title: string = '';
    parameter6Heading: string = '';
    parameter6Value: string = '';
    parameter6Placeholder: string = '';
    parameter6Title: string = '';

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
            })
            .catch(err => {
                this.whereErrorMessage = err;
            });

        if (this.selectedDatasource == null) {
            this.isEditing = false;
            let today: Date = new Date();

            // TODO - use DS template
            this.selectedDatasource = datasourceTemplate;
            this.selectedDatasource.type = 'Server';
            this.selectedDatasource.username = 'postgres';     //'ftfhgfzh',
            this.selectedDatasource.password = 'postgres';     //'L0Eph9ftbx0yh45aeDtgzsGKBa2ZNhfl'
            this.selectedDatasource.createdBy = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.createdOn = today;            this.selectedDatasource.createMethod = 'directSQLEditor';
            this.selectedDatasource.databaseName = 'data';       //'ftfhgfzh',
            this.selectedDatasource.port = '5000';               //'5432',
            this.selectedDatasource.serverType = 'PostgresSQL';
            this.selectedDatasource.serverName = 'postgres';     //'pellefant.db.elephantsql.com',
            this.selectedDatasource.dataTableName = 'ftfhgfzh';
            this.selectedDatasource.dataSQLStatement =  'SELECT ;"SalePrice", \"FullBath\", \"HalfBath\", \"TotRmsAbvGrd\", \"LotArea\" FROM \"kaggle_house_prices\"',  //'SELECT "InvoiceDate", "BillingCity"  FROM invoices',
            this.selectedDatasource.businessGlossary = 'Obtained ;sing SQL Editor',
            this.selectedDatasource.encoding = 'Ascii';
        } else {
            this.isEditing = true;
            this.clickNextToWhat();
        };

    }

    // TODO - fix these
    clickAdd() {}
    clickDelete() {}
    clickCancel() {}
    clickAddUpdateTransformation() {}
    clickSelectedTransformation() {}
    clickTemplateDashboard(ev: any) {}
    clickEdit() {}
    clickSave() {}
    clickMoveUp() {}
    clickMoveDown() {}
    dblclickDelete() {}




    clickRow(index: number, connectionID: number) {
        // Fill in detail for the selected Connection Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        let dataConnectionIndex: number =  this.dataConnections.findIndex(
            dc => dc.id === connectionID
        );
        if (dataConnectionIndex < 0) {
            return;
        };
        let selectedDataConnection: DataConnection =  this.dataConnections[dataConnectionIndex];
        
        this.selectedDatasource.description = this.selectedDatasource.description==''?
            selectedDataConnection.description  :  this.selectedDatasource.description;
        this.selectedDatasource.serverType = selectedDataConnection.serverType;
        this.selectedDatasource.serverName = selectedDataConnection.serverName;
        this.selectedDatasource.port = selectedDataConnection.port;
        this.selectedDatasource.databaseName = selectedDataConnection.database;

        // Set selected Row
        this.selectedConnectionRowIndex = index;
    }

    clickNextToWhat() {
        // Load the Tables and Fields, using the Tributary Inspector
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNextToWhat',           '@Start');

        // Reset
        this.whereErrorMessage = '';

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType === this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];
        let inpector: string = this.serverTypes
            .filter(styp => styp.serverType === this.selectedDatasource.serverType)
            .map(styp => styp.inspector)[0];

        // Create a Tributary Session
        this.globalVariableService.tributaryCreateSession()
            .then(res => {

                // Store URLs
                this.tributarySessionInspectURL = res.inspect;
                this.tributarySessionExecuteURL = res.execute;
                this.tributarySessionCreateDatasourceURL = res.create_datasource;

                // Define the Tributary Specification
                let specificationInspect: any = {
                    "source": {
                        "inspector": inpector, // "tributary.inspectors.sql:SqlInspector",
                        "specification": {
                            "drivername": driver,  //"postgresql",
                            "host": this.selectedDatasource.serverName,
                            "port": +this.selectedDatasource.port,
                            "username": this.selectedDatasource.username,
                            "password": this.selectedDatasource.password,
                            "database": this.selectedDatasource.databaseName
                        }
                    }
                };

                // Call Tributary Inspector
                this.globalVariableService.tributaryInspect(
                    this.tributarySessionInspectURL, specificationInspect)
                .then(res => {

                    // Fill the Data Schemas (tables and fields)
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

                    // Fill the Array of Fields (for ngFor)
                    if (this.dataSchemas.length > 0) {
                        // this.clickSelectTable(this.dataSchemas[0].tableName);
                        this.fieldsInTable = this.dataSchemas[0].tableFields.map(tf => tf.fieldName);
                    };

                    // Reset
                    this.whereErrorMessage = '';
                    this.whatErrorMessage = '';
                    this.showPreview = false;
                    this.canSave = false;
                    this.step = 'What';

                    // Show user
                    this.spinner = false;

                })
                .catch(errorMessage => {
                    this.spinner = false;
                    this.whereErrorMessage = 'Error connecting to server (1st check login or permissions) '
                        + errorMessage;
                });
            })
            .catch(errorMessage => {
                this.whereErrorMessage = errorMessage;
                return;
            });

    }

    clickGo() {
        // Load the File content
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo',           '@Start');

        // Reset
        this.whereErrorMessage = '';
        this.whatErrorMessage = '';
        this.showPreview = false;
        this.canSave = false;

        // Show user
        this.spinner = true;

        // Get drivers
        let driver: string = this.serverTypes
            .filter(styp => styp.serverType === this.selectedDatasource.serverType)
            .map(styp => styp.driverName)[0];
        let connector: string = this.serverTypes
            .filter(styp => styp.serverType === this.selectedDatasource.serverType)
            .map(styp => styp.connector)[0];

        // Set up specification for Connector
        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement.trim();
        this.specificationConnect = {
            "source": {
                "connector": connector,
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

        // Get Tributary data
        this.globalVariableService.tributaryExecute(
                this.tributarySessionExecuteURL, 
                this.specificationConnect
            )
            .then(res => {

                // Fill the data
                this.fileData = res.sample.results.slice(0,10);
                this.fileDataFull = res;


                // Construct a list of field name / column headings from the data
                this.selectedDatasource.dataFields = [];

                if (res.sample.results.length > 0) {
                    for(var key in res.sample.results[0]) {
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
                this.whatErrorMessage = 'Error connecting to server: check login or permissions'
                    + errorMessage;
            });

    }

    clickSelectTable(ev: any) {
        // User selected a table, fill the fields for it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTable', '@Start');

        this.fieldsInTable = [];
        let selectedDataSchema: DataSchema[] = this.dataSchemas.filter(
            dsch => dsch.tableName === ev.target.value
        );

        if (selectedDataSchema.length > 0) {
            this.fieldsInTable = selectedDataSchema[0].tableFields.map(tf => tf.fieldName);
        };
    }

    clickExport() {
        // Export the file, and close the file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport', '@Start');

        // Export
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/json;charset=utf-u,'+encodeURIComponent(this.selectedDatasource.dataSQLStatement));
        a.setAttribute('download', 'Canvas SQL statement');
        a.click()

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataCreateDSSQLEditorClosed.emit(null);

    }

    clickAddUpdateCloseDatasource(action: string) {
        // Add / Update the DS, save to the DB and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddUpdateCloseDatasource', '@Start');

        // Reset
        this.whereErrorMessage = '';
        this.savedMessage = '';

        // Set up specification for Connector
        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement.trim();
        let specificationCreateDatasource: any = {
            "name": "Test One",
            "description": "Test One",
            "specification": this.specificationConnect,
            "cachable": false
        };

    }

    clickAddUpdateNextTransform(action: string) {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddUpdateNextTransform', '@Start');

        // Reset
        this.whereErrorMessage = '';
        this.howErrorMessage = '';
        this.savedMessage = '';
        this.step = 'How';

        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        if (this.selectedDatasource.name === ''  ||  this.selectedDatasource.name == null) {
            this.whereErrorMessage = 'The name is compulsory';
            return;
        };
        if (this.selectedDatasource.description === ''  ||  this.selectedDatasource.description == null) {
            this.whereErrorMessage = 'The description is compulsory';
            return;
        };

        // Construct DS and save / add to DB
        if (this.editingDS) {
            let today: Date = new Date();
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;

            // Save DS to DB, but create a new dSet and new data records.
            let updatedData: any = {
                id: null,   // TODO Must be correct ID
                datasourceID: this.selectedDatasource.id,
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
                    // this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.Spreadsheet clickAddUpdatedNextTransform: ' + err);
                });

        } else {
            // Add new one
            let newData: any = {
                id: null,
                datasourceID: this.selectedDatasource.id,
                data: this.fileDataFull
            };

            // Add DS and Data
            this.globalVariableService.addDatasource(
                this.selectedDatasource,
                newData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource updated';

                })
                .catch(err => {
                    // this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.Spreadsheet clickAddUpdatedNextTransform: ' + err);
                });

        };
        
        this.step = 'How';
        
        // Close form and open Transitions if requested
        if (action === 'Saved') {
            this.formDataCreateDSSQLEditorClosed.emit(null);

        } else {
            this.formDataCreateDSSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}

