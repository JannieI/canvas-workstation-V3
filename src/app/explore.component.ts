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
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { dashboard }                  from './models'
import { datasource }                 from './models'

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
const vlTemplateSpec13: dl.spec.TopLevelExtendedSpec =
{
  "data": {"url": "../assets/vega-datasets/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
  }
};

const localDashboards: dl.spec.TopLevelExtendedSpec[] =
[
    {
        "data": {"url": "../assets/vega-datasets/cars.json"},
        "mark": "point",
        "encoding": {
            "x": {"field": "Horsepower", "type": "quantitative"},
            "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
        }
    },
    {
        "data": {"url": "../assets/vega-datasets/seattle-weather.csv"},
        "mark": "bar",
        "encoding": {
          "x": {
            "timeUnit": "month",
            "field": "date",
            "type": "ordinal"
          },
          "y": {
            "aggregate": "count",
            "field": "*",
            "type": "quantitative"
          },
          "color": {
            "field": "weather",
            "type": "nominal"
          }
        }
    }
];

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
};

@Component({
    styleUrls: ['./explore.component.css'],
    templateUrl: './explore.component.html'
})

export class ExploreComponent {
    @Input() menuOptionSelected: string;

    @ViewChild('vis', {read: ElementRef}) vis: ElementRef;  //Vega graph
    @ViewChild('visReal', {read: ElementRef}) visReal: ElementRef;  //Vega graph
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    @ViewChild('typeDropdown') typeDropdown: ElementRef;

    @ViewChildren('widget')             childrenWidgets: QueryList<ElementRef>;
    @ViewChildren('widgetContainter')   widgetContainters: QueryList<ElementRef>;

