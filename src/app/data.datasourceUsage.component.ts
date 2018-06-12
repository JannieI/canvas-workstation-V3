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
import { Datasource }                 from './models';
import { Dashboard }                  from './models';
import { Widget }                     from './models';

interface DashboardList {
    code: string;
    name: string;
    state: string;
    accessType: string;
    description: string;
}

@Component({
    selector: 'data-datasourceUsage',
    templateUrl: './data.datasourceUsage.component.html',
    styleUrls:  ['./data.datasourceUsage.component.css']
})
export class DataDatasourceUsageComponent implements OnInit {

    @Output() formDataDatasourceUsageClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[];
    dashboardList: DashboardList[] = [];
    errorMessage: string = "";
    selectedRowIndex: number = 0;
    widgets: Widget[] = [];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();

        // Show D for DS
        if (this.datasources.length > 0) {
            this.clickSelectedDatasource(0, this.datasources[0].id);
        };

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

        this.widgets = this.globalVariableService.widgets.filter(w => {
            w.datasourceID == id;
        })

        // Build a list of unique D
        let dashboardIDs: number[] = [];
        this.widgets.forEach(w => {
            if (dashboardIDs.indexOf(w.dashboardID) < 0) {
                dashboardIDs.push(w.dashboardID);
            };
        });

        // Build list to display
        this.dashboardList = [];
        dashboardIDs.forEach(d => {
            dashboardList
        })
        this.dashboards = this.globalVariableService.dashboards.filter(d => 
            d.dat            
        )
        let dsIndex: number = -1;
        dsIndex = this.datasources.findIndex(ds => ds.id == id);
        if (dsIndex != -1) {
            this.selectedDatasource = this.datasources[dsIndex];
            this.dataFieldNames = this.selectedDatasource.dataFields;
            this.selectedRowID = this.datasources[dsIndex].id;
            this.selectedRowName = this.datasources[dsIndex].name;
            this.selectedRowDescription = this.datasources[dsIndex].description;

            this.selectedRowNrWidgetsInUse = this.globalVariableService.widgets.filter(w =>
                w.datasourceID == this.datasources[index].id    
                &&
                w.dashboardID == this.globalVariableService.currentDashboardInfo.value.currentDashboardID
            ).length;


            // Show first tab
            this.clickDSDescription('gridViewDescription');
        };
        this.errorMessage = '';
    }
   
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDatasourceUsageClosed.emit(action);

    }


}


