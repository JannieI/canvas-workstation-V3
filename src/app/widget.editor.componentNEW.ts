// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { CSScolor }                   from './models';
import { Datasource }                 from './models';
import { GraphFilter }                from './models';
import { GraphHistory }               from './models';
import { GraphCalculation }           from './models';
import { Widget }                     from './models';
import { WidgetLayout }               from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetGraph }                from './models';


// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions, 3rd Party
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import { ExcelService }               from './excel.service';

// Templates
import { timeUnits }                  from './templates';
import { vegaColorSchemes }           from './templates';
import { aggregations }               from './templates';

// import {  }                  from './templates';
// import {  }                  from './templates';
// import {  }                  from './templates';
const dragFieldMessage: string = 'Drag a field here ...';

export interface dataSchemaInterface {
    name: string;                   // Name of Field (DB or Calculated)
    typeName: string;               // ie String
    type: string;                   // ie string
    length: number;                 // Optional field length
    isCalculated: boolean;          // True if calculated
    calculatedExpression: string;   // Formula for calculated fields
}

@Component({
    selector: 'widget-editorNEW',
    templateUrl: './widget.editor.componentNEW.html',
    styleUrls: ['./widget.editor.componentNEW.css']
  })
  export class WidgetEditorComponentNEW implements OnInit {

    @Input() selectedWidgetLayout: WidgetLayout;
    @Input() newWidget: boolean;
    @Input() showDatasourcePopup: boolean;  // TODO - Depricate this once form ready
    @Input() selectedWidget: Widget;
    @Input() newWidgetContainerLeft: number;
    @Input() newWidgetContainerTop: number;
    @Input() canSave: boolean = true;

    @Output() formWidgetEditorClosed: EventEmitter<Widget> = new EventEmitter();
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (event.code == 'KeyS'  &&  (event.ctrlKey)  &&  (event.shiftKey)  ) {
            this.showGraph(this.currentGraphID);
            return;
        };
        if (event.code == 'ArrowLeft'  &&  (event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickBrowsePreviousGraph();
            return;
        };
        if (event.code == 'ArrowRight'  &&  (event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickBrowseNextGraph();
            return;
        };


        // if (this.currentGraphID >= 0  &&  event.code == 'KeyS'  &&  (event.ctrlKey)
        //     &&  (!event.shiftKey)  ) {
        // //    console.warn('xx');
        //     this.showGraph(this.currentGraphID);
        //     return;
        // };

        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {

            if (this.showDatasourceMain) {
                this.clickContinue();
                return;
            } else {
                if (this.showCalculatedAreaProperties) {
                    this.clickCalculatedApply();
                    return;
                };
                if (this.showFilterAreaProperties) {
                    this.clickFilterAdd();
                    return;
                };
                this.clickSave('Saved');
                return;
            }
        };

    }

    aggregations = aggregations;
    backgroundcolors: CSScolor[];
    calculatedID: number = -1;
    calculatedAs: string = '';
    calculatedDataType: string = '';
    calculatedDataTypeName: string = '';
    calculatedErrorMessage: string = '';
    calculatedExpression: string = '';
    colorField: string = dragFieldMessage;
    columnField: string = dragFieldMessage;
    conditionErrorMessage = '';
    conditionColourName: string = '';
    conditionColour: string = '';
    conditionFieldName: string = '';
    conditionOperator: string = '';
    conditionValue: string = '';
    conditionValueFrom: string = '';
    conditionValueTo: string = '';
    currentData: any = [];
    currentGraphID: number = -1;
    currentGraphLayer: number = 1;              // Current layer being defined
    // Note 14: this number is the LAYER as seen by the UserPaletteButtonBarComponent.  The Arrays are
    // however base 0.  So, take care in making changes to iterateListLike.
    dataSchema: dataSchemaInterface[] = [];
    detailField: string = dragFieldMessage;
    draggedField: string = '';
    dragoverColours: boolean = false;
    dsFilterMessage: string = '(filtered)';
    errorMessage: string = 'asdfasdfasdfasdfasdf';
    errorMessageEditor: string = '';
    filterErrorMessage: string = ' ';
    filterID: number = -1;
    filterFieldName: string = '';
    filterNrActive: number = 0;
    filterOperator: string = '';
    filterTimeUnit: string = '';
    filterValue: string = '';
    filterValueFrom: string = '';
    filterValueTo: string = '';
    graphCalculations: GraphCalculation[] = [];
    graphColor: string[];
    // graphXaggregateVegaLiteName: string = '';
    // graphYaggregateVegaLiteName: string = '';
    graphColorAggregateVegaLiteName: string = '';
    graphHeader: string = 'Graph';
    graphHistory: GraphHistory[] = [];
    graphHistoryPosition: number = 0;
    graphLayers: number[] = [];  // Layers to display with *ngFor - see   Note 14   above
    hasCalculationsOrFilters: boolean = false;
    isBusyRetrievingData: boolean = false;
    isDragoverXField: boolean = false;
    isDragoverYField: boolean = false;
    isDragoverSizes: boolean = false;
    isDragoverRow: boolean = false;
    isDragoverColumn: boolean = false;
    isDragoverDetail: boolean = false;
    isDragoverX2: boolean = false;
    isDragoverY2: boolean = false;
    isDragoverProjection: boolean = false;
    isDragoverProjectionLatitude: boolean = false;
    isDragoverProjectionLongitude: boolean = false;
    localDatasources: Datasource[] = null;          // Current DS for the selected W
    localWidget: Widget;                            // W to modify, copied from selected
    nrRows: number;
    oldWidget: Widget = null;                       // W at start
    rowField: string = dragFieldMessage;
    projectionField: string = '';
    projectionFieldLatitude: string = dragFieldMessage;
    projectionFieldLongitude: string = dragFieldMessage;
    selectedDescription: string = '';
    selectedDSName: string = '';
    selectedFieldIndex: number = -1;
    selectedGraphCalculatedRowIndex: number = -1;
    selectedGraphFilterRowIndex: number = -1;
    selectedRowIndex: number = -1;
    selectedRowID: number;
    sizeField: string = dragFieldMessage;
    showCalculatedAreaProperties: boolean = false;
    showCalculatedHelp: boolean = false;
    showConditionAreaProperties: boolean = false;
    showColourDeleteIcon: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showDatasourceMain: boolean = true;
    showDetailDeleteIcon: boolean = false;
    showDSfilterArea: boolean = false;
    showFieldTitleProperties: boolean = false;
    showFieldXPropertiesInfo: boolean = false;
    showFieldXPropertiesField: boolean = false;
    showFieldXPropertiesAxis: boolean = false;
    showFieldXProperties: boolean = false;
    showFieldXPropertiesTitle: boolean = false;
    showFieldYProperties: boolean = false;
    showFieldYPropertiesInfo: boolean = false;
    showFieldYPropertiesField: boolean = false;
    showFieldYPropertiesAxis: boolean = false;
    showFieldYPropertiesTitle: boolean = false;
    showFieldRowProperties: boolean = false;
    showFieldSizeProperties: boolean = false;
    showFieldColumnProperties: boolean = false;
    showFieldColorProperties: boolean = false;
    showFieldColorPropertiesField: boolean = false;
    showFieldColorPropertiesLegend: boolean = false;
    showFieldColorPropertiesInfo: boolean = false;
    showFieldColorPropertiesTitle: boolean = false;
    showFieldFilter: boolean = false;
    showFilterAreaProperties: boolean = false;
    showGraphAreaTitle: boolean = false;
    showSelectionFilter: boolean = false;
    showFieldMarkProperties: boolean = false;
    showFieldDetailProperties: boolean = false;
    showFieldX2Properties: boolean = false;
    showFieldY2Properties: boolean = false;
    showFieldProjectionProperties: boolean = false;
    showSpecificGraphLayer: boolean = false;
    showPreview: boolean = false;
    showProjectionDeleteIcon: boolean = false;
    showProjectionLatitudeDeleteIcon: boolean = false;
    showProjectionLongitudeDeleteIcon: boolean = false;
    showRowDeleteIcon: boolean = false;
    showSizeDeleteIcon: boolean = false;
    showSpecification: boolean = false;
    showType: boolean = false;
    showWidgetEditorLite: boolean = true;
    showXDeleteIcon: boolean = false;
    showX2DeleteIcon: boolean = false;
    showYDeleteIcon: boolean = false;
    showY2DeleteIcon: boolean = false;
    sortOrder: number = 1;
    specification: any;              // Full spec for Vega, or other grammar
    specificationJSON: any = 'Graph Specification';
    timeUnits: string[] = timeUnits;
    vegaColorSchemes = vegaColorSchemes;
    widgetGraphsLite: string[] = ['area', 'bar', 'line', 'point'];
    widgetGraphs: WidgetGraph[] =[];
    widgetGraphsFull: WidgetGraph[] =[];
    xField: string = dragFieldMessage;
    x2Field: string = dragFieldMessage;
    yField: string = dragFieldMessage;
    y2Field: string = dragFieldMessage;

    // TODO - remove this later on when we dont use D3 time formats at all
   

    // D3 formatting 101:
    // [[fill]align][sign][symbol][0][width][,][.precision][type]
    //
    // type:
    //   e = scientific
    //   d = integer (IGNORES non-integer values, no change to integers)
    //   % = This multiplies the number times 100 and appends a "%" symbol at the end of the string.
    //   s = Converts numbers to SI units.
    //
    // precision
    //   g = General - A precision type provides precision total length numerical output.
    //   f = Fixed - A fixed type provides precision length after the decimal point.
    //       d3.format(".4f")(3.14159); //"3.1416"
    //   r = Rounded - An general type will round the number to a fixed number.
    //
    // , Thousands Seperator
    //   ie format(".2f")(10101);    //"10,101.00"
    //
    // width = pads to same widht,
    //   ie format("8")(1);      //"       1"
    //   NOTE - this is the TOTAL length of the string, so 12.34 count as 4 digits
    //
    // 0 = zero padding, use with width
    //   ie format("08")(1234);         //"00001234"
    //      format("09,")(123456);      //"0,123,456"
    //
    // Symbols - seems you can only use $ here, which should automatically pick up your locale
    //   ie format("$,")(1250);         //"$1,250"
    //   ie  format("$,.2f")(1250);     //"$1,250.00"
    //
    // Sign - determines how to view negative/postive values
    //   ie format("+")(125);           //"+125"
    //   ie format("+")(-125);          //"-125"
    //   ie format("-")(125);           //"125"
    //   ie format("-")(-125);          //"-125"
    //   ie format(" ")(125);           //" 125"
    //   ie format(" ")(-125);          //"-125"
    //
    // Alignment and Fill - You can also align the formatter output string with any
    //   character you want as long as it isn't { or }. You will need to tell the formatter
    //   how you want to align characters and what character to use as the fill. The fill
    //   character would need to preseed an alignment indicator:
    //      "<" - left alignment
    //      ">" - right alignment
    //      "^" - center alignment
    //   format("4>8")(1);              //"44444441"
    //   format("4^8")(1);              //"44441444"
    //   format("4<8")(1);              //"14444444"
    //
    
    
    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private excelService: ExcelService,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
console.log('xx timeUnits', timeUnits)
        // Get setup info
        this.backgroundcolors = this.globalVariableService.canvasBackgroundcolors.slice();
        this.backgroundcolors = [
            {id: null, name: 'No Fill', cssCode: 'transparent', shortList: false}, ...this.backgroundcolors
        ];

        // Get DS to which user has permissions
        this.localDatasources = this.globalVariableService.datasources
            .slice()
            .filter(ds =>
                this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
            )
            .sort( (obj1, obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });

        // Start afresh for new W~
        if (this.newWidget) {

            // Create new W
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Graph';
            this.localWidget.visualGrammar = 'Vega-Lite';

            // Get Widget Graph Specs
            this.globalVariableService.getResource('widgetGraphs').then(res => {
                this.widgetGraphsFull = res
                this.widgetGraphs = res.filter(
                    wg => wg.visualGrammar==this.localWidget.visualGrammar
                );

                if (this.showWidgetEditorLite) {
                    this.widgetGraphs = this.widgetGraphs
                        .filter(wgr => this.widgetGraphsLite.indexOf(wgr.mark) >= 0 );
                };
            });

            // Count the Ws
            let widgets: Widget[];
            this.localDatasources.forEach(ds => {
                widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
                ds.nrWidgets = widgets.length;
            });

            // Populate predefined dimensions, considering layouts
            if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme == ''
                ||  this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme == null) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme = 'None';
            };
            if (this.newWidgetContainerLeft > 0) {
                this.localWidget.containerLeft = this.newWidgetContainerLeft;
            };
            if (this.newWidgetContainerTop > 0) {
                this.localWidget.containerTop = this.newWidgetContainerTop;
            };
            if (this.selectedWidgetLayout != null) {

                if (this.selectedWidgetLayout.id != null
                    &&
                    this.selectedWidgetLayout.id != undefined) {
                        this.localWidget.containerLeft = this.selectedWidgetLayout.left;
                        this.localWidget.containerHeight = this.selectedWidgetLayout.height;
                        this.localWidget.containerTop = this.selectedWidgetLayout.top;
                        this.localWidget.containerWidth = this.selectedWidgetLayout.width;
                };
            };

            // Select previously used DS, and then click it to load relevant info
            // NB: AFTER the localWidget has been initialised
            if (this.globalVariableService.previousGraphEditDSID != -1) {

                let datasourceIndex: number = this.localDatasources.findIndex(ds =>
                    ds.id == this.globalVariableService.previousGraphEditDSID
                );
                if (datasourceIndex >= 0) {
                    this.selectedRowID = this.globalVariableService.previousGraphEditDSID;
                    this.selectedRowIndex = datasourceIndex;

                    // Reset: assume we are starting afresh ..
                    this.globalVariableService.previousGraphEditDSID = null;
                    this.clickDSrow(this.selectedRowIndex, this.selectedRowID)
                }
            };

        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Populate the visible layers, and set Defaults
            for (let i = 0; i < this.localWidget.graphLayers.length; i++){
                // if (this.localWidget.graphLayers[i].graphMarkSize == null
                //     ||
                //     this.localWidget.graphLayers[i].graphMarkSize == 0) {
                //     this.localWidget.graphLayers[i].graphMarkSize = 20;
                // };

                this.graphLayers.push(i + 1);
            };

            if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme == ''
                ||  this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme == null) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme = 'None';
            };

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars.  In: ngOnInit, ELSE +- line 170 inside WidgetEditor.ts')
            };

            // Fill in defaults
            if (this.localWidget.graphHeight == null) {
                this.localWidget.graphHeight = 240;
            };
            if (this.localWidget.graphLeft == null) {
                this.localWidget.graphLeft = 1;
            };
            if (this.localWidget.graphTop == null) {
                this.localWidget.graphTop = 1;
            };
            if (this.localWidget.graphWidth == null) {
                this.localWidget.graphWidth = 240;
            };
            if (this.localWidget.graphDimensionRight == null) {
                this.localWidget.graphDimensionRight = 140;
            };
            if (this.localWidget.graphDimensionLeft == null) {
                this.localWidget.graphDimensionLeft = 80;
            };
            if (this.localWidget.graphDimensionBottom == null) {
                this.localWidget.graphDimensionBottom = 70;
            };
            if (this.localWidget.graphLayerFacet == null  ||  this.localWidget.graphLayerFacet == '') {
                this.localWidget.graphLayerFacet = 'Single';
            };
            if (this.localWidget.visualGrammar == ''
                ||
                this.localWidget.visualGrammar == null) {
                this.localWidget.visualGrammar = 'Vega-Lite';
            };

            // Load local Vars from localWidget
            this.loadLocalVarsFromWidget()

            // Get local vars - easier for ngFor
            this.filterNrActive = this.localWidget.graphFilters.filter(gflt => gflt.isActive).length;
            this.showWidgetEditorLite = this.globalVariableService.currentUser
                .preferenceShowWidgetEditorLite;

            this.conditionColourName =
                this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColourName;
            this.conditionColour =
                this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColour;
            this.conditionFieldName =
                this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionFieldName;
            this.conditionOperator =
                this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionOperator;
            this.conditionValue =
                this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionValue;

            let arrayIndex: number = this.localDatasources.findIndex(
                ds => ds.id == this.localWidget.datasourceID
            );
            if (arrayIndex < 0) {
                alert('Datasource for current Dashboard not found in global currentDatasources')
            };

            // Reset, Highlight selected row
            this.selectedRowIndex = arrayIndex;
            this.selectedRowID = this.localDatasources[arrayIndex].id;
            this.selectedDSName = this.localDatasources[arrayIndex].name.slice(0,22) +
                (this.localDatasources[arrayIndex].name.length > 22?  '...'  :  '');
            this.selectedDescription = this.localDatasources[arrayIndex].description;
            this.errorMessage = 'asdfasdfasdfasdf';
            this.currentData = null;

            // Construct Schema
            this.constructDataSchema(this.selectedRowIndex);

            // Determine if data in Glob Var
            let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == this.selectedRowID
            );
            if (dataSetIndex >= 0) {

                // Load first few rows into preview
                this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                    .data.slice(0,5);

                // Switch on the preview after the first row was clicked
                this.showPreview = true;
            };

            // Remember ID for next time
            this.globalVariableService.previousGraphEditDSID = this.selectedRowID;

            // Show the Editor form
            this.showDatasourceMain = false;

            // Get Widget Graph Specs
            this.globalVariableService.getResource('widgetGraphs').then(res => {
                this.widgetGraphsFull = res
                this.widgetGraphs = res.filter(
                    wg => wg.visualGrammar==this.localWidget.visualGrammar
                );

                if (this.showWidgetEditorLite) {
                    this.widgetGraphs = this.widgetGraphs
                        .filter(wgr => this.widgetGraphsLite.indexOf(wgr.mark) >= 0 );
                };

                // TODO - fix
                // Show graph
                let graphIndex: number = this.widgetGraphs.findIndex(wgr =>
                    wgr.mark == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark
                );
                this.showGraph(this.widgetGraphs[graphIndex].id);
            });

            // Switch if Complex graph in Lite mode
            if (this.localWidget.graphLayerFacet != 'Single'
                ||
                this.x2Field != dragFieldMessage
                ||
                this.y2Field != dragFieldMessage
                ||
                this.rowField != dragFieldMessage
                ||
                this.colorField != dragFieldMessage
                ||
                this.sizeField != dragFieldMessage
                ||
                this.detailField != dragFieldMessage
                ||
                this.projectionFieldLatitude != dragFieldMessage
                ||
                this.projectionFieldLongitude != dragFieldMessage
                )  {
                this.showWidgetEditorLite = false;
            };

            // Indicate calulations and filters present
            if (this.localWidget.graphCalculations.length > 0
                ||
                this.localWidget.graphFilters.length > 0) {
                    this.hasCalculationsOrFilters = true;
            };
        }

    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        // let definition = this.globalVariableService.createVegaLiteSpec(
        //     this.localWidget, graphHeight, graphWidth
        // );
        // if (!this.newWidget) {
        //     this.renderGraph(definition);
        // }
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    showGraph(graphID: number, createNewHistory: boolean = true) {
        // Render the graph on the form.  NOTE: each graph has its own spec and rendering
        // rules.
        this.globalFunctionService.printToConsole(this.constructor.name,'showGraph', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Validation
        if ( (this.xField == dragFieldMessage  ||  this.xField == null)
            &&
            (this.yField == dragFieldMessage  ||  this.yField == null)
            &&
            (this.colorField == dragFieldMessage  ||  this.colorField == null)
            &&
            (this.rowField == dragFieldMessage  ||  this.rowField == null)
            &&
            (this.columnField == dragFieldMessage  ||  this.columnField == null)
            &&
            (this.sizeField == dragFieldMessage  ||  this.sizeField == null)
            &&
            (this.x2Field == dragFieldMessage  ||  this.x2Field == null)
            &&
            (this.y2Field == dragFieldMessage  ||  this.y2Field == null)
            &&
            (this.projectionFieldLatitude == dragFieldMessage  ||  this.projectionFieldLatitude == null)
            &&
            (this.projectionFieldLongitude == dragFieldMessage  ||  this.projectionFieldLongitude == null)
            ) {
                this.errorMessageEditor = 'Select at least one field.';
                return;
        };
        if (this.projectionField != ''
            &&
            (
                (this.projectionFieldLatitude == dragFieldMessage  ||  this.projectionFieldLatitude == null)
                ||
                (this.projectionFieldLongitude == dragFieldMessage  ||  this.projectionFieldLongitude == null)
                )
            ) {
                this.errorMessageEditor = 'Select lat and long with Projection.';
                return;
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainStart != null
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainStart != ''
            &&
            isNaN(Number(this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainStart))) {
            this.errorMessageEditor = 'X axis Start domain must be numeric.';
            return;
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainEnd != null
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainEnd != ''
            &&
            isNaN(Number(this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainEnd))) {
            this.errorMessageEditor = 'X axis End domain must be numeric.';
            return;
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainStart != null
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainStart != ''
            &&
            isNaN(Number(this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainStart))) {
                this.errorMessageEditor = 'Y axis Start domain must be numeric.';
                return;
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainEnd != null
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainEnd != ''
            &&
            isNaN(Number(this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainEnd))) {
            this.errorMessageEditor = 'Y axis End domain must be numeric.';
            return;
        };

        // Keep graphID
        this.currentGraphID = graphID;

        // Switch off initial display
        this.showGraphAreaTitle = true;

        // Get the Vega-Lite aggregation
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregate = '';
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(
                agg => agg.displayName == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregate = this.aggregations[aggregationIndex]
                    .vegaLiteName;
            };
        }
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaggregate = '';
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(agg =>
                agg.displayName == this.localWidget.graphLayers[this.currentGraphLayer - 1]
                    .graphYaggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaggregate =
                    this.aggregations[aggregationIndex].vegaLiteName;
            };
        }
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregate = '';
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(agg =>
                    agg.displayName == this.localWidget.graphLayers[this.currentGraphLayer - 1]
                        .graphColorAggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregate =
                    this.aggregations[aggregationIndex].vegaLiteName;
            };
        }
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeAggregate = '';
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeAggregateName != '') {
            let aggregationIndex: number = this.aggregations.findIndex(agg =>
                agg.displayName == this.localWidget.graphLayers[this.currentGraphLayer - 1]
                    .graphSizeAggregateName);
            if (aggregationIndex >= 0) {
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeAggregate =
                    this.aggregations[aggregationIndex].vegaLiteName;
            };
        }

        // Fields and data schema
        this.localWidget.dataschema = this.dataSchema.slice();  // TODO - make .dataSchema consistent

        // Get the widgetGraph
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.id == graphID);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type id = ' + graphID + ' does not exist in the DB';
            return;
        } else {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark =
                this.widgetGraphs[widgetGraphIndex]['mark'];
        };

        // Set fields
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield = '';
        if (this.xField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield = this.xField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield = '';
        if (this.yField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield = this.yField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField = '';
        if (this.colorField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField = this.colorField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField = '';
        if (this.sizeField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField = this.sizeField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField = '';
        if (this.rowField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField = this.rowField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField = '';
        if (this.columnField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField =
                this.columnField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField = '';
        if (this.detailField != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField =
                this.detailField;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field = '';
        if (this.x2Field != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field = this.x2Field;
        };
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field = '';
        if (this.y2Field != dragFieldMessage) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field = this.y2Field;
        };
        // Trail not effective if size too large, and default is 20
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark.toLowerCase() == 'trail') {
            if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkSize > 2) {
                // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkSize = 1;
                this.errorMessageEditor = 'Use Mark-Size to reduce ...'
            };
        };

        // Validation and Warnings - AFTER default settings
        if (this.sizeField != dragFieldMessage
            &&
            this.widgetGraphs[widgetGraphIndex]['mark'] == 'rect') {
            this.errorMessageEditor = "'size' is incompatible with Rectangle graph.";
        };

        // Defaults
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype == ''
            ||
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype = 'ordinal';
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype == ''
            ||
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype = 'ordinal';
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType == ''
            ||
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType = 'ordinal';
        };

        if (this.graphColorAggregateVegaLiteName == null) {this.graphColorAggregateVegaLiteName = ""};
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorFormat == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorFormat = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorSort == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorSort = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorStack == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorStack = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit = "";
        };
        if (this.localWidget.graphTitleAnchor == null) {
            this.localWidget.graphTitleAnchor = "";
        };
        if (this.localWidget.graphTitleBaseline == null) {
            this.localWidget.graphTitleBaseline = "";
        };
        if (this.localWidget.graphTitleOrientation == null) {
            this.localWidget.graphTitleOrientation = ""
        };
        // if (this.graphXaggregateVegaLiteName == null) {this.graphXaggregateVegaLiteName = ""}
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXformat == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXformat = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXsort == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXsort = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtimeUnit == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtimeUnit = "";
        };
        // if (this.graphYaggregateVegaLiteName == null) {this.graphYaggregateVegaLiteName = ""}
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYformat == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYformat = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYsort == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYsort = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtimeUnit == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtimeUnit = "";
        };
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendTitle == null) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendTitle = "";
        };

        // Define Specification & Type
        this.localWidget.visualGrammarType = this.widgetGraphs[widgetGraphIndex]
            .visualGrammarType.toLowerCase();
        if (this.localWidget.visualGrammarType == 'custom') {
            this.localWidget.graphLayers[0].graphSpecification =
                this.widgetGraphs[widgetGraphIndex].specification;
        };

        // Render graph for Vega-Lite
        if (this.localWidget.visualGrammar == 'Vega-Lite') {

            // Create specification
            this.specification = this.globalVariableService.createVegaLiteSpec(
                this.localWidget,
                this.localWidget.graphHeight,
                this.localWidget.graphWidth,
                this.showSpecificGraphLayer,
                (this.currentGraphLayer - 1)
            );
            console.warn('xx spec', this.specification, this.localWidget);

            // Render in DOM
            let vegaSpecification = compile(this.specification).spec;
            let view = new View(parse(vegaSpecification));

            view.renderer('svg')
                .initialize(this.dragWidget.nativeElement)
                .hover()
                .run()
                .finalize();

            // Set H & W to fit around svg, which depends on labels, colour field length, etc
            this.localWidget.containerHeight =
                this.dragWidget.nativeElement.children[0].clientHeight + 40;
            this.localWidget.containerWidth =
                this.dragWidget.nativeElement.children[0].clientWidth + 20;
        };

        // Render graph for Vega
        if (this.localWidget.visualGrammar == 'Vega') {

            // Create specification
            this.specification = this.globalVariableService.createVegaSpec(
                this.localWidget,
                this.localWidget.graphHeight,
                this.localWidget.graphWidth,
                this.showSpecificGraphLayer,
                (this.currentGraphLayer - 1)
            );
            console.log('xx Vega graph', this.specification)
            // Render in DOM
            let view = new View(parse(this.specification));
            view.renderer('svg')
                .initialize(this.dragWidget.nativeElement)
                .hover()
                .run()
                .finalize();
        };

        // Append to history
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        if (layerIndex < 0) {
            this.graphHistory.push({
                layer: this.currentGraphLayer,
                widgetSpec: []
            });

            // Set position
            layerIndex = 0;
        };

        // Append if requested
        if (createNewHistory) {
            let newGraphSpec: Widget = {
                ...this.localWidget, ...{ graphData: [] }
            };
            this.graphHistory[layerIndex].widgetSpec.push(
                JSON.parse(JSON.stringify(newGraphSpec))
            );
            this.graphHistoryPosition = this.graphHistory[layerIndex].widgetSpec.length - 1;
        };

        // Calc position
        this.graphHeader = 'History: showing ' +
            (this.graphHistoryPosition + 1).toString() + ' of ' +
            this.graphHistory[layerIndex].widgetSpec.length.toString();

    }

    clickBrowsePreviousGraph() {
        // Browse to previous graph in history
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBrowsePreviousGraph', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Decrease position, if not at beginning
        if (this.graphHistoryPosition == 0) {
            return;
        };
        this.graphHistoryPosition = this.graphHistoryPosition - 1;

        // Recreate a new W spec
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        let newWidgetSpec: Widget = {
            ...this.graphHistory[layerIndex].widgetSpec[this.graphHistoryPosition],
             ...{ graphData: this.localWidget.graphData }
        };
        this.localWidget = JSON.parse(JSON.stringify(newWidgetSpec));

        // Populate the visible layers
        this.graphLayers = [];
        for (let i = 0; i < this.localWidget.graphLayers.length; i++){
            this.graphLayers.push(i + 1);
        };

                // TODO - fix
        // Get the graphID
        let graphID: number = -1;
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.mark == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type mark = ' +
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark +
                ' does not exist in the DB';
            return;
        } else {
            graphID = this.widgetGraphs[widgetGraphIndex]['id'];
        };

        // Show graph
        this.loadLocalVarsFromWidget();
        this.showGraph(graphID, false);
    }

    clickBrowseNextGraph() {
        // Browse to next graph in history
        this.globalFunctionService.printToConsole(this.constructor.name,'clickBrowseNextGraph', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Increase position, if not at beginning
        let layerIndex: number = this.graphHistory.findIndex(gh => gh.layer == this.currentGraphLayer);
        if (this.graphHistoryPosition >= (this.graphHistory[layerIndex].widgetSpec.length - 1) ) {
            return;
        };
        this.graphHistoryPosition = this.graphHistoryPosition + 1;

        // Recreate a new W spec
        let newWidgetSpec: Widget = {
            ...this.graphHistory[layerIndex].widgetSpec[this.graphHistoryPosition],
             ...{ graphData: this.localWidget.graphData }
        };
        this.localWidget = JSON.parse(JSON.stringify(newWidgetSpec));

        // Populate the visible layers
        this.graphLayers = [];
        for (let i = 0; i < this.localWidget.graphLayers.length; i++){
            this.graphLayers.push(i + 1);
        };

                // TODO - fix
        // Get the graphID
        let graphID: number = -1;
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.mark == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark);
        if (widgetGraphIndex < 0) {
            this.errorMessageEditor = 'Graph type mark = ' +
                this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark +
                ' does not exist in the DB';
            return;
        } else {
            graphID = this.widgetGraphs[widgetGraphIndex]['id'];
        };

        // Show graph
        this.loadLocalVarsFromWidget();
        this.showGraph(graphID, false);
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Validate
        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark == ''
            ||
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark == null) {
            this.errorMessage = 'Please select a type of graph';
            return;
        };

        // Workaround as MongoDB does not like $ in $schema
        // TODO - the $ must be treated better - and also READ BACK & CHANGED !!!
        this.localWidget.graphLayers.forEach(w => {
            let graphspec: string = JSON.stringify(w.graphSpecification);
            if (graphspec != null) {
                w.graphSpecification = JSON.parse(graphspec.replace("$schema","_schema"));
            };
            if (this.localWidget.visualGrammar == 'Vega') {
                w.graphSpecification.width = 1200;
                w.graphSpecification.height = 1200;    
            };
        });
        console.log('xx this.localWidget', this.localWidget)
        // Calc the graph dimensions
        // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphHeight = this.globalVariableService.calcGraphHeight(this.localWidget);
        // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphWidth = this.globalVariableService.calcGraphWidth(this.localWidget);

        // Update new/edit
        if (this.newWidget) {

            let tempChk: WidgetCheckpoint[] = this.globalVariableService.widgetCheckpoints
                .filter(wc =>
                    wc.dashboardID == this.localWidget.dashboardID
                    &&
                    wc.widgetID == this.localWidget.id
            );

            if (tempChk.length > 0) {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = tempChk.length - 1;

                for (var x = 0; x < tempChk.length; x++) {
                    this.localWidget.checkpointIDs.push(tempChk[x].id);
                };

            } else {
                this.localWidget.showCheckpoints = false;
                this.localWidget.checkpointIDs = [];
                this.localWidget.currentCheckpoint = 0;
                this.localWidget.lastCheckpoint = -1;
            };

            // Update local and global vars
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID);

            this.globalVariableService.addResource('widgets', this.localWidget).then(res => {
                this.localWidget.id = res.id;

                console.log('xx added W res', res)
                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Title',
                    'W Title clickSave',
                    null,
                    null,
                    null,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Return to main menu
                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        } else {

            // Update global W and DB
            this.globalVariableService.saveWidget(this.localWidget).then(res => {

                console.log('xx saved W res', res)

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Title',
                    'W Title clickSave',
                    null,
                    null,
                    this.oldWidget,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Saved',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        };
    }

    dragstartXField(ev) {
        // Event trigger when start Dragging X Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartXField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.xField;
    }

    dragstartYField(ev) {
        // Event trigger when start Dragging Y Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartYField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.yField;
    }

    dragstartColorField(ev) {
        // Event trigger when start Dragging Color Field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartColorField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = this.colorField;
    }

    clickFillXfield(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillXfield', '@Start');

        // Reset
        this.errorMessageEditor = '';

        let oldXfield: string = this.xField;
        if (this.xField != dragFieldMessage) {
            this.clickClearXField();
        };
        if (oldXfield != fieldName) {
            this.dropXField(null, fieldName);
        };

    }

    clickFillYfield(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillYfield', '@Start');

        // Reset
        this.errorMessageEditor = '';

        let oldYfield: string = this.yField;
        if (this.yField != dragFieldMessage) {
            this.clickClearYField();
        };
        if (oldYfield != fieldName) {
            this.dropYField(null, fieldName);
        };
    }

    clickFillColorField(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillColorField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        let oldColorField: string = this.colorField;
        if (this.colorField != dragFieldMessage) {
            this.clickClearColourField();
        };
        if (oldColorField != fieldName) {
            this.dropColour(null, fieldName);
        };
    }

    clickFilSizeField(fieldName: string) {
        // Click icon to fill this field into X field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilSizeField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        let oldSizeField: string = this.sizeField;
        if (this.sizeField != dragFieldMessage) {
            this.clickClearSizeField();
        };
        if (oldSizeField != fieldName) {
            this.dropSize(null, fieldName);
        };
    }

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText.trim();
        this.draggedField = this.draggedField.replace(/\n/g, " ");
    }

    dragoverXField(ev, actionName: string) {
        // Event trigger when a field is dragged over X Field element
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverXField', '@Start');

        ev.preventDefault();
    }

    dragoverYField(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverYField', '@Start');

        ev.preventDefault();
    }

    dragoverColour(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColour', '@Start');

        ev.preventDefault();
    }

    dragoverSize(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverSize', '@Start');

        ev.preventDefault();
    }

    dragoverRow(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverRow', '@Start');

        ev.preventDefault();
    }

    dragoverColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColumn', '@Start');

        ev.preventDefault();
    }

    dragoverDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverDetail', '@Start');

        ev.preventDefault();
    }

    dragoverX2(ev, actionName: string) {
        // Event trigger when the dragged Field is over the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverX2', '@Start');

        ev.preventDefault();
    }

    dragoverY2(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverY2', '@Start');

        ev.preventDefault();
    }

    dragoverProjection(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Projection field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverProjection', '@Start');

        ev.preventDefault();
    }

    dragoverProjectionLatitude(ev, actionName: string) {
        // Event trigger when the dragged Field is over the ProjectionLatitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverProjectionLatitude', '@Start');

        ev.preventDefault();
    }

    dragoverProjectionLongitude(ev, actionName: string) {
        // Event trigger when the dragged Field is over the ProjectionLongitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverProjectionLongitude', '@Start');

        ev.preventDefault();
    }

    switchXandY() {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'switchXandY', '@Start');

        // Reset
        this.errorMessageEditor = '';

        let newXField: string = this.xField;
        let newYField: string = this.yField;
        if (newXField == dragFieldMessage) {
            this.clickClearYField();
        } else {
            this.dropYField(null, newXField);
        };
        if (newYField == dragFieldMessage) {
            this.clickClearXField();
        } else {
            this.dropXField(null, newYField);
        };
    }

    dropXField(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropXField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, position != -1 ? position : fieldName.length)

        let dataSchemaIndex: number = this.dataSchema.findIndex(
            dsc => dsc.name == fieldName
        );

        // Show X icon
        this.showXDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldXPropertiesTitle = true;

        this.xField = fieldName;

        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype =
            this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtypeName =
            this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtimeUnit ='';

    }

    dropYField(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped in Y field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropYField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, position != -1 ? position : fieldName.length)

        // Show X icon
        this.showYDeleteIcon = true;

        // Show the panel with Y properties
        this.showFieldYPropertiesTitle = true;

        this.yField = fieldName;
        // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield = fieldName;
        // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisTitle = fieldName;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype =
            this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtypeName =
            this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtimeUnit ='';
    }

    dropColour(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColour', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = fieldName.indexOf(' X Y C');
        fieldName = fieldName.substring(0, position != -1 ? position : fieldName.length)

        // Show X icon
        this.showColourDeleteIcon = true;

        // Show the panel with X properties
        this.showFieldColorPropertiesTitle = true;

        // ev.preventDefault();
        // ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM
        // var data = ev.dataTransfer.getData("text");
        this.colorField = fieldName;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(fieldName);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType =
            this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTypeName =
            this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit ='';
        this.localWidget.graphDimensionRight = 140;
    }

    dropSize(ev, fieldName: string = '') {
        // Event trigger when the dragged Field is dropped the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropSize', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set
        if (fieldName == '') {
            fieldName = this.draggedField;
        };
        if (ev != null) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
            var data = ev.dataTransfer.getData("text");
        };


        // Show X icon
        this.showSizeDeleteIcon = true;

        // ev.preventDefault();
        // ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        // var data = ev.dataTransfer.getData("text");

        // this.sizeField = this.draggedField;
        this.sizeField = fieldName;
        this.isDragoverSizes = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.sizeField.indexOf(' X Y C');
        this.sizeField = this.sizeField.substring(0, position != -1 ? position : this.sizeField.length)

        // position = this.sizeField.indexOf(' X Y C');
        // this.sizeField = this.sizeField.substring(0, position != -1 ? position : this.sizeField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeTypeName = this.defaultGraphTypeField(fieldType, 'name');
        this.localWidget.graphDimensionRight = 140;
    }

    dropRow(ev) {
        // Event trigger when the dragged Field is dropped the Row channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropRow', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Can only create this channel for Single facetted graphs
        if (this.localWidget.graphLayerFacet != 'Single') {
            this.errorMessageEditor = 'Can only add Row to Single facet graphs';
            return;
        };

        // Show X icon
        this.showRowDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.rowField = this.draggedField;
        this.isDragoverRow = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.rowField.indexOf(' X Y C');
        this.rowField = this.rowField.substring(0, position != -1 ? position : this.rowField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropColumn(ev) {
        // Event trigger when the dragged Field is dropped the Column channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Can only create this channel for Single facetted graphs
        if (this.localWidget.graphLayerFacet != 'Single') {
            this.errorMessageEditor = 'Can only add Row to Single facet graphs';
            return;
        };

        // Show X icon
        this.showColumnDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.columnField = this.draggedField;
        this.isDragoverColumn = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.columnField.indexOf(' X Y C');
        this.columnField = this.columnField.substring(0, position != -1 ? position : this.columnField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropDetail(ev) {
        // Event trigger when the dragged Field is dropped the Detail channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropDetail', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show X icon
        this.showDetailDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.detailField = this.draggedField;
        this.isDragoverDetail = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.detailField.indexOf(' X Y C');
        this.detailField = this.detailField.substring(0, position != -1 ? position : this.detailField.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailType = this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailTypeName = this.defaultGraphTypeField(fieldType, 'name');
    }

    dropX2(ev) {
        // Event trigger when the dragged Field is dropped the X2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropX2', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show X icon
        this.showX2DeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.x2Field = this.draggedField;
        this.isDragoverX2 = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.x2Field.indexOf(' X Y C');
        this.x2Field = this.x2Field.substring(0, position != -1 ? position : this.x2Field.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Type =
            this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2TypeName =
            this.defaultGraphTypeField(fieldType, 'name');
    }

    dropY2(ev) {
        // Event trigger when the dragged Field is dropped the Y2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropY2', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show X icon
        this.showY2DeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.y2Field = this.draggedField;
        this.isDragoverY2 = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.y2Field.indexOf(' X Y C');
        this.y2Field = this.y2Field.substring(0, position != -1 ? position : this.y2Field.length)

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Type =
            this.defaultGraphTypeField(fieldType, 'type');
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2TypeName =
            this.defaultGraphTypeField(fieldType, 'name');
    }

    dropProjectionLatitude(ev) {
        // Event trigger when the dragged Field is dropped the Y2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropProjectionLatitude', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show X icon
        this.showProjectionLatitudeDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.projectionFieldLatitude = this.draggedField;
        this.isDragoverProjectionLatitude = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.projectionFieldLatitude.indexOf(' X Y C');
        this.projectionFieldLatitude = this.projectionFieldLatitude.substring(
            0, position != -1 ? position : this.projectionFieldLatitude.length);

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude =
            this.projectionFieldLatitude;
    }

    dropProjectionLongitude(ev) {
        // Event trigger when the dragged Field is dropped the Y2 channel
        this.globalFunctionService.printToConsole(this.constructor.name,'dropProjectionLongitude', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show X icon
        this.showProjectionLongitudeDeleteIcon = true;

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");

        this.projectionFieldLongitude = this.draggedField;
        this.isDragoverProjectionLongitude = false;

        // Replace letter-buttons.  NB: this must sync with HTML code
        let position: number = this.projectionFieldLongitude.indexOf(' X Y C');
        this.projectionFieldLongitude = this.projectionFieldLongitude.substring(
            0, position != -1 ? position : this.projectionFieldLongitude.length);

        let fieldType:string = this.getFieldType(this.draggedField);
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLongitude =
            this.projectionFieldLongitude;
    }

    clickClearXField() {
        // Clear the X Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearXField', '@Start');

        // Reset fields
        this.errorMessageEditor = '';
        this.showXDeleteIcon = false;
        this.xField = dragFieldMessage;

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregate = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaggregateName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXbin = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXMaxBins = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXformat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXimpute = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXimputeValue = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXstack = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXsort = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtypeName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtimeUnit = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisTitleCheckbox = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisTitle = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelAngle = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainStart = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisScaleDomainEnd = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGrid = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColor = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColorName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabels = true;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColor = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColorName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelsLength = 0;

        // Hide the panel with properties
        this.showFieldXPropertiesTitle = false;
        this.showFieldXProperties = false;
        this.showFieldXPropertiesField = false;
        this.showFieldXPropertiesAxis = false;
    }

    clickClearYField() {
        // Clear the Y Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearYField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showYDeleteIcon = false;
        this.yField = dragFieldMessage;

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaggregate = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaggregateName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYbin = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYMaxBins = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYformat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYimpute = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYimputeValue = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYstack = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYsort = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtypeName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtimeUnit = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisTitleCheckbox = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisTitle = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelAngle = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainStart = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisScaleDomainEnd = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGrid = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColor = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColorName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabels = true;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColor = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColorName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelsLength = 0;

        // Hide the panel with properties
        this.showFieldYPropertiesTitle = false;
        this.showFieldYProperties = false;
        this.showFieldYPropertiesField = false;
        this.showFieldYPropertiesAxis = false;
    }

    clickClearColourField() {
        // Clear the Colour Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregateName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregate = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorBin = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorMaxBins = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorImpute = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorImputeValue = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorStack = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorSort = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTypeName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendTitle = '';

        this.showColourDeleteIcon = false;
        this.colorField = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregate = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorAggregateName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorBin = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorMaxBins = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorImpute = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorImputeValue = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorScheme = 'blues';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorStack = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorSort = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTypeName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendAxisScaleType = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendTitleCheckbox = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendTitle = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendFormat = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabels = true;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColor = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColorName = '';
        // this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelsLength = 0;

        // Hide the panel with properties
        this.showFieldColorPropertiesTitle = false;
        this.showFieldColorProperties = false;
        this.showFieldColorPropertiesField = false;
        this.showFieldColorPropertiesLegend = false;

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField == ''  &&  this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField == '') {
            this.localWidget.graphDimensionRight = 0;
        };

    }

    clickClearSizeField() {
        // Clear the Size Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearSizeField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showSizeDeleteIcon = false;
        this.sizeField = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeAggregateName = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeAggregate = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeBin = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeMaxBins = 0;

        // Hide the panel with properties
        this.showFieldSizeProperties = false;

    }

    clickClearRowField() {
        // Clear the Row Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showRowDeleteIcon = false;
        this.rowField = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField = '';

        // Hide the panel with properties
        this.showFieldRowProperties = false;

    }

    clickClearColumnField() {
        // Clear the Column Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showColumnDeleteIcon = false;
        this.columnField = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField = '';

        // Hide the panel with properties
        this.showFieldColumnProperties = false;

    }

    clickClearDetailField() {
        // Clear the Detail Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearDetailField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showDetailDeleteIcon = false;
        this.detailField = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField = '';

        // Hide the panel with properties
        this.showFieldDetailProperties = false;

    }

    clickClearX2Field() {
        // Clear the X2 Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearX2Field', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showX2DeleteIcon = false;
        this.x2Field = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field = '';

        // Hide the panel with properties
        this.showFieldX2Properties = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2AggregateName = '';

    }

    clickClearY2Field() {
        // Clear the Y2 Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearY2Field', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showY2DeleteIcon = false;
        this.y2Field = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field = '';

        // Hide the panel with properties
        this.showFieldY2Properties = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2AggregateName = '';

    }

    clickClearProjectionField() {
        // Clear the Projection Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearProjectionField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showProjectionDeleteIcon = false;
        this.projectionField = '';
        this.projectionFieldLatitude = dragFieldMessage;
        this.projectionFieldLongitude = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionType = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude = '';
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLongitude = '';

        // Hide the panel with properties
        this.showFieldProjectionProperties = false;

    }

    clickClearProjectionFieldLatitude() {
        // Clear the Projection Latitude Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearProjectionFieldLatitude', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showProjectionLatitudeDeleteIcon = false;
        this.projectionFieldLatitude = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude = '';

        // Hide the panel with properties if not fields selected
        if (this.projectionFieldLatitude == dragFieldMessage
            &&
            this.projectionFieldLongitude == dragFieldMessage) {
            this.showFieldProjectionProperties = false;
        };
    }

    clickClearProjectionFieldLongitude() {
        // Clear the Projection Longitude Field and Remove X icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearProjectionFieldLongitude', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showProjectionLongitudeDeleteIcon = false;
        this.projectionFieldLongitude = dragFieldMessage;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude = '';


        // Hide the panel with properties if not fields selected
        if (this.projectionFieldLatitude == dragFieldMessage
            &&
            this.projectionFieldLongitude == dragFieldMessage) {
            this.showFieldProjectionProperties = false;
        };

    }

    clickClearMark() {
        // Clear the Mark properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearMark', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkLine = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPoint = false;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkCornerRadius = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkOpacity = 1;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkBinSpacing = 0;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkOrient = 'Horizontal';

        // Hide the panel with properties
        this.showFieldMarkProperties = false;

    }

    dragenterXField(ev, actionName: string) {
        // Event trigger when dragged field enters XField
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterXField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = true;
        this.isDragoverYField = false;
        this.dragoverColours = false;
    }

    dragenterYField(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterYField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
        this.isDragoverYField = true;
        this.dragoverColours = false;
    }

    dragenterColour(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColour', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
        this.isDragoverYField = false;
        this.dragoverColours = true;
    }

    dragenterSize(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterSize', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverSizes = true;
        // this.dragoverColours = false;
    }

    dragenterRow(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterRow', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverRow = true;
        // this.dragoverColours = false;
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverColumn = true;
        // this.dragoverColours = false;
    }

    dragenterDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterDetail', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverDetail = true;
        // this.dragoverColours = false;
    }

    dragenterX2(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterX2', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverX2 = true;
        // this.dragoverColours = false;
    }

    dragenterY2(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterY2', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverY2 = true;
        // this.dragoverColours = false;
    }

    dragenterProjection(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Projection field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterProjection', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverProjection = true;
        // this.dragoverColours = false;
    }

    dragenterProjectionLatitude(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the ProjectionLatitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterProjectionLatitude', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverProjectionLatitude = true;
        // this.dragoverColours = false;
    }

    dragenterProjectionLongitude(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the ProjectionLongitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterProjectionLongitude', '@Start');

        ev.preventDefault();
        // this.dragoverCol = false;
        this.isDragoverProjectionLongitude = true;
        // this.dragoverColours = false;
    }

    dragleaveXField(ev, actionName: string) {
        // Event trigger when dragged field leave XField
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveXField', '@Start');

        ev.preventDefault();
        this.isDragoverXField = false;
    }

    dragleaveYField(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveYField', '@Start');

        ev.preventDefault();
        this.isDragoverYField = false;
    }

    dragleaveColour(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColour', '@Start');

        ev.preventDefault();
        this.dragoverColours = false;
    }

    dragleaveSize(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Size field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveSize', '@Start');

        ev.preventDefault();
        this.isDragoverSizes = false;
    }

    dragleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveRow', '@Start');

        ev.preventDefault();
        this.isDragoverRow = false;
    }

    dragleaveColumn(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColumn', '@Start');

        ev.preventDefault();
        this.isDragoverColumn = false;
    }

    dragleaveDetail(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Detail field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveDetail', '@Start');

        ev.preventDefault();
        this.isDragoverDetail = false;
    }

    dragleaveX2(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the X2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveX2', '@Start');

        ev.preventDefault();
        this.isDragoverX2 = false;
    }

    dragleaveY2(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Y2 field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveY2', '@Start');

        ev.preventDefault();
        this.isDragoverY2 = false;
    }

    dragleaveProjection(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Projection field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveProjection', '@Start');

        ev.preventDefault();
        this.isDragoverProjection = false;
    }

    dragleaveProjectionLatitude(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the ProjectionLatitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveProjectionLatitude', '@Start');

        ev.preventDefault();
        this.isDragoverProjectionLatitude = false;
    }

    dragleaveProjectionLongitude(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the ProjectionLongitude field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveProjectionLongitude', '@Start');

        ev.preventDefault();
        this.isDragoverProjectionLongitude = false;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickDSrow(index, datasourceID: number) {
        // Set the selected datasourceID
        // NOTE: this array can be filtered on front-end, thus DON'T use index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        // Reset, Highlight selected row
        this.selectedRowIndex = index;
        let arrayIndex: number = this.localDatasources.findIndex(ds => ds.id == datasourceID);
        this.selectedRowID = datasourceID;
        this.selectedDSName = this.localDatasources[arrayIndex].name.slice(0,22) +
            (this.localDatasources[arrayIndex].name.length > 22?  '...'  :  '');
        this.selectedDescription = this.localDatasources[arrayIndex].description;
        this.errorMessage = '';
        this.currentData = null;

        // Warn user
        if (!this.newWidget  &&  this.hasCalculationsOrFilters
            && this.globalVariableService.previousGraphEditDSID != datasourceID) {
            this.errorMessage = 'Warning: if you click Continue, calculated fields and filters of this graph will be lost!';
        } else {
            this.errorMessage = '';
        };

        // // Clear previous selected fields
        // this.showXDeleteIcon = false;
        // this.xField = dragFieldMessage;

        // this.showYDeleteIcon = false;
        // this.yField = dragFieldMessage;

        // this.showColourDeleteIcon = false;
        // this.colorField = dragFieldMessage;

        // this.showSizeDeleteIcon = false;
        // this.sizeField = dragFieldMessage;

        // this.showRowDeleteIcon = false;
        // this.rowField = dragFieldMessage;

        // this.showColumnDeleteIcon = false;
        // this.columnField = dragFieldMessage;

        // this.showDetailDeleteIcon = false;
        // this.detailField = dragFieldMessage;

        // Determine if data already in Glob Var
        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == datasourceID
        );
        console.warn('xx clicked row', dataSetIndex, datasourceID);
        if (dataSetIndex >= 0) {

            // Load local arrays for ngFor - this is required for the Preview
            this.constructDataSchema(arrayIndex);

            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            console.log('xx this.currentData', this.currentData)

            // Nr rows
            this.nrRows = this.globalVariableService.currentDatasets[dataSetIndex].data.length;

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

            return;
        };

        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(datasourceID).then(res => {

            // Load local arrays for ngFor - this is required for the Preview
            this.constructDataSchema(arrayIndex);
            console.log('WE this.globalVariableService.currentDatasets', this.globalVariableService.currentDatasets)

            // Determine if data obtains in Glob Var
            dataSetIndex = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == datasourceID
            );
            if (dataSetIndex < 0) {
                this.errorMessage = 'The Data not yet available (click again to retry) ...';
                return;
            };

            // Nr rows
            this.nrRows = this.globalVariableService.currentDatasets[dataSetIndex].data.length;

            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

        })
        .catch(err => {
            this.errorMessage = err;
            return;
        });

        console.warn('xx clicked row', dataSetIndex);

    }

    clickDSfilter(index, datasourceID: number) {
        // Show the DS Filter Area for a DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSfilter', '@Start');

        this.selectedRowIndex = index;
        let arrayIndex: number = this.localDatasources.findIndex(ds => ds.id == datasourceID);
        this.selectedRowID = datasourceID;

        this.showDSfilterArea = true;
    }

    clickDSfilterClose() {
        // Close the DS Filter Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSfilterClose', '@Start');

         this.showDSfilterArea = false;
    }

    clickContinue() {
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

        // If a new DS, clear out info for old one
        if (this.globalVariableService.previousGraphEditDSID != this.selectedRowID) {

            // Determine if data obtains in Glob Var
            let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == this.selectedRowID
            );
            if (dataSetIndex < 0) {
                this.errorMessage = 'Error! The Data does not exist in currentDatasets array';
                return;
            };

            // Fill in data info
            this.localWidget.datasourceID = this.selectedRowID;
            this.localWidget.datasetID = this.globalVariableService.
                currentDatasets[dataSetIndex].id;
            this.localWidget.graphData = this.globalVariableService
                .currentDatasets[dataSetIndex].data;

            // Reset
            if (this.globalVariableService.previousGraphEditDSID != this.selectedRowID) {

                // Reset
                this.hasCalculationsOrFilters = false;
                this.localWidget.graphCalculations = [];
                this.localWidget.graphFilters = [];

                // Load local arrays for ngFor
                this.constructDataSchema(this.selectedRowIndex);
            };

            this.localWidget.graphLayers = [];
            this.graphLayers = [1];
            this.localWidget.graphLayers.push(
                JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplateInner))
            );
            this.currentGraphLayer = 1;
            this.filterNrActive = 0;
            this.clickClearXField();
            this.clickClearYField();
            this.clickClearColourField();
            this.clickClearSizeField();
            this.clickClearDetailField();
            this.clickClearColumnField();
            this.clickClearRowField();
            this.clickClearX2Field();
            this.clickClearY2Field();
            this.clickClearMark();
            this.clickClearProjectionField();

            this.clickCalculatedClear();
            this.clickFilterClear();

            // Clear condition fields
            this.conditionColour = '';
            this.conditionColourName = '';
            this.conditionFieldName = '';
            this.conditionOperator = '';
            this.conditionValue = '';

            // Clear History
            this.graphHistory = [];
            this.graphHistoryPosition = 0;
            this.graphHeader = '';
            this.showGraphAreaTitle = false;

            // Remember ID for next time
            this.globalVariableService.previousGraphEditDSID = this.selectedRowID;
        };

        // Show the Editor form
        this.showDatasourceMain = false;

    }

    defaultGraphTypeField(fieldType: string, typeOrName: string): string {
        // Returns the default Vega field type depending a given field types
        this.globalFunctionService.printToConsole(this.constructor.name,'defaultGraphTypeField', '@Start');

        if (fieldType == 'string'  ||  fieldType == ''  ||  fieldType == null) {
            if (typeOrName == 'name') {
                return 'Ordinal';
            } else {
                return 'ordinal';
            };
        };
        if (fieldType.toLowerCase() == 'number') {
            if (typeOrName == 'name') {
                return 'Quantitative';
            } else {
                return 'quantitative';
            };
        };
        if (fieldType.toLowerCase() == 'boolean') {
            if (typeOrName == 'name') {
                return 'Nominal';
            } else {
                return 'nominal';
            };
        };
        if (fieldType.toLowerCase() == 'date') {
            if (typeOrName == 'name') {
                return 'Temporal';
            } else {
                return 'temporal';
            };
        };
    }

    getFieldType(fieldName: string): string {
        // Returns the field type of a given field name
        this.globalFunctionService.printToConsole(this.constructor.name,'getFieldType', '@Start');

        for (var i = 0; i < this.dataSchema.length; i++) {
            if (this.dataSchema[i].name == fieldName) {
                return this.dataSchema[i].type;
            }
        };

        // Was not found, defaults
        return 'string';
    }

    // TODO - do one or the other: 3 vars, or 1 combined object
    constructDataSchema(arrayIndex: number) {
        // Construct combined object for fields
        this.globalFunctionService.printToConsole(this.constructor.name,'constructDataSchema', '@Start');

        // Fill dataSchema
        this.dataSchema = [];

        if (arrayIndex >= 0) {
            for (let i = 0; i < this.localDatasources[arrayIndex].dataFields.length; i++) {
                let newDataSchema: dataSchemaInterface = {
                    name: this.localDatasources[arrayIndex].dataFields[i],
                    type: this.localDatasources[arrayIndex].dataFieldTypes[i],
                    typeName: this.localDatasources[arrayIndex].dataFieldTypes[i],
                    length: this.localDatasources[arrayIndex].dataFieldLengths[i],
                    isCalculated: false,
                    calculatedExpression: ''
                };
                this.dataSchema.push(newDataSchema);
            };
        };

        // Append calculated Fields
        this.localWidget.graphCalculations.forEach(gcal => {
            let newDataSchema: dataSchemaInterface = {
                name: gcal.calculatedAs,
                type: gcal.calculatedDataType,
                typeName: gcal.calculatedDataType,
                length: 12,
                isCalculated: true,
                calculatedExpression: gcal.calculatedExpression
            };
            this.dataSchema.push(newDataSchema);
        });
        console.warn('xx this.dataSchema', this.dataSchema);

    }

    clickShowDatasources() {
        // Show Datasources
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowDatasources', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.showDatasourceMain = true;
    }

    clickShowXProperties() {
        // Show X Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldXProperties = !this.showFieldXProperties;
        this.showFieldXPropertiesField = false;
        this.showFieldXPropertiesAxis = false;
    }

    clickShowXPropertiesField() {
        // Show X Properties Field Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXPropertiesField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldXPropertiesField = !this.showFieldXPropertiesField;
    }

    clickShowXPropertiesAxis() {
        // Show X Properties Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowXPropertiesAxis', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldXPropertiesAxis = !this.showFieldXPropertiesAxis;
    }

    clickShowYPropertiesField() {
        // Show Y Properties Field Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYPropertiesField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldYPropertiesField = !this.showFieldYPropertiesField;
    }

    clickShowYPropertiesAxis() {
        // Show Y Properties Axis Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYPropertiesAxis', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldYPropertiesAxis = !this.showFieldYPropertiesAxis;

    }

    clickShowColorPropertiesField() {
        // Show Color Properties Field Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColorPropertiesField', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldColorPropertiesField = !this.showFieldColorPropertiesField;
    }

    clickShowColorPropertiesLegend() {
        // Show Color Properties Legend Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColorPropertiesLegend', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldColorPropertiesLegend = !this.showFieldColorPropertiesLegend;

    }

    clickShowColorProperties() {
        // Show Color Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColorProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldColorProperties = !this.showFieldColorProperties;
        this.showFieldColorPropertiesField = false;
        this.showFieldColorPropertiesLegend = false;
    }

    clickShowMarkProperties() {
        // Show Mark Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowMarkProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldMarkProperties = !this.showFieldMarkProperties;
    }

    clickShowDetailProperties() {
        // Show Detail Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowDetailProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldDetailProperties = !this.showFieldDetailProperties;
    }

    clickShowX2Properties() {
        // Show X2 Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowX2Properties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldX2Properties = !this.showFieldX2Properties;
    }

    clickShowY2Properties() {
        // Show Y2 Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowY2Properties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldY2Properties = !this.showFieldY2Properties;
    }

    clickShowProjectionProperties() {
        // Show Projection Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowProjectionProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldProjectionProperties = !this.showFieldProjectionProperties;
    }

    clickShowTitleProperties() {
        // Show Title Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowTitleProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldTitleProperties = !this.showFieldTitleProperties;
    }

    clickShowYProperties() {
        // Show Y Properties Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowYProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldYProperties = !this.showFieldYProperties;
        this.showFieldYPropertiesField = false;
        this.showFieldYPropertiesAxis = false;
    }

    clickShowSelection() {
        // Show Selection Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSelection', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showSelectionFilter = !this.showSelectionFilter;
    }

    clickShowSizeProperties() {
        // Show Size Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSizeProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldSizeProperties = !this.showFieldSizeProperties;
    }

    clickShowRowProperties() {
        // Show Row Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowRowProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldRowProperties = !this.showFieldRowProperties;
    }

    clickShowColumnProperties() {
        // Show Column Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowColumnProperties', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Toggle
        this.showFieldColumnProperties = !this.showFieldColumnProperties;
    }

    clickSelectXGridColor(ev: any) {
        // Select Colour for X gridlines
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectXGridColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColor = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisGridColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectXLabelColor(ev: any) {
        // Select Colour for X labels
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectXLabelColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColor = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXaxisLabelColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectYGridColor(ev: any) {
        // Select Colour for Y gridlines
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectYGridColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColor = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisGridColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectLegendLabelColor(ev: any) {
        // Select Colour for Legend gridlines
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectLegendLabelColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColor = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphLegendLabelColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectYLabelColor(ev: any) {
        // Select Colour for Y labels
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectYLabelColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColor = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYaxisLabelColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectBackgroundColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBackgroundColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphBackgroundColorName = ev.target.value;
        this.localWidget.graphBackgroundColor = this.localWidget.graphBackgroundColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphBackgroundColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphBackgroundColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectBorderColor(ev: any) {
        // Select Border Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBorderColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphBorderColorName = ev.target.value;
        this.localWidget.graphBorderColor = this.localWidget.graphBorderColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphBorderColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphBorderColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectTitleColor(ev: any) {
        // Select Title Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTitleColor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphTitleColorName = ev.target.value;
        this.localWidget.graphTitleColor = this.localWidget.graphTitleColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphTitleColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphTitleColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectMarkColour(ev: any) {
        // Select Background Colour for the Mark, if Color field not used
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectMarkColour', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkColourName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkColour =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkColourName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkColour =
                this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickSelectMarkPointColour(ev: any) {
        // Select point Colour (line and area)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectMarkPointColour', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPointColorName = ev.target.value;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPointColor =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPointColorName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPointColorName
        );
        if (localIndex >= 0) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMarkPointColor = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickXBin() {
        // Reset Size X Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickXBin', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXbin) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXMaxBins = 0;
        };
    }

    clickYBin() {
        // Reset Size Y Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickYBin', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYbin) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYMaxBins = 0;
        };
    }

    clickColorBin() {
        // Reset Size Color Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColorBin', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorBin) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorMaxBins = 0;
        };
    }

    clickSizeBin() {
        // Reset Size Bin Max
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSizeBin', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeBin) {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeMaxBins = 0;
        };
    }

    clickXfield() {
        // Show the X field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickXfield', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.xField == dragFieldMessage  ||  this.xField == null) {
            return;
        };

        this.showFieldXProperties = !this.showFieldXProperties;
        this.showFieldYProperties = false;
        this.showFieldColorProperties = false;
    }

    clickYfield() {
        // Show the Y field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickYfield', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.yField == dragFieldMessage  ||  this.yField == null) {
            return;
        };

        this.showFieldXProperties = false;
        this.showFieldYProperties = !this.showFieldYProperties;
        this.showFieldColorProperties = false;
    }

    clickColorfield() {
        // Show the Color field properties
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColorfield', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.colorField == dragFieldMessage  ||  this.colorField == null) {
            return;
        };

        this.showFieldXProperties = false;
        this.showFieldYProperties = false;
        this.showFieldColorProperties = !this.showFieldColorProperties;
    }

    changeXType(ev: any) {
        // Set Type and Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeXType', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype =  ev.target.value.toLowerCase();

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtype != 'Temporal') {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXtimeUnit = '';
        };
    }

    changeYType(ev: any) {
        // Set Type and Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeYType', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype =  ev.target.value.toLowerCase();

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtype != 'Temporal') {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYtimeUnit = '';
        };
    }

    changeColorType(ev: any) {
        // Set Type and Remove timeUnit if Type is not Temporal
        this.globalFunctionService.printToConsole(this.constructor.name,'changeColorType', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType =  ev.target.value.toLowerCase();

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorType != 'Temporal') {
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorTimeUnit = '';
        };
    }

    clickShowFilterArea() {
        // Show Filter Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFilterArea', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Reset
        this.filterErrorMessage = '';

        this.showFilterAreaProperties = true;
        this.showConditionAreaProperties = false;
        this.showCalculatedAreaProperties = false;
    }

    clickShowConditionArea() {
        // Show Condition Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowConditionArea', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Reset
        this.conditionErrorMessage = '';

        this.showConditionAreaProperties = true;
        this.showFilterAreaProperties = false;
        this.showCalculatedAreaProperties = false;
    }

    clickShowCalculatedArea() {
        // Show Calculated Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowCalculatedArea', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Reset
        this.calculatedErrorMessage = '';

        this.showCalculatedAreaProperties = true;
        this.showFilterAreaProperties = false;
        this.showConditionAreaProperties = false;
    }

    calculatedFieldTypeSelected(ev) {
        // Register Calculated Field Type
        this.globalFunctionService.printToConsole(this.constructor.name,'calculatedFieldTypeSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.calculatedDataTypeName = ev.target.value;
        this.calculatedDataType = this.convertToCalculatedDataType(this.calculatedDataTypeName);

    }

    clickShowSpecificationArea() {
        // Toggle between Graph and Specification
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowSpecificationArea', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Show spec
        if (!this.showSpecification) {
            this.specificationJSON = JSON.parse(JSON.stringify(this.specification));
            this.specificationJSON['data'] = null;
            this.specificationJSON = JSON.stringify(this.specificationJSON);
        };

        this.showSpecification =!this.showSpecification;

    }

    clickFilterClose() {
        // Close the Filter Area, with no changes to the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterClose', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Reset
        this.filterErrorMessage = '';

        this.filterNrActive = this.localWidget.graphFilters.filter(gflt => gflt.isActive).length;
        this.showFilterAreaProperties = false;
    }

    clickGraphFilterRowSelect(index: number, selectedFilterID : number) {
        // Selected a Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGraphFilterRowSelect', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set highlighted row
        this.selectedGraphFilterRowIndex = index;

        // Store vars
        let gridFilterIndex: number = this.localWidget.graphFilters.findIndex(gflt =>
            gflt.id == selectedFilterID);
        if (gridFilterIndex >= 0) {
            this.filterID = this.localWidget.graphFilters[gridFilterIndex].id;
            this.filterFieldName = this.localWidget.graphFilters[gridFilterIndex].filterFieldName;
            this.filterOperator = this.localWidget.graphFilters[gridFilterIndex].filterOperator;
            this.filterTimeUnit = this.localWidget.graphFilters[gridFilterIndex].filterTimeUnit;
            this.filterValue = this.localWidget.graphFilters[gridFilterIndex].filterValue;
            this.filterValueFrom = this.localWidget.graphFilters[gridFilterIndex].filterValueFrom;
            this.filterValueTo = this.localWidget.graphFilters[gridFilterIndex].filterValueTo;

        } else {
            this.filterID = -1;
            this.filterFieldName = '';
            this.filterOperator = '';
            this.filterTimeUnit = '';
            this.filterValue = '';
            this.filterValueFrom = '';
            this.filterValueTo = '';
        };
    }

    clickFilterClear() {
        // Clear the Filter fields
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterClear', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.filterID = -1;
        this.filterFieldName = '';
        this.filterOperator = '';
        this.filterTimeUnit = '';
        this.filterValue = '';
        this.filterValueFrom = '';
        this.filterValueTo = '';

        // Unselect the highlighted row
        this.selectedGraphFilterRowIndex = -1;
    }

    dblClickFilterMakeInActive(filterID: number) {
        // Make selected Filter inActive
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFilterMakeInActive', '@Start');

        // Reset
        this.filterErrorMessage = '';

        let gridFilterIndex: number = this.localWidget.graphFilters.findIndex(gflt =>
            gflt.id == this.filterID);
        if (gridFilterIndex >= 0) {
            this.localWidget.graphFilters[gridFilterIndex].isActive = false;
        };
    }

    dblClickFilterMakeActive(filterID: number) {
        // Make selected Filter Active
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFilterMakeActive', '@Start');

        // Reset
        this.filterErrorMessage = '';

        let gridFilterIndex: number = this.localWidget.graphFilters.findIndex(gflt =>
            gflt.id == this.filterID);
        if (gridFilterIndex >= 0) {
            this.localWidget.graphFilters[gridFilterIndex].isActive = true;
        };
    }

    dblClickFilterDelete() {
        // Delete the selected Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFilterDelete', '@Start');

        // Reset
        this.filterErrorMessage = '';

        let gridFilterIndex: number = this.localWidget.graphFilters.findIndex(gflt =>
            gflt.id == this.filterID);
        if (gridFilterIndex >= 0) {
            this.localWidget.graphFilters.splice(gridFilterIndex, 1);
        };

        // Reset
        this.clickFilterClear();
    }

    clickFilterAdd() {
        // Add a Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFilterAdd', '@Start');

        // Reset
        this.filterErrorMessage = '';

        // Get field type.tolower()
        let fieldTypeLower: string = this.getFieldType(this.filterFieldName).toLowerCase();

        // Validation
        if (this.filterFieldName == ''  ||  this.filterFieldName == undefined) {
            this.filterErrorMessage = 'Filter field is required.';
            return;
        };
        if (this.filterOperator == ''  ||  this.filterOperator == undefined) {
            this.filterErrorMessage = 'Filter Operator is required.';
            return;
        };
        if (this.filterOperator != 'Valid'  &&  this.filterOperator != 'Range') {
            if (this.filterValue == ''  ||  this.filterValue == undefined) {
                this.filterErrorMessage = 'Filter Value is required.';
                return;
            };
        };
        if (this.filterOperator == 'Range') {
            if (this.filterValueFrom == ''  ||  this.filterValueFrom == undefined) {
                this.filterErrorMessage = 'Filter From Value is required.';
                return;
            };
            if (this.filterValueTo == ''  ||  this.filterValueTo == undefined) {
                this.filterErrorMessage = 'Filter To Value is required.';
                return;
            };
        };
        if (this.filterOperator == 'Range'
            &&
            fieldTypeLower != 'number') {
            this.filterErrorMessage = 'Range only applies to Numbers.';
            return;
        };
        if (this.filterOperator == 'Valid'
            &&
            fieldTypeLower != 'number') {
            this.filterErrorMessage = 'Valid only applies to Numbers.';
            return;
        };
        if (this.filterOperator == 'One Of'
            &&
            fieldTypeLower != 'string') {
            this.filterErrorMessage = 'One Of only applies to Strings.';
            return;
        };

        // Create the filter spec with Max ID
        if (this.localWidget.graphFilters == null) {
            this.localWidget.graphFilters = [];
            this.filterNrActive = 0;
        };
        if (this.filterID == -1) {

            let graphFilterID: number = 0;
            this.localWidget.graphFilters.forEach(gflt => {
                if(gflt.id > graphFilterID) {
                    graphFilterID = gflt.id;
                };
                graphFilterID = graphFilterID + 1;
            });
            this.filterID = graphFilterID;

            let graphFilter: GraphFilter = {
                id: this.filterID,
                sequence: 0,        // For LATER use
                filterFieldName: this.filterFieldName,
                filterOperator: this.filterOperator,
                filterTimeUnit: this.filterTimeUnit,
                filterValue: this.filterValue,
                filterValueFrom: this.filterValueFrom,
                filterValueTo: this.filterValueTo,
                isActive: true
            };

            // Update the localWidget
            this.localWidget.graphFilters.push(graphFilter);
        } else {
            let gridFilterIndex: number = this.localWidget.graphFilters.findIndex(gflt =>
                gflt.id == this.filterID);
            if (gridFilterIndex >= 0) {
                this.localWidget.graphFilters[gridFilterIndex].filterFieldName =
                    this.filterFieldName;
                this.localWidget.graphFilters[gridFilterIndex].filterOperator =
                    this.filterOperator;
                this.localWidget.graphFilters[gridFilterIndex].filterTimeUnit =
                    this.filterTimeUnit;
                this.localWidget.graphFilters[gridFilterIndex].filterValue =
                    this.filterValue;
                this.localWidget.graphFilters[gridFilterIndex].filterValueFrom =
                    this.filterValueFrom;
                this.localWidget.graphFilters[gridFilterIndex].filterValueTo =
                    this.filterValueTo;
            };

        };

        // Clear out form
        this.clickFilterClear()
    }

    filterFieldSelected(ev) {
        // Selected a Filter Field
        this.globalFunctionService.printToConsole(this.constructor.name,'filterFieldSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.filterFieldName = ev.target.value;
    }

    filterOperatorSelected(ev) {
        // Selected a Filter Operator
        this.globalFunctionService.printToConsole(this.constructor.name,'filterOperatorSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.filterOperator = ev.target.value;
    }

    filterTimeUnitSelected(ev) {
        // Selected a Filter TimeUnit
        this.globalFunctionService.printToConsole(this.constructor.name,'filterTimeUnitSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.filterTimeUnit = ev.target.value;
    }

    changeConditionFieldSelected(ev) {
        // Selected a Condition Field
        this.globalFunctionService.printToConsole(this.constructor.name,'changeConditionFieldSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionFieldName = ev.target.value;
    }

    clickSelectConditionColour(ev: any) {
        // Select Background Colour for the Condition
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectConditionColour', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.conditionColourName = ev.target.value;
        this.conditionColour = this.conditionColourName;
        let localIndex: number = this.backgroundcolors.findIndex(bg =>
            bg.name == this.conditionColourName
        );
        if (localIndex >= 0) {
            this.conditionColour = this.backgroundcolors[localIndex].cssCode;
        };
    }

    clickConditionDelete() {
        // Delete a Condition
        this.globalFunctionService.printToConsole(this.constructor.name,'clickConditionDelete', '@Start');

        this.conditionColour = '';
        this.conditionColourName = '';
        this.conditionFieldName = '';
        this.conditionOperator = '';
        this.conditionValue = '';

        // Save
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColourName =
            this.conditionColourName;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColour =
            this.conditionColour;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionFieldName =
            this.conditionFieldName;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionOperator =
            this.conditionOperator;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionValue =
            this.conditionValue;

    }

    clickConditionSave() {
        // Add a Condition
        this.globalFunctionService.printToConsole(this.constructor.name,'clickConditionSave', '@Start');

        // Reset
        this.conditionErrorMessage = '';

        // Validation
        if (this.conditionFieldName == ''  ||  this.conditionFieldName == undefined) {
            this.conditionErrorMessage = 'Condition field is required.';
            return;
        };
        if (this.conditionOperator == ''  ||  this.conditionOperator == undefined) {
            this.conditionErrorMessage = 'Condition Operator is required.';
            return;
        };
        if (this.conditionOperator != 'Valid'  &&  this.conditionOperator != 'Range') {
            if (this.conditionValue == ''  ||  this.conditionValue == undefined) {
                this.conditionErrorMessage = 'Condition Value is required.';
                return;
            };
        };

        // Create the condition spec
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColourName =
            this.conditionColourName;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColour =
            this.conditionColour;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionFieldName =
            this.conditionFieldName;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionOperator =
            this.conditionOperator;
        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionValue =
            this.conditionValue;

        // Clear out form
        this.clickConditionClose()
    }

    clickConditionClose() {
        // Close the Condition Area, with no changes to the Conditions
        this.globalFunctionService.printToConsole(this.constructor.name,'clickConditionClose', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Reset
        this.conditionErrorMessage = '';

        this.showConditionAreaProperties = false;
    }

    changeConditionOperatorSelected(ev) {
        // Selected a Condition Operator
        this.globalFunctionService.printToConsole(this.constructor.name,'changeConditionOperatorSelected', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionOperator = ev.target.value;
    }

    clickCalculatedClose() {
        // Close the Calculated Area, and reset calculation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedClose', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Close Calc and its help form
        this.showCalculatedAreaProperties = false;
        this.showCalculatedHelp=false
    }

    clickGraphCalculatedRowSelect(index: number, selectedCalculatedID : number) {
        // Delete the selected Calculated
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGraphCalculatedRowSelect', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Set highlighted row
        this.selectedGraphCalculatedRowIndex = index;

        // Store vars
        let gridCalculatedIndex: number = this.localWidget.graphCalculations.findIndex(gflt =>
            gflt.id == selectedCalculatedID);
        if (gridCalculatedIndex >= 0) {
            this.calculatedID = this.localWidget.graphCalculations[gridCalculatedIndex].id;
            this.calculatedExpression = this.localWidget.graphCalculations
                [gridCalculatedIndex].calculatedExpression;
            this.calculatedAs = this.localWidget.graphCalculations
                [gridCalculatedIndex].calculatedAs;
            this.calculatedDataTypeName = this.convertToCalculatedDataTypeName(
                this.localWidget.graphCalculations[gridCalculatedIndex].calculatedDataType
            );

        } else {
            this.calculatedID = -1;
            this.calculatedExpression = '';
            this.calculatedAs = '';
            this.calculatedDataTypeName = '';
        };
    }

    dblClickCalculatedDelete() {
        // Delete the selected Calculated
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickCalculatedDelete', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Remove from other places
        if (this.xField == this.calculatedAs) {
            this.clickClearXField();
        };
        if (this.yField == this.calculatedAs) {
            this.clickClearYField();
        };
        if (this.colorField == this.calculatedAs) {
            this.clickClearColourField();
        };
        if (this.detailField == this.calculatedAs) {
            this.clickClearDetailField;
        };
        if (this.rowField == this.calculatedAs) {
            this.clickClearRowField();
        };
        if (this.columnField == this.calculatedAs) {
            this.clickClearColumnField();
        };
        if (this.x2Field == this.calculatedAs) {
            this.clickClearX2Field;
        };
        if (this.y2Field == this.calculatedAs) {
            this.clickClearY2Field();
        };

        // Remove from localWidget
        if (this.localWidget.graphCalculations == null) {
            this.localWidget.graphCalculations = [];
        };
        let graphCalculatedIndex: number = this.localWidget.graphCalculations.findIndex(gcal =>
            gcal.id == this.calculatedID);
        if (graphCalculatedIndex >= 0) {
            this.localWidget.graphCalculations.splice(graphCalculatedIndex, 1);
        };

        // Remove from local var
        let schemaIndex: number = this.dataSchema.findIndex(ds => ds.name == this.calculatedAs);
        if (schemaIndex >= 0) {
            this.dataSchema.splice(schemaIndex, 1);
        };

        // Remove if used as Filter
        this.localWidget.graphFilters = this.localWidget.graphFilters.filter(gf =>
            gf.filterFieldName != this.calculatedAs
        );
        this.filterNrActive = this.localWidget.graphFilters.filter(gflt => gflt.isActive).length;

        // Reset
        this.clickCalculatedClear();
    }

    clickCalculatedClear() {
        // Close the Calculated Area, and reset calculation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedClear', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Reset values
        this.selectedGraphCalculatedRowIndex = -1;
        this.calculatedID = -1;
        this.calculatedExpression = '';
        this.calculatedAs = '';
        this.calculatedDataType = '';
        this.calculatedDataTypeName = '';
    }

    clickCalculatedApply() {
        // Close the Calculated Area
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCalculatedApply', '@Start');

        // Reset
        this.calculatedErrorMessage = '';

        // Validation
        if (this.calculatedExpression == ''  ||  this.calculatedExpression == undefined) {
            this.calculatedErrorMessage = 'Expression is required.';
            return;
        };
        if (this.calculatedAs == ''  ||  this.calculatedAs == undefined) {
            this.calculatedErrorMessage = 'New field name (As) is required.';
            return;
        };
        if (!isNaN(parseInt(this.calculatedAs.substring(0, 1)))) {
            this.calculatedErrorMessage = 'New field name cannot start with a number.';
            return;
        };

        let regex: any = /[a-z]/g;;
        let found = this.calculatedAs.toLowerCase().match(regex)
        if (found == null  ||  found.length != this.calculatedAs.length) {
            this.calculatedErrorMessage = 'New field name must only consist of letters.';
            return;
        };

        if (this.calculatedDataType == ''  ||  this.calculatedDataType == undefined) {
            this.calculatedErrorMessage = 'Field data type is required.';
            return;
        };
        if ( (this.calculatedExpression.match(new RegExp(/\(/g)) || []).length !=
             (this.calculatedExpression.match(new RegExp(/\)/g)) || []).length
             ) {
            this.calculatedErrorMessage = 'Unequal number of ( and ) brackets';
            return;
        };

        // Add Calculated field to Field List
        if (this.localWidget.graphCalculations == null) {
            this.localWidget.graphCalculations = [];
        };
        let schemaIndex: number = this.dataSchema.findIndex(ds => ds.name == this.calculatedAs);
        if (schemaIndex >= 0) {
            this.dataSchema[schemaIndex].type = this.calculatedDataType;
            this.dataSchema[schemaIndex].typeName = this.calculatedDataTypeName;
            this.dataSchema[schemaIndex].calculatedExpression = this.calculatedExpression;
        } else {
            let newDataSchema: dataSchemaInterface = {
                name: this.calculatedAs,
                type: this.calculatedDataType.toLowerCase(),
                typeName: this.calculatedDataTypeName,
                length: 12,
                isCalculated: true,
                calculatedExpression: this.calculatedExpression
            };
            this.dataSchema.push(newDataSchema);
        };

        // Update the localWidget
        let graphCalculation: GraphCalculation = {
            id: 0,
            sequence: 0,               // Sequence Nr - for LATER user
            calculatedDataType: this.calculatedDataType,
            calculatedExpression: this.calculatedExpression,
            calculatedAs: this.calculatedAs,
        };

        // Add / Update to localWidget
        let transformationIndex: number = this.localWidget.graphCalculations.findIndex(gcal =>
            gcal.calculatedAs == this.calculatedAs);
        if (transformationIndex >= 0) {
            this.localWidget.graphCalculations[transformationIndex].calculatedDataType =
                this.calculatedDataType;
            this.localWidget.graphCalculations[transformationIndex].calculatedExpression =
                this.calculatedExpression;
            this.localWidget.graphCalculations[transformationIndex].calculatedAs =
                this.calculatedAs;
        } else {
            this.localWidget.graphCalculations.push(graphCalculation);
        };

        // Set flag for temporary Calcs
        this.hasCalculationsOrFilters = true;

    }

    dblClickFieldRow(formCalculatedFieldName: string) {
        // Double clicked a field row: show info for calculated field
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFieldRow', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Deal with Calculatd Fields
        let gridCalculatedIndex: number = this.localWidget.graphCalculations.findIndex(gflt =>
            gflt.calculatedAs == formCalculatedFieldName);
        this.selectedGraphCalculatedRowIndex = gridCalculatedIndex;
        if (gridCalculatedIndex >= 0) {
            this.calculatedID = this.localWidget.graphCalculations[gridCalculatedIndex].id;
            this.calculatedExpression = this.localWidget.graphCalculations
                [gridCalculatedIndex].calculatedExpression;
            this.calculatedAs = this.localWidget.graphCalculations
                [gridCalculatedIndex].calculatedAs;
            this.calculatedDataType = this.localWidget.graphCalculations
                [gridCalculatedIndex].calculatedDataType;
            this.calculatedDataTypeName = this.convertToCalculatedDataTypeName(
                this.localWidget.graphCalculations[gridCalculatedIndex].calculatedDataType
            );
            this.showCalculatedAreaProperties = true;
            this.showFilterAreaProperties = false;
            this.showConditionAreaProperties = false;
        } else {
            this.calculatedID = -1;
            this.calculatedExpression = '';
            this.calculatedAs = '';
            this.calculatedDataTypeName = '';
        };
    }

    convertToCalculatedDataTypeName(calculatedDataType: string): string {
        // Converts calculatedDataType to calculatedDataTypeName
        this.globalFunctionService.printToConsole(this.constructor.name,'convertToCalculatedDataTypeName', '@Start');

        if (calculatedDataType == null  ||  calculatedDataType == '') {
            return '';
        };

        let calculatedDataTypeName: string = '';
        calculatedDataTypeName = calculatedDataType.substring(0, 1).toUpperCase() +
            calculatedDataType.substring(1);
        return calculatedDataTypeName;
    }

    convertToCalculatedDataType(calculatedDataTypeName: string): string {
        // Converts calculatedDataTypeName to calculatedDataType
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickFieldRow', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (calculatedDataTypeName == null  ||  calculatedDataTypeName == '') {
            return '';
        };

        let calculatedDataType: string = '';
        calculatedDataType = calculatedDataTypeName.toLowerCase();
        return calculatedDataType;
    }

    loadLocalVarsFromWidget() {
        // Add Fields to selection areas
        this.globalFunctionService.printToConsole(this.constructor.name,'loadLocalVarsFromWidget', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield != null) {
            this.showXDeleteIcon = true;
            this.showFieldXPropertiesTitle = true;
            this.xField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphXfield;

        } else {
            this.showXDeleteIcon = false;
            this.showFieldXPropertiesTitle = false;
            this.xField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield != null) {
            this.showYDeleteIcon = true;
            this.showFieldYPropertiesTitle = true;
            this.yField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphYfield;
        } else {
            this.showYDeleteIcon = false;
            this.showFieldYPropertiesTitle = false;
            this.yField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField != null) {
            this.showColourDeleteIcon = true;
            this.showFieldColorPropertiesTitle = true;
            this.colorField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColorField;
        } else {
            this.showColourDeleteIcon = false;
            this.showFieldColorPropertiesTitle = false;
            this.colorField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField != null) {
            this.showSizeDeleteIcon = true;
            this.sizeField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphSizeField;
        } else {
            this.showSizeDeleteIcon = false;
            this.sizeField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField != null) {
            this.showRowDeleteIcon = true;
            this.rowField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphRowField;
        } else {
            this.showRowDeleteIcon = false;
            this.rowField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField != null) {
            this.showColumnDeleteIcon = true;
            this.columnField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphColumnField;
        } else {
            this.showColumnDeleteIcon = false;
            this.columnField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField != null) {
            this.showDetailDeleteIcon = true;
            this.detailField = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphDetailField;
        } else {
            this.showDetailDeleteIcon = false;
            this.detailField = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field != null) {
            this.showX2DeleteIcon = true;
            this.x2Field = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphX2Field;

        } else {
            this.showX2DeleteIcon = false;
            this.x2Field = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field != null) {
            this.showY2DeleteIcon = true;
            this.y2Field = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphY2Field;

        } else {
            this.showY2DeleteIcon = false;
            this.y2Field = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude != null) {
            this.showProjectionLatitudeDeleteIcon = true;
            this.projectionFieldLatitude = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLatitude;

        } else {
            this.showProjectionLatitudeDeleteIcon = false;
            this.projectionFieldLatitude = dragFieldMessage;
        };

        if (this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLongitude != ''
            &&
            this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLongitude != null) {
            this.showProjectionLongitudeDeleteIcon = true;
            this.projectionFieldLongitude = this.localWidget.graphLayers[this.currentGraphLayer - 1].graphProjectionFieldLongitude;

        } else {
            this.showProjectionLongitudeDeleteIcon = false;
            this.projectionFieldLongitude = dragFieldMessage;
        };

        // Condition Info
        this.conditionColourName =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColourName;
        this.conditionColour =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionColour;
        this.conditionFieldName =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionFieldName;
        this.conditionOperator =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionOperator;
        this.conditionValue =
            this.localWidget.graphLayers[this.currentGraphLayer - 1].conditionValue;

    }

    clickShowFullEditor() {
        // Show the full editor (not W Ed-Lite any more)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFullEditor', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Update the user, reset the list of Graphs to show and remove helper form
        this.globalVariableService.updateCurrentUserProperties(
            { preferenceShowWidgetEditorLite: false }
        );
        this.widgetGraphs = this.widgetGraphsFull.slice().filter(
            wg => wg.visualGrammar==this.localWidget.visualGrammar
        );

        this.showWidgetEditorLite = false;
    }

    clickHelpMessage() {
        // User clicked the Help icons -> give more help
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHelpMessage', '@Start');

        this.errorMessageEditor = 'This is only help text.'
    }

    clickCompositionLayerAdd() {
        // Add a second layer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCompositionLayerAdd', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Validation
        if (this.columnField != dragFieldMessage) {
            this.errorMessageEditor = 'Remove Column field before adding layers';
            return;
        }
        if (this.rowField != dragFieldMessage) {
            this.errorMessageEditor = 'Remove Row field before adding layers';
            return;
        }

        // Add new layer, and set
        this.localWidget.graphLayers.push(
            JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplateInner))
        );

        // Rebuild list to display
        this.graphLayers = [];
        for (let i = 0; i < this.localWidget.graphLayers.length; i++) {
            this.graphLayers.push(i + 1);
        };
        // this.graphLayers.push(this.graphLayers.length + 1);
        this.currentGraphLayer = this.graphLayers.length;

        // Load local Vars from localWidget
        this.loadLocalVarsFromWidget()
    }

    clickCompositionLayerSelect(ev: any) {
        // Select an existing layer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCompositionLayerSelect', '@Start');

        // Reset
        this.errorMessageEditor = '';

        this.currentGraphLayer = +ev.target.value;

        // Load local Vars from localWidget
        this.loadLocalVarsFromWidget()

                // TODO - fix
        // Refresh
        let graphIndex: number = this.widgetGraphs.findIndex(wgr =>
                wgr.mark == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark
        );
        if (graphIndex >= 0) {
            this.showGraph(this.widgetGraphs[graphIndex].id);
        };

    }

    clickCompositionLayerDelete() {
        // Delete selected layer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCompositionLayerDelete', '@Start');

        // Reset
        this.errorMessageEditor = '';

        // Validation
        if (this.localWidget.graphLayers.length == 1) {
            this.errorMessageEditor = 'Cannot delete last layer';
            return;
        };

        this.localWidget.graphLayers.splice(this.currentGraphLayer - 1, 1);

        // Rebuild list to display
        this.graphLayers = [];
        for (let i = 0; i < this.localWidget.graphLayers.length; i++) {
            this.graphLayers.push(i + 1);
        };

        this.currentGraphLayer = 1;

        // Load local Vars from localWidget
        this.loadLocalVarsFromWidget()

                // TODO - fix
        // Refresh
        let graphIndex: number = this.widgetGraphs.findIndex(wgr =>
            wgr.mark == this.localWidget.graphLayers[this.currentGraphLayer - 1].graphMark
        );
        if (graphIndex >= 0) {
            this.showGraph(this.widgetGraphs[graphIndex].id);
        };

    }

    changeFacet() {
        // Change Facet
        this.globalFunctionService.printToConsole(this.constructor.name,'changeFacet', '@Start');

        // Reset
        this.errorMessageEditor = '';

        if (this.localWidget.graphLayerFacet == 'Single'  &&  this.graphLayers.length > 0) {

            this.clickClearRowField();
            this.clickClearColumnField();
            this.currentGraphLayer = 1;
            this.localWidget.graphLayers.splice(1);
            this.graphLayers = [1];

            this.errorMessageEditor = 'Layers 2+, Row, Col deleted.  Used History to go back';

                // TODO - fix
                let widgetGraphIndex: number = this.widgetGraphs.findIndex(
                wg => wg.mark == this.localWidget.graphLayers[0].graphMark
            );
            if (widgetGraphIndex >= 0) {
                this.showGraph(this.widgetGraphs[widgetGraphIndex].id);
            };

        };
    };

    changeVisGrammar() {
         // Change List of visible graphs
         this.globalFunctionService.printToConsole(this.constructor.name,'changeVisGrammar', '@Start');

         // Reset
         this.errorMessageEditor = '';

        this.widgetGraphs = this.widgetGraphsFull.filter(
            wg => wg.visualGrammar==this.localWidget.visualGrammar
        );
    };

    exportAsXLSX():void {
         // Export current Dataset to Excel file
         this.globalFunctionService.printToConsole(this.constructor.name,'exportAsXLSX', '@Start');

         // Reset
         this.errorMessageEditor = '';

        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == this.selectedRowID
        );
        this.excelService.exportAsExcelFile(
            this.globalVariableService.currentDatasets[dataSetIndex].data,
            this.selectedDSName?  this.selectedDSName  :  'Data'
        );
    }
}