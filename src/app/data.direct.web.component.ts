/*
 * Create a new Datasource from a web page, and optional Element inside it.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
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

    currentData: any[] = [];
    dataFieldsSelected: string[];
    datasources: Datasource[] = [];
    element: string = '';
    errorMessage: string = '';
    newName: string = '';
    newDescription: string = '';
    selectedTableRowIndex: number = -1;
    showPreview: boolean = false;
    tables: webTables[];
    url: string = 'https://en.wikipedia.org/wiki/Iris_flower_data_set';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: HttpClient,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // this.globalVariableService.getDatasources().then(dc => {
        //     // Fill local Var
        //     this.datasources = dc.slice();
        //     console.warn('xx this.datasources.length', this.datasources.length)

        //     // Click on first one, if available
        //     if (this.datasources.length > 0) {
        //         this.clickRow(0, this.datasources[0].id);
        //     };
        // });

    }

    clickHttpGet() {
        // User clicked Get with URL: read the web page and return list of tables
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHttpGet', '@Start');

        // Reset
        this.showPreview = false;
        this.errorMessage = '';
        this.tables = [];

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
                    }
                };
            })
            .catch(err => {
                this.errorMessage = err.message + '. ';
                if (err.status == 401) {
                    this.errorMessage = 'Error: ' + 'Either you login has expired, or you dont have access to the Database. ' 
                        + err.message;
                } else {
                    this.errorMessage = err.message;
                };
            });

    }

    clickSelectedDataTable(index: number) {
        // Clicked a Table, so get the data for the selected table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;

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
            }
            console.warn('xx res', res.length, this.dataFieldsSelected)
        });
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectWebClosed.emit(action);

    }

    clickSave() {
        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Valiation
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
            parameters: '',
            createMethod: 'Web',
            createdBy: this.globalVariableService.currentUser.userID,
            createdOn: today,
            editor: '',
            dateEdited: null,
            refreshedBy: '',
            refreshedOn: null,
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: 0,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            connectionID: null,
            dataTableID: null,
            businessGlossary: 'Obtained from ' + this.url,
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
            nrWidgets: null
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
    }

}
