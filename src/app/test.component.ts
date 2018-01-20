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


const testWidgets: Widget[] =
[
    {
        "widgetType": "Graph",
        "widgetSubType": "",
    
        "isTrashed": false,
        "dashboardID": 1,
        "dashboardTabID": 1,
        "dashboardTabName": "",
        "id": 1,
        "name": "barchart for start",
        "description": "bla-bla-bla",
        "visualGrammar": "",
        "version": 1,
        "isSelected": false,
        "isLiked": false,
        "hasDataQualityIssues": true,
        "hasComments": true,
        "nrButtonsToShow": 3,
        "hyperlinkDashboardID": 1,
        "hyperlinkDashboardTabID": 1,
            
        "datasourceID": 1,
        "datasetID": 1,
        "dataParameters":
        [
            {
                "field": "",
                "value": ""
            }
        ],
        "reportID": 1,
        "reportName": "",
        "rowLimit": 1,
        "addRestRow": false,
        "size": "",
        "containerBackgroundcolor": "transparent",
        "containerBorder": "2px solid black",
        "containerBoxshadow": "2px 2px gray",
        "containerColor": "transparent",
        "containerFontsize": 12,
        "containerHeight": 320,
        "containerLeft": 50,
        "containerWidgetTitle": "Title 1",
        "containerTop": 240,      
        "containerWidth": 250,
        "containerZindex": 50,
        "titleText": "",
        "titleBackgroundColor": "#192b35",
        "titleBorder": "",
        "titleColor": "",
        "titleFontsize": 1,
        "titleFontWeight": "",
        "titleHeight": 1,
        "titleLeft": 1,
        "titleMargin": "",
        "titlePadding": "",
        "titlePosition": "",
        "titleTextAlign": "",
        "titleTop": 1,
        "titleWidth": 1,
        "graphType": "",
        "graphHeight": 1,
        "graphLeft": 1,
        "graphTop": 1,
        "graphWidth": 1,
        "graphGraphPadding": 1,
        "graphHasSignals": false,
        "graphXcolumn": "",
        "graphYcolumn": "",
        "graphFillColor": "",
        "graphHoverColor": "",
        "graphSpecification": {
            "data": {"url": "../assets/vega-datasets/cars.json"},
            "mark": "point",
            "encoding": {
                "x": {"field": "Horsepower", "type": "quantitative"},
                "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
            }
        },
        "graphDescription": "",
        "graphXaggregate": "",
        "graphXtimeUnit": "",
        "graphXfield": "Horsepower",
        "graphXtype": "quantitative",
        "graphYaggregate": "",
        "graphYtimeUnit": "",
        "graphYfield": "Miles_per_Gallon",
        "graphYtype": "quantitative",
        "graphTitle": "graphTitle",
        "graphMark": "bar",
        "graphUrl": "../assets/vega-datasets/cars.json",
        "graphColorField": "",
        "graphColorType": "",
        "graphData": "",
        "tableColor": "",
        "tableCols": 1,
        "tableHeight": 1,
        "tableHideHeader": false,
        "tableLeft": 1,
        "tableRows": 1,
        "tableTop": 1,
        "tableWidth": 1,
        "shapeCx": "",
        "shapeCy": "",
        "shapeR": "",
        "shapeStroke": "",
        "shapeStrokeWidth": "",
        "shapeFill": "",
        "refreshMode": "",
        "refreshFrequency": 1,
        "widgetRefreshedOn": "",
        "widgetRefreshedBy": "",
        "widgetCreatedOn": "",
        "widgetCreatedBy": "",
        "widgetUpdatedOn": "",
        "widgetUpdatedBy": ""
    }
]

@Component({
    styleUrls: ['./test.component.css'],
    templateUrl: './test.component.html'
})

export class TestComponent {

    @ViewChildren('widgetContainter')  widgetContainters: QueryList<ElementRef>;
    @ViewChildren('widget')            childrenWidgets: QueryList<ElementRef>;

    widgets: Widget[] = [];
    startX: number;
    startY: number;
    showSlicerContainer: boolean = false;
    slicerHeight: number = 178;
    slicerWidth: number = 160;
    slicerButtons: number = 5;
    selectedSlicers: number[] = []

    test:boolean = false;
    currentWidgets: Widget[] = []; //testWidgets;

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

        console.log('Explore ngOnInit ...', this.globalVariableService.refreshDashboard.value)

        console.log('Remove this - only for TESTing !!')
        this.globalVariableService.currentDashboardID = 1;
        this.globalVariableService.currentDashboardTabID = 1;

        

        // Load global variables
        this.globalVariableService.refreshDashboard.subscribe(i => 
            {
                console.log ('Explore ngOnInit refreshDashboard start ...', 
                    this.childrenWidgets, 
                    this.globalVariableService.currentDashboardID,
                    this.globalVariableService.currentDashboardTabID)
                if (i) {
                    console.log ('Explore ngOnInit refreshDashboard refreshing ...', 
                    this.childrenWidgets, 
                    this.globalVariableService.currentDashboardID,
                    this.globalVariableService.currentDashboardTabID)
                    // Refresh D and related info
                    this.globalVariableService.refreshCurrentDashboardInfo(
                        this.globalVariableService.currentDashboardID,
                        this.globalVariableService.currentDashboardTabID).then (i => 
                            {
                                this.currentWidgets = this.globalVariableService.testWidgets;
                                console.log('The big moment ...', this.childrenWidgets, 
                                this.childrenWidgets.toArray(), 
                                this.globalVariableService.refreshDashboard.value, 
                                this.currentWidgets)
                                // this.ngAfterViewInit();
                                this.refreshWidgets();
                                // Add to Recently used
                                this.globalVariableService.addDashboardRecent(
                                    this.globalVariableService.currentDashboardID
                                )
                                this.globalVariableService.refreshDashboard.next(false);
                                
                            } );

                };
            }
        );



    }

    ngAfterViewInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        console.log('Explore ngAfterViewInit ...', this.globalVariableService.refreshDashboard.value, 
        this.childrenWidgets.toArray(),
        this.widgetContainters.toArray(), this.currentWidgets)
        // this.refreshWidgets();
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

        console.log('Explore refreshWidgets ...START children', this.childrenWidgets.toArray(),
            this.widgetContainters.toArray(), this.currentWidgets.length)
        for (var i: number = 0; i < this.childrenWidgets.toArray().length; i++) {
            if (this.currentWidgets[i] != undefined) {
                console.log('Explore refreshWidgets' ,i,                     this.currentWidgets[i].graphDescription,
                this.currentWidgets[i].graphMark,
                this.currentWidgets[i].graphXfield,
                this.currentWidgets[i].graphYfield,
                this.currentWidgets[i].graphTitle,
                this.currentWidgets[i].graphXtype,
                this.currentWidgets[i].graphYtype,
                this.currentWidgets[i].graphUrl,
                this.currentWidgets[i].graphXtimeUnit,
                this.currentWidgets[i].graphXaggregate,
                this.currentWidgets[i].graphYtimeUnit,
                this.currentWidgets[i].graphYaggregate,
                this.currentWidgets[i].graphColorField,
                this.currentWidgets[i].graphColorType)

                let definition = this.createVegaLiteSpec(
                    this.currentWidgets[i].graphDescription,
                    this.currentWidgets[i].graphMark,
                    this.currentWidgets[i].graphXfield,
                    this.currentWidgets[i].graphYfield,
                    this.currentWidgets[i].graphTitle,
                    this.currentWidgets[i].graphXtype,
                    this.currentWidgets[i].graphYtype,
                    this.currentWidgets[i].graphUrl,
                    this.currentWidgets[i].graphXtimeUnit,
                    this.currentWidgets[i].graphXaggregate,
                    this.currentWidgets[i].graphYtimeUnit,
                    this.currentWidgets[i].graphYaggregate,
                    this.currentWidgets[i].graphColorField,
                    this.currentWidgets[i].graphColorType,
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


@Component({
    selector: 'tab',
    template: `
      <p>{{title}}</p>
    `,
  })
  export class TabComponent {
    @Input() title;
  }
  
  @Component({
    selector: 'tabs',
    template: `
      <ng-content></ng-content>
    `,
  })
  export class TabsComponent {
   @ContentChildren(TabComponent) tabs: QueryList<TabComponent>
   
   ngAfterContentInit() {
     this.tabs.forEach(tabInstance => console.log(tabInstance))
   }
  }