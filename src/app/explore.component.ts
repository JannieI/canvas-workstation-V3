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

// Our Services
import { GlobalVariableService }      from './global-variable.service';
// import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { CanvasShape }                from './models'
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

    // localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    currentDashboardTabs: DashboardTab[];
    currentTabName: string = 'Summary';
    datasources: Datasource[];
    description: string = 'A simple bar chart with embedded data.';
    editMode: boolean;
    hasDatasources: boolean;
    isFirstTimeDashboard: boolean;
    isFirstTimePresentation: boolean;
    localDashboards: dl.spec.TopLevelExtendedSpec[];
    localShapes: CanvasShape[];
    localTrash: CanvasWidget[] = [];
    currentWidgets: CanvasWidget[];
    open: Boolean = false;
    presentationMode: boolean;
    showDashboardDescription: boolean = false;
    showGrid: boolean;
    showMainMenu: boolean;
    showModalDashboardOpen: boolean = false;
    showModalOpenDashboard: boolean = false;
    showModalWidgetEditor: boolean = false;
    showNewTab: boolean = false;
    showSlicer: boolean = true;
    showTabList: boolean = false;
    slicerHeader: string;
    startX: number;
    startY: number;
    statusBarRunning: string = '';
    statusBarCancelRefresh: string = '';
    statusBarMessages: string = '';
    templateInUse: string = 'Tmpl Used';
    
    temp: number[] = [0];

    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private renderer2: Renderer2,
    ) {}

    ngOnInit() {
        console.log('Explore ngOnInit', this.globalVariableService.openDashboardFormOnStartup)

        // Load global variables
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
        this.localDashboards = this.globalVariableService.localDashboards;
        this.globalVariableService.currentDashboardTabs.subscribe(
            i => this.currentDashboardTabs = i
        );
        this.globalVariableService.localShapes.subscribe(
            i => {
                    this.localShapes = i;
                    if (this.shapeContainter !== undefined) {
                        this.refreshShapes2()
                        console.log ('Explore ngOnInit refreshShap2 done')
                    }
                 }
        );
        this.globalVariableService.currentWidgets.subscribe(
            i => {
                this.currentWidgets = i.filter(f => f.isTrashed == false)
                if (this.childrenWidgets !== undefined) {
                    this.refreshWidgets();
                    this.refreshShapes2()
                    console.log ('Explore ngOnInit refeshWidgets2 done', i)
                }
            }
        );
        this.globalVariableService.localTrash.subscribe(
            i => this.localTrash = i
        );
        this.datasources = this.globalVariableService.datasources;
        if ( this.datasources.length > 0) { 
            this.hasDatasources = true
        } else {
            this.hasDatasources = false
        };
        this.globalVariableService.refreshDashboard.subscribe(
            i => {
                    if (i)
                        {
                            this.refreshWidgets();
                            console.log ('Explore ngOnInit refeshWW done')
                        }
                    else {console.log('Explore ngOnInit no refreshWW')}
            }
        );
        this.globalVariableService.slicerHeader.subscribe(
            i => this.slicerHeader = i
        );
    }

    ngAfterViewInit() {
        console.log('Explore ngOnViewInit', this.localShapes)

        // Loop on the graph ElementRefs, and set properties ala widget[].properties
        if (this.shapeContainter.toArray().length > 0) {
            for (var i = 0; i < this.circle2.toArray().length; i++) {

                // Testing
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'cx', '50')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'cy', '50')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'r', '40')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'stroke', 'orange')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'stroke-width', '2')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'fill', 'none')



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

        this.refreshWidgets();
    }

    handleCloseDashboardOpen(ev) {
        this.showModalDashboardOpen = false;
    }

    refreshShapes2() {

        console.log('Explore refreshShapes2 starting now ...', this.shapeContainter.toArray().length)
        // Loop on the graph ElementRefs, and set properties ala widget[].properties
        if (this.shapeContainter.toArray().length > 0) {
            for (var i = 0; i < this.circle2.toArray().length; i++) {

                // Testing
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'cx', '50')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'cy', '50')
                this.renderer2.setStyle(this.circle2.toArray()[i].nativeElement,'r', '40')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'stroke', 'orange')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'stroke-width', '2')
                // this.renderer2.setAttribute(this.circle2.toArray()[i].nativeElement,'fill', 'none')



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
        console.log('Explore refreshWidgets')
        console.log('Explore refreshWidgets ...START children.length', this.childrenWidgets.toArray().length)
        for (var i: number = 0; i < this.childrenWidgets.toArray().length; i++) {
            console.log('Explore refreshWidgets this.currentWidgets[i].graphColorField', this.currentWidgets[i].graphColorField)
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
        }
    }

    duplicateWidget(duplicate: boolean) {
        if (duplicate) {
            console.log('Explore duplicateWidget', this.childrenWidgets.toArray().length)
            this.localDashboards.push(this.localDashboards[0]);
            console.log('Explore duplicateWidget Add to array ...', this.localDashboards)
        }
    }

    allowDrop(event) {
        event.preventDefault();
    }

    dragstart_handler(ev) {
        // console.log("Explore dragstart_handler");
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        // console.log('Explore dragstart_handler')
    }

    dragend_handler(ev) {
        console.log('Explore dragend_handler', ev.dataTransfer.dropEffect)
    }

    dragover_handler(ev) {
        console.log('Explore dragover_handler')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
    }

    drop_handler(ev) {
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
        return;
    }

    clickDashboardDescription() {
        this.showDashboardDescription = true;
    }

    clickListTabs() {
        this.showTabList = true;
    }

    clickAddTab() {
        this.showNewTab = true;
    }

    clickShowFirstTab() {
        this.currentTabName = 'Summary'
    }

    clickShowPreviousTab() {
        if (this.currentTabName == 'Summary') {this.currentTabName = 'Headcount'}
        else if (this.currentTabName == 'Headcount') {this.currentTabName = 'Europe'}
        else if (this.currentTabName == 'Europe') {this.currentTabName = 'Budget'}
        else if (this.currentTabName == 'Budget') {this.currentTabName = 'Summary'};
    }

    clickShowNextTab() {
        console.log('Explore clickShowNextTab Next START widgets: ', this.globalVariableService.widgets)
        console.log('Explore clickShowNextTab    Next 0 Tabs: ', this.globalVariableService.currentDashboardTabs.value)
        
        if (this.currentTabName == 'Summary') {this.currentTabName = 'Budget'}
        else if (this.currentTabName == 'Budget') {this.currentTabName = 'Europe'}
        else if (this.currentTabName == 'Europe') {this.currentTabName = 'Headcount'}
        else if (this.currentTabName == 'Headcount') {this.currentTabName = 'Summary'};
    }

    clickShowLastTab() {
        this.currentTabName = 'Headcount'
        console.log('Explore clickShowLastTab',this.currentTabName)
    }

    clickCloseModel() {
        this.showModalOpenDashboard = false;
    }

    clickDeleteTab() {
        alert ('Cannot delete last remaining Tab')
    }

    clickGotIt() {
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

        // vlSpecsNew['data']['values'] = [
        //     {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
        //     {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
        //     {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
        //     {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
        //     {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
        //     {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        // ];
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
        this.globalVariableService.showMainMenu.next(true);
        this.globalVariableService.presentationMode.next(false);
    }

    handleCloseDashboardTab() {
        this.showNewTab = false;
    }

    clickSelect(i: number) {
        this.currentWidgets[i].isSelected = !this.currentWidgets[i].isSelected;
    }

    clickDragMouseDown(event, id: number) {
        console.log('Explore clickDragMouseDown', id)
    }
    clickDragMouseUp(event, id: number) {
        console.log('Explore clickDragMouseUp')
    }
    clickDragStart(event, id: number) {
        console.log('Explore clickDragStart', id, event.clientX, event.clientY)
        this.startX = event.clientX;
        this.startY = event.clientY;
    }
    clickDragEnd(event, index: number) {
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
        console.log('Explore clickDragKeydown', id)
    }

    clickResizeMouseDown(event, id: number) {
        console.log('Explore clickResizeMouseDown', id)
    }
    clickResizeMouseUp(event, id: number) {
        console.log('Explore clickResizeMouseUp')
    }
    clickResizeStart(event, id: number) {
        console.log('Explore clickResizeStart', id, event.clientX, event.clientY)
        this.startX = event.clientX;
        this.startY = event.clientY;
    }
    clickResizeEnd(event, index: number) {
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
        console.log('Explore clickResizeKeydown', id)
    }

    handleCloseDashboardHelp() {
    }

    handleCloseDashboardHelpPresentation() {
    }

    clickWidgetEdit() {
        if (this.datasources.length == 0) {
            alert('Please add a Dataset first: Data -> From File')
        } else {
            this.showModalWidgetEditor = true;
        };
    }

    handleCloseWidgetEditor() {
        this.showModalWidgetEditor = false;
    }

    clickWidgetCheckpoints() {
    }

    clickMenuWidgetComments() {
    }

    clickMenuWidgetLinks() {
        if (this.presentationMode) {
            alert ('Jumping to Linked Dashboard ...')
        }
    }

    clickMenuWidgetRefresh() {
    }

    clickMenuWidgetDuplicate() {
    }

    clickMenuWidgetExpand() {
    }

    clickMenuWidgetExport() {
    }

    clickMenuArrangeBack() {
    }

    clickMenuArrangeFront() {
    }

    clickMenuWidgetDelete() {
    }

    clickStatusTemplate() {
        if (this.templateInUse == 'Tmpl Used') {
            this.templateInUse = 'Tmpl Disabled ';
        } else {
            this.templateInUse = 'Tmpl Used';
        }
    }

    clickSlicerDelete() {
        this.showSlicer = false;
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