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
import { CanvasShape }                from './models'
import { CanvasSlicer }               from './models'
import { CanvasWidget }               from './models'
import { Dashboard }                  from './models'
import { DashboardTab }               from './models'
import { Datasource }                 from './models'

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
    styleUrls: ['./explore.component.css'],
    templateUrl: './explore.component.html'
})

export class ExploreComponent {

    @ViewChildren('widgetContainter')  widgetContainters: QueryList<ElementRef>;
    @ViewChildren('widget')            childrenWidgets: QueryList<ElementRef>;
    @ViewChildren('shapeContainter')   shapeContainter: QueryList<ElementRef>;
    @ViewChildren('circle2')            circle2: QueryList<ElementRef>;

    currentDashboardTabs: DashboardTab[] = [];
    currentTabName: string = 'Summary';
    datasources: Datasource[];
    description: string = 'A simple bar chart with embedded data.';
    editMode: boolean;
    hasDatasources: boolean;
    isFirstTimeDashboard: boolean;
    isFirstTimePresentation: boolean;
    currentShapes: CanvasShape[] = [];
    currentWidgets: CanvasWidget[] = [];
    currentSlicers: CanvasSlicer[] = [];
    localTrash: CanvasWidget[] = [];
    open: Boolean = false;
    presentationMode: boolean;
    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showGrid: boolean;
    showMainMenu: boolean;
    showModalData: boolean = false;
    showModalDashboardOpen: boolean = false;
    showModalLanding: boolean = true;
    showModalOpenDashboard: boolean = false;
    showModalWidgetEditor: boolean = false;
    showNewTab: boolean = false;
    showSlicer: boolean = true;
    showTabList: boolean = false;
    startX: number;
    startY: number;
    statusBarRunning: string = '';
    statusBarCancelRefresh: string = '';
    statusBarMessages: string = '';
    templateInUse: string = 'Tmpl Used';
    
    temp: number[] = [0];
    showSlicerContainer: boolean = false;
    slicerHeight: number = 178;
    slicerWidth: number = 160;
    slicerButtons: number = 5;
    selectedSlicers: number[] = []
    loggedIntoServerText: string;

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

        console.log('Explore ngOnInit', this.globalVariableService.openDashboardFormOnStartup)

