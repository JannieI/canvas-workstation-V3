/*
 * Dashboard
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
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
            "clip": ""
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
    styleUrls: ['./test.component.css'],
    templateUrl: './test.component.html'
})

export class TestComponent {

    @ViewChildren('widgetContainter')  widgetContainters: QueryList<ElementRef>;
    @ViewChildren('widget')            childrenWidgets: QueryList<ElementRef>;
    @ViewChildren('shapeContainter')   shapeContainter: QueryList<ElementRef>;
    @ViewChildren('circle2')            circle2: QueryList<ElementRef>;

    widgets: Widget[] = [];
    startX: number;
    startY: number;
    showSlicerContainer: boolean = false;
    slicerHeight: number = 178;
    slicerWidth: number = 160;
    slicerButtons: number = 5;
    selectedSlicers: number[] = []

    test:boolean = false;

    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private renderer2: Renderer2,
    ) {}

    ngOnInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        console.log('Explore ngOnInit ...', this.globalVariableService.openDashboardFormOnStartup)

        // Load global variables
        this.globalVariableService.refreshDashboard.subscribe(i => 
            {
                console.log ('Explore ngOnInit refreshDashboard ...', 
                    this.globalVariableService.currentDashboardID,
                    this.globalVariableService.currentDashboardTabID)
                if (i) {
                    // Add to Recently used
                    this.globalVariableService.addDashboardRecent(
                        this.globalVariableService.currentDashboardID
                    )
                    // Refresh D and related info
                    this.refreshDashboardInfo(
                        this.globalVariableService.currentDashboardID,
                        this.globalVariableService.currentDashboardTabID);
                    this.globalVariableService.refreshDashboard.next(false);

                };
            }
        );

    }

    refreshDashboardInfo(dashboardID: number, dashboardTabID: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshDashboardInfo', '@Start');

        if (dashboardTabID < 1) { dashboardTabID = 1};

        this.globalVariableService.refreshCurrentDashboardInfo(1, dashboardTabID).then (i => 
            {
                console.log('The big moment ...')
                this.widgets = this.globalVariableService.testWidgets;
                this.refreshWidgets();
            } );
    }

    refreshWidgets() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidgets', '@Start');

        console.log('Explore refreshWidgets ...START children.length', this.childrenWidgets.toArray(),
            this.widgetContainters.toArray(), this.widgets)
        for (var i: number = 0; i < this.childrenWidgets.toArray().length; i++) {
            if (this.widgets[i] != undefined) {
                console.log('Explore refreshWidgets' ,i)
                let definition = this.createVegaLiteSpec(
                    this.widgets[i].graphDescription,
                    this.widgets[i].graphMark,
                    this.widgets[i].graphXfield,
                    this.widgets[i].graphYfield,
                    this.widgets[i].graphTitle,
                    this.widgets[i].graphXtype,
                    this.widgets[i].graphYtype,
                    this.widgets[i].graphUrl,
                    this.widgets[i].graphXtimeUnit,
                    this.widgets[i].graphXaggregate,
                    this.widgets[i].graphYtimeUnit,
                    this.widgets[i].graphYaggregate,
                    this.widgets[i].graphColorField,
                    this.widgets[i].graphColorType,
                );
                let specification = compile(definition).spec;
                console.log('Explore refreshWidgets ... specification', specification)
                // console.log('Explore refreshWidgets spec 2', specification)
                let view = new View(parse(specification));
                view.renderer('svg')
                    .initialize( this.childrenWidgets.toArray()[i].nativeElement)
                    .width(180)
                    .hover()
                    .run()
                    .finalize();
                // console.log('Explore refreshWidgets refreshWidgets loop end')
            } else {
                console.log('this.currentWidgets[i] is UNDEFINED' + i)
            }
        }
    }

    createVegaLiteSpec(
        graphDescription: string = '',
        graphMark: string = '',
        graphXfield: string = '',
        graphYfield: string = '',
        graphTitle: string = '',
        graphXtype: string = '',
        graphYtype: string = '',
        graphUrl: string = '',
        graphXtimeUnit: string = '',
        graphXaggregate: string = '',
        graphYtimeUnit: string = '',
        graphYaggregate: string = '',
        graphColorField: string = '',
        graphColorType: string = ''
        ): dl.spec.TopLevelExtendedSpec {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'createVegaLiteSpec', '@Start');

        // Exclude nulls, as dl lib reads "" as null
        if (graphDescription == null) { graphDescription = ''};
        if (graphMark == null) { graphMark = ''};
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

        vlSpecsNew['encoding']['x']['field'] = graphXfield;
        vlSpecsNew['encoding']['x']['type'] = graphXtype;
        vlSpecsNew['encoding']['x']['axis']['title'] = 'x-axis';
        vlSpecsNew['encoding']['x']['timeUnit'] = graphXtimeUnit;
        vlSpecsNew['encoding']['x']['aggregate'] = graphXaggregate;

        vlSpecsNew['encoding']['y']['field'] = graphYfield;
        vlSpecsNew['encoding']['y']['type'] = graphYtype;
        vlSpecsNew['encoding']['y']['axis']['title'] = 'y-axis';
        vlSpecsNew['encoding']['y']['timeUnit'] = graphYtimeUnit;
        vlSpecsNew['encoding']['y']['aggregate'] = graphYaggregate;

        vlSpecsNew['title']['text'] = graphTitle;

        if (graphColorField != ''  && graphColorField != null) {
            vlSpecsNew['encoding']['color'] = {
                "field": graphColorField,
                "type": graphColorType
              }
        }
        return vlSpecsNew;
    }

}