/*
 * Manage a single Graph component
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

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

// Own Services

// Own Components


@Component({
    selector: 'widget-single',
    templateUrl: './widget.single.component.html',
    styleUrls: ['./widget.single.component.css']
})
export class WidgetSingleComponent {
    @Input() widget: Widget;

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
        // After View Init
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

    refreshWidget(w: Widget, callingRoutine: string) {
        // Refreshes this W
        // NOTE: the should not be called indivdually from another routine - let the ngFor loop
        //       do the work.  Else the incorrect W will be refreshed
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidget', '@Start');

        console.warn('xx refreshWidget start- calling, this.widget, w, selectedWidget: ',
            callingRoutine, this.widget!=null? this.widget.id : 'this.widget = null',
            w!=null? w.id : 'w = null')
        if (w != null) {
            this.widget = w;
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
                definition = this.globalVariableService.createVegaLiteSpec(
                    this.widget,
                    this.widget.graphHeight,
                    this.widget.graphWidth
                );
            };
            
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