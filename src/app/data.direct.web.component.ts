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
    dataFieldsSelected: string[] = ['id', 'date'];
    datasources: Datasource[] = [];
    element: string = '';
    errorMessage: string = '';
    newName: string = '';
    newDescription: string = '';
    selectedTableRowIndex: number = 0;
    showPreview: boolean = false;
    tables: webTables[];
    url: string = '';

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

    clickSelectedDataTable(index: number, tableName: string) {
        // Clicked a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataTable', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTableRowIndex = index;

        let source: any = {
            "source": {
                "connector": "tributary.connectors.web:WebTablesConnector",
                "specification": {
                    "content": "https://en.wikipedia.org/wiki/Iris_flower_data_set",
                    "index": index
                }
            }
        }

        this.globalVariableService.getTributaryData(source).then(res => {
            this.currentData = res;

            // JSON.parse(JSON.stringify(res), (this.keyEvent, value)
            var dataFieldsSelected = [];

            if (res.length > 0) {

                for(var key in res[0]) {
                    dataFieldsSelected.push(key);
                }
            }
            console.warn('xx res', res.length, this.dataFieldsSelected)
        });
    }

    clickHttpGet() {
        // User clicked Get with URL
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHttpGet', '@Start');

        // Reset
        this.errorMessage = '';


        let source: any = {
            "source": {
                "inspector": "tributary.inspectors.web:WebTablesInspector",
                "specification": {
                    "content": "https://en.wikipedia.org/wiki/Iris_flower_data_set"
                }
            }
        }

        this.globalVariableService.getTributaryInspect(source).then(res => {
            // Show if the user has not clicked another row - this result came back async
            this.tables = res;

            // Add Names
            for (var i = 0; i < this.tables.length; i++) {
                if (this.tables[i].name == null) {
                    this.tables[i].name = 'Table ' + i;
                }
            };
            this.showPreview = true;
            this.errorMessage = 'Enter detail, then click Refresh to show the Tables.  Select one, then select the fields to display. Click Preview to see a portion of the data.';
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

    }

}
