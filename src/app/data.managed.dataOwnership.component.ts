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
import { DataOwnership }           from './models';

@Component({
    selector: 'data-managed-dataOwnership',
    templateUrl: './data.managed.dataOwnership.component.html',
    styleUrls: ['./data.managed.dataOwnership.component.css']
})

export class DataManageDataOwnershipComponent implements OnInit {

    @Output() formDataManagedDataOwnershipClosed: EventEmitter<string> = new EventEmitter();

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
    dataOwnerships: DataOwnership[] = [];
    datasourceID: number;
    datasourceName: string;
    datasourceNames: string[] = [];
    editing: boolean = false;
    errorMessage: string = "";
    selectedDatasourceID: number = null;
    selectedDataOwnership: DataOwnership;
    selectedDataOwnershipRowIndex: number = 0;
    selectedLinkedDatasource: string;
    userIDs: string[] = [];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.clearRecord();

        // Get Datasource list
        this.globalVariableService.datasources.forEach(ds => {
            this.datasourceNames.push(ds.name + ' (' + ds.id + ')');
        });
        this.datasourceNames = this.datasourceNames.sort( (obj1,obj2) => {
            if (obj1.toLowerCase() > obj2.toLowerCase()) {
                return 1;
            };
            if (obj1.toLowerCase() < obj2.toLowerCase()) {
                return -1;
            };
            return 0;
        });

        // Get UserID list
        this.globalVariableService.canvasUsers.forEach(usr => {
            this.userIDs.push(usr.userID);
        });
        this.userIDs = this.userIDs.sort( (obj1,obj2) => {
            if (obj1.toLowerCase() > obj2.toLowerCase()) {
                return 1;
            };
            if (obj1.toLowerCase() < obj2.toLowerCase()) {
                return -1;
            };
            return 0;
        });

        this.globalVariableService.getResource('dataOwnerships')
            .then(dc => {

                // Fill local Var
                this.dataOwnerships = dc.slice();

                // Append RunTime datasourceName
                this.dataOwnerships.forEach(dow => {
                    this.globalVariableService.datasources.forEach(ds => {
                        if (ds.id == dow.datasourceID) {
                            dow.datasourceName = ds.name;
                        };
                    });
                });

                // Click on first one, if available
                if (this.dataOwnerships.length > 0) {
                    this.clickRow(0, this.dataOwnerships[0].id);
                };
            })
            .catch(err => this.errorMessage = 'Error getting Ownership data: ' + err);

    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedDataOwnershipRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.selectedDatasourceID = id;
        this.errorMessage = '';

        // Fill the form
        let selectedDatasourceIndex: number = this.dataOwnerships
            .findIndex(dc => dc.id == id);
        if (selectedDatasourceIndex >= 0) {

            let datasourceIndex: number = this.globalVariableService.datasources.findIndex(ds =>
                ds.id == this.dataOwnerships[selectedDatasourceIndex].datasourceID
            );
            this.selectedLinkedDatasource = this.globalVariableService.datasources[datasourceIndex]
                .name + ' (' + this.globalVariableService.datasources[datasourceIndex].id + ')';

            // this.selectedDataOwnership = Object.assign({},
            //     this.dataOwnerships[selectedDatasourceIndex]
            // );
            this.selectedDataOwnership = JSON.parse(JSON.stringify(
                this.dataOwnerships[selectedDatasourceIndex]
            ));
        } else {
            this.selectedLinkedDatasource = '';
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedDataOwnership = {
            id: null,
            datasourceID: null,
            userID: '',
            type: '',
            description: '',
            createdBy: '',
            createdOn: null,
            updatedBy: '',
            updatedOn: null,
            datasourceName: ''
        };
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedDataOwnershipClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedDataOwnershipRowIndex, this.selectedDatasourceID);

        // Re Fill the form
        let datasourceIndex: number = this.dataOwnerships
            .findIndex(sch => sch.id == this.selectedDataOwnership.id);
        if (datasourceIndex >= 0) {
            // this.selectedDataOwnership = Object.assign({},
            //     this.dataOwnerships[datasourceIndex]
            // );
            this.selectedDataOwnership = JSON.parse(JSON.stringify(
                this.dataOwnerships[datasourceIndex]
            ));
        };

        // Reset
        this.selectedDataOwnershipRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to a Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDataOwnership.userID == null
            ||
            this.selectedDataOwnership.userID == '') {
                this.errorMessage = 'Enter the UserID of the Owner';
                return;
        };

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

        // Add to local and DB
        if (this.adding) {
            this.selectedDataOwnership.id = null;

            this.selectedDataOwnership.datasourceID = this.datasourceID;
            this.selectedDataOwnership.datasourceName = this.datasourceName;
            this.globalVariableService.addResource('dataOwnerships', this.selectedDataOwnership)
                .then(res => {
                    if (this.selectedDataOwnershipRowIndex == null) {
                        this.selectedDataOwnershipRowIndex = 0;
                        this.selectedDatasourceID = this.selectedDataOwnership.id;
                    };

                    // Add locally
                    this.dataOwnerships.push(this.selectedDataOwnership);

                })
                .catch(err => this.errorMessage = 'Error adding ownership: ' + err);
        };

        // Save the changes
        if (this.editing) {
            this.selectedDataOwnership.datasourceID = this.datasourceID;
            this.selectedDataOwnership.datasourceName = this.datasourceName;
            let datasourceIndex: number = this.dataOwnerships
                .findIndex(sch => sch.id == this.selectedDataOwnership.id);
            if (datasourceIndex >= 0) {
                // this.dataOwnerships[datasourceIndex] =
                //     Object.assign({}, this.selectedDataOwnership);
                this.dataOwnerships[datasourceIndex] =
                    JSON.parse(JSON.stringify(this.selectedDataOwnership));
            };
            this.globalVariableService.saveResource('dataOwnerships', this.selectedDataOwnership)
                .then(res => console.log('xx Save Done'))
                .catch(err => this.errorMessage = 'Error saving ownership: ' + err)
        };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedDataOwnershipRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickEdit() {
        // Start editing selected Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.dataOwnerships.length > 0) {
            this.editing = true;
        };
        this.errorMessage = '';

    }

    clickAdd() {
        // Add a new Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.adding = true;
        this.editing = false;
        this.errorMessage = '';

    }

    clickDelete(index: number, id: number) {
        // Delete a Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.clearRecord();
        this.globalVariableService.deleteResource('dataOwnerships', id).then(res => {
            this.dataOwnerships = this.dataOwnerships.filter(dow => dow.id != id)
        });

        this.selectedDataOwnershipRowIndex = null;
        this.selectedDatasourceID = null;
    }
}


