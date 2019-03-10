/*
 * Compoonent for a single Table
 */

// From Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { Input }                      from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'
import { Datasource }                 from './models';


@Component({
    selector: 'table-single',
    templateUrl: './table.single.component.html',
    styleUrls: ['./table.single.component.css']
})
export class TableSingleComponent {
    @Input() table: Widget;

    @ViewChild('tableDOM')  tableDOM: ElementRef;

    allowEdit: boolean = false;
    currentData: any = [];
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    hasTitle: boolean;
    nrRecords: number = 0;
    pageSize: number = 10;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }
    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit...', '@Start');

        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.currentDatasets.length; i++) {
            if(this.globalVariableService.currentDatasets[i].datasourceID == this.table.datasourceID) {
                ds.push(this.globalVariableService.currentDatasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + this.table.datasourceID)
        };

        // Load rows with a Max
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0, this.globalVariableService.canvasSettings.maxTableLength);

        // Totals
        this.nrRecords = this.currentData.length;
        this.hasTitle = this.table.containerHasTitle;

        // Get DS
        this.currentDatasources = this.globalVariableService.currentDatasources
            .filter(ds => ds.id == this.table.datasourceID)
        this.dataFieldNames = this.currentDatasources[0].dataFields;
        this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;

    }

    clickTable() {
        // Handles click event on a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTable', '@Start');
    }

    clickNrRows(newValue: number) {
        // Enter changed amount of rows
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNrRows', '@Start');

        console.warn('xx newV', newValue, this.nrRecords)
        this.allowEdit = !this.allowEdit;
        // "> <input type="text" [(ngModel)]="nrRecords"
    }
}