/*
 * Component with a single Slicer
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


@Component({
    selector: 'slicer-single',
    templateUrl: './slicer.single.component.html',
    styleUrls: ['./slicer.single.component.css']
})
export class SlicerSingleComponent {
    @Input() slicer: Widget;

    @ViewChild('slicerDOM')  slicerDOM: ElementRef;

    slicerBorderWidth: number = 1;          // In px, to subtract from inner element Width
    slicerItemClicked: boolean = false;     // True if Item was clicked -> dont click others

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {}

    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Extract BorderWidth - to subtract from inner elements Width
        let px: number = this.slicer.containerBorder.indexOf('px');
        if (px > 0) {
            let space: number = 0;
            if (px > 5) {
                space = this.slicer.containerBorder.indexOf(' ');
            };
            if (space >= 0  &&  space < px) {
                this.slicerBorderWidth = +this.slicer.containerBorder.substring(space, px); 
            };
        };
        this.slicerBorderWidth = this.slicerBorderWidth * 2;
    }

    clickSlicer() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicer', '@Start');

        // Item handles things
        if (this.slicerItemClicked) {
            this.slicerItemClicked = false;
            return;
        };
    }

    clickSlicerItem(
        slicerType: string,
        index: number,
        id: number,
        datasourceID: number,
        fieldValue: string,
        ev: any
        ) {
        // Clicked a Slicer item - now filter the data, and then update related Ws
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerItem', '@Start');

        // Indicate the Item was clicked
        this.slicerItemClicked = true;

        // Update Sl
        if (slicerType === 'Bins') {
            this.slicer.slicerBins.forEach(sel => {
                if (sel.name === fieldValue) {
                    sel.isSelected = !sel.isSelected;
                };
            });
        };
        if (slicerType === 'List') {
            this.slicer.slicerSelection.forEach(sel => {
                if (sel.fieldValue === fieldValue) {
                    sel.isSelected = !sel.isSelected;
                };
            });
        };

        if (slicerType === 'TheRest') {
            this.slicer.slicerAddRestValue = ev.target.checked;
            this.globalVariableService.currentWidgets.forEach(w => {
                if (w.id === id) {
                    w.slicerAddRestValue = ev.target.checked;
                };
            });
        };

        // Adjust the global Sl selection, for next time
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.id === id) {

                // Update the selected item
                w.slicerSelection.forEach(sel => {
                    if (sel.fieldValue === fieldValue) {
                        sel.isSelected = ev.target.checked;
                    };
                });

            };
        });

        // Adjust the current Slicer
        this.slicer.slicerSelection.forEach(sel => {
            if (sel.fieldValue === fieldValue) {
                sel.isSelected = ev.target.checked;
            }
        })

        // Refresh Ws that are related to Sl
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.datasourceID === datasourceID
                && w.widgetType != 'Slicer') {

                    this.globalVariableService.changedWidget.next(w);
            };
        });
    }

}