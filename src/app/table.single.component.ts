/*
 * Dashboard
 */

// From Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
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

    currentData: any = [];
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    dataFieldNames: string[] = [];
    editMode: boolean;
    endWidgetNumber: number;
    isBusyResizing: boolean = false;
    refreshGraphs: boolean = false;
    slicerItemClicked: boolean = false;     // True if Item was clicked -> dont click others
    startX: number;
    startY: number;
    startWidgetNumber: number;
    selectedWidgetIDs: number[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }
    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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

        // Load first few rows into preview
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0,5);

        // Get DS
        this.currentDatasources = this.globalVariableService.currentDatasources
            .filter(ds => ds.id == this.table.datasourceID)
        this.dataFieldNames = this.currentDatasources[0].dataFields;


        console.log('xx Tbl ', this.table)
    }

    clickSlicer(index: number, id: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicer', '@Start');

        // Item handles things
        if (this.slicerItemClicked) {
            this.slicerItemClicked = false;
            return;
        }
    }

    clickSlicerItem(
        index: number,
        id: number,
        datasourceID: number,
        datasetID: number,
        fieldValue: string,
        ev: any
        ) {
        // Clicked a Slicer item - now filter the data, and then update related Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerItem', '@Start');

        // Indicate the Item was clicked
        this.slicerItemClicked = true;

        // Update Sl
        this.table.slicerSelection.forEach(sel => {
            if (sel.fieldValue == fieldValue) {
                sel.isSelected = !sel.isSelected;
            }
        });

        // Adjust the global Sl selection, for next time
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.id == id) {

                // Update the selected item
                w.slicerSelection.forEach(sel => {
                    if (sel.fieldValue == fieldValue) {
                        sel.isSelected = ev.target.checked;
                    }
                })

            }
        });

        // Adjust the current Slicer
        this.table.slicerSelection.forEach(sel => {
            if (sel.fieldValue == fieldValue) {
                sel.isSelected = ev.target.checked;
            }
        })

        // Filter the data in the dSets to which the Sl points.
        // In addition, apply all Sl that relates to each one
        this.globalVariableService.currentDatasets.forEach(cd => {
            if (cd.id == datasetID) {

                this.globalVariableService.filterSlicer(cd);
            }
        }
        );

        // Refresh Ws that are related to Sl
        let wIDs: number[] = [];
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.datasourceID == datasourceID  &&  w.datasetID == datasetID  && w.widgetType != 'Slicer') {
                // wIDs.push(w.id);
                this.globalVariableService.changedWidget.next(w);
            }
        })
    }

}