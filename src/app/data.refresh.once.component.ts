/*
 * Shows form to refresh Datasources once off
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

    currentData: any = [];
    dataFieldNames: string[] = [];
    datasources: Datasource[] = [];
    editing: boolean = false;
    errorMessage: string = '';
    infoMessage: string;
    isBusyRetrievingData: boolean = false;
    selectedDatasource: Datasource;
    selectedRowIndex: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get DS
        this.globalVariableService.getResource('datasources')
        .then(d =>{
            let widgets: Widget[];
            this.globalVariableService.getResource('widgets')
                .then(w => {
                    widgets = w;
                    this.datasources = d
                        .sort( (obj1, obj2) => {
                            if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                                return 1;
                            };
                            if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                                return -1;
                            };
                            return 0;
                        });

                    if (this.datasources.length > 0) {
                        this.dataFieldNames = this.datasources[0].dataFields;
                    };

                    // Count the Ws
                    this.datasources.forEach(ds => {
                        widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
                        ds.nrWidgets = widgets.length;
                    });
                })
                .catch(err => {
                    this.errorMessage = err.slice(0, 100);
                    console.error('Error in Datasource.refreshOnce reading widgets: ' + err);
                });

        })
        .catch(err => {
            this.errorMessage = err.slice(0, 100);
            console.error('Error in managed.SQL Datasource.refreshOnce reading datasources: ' + err);
        });

    }

    clickRow(index: number, id: number) {
        // Click Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Set the row index
        this.selectedRowIndex = index;
        this.dataFieldNames = this.datasources[index].dataFields;
        this.errorMessage = '';
        this.infoMessage = '';

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
        this.infoMessage = '';

        // Check permissions
        if (!this.globalVariableService.datasourcePermissionsCheck(
            datasourceID, 'CanRefresh') ) {
            this.errorMessage = 'No permission to refresh the data for this record';
            return;
        };

        // Get
        this.globalVariableService.getCurrentDatasource(datasourceID)
            .then(res => {
                this.dataFieldNames = res.dataFields;
                this.currentData = res.dataFiltered.slice(0,5);
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in managed.SQL Datasource.refreshOnce addCurrentDatasource: ' + err);
            });

    }

}
