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


@Component({
    selector: 'slicer-single',
    templateUrl: './slicer.single.component.html',
    styleUrls: ['./slicer.single.component.css']
})
export class SlicerSingleComponent {
    @Input() slicer: Widget;

    @ViewChild('slicerDOM')  slicerDOM: ElementRef;

    slicerItemClicked: boolean = false;     // True if Item was clicked -> dont click others

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
        this.slicer.slicerSelection.forEach(sel => {
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
        this.slicer.slicerSelection.forEach(sel => {
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