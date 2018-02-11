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
import { Widget }                     from './models';

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

    // "autosize": "pad",       NB - add these only if needed, blank causes no graph display
    // "autosize": {"type": "pad", "resize": true},  //"pad",   
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
    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    clickedButtonAggregateNo: boolean = false;
    colField: string = 'Drag a field here ...';
    currentData: any = [];
    currentDatasource: Datasource = null;           // DS for the selected W
    currentDatasources: Datasource[];               // Current DS for the selected W
    dataFieldNames: string[];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColor: boolean = false;
    filterPivotFields: string = '';
    graphColorField: string = 'Drag a field here ...';
    graphCols: string[];
    graphRows: string[];
    graphColor: string[];
    localWidget: Widget;                            // W to modify, copied from selected
    opened: boolean = true;
    presentationMode: boolean;
    rowField: string = 'Drag a field here ...';
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

        // TODO - remove after testing
        this.showDatasourcePopup = true;

        let x: number = 0;
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {
                x = w.datasourceID;
                this.localWidget = w;
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

        console.log('xx onInit', this.globalVariableService.currentDatasources, this.currentDatasources), this.currentDatasource
        // TODO - handle properly and close form
        if (this.currentDatasource == null) {
            alert('Datasource not found in global currentDatasources')
        };

        // TODO - remove this, currently datalib reads array as string a,b,c
        let y: string = this.currentDatasource.dataFields.toString();
        this.dataFieldNames = y.split(',');
        
        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
    }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        let definition = this.createVegaLiteSpec();
       
    }

    renderGraph(definition: any) {
        // Render the graph on the form
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .width(470)
            .height(320)
            .initialize(this.dragWidget.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "200px");
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(action);
    }

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText;
    }

    dragoverColumn(ev, actionName: string) {
        // Event trigger when a field is dragged over Column element 
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

        ev.preventDefault();
    }

    dragoverRows(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverRows', '@Start');

        ev.preventDefault();
    }

    dragoverColors(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColors', '@Start');

        ev.preventDefault();
    }

    dropColumn(ev) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');
        ev.preventDefault();

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.colField = this.draggedField;
        this.localWidget.graphXfield = this.draggedField;
        console.log('Field dropped: ', this.colField )

        let definition = this.createVegaLiteSpec();

        this.showColFieldAdvanced = true;
        this.renderGraph(definition);

    }

    dropRow(ev) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropRow', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.rowField = this.draggedField;
        this.localWidget.graphXfield = this.draggedField;
        console.log('Field dropped: ', this.rowField )

        let definition = this.createVegaLiteSpec();
        this.showRowFieldAdvanced = true;
        this.renderGraph(definition);
    }

    dropColor(ev) {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColor', '@Start');

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.graphColorField = this.draggedField;
        console.log('drop_handler dropped !!', this.graphColorField )

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when dragged field enters Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColor = false;
    }

    dragleaveColumn(ev, actionName: string) {
        // Event trigger when dragged field leave Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
    }

    dragenterRow(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterRow', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = true;
        this.dragoverColor = false;
    }

    dragoleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoleaveRow', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragenterColors(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColors', '@Start');

        ev.preventDefault();
      this.dragoverCol = false;
      this.dragoverRow = false;
      this.dragoverColor = true;
    }

    dragleaveColors(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColors', '@Start');

        ev.preventDefault();
        this.dragoverColor = false;
    }

    clickCloseAdvancedX(action) {
        // Closes the Advanced popup for the Xaxis 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
    }

    clickApplyAdvancedX(action) {
        // Apply the changes specified in the Advanced popup for the Xaxis, then close it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedX', '@Start');

        this.showColFieldAdvancedArea = false;
    }

    clickCloseAdvancedY(action) {
        // Closes the Advanced popup for the Yaxis 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;
    }

    clickApplyAdvancedY(action) {
        // Apply the changes specified in the Advanced popup for the Yaxis, then close it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickApplyAdvancedY', '@Start');

        this.showRowFieldAdvancedArea = false;
    }

    clickShowColFieldAdvanced(){
        // Shows the Advanced popup for Cols
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColFieldAdvanced', '@Start');

        this.showColFieldAdvancedArea = true;
    }

    clickShowRowFieldAdvanced(){
        // Shows the Advanced popup for Rows
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowRowFieldAdvanced', '@Start');

        this.showRowFieldAdvancedArea = true;
    }
 
    createVegaLiteSpec(): dl.spec.TopLevelExtendedSpec {
        // Creates and returns the Vega-Lite and Vega specs from the W Sepc
        this.globalFunctionService.printToConsole(this.constructor.name,'createVegaLiteSpec', '@Start');

        let vlSpecsNew: dl.spec.TopLevelExtendedSpec = vlTemplate;
        if (this.localWidget.graphUrl != "") {
            vlSpecsNew['data'] = {"url": this.localWidget.graphUrl};
        } else {
            vlSpecsNew['data'] = {"values": this.localWidget.graphData};
        }
        vlSpecsNew['description'] = this.localWidget.graphDescription;
        vlSpecsNew['mark']['type'] = this.localWidget.graphMark;
        vlSpecsNew['mark']['color'] = this.localWidget.graphMarkColor;

        vlSpecsNew['encoding']['x']['field'] = this.localWidget.graphXfield;
        vlSpecsNew['encoding']['x']['type'] = this.localWidget.graphXtype;
        vlSpecsNew['encoding']['x']['axis']['title'] = this.localWidget.graphXaxisTitle;
        vlSpecsNew['encoding']['x']['timeUnit'] = this.localWidget.graphXtimeUnit;
        vlSpecsNew['encoding']['x']['aggregate'] = this.localWidget.graphXaggregate;

        vlSpecsNew['encoding']['y']['field'] = this.localWidget.graphYfield;
        vlSpecsNew['encoding']['y']['type'] = this.localWidget.graphYtype;
        vlSpecsNew['encoding']['y']['axis']['title'] = this.localWidget.graphYaxisTitle;
        vlSpecsNew['encoding']['y']['timeUnit'] = this.localWidget.graphYtimeUnit;
        vlSpecsNew['encoding']['y']['aggregate'] = this.localWidget.graphYaggregate;

        // Change HxW to show the graph in the given area on this form, which may be different
        // to the size of the W on the D
        vlSpecsNew['height'] = 260;
        vlSpecsNew['width'] = 420;

        vlSpecsNew['title']['text'] = this.localWidget.graphTitle;

        if (this.localWidget.graphColorField != ''  && this.localWidget.graphColorField != null) {
            vlSpecsNew['encoding']['color'] = {
                "field": this.localWidget.graphColorField,
                "type": this.localWidget.graphColorType
            }
        };

        return vlSpecsNew;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
        console.log (index, name)
    }

    clickIcon(graph: string) {
        // Click a type of graph icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickIcon', '@Start');

        this.showType = false;

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);

    }

    clickDSrow(datasourceID: number) {
        // Set the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.datasets.length; i++) {
            if(this.globalVariableService.datasets[i].datasourceID == datasourceID) {
                ds.push(this.globalVariableService.datasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + datasourceID)
        };
        
        // Load it
        this.currentData = this.globalVariableService.datasets.filter(
            d => d.id == dSetID)[0].data;

        // Preview
        console.log('xx clickDSrow 2', ds, dSetID, this.currentData)

    }
  }