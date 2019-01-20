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
import { DataSchema }                 from './models';
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

    }


    canSave: boolean = false;
    dataSchemas: DataSchema[] = [];
    errorMessage: string = "";
    fieldsInTable: string[];
    fileData: any = [];
    fileDataFull: any = [];
    reader = new FileReader();
    savedMessage: string = '';
    selectedTable: string = '';
    selectedField: string = '';
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
                accessType: '',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                createMethod: 'directSQLEditor',
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
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
                databaseName: 'mysql',
                port: '3306',
                serverType: 'My SQL',
                serverName: 'localhost',
                dataTableName: '',
                dataSQLStatement: '',
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
        } else {
            this.clickExplore();
        };

        console.warn('xx dates',
            this.globalVariableService.dateDiff(new Date(), new Date('2018-08-09'), 'day'))
    }

    clickExplore() {
        // Load the Tables and Fields, using the Tributary Inspector
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExplore',           '@Start');

        // Reset
        this.errorMessage = '';
        this.showPreview = false;
        this.canSave = false;

        // Show user
        this.spinner = true;

        // Get drivers
        // let driver: string = this.serverTypes
        //     .filter(styp => styp.serverType == this.selectedDatasource.serverType)
        //     .map(styp => styp.driverName)[0];
        // let inpector: string = this.serverTypes
        //     .filter(styp => styp.serverType == this.selectedDatasource.serverType)
        //     .map(styp => styp.inspector)[0];

        // let specificationInspect: any = {
        //     "source": {
        //         "inspector": inpector, // "tributary.inspectors.sql:SqlInspector",
        //         "specification": {
        //             "drivername": driver,  //"postgresql",
        //             "host": this.selectedDatasource.serverName,
        //             "port": +this.selectedDatasource.port,
        //             "username": this.selectedDatasource.username,
        //             "password": this.selectedDatasource.password,
        //             "database": this.selectedDatasource.databaseName
        //         }
        //     }
        // };

        // Get list of Tables
        this.globalVariableService.getListTables(
            this.selectedDatasource.serverType, 
            this.selectedDatasource.serverName, 
            this.selectedDatasource.databaseName, 
            this.selectedDatasource.port, 
            this.selectedDatasource.username, 
            this.selectedDatasource.password).then(res => {

            this.dataSchemas = [];
            res.forEach(row => {

                this.dataSchemas.push(
                {
                    serverName: this.selectedDatasource.serverName,
                    tableName: row,
                    tableDescription: '', //row.name,
                    tableFields: [],
                    tableMetadata: []
                });
        //         row.fields.forEach(fld => {
        //             this.dataSchemas[this.dataSchemas.length - 1].tableFields.push(
        //                 {
        //                     fieldName: fld.name,
        //                     fieldType: fld.dtype
        //                 }
        //             )
        //         });
            });

        //     // Fill the fields
        //     if (this.dataSchemas.length > 0) {
        //         // this.clickSelectTable(this.dataSchemas[0].tableName);
        //         this.fieldsInTable = this.dataSchemas[0].tableFields.map(tf => tf.fieldName);
        //         console.warn('xx this.dataSchemas', this.dataSchemas)
        //     };

        console.log('xx HERE res', res, this.dataSchemas)

            // Reset
            this.spinner = false;

            })
            .catch(err => {
                console.warn('xx err', err)
                this.spinner = false;
                this.errorMessage = 'Error connecting to server (maybe check login or permissions): '
                    + err.message;
            });
        
            // // Call Tributary Inspector
        // this.globalVariableService.getTributaryInspect(specificationInspect).then(res => {

        //     // Fill the tables and Fields
        //     this.dataSchemas = [];
        //     res.forEach(row => {

        //         this.dataSchemas.push(
        //         {
        //             serverName: this.selectedDatasource.serverName,
        //             tableName: row.name,
        //             tableDescription: row.name,
        //             tableFields: [],
        //             tableMetadata: []
        //         });
        //         row.fields.forEach(fld => {
        //             this.dataSchemas[this.dataSchemas.length - 1].tableFields.push(
        //                 {
        //                     fieldName: fld.name,
        //                     fieldType: fld.dtype
        //                 }
        //             )
        //         });
        //     });

        //     // Fill the fields
        //     if (this.dataSchemas.length > 0) {
        //         // this.clickSelectTable(this.dataSchemas[0].tableName);
        //         this.fieldsInTable = this.dataSchemas[0].tableFields.map(tf => tf.fieldName);
        //         console.warn('xx this.dataSchemas', this.dataSchemas)
        //     };

        //     // Reset
        //     this.spinner = false;
        //     console.warn('xx res I', res, this.dataSchemas)

        // })
        // .catch(err => {
        //     console.warn('xx err', err)
        //     this.spinner = false;
        //     this.errorMessage = 'Error connecting to server: check login or permissions'
        //         + err.message;
        // });

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
        let connector: string = this.serverTypes
            .filter(styp => styp.serverType == this.selectedDatasource.serverType)
            .map(styp => styp.connector)[0];

        // Set up specification for Connector
        this.selectedDatasource.dataSQLStatement = this.selectedDatasource.dataSQLStatement.trim();
        let specificationConnect: any = {
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
        this.globalVariableService.getTributaryData(specificationConnect)
            .then(res => {

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

    }

    clickSelectTable(ev: any) {
        // User selected a table, fill the fields for it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTable', '@Start');

        this.fieldsInTable = [];
        let selectedDataSchema: DataSchema[] = this.dataSchemas.filter(
            dsch => dsch.tableName == ev.target.value
        );
        console.warn('xx selectedDataSchema',selectedDataSchema, this.dataSchemas, ev.target.value )

        if (selectedDataSchema.length > 0) {
            this.fieldsInTable = selectedDataSchema[0].tableFields.map(tf => tf.fieldName);
        };
        console.warn('xx this.fieldsInTable',ev, this.selectedTable, this.fieldsInTable )
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
            this.formDataDirectSQLEditorClosed.emit(null);

        } else {
            this.formDataDirectSQLEditorClosed.emit(this.selectedDatasource);

        };
    }

}


