    /*
 * Combine selected Datasources by appending it to the first one.
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
import { Field }                      from './models';


@Component({
    selector: 'data-combination',
    templateUrl: './data.combination.component.html',
    styleUrls:  ['./data.combination.component.css']
})
export class DataCombinationComponent implements OnInit {

    @Input() combinationType: string;
    @Output() formDataCombinationClosed: EventEmitter<string> = new EventEmitter();

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

    // datasources: Datasource[];
    currentData: any = [];
    currentDSids: number[] = [];                    // List of DS-IDs in use
    dataFieldLengths: number[] = [];
    dataFieldNames: string[];
    dataFieldTypes: string[] = [];
    datasources: Datasource[];
    errorMessage: string = "";
    // TODO - fix!!
    fieldTypes: string[] = ['MonthTraded', 'TradeType', 'Volume' ,'Price', 'Value'];
    headers: string[] = [];
    newName: string = '';
    newDescription: string = '';
    selectedDatasources: Datasource[];
    selectedDatasource: Datasource;
    selectedRowID: number = 0;
    selectedRowIndexLH: number = 0;
    selectedRowIndexRH: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    selectedRowNrWidgetsInUse: number = 0;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        console.warn('xx combinationType', this.combinationType)

        // Load from global variables
        this.datasources = this.globalVariableService.datasources.slice();

        // Reset
        this.selectedRowID = -1;
        this.selectedRowIndexLH = -1;
        this.selectedRowIndexRH = -1;
        this.selectedRowName = '';
        this.selectedRowNrWidgetsInUse = 0;

        // Select first row if exists
        if (this.datasources.length > 0) {
            this.clickSelectedDatasourceLH(0, this.datasources[0].id);
        };

    }

    clickSelectedDatasourceLH(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndexLH = index;

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

        };
        this.errorMessage = '';
    }

    clickSelectedDatasourceRH(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndexRH = index;

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

        };
        this.errorMessage = '';
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataCombinationClosed.emit(action);

    }

}



    




    