        // Load global variables
        this.globalVariableService.showModalLanding.subscribe(
            i => this.showModalLanding = i
        );
        this.globalVariableService.showModalData.subscribe(
            i => this.showModalData = i
        );
        if (this.globalVariableService.openDashboardFormOnStartup) {
            this.showModalDashboardOpen = true;
        };
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboard = i
        )
        this.globalVariableService.presentationMode.subscribe(
            pres => this.presentationMode = pres
        );
        this.globalVariableService.showMainMenu.subscribe(
            sm => this.showMainMenu = sm
        );
        this.globalVariableService.editMode.subscribe(
            i => this.editMode = i
        )
        this.globalVariableService.isFirstTimePresentation.subscribe(
            i => this.isFirstTimePresentation = i
        );
        this.globalVariableService.showGrid.subscribe(
            sG => this.showGrid = sG
        );
        this.globalVariableService.statusBarRunning.subscribe(
            i => this.statusBarRunning = i
        )
        this.globalVariableService.statusBarCancelRefresh.subscribe(
            i => this.statusBarCancelRefresh = i
        )
        this.globalVariableService.statusBarMessages.subscribe(
            i => this.statusBarMessages = i
        )
        this.globalVariableService.localTrash.subscribe(
            i => this.localTrash = i
        );
        this.globalVariableService.hasDatasources.subscribe(
            i => this.hasDatasources = i
        );
        this.globalVariableService.refreshDashboard.subscribe(
            i => {
                    console.log ('Explore ngOnInit refreshDashboard', 
                        this.globalVariableService.currentDashboardID,
                        this.globalVariableService.currentDashboardTabID)
                    if (i)
                        {
                            // Add to Recently used
                            this.globalVariableService.addDashboardRecent(
                                this.globalVariableService.currentDashboardID,
                                this.globalVariableService.currentDashboardTabID
                            )
                            // Refresh D and related info
                            this.refreshDashboardInfo(
                                this.globalVariableService.currentDashboardID,
                                this.globalVariableService.currentDashboardTabID);
                            this.globalVariableService.refreshDashboard.next(false);

                        };
            }
        );
        this.globalVariableService.menuActionResize.subscribe(
            i => { if(i) {this.clickMenuAlignTop()}}
        );
        this.globalVariableService.menuActionSelectAll.subscribe(
            i => this.clickMenuSelectAll(i)
        );
        this.globalVariableService.loggedIntoServer.subscribe(
            i => 
            {
                console.log(i)
                if(i) {
                    this.loggedIntoServerText = 'Server'
                } else {
                    this.loggedIntoServerText = 'Local'
                }
            }
        )

    }

    // ngAfterViewChecked(){
    //     // For Testing
    //     console.log('Explore ngAfterViewChecked W, Sl', this.currentWidgets, 
    //         this.widgetContainters.toArray())
    // }

    ngAfterViewInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

        console.log('Explore ngOnViewInit', this.currentShapes)

        // Loop on the graph ElementRefs, and set properties ala widget[].properties
        if (this.shapeContainter.toArray().length > 0) {
            for (var i = 0; i < this.circle2.toArray().length; i++) {

                // Now set in css
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'cx', '50')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'cy', '50')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'r', '40')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'stroke', 'orange')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'stroke-width', '2')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'fill', 'none')

                // this.circle.toArray()[i].nativeElement = '<circle #circle cx="50" cy="50" r="5" stroke="blue" stroke-width="2" fill="none" />'
                
                // console.log('Explore ngAfterViewInit circle2', this.circle2.toArray()[i].nativeElement)
            }
        };

        this.refreshDashboardInfo(this.globalVariableService.currentDashboardID,
            this.globalVariableService.currentDashboardTabID)
    }

    refreshDashboardInfo(dashboardID: number, dashboardTabID: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshDashboardInfo', '@Start');

        if (dashboardTabID < 1) { dashboardTabID = 1};

        this.globalVariableService.refreshCurrentDashboardInfo(
            dashboardID, dashboardTabID).then (i => 
            {
                console.log('The big moment ...')
                this.currentDashboardTabs = this.globalVariableService.currentDashboardTabs;
                this.currentWidgets = this.globalVariableService.currentWidgets;
                this.currentShapes = this.globalVariableService.currentShapes;
                this.currentSlicers = this.globalVariableService.currentSlicers;
                this.refreshWidgets();
            } );
    }

    refreshShapes2() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshShapes2', '@Start');

        console.log('Explore refreshShapes2 starting now ...', this.shapeContainter.toArray().length)
        // Loop on the graph ElementRefs, and set properties ala widget[].properties
        if (this.shapeContainter.toArray().length > 0) {
            for (var i = 0; i < this.circle2.toArray().length; i++) {

                this.renderer2.setStyle(this.circle2.toArray()[i].nativeElement,'r', '40')

                // Now set in css
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'cx', '50')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'cy', '50')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'r', '40')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'stroke', 'orange')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'stroke-width', '2')
                // this.renderer2.setAttribute(this.circle.toArray()[i].nativeElement,'fill', 'none')

                // this.circle.toArray()[i].nativeElement = '<circle #circle cx="50" cy="50" r="5" stroke="blue" stroke-width="2" fill="none" />'
                
                // console.log('Explore refreshShapes2 circle2', this.circle2.toArray()[i].nativeElement)
            }
        };

    }

    refreshWidgets() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidgets', '@Start');

        console.log('Explore refreshWidgets ...START children.length', this.childrenWidgets.toArray(),
            this.widgetContainters.toArray(), this.currentWidgets)
        for (var i: number = 0; i < this.childrenWidgets.toArray().length; i++) {
            if (this.currentWidgets[i] != undefined) {
                console.log('Explore refreshWidgets' ,i)
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

    duplicateWidget(duplicate: boolean) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'duplicateWidget', '@Start');

        if (duplicate) {
            console.log('Explore duplicateWidget', this.childrenWidgets.toArray().length)
            // this.localDashboards.push(this.localDashboards[0]);
            // TODO - fix and add to correct Array
            console.log('Explore duplicateWidget Add to array ...');
        }
    }

    allowDrop(event) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'allowDrop', '@Start');

        event.preventDefault();
    }

    dragstart_handler(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'dragstart_handler', '@Start');

        // console.log("Explore dragstart_handler");
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        // console.log('Explore dragstart_handler')
    }

    dragend_handler(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'dragend_handler', '@Start');

        console.log('Explore dragend_handler', ev.dataTransfer.dropEffect)
    }

    dragover_handler(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'dragover_handler', '@Start');

        console.log('Explore dragover_handler')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
    }

    drop_handler(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'drop_handler', '@Start');

        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('Explore drop_handler dropped !!')
    }

    vlSpecs: dl.spec.TopLevelExtendedSpec[] = [
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {
              "values": [
                {"Month": "C", "Profit": 2}, {"Month": "C", "Profit": 7}, {"Month": "C", "Profit": 4},
                {"Month": "D", "Profit": 1}, {"Month": "D", "Profit": 2}, {"Month": "D", "Profit": 6},
                {"Month": "E", "Profit": 8}, {"Month": "E", "Profit": 4}, {"Month": "E", "Profit": 7}
              ]
            },
            "mark": "bar",
            "encoding": {
              "y": {"field": "Month", "type": "nominal"},
              "x": {
                "aggregate": "average", "field": "Profit", "type": "quantitative",
                "axis": {
                  "title": "Average of Profit"
                }
              }
            }
        },
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A simple bar chart with embedded data.",
            "data": {
              "values": [
                {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
                {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
                {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
                {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
                {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
                {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
              ]
            },
            "mark": "bar",
            "encoding": {
              "x": {"field": "Month", "type": "ordinal"},
              "y": {"aggregate": "", "field": "Trades", "type": "quantitative",
                "axis": {
                    "title": "Average Trading"
                }
              }
            }
        }
    ];

    clickWidget(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidget', '@Start');

        return;
    }

    clickDashboardDescription() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDescription', '@Start');

        this.showTabList = false;
        this.showDashboardDescription = true;
        this.showDashboardTabDescription = false;  
    }

    clickListTabs() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickListTabs', '@Start');

        this.showTabList = true;
        this.showDashboardDescription = false;
        this.showDashboardTabDescription = false;
    }

    clickAddTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddTab', '@Start');

        this.showNewTab = true;
    }

    clickShowFirstTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFirstTab', '@Start');

        this.currentTabName = this.currentDashboardTabs[0].name;
    }

    clickShowPreviousTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowPreviousTab', '@Start');

        let x: number = 0;
        for (var i = 0; i < this.currentDashboardTabs.length; i++) {
            if (this.currentDashboardTabs[i].id == 
                this.globalVariableService.currentDashboardTabID) { 
                    x = i - 1;
            };
        }
        if (x < 0) { x = this.currentDashboardTabs.length - 1 };
        this.currentTabName = this.currentDashboardTabs[x].name;
        this.globalVariableService.currentDashboardTabID = this.currentDashboardTabs[x].id;
        this.refreshDashboardInfo(this.globalVariableService.currentDashboardID,
            this.globalVariableService.currentDashboardTabID);
    }

    clickShowTabDescription() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDescription', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = true;
        this.showDashboardDescription = false;
        
    }
    clickShowNextTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowNextTab', '@Start');
        let x: CanvasWidget = this.globalVariableService.currentWidgets[2]
        this.currentWidgets.pop();
        this.currentWidgets.push(x);
        console.log(this.currentWidgets, this.globalVariableService.widgets[2])
    }

    clickShowLastTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowLastTab', '@Start');

        console.log('Explore clickShowLastTab',this.currentTabName)
        this.currentTabName = this.currentDashboardTabs[
            this.currentDashboardTabs.length - 1].name;        
    }

    clickCloseModel() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCloseModel', '@Start');

        this.showModalOpenDashboard = false;
    }

    clickDeleteTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteTab', '@Start');

        alert ('Cannot delete last remaining Tab')
    }

    clickGotIt() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGotIt', '@Start');

        this.globalVariableService.isFirstTimeDashboard.next(false);
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

    clickClosePresentation() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClosePresentation', '@Start');

        this.globalVariableService.showMainMenu.next(true);
        this.globalVariableService.presentationMode.next(false);
    }

    handleCloseDashboardTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        this.showNewTab = false;
    }

    clickSelect(i: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelect', '@Start');

        this.currentWidgets[i].isSelected = !this.currentWidgets[i].isSelected;
    }

    clickDragMouseDown(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDragMouseDown', '@Start');

        console.log('Explore clickDragMouseDown', id)
    }

    clickDragMouseUp(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDragMouseUp', '@Start');

        console.log('Explore clickDragMouseUp')
    }

    clickDragStart(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDragStart', '@Start');

        console.log('Explore clickDragStart', id, event.clientX, event.clientY)
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    clickDragEnd(event, index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDragEnd', '@Start');

        console.log('Explore clickDragEnd', index, event.clientX, event.clientY,
        'was', this.currentWidgets[index].containerLeft,
        'diff', event.clientX - this.startX,
        'new', this.currentWidgets[index].containerLeft + event.clientX - this.startX)

        let moveX: number = event.clientX - this.startX;
        let moveY: number = event.clientY - this.startY;

        let newX: number = this.currentWidgets[index].containerLeft + moveX;
        let newY: number = this.currentWidgets[index].containerTop + moveY;

        if (newX < 0) {
            newX = 0;
        }
        if (newY < 15) {
            newY = 15;
        }

        this.currentWidgets[index].containerLeft = newX;
        this.currentWidgets[index].containerTop = newY;

    }
    clickDragKeydown(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDragKeydown', '@Start');

        console.log('Explore clickDragKeydown', id)
    }

    clickResizeMouseDown(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeMouseDown', '@Start');

        console.log('Explore clickResizeMouseDown', id)
    }

    clickResizeMouseUp(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeMouseUp', '@Start');

        console.log('Explore clickResizeMouseUp', id)
    }

    clickResizeStart(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeStart', '@Start');

        console.log('Explore clickResizeStart', id, event.clientX, event.clientY)
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    clickResizeEnd(event, index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeEnd', '@Start');

        console.log('Explore clickResizeEnd', index, event.clientX, event.clientY,
        'was', this.currentWidgets[index].containerWidth,
        'diff', event.clientX - this.startX,
        'new', this.currentWidgets[index].containerWidth + event.clientX - this.startX)

        let moveX: number = event.clientX - this.startX;
        let moveY: number = event.clientY - this.startY;

        let newX: number = this.currentWidgets[index].containerWidth + moveX;
        let newY: number = this.currentWidgets[index].containerHeight + moveY;

        if (newX < 80) {
            newX = 80;
        }
        if (newY < 50) {
            newY = 50;
        }

        this.currentWidgets[index].containerWidth = newX;
        this.currentWidgets[index].containerHeight = newY;
    }
    clickResizeKeydown(event, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeKeydown', '@Start');

        console.log('Explore clickResizeKeydown', id)
    }

    handleCloseDashboardHelp() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardHelp', '@Start');

    }

    handleCloseDashboardHelpPresentation() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardHelpPresentation', '@Start');

    }

    clickWidgetEdit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetEdit', '@Start');

        if (!this.hasDatasources) {
            alert('Please add a Dataset first: Data -> From File')
            return;
        };
        this.showModalWidgetEditor = true;
    }

    handleCloseWidgetEditor() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseWidgetEditor', '@Start');

        this.showModalWidgetEditor = false;
    }

    clickWidgetCheckpoints() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickWidgetCheckpoints', '@Start');

    }

    clickMenuWidgetComments() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetComments', '@Start');

    }

    clickMenuWidgetLinks() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetLinks', '@Start');

        if (this.presentationMode) {
            alert ('Jumping to Linked Dashboard ...')
        }
    }

    clickMenuWidgetRefresh() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetRefresh', '@Start');

    }

    clickMenuWidgetDuplicate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDuplicate', '@Start');

    }

    clickMenuWidgetExpand() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExpand', '@Start');

    }

    clickMenuWidgetExport() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetExport', '@Start');

    }

    clickMenuArrangeBack() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeBack', '@Start');

    }

    clickMenuArrangeFront() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuArrangeFront', '@Start');

    }

    clickMenuWidgetDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuWidgetDelete', '@Start');

    }

    clickStatusTemplate() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickStatusTemplate', '@Start');

        if (this.templateInUse == 'Tmpl Used') {
            this.templateInUse = 'Tmpl Disabled ';
        } else {
            this.templateInUse = 'Tmpl Used';
        }
    }

    clickSlicerDelete() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicerDelete', '@Start');

        this.showSlicer = false;
    }

    clickSlicer(index: number, id: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSlicer', '@Start');

        console.log(this.currentSlicers, index)
        this.currentSlicers[index].isSelected = !this.currentSlicers[index].isSelected;
        if (this.currentSlicers[index].isSelected ) {
            this.selectedSlicers.push(id);
        } else {
            this.selectedSlicers.splice(this.selectedSlicers.indexOf(id), 1)
        }
        console.log('clickSlicer', this.selectedSlicers)
    }

    clickResizeDown(ev: MouseEvent, index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeDown', '@Start');

        console.log('clickResizeDown', this.currentSlicers[index].containerLeft, ev);
        this.startX = ev.x;
        this.startY = ev.y;
        
    }

    clickResizeUp(ev: MouseEvent, index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickResizeUp', '@Start');

        console.log('clickResizeUp starts index', index)

        // Reset current and globalVar values
        this.currentSlicers[index].containerWidth = 
            this.currentSlicers[index].containerWidth - this.startX + ev.x;
        this.globalVariableService.currentSlicers[index].containerWidth =   
            this.currentSlicers[index].containerWidth;    
                
        // console.log('clickResizeUp this.globalVariableService.currentSlicers[index].value',
        //     index, this.globalVariableService.currentSlicers.value[index])

        this.currentSlicers[index].nrButtons = 
            (this.currentSlicers[index].containerWidth - 50) / 22;

        console.log('clickResizeUp width buttons ev x-move', 
            this.currentSlicers[index].containerWidth, this.currentSlicers[index].nrButtons, 
            ev, 0 - this.startX + ev.x);
    }

    clickMenuAlignTop() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuAlignTop', '@Start');

        let firstTop: number = null;
        if (this.currentSlicers != undefined) {
            this.currentSlicers.forEach(
                i => {
                    if (this.selectedSlicers.indexOf(i.id) >= 0) {
                        if (firstTop == null) {
                            firstTop = i.containerTop;
                        } else {
                            i.containerTop = firstTop;
                        }
                    }
                }
            )
        };
        console.log('clickMenuAlignTop', this.currentSlicers);
    }   

    clickMenuSelectAll(value: boolean) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMenuSelectAll', '@Start');

        console.log('clickMenuSelectAll', value)
        if (this.currentSlicers != undefined) {
            if (!value) {
                this.selectedSlicers = [];
                this.currentSlicers.forEach(
                    i => i.isSelected = false
                )
            } else  {
                this.currentSlicers.forEach(
                    i => {
                            i.isSelected = true;
                            this.selectedSlicers.push(i.id);
                    }
                )
            };
        }
    }

    selectDashboardTab(index: number) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'selectDashboardTab', '@Start');

        console.log('selectDashboardTab', index)
        this.showTabList=!this.showTabList;
        this.currentTabName = this.currentDashboardTabs[index].name;
    }

    handleCloseModalLanding() {
        // Close Modal form Landing page
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseModalLanding', '@Start');

        this.globalVariableService.showModalLanding.next(false);

        if (this.globalVariableService.openDashboardFormOnStartup) {
            console.log('handleCloseModalLanding 1')
            this.showModalDashboardOpen = true;
        };

        if (this.globalVariableService.openNewDashboardFormOnStartup) {
            console.log('handleCloseModalLanding 2')
            this.showModalData = true;
        };
    }

    handleCloseDashboardOpen(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardOpen', '@Start');
        console.log('handleCloseDashboardOpen 1', this.test)

        this.showModalDashboardOpen = false;
    }

    handleCloseData(ev) {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseData', '@Start');

        this.globalVariableService.showModalData.next(false);
    }
}



// /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
// function openNav() {
//     document.getElementById("mySidenav").style.width = "250px";
//     document.getElementById("main").style.marginLeft = "250px";
// }

// /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft = "0";
// }


// Event	    On Event Handler	Description
// drag	        ondrag	            Fired when an element or text selection is being dragged.
// dragend	    ondragend	        Fired when a drag operation is being ended (for example,
//               by releasing a mouse button or hitting the escape key). (See Finishing a Drag.)
// dragenter	ondragenter	        Fired when a dragged element or text selection enters a
//              valid drop target. (See Specifying Drop Targets.)
// dragexit	    ondragexit	        Fired when an element is no longer the drag operation's
//              immediate selection target.
// dragleave	ondragleave	        Fired when a dragged element or text selection leaves a
//              valid drop target.
// dragover	    ondragover	        Fired when an element or text selection is being dragged
//               over a valid drop target (every few hundred milliseconds).
// dragstart	ondragstart	        Fired when the user starts dragging an element or text s
//              election. (See Starting a Drag Operation.)
// drop	        ondrop	            Fired when an element or text selection is dropped on a
//              valid drop target. (See Performing a Drop.)