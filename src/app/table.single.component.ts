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
    localWidgetFilters: {
        targetWidgetID: number;
        sourceWidgetField: string;
        targetWidgetTitle: string;
        targetWidgetField: string;
    }[] = [];
    nrRecords: number = 0;
    pageSize: number = 10;
    selectedRowIndex: number = -1;
    widgetFilterColumns: string[] = [];
    widgets: Widget[] = [];
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

        // Get data for the selected DS, with a Max
        this.currentData = this.globalVariableService.currentDatasources
            .filter(d => d.id == this.table.datasourceID)[0].dataFiltered
            .slice(0, this.globalVariableService.canvasSettings.maxTableLength);

        this.table.widgetFilters.forEach(wf => {
            if (wf.filterType == 'CrossFilter' 
                && wf.isActive == true) {
                    console.log('xx d filter', wf.filterFieldName, wf.filterValue)
                    this.currentData = this.currentData
                        .filter(row => row[wf.filterFieldName] == wf.filterValue)
            };

        });

        // Totals
        this.nrRecords = this.currentData.length;
        this.hasTitle = this.table.containerHasTitle;

        // Get DS
        this.currentDatasources = this.globalVariableService.currentDatasources
            .filter(ds => ds.id == this.table.datasourceID)
        this.dataFieldNames = this.currentDatasources[0].dataFields;
        this.dataFieldLengths = this.currentDatasources[0].dataFieldLengths;

        // For now, only show Ws on the same Tab
        this.widgets = this.globalVariableService.currentWidgets
            .filter(
                w => w.dashboardID == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardID
                &&
                w.dashboardTabID == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardTabID
                &&
                (w.widgetType == 'Graph'  ||  w.widgetType == 'Table')
                &&
                (w.id != this.table.id)
            )
            .sort( (a,b) => {
                if (a.name < b.name) {
                    return 1;
                };
                if (a.name > b.name) {
                    return -1;
                };
                return 0;
            })
            
        // Array of CrossFilters for form 
        this.widgets.forEach(w => {

            w.widgetFilters.forEach(wf => {
                if (wf.sourceWidgetID == this.table.id) {

                    if (wf.filterType == 'CrossFilter') {
                        this.widgetFilterColumns.push(wf.filterFieldName);

                        this.localWidgetFilters.push({
                            sourceWidgetField: wf.sourceDatasourceField,
                            targetWidgetID: wf.sourceWidgetID,
                            targetWidgetTitle: w.titleText,
                            targetWidgetField: wf.filterFieldName
                        });
                    };
                };
        
                if (this.localWidgetFilters.length > 0) {
                    this.selectedRowIndex = 0;
                };
            })
        });
        console.log('xx this.widgetFilterColumns', this.widgetFilterColumns)
    }

    clickTable(ev: any) {
        // Handles click event on a Table
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTable', '@Start');
    
        console.log('xx table', ev)
    }

    clickNrRows(ev: any, newValue: number) {
        // Enter changed amount of rows
        this.globalFunctionService.printToConsole(this.constructor.name,'clickNrRows', '@Start');

        this.allowEdit = !this.allowEdit;
        console.log('xx Row', ev)
    }

    clickColumn(ev: any, newValue: number) {
        // Enter changed amount of rows
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColumn', '@Start');

        this.allowEdit = !this.allowEdit;
        console.log('xx Col', ev, ev.srcElement, ev.target)
    }

    clickCell(ev: any) {
        // Handles click event in a Cell
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCell', '@Start');

        let cellContent: string = ev.srcElement.innerText;
        let rowContent: string = ev.srcElement.parentElement.innerText;
        let rowContentArray: string[] = rowContent.split(/\r?\n/).map(x => x.trim());
        let cellPosition: number = rowContentArray.findIndex(x => x == cellContent);
        let columnHeader: string = '';

        if (cellPosition >= 0  &&  this.dataFieldNames.length > 0) {
            columnHeader = this.dataFieldNames[cellPosition];
        };

        console.log('xx cell', cellPosition, columnHeader, ev.srcElement.innerText, rowContent, rowContentArray.indexOf(cellContent), rowContentArray)

        // If a CrossFilter exists for the select column in the current Widget,
        // Make the CrossFilter in the target Widget active, and refresh the Widget
        this.widgets.forEach(w => {

            w.widgetFilters.forEach(wf => {
                if (wf.sourceWidgetID == this.table.id
                    &&
                    wf.sourceDatasourceField == columnHeader
                    &&
                    wf.filterType == 'CrossFilter') {
                        wf.isActive = true;
                        wf.filterValue = cellContent;
                        console.log('xx refresh name wf', w.name, wf)
                        this.globalVariableService.changedWidget.next(w);
                };
        
            });
        });

    }

    calcBackgroundColour(columnName: string): string {
        // Calc the bg colour, based on in Widget Filter or not
        this.globalFunctionService.printToConsole(this.constructor.name,'calcBackgroundColour', '@Start');

        if (this.widgetFilterColumns.indexOf(columnName) >= 0) {
            return 'gray';
        } else {
            return 'lightgray';
        }
    }

    calcWfilter(columnName: string): string {
        // Return * if given column in a Widget Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'calcWfilter', '@Start');

        if (this.widgetFilterColumns.indexOf(columnName) >= 0) {
            return '*';
        } else {
            return '';
        };
    }

}