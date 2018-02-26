/*
 * Dashboard
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { ContentChildren }            from '@angular/core';
import { Directive }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { HostBinding }                from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { QueryList }                  from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Renderer2 }                  from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';

import { Observable} from 'rxjs'
// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// Own Services

// Own Components


@Component({
    selector: 'slicer-single',
    templateUrl: './slicer.single.component.html',
    styleUrls: ['./slicer.single.component.css']
})
export class SlicerSingleComponent {
    @Input() slicer: Widget;

    @ViewChild('slicerDOM')  slicerDOM: ElementRef;

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

        console.log('xx sl w', this.slicer)
    }
    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        //
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

    }

    clickSlicer(index: number, id: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicer', '@Start');

        // Item handles things
        if (this.slicerItemClicked) {
            this.slicerItemClicked = false;
            return;
        }
        console.log('xx cl-Sl', this.slicer, index, id)
        // this.slicer.isSelected = !this.slicer.isSelected; slicerSelection
        // this.globalVariableService.currentSlicers.forEach(sl => {
        //     if (sl.id == id) {sl.isSelected = sl.isSelected}
        // })

    }

    clickSlicerItem(
        index: number, 
        id: number, 
        datasourceID: number, 
        datasetID: number,
        fieldValue: string
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
        })
        console.log('xx this.slicer.slicerSelection', this.slicer.slicerSelection)
        let a: boolean = true;
        if (a) return;
        // Adjust the global Sl selection, for next time
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.id == id) {

                // Update the selected item
                w.slicerSelection.forEach(sel => {
                    if (sel.fieldValue == fieldValue) {
                        sel.isSelected = !sel.isSelected;
                    }
                })

            }
        });

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
        // this.widgetDOM.refreshWidgets(-1,-1,wIDs);
        // this.currentSlicers = this.globalVariableService.currentSlicers;
    }

}