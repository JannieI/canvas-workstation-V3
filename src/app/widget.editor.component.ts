// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

import { compile }                    from 'vega-lite';

import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';

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
    "data": 
        {
            "values": ""
        },
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
} 


@Component({
    selector: 'widget-editor',
    templateUrl: './widget.editor.component.html',
    styleUrls: ['./widget.editor.component.css']
  })
  export class WidgetEditorComponent implements OnInit {
  
    @Input() currentWidgetSpec: any;
    @ViewChild('visReal', {read: ElementRef}) visReal: ElementRef;  //Vega graph
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    
    @Output() formWidgetEditorClosed: EventEmitter<string> = new EventEmitter();
    
    constructor(
        private globalFunctionService: GlobalFunctionService,
        private renderer: Renderer,
        private router: Router
    ) {}
 
    ngOnInit() {

    }

    ngAfterViewInit() {

        let definition = this.createVegaLiteSpec(undefined,'bar',undefined,undefined,undefined);
        console.log('definition 2', definition)

        let specification = compile(definition).spec;

        let view = new View(parse(specification));
        
        view.renderer('svg')
            // .width(500)
            // .height(500)
            .initialize(this.visReal.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");
        
    }
	clickClose(action: string) {
		this.formWidgetEditorClosed.emit(action);
    }
    
    createVegaLiteSpec(
        description: string = 'First bar chart.',
        mark: string = 'bar',
        xfield: string = 'Month',
        yfield: string = 'Trades',
        title: string = 'Average Trading'): dl.spec.TopLevelExtendedSpec {

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = vlTemplate;
    
        vlSpecsNew['data']['values'] = [
            {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55}, 
            {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91}, 
            {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
            {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87}, 
            {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
            {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        ];
        vlSpecsNew['description'] = description;
        vlSpecsNew['mark']['type'] = mark;
        vlSpecsNew['encoding']['x']['field'] = xfield;
        vlSpecsNew['encoding']['y']['field'] = yfield;
        vlSpecsNew['title']['text'] = title;
        console.log('createVegaLiteSpec', vlSpecsNew)

        return vlSpecsNew;

    }

  }