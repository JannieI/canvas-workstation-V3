/*
 * Data refresh Datasources once
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
 
@Component({
    selector: 'data-refresh-once',
    templateUrl: './data.refresh.once.component.html',
    styleUrls: ['./data.refresh.once.component.css']
})

export class DataRefreshOnceComponent implements OnInit {

    @Output() formDataRefreshOnceClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[] = [];
    editing: boolean = false;
    errorMessage: string = '';
    selectedDatasourceID: number = null;
    selectedDatasource: Datasource;
    selectedDatasourcesRowIndex: number = 0;
    isBusyRetrievingData: boolean = false;
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    selectedRowIndex: number = 0;
    currentData: any = [];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        // Reset, else async too late and form load fails
        this.selectedDatasource = 
        {
            id: null,
            type: '',
            subType: '',
            typeVersion: '',
            name: '',
            username: '',
            password: '',
            description: '',
            createdBy: '',
            createdOn: '',
            refreshedBy: '',
            refreshedOn: '',
            dataFieldIDs: null,
            dataFields: null,
            dataFieldTypes: null,
            dataFieldLengths: null,
            parameters: '',
            folder: '',
            fileName: '',
            excelWorksheet: '',
            transposeOnLoad: false,
            startLineNr: null,
            csvSeparationCharacter: '',
            csvQuotCharacter: '',
            connectionID: null,
            dataTableID: null,
            businessGlossary: '',
            databaseName: '',
            port: '',
            serverType: '',
            serverName: '',
            dataTableName: '',
            dataSQLStatement: '',
            dataNoSQLStatement: '',
            nrWidgets: null,
            dataDictionary: ''
        }

        this.globalVariableService.getDatasources().then(dc => {
            // Fill local Var
            this.datasources = dc.slice();
            console.warn('xx this.datasources.length', this.datasources.length)
            
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
console.warn('xx this.selectedDatasource ', this.selectedDatasource )
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataRefreshOnceClosed.emit(action);

    }

    dblclickDSrow(datasourceID: number, index: number) {
        // Refresh the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDSrow', '@Start');

        // Highlight selected row
        this.selectedRowIndex = index;
        this.errorMessage = '';

        // Determine if data obtains in Glob Var
        let dSetIndex: number = this.globalVariableService.currentDatasets.filter(
            dS => dS.datasourceID == datasourceID
        ).length;

        if (dSetIndex <= 0) {
            
            if (this.isBusyRetrievingData) {
                this.errorMessage = 'Still retrieving the actual data for this DS';
                return;
            };

            this.isBusyRetrievingData = true;
            this.errorMessage = 'Getting data ...'
            this.globalVariableService.addCurrentDatasource(datasourceID).then(res => {

                // Reset
                this.isBusyRetrievingData = false
                
                let globalCurrentDSIndex: number = this.globalVariableService.currentDatasources
                .findIndex(dS => dS.id == datasourceID
                );
                if (globalCurrentDSIndex >= 0) {
                    this.currentDatasources.push(
                        this.globalVariableService.currentDatasources[globalCurrentDSIndex]);
                };

                let globalCurrentDsetIndex: number = this.globalVariableService.currentDatasets
                    .findIndex(dS => dS.datasourceID == datasourceID
                );
                if (globalCurrentDsetIndex >= 0) {
                    this.globalVariableService.currentDatasets.splice(globalCurrentDsetIndex, 1);
                };

                // Tell user
                this.errorMessage = 'Data retrieved - click row again to continue';                

            });

            // Stop Synch execution
            return;
        };
 
        // Load local arrays for ngFor
        let dsIndex: number = this.globalVariableService.currentDatasources
            .findIndex(ds => ds.id == datasourceID);
        
        if (dsIndex >= 0) {
            // Reset
            this.isBusyRetrievingData = false;
        } else {

            if (this.isBusyRetrievingData) {
                this.errorMessage = 'Retrieving the actual data - click row again once done';
                return;
            };

            this.isBusyRetrievingData = true;
            this.globalVariableService.addCurrentDatasource(datasourceID).then(res => {
                this.isBusyRetrievingData = false
                
                let globalCurrentDSIndex: number = this.globalVariableService.currentDatasources
                .findIndex(dS => dS.id == datasourceID
                );
                if (globalCurrentDSIndex >= 0) {
                    this.currentDatasources.push(
                        this.globalVariableService.currentDatasources[globalCurrentDSIndex]);
                };

                let globalCurrentDsetIndex: number = this.globalVariableService.currentDatasets
                    .findIndex(dS => dS.datasourceID == datasourceID
                );
                if (globalCurrentDsetIndex >= 0) {
                    this.globalVariableService.currentDatasets.splice(globalCurrentDsetIndex, 1);
                };

            });
        };


        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.currentDatasets.length; i++) {
            if(this.globalVariableService.currentDatasets[i].datasourceID == datasourceID) {
                ds.push(this.globalVariableService.currentDatasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + datasourceID)
        };
        console.warn('xx this.globalVariableService.currentDatasets', this.globalVariableService.currentDatasets)

        // Load first few rows into preview
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0,5);



    }


}
