/*
 * Manage Business Glossary for Datasources
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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
    selector: 'data-managed-busGlossary',
    templateUrl: './data.managed.busGlossary.component.html',
    styleUrls: ['./data.managed.busGlossary.component.css']
})

export class DataManagedBusGlossaryComponent implements OnInit {

    @Output() formDataManagedBusGlossaryClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[] = [];
    editing: boolean = false;
    errorMessage: string = '';
    selectedDatasourceID: number = null;
    selectedDatasource: Datasource;
    selectedDatasourcesRowIndex: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Reset, else async too late and form load fails
        this.selectedDatasource = datasourceTemplate;
        
        this.globalVariableService.getResource('datasources').then(dc => {
            // Fill local Var
            this.datasources = dc.slice();

            // Click on first one, if available
            if (this.datasources.length > 0) {
                this.clickRow(0, this.datasources[0].id);
            };
        })
        .catch(err => {
            this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
            console.error('Error in Managed.businessGlossary reading auditTrails: ' + err);
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
            .findIndex(dc => dc.id === id);
        if (selectedDatasourceIndex >= 0) {

            // this.selectedDatasource = Object.assign({},
            //     this.datasources[selectedDatasourceIndex]
            // );
            this.selectedDatasource = JSON.parse(JSON.stringify(
                this.datasources[selectedDatasourceIndex]
            ));
        } else {
            this.selectedDatasource = null;
        };

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedBusGlossaryClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.clickRow(this.selectedDatasourcesRowIndex, this.selectedDatasourceID);

        // // Re Fill the form
        // let datasourceIndex: number = this.datasources
        //     .findIndex(sch => sch.id === this.selectedDatasource.id);
        // if (datasourceIndex >= 0) {
        //     this.selectedDatasource = Object.assign({},
        //         this.datasources[datasourceIndex]
        //     );
        // };

        // // Reset
        // this.selectedDatasourcesRowIndex = null;
        // this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Save the changes
        if (this.editing) {
            let datasourceIndex: number = this.datasources
                .findIndex(ds => ds.id === this.selectedDatasource.id);
            if (datasourceIndex >= 0) {
                this.datasources[datasourceIndex].businessGlossary =
                    this.selectedDatasource.businessGlossary
            };
            this.globalVariableService.saveResource('datasources', this.selectedDatasource)
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Managed.businessGlossary reading auditTrails: ' + err);
                });

        };

        // Reset
        this.editing = false;
        // this.selectedDatasourcesRowIndex = null;
        // this.selectedDatasourceID = null;

    }

    clickEdit() {
        // Start editing selected Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.datasources.length > 0) {
            this.editing = true;
        };
    }

}


