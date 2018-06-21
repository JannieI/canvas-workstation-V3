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
import { Widget }                     from './models';
 
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
    selectedDatasource: Datasource;
    selectedDatasourcesRowIndex: number = 0;
    isBusyRetrievingData: boolean = false;
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    selectedRowIndex: number = 0;
    currentData: any = [];
    dataFieldNames: string[] = [];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get DS
        this.currentDatasources = this.globalVariableService.datasources.slice();

        if (this.currentDatasources.length > 0) {
            this.dataFieldNames = this.currentDatasources[0].dataFields;
        };
            
        // Count the Ws
        let widgets: Widget[];
        this.currentDatasources.forEach(ds => {
            widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
            ds.nrWidgets = widgets.length;
        });
    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedDatasourcesRowIndex = index;
        this.dataFieldNames = this.currentDatasources[index].dataFields;
        
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataRefreshOnceClosed.emit(action);

    }

    dblclickDSrow(index: number, datasourceID: number) {
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
        let dsIndex: number = this.currentDatasources
            .findIndex(ds => ds.id == datasourceID);
        
        if (dsIndex >= 0) {
            this.dataFieldNames = this.currentDatasources[dsIndex].dataFields;
            
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
