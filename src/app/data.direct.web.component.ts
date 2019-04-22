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
import { Datasource }                 from './models';

// Templates
import { datasourceTemplate }         from './templates';

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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
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
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.web getTributaryInspect: ' + err);
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

        this.globalVariableService.getTributaryData(source)
            .then(res => {
                this.currentData = res;
                this.currentDataSnippet = res;
                this.nrRows = res.length;

                // Show the preview data table
                this.showPreview = true;

                // Construct a list of field name / column headings from the data
                this.dataFieldsSelected = [];

                if (res.length > 0) {
                    for(var key in res[0]) {
                        this.dataFieldsSelected.push(key);
                    }
                };

                // The User can save now
                this.canSave = true;
                this.savedMessage = '';
                this.spinner = false;
            })
            .catch(err => {
                this.spinner = false;
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.web getTributaryData: ' + err);
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
        if (this.newName === '') {
            this.errorMessage = 'Please enter a Name for the new Datasource';
            return;
        };
        if (this.newDescription === '') {
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

            // Save DS to DB, but create a new data records.
            let updatedData: any = {
                id: null,
                data: this.currentData
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
                    console.error('Error in Datasource.web saveDatasource: ' + err);
                });
    
        } else {
            // Add new one
            let newDatasource: Datasource = datasourceTemplate;
            newDatasource.type = 'Web';
            newDatasource.name = this.newName;
            newDatasource.description = this.newDescription;
            newDatasource.dataFields = this.dataFieldsSelected;
            newDatasource.createMethod = 'directWeb';
            newDatasource.createdBy = this.globalVariableService.currentUser.userID;
            newDatasource.createdOn = today;
            newDatasource.webTableIndex = this.selectedTableRowIndex.toString();
            newDatasource.businessGlossary = 'Obtained from ' + this.url + this.selectedTableRowIndex;
            newDatasource.encoding = 'Ascii';
                
            let newData: any = {
                id: null,
                data: this.currentData
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
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.Web clickSave: ' + err);
                });
            };
    }

}
