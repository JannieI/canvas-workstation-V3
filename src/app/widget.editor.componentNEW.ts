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
import { Datasource }                 from './models';
import { Widget }                     from './models';
import { WidgetLayout }               from './models';
import { WidgetCheckpoint }           from './models';
import { WidgetGraph }                from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

const graphHeight: number = 260;
const graphWidth: number = 420;

export interface dataSchemaInterface {
    name: string;
    type: string;
    length: number
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
                this.clickSave('Saved');
                return;
            }
        };

    }

    colField: string = 'Drag a field here ...';
    containerHasContextMenus: boolean = true;
    containerHasTitle: boolean = true;
    currentData: any = [];
    dataSchema: dataSchemaInterface[] = [];
    dataFieldNames: string[] = [];
    dataFieldLengths: number[] = [];
    dataFieldTypes: string[] = [];
    draggedField: string = '';
    dragoverCol: boolean = false;
    dragoverRow: boolean = false;
    dragoverColours: boolean = false;
    errorMessage: string = '';
    graphColorField: string = 'Drag a field here ...';
    graphColor: string[];
    graphTypeFieldY: string[] =[];
    graphTypeFieldX: string[] =[];
    graphTypeFieldColor: string[] =[];
    isBusyRetrievingData: boolean = false;
    localDatasources: Datasource[] = null;          // Current DS for the selected W
    localWidget: Widget;                            // W to modify, copied from selected
    oldWidget: Widget = null;                       // W at start
    rowField: string = 'Drag a field here ...';
    selectedDescription: string = '';
    selectedFieldIndex: number = -1;
    selectedRowIndex: number = -1;
    selectedRowID: number;
    showColFieldAdvanced: boolean = false;
    showColFieldAdvancedArea: boolean = false;
    showColourDeleteIcon: boolean = false;
    showColumnDeleteIcon: boolean = false;
    showDatasourceMain: boolean = true;
    showPreview: boolean = false;
    showRowFieldAdvanced: boolean = false;
    showRowDeleteIcon: boolean = false;
    showType: boolean = false;
    sortOrder: number = 1;
    widgetGraphs: WidgetGraph[] =[];


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // ngOnInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // if (this.globalVariableService.datasources.length > 0) {
        //     this.selectedDescription = this.globalVariableService.datasources[0].description;
        // };

        this.globalVariableService.getWidgetGraphs().then(res => {
            this.widgetGraphs = res
        });

        if (this.newWidget) {
            // Get DS to which user has permissions
            this.localDatasources = this.globalVariableService.datasources
                .slice()
                .filter(ds =>
                    this.globalVariableService.datasourcePermissionsCheck(ds.id, 'CanView')
                )
                // .sort( (obj1, obj2) => {
                //     if (obj1.name > obj2.name) {
                //         return 1;
                //     };
                //     if (obj1.name < obj2.name) {
                //         return -1;
                //     };
                //     return 0;
                // }
            // );

            // Count the Ws
            let widgets: Widget[];
            this.localDatasources.forEach(ds => {
                widgets = this.globalVariableService.widgets.filter(w => w.datasourceID == ds.id);
                ds.nrWidgets = widgets.length;
            });

            // Create new W
            this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.widgetTemplate))
            this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
            this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
            this.localWidget.widgetType = 'Graph';

            // Populate predefined dimensions
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
        } else {

            // Deep copy original W
            this.oldWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // Deep copy Local W
            this.localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

            // TODO - handle properly and close form
            if (this.localWidget.datasourceID == 0) {
                alert('No Widget was selected, or could not find it in glob vars.  In: ngOnInit, ELSE +- line 170 inside WidgetEditor.ts')
            };

            // Get DS
            this.localDatasources = this.globalVariableService.currentDatasources
                .filter(ds => ds.id == this.localWidget.datasourceID)

            // TODO - handle properly and close form
            if (this.localDatasources.length != 1) {
                alert('Datasource not found in global currentDatasources')
            };

            // Add to axis
            if (this.localWidget.graphXfield != ''   &&   this.localWidget.graphXfield != null) {
                this.showColumnDeleteIcon = true;
                this.colField = this.localWidget.graphXfield;
                this.showColFieldAdvanced = true;

            } else {
                this.showColumnDeleteIcon = false;
                this.colField = '';
            };

            if (this.localWidget.graphYfield != ''   &&   this.localWidget.graphYfield != null) {
                this.showRowDeleteIcon = true;
                this.rowField = this.localWidget.graphYfield;
                this.showRowFieldAdvanced = true;
            } else {
                this.showRowDeleteIcon = false;
                this.rowField = '';
            };

            if (this.localWidget.graphColorField != ''   &&   this.localWidget.graphColorField != null) {
                this.showColourDeleteIcon = true;
                this.graphColorField = this.localWidget.graphColorField;
            } else {
                this.showColourDeleteIcon = false;
                this.graphColorField = '';
            };

            // Get local vars - easier for ngFor
            this.containerHasContextMenus = this.localWidget.containerHasContextMenus;
            this.containerHasTitle = this.localWidget.containerHasTitle;
            this.dataFieldNames = this.localDatasources[0].dataFields;
            this.dataFieldLengths = this.localDatasources[0].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[0].dataFieldTypes;

            this.constructDataSchema();
        }

    }

    ngAfterViewInit() {
        // ngAfterViewInit Life Cycle Hook
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        // Render if Editing an existing one
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        if (!this.newWidget) {
            this.renderGraph(definition);
        }
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    showGraph(graphID: number) {
        // Render the graph on the form.  NOTE: each graph has its own spec and rendering
        // rules.
        this.globalFunctionService.printToConsole(this.constructor.name,'showGraph', '@Start');

        // Get the widgetGraph
        let widgetGraphIndex: number = this.widgetGraphs.findIndex(
            wg => wg.id == graphID);
        if (widgetGraphIndex < 0) {
            this.errorMessage = 'Graph type id = ' + graphID + ' does not exist in the DB';
            return;
        }

        console.warn('xx this.localWidget', this.localWidget);

        // Startup
        let width: number = 400;
        let height: number = 260;
        let specification;              // Vega-Lite, Vega, or other grammar
        let graphVisualGrammar: string = this.widgetGraphs[widgetGraphIndex].visualGrammar;
        let graphShortName: string = this.widgetGraphs[widgetGraphIndex].shortName;

        // Create and parameter fill each defintion
        if (graphID == 1  &&  graphShortName =='Simple Bar Chart') {

            // Enhance W properties
            this.localWidget.graphMark = 'bar';

            // Define Specification
            specification = this.widgetGraphs[widgetGraphIndex].specification;
            if (this.localWidget.graphUrl != ""  &&  this.localWidget.graphUrl != null) {
                specification['data'] = {"url": this.localWidget.graphUrl};
            } else {
                specification['data'] = {"values": this.localWidget.graphData};
            }
            specification['description'] = this.localWidget.graphDescription;
            specification['width'] = width;
            specification['height'] = height;
            // specification['mark']['type'] = this.localWidget.graphMark;
            // specification['mark']['color'] = this.localWidget.graphMarkColor;

            specification['encoding']['x']['field'] = this.localWidget.graphXfield;
            specification['encoding']['x']['type'] = this.localWidget.graphXtype;
            // specification['encoding']['x']['axis']['title'] = this.localWidget.graphXaxisTitle;
            // specification['encoding']['x']['timeUnit'] = this.localWidget.graphXtimeUnit;
            // specification['encoding']['x']['aggregate'] = this.localWidget.graphXaggregate;

            specification['encoding']['y']['field'] = this.localWidget.graphYfield;
            specification['encoding']['y']['type'] = this.localWidget.graphYtype;
            // specification['encoding']['y']['axis']['title'] = this.localWidget.graphYaxisTitle;
            // specification['encoding']['y']['timeUnit'] = this.localWidget.graphYtimeUnit;
            // specification['encoding']['y']['aggregate'] = this.localWidget.graphYaggregate;

            // Tooltip setting
            // specification['mark']['tooltip']['content'] = "";

        };
console.warn('xx graphVisualGrammar', graphVisualGrammar);
console.warn('xx specification', specification, specification == undefined);

        // Render graph for Vega-Lite
        if (graphVisualGrammar == 'Vega-Lite') {
            if (specification != undefined) {
                let vegaSpecification = compile(specification).spec;
                let view = new View(parse(vegaSpecification));

                view.renderer('svg')
                .initialize(this.dragWidget.nativeElement)
                    .hover()
                    .run()
                    .finalize();
            };
        };
    }
    renderGraph(definition: any) {
        // Render the graph on the form
        this.globalFunctionService.printToConsole(this.constructor.name,'renderGraph', '@Start');
console.warn('xx definition', definition);

        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        let width: number = 400;
        let height: number = 260;
        let reduceX: number = 0;
        let reduceY: number = 0;
        let reduceColour: number = 0;

        // Get X max width
        let maxLengthX: number = 0;
        if (this.localWidget.graphXfield != ''  &&  this.localWidget.graphXfield != null) {

            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphXfield);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthX = 4;
                } else {

                    if (x.length > maxLengthX) {
                        maxLengthX = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceX = maxLengthX * 8;
            console.warn('xx X maxLength', maxLengthX, reduceX)
        };

        // Get Y max width
        let maxLengthY: number = 0;
        if (this.localWidget.graphYfield != ''  &&  this.localWidget.graphYfield != null) {

            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphYfield);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthY = 4;
                } else {

                    if (x.length > maxLengthY) {
                        maxLengthY = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceY = maxLengthY * 8;
            console.warn('xx X maxLength', maxLengthY, reduceY)
        };

        // Get colour max width
        let maxLengthColour: number = 0;
        if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {

            maxLengthColour = 0;        // Color blokkie
            const arrayColumn = (arr, n) => arr.map(x => x[n]) ;
            const singleColumn = arrayColumn(this.localWidget.graphData, this.localWidget.graphColorField);
            const arrayMaxLength = (arr) => arr.map(x => {
                if ( (typeof x) != 'string') {
                    maxLengthColour = 4;
                } else {

                    if (x.length > maxLengthColour) {
                        maxLengthColour = x.length
                    };
                };
            });
            let temp = arrayMaxLength(singleColumn);
            reduceColour = (maxLengthColour * 8) + 25;
            console.warn('xx X maxLength', maxLengthColour, reduceColour)
        };

        // Reduce width of legend by length of selected field
        // if (this.localWidget.graphColorField != ''  &&  this.localWidget.graphColorField != null) {
        //     let reduce: number = 30;

        //     // Find the length, then say 8px per character + colour blockie displayed
        //     // TODO - do this better !
        //     for (var i = 0; i < this.dataFieldNames.length; i++) {
        //         if (this.localWidget.graphColorField == this.dataFieldNames[i]) {
        //             reduce = (8 * this.dataFieldLengths[i]) + 35;
        //         }
        //     };
        //     width = width - reduce;
        // };

        console.warn('xx w ', width, width - reduceX - reduceColour )
        console.warn('xx h', height, height - reduceY )

        width =  width - reduceX - reduceColour;
        height =  height - reduceY;

        // Note: trick to set .width and .height explicitly, thus W.graphWidth not used
        // .width(width)
        // .height(height)

        view.renderer('svg')
        .initialize(this.dragWidget.nativeElement)
            .width(width)
            .height(height)
            .hover()
            .run()
            .finalize();
            // this.renderer.setElementStyle(this.dragWidget.nativeElement,
            //     'left', "200px");
    }

  	clickClose(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetEditorClosed.emit(null);
    }

    clickSave(action: string) {
        // Closes the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.localWidget.containerHasContextMenus = this.containerHasContextMenus;
        this.localWidget.containerHasTitle = this.containerHasTitle;

        // Calc the graph dimensions
        this.localWidget.graphHeight =
        this.globalVariableService.calcGraphHeight(this.localWidget);

        this.localWidget.graphWidth =
        this.globalVariableService.calcGraphWidth(this.localWidget);

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

            this.globalVariableService.addWidget(this.localWidget).then(res => {
                this.localWidget.id = res.id;

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

    dragstartField(ev) {
        // Event trigger when start Dragging a Field in the list
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstartField', '@Start');

        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.draggedField = ev.srcElement.innerText.trim();
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

    dragoverColour(ev, actionName: string) {
        // Event trigger when the dragged Field is over the Color field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoverColour', '@Start');

        ev.preventDefault();
    }

    dropColumn(ev) {
        // Event trigger when the dragged Field is dropped the Column field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColumn', '@Start');
        ev.preventDefault();

        let dataSchemaIndex: number = this.dataSchema.findIndex(dsc => dsc.name == this.draggedField)
console.warn('xx dataSchema', this.dataSchema, dataSchemaIndex, '-' + this.draggedField + '-');

        // Show X icon
        this.showColumnDeleteIcon = true;

        ev.dataTransfer.dropEffect = "move"
        // Get the id of the target and add the moved element to the target's DOM

        var data = ev.dataTransfer.getData("text");
        this.colField = this.draggedField;
        this.localWidget.graphXfield = this.draggedField;
        this.localWidget.graphXaxisTitle = this.draggedField;

        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldX = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphXtype = this.defaultGraphTypeField(fieldType);

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.showColFieldAdvanced = true;
        // this.renderGraph(definition);

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
        this.rowField = this.draggedField;
        this.localWidget.graphYfield = this.draggedField;
        this.localWidget.graphYaxisTitle = this.draggedField;

        // Fill the default and allowed types of Vega field types
        let fieldType:string = this.getFieldType(this.draggedField);
        this.graphTypeFieldY = this.allowedGraphTypeField(fieldType);
        this.localWidget.graphYtype = this.defaultGraphTypeField(fieldType);
console.warn('xx big 3', fieldType,
this.graphTypeFieldY,
this.localWidget.graphYtype);

        // TODO - REMOVE when this is done via forms !!!
        // if (this.localWidget.graphYtype == 'quantitative') {
        //     this.localWidget.graphYtype = 'ordinal';
        // };

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.showRowFieldAdvanced = true;
        // this.renderGraph(definition);
    }

    dropColour(ev) {
        // Event trigger when the dragged Field is dropped the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dropColour', '@Start');

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

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearColumnField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColumnField', '@Start');

        // Show X icon
        this.showColumnDeleteIcon = false;
        this.colField = 'Drag a field here ...';
        this.localWidget.graphXfield = null;
        this.localWidget.graphXaxisTitle = null;
        this.localWidget.graphXaggregate = null;
        this.localWidget.graphXtimeUnit = null;
        this.localWidget.graphXtype = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearRowField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearRowField', '@Start');

        // Show X icon
        this.showRowDeleteIcon = false;
        this.rowField = 'Drag a field here ...';
        this.localWidget.graphYfield = null;
        this.localWidget.graphYaxisTitle = null;
        this.localWidget.graphYaggregate = null;
        this.localWidget.graphYtimeUnit = null;
        this.localWidget.graphYtype = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    clickClearColourField() {
        // Clear the Colour Field
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClearColourField', '@Start');

        // Show X icon
        this.showColourDeleteIcon = false;
        this.graphColorField = '';
        this.localWidget.graphColorField = null;
        this.localWidget.graphColorType = null;

        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);
    }

    dragenterColumn(ev, actionName: string) {
        // Event trigger when dragged field enters Column
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColumn', '@Start');

        ev.preventDefault();
        this.dragoverCol = true;
        this.dragoverRow = false;
        this.dragoverColours = false;
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
        this.dragoverColours = false;
    }

    dragoleaveRow(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Row field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragoleaveRow', '@Start');

        ev.preventDefault();
        this.dragoverRow = false;
    }

    dragenterColour(ev, actionName: string) {
        // Event trigger when the dragged Field is enters the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragenterColour', '@Start');

        ev.preventDefault();
        this.dragoverCol = false;
        this.dragoverRow = false;
        this.dragoverColours = true;
    }

    dragleaveColour(ev, actionName: string) {
        // Event trigger when the dragged Field is leaves the Colour field
        this.globalFunctionService.printToConsole(this.constructor.name,'dragleaveColour', '@Start');

        ev.preventDefault();
        this.dragoverColours = false;
    }

    clickDatasource(index: number, name: string) {
        // Show dropdown of DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDatasource', '@Start');

        // TODO - remove later if not used any longer
    }

    clickGraphType(graph: string) {
        // Click a type of graph icon
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGraphType', '@Start');

        this.showType = false;

        this.localWidget.graphMark = graph;
        let definition = this.globalVariableService.createVegaLiteSpec(
            this.localWidget, graphHeight, graphWidth
        );
        this.renderGraph(definition);

    }

    clickDSrow(index, datasourceID: number) {
        // Set the selected datasourceID
        // NOTE: this array can be filtered on front-end, thus DON'T use index
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDSrow', '@Start');

        // Reset, Highlight selected row
        this.selectedRowIndex = index;
        let arrayIndex: number = this.localDatasources.findIndex(ds => ds.id == datasourceID);
        this.selectedRowID = datasourceID;
        this.selectedDescription = this.localDatasources[arrayIndex].description;
        this.errorMessage = '';
        this.currentData = null;

        // Clear previous selected fields
        this.clickClearColourField();
        
        // Determine if data already in Glob Var
        let dataSetIndex: number = this.globalVariableService.currentDatasets.findIndex(
            ds => ds.datasourceID == datasourceID
        );
        if (dataSetIndex >= 0) {

            // Load local arrays for ngFor
            this.dataFieldNames = this.localDatasources[arrayIndex].dataFields;
            this.dataFieldLengths = this.localDatasources[arrayIndex].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[arrayIndex].dataFieldTypes;
            this.constructDataSchema();
            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

            return;
        };

        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(datasourceID).then(res => {

            // Load local arrays for ngFor
            this.dataFieldNames = this.localDatasources[arrayIndex].dataFields;
            this.dataFieldLengths = this.localDatasources[arrayIndex].dataFieldLengths;
            this.dataFieldTypes = this.localDatasources[arrayIndex].dataFieldTypes;
            this.constructDataSchema();

            // Determine if data obtains in Glob Var
            dataSetIndex = this.globalVariableService.currentDatasets.findIndex(
                ds => ds.datasourceID == datasourceID
            );
            if (dataSetIndex < 0) {
                this.errorMessage = 'Error! The Data does not exist in currentDatasets array';
                return;
            };

            // Load first few rows into preview
            this.currentData = this.globalVariableService.currentDatasets[dataSetIndex]
                .data.slice(0,5);

            // Switch on the preview after the first row was clicked
            this.showPreview = true;

        });
    }

    clickContinue(){
        // Continue to design / edit the W, and close the form for the data
        this.globalFunctionService.printToConsole(this.constructor.name,'clickContinue', '@Start');

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

        // Show the Editor form
        this.showDatasourceMain = false;

    }

    setGraphTypeFieldY(graphYtype: string) {
        // Set the Vega field type of the Y axis
        // TODO - fix event in HTML so that it is triggered here
        this.globalFunctionService.printToConsole(this.constructor.name,'setGraphTypeFieldY', '@Start');

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

    // TODO - do one or the other: 3 vars, or 1 combined object
    constructDataSchema() {
        // Construct combined object for fields
        this.globalFunctionService.printToConsole(this.constructor.name,'constructDataSchema', '@Start');

        // TODO - do one or the other: 3 vars, or 1 combined object
        // Fill dataSchema
        this.dataSchema = [];
        for (let i = 0; i < this.dataFieldNames.length; i++) {
            let newDataSchema: dataSchemaInterface = {
                name: this.dataFieldNames[i],
                type: this.dataFieldTypes[i],
                length: this.dataFieldLengths[i]
            };
            this.dataSchema.push(newDataSchema);
        };
        console.warn('xx this.dataSchema', this.dataSchema);

    }

    clickShowDatasources() {
        // Show Datasources
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowDatasources', '@Start');

        this.showDatasourceMain = true;
    }

  }