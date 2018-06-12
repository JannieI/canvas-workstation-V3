/*
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';


@Component({ 
    selector: 'data-connection',
    templateUrl: './data.connection.component.html',
    styleUrls:  ['./data.connection.component.css']
})
export class DataConnectionComponent implements OnInit {

    @Output() formDataConnectionClosed: EventEmitter<string> = new EventEmitter();

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
    dataConnections: DataConnection[];
    editing: boolean = false;
    errorMessage: string = "";
    selectedConnection: DataConnection;
    selectedConnectionRowIndex: number = 0;

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
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
        this.selectedConnectionRowIndex = index;
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        console.warn('xx clickRow STRT', this.selectedConnection, this.dataConnections)
        // Set the row index
        this.selectedConnectionRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.connectionID = id;
        this.errorMessage = '';

        // Fill the form
        let connectionIndex: number = this.dataConnections
            .findIndex(dc => dc.id == id);
        if (connectionIndex >= 0) {
            this.selectedConnection = Object.assign({}, 
                this.dataConnections[connectionIndex]
            );
        };
        console.warn('xx END selectedConnection', this.selectedConnection)

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedConnection = {
            id: null,
            connectionName: '',
            serverType: '',
            serverName: '',
            authentication: '',
            description: ''
        };
    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataConnectionClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        this.editing = false;
        this.adding = false;
        this.errorMessage = '';
        this.clickRow(this.selectedConnectionRowIndex, this.connectionID);
        
        // Re Fill the form
        let dataconnectionIndex: number = this.dataConnections
            .findIndex(sch => sch.id == this.selectedConnection.id);
        if (dataconnectionIndex >= 0) {
            this.selectedConnection = Object.assign({}, 
                this.dataConnections[dataconnectionIndex]
            );
        };

        // Reset
        this.selectedConnectionRowIndex = null;
        this.connectionID = null;

    }

    clickSave() {
        // Save changes to a Data Connection
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.errorMessage = '';

        // Validation
        this.errorMessage = '';

        if (this.selectedConnection.connectionName == null
            ||
            this.selectedConnection.connectionName == '') {
                this.errorMessage = 'Enter a Connection Name';
                return;
        };

        // Add to local and DB
        if (this.adding) {
            this.selectedConnection.id = null;

            this.globalVariableService.addDataConnection(this.selectedConnection).then(
                res => {
                    if (this.selectedConnectionRowIndex == null) {
                        this.selectedConnectionRowIndex = 0;
                        this.connectionID = this.selectedConnection.id;
                        console.warn('xx hier')
                    };
                            
                }
            );
        };

        // Save the changes
        if (this.editing) {
            let dataconnectionIndex: number = this.dataConnections
                .findIndex(sch => sch.id == this.selectedConnection.id);
            if (dataconnectionIndex >= 0) {
                this.dataConnections[dataconnectionIndex] = 
                    Object.assign({}, this.selectedConnection);
            };
            this.globalVariableService.saveDataConnection(this.selectedConnection)
        };

        // Reset
        this.editing = false;
        this.adding = false;
        this.selectedConnectionRowIndex = null;
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

        this.selectedConnectionRowIndex = null;
        this.connectionID = null;
    }
}


