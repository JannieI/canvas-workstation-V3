/*
 * Visualise page, to view / present Dashboards previously created
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
import { DataQualityIssue }           from './models';

@Component({
    selector: 'data-managed-dataQuality',
    templateUrl: './data.managed.dataQuality.component.html',
    styleUrls: ['./data.managed.dataQuality.component.css']
})

export class DataManageDataQualityComponent implements OnInit {

    @Output() formDataManagedDataQualityClosed: EventEmitter<string> = new EventEmitter();

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
    dataQualityIssues: DataQualityIssue[];
    datasourceID: number;
    datasourceName: string;
    datasourceNames: string[] = [];
    editing: boolean = false;
    errorMessage: string = "";
    selectedDatasourceID: number = null;
    selectedDataQualityIssue: DataQualityIssue;
    selectedDataQualityIssueRowIndex: number = 0;
    selectedLinkedDatasource: string;


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
            if (obj1 > obj2) {
                return 1;
            };
            if (obj1 < obj2) {
                return -1;
            };
            return 0;
        });

        this.globalVariableService.getDataQualityIssues().then(dc => {

            this.dataQualityIssues = dc.slice();
            if (this.dataQualityIssues.length > 0) {
                this.clickRow(0, this.dataQualityIssues[0].id);
            };
        });

    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedDataQualityIssueRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.selectedDatasourceID = id;
        this.errorMessage = '';

        // Fill the form
        let selectedDatasourceIndex: number = this.dataQualityIssues
            .findIndex(dc => dc.id == id);
        if (selectedDatasourceIndex >= 0) {

            let datasourceIndex: number = this.globalVariableService.datasources.findIndex(ds =>
                ds.id == this.dataQualityIssues[selectedDatasourceIndex].datasourceID
            );
            this.selectedLinkedDatasource = this.globalVariableService.datasources[datasourceIndex]
                .name + ' (' + this.globalVariableService.datasources[datasourceIndex].id + ')';
            console.warn('xx ds', this.selectedLinkedDatasource, datasourceIndex, this.selectedLinkedDatasource)

            // this.selectedDataQualityIssue = Object.assign({},
            //     this.dataQualityIssues[selectedDatasourceIndex]
            // );
            this.selectedDataQualityIssue = JSON.parse(JSON.stringify(
                this.dataQualityIssues[selectedDatasourceIndex]
            ));
        } else {
            this.selectedLinkedDatasource = '';
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedDataQualityIssue = {
            id: null,
            name: '',
            datasourceID: null,
            status: '',
            type: '',
            description: '',
            nrIssues: 0,
            loggedBy: '',
            loggedOn: null,
            solvedBy: '',
            solvedOn: null
        };
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedDataQualityClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedDataQualityIssueRowIndex, this.selectedDatasourceID);

        // Re Fill the form
        let datasourceIndex: number = this.dataQualityIssues
            .findIndex(sch => sch.id == this.selectedDataQualityIssue.id);
        if (datasourceIndex >= 0) {
            // this.selectedDataQualityIssue = Object.assign({},
            //     this.dataQualityIssues[datasourceIndex]
            // );
            this.selectedDataQualityIssue = JSON.parse(JSON.stringify(
                this.dataQualityIssues[datasourceIndex]
            ));
        };

        // Reset
        this.selectedDataQualityIssueRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to a Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDataQualityIssue.name == null
            ||
            this.selectedDataQualityIssue.name == '') {
                this.errorMessage = 'Enter a Name to identify the issue';
                return;
        };

        let index: number = this.selectedLinkedDatasource.indexOf(' (');
        if (index >= 0) {
            this.datasourceName = this.selectedLinkedDatasource.substring(0, index);
            this.datasourceID = +this.selectedLinkedDatasource.substring(
                index + 2, this.selectedLinkedDatasource.length - 1
            );
        };

        // Add to local and DB
        if (this.adding) {
            this.selectedDataQualityIssue.id = null;

            this.selectedDataQualityIssue.datasourceID = this.datasourceID;
            this.globalVariableService.addDataQualityIssue(this.selectedDataQualityIssue).then(
                res => {
                    if (this.selectedDataQualityIssueRowIndex == null) {
                        this.selectedDataQualityIssueRowIndex = 0;
                        this.selectedDatasourceID = this.selectedDataQualityIssue.id;
                    };

                    // Add locally
                    this.dataQualityIssues.push(this.selectedDataQualityIssue);

                }
            );
        };

        // Save the changes
        if (this.editing) {
            let datasourceIndex: number = this.dataQualityIssues
                .findIndex(sch => sch.id == this.selectedDataQualityIssue.id);
            if (datasourceIndex >= 0) {
                // this.dataQualityIssues[datasourceIndex] =
                //     Object.assign({}, this.selectedDataQualityIssue);
                this.dataQualityIssues[datasourceIndex] =
                    JSON.parse(JSON.stringify(this.selectedDataQualityIssue));
            };
            this.selectedDataQualityIssue.datasourceID = this.datasourceID;
            this.globalVariableService.saveDataQualityIssue(this.selectedDataQualityIssue)
        };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedDataQualityIssueRowIndex = null;
        this.selectedDatasourceID = null;

    }

    clickEdit() {
        // Start editing selected Data Quality record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.dataQualityIssues.length > 0) {
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
        this.globalVariableService.deleteDataQualityIssue(id).then(res => {
            this.dataQualityIssues = this.globalVariableService.dataQualityIssues
        });

        this.selectedDataQualityIssueRowIndex = null;
        this.selectedDatasourceID = null;
    }
}


