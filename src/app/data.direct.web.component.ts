/*
 * Create a new Datasource from a web page, and optional Element inside it.
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

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dataset }                    from './models';
import { Datasource }                 from './models';

interface webTables {
	fields:
		{
			name: string;
			dtype: string
		}[];
	meta:
		{
			has_body: boolean;
			has_headers: boolean;
			index: number;
			attrs: {}
		};
	name: string;
}

@Component({
    selector: 'data-direct-web',
    templateUrl: './data.direct.web.component.html',
    styleUrls: ['./data.direct.web.component.css']
})

export class DataDirectWebComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectWebClosed: EventEmitter<string> = new EventEmitter();

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
    currentData: any[] = [];
    currentDataSnippet: any[] = [];
    dataFieldsSelected: string[];
    datasources: Datasource[] = [];
    element: string = '';
    errorMessage: string = '';
    firstTimeEdit: boolean = false;
    newName: string = '';
    newDescription: string = '';
    nrRows: number = 0;
    savedMessage: string = '';
    selectedTableRowIndex: number = -1;
    showPreview: boolean = false;
    spinner: boolean = false;
    tables: webTables[];
    url: string = 'https://en.wikipedia.org/wiki/Iris_flower_data_set';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.selectedDatasource != null) {
            this.newName = this.selectedDatasource.name;
            this.newDescription = this.selectedDatasource.description;
            this.url = this.selectedDatasource.webUrl;
            this.firstTimeEdit = true;
            this.clickHttpGet();
        };

    }

    clickHttpGet() {
        // User clicked Get with URL: read the web page and return list of tables
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHttpGet', '@Start');

        // Reset
        this.showPreview = false;
        this.errorMessage = '';
        this.tables = [];
        this.savedMessage = '';

        // Construct spec for Tributary
        let source: any = {
            "source": {
                "inspector": "tributary.inspectors.web:WebTablesInspector",
                "specification": {
                    "content": this.url
                }
            }
        };

        // Get a list of Tables (created with <table> tag) on the web page
        this.globalVariableService.getTributaryInspect(source)
            .then(res => {
                this.tables = res;

                // Add Table Names where missing
                for (var i = 0; i < this.tables.length; i++) {
                    if (this.tables[i].name == null) {
                        this.tables[i].name = 'Table ' + i;
                    };
                };

                if (this.selectedDatasource != null) {
                    if (!isNaN(+this.selectedDatasource.webTableIndex)) {
                        this.clickSelectedDataTable(+this.selectedDatasource.webTableIndex);
                        this.firstTimeEdit = false;
                    };
                };

            })
            .catch(err => {
                this.errorMessage = err.message + '. ';
                if (err.status == 401) {
                    this.errorMessage = 'Error: ' + 'Either you login has expired, or you dont have access to the Database. ';
                } else {
                    this.errorMessage = err.message;
                };
            });

        // Cannot save as yet
        this.canSave = false;
    }

    clickSelectedDataTable(index: number) {
        // Clicked a Table, so get the data for the selected table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;
        this.showPreview = false;
        this.spinner = true;

        let source: any = {
            "source": {
                "connector": "tributary.connectors.web:WebTablesConnector",
                "specification": {
                    "content": this.url,
                    "index": index
                }
            }
        };

        this.globalVariableService.getTributaryData(source).then(res => {
            this.currentData = res;
            this.currentDataSnippet = res;
            this.nrRows = res.length;

            // Show the preview data table
            this.showPreview = true;

            // Construct a list of field name / column headings from the data
            this.dataFieldsSelected = [];

            if (res.length > 0) {
                console.warn('xx res[0]', res[0])
                for(var key in res[0]) {
                    console.warn('xx key', key)
                    this.dataFieldsSelected.push(key);
                }
            };

            // The User can save now
            this.canSave = true;
            this.savedMessage = '';
            this.spinner = false;
            console.warn('xx res', res.length, this.dataFieldsSelected)
        })
        .catch(err => {
            this.spinner = false;
            this.errorMessage = 'Error connecting to server: check login or permissions'
                + err.message;
        });
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectWebClosed.emit(null);

    }

    clickSave() {
        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        this.errorMessage = '';
        if (this.newName == '') {
            this.errorMessage = 'Please enter a Name for the new Datasource';
            return;
        };
        if (this.newDescription == '') {
            this.errorMessage = 'Please enter a Description for the new Datasource';
            return;
        };

        // Construct DS and add to DB
        let today: Date = new Date();

        if (this.selectedDatasource != null) {
            // Mark the changes
            this.selectedDatasource.name = this.newName;
            this.selectedDatasource.description = this.newDescription;
            this.selectedDatasource.webUrl = this.url;
            this.selectedDatasource.webTableIndex = this.selectedTableRowIndex.toString();
            this.selectedDatasource.editor = this.globalVariableService.currentUser.userID;
            this.selectedDatasource.dateEdited = today;
            this.selectedDatasource.dataFields = this.dataFieldsSelected;

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
                data: this.currentData
            };
            console.warn('xx dataID updatedata', dataID, updatedData)
            // Add Data, then dataset, then DS
            this.globalVariableService.saveData(updatedData).then(resData => {

                updatedDataset.url = 'data/' + dataID;
                this.globalVariableService.saveDatasource(this.selectedDatasource).then(
                    resDS => {
                        updatedDataset.datasourceID = this.selectedDatasource.id;
                        console.warn('xx updatedDataset', updatedDataset)
                        this.globalVariableService.saveDataset(updatedDataset);
                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource updated';
            });

        } else {
            // Add new one
            let newDatasource: Datasource = {
                id: null,
                type: 'Web',
                subType: '',
                typeVersion:  '',
                name: this.newName,
                username: '',
                password: '',
                description: this.newDescription,
                dataFieldIDs: [],
                dataFields: this.dataFieldsSelected,
                dataFieldTypes: [],
                dataFieldLengths: [],
                datasourceFilters: null,
                datasourceFilterForThisDashboard: false,
                accessType: '',
                cacheResultsOnServer: true,
                serverExpiryDateTime: null,
                unRefreshable: true,
                nrCacheCopies: 999,
                cacheResultsLocal: false,
                oldnessMaxPeriodInterval: '',
                oldnessMaxPeriodUnits: 0,
                oldnessRelatedDate: '',
                oldnessRelatedTime: '',
                refreshedLocalOn: null,
                createMethod: 'directWeb',
                createdBy: this.globalVariableService.currentUser.userID,
                createdOn: today,
                editor: '',
                dateEdited: null,
                refreshedBy: '',
                refreshedServerOn: null,
                folder: '',
                fileName: '',
                excelWorksheet: '',
                transposeOnLoad: false,
                startLineNr: 0,
                csvSeparationCharacter: '',
                csvQuotCharacter: '',
                webUrl: this.url,
                webTableIndex: this.selectedTableRowIndex.toString(),
                connectionID: null,
                dataTableID: null,
                businessGlossary: 'Obtained from ' + this.url + this.selectedTableRowIndex,
                dataDictionary: '',
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
                nrWidgets: null
            };

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
                data: this.currentData,
                dataRaw: this.currentData
            };
            let newData: any = {
                id: null,
                data: this.currentData
            };

            // Add Data, then dataset, then DS
            this.globalVariableService.addData(newData).then(resData => {

                newdDataset.url = 'data/' + resData.id.toString();
                this.globalVariableService.addDatasource(newDatasource).then(resDS => {
                    newdDataset.datasourceID = resDS.id;
                    this.globalVariableService.addDataset(newdDataset);

                });

                // Indicate to the user
                this.canSave = false;
                this.savedMessage = 'Datasource created';
            });
        };
    }

}
