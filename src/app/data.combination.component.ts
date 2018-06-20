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
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue }           from './models';

// Vega
import * as dl from 'datalib';
import { load } from 'datalib';

interface localDatasources extends Datasource
    {
        isSelected?: boolean;
        hasWidget?: boolean;
    }

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
    dataQualityIssues: DataQualityIssue[];
    datasources: localDatasources[];
    errorMessage: string = "";
    fileName: string = '';
    folderName: string = '';
    // TODO - fix!!
    fieldTypes: string[] = ['MonthTraded', 'TradeType', 'Volume' ,'Price', 'Value'];
    headers: string[] = [];
    selectedDatasources: Datasource[];
    selectedDatasource: Datasource;
    selectedRowID: number = 0;
    selectedRowIndex: number = 0;
    selectedRowName: string = '';
    selectedRowDescription: string = '';
    selectedRowNrWidgetsInUse: number = 0;
    selectedUnion: boolean = false;
    selectedIntersect: boolean = false;
    selectedMinus: boolean = false;
    selectedJoin: boolean = false;

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
        this.selectedRowIndex = -1;
        this.selectedRowName = '';
        this.selectedRowNrWidgetsInUse = 0;

        // Select first row if exists
        if (this.datasources.length > 0) {
            this.clickSelectedDatasource(0, this.datasources[0].id);
        };
        console.warn('xx DS, dSet', this.globalVariableService.datasources, this.globalVariableService.currentDatasources, this.globalVariableService.datasets, this.globalVariableService.currentDatasets)


        if (this.combinationType == 'Union') { this.selectedUnion = false };
        if (this.combinationType == 'Intersect') { this.selectedIntersect = false };
        if (this.combinationType == 'Minus') { this.selectedMinus = false };
        if (this.combinationType == 'Join') { this.selectedJoin = false };
    

    }

    clickSelectedDatasource(index: number, id: number) {
        // Clicked a DS -> Show related info and preview its data
        // index = Index / position on CURRENT page, when using pagination
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedDatasource', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;

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



    




    