    localDashboards: dl.spec.TopLevelExtendedSpec[] = localDashboards;
    description: string = 'A simple bar chart with embedded data.';
    data: any = [
        {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55},
        {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91},
        {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
        {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87},
        {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
        {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        ];
    temp: number[] = [0];
    dashboards: dashboard[];
    editMode: boolean;
    graphType: string = 'BarChart';
    graphTypeFile: string = '../images/BarChart.png';
    isFirstTimeDashboard: boolean;
    menuCreateDisabled: boolean = false;
    message: string;
    open: Boolean = false;
    presentation: boolean;
    presentationMsg: boolean;
    secondTab: Boolean = false;
    sideNavWidth: string = '350';
    sideNavMinWidth: string = '18';
    sideNaveButtonText: string = 'Select Data';
    showAdvancedField: boolean = false;
    showContainerHeader: boolean = false;
    showGrid: boolean;
    showNewTab: boolean = false;
    showModalOpenDashboard: boolean = false;
    showType: boolean = false;
    showTypeIcon: boolean = true;
    statusBarRunning: string = '';
    statusBarCancelRefresh: string = '';
    statusBarMessages: string = '';
    viewEditMode: string = 'Edit Mode';
    widgetBorder: string = '1px black solid';
    widgetStartX: number = 0;
    widgetStartY: number = 0;
    widgetEndX: number = 0;
    widgetEndY: number = 0;

    ngAfterViewInit() {
        console.log('Explore ngOnViewInit')


        // let definition = vlTemplateSpec13;
        // let specification = compile(definition).spec;
        // let view = new View(parse(specification));

        if (this.childrenWidgets.toArray().length > 0) {
            for (var i: number = 0; i < this.localDashboards.length; i++) {
                console.log('loop i', i)
                let definition = localDashboards[i];
                let specification = compile(definition).spec;
                let view = new View(parse(specification));

                console.log('xx', this.childrenWidgets.toArray()[i].nativeElement)
                // this.renderer.setElementAttribute(
                //     this.childrenWidgets.toArray()[i].nativeElement,
                //     'id', '2');
                // this.renderer.setElementStyle(
                //     this.childrenWidgets.toArray()[i].nativeElement,
                //     'top',  '80px');
                if (i == 0) {
                    this.renderer.setElementStyle(
                        this.widgetContainters.toArray()[i].nativeElement,
                        'left', '20px');
                // } else {
                //     this.renderer.setElementStyle(
                //         this.widgetContainters.toArray()[i].nativeElement,
                //         'left', '600px');
                // }
                } else {
                    this.renderer.setElementStyle(
                        this.widgetContainters.toArray()[i].nativeElement,
                        'left', '180px');
                    this.renderer.setElementStyle(
                        this.widgetContainters.toArray()[i].nativeElement,
                        'z-index', '4');
                }
                view.renderer('svg')
                    .initialize( this.childrenWidgets.toArray()[i].nativeElement)
                    .width(180)
                    .hover()
                    .run()
                    .finalize();
                console.log('loop end')
            }
        }

        // view.renderer('svg')
        //     .width(350)
        //     .height(260)
        //     .initialize(this.dragWidget.nativeElement)
        //     .hover()
        //     .run()
        //     .finalize();
        //     this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //         'left', "200px");
    }

    dragstart_handler(ev) {
        console.log("dragStart");
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log('drag_start')
    }

    dragend_handler(ev) {
        console.log('dragend_handler', ev.dataTransfer.dropEffect)
    }
    dragover_handler(ev) {
        console.log('dragover_handler')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
       }
    drop_handler(ev) {
        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('drop_handler dropped !!')
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
    constructor(
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}


    ngOnInit() {
        console.log('Explore ngOnInit');

        // Load global variables
        this.globalVariableService.currentMessage.subscribe(
            message => this.message = message
        );
        this.globalVariableService.menuCreateDisabled.subscribe(
            menuCreateDisabled => this.menuCreateDisabled = menuCreateDisabled
        );
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboard = i
        )
        this.globalVariableService.presentation.subscribe(
            pres => this.presentation = pres
        );
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.editMode.subscribe(
            i => this.editMode = i
        )
        this.presentationMsg = this.globalVariableService.presentationMsg;
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
    
    }

//*     onMouseButton(event: MouseEvent): void {
//*         this.isMouseDown = event.buttons === 1;
//*     }
//*
//*     onMouseMove(event: MouseEvent): void {
//*
//*         if (this.isMouseDown && this.isInsideBoundary(event)) {
//*         this.renderer2.setStyle(this.draggable, 'left', event.clientX - (draggableWidth / 2) + 'px');
//*         this.renderer2.setStyle(this.draggable, 'top', event.clientY - (draggableHeight / 2) + 'px');
//*         }
//*     }
//*
//*     isInsideBoundary(event: MouseEvent) {
//*         return event.clientX > this.boundary.left &&
//*         event.clientX < this.boundary.right &&
//*         event.clientY > this.boundary.top &&
//*         event.clientY < this.boundary.bottom;
//*     }

    allowDrop(event) {
        event.preventDefault();
    }


    //         // Load and parse a CSV file. Datalib does type inference for you.
    //         // The result is an array of JavaScript objects with named values.
    //         // Parsed dates are stored as UNIX timestamp values.
    //         // var data = dl.csv('http://vega.github.io/datalib/data/stocks.csv');

    //         // Show summary statistics for each column of the data table.
    //         // console.log(dl.format.summary(data));

    //         // Compute mean and standard deviation by ticker symbol.
    //         // var rollup = dl.groupby('symbol')
    //         // .summarize({'price': ['mean', 'stdev']})
    //         // .execute(data);
    //         // console.log(dl.format.table(rollup));

    //         // Compute correlation measures between price and date.
    //         // console.log(
    //         // dl.cor(data, 'price', 'date'),      // Pearson product-moment correlation
    //         // dl.cor.rank(data, 'price', 'date'), // Spearman rank correlation
    //         // dl.cor.dist(data, 'price', 'date')  // Distance correlation
    //         // );

    //         // Compute mutual information distance between years and binned price.
    //         // var bin_price = dl.$bin(data, 'price'); // returns binned price values
    //         // var year_date = dl.$year('date');       // returns year from date field
    //         // var counts = dl.groupby(year_date, bin_price).count().execute(data);
    //         // console.log(dl.mutual.dist(counts, 'bin_price', 'year_date', 'count'));
    // }

    clickWidget(ev) {
        return;
    }

    dragStartWidget(ev: DragEvent) {
        this.widgetStartX = ev.clientX;
        this.widgetStartY = ev.clientY;
        console.log('dragStartWidget', ev,this.widgetStartX, this.widgetStartY)

    }

    dragEndWidget(ev: DragEvent) {
        this.widgetEndX = ev.clientX;
        this.widgetEndY = ev.clientY;
        let widgetMoveX = this.widgetEndX - this.widgetStartX;
        let widgetMoveY = this.widgetEndY - this.widgetStartY;
        console.log('dragEndWidget',  this.widgetStartX, this.widgetEndX,widgetMoveX, widgetMoveY, this.visReal.nativeElement['left'])

        this.renderer.setElementStyle(this.dragWidget.nativeElement,
            'left', (500 + widgetMoveX).toString() + "px");

        this.renderer.setElementStyle(this.dragWidget.nativeElement,
            'top', (80 + widgetMoveX).toString() + "px");
    }

    addNewTab() {
        this.secondTab = ! this.secondTab;
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

    clickGotItPresentation() {
        this.presentationMsg = !this.presentationMsg;
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

    clickWidgetEdit() {
        console.log('Open Widget Editor')
    }

    clickAddTab() {
        this.showNewTab = true;
        console.log('sss')
    }

    clickSaveTab() {
        this.showNewTab = false;
        console.log('--s')
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