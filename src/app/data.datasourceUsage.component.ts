/*
 * Show in which Dashboards a selected Datasource is currently in use.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource }                 from './models';
import { Dashboard }                  from './models';
import { Widget }                     from './models';


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
    dashboards: Dashboard[] = [];
    errorMessage: string = 'asdfasdfasdfasdfasdfasdf';
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
        this.datasources = this.globalVariableService.datasources
            .slice()
            .sort((n1,n2) => {
                if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                    return 1;
                };

                if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                    return -1;
                };

                return 0;
            });

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

        this.widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == id);

        // Build a list of unique D
        let dashboardIDs: number[] = [];
        this.widgets.forEach(w => {
            if (dashboardIDs.indexOf(w.dashboardID) < 0) {
                dashboardIDs.push(w.dashboardID);
            };
        });

        // Build list to display
        this.dashboards = [];
        let dashboardIndex: number;
        dashboardIDs.forEach(did => {
            dashboardIndex = this.globalVariableService.dashboards.findIndex(d =>
                d.id == did);
            if (dashboardIndex >= 0) {
                this.dashboards.push(this.globalVariableService.dashboards[dashboardIndex]);
            }
        })

        this.errorMessage = 'asdfasdfasdfasdf';
    }
   
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDatasourceUsageClosed.emit(action);

    }


}


