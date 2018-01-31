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
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// Own Services

// Own Components

// Constants
const vlTemplate: dl.spec.TopLevelExtendedSpec =
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

    // Properties for top-level specification (e.g., standalone single view specifications)
    "background": "",
    "padding": "",
    "height": "100",
    "width": "100",
    // "autosize": "",          NB - add these only if needed, blank causes no graph display
    // "config": "",            NB - add these only if needed, blank causes no graph display

    // Properties for any specifications
    "title":
        {
            "text": "",
            "anchor": "",
            "offset": "",
            "orient": "",
            "style": ""
        },
    "name": "",
    "transform": "",

    "description": "",
    "data": "",
    "mark":
        {
            "type": "",  //bar circle square tick line area point rule text
            "style": "",
            "clip": "",
            "color": "#4682b4"
        },
    "encoding":
        {
            "x":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "ordinal",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                    {
                        "title": ""
                    },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                },
            "y":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "quantitative",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                        {
                            "title": ""
                        },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                    }
        }
};

@Component({
    selector: 'widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
    @Input() widgets: Widget[];
    @Input() showDataQuality: boolean;
    @Input() showComments: boolean;

    @ViewChildren('widgetDOM')  widgetDOM: QueryList<ElementRef>;
    @ViewChildren('widgetContainerDOM')  widgetContainerDOM: QueryList<ElementRef>;

    editMode: boolean;
    startX: number;
    startY: number;
    startWidgetNumber: number;
    endWidgetNumber: number;
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

        this.globalVariableService.editMode.subscribe(i => 
            {
                this.editMode = i;
            }
        );

    }
    ngAfterViewInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    clickWidgetContainer(index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainer', '@Start');

        console.log("widget clickWidgetContainer @start", this.widgets[0].datasourceID);

        if (!this.editMode) {
            this.globalVariableService.statusBarMessage.next(
             {
                message: 'Not in Edit Mode',
                uiArea: 'StatusBar',
                classfication: 'Warning',
                timeout: 3000,
                defaultMessage: ''
             }
            )
            return;
        }
        this.globalVariableService.statusBarMessage.next(null);


        this.widgets[index].isSelected = !this.widgets[index].isSelected;

        // If now selected, add to the global selected list - if not already there
        let pos: number = this.globalVariableService.selectedWidgetIDs.indexOf(this.widgets[index].id);
        if (this.widgets[index].isSelected) {
            if (pos < 0) {
                this.globalVariableService.selectedWidgetIDs.push(this.widgets[index].id);
            }
        } else {
            if (pos >= 0) {
                this.globalVariableService.selectedWidgetIDs.splice(pos,1);
            }
        }
        
    }

    clickWidget(index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        console.log("widget clickWidget @start", this.widgets[0].datasourceID);

        if (!this.editMode) {
            return;
        }

    }
      
    refreshWidgets(start: number = -1, end: number = -1) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidgets', '@Start');
        
        this.startWidgetNumber = 0;
        this.endWidgetNumber = this.widgetContainerDOM.length;
        if (start > -1) { 
            this.startWidgetNumber = start;
            if (end > start) { 
                this.endWidgetNumber = end;
            } else {
                this.endWidgetNumber = start + 1;
            }
        }

        for (var i = this.startWidgetNumber; i < this.endWidgetNumber; i++) {
            console.log('TEST refreshWidgets start', this.widgetContainerDOM.toArray(), 
                this.widgetDOM, this.widgetDOM.length, this.widgets)

            // String of IF statements that caters for different visualGrammars
            if (this.widgets[i].visualGrammar == 'Vega-Lite') {

                console.log('this.widgets[i].graphSpecification', this.widgets[i].graphSpecification)
                // Use the spec inside the Widget, or the properties
                let definition: any = null;
                if (this.widgets[i].graphSpecification != ''  &&   
                    this.widgets[i].graphSpecification != null) {
                        definition = this.widgets[i].graphSpecification;

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
                    definition = this.createVegaLiteSpec(
                        this.widgets[i].graphDescription,
                        this.widgets[i].graphMark,
                        this.widgets[i].graphMarkColor,
                        this.widgets[i].graphXaggregate,
                        this.widgets[i].graphXtimeUnit,
                        this.widgets[i].graphXfield,
                        this.widgets[i].graphXtype,
                        this.widgets[i].graphXaxisTitle,

                        this.widgets[i].graphYaggregate,
                        this.widgets[i].graphYtimeUnit,
                        this.widgets[i].graphYfield,
                        this.widgets[i].graphYtype,
                        this.widgets[i].graphYaxisTitle,

                        this.widgets[i].graphHeight,
                        this.widgets[i].graphWidth,

                        this.widgets[i].graphUrl,
                        this.widgets[i].graphTitle,
                        this.widgets[i].graphColorField,
                        this.widgets[i].graphColorType,
                    );
                }
                let specification = compile(definition).spec;
                let view = new View(parse(specification));
                view.renderer('svg')
                    .initialize( this.widgetDOM.toArray()[i].nativeElement)
                    .hover()
                    .run()
                    .finalize();
                console.log('TEST refreshWidgets render done', specification)
            } else { 
                alert('The visualGrammar of widget ' + i.toString() + ' is not == Vega-Lite' )
            };
            
        }
        console.log('TEST refreshWidgets end')
    }

    createVegaLiteSpec(
        graphDescription: string = '',
        graphMark: string = '',
        graphMarkColor: string = '',

        graphXaggregate: string = '',
        graphXtimeUnit: string = '',
        graphXfield: string = '',
        graphXtype: string = '',
        graphXaxisTitle: string = '',

        graphYaggregate: string = '',
        graphYtimeUnit: string = '',
        graphYfield: string = '',
        graphYtype: string = '',
        graphYaxisTitle: string = '',

        graphHeight: number = 100,
        graphWidth: number = 100,
        
        graphUrl: string = '',
        graphTitle: string = '',
        graphColorField: string = '',
        graphColorType: string = ''
        ): dl.spec.TopLevelExtendedSpec {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'createVegaLiteSpec', '@Start');

        // Exclude nulls, as dl lib reads "" as null
        if (graphDescription == null) { graphDescription = ''};
        if (graphMark == null) { graphMark = ''};
        if (graphMarkColor == null) { graphMarkColor = ''};
        if (graphXfield == null) { graphXfield = ''};
        if (graphYfield == null) { graphYfield = ''};
        if (graphTitle == null) { graphTitle = ''};
        if (graphXtype == null) { graphXtype = ''};
        if (graphYtype == null) { graphYtype = ''};
        if (graphUrl == null) { graphUrl = ''};
        if (graphXtimeUnit == null) { graphXtimeUnit = ''};
        if (graphXaggregate == null) { graphXaggregate = ''};
        if (graphYtimeUnit == null) { graphYtimeUnit = ''};
        if (graphYaggregate == null) { graphYaggregate = ''};
        if (graphColorField == null) { graphColorField = ''};
        if (graphColorType == null) { graphColorType = ''};

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = vlTemplate;
        vlSpecsNew['data'] = {"url": graphUrl};
        vlSpecsNew['description'] = graphDescription;
        vlSpecsNew['mark']['type'] = graphMark;
        vlSpecsNew['mark']['color'] = graphMarkColor;

        vlSpecsNew['encoding']['x']['field'] = graphXfield;
        vlSpecsNew['encoding']['x']['type'] = graphXtype;
        vlSpecsNew['encoding']['x']['axis']['title'] = graphXaxisTitle;
        vlSpecsNew['encoding']['x']['timeUnit'] = graphXtimeUnit;
        vlSpecsNew['encoding']['x']['aggregate'] = graphXaggregate;

        vlSpecsNew['encoding']['y']['field'] = graphYfield;
        vlSpecsNew['encoding']['y']['type'] = graphYtype;
        vlSpecsNew['encoding']['y']['axis']['title'] = graphYaxisTitle;
        vlSpecsNew['encoding']['y']['timeUnit'] = graphYtimeUnit;
        vlSpecsNew['encoding']['y']['aggregate'] = graphYaggregate;

        vlSpecsNew['height'] = graphHeight;
        vlSpecsNew['width'] = graphWidth;

        vlSpecsNew['title']['text'] = graphTitle;

        if (graphColorField != ''  && graphColorField != null) {
            vlSpecsNew['encoding']['color'] = {
                "field": graphColorField,
                "type": graphColorType
              }
        }
        return vlSpecsNew;
    }

    clickResizeDown(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeDown', '@Start');

        if (!this.editMode) {
            return;
        }

        console.log('clickResizeDown', this.widgets[index].containerLeft, ev);
        this.startX = ev.x;
        this.startY = ev.y;

    }

    clickResizeUp(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeUp', '@Start');

        console.log('clickResizeUp starts index', index, this.widgetContainerDOM)

        if (!this.editMode) {
            return;
        }

        // Reset current and globalVar values
        this.widgets[index].containerWidth =
            this.widgets[index].containerWidth - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].containerWidth =
            this.widgets[index].containerWidth;

        this.widgets[index].graphWidth =
            this.widgets[index].graphWidth - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].graphWidth =
            this.widgets[index].graphWidth;

        this.refreshWidgets(index)

        // console.log('clickResizeUp this.globalVariableService.widgets[index].value',
        //     index, this.globalVariableService.widgets.value[index])

        this.widgets[index].nrButtonsToShow =
            (this.widgets[index].containerWidth - 50) / 22;

        console.log('clickResizeUp width buttons ev x-move',
            this.widgets[index].containerWidth, this.widgets[index].nrButtonsToShow,
            ev, 0 - this.startX + ev.x);
    }

    clickWidgetContainerDragStart(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragStart', '@Start');

        if (!this.editMode) {
            return;
        }

        console.log('clickWidgetContainerDragStart starts index', index, this.widgetContainerDOM)
        this.startX = ev.x;
        this.startY = ev.y;
    }


    clickWidgetContainerDragEnd(ev: MouseEvent, index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetContainerDragEnd', '@Start');

        if (!this.editMode) {
            return;
        }

        console.log('clickWidgetContainerDragEnd starts index', index, this.startX, ev.x)

        // Reset current and globalVar values
        this.widgets[index].containerLeft =
            this.widgets[index].containerLeft - this.startX + ev.x;
        this.globalVariableService.currentWidgets[index].containerLeft =
            this.widgets[index].containerLeft;

        this.widgets[index].containerTop =
            this.widgets[index].containerTop - this.startY + ev.y;
        this.globalVariableService.currentWidgets[index].containerTop =
            this.widgets[index].containerTop;

    }
} 