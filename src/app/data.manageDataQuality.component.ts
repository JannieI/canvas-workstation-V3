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
import { DataQualityIssue }           from './models';
 
@Component({
    selector: 'data-manageDataQuality',
    templateUrl: './data.manageDataQuality.component.html',
    styleUrls: ['./data.manageDataQuality.component.css']
})

export class DataManageDataQualityComponent implements OnInit {

    @Output() formDataManageDataQualityClosed: EventEmitter<string> = new EventEmitter();

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
    connectionID: number = null;
    dataConnections: DataQualityIssue[];
    editing: boolean = false;
    errorMessage: string = "";
    selectedDataQualityIssue: DataQualityIssue;
    selectedDataQualityIssueRowIndex: number = 0;

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.clearRecord();
        
        this.globalVariableService.getDataConnections().then(dc => {
            this.dataConnections = dc.slice();
            if (this.dataConnections.length > 0) {
                this.clickRow(0, this.dataConnections[0].id);
            };
        });

    }

    clickSelectedDataConnection(index: number, id: number) {
        // Clicked a Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDataConnection', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedDataQualityIssueRowIndex = index;
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        console.warn('xx clickRow STRT', this.selectedDataQualityIssue, this.dataConnections)
        // Set the row index
        this.selectedDataQualityIssueRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.connectionID = id;
        this.errorMessage = '';

        // Fill the form
        let connectionIndex: number = this.dataConnections
            .findIndex(dc => dc.id == id);
        if (connectionIndex >= 0) {
            this.selectedDataQualityIssue = Object.assign({}, 
                this.dataConnections[connectionIndex]
            );
        };
        console.warn('xx END selectedDataQualityIssue', this.selectedDataQualityIssue)

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
            loggedOn: '',
            solvedBy: '',
            solvedOn: ''
        };
    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManageDataQualityClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedDataQualityIssueRowIndex, this.connectionID);
        
        // Re Fill the form
        let dataconnectionIndex: number = this.dataConnections
            .findIndex(sch => sch.id == this.selectedDataQualityIssue.id);
        if (dataconnectionIndex >= 0) {
            this.selectedDataQualityIssue = Object.assign({}, 
                this.dataConnections[dataconnectionIndex]
            );
        };

        // Reset
        this.selectedDataQualityIssueRowIndex = null;
        this.connectionID = null;

    }

    clickSave() {
        // Save changes to a Data Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedDataQualityIssue.connectionName == null
            ||
            this.selectedDataQualityIssue.connectionName == '') {
                this.errorMessage = 'Enter a Connection Name';
                return;
        };

        // Add to local and DB
        if (this.adding) {
            this.selectedDataQualityIssue.id = null;

            this.globalVariableService.addDataConnection(this.selectedDataQualityIssue).then(
                res => {
                    if (this.selectedDataQualityIssueRowIndex == null) {
                        this.selectedDataQualityIssueRowIndex = 0;
                        this.connectionID = this.selectedDataQualityIssue.id;
                        console.warn('xx hier')
                    };

                    // Add locally
                    this.dataConnections.push(this.selectedDataQualityIssue);
                            
                }
            );
        };

        // Save the changes
        if (this.editing) {
            let dataconnectionIndex: number = this.dataConnections
                .findIndex(sch => sch.id == this.selectedDataQualityIssue.id);
            if (dataconnectionIndex >= 0) {
                this.dataConnections[dataconnectionIndex] = 
                    Object.assign({}, this.selectedDataQualityIssue);
            };
            this.globalVariableService.saveDataConnection(this.selectedDataQualityIssue)
        };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedDataQualityIssueRowIndex = null;
        this.connectionID = null;

    }

    clickEdit() {
        // Start editing selected Data Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        if (this.dataConnections.length > 0) {
            this.editing = true;
        };
        this.errorMessage = '';

    }

    clickAdd() {
        // Add a new Data Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.adding = true;
        this.editing = false;
        this.errorMessage = '';

    }

    clickDelete(index: number, id: number) {
        // Delete a Data Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.clearRecord();
        this.globalVariableService.deleteDataConnection(id).then(res => {
            this.dataConnections = this.globalVariableService.dataConnections
        }); 

        this.selectedDataQualityIssueRowIndex = null;
        this.connectionID = null;
    }
}


