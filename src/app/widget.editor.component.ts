// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile, transform }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';

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
    "data": null,
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
    selector: 'widget-editor',
    templateUrl: './widget.editor.component.html',
    styleUrls: ['./widget.editor.component.css']
  })
  export class WidgetEditorComponent implements OnInit {

    @Output() formWidgetEditorClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    rowField: string = 'Drag a field here ...';
    colField: string = 'Drag a field here ...';
    graphColorField: string = 'Drag a field here ...';
    graphCols: string[];
    graphRows: string[];
    graphColor: string[];

    clickedButtonAggregateNo: boolean = false;
    currentDatasource: Datasource = null;
    currentDatasources: Datasource[];
    dataFieldNames: string[];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColor: boolean = false;
    filterPivotFields: string = '';
    opened: boolean = true;
    presentationMode: boolean;
    showRowFieldAdvanced: boolean = false;
    showColFieldAdvanced: boolean = false;
    showColFieldAdvancedArea: boolean = false;
    showRowFieldAdvancedArea: boolean = false;
    showType: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        let x: number = 0;
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {
                x = w.datasourceID;
            }
        });
        // TODO - handle properly and close form
        if (x == 0) {
            alert('No Widget was selected, or could not find it in glob vars')
        };

        this.currentDatasources = this.globalVariableService.currentDatasources;
        this.globalVariableService.currentDatasources.forEach(ds => {
            if (ds.id == x) {
                this.currentDatasource = ds;
            };
        });
        // TODO - handle properly and close form
        if (this.currentDatasource == null) {
            alert('Datasource not found in global currentDatasources')
        };

        // TODO - remove this, currently datalib reads array as string a,b,c
        let y: string = this.currentDatasource.dataFields.toString();
        this.dataFieldNames = y.split(',');
        
        console.log('xx ds', this.currentDatasource, this.dataFieldNames);

        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
    }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        let definition = this.createVegaLiteSpec(undefined,'bar',undefined,undefined,undefined);
       
    }

    renderGraph(definition: any) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .width(600)
            .height(340)
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");
    }

  	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(action);
    }

    dragstart_handlerField(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handlerField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
    }

    dragend_handlerField(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragend_handlerField', '@Start');

        console.log('dragend_handler', ev.dataTransfer.dropEffect)
    }

    dragover_handlerCol(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerCol', '@Start');

        ev.preventDefault();
    }

    dragover_handlerRow(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerRow', '@Start');

        ev.preventDefault();
    }

    dragover_handlerColor(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColor', '@Start');

        ev.preventDefault();
    }

    dragstart_handlerColor(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handlerColor', '@Start');

        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
        this.colField = '';
        console.log('drag_start for ', this.draggedField)
    }

    drop_handlerCol(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerCol', '@Start');
        ev.preventDefault();

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.colField = this.draggedField;
        console.log('drop_handler dropped !!', this.colField )

        let definition = this.createVegaLiteSpec(
            undefined,
            undefined,
            this.colField,
            undefined,
            undefined
        );

        this.showColFieldAdvanced = true;
        this.renderGraph(definition);

    }

    drop_handlerRow(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerRow', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.rowField = this.draggedField;
        console.log('drop_handler dropped !!', this.rowField )

        let definition = this.createVegaLiteSpec(
            undefined,
            undefined,
            undefined,
            this.rowField,
            undefined
        );
        this.showRowFieldAdvanced = true;
        this.renderGraph(definition);
      }

    drop_handlerColor(ev) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handlerColor', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.graphColorField = this.draggedField;
        console.log('drop_handler dropped !!', this.graphColorField )

        let definition = this.createVegaLiteSpec(
            undefined,
            undefined,
            this.colField,
            undefined,
            undefined
        );
        this.renderGraph(definition);
      }

    dragover_handlerColEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColEnter', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColor = false;
    }

    dragover_handlerColLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColLeave', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragover_handlerRowEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerRowEnter', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverColor = false;
    }

    dragover_handlerRowLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerRowLeave', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragover_handlerColorEnter(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColorEnter', '@Start');

        ev.preventDefault();
      this.dragoverCol = false;
      this.dragoverRow = false;
      this.dragoverColor = true;
    }

    dragover_handlerColorLeave(ev, actionName: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handlerColorLeave', '@Start');

        ev.preventDefault();
        this.dragoverColor = false;
    }

    clickCloseAdvancedX(action) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
    }

    clickApplyAdvancedX(action) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
   }

   clickCloseAdvancedY(action) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;
    }

    clickApplyAdvancedY(action) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;
    }

    rowFieldDropButton(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'rowFieldDropButton', '@Start');

        this.showColFieldAdvancedArea = true;
   }

   clickShowRowFieldAdvanced(){
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowRowFieldAdvanced', '@Start');

        this.showRowFieldAdvancedArea = true;
   }

    createVegaLiteSpec(
        description: string = 'First bar chart.',
        mark: string = 'bar',
        xfield: string = 'Month',
        yfield: string = 'Trades',
        title: string = 'Average Trading'): dl.spec.TopLevelExtendedSpec {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'createVegaLiteSpec', '@Start');

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

    clickDatasource(index: number, name: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        console.log (index, name)
    }

    clickIcon(graph: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickIcon', '@Start');

        this.showType = false;

        let definition = this.createVegaLiteSpec(
          undefined,
          graph,
          undefined,
          undefined,
          undefined
        );
        this.renderGraph(definition);

    }

  }