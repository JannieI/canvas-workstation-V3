/*
 * Visualise page, to view / present Dashboards previously created
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
import { Dashboard }                  from './models';
import { Datasource }                 from './models';
 
@Component({
    selector: 'data-manageBussGlossary',
    templateUrl: './data.manageBussGlossary.component.html',
    styleUrls: ['./data.manageBussGlossary.component.css']
})

export class DataManagBussGlossaryComponent implements OnInit {

    @Output() formDataManageBussGlossaryClosed: EventEmitter<string> = new EventEmitter();

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

    adding: boolean = false;
    datasources: Datasource[] = [];
    datasourceID: number;
    datasourceName: string;
    datasourceNames: string[] = [];    
    editing: boolean = false;
    errorMessage: string = "";
    selectedDatasourceID: number = null;
    selectedDatasource: Datasource;
    selectedDatasourcesRowIndex: number = 0;
    selectedLinkedDatasource: string;
    userIDs: string[] = [];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        this.globalVariableService.getDatasources().then(dc => {
            
            // Fill local Var
            this.datasources = dc.slice();
            
            // Click on first one, if available
            if (this.datasources.length > 0) {
                this.clickRow(0, this.datasources[0].id);
            };
        });

    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedDatasourcesRowIndex = index;
        this.editing = false;
        this.selectedDatasourceID = id;

        // Fill the form
        let selectedDatasourceIndex: number = this.datasources
            .findIndex(dc => dc.id == id);
        if (selectedDatasourceIndex >= 0) {

            this.selectedDatasource = Object.assign({}, 
                this.datasources[selectedDatasourceIndex]
            );
        } else {
            this.selectedDatasource = null;
        };

    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManageBussGlossaryClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedDatasourcesRowIndex, this.selectedDatasourceID);
        
        // Re Fill the form
        let datasourceIndex: number = this.datasources
            .findIndex(sch => sch.id == this.selectedDatasource.id);
        if (datasourceIndex >= 0) {
            this.selectedDatasource = Object.assign({}, 
                this.datasources[datasourceIndex]
            );
        };

        // Reset
        this.selectedDatasourcesRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to a Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        let index: number = this.selectedLinkedDatasource.indexOf(' (');
        if (index >= 0) {
            this.datasourceName = this.selectedLinkedDatasource.substring(0, index);
            this.datasourceID = +this.selectedLinkedDatasource.substring(
                index + 2, this.selectedLinkedDatasource.length - 1
            );
        };

        // Get RunTime datasourceName
        this.globalVariableService.datasources.forEach(ds => {
            if (ds.id == this.datasourceID) {
                this.datasourceName = ds.name;
            };
        });

        // Save the changes
        if (this.editing) {
            let datasourceIndex: number = this.datasources
                .findIndex(sch => sch.id == this.selectedDatasource.id);
            if (datasourceIndex >= 0) {
                this.datasources[datasourceIndex] = 
                    Object.assign({}, this.selectedDatasource);
            };
            this.globalVariableService.saveDatas(this.selectedDatasource)
        };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedDatasourcesRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickEdit() {
        // Start editing selected Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.datasources.length > 0) {
            this.editing = true;
        };

    }

}


