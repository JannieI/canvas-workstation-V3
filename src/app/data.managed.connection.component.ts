/*
 * Manage Connections for managed Datasources.
 */

// Angular 
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';


@Component({
    selector: 'data-managed-connection',
    templateUrl: './data.managed.connection.component.html',
    styleUrls:  ['./data.managed.connection.component.css']
})
export class DataManagedConnectionComponent implements OnInit {

    @Output() formDataManagedConnectionClosed: EventEmitter<string> = new EventEmitter();

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

    
    adding: boolean = false;
    connectionID: number = null;
    dataConnections: DataConnection[];
    editing: boolean = false;
    errorMessage: string = '';
    selectedConnection: DataConnection;
    selectedConnectionRowIndex: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.clearRecord();

        this.globalVariableService.getResource('dataConnections')
            .then(dc => {
                this.dataConnections = dc.slice();
                if (this.dataConnections.length > 0) {
                    this.clickRow(0, this.dataConnections[0].id);
                };
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Managed.connections getResource: ' + err);
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

        // Set the row index
        this.selectedConnectionRowIndex = index;
        this.adding = false;
        this.editing = false;
        this.connectionID = id;
        this.errorMessage = '';

        // Fill the form
        let connectionIndex: number = this.dataConnections
            .findIndex(dc => dc.id === id);
        if (connectionIndex >= 0) {
            // this.selectedConnection = Object.assign({},
            //     this.dataConnections[connectionIndex]
            // );
            this.selectedConnection = JSON.parse(JSON.stringify(
                this.dataConnections[connectionIndex]
            ));
        };

    }

    clearRecord() {
        // Clear single record
        this.globalFunctionService.printToConsole(this.constructor.name,'clearRecord', '@Start');

        this.selectedConnection = {
            id: null,
            connectionName: '',
            serverType: '',
            serverName: '',
            port: '',
            database: '',
            authentication: '',
            username: '',
            password: '',
            description: '',
            editedBy: '',
            editedOn: null,
            createdBy: '',
            createdOn: null
        };
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataManagedConnectionClosed.emit(action);

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
            .findIndex(sch => sch.id === this.selectedConnection.id);
        if (dataconnectionIndex >= 0) {
            // this.selectedConnection = Object.assign({},
            //     this.dataConnections[dataconnectionIndex]
            // );
            this.selectedConnection = JSON.parse(JSON.stringify(
                this.dataConnections[dataconnectionIndex]
            ));
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
            this.selectedConnection.connectionName === '') {
                this.errorMessage = 'Enter a Connection Name';
                return;
        };

        // Add to local and DB
        if (this.adding) {

            let newConnection: DataConnection = JSON.parse(JSON.stringify(this.selectedConnection));
            newConnection._id = null;
            newConnection.id = null;

            this.globalVariableService.addResource('dataConnections', newConnection)
                .then(res => {
                    newConnection.id = res.id;

                    // Add locally
                    this.dataConnections.push(newConnection);

                    this.clickRow(0, this.dataConnections[0].id);

                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Managed.connections addResource: ' + err);
                });
        };

        // Save the changes
        if (this.editing) {
            let dataconnectionIndex: number = this.dataConnections
                .findIndex(sch => sch.id === this.selectedConnection.id);
            if (dataconnectionIndex >= 0) {
                // this.dataConnections[dataconnectionIndex] =
                //     Object.assign({}, this.selectedConnection);
                this.dataConnections[dataconnectionIndex] =
                    JSON.parse(JSON.stringify(this.selectedConnection));
            };
            this.globalVariableService.saveResource(
                'dataConnections', 
                this.selectedConnection
                )
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Managed.connections saveResource: ' + err);
                });
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
        this.globalVariableService.deleteResource('dataConnections', id)
            .then(res => {
                this.dataConnections = this.dataConnections.filter(dc => dc.id != id);
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Managed.connections deleteResource: ' + err);
            });

        this.selectedConnectionRowIndex = null;
        this.connectionID = null;
    }
}


