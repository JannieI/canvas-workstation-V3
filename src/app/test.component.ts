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

@Component({
    selector: 'widget',
    template: `
      <div class="test" 
        [style.background-color]="widget.containerBackgroundColor"
        [style.border]="widget.isSelected? '2px solid red' : widget.containerBorder"
        [style.box-shadow]="widget.containerBoxshadow"
        [style.height.px]="widget.containerHeight"
        [style.left.px]="widget.containerLeft"
        [style.top.px]="widget.containerTop"
        [style.width.px]="widget.containerWidth"
        [style.zindex]="widget.containerZindex"
        (click)="alert()"
        #widgetDOM
        >
      </div>
    `,
    styleUrls: ['./test.component.css']
})
export class WidgetComponent {
    @Input() widget: Widget;
    @Input() odd: boolean;
    @Input() even: boolean;
    @Input() first: boolean;
    @Input() last: boolean;
    @ViewChild('widgetDOM') widgetDOM;

    constructor(
        private globalFunctionService: GlobalFunctionService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }
    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }
    ngAfterViewInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
        console.log('TEST ngAfterViewInit', this.widget, this.widgetDOM)
        this.refreshWidgets();
    }
    alert() {
      console.log("widget alert @start", this.widget.datasourceID);
      this.widget.widgetType = "Changed!";
      this.widget.containerLeft = 20;
    }

    refreshWidgets() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidgets', '@Start');

        console.log('TEST refreshWidgets start', this.widgetDOM)
        let definition = this.createVegaLiteSpec(
            this.widget.graphDescription,
            this.widget.graphMark,

            this.widget.graphXaggregate,
            this.widget.graphXtimeUnit,
            this.widget.graphXfield,
            this.widget.graphXtype,
            this.widget.graphXaxisTitle,

            this.widget.graphYaggregate,
            this.widget.graphYtimeUnit,
            this.widget.graphYfield,
            this.widget.graphYtype,
            this.widget.graphYaxisTitle,
            
            this.widget.graphUrl,
            this.widget.graphTitle,
            this.widget.graphColorField,
            this.widget.graphColorType,
        );
        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .initialize( this.widgetDOM.nativeElement)
            .width(180)
            .hover()
            .run()
            .finalize();
        console.log('TEST refreshWidgets end')
    }


    createVegaLiteSpec(
        graphDescription: string = '',
        graphMark: string = '',

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