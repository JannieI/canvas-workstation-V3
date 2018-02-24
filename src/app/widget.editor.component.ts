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
                },
            "color": {
                "field": "",
                "type": ""
            }
        }
};


@Component({
    selector: 'widget-editor',
    templateUrl: './widget.editor.component.html',
    styleUrls: ['./widget.editor.component.css']
  })
  export class WidgetEditorComponent implements OnInit {

    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;
    @Output() formWidgetEditorClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    clickedButtonAggregateNo: boolean = false;
    colField: string = 'Drag a field here ...';
    currentData: any = [];
    currentDatasources: Datasource[] = null;               // Current DS for the selected W
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColor: boolean = false;
    filterPivotFields: string = '';
    graphColorField: string = 'Drag a field here ...';
    graphCols: string[];
    graphRows: string[];
    graphColor: string[];
    graphTypeFieldY: string[] =[];
    graphTypeFieldX: string[] =[];
    graphTypeFieldColor: string[] =[];
    hasClicked: boolean = false;
    localWidget: Widget;                            // W to modify, copied from selected
    opened: boolean = true;
    presentationMode: boolean;
    rowField: string = 'Drag a field here ...';
    selectedViz: string = 'Graph';
    showRowFieldAdvanced: boolean = false;
    showColFieldAdvanced: boolean = false;
    showColFieldAdvancedArea: boolean = false;
    showRowFieldAdvancedArea: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showColourDeleteIcon: boolean = false;
    showRowDeleteIcon: boolean = false;
    showTable: boolean = false;
    showType: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.newWidget) {
            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources;

            this.localWidget =
            {
                "widgetType": "Graph",
                "widgetSubType": "",

                "isTrashed": false,
                "dashboardID": 1,
                "dashboardTabID": 1,
                "dashboardTabIDs": [1],
                "id": 1,
                "name": "New",
                "description": "New",
                "visualGrammar": "Vega-Lite",
                "version": 1,
                "isSelected": false,
                "isLiked": false,
                "nrDataQualityIssues": 0,
                "nrComments": 4,
                "nrButtonsToShow": 3,
                "hyperlinkDashboardID": 1,
                "hyperlinkDashboardTabID": 1,

                "datasourceID": 4,
                "data": null,
                "dataFields": null,
                "dataFieldTypes": null,
                "dataFieldLengths": null,
                "slicerFieldName": "symbol",
                "slicerSelection": null,
                "datasetID": 7,
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
                "containerBorderRadius": "",
                "containerBoxshadow": "2px 2px gray",
                "containerColor": "transparent",
                "containerFontsize": 12,
                "containerHeight": 320,
                "containerLeft": 10,
                "containerHasTitle": true,
                "containerTop": 80,
                "containerWidth": 410,
                "containerZindex": 50,
                "titleText": "New Title",
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
                "graphHeight": 240,
                "graphLeft": 1,
                "graphTop": 1,
                "graphWidth": 240,
                "graphGraphPadding": 1,
                "graphHasSignals": false,
                "graphFillColor": "",
                "graphHoverColor": "",
                "graphSpecification": "",
                "graphDescription": "",
                "graphXaggregate": "",
                "graphXtimeUnit": "",
                "graphXfield": "",
                "graphXtype": "",
                "graphXaxisTitle": "",
                "graphYaggregate": "",
                "graphYtimeUnit": "",
                "graphYfield": "Miles_per_Gallon",
                "graphYtype": "quantitative",
                "graphYaxisTitle": "Miles/Gallon",
                "graphTitle": "graphTitle",
                "graphMark": "tick",
                "graphMarkColor": "#4682b4",
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

        } else {

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

            // Get DS
            this.currentDatasources = this.globalVariableService.currentDatasources
                .filter(ds => ds.id == x)

            // TODO - handle properly and close form
            if (this.currentDatasources.length != 1) {
                alert('Datasource not found in global currentDatasources')
            };

            // Add to axis
            if (this.localWidget.graphXfield != ''   &&   this.localWidget.graphXfield != null) {
                this.showColumnDeleteIcon = true;
                this.colField = this.localWidget.graphXfield;
            } else {
                this.showColumnDeleteIcon = false;
                this.colField = '';
            }

            if (this.localWidget.graphYfield != ''   &&   this.localWidget.graphYfield != null) {
                this.showRowDeleteIcon = true;
                this.rowField = this.localWidget.graphYfield;
            } else {
                this.showRowDeleteIcon = false;
                this.rowField = '';
            }

            if (this.localWidget.graphColorField != ''   &&   this.localWidget.graphColorField != null) {
                this.showColourDeleteIcon = true;
                this.graphColorField = this.localWidget.graphColorField;
            } else {
                this.showColourDeleteIcon = false;
                this.graphColorField = '';
            }

            // TODO - remove this, currently datalib reads array as string a,b,c
            let y: string = this.currentDatasources[0].dataFields.toString();
            this.dataFieldNames = y.split(',');
            let l = this.currentDatasources[0].dataFieldLengths.toString().split(',');
            for (var i = 0; i < l.length; i++) {
                this.dataFieldLengths.push(+l[i]);
             };
             let t: string = this.currentDatasources[0].dataFieldTypes.toString();
             this.dataFieldTypes = t.split(',');

        }

        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        let definition = this.createVegaLiteSpec();
        if (!this.newWidget) {
            this.renderGraph(definition);
        }

    }

    renderGraph(definition: any) {
        // Render the graph on the form
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        let width: number = 470;
        let height: number = 300;
        // Reduce width of legend by length of selected field
        if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {
            let reduce: number = 30;

            // Find the length, then say 8px per character + colour blockie displayed
            // TODO - do this better !
            for (var i = 0; i < this.dataFieldNames.length; i++) {
                if (this.localWidget.graphColorField == this.dataFieldNames[i]) {
                    reduce = (8 * this.dataFieldLengths[i]) + 35;
                }
            };
            width = width - reduce;
        }
        view.renderer('svg')
            .width(width)
            .height(height)
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

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        if (this.newWidget) {

            // TODO - improve this when using a DB!
            let newID: number = 1;
            let ws: number[]=[];
            for (var i = 0; i < this.globalVariableService.widgets.length; i++) {
                ws.push(this.globalVariableService.widgets[i].id)
            };
            if (ws.length > 0) {
                newID = Math.max(...ws);
            };
            this.localWidget.id = newID;
            this.globalVariableService.widgets.push(this.localWidget);
        } else {
            // Replace the W
            this.globalVariableService.widgets.forEach(w => {
                if (w.id == this.localWidget.id) {
                // Make a deep copy
                    w= Object.assign({}, this.localWidget);


                    // w = this.localWidget;
                    w.titleText = 'xXx'
                }
            });
        };

        console.log('xx close gv', this.globalVariableService.widgets);

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

        // Show X icon
        this.showColumnDeleteIcon = true;

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.colField = this.draggedField;
        this.localWidget.graphXfield = this.draggedField;
        this.localWidget.graphXaxisTitle = this.draggedField;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldX = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType);
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

        // Show X icon
        this.showRowDeleteIcon = true;

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.rowField = this.draggedField;
        this.localWidget.graphYfield = this.draggedField;
        this.localWidget.graphYaxisTitle = this.draggedField;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldY = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphYtype = this.defaultGraphTypeField(fieldType);

        // TODO - REMOVE when this is done via forms !!!
        console.log('xx graphYtype', this.localWidget.graphYtype)
        if (this.localWidget.graphYtype == 'quantitative') {
            this.localWidget.graphYtype = 'ordinal';
        };
        let definition = this.createVegaLiteSpec();
        this.showRowFieldAdvanced = true;
        this.renderGraph(definition);
    }

    dropColor(ev) {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColor', '@Start');

        // Show X icon
        this.showColourDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        this.graphColorField = this.draggedField;
        this.localWidget.graphColorField = this.draggedField

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldColor = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphColorType = this.defaultGraphTypeField(fieldType);

        console.log('dropColor field name: ', this.graphColorField )

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);
    }

    clickClearColumnField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        // Show X icon
        this.showColumnDeleteIcon = false;
        this.colField = '';
        this.localWidget.graphXfield = null;

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);
    }

    clickClearRowField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        // Show X icon
        this.showRowDeleteIcon = false;
        this.rowField = '';
        this.localWidget.graphYfield = null;

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);
    }

    clickClearColourField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        // Show X icon
        this.showColourDeleteIcon = false;
        this.graphColorField = '';
        this.localWidget.graphColorField = null;

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

        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);
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

        vlSpecsNew['encoding']['color']['field'] = this.localWidget.graphColorField;
        vlSpecsNew['encoding']['color']['type'] = this.localWidget.graphColorType;

        // console.log('xx vega spec',this.localWidget.graphColorField, vlSpecsNew)
        return vlSpecsNew;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickIcon(graph: string) {
        // Click a type of graph icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickIcon', '@Start');

        this.showType = false;

        this.localWidget.graphMark = graph;
        let definition = this.createVegaLiteSpec();
        this.renderGraph(definition);

    }

    clickDSrow(datasourceID: number) {
        // Set the selected datasourceID
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        this.currentDatasources = this.globalVariableService.currentDatasources
            .filter(ds => ds.id == datasourceID)

        // TODO - remove this, currently datalib reads array as string a,b,c
        let y: string = this.currentDatasources[0].dataFields.toString();
        this.dataFieldNames = y.split(',');
        let l = this.currentDatasources[0].dataFieldLengths.toString().split(',');
        for (var i = 0; i < l.length; i++) {
            this.dataFieldLengths.push(+l[i]);
         };

        // Switch on the preview after the first row was clicked
        this.hasClicked = true;

        // Get latest dSet for the selected DS
        let ds: number[]=[];
        let dSetID: number = 0;

        for (var i = 0; i < this.globalVariableService.currentDatasets.length; i++) {
            if(this.globalVariableService.currentDatasets[i].datasourceID == datasourceID) {
                ds.push(this.globalVariableService.currentDatasets[i].id)
            }
        };
        if (ds.length > 0) {
            dSetID = Math.max(...ds);
        } else {
            // Make proper error handling
            alert('Error: no dataSet in glob vars for DSid = ' + datasourceID)
        };

        // Load first few rows into preview
        this.currentData = this.globalVariableService.currentDatasets.filter(
            d => d.id == dSetID)[0].data.slice(0,5);
    }

    clickContinue(){
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        if (this.selectedViz=='Table') {
            this.showTable = true;
        } else {
            this.showTable = false;
        };

        this.showDatasourcePopup = false;
    }

    clickSelectViz(selection: string) {
        // Set the selected Visualisation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectViz', '@Start');

        this.selectedViz = selection;

    }

    setGraphTypeFieldY(graphYtype: string) {
        // Set the Vega field type of the Y axis
        // TODO - fix event in HTML so that it is triggered here
        this.globalFunctionService.printToConsole(this.constructor.name,'setGraphTypeFieldY', '@Start');

        console.log('xx graphYtype', graphYtype)
        this.localWidget.graphYtype = graphYtype;
    }

    allowedGraphTypeField(fieldType: string): string[] {
        // Returns a string array of allowed Vega types depending on a given field type
        this.globalFunctionService.printToConsole(this.constructor.name,'allowedGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return ['ordinal'];
        };
        if (fieldType == 'number') {
            return ['ordinal','quantitative'];
        };
    }

    defaultGraphTypeField(fieldType: string): string {
        // Returns the default Vega field type depending a given field types
        this.globalFunctionService.printToConsole(this.constructor.name,'defaultGraphTypeField', '@Start');

        if (fieldType == 'string') {
            return 'ordinal';
        };
        if (fieldType == 'number') {
            return 'quantitative';
        };
    }

    getFieldType(fieldName: string): string {
        // Returns the field type of a given field name
        this.globalFunctionService.printToConsole(this.constructor.name,'getFieldType', '@Start');

        for (var i = 0; i < this.dataFieldNames.length; i++) {
            if (this.dataFieldNames[i] == fieldName) {
                return this.dataFieldTypes[i]
            }
        };
    }

  }