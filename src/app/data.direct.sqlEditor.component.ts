/*
 * Create a new Datasource using a SQL Editor.
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
import { Dataset }                    from './models';
import { Datasource }                 from './models';
import { TributaryServerType }        from './models';

@Component({
    selector: 'data-direct-sqlEditor',
    templateUrl: './data.direct.sqlEditor.component.html',
    styleUrls:  ['./data.direct.sqlEditor.component.css']
})
export class DataDirectSQLEditorComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectSQLEditorClosed: EventEmitter<Datasource> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if ( 
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&  
            (!event.ctrlKey)  
            &&  
            (!event.shiftKey) 
           ) {
            this.clickAdd('Saved');
            return;
        };

    }


    canSave: boolean = false;
    errorMessage: string = "";
    fields: string[] = [];
    fieldsInTable: string[];
    fileData: any = [];
    fileDataFull: any = [];
    message: string = '';
    reader = new FileReader();
    savedMessage: string = '';
    selectedTable: string = '';
    selectedField: string = '';
    serverTypes: TributaryServerType[];
    showPreview: boolean = false;
    spinner: boolean = false;
    startupHelp: boolean = true;
    tables: string[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set base info
        this.serverTypes = this.globalVariableService.serverTypes.slice();

        if (this.selectedDatasource == null) {
            let today: Date = new Date();
            this.selectedDatasource = {
                id: null,
                type: 'Server',
                subType: '',
                typeVersion: '',
                name: '',
                username: 'janniei',
                password: 'janniei',
                description: '',
                dataFields: [''],
                dataFieldTypes: [''],
                dataFieldLengths: [0],
                datasourceFilters: null,
                datasourceFilterForThisDashboard: false,
                accessType: 'Private',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                createMethod: 'directSQLEditor',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                cacheResultsOnServer: true,
                serverExpiryDateTime: this.globalVariableService.dateAdd(today, 'day', 2),
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
                databaseName: 'mysql',
                port: '3306',
                serverType: 'MySQL',
                serverName: 'localhost',
                dataTableName: '',
                dataSQLStatement: 'SELECT * FROM mysql.user',
                dataNoSQLStatement: '',
                dataNeo4jStatement: '',
                dataGraphQLStatement: '',
                dataOverlaySpecification: '',
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
                sourceLocation: ''
            };
            this.selectedField = 'MySQL';
        } else {
            this.clickExplore();
        };
    }

    clickExplore() {
        // Load the Tables and Fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExplore', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';
        this.showPreview = false;
        this.canSave = false;
        this.startupHelp = false;

        // Show user
        this.spinner = true;

        // Get list of Tables
        this.globalVariableService.getListTables(
            this.selectedDatasource.serverType,
            this.selectedDatasource.serverName,
            this.selectedDatasource.databaseName,
            this.selectedDatasource.port,
            this.selectedDatasource.username,
            this.selectedDatasource.password).then(res => {

                this.tables = [''];

                res.data.forEach(row => {

                    this.tables.push(row);
                });

                // Reset
                this.spinner = false;
                this.message = 'Tables loaded';

            })
            .catch(errorMessage => {
                this.spinner = false;
                this.errorMessage = 'Error connecting to server (maybe check login or permissions): '
                    + errorMessage;
            });

    }

    clickGo() {
        // Load the File content
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';
        this.showPreview = false;
        this.canSave = false;
        this.startupHelp = false;

        // Show user
        this.spinner = true;


        // TEST
        // this.globalVariableService.getCurrentDashboardAndTab(82, 175, "1,2")
        //     .then(res => {
        //         console.log('xx SQL ED done')
        //     })
        //     .catch(errorMessage => {
        //         console.log('xx SQL Ed err', this.errorMessage)
        //     });



        // Set up specification for Connector
        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement.trim();

        // Execute Query and return data
        this.globalVariableService.getExecQuery(
            this.selectedDatasource.serverType,
            this.selectedDatasource.serverName,
            this.selectedDatasource.databaseName,
            this.selectedDatasource.dataSQLStatement,
            this.selectedDatasource.port,
            this.selectedDatasource.username,
            this.selectedDatasource.password,
            null,
            10).then(res => {

                console.log('xx meta', res.metaData, res.data.length)
                let dataArray: any = res.data
                // Fill the data
                this.fileData = dataArray.slice(0,10);
                this.fileDataFull = dataArray;

                // Construct a list of field name / column headings from the data
                // For a SQL statement, this cannot be done on Server
                // Use best guess defaults
                this.selectedDatasource.dataFields = [];
                this.selectedDatasource.metaDataFields = [];

                if (dataArray.length > 0) {
                    for(var key in dataArray[0]) {
                        this.selectedDatasource.dataFields.push(key);

                        this.selectedDatasource.metaDataFields.push(
                            {
                                fieldName: key,
                                fieldAlias: '',
                                fieldType: 'string',
                                length: 25,
                                average: null,
                                max: null,
                                median: null,
                                min: null,
                                sum: null
                            }
                        );
                    };
                };

                // Show the results
                this.showPreview = true;
                this.spinner = false;

                // Can Add now
                this.canSave = true;

            })
            .catch(errorMessage => {
                this.spinner = false;
                this.errorMessage = 'Error in query execution (maybe check login or permissions) '
                    + errorMessage;
            });

    }

    clickSelectTable(ev: any) {
        // User selected a table, fill the fields for it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTable', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';
        this.fieldsInTable = [];
        this.startupHelp = false;

        // Show user
        this.spinner = true;

        // Get list of Tables
        this.globalVariableService.getListFields(
            this.selectedDatasource.serverType,
            this.selectedDatasource.serverName,
            this.selectedDatasource.databaseName,
            ev.target.value,                    // Selected Table Name
            this.selectedDatasource.port,
            this.selectedDatasource.username,
            this.selectedDatasource.password).then(res => {

                this.fields = [''];
                res.data.forEach(row => {
                    this.fields.push(row.Field);
                });

                // Reset
                this.spinner = false;
                this.message = 'Fields loaded';
            })
            .catch(errorMessage => {
                this.spinner = false;
                this.errorMessage = 'Error getting fields from server (maybe check login or permissions): '
                    + errorMessage;
            });
    }

    clickSelectedField(ev: any) {
        // User selected a fields, append to SQL Statement
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedField', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';
        this.fieldsInTable = [];
        this.startupHelp = false;

        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement +
            '   ' + ev.target.value;
        this.message = 'Field added to SQL Statement';
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

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectSQLEditorClosed.emit(null);

    }

    clickAdd(action: string) {
        // Add the DS, with data, to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset
        this.errorMessage = '';
        this.message = '';
        this.savedMessage = '';
        this.startupHelp = false;

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

        // Construct DS and save / add to DB
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
                this.globalVariableService.saveResource('datasources', this.selectedDatasource).then(
                    resDS => {
                        updatedDataset.datasourceID = this.selectedDatasource.id;
                        this.globalVariableService.saveResource('datasets', updatedDataset);
                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource updated';
            });

        } else {
            let today: Date = new Date();
            this.selectedDatasource.createdBy = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.createdOn = today;

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
            this.globalVariableService.addDatasourceNEW(
                this.selectedDatasource,
                newdDataset,
                newData).then(resData => {

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource created';

                // Close form and open Transitions if requested
                // if (action == 'Saved') {
                //     this.formDataDirectSQLEditorClosed.emit(null);

                // } else {
                //     this.formDataDirectSQLEditorClosed.emit(this.selectedDatasource);
                // };

            })
            .catch(errorMessage => {
                this.errorMessage = 'Save failed - ' + errorMessage;
            });
            // this.globalVariableService.addData(newData)
            //     .then(resData => {

            //         newdDataset.url = 'data/' + resData.id.toString();
            //         this.globalVariableService.addDatasource(this.selectedDatasource).then(resDS => {
            //             newdDataset.datasourceID = resDS.id;
            //             this.globalVariableService.addDataset(newdDataset);

            //         });

            //         // Indicate to the user
            //         this.canSave = false;
            //         this.savedMessage = 'Datasource created';

            //         // Close form and open Transitions if requested
            //         if (action == 'Saved') {
            //             this.formDataDirectSQLEditorClosed.emit(null);

            //         } else {
            //             this.formDataDirectSQLEditorClosed.emit(this.selectedDatasource);

            //         };

            //     })
            //     .catch(errorMessage => {
            //         this.errorMessage = 'Save failed - ' + errorMessage;
            //     });
        };
    }

}


