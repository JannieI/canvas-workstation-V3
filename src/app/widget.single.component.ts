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
    selector: 'widget-single',
    templateUrl: './widget.single.component.html',
    styleUrls: ['./widget.single.component.css']
})
export class WidgetSingleComponent {
    @Input() widget: Widget;
    @Input() showDataQuality: boolean;
    @Input() showComments: boolean;

    @ViewChild('graphDOM')  graphDOM: ElementRef;

    editMode: boolean;
    endWidgetNumber: number;
    isBusyResizing: boolean = false;
    refreshGraphs: boolean = false;
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

    }
    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        // Runs after the View has been initialised.  This is needed to refresh the graphs
        // in the app component.
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

        if (!this.refreshGraphs) {
            this.refreshGraphs = true;
            this.refreshWidget(null, 'wsingle ngAfterViewChecked');
        }
    }

    clickWidgetContainer(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainer', '@Start');

        console.log("widget clickWidgetContainer @start", this.widget.datasourceID);

        if (!this.editMode) {
            this.globalVariableService.statusBarMessage.next(
             {
                message: 'Not in Edit Mode (see Edit menu Option)',
                uiArea: 'StatusBar',
                classfication: 'Warning',
                timeout: 3000,
                defaultMessage: ''
             }
            )
            return;
        }
        this.globalVariableService.statusBarMessage.next(null);


        this.widget.isSelected = !this.widget.isSelected;

        // If now selected, add to the global selected list - if not already there
        let pos: number = this.globalVariableService.selectedWidgetIDs.indexOf(this.widget.id);
        if (this.widget.isSelected) {
            if (pos < 0) {
                this.globalVariableService.selectedWidgetIDs.push(this.widget.id);
            }
        } else {
            if (pos >= 0) {
                this.globalVariableService.selectedWidgetIDs.splice(pos,1);
            }
        }

    }

    refreshWidget(w: Widget, callingRoutine: string) {
        // Refreshes this W
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidget', '@Start');

        console.log('xx refreshWidget from this.widget', callingRoutine, this.widget.id, this.widget.graphXfield, this.widget.graphYfield)
        if (w != null) {
            this.widget = w;
            console.log('xx refreshWidget w', w.id, w.graphXfield, w.graphYfield)
        }

        if (this.widget.visualGrammar == 'Vega-Lite') {

            // Use the spec inside the Widget, or the properties
            let definition: any = null;
            if (this.widget.graphSpecification != ''  &&
                this.widget.graphSpecification != null) {
                    definition = this.widget.graphSpecification;

                    // TODO - fix this, as datalib reads children as object object ...
                    definition = definition.replace(/@/g,'"');
                    // "data": {"url": "../assets/vega-datasets/cars.json"},

                    definition = {
                        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                        "description": "Shows the relationship between horsepower and the numbver of cylinders using tick marks.",
                        "data": {"url": "../assets/vega-datasets/cars.json"},
                        "mark": "tick",
                        "encoding": {
                        "x": {"field": "Horsepower", "type": "quantitative"},
                        "y": {"field": "Cylinders", "type": "ordinal"}
                        }
                    }

                    definition = {
                        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                        "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
                        "data": { "url": "../assets/vega-datasets/population.json"},
                        "transform": [
                        {"filter": "datum.year == 2000"},
                        {"calculate": "datum.sex == 2 ? 'Female' : 'Male'", "as": "gender"}
                        ],
                        "mark": "bar",
                        "encoding": {
                        "x": {
                            "field": "age", "type": "ordinal",
                            "scale": {"rangeStep": 17}
                        },
                        "y": {
                            "aggregate": "sum", "field": "people", "type": "quantitative",
                            "axis": {"title": "population"},
                            "stack": null
                        },
                        "color": {
                            "field": "gender", "type": "nominal",
                            "scale": {"range": ["#e377c2","#1f77b4"]}
                        },
                        "opacity": {"value": 0.7}
                        }
                    }

                    definition = {
                        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                        "data": { "url": "../assets/vega-datasets/github.csv"},
                        "mark": "circle",
                        "encoding": {
                        "y": {
                            "field": "time",
                            "type": "ordinal",
                            "timeUnit": "day"
                        },
                        "x": {
                            "field": "time",
                            "type": "ordinal",
                            "timeUnit": "hours"
                        },
                        "size": {
                            "field": "count",
                            "type": "quantitative",
                            "aggregate": "sum"
                        }
                        }
                    }

                    console.log('definition', definition)
            } else {
                definition = this.globalVariableService.createVegaLiteSpec(this.widget);
            }
            let specification = compile(definition).spec;
            let view = new View(parse(specification));
            // Note: not .width and .heigth here as we use W.graphWidth parsed into definition
            view.renderer('svg')
                .initialize(this.graphDOM.nativeElement)
                .hover()
                .run()
                .finalize();
            console.log('TEST refreshWidget render done', specification)
        } else {
            alert('The visualGrammar of widget is not == Vega-Lite' )
        };
        console.log('TEST refreshWidget end')
    }




    clickWidgetContainerDragEnd(ev: MouseEvent, index: number) {
        // Move the W container at the end of the drag event
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragEnd', '@Start');

        if (!this.editMode) {
            return;
        }

        // Is busy with resizing, ignore this
        if (this.isBusyResizing) {

            // Done with resizing
            this.isBusyResizing = false;
            return;
        };

        // Reset current and globalVar values
        this.widget.containerLeft =
            this.widget.containerLeft - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].containerLeft =
            this.widget.containerLeft;

        this.widget.containerTop =
            this.widget.containerTop - this.startY + ev.y;
        this.globalVariableService.currentWidgets[index].containerTop =
            this.widget.containerTop;

    }

    showWidgetForSlicer(id: number, datasourceID: number, datasetID: number) {
        // Returns True if a Widget is related to the selected Sl(s)
        // TODO - put back, but this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'showWidgetForSlicer', '@Start');

        // Get list of selected Sl
        let result: boolean = false;
        this.globalVariableService.currentWidgets.forEach(sl => {
            if (sl.isSelected  &&  sl.widgetType == 'Slicer') {
                if (sl.datasourceID == datasourceID  &&  sl.datasetID == datasetID) {
                    result = true;
                };
            };
        });

        return result;
    }

    clickSingleWidget(index: number, id: number) {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSingleWidget', '@Start');

        // // TODO - fix index..
        // this.currentWidgets[index].isSelected = !this.currentWidgets[index].isSelected;
        // this.globalVariableService.currentWidgets.forEach(w => {
        //     if (w.id == id) {
        //         w.isSelected = this.currentWidgets[index].isSelected;
        //     };
        // });

    }
}