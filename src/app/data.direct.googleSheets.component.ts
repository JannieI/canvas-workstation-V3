/*
 * Create a new Datasource from a GoogleSheets speadsheet, and optional Element inside it.
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


@Component({
    selector: 'data-direct-googlesheets',
    templateUrl: './data.direct.googleSheets.component.html',
    styleUrls: ['./data.direct.googleSheets.component.css']
})

export class DataDirectGoogleSheetsComponent implements OnInit {

    @Input() editingDS: boolean;
    @Input() selectedDatasource: Datasource;

    @Output() formDataDirectGoogleSheetsClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
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
    newCacheResults: boolean = true;
    nrRows: number = 0;
    savedMessage: string = '';
    selectedTableRowIndex: number = -1;
    showPreview: boolean = false;
    spinner: boolean = false;
    url: string = 'https://docs.google.com/spreadsheets/d/1xSMysMxnNhR8AXFuU-TWrgGe6TbsorZffNfwFlF85GA/edit#gid=0';

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
            this.newCacheResults = this.selectedDatasource.cacheResultsOnServer;
            this.url = this.selectedDatasource.webUrl;
            this.firstTimeEdit = true;
            this.clickHttpGet();
        };

    }

    clickHttpGet() {
        // User clicked Get with URL to Google Sheet
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHttpGet', '@Start');

        // Reset
        this.showPreview = false;
        this.errorMessage = '';
        this.savedMessage = '';
        this.spinner = true;

        // Construct spec for Tributary
        let source: any = {
            "source": {
                "connector": "tributary.connectors.spreadsheet:GSheetConnector",
                "specification": {
                    "content": this.url,
                    "header": 0
                }
            }
        };

        // Get data in sheet
        this.globalVariableService.getTributaryData(source)
            .then(res => {
                this.currentData = res;
                this.currentDataSnippet = res.slice(1, 8);
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
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Datasource.googleSheets getTributaryData: ' + err);
                this.spinner = false;

                // Cannot save as yet
                this.canSave = false;
            });

    }

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectGoogleSheetsClosed.emit(null);

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
            this.selectedDatasource.cacheResultsOnServer = this.newCacheResults;
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
            this.globalVariableService.addDatasource(
                this.selectedDatasource,
                updatedData).then(resData => {

                    // Indicate to the user
                    this.canSave = false;
                    this.savedMessage = 'Datasource updated';

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.GoogleSheets clickSave: ' + err);
                });

        } else {
            // Add new one
            let newDatasource: Datasource = datasourceTemplate;
            newDatasource.type = 'GoogleSheets';
            newDatasource.name = this.newName;
            newDatasource.description = this.newDescription;
            newDatasource.dataFields = this.dataFieldsSelected;
            newDatasource.cacheResultsOnServer = this.newCacheResults;
            newDatasource.unRefreshable = true;
            newDatasource.cacheResultsLocal = false;
            newDatasource.createMethod = 'directGoogleSheets';
            newDatasource.createdBy = this.globalVariableService.currentUser.userID;
            newDatasource.createdOn = today;
            newDatasource.webUrl = this.url;
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
                    this.savedMessage = 'Datasource added';

                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in direct.GoogleSheets clickSave: ' + err);
                });
        };
    }

}
