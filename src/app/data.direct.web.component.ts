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

        // Save the changes
        // if (this.editing) {
        //     let datasourceIndex: number = this.datasources
        //         .findIndex(ds => ds.id == this.selectedDatasource.id);
        //     if (datasourceIndex >= 0) {
        //         this.datasources[datasourceIndex].dataDictionary =
        //             this.selectedDatasource.dataDictionary
        //     };
        //     this.globalVariableService.saveDatasource(this.selectedDatasource)
        // };

        let newDatasource: Datasource = {
            id: null,
            type: string;
            subType: string;
            typeVersion: string;
            name: string;
            username: string;                   // Username to log into server
            password: string;                   // Password to log into server
            description: string;
            dataFieldIDs: number[];             // IDs of fields in DB table
            dataFields: string[];               // FieldNames, in order to display
            dataFieldTypes: string[];           // Field Types, same order as dataFields
            dataFieldLengths: number[];         // Max field lengths, same order as dataFields
            parameters: string;                 // Parameters to pass into SQL query
        
            // Create and Edit info
            createMethod: string;               // Method how DS was created, ie DirectFile, ..., ManagedSQLEditor
            createdBy: string;                  // Creator
            createdOn: string;                  // DateTime Created
            editor: string;                     // Last Edited By
            dateEdited: string;                 // Last Edited On
            
            // Refresh info
            refreshedBy: string;
            refreshedOn: string;
        
            // Location and authentication
            folder: string;
            fileName: string;
            excelWorksheet: string;
            transposeOnLoad: boolean;
            startLineNr: number;                // 1 = first = default
            csvSeparationCharacter: string;     // CSV file column separator: comma or ;
            csvQuotCharacter: string;           // CSV values in "", in '' or without quotes
        
            // Managed Connection, Connection created and managed outside of the DS
            connectionID: number;               // Connection to DB
            dataTableID: number;                // ID of table linked in DB
            businessGlossary: string;           // Detailed business oriented description of DS (non-technical)
            dataDictionary: string;             // Detailed technical description of DS
        
            // Direct Connection, all info provided here and once off
            databaseName: string;                   // DB to connect to
            port: string;                       // Port on the DB Server
            serverType: string;                 // Server or Host type, ie MySQL, PostgreSQL, etc
            serverName: string;                 // Server or Host name
            dataTableName: string;              // Table inside Server with the data
            dataSQLStatement: string;           // SQL Statement to extract data with
            dataNoSQLStatement: string;         // NoSQL Statement to extract data with
            dataNeo4jStatement: string;         // Cypher Statement to extract data with
            dataGraphQLStatement: string;       // GraphQL Statement to extract data with
        
            // Updated at runtime
            nrWidgets: number; 

        Dataset {
            id: number;
            datasourceID: number;
            sourceLocation: string;                 // Where data lives: file, localDB, MSSQL, etc
            url: string;                            // URL for http request
            folderName: string;                     // Optional folder name where data is stored
            fileName: string;                       // Optional file name where data is stored
            data: any;                              // Filtered data as json
            dataRaw: any;                           // Unfiltered data as json
        }
    }

}
