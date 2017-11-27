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
import { Renderer }                   from '@angular/core';
//* import { Renderer2 }                  from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

// Vega, Vega-Lite
// declare var require: any;
import { compile }                    from 'vega-lite';

import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// import { load } from 'datalib';

//* const draggableHeight = 50;
//* const draggableWidth = 100;

// Own Services

// Own Components

// var dl = require('datalib');
// import * as sqlite3 from 'sqlite3';

interface IVegaUpdate {
    encoding?: {
        x?: string;
        y?: string;
    },
    title: {
        text?: string;
        align?: string;
    }
}

interface Idashboard {
    name: string;
    description: string;
}

interface Ibackgroundcolor {
    name: string;
}

const dashboards: Idashboard[] = [
    {
        name: 'Market Overview',
        description: 'Economic indicator summary'
    },
    {
        name: 'Costing Summary',
        description: 'Costing Summary'
    },
    {
        name: 'Home Budget',
        description: 'Home Budget'
    },
    {
        name: 'Bitcoin sales',
        description: 'Bitcoin sales'
    },
    {
        name: 'Cycling routes',
        description: 'Cycling routes'
    }
]

const backgroundcolors: Ibackgroundcolor[] = [
    {
        name: 'transparent'
    },
    {
        name: 'beige'
    },
    {
        name: 'white'
    }
]


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

    // const vlTemplate: dl.spec.TopLevelExtendedSpec = {
  
//     // Properties for any single view specifications
//     "width": '$width',
//     "height": '$height',
//     "mark": '$mark',
//     "encoding": {
//       "x": {
//         "field": ...,
//         "type": ...,
//         ...
//       },
//       "y": ...,
//       "color": ...,
//       ...
//     }
//   }
@Component({
    styleUrls: ['./explore.component.css'],
    templateUrl: './explore.component.html'
})
    
export class ExploreComponent {
    @ViewChild('vis', {read: ElementRef}) vis: ElementRef;  //Vega graph
    @ViewChild('visReal', {read: ElementRef}) visReal: ElementRef;  //Vega graph
    @ViewChild('visReal111', {read: ElementRef}) visReal111: ElementRef;  //Vega graph
    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    @Input() menuOptionSelected: string;
    
    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    

//*     @ViewChild('container') private containerElement: ElementRef;
//*     @ViewChild('draggable') private draggableElement: ElementRef;
  
//*     boundary: any = {};
//*     draggable: any;
//*     isMouseDown = false;

    // @HostBinding('class.droptarget') private ishovering: boolean;

    // @HostListener('dragend', ["$event"]) onDrag(ev) {
    //     console.log('HostListener - dragEnd', this.ishovering);
    // }

    // @HostListener('drop', ["$event"]) onDrop(ev) {
    //     console.log('HostListener - drop', ev);
    // }
    
    // @HostListener('mouseover') onMouseOver() {
    //     console.log('mouseover', this.ishovering)
    // }

    description: string = 'A simple bar chart with embedded data.';
    data: any = [
        {"Month": "02","Trades": 28}, {"Month": "02","Trades": 55}, 
        {"Month": "03","Trades": 43}, {"Month": "04","Trades": 91}, 
        {"Month": "05","Trades": 81}, {"Month": "06","Trades": 53},
        {"Month": "07","Trades": 19}, {"Month": "08","Trades": 87}, 
        {"Month": "09","Trades": 52}, {"Month": "10","Trades": 42},
        {"Month": "11","Trades": 62}, {"Month": "12","Trades": 82}
        ];

    backgroundcolors: Ibackgroundcolor[] = backgroundcolors;
    dashboards: Idashboard[] = dashboards;
    graphType: string = 'BarChart';
    graphTypeFile: string = '../images/BarChart.png';
    isFirstTime: boolean;
    menuCreateDisabled: boolean = false;
    message: string;
    open: Boolean = false;
    secondTab: Boolean = false;
    sideNavWidth: string = '350';
    sideNavMinWidth: string = '18';
    sideNaveButtonText: string = 'Select Data';
    showAdvancedField: boolean = false;
    showContainerHeader: boolean = false;
    showModalOpenDashboard: boolean = false;
    showNavDashboard: Boolean = false;
    showNavTab: Boolean = false;
    showNavFormat: Boolean = false;
    showNavExplore: Boolean = true;
    showNavPresentation: Boolean = false;
    showNavCollaborate: Boolean = false;
    showSideNav1: boolean = true;
    showSideNav2: boolean = true;
    showSubMenuDashboard: boolean = true;
    showType: boolean = false;
    showTypeIcon: boolean = true;
    showWidgetDesigner: boolean = false;
    widgetBorder: string = '1px black solid';
    widgetStartX: number = 0;
    widgetStartY: number = 0;
    widgetEndX: number = 0;
    widgetEndY: number = 0;


    
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
//*         private renderer2: Renderer2,
    ) {}


    ngOnInit() {
        console.log('ngOnInit')
        this.globalVariableService.currentMessage.subscribe(message => this.message = message);
        this.globalVariableService.menuCreateDisabled.subscribe(
            menuCreateDisabled => this.menuCreateDisabled = menuCreateDisabled
        );
        this.isFirstTime = this.globalVariableService.isFirstTime;
        
        console.log('ngOnInit', this.message, this.menuCreateDisabled)
    }
//*   ngOnInit() {
//*     this.draggable = this.draggableElement.nativeElement;
//* 
//*     const container = this.containerElement.nativeElement;
//*     this.boundary = {
//*       left: container.offsetLeft + (draggableWidth / 2),
//*       right: container.clientWidth + container.offsetLeft - (draggableWidth / 2),
//*       top: container.offsetTop + (draggableHeight / 2),
//*       bottom: container.clientWidth + container.offsetTop - (draggableHeight / 2),
//*     };
//*     }

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

    
    ngAfterViewInit() {
    }

    ngOnChanges() {
        console.log('menuOptionSelected', this.menuOptionSelected)
    }

    showGraphsReal() {
        // Show Graph Examples
        
        this.showNavExplore = true;
        console.log('showGraph', event, this.menuOptionSelected)
        let definition: dl.spec.TopLevelExtendedSpec = this.vlSpecs[1];
        console.log('definition 1', definition)
        
        // Replacement portion

        definition = this.createVegaLiteSpec(undefined,'bar',undefined,undefined,undefined);
        console.log('definition 2', definition)


        let specification = compile(definition).spec;

        specification = compile(definition).spec;

        let view = new View(parse(specification));
        
        view.renderer('svg')
            // .width(500)
            // .height(500)
            .initialize(this.visReal.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'left', "500px");
    }

    clickSwapXY() {
        // Show Graph Examples
        
        this.showNavExplore = true;
        console.log('showGraph', event, this.menuOptionSelected)
        let definition: dl.spec.TopLevelExtendedSpec = this.vlSpecs[1];
        console.log('definition 1', definition)
        
        // Replacement portion

        definition = this.createVegaLiteSpec(undefined,'bar','Trades','Month',undefined);
        console.log('definition 2', definition)


        let specification = compile(definition).spec;

        specification = compile(definition).spec;

        let view = new View(parse(specification));
        
        view.renderer('svg')
            // .width(500)
            // .height(500)
            .initialize(this.visReal.nativeElement)
            .hover()
            .run()
            .finalize();
            this.renderer.setElementStyle(this.dragWidget.nativeElement,
                'top', "300px");

    }
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

    clickButtonAddDashboard () {
        
        // Experiment: get SQLite from inside the browser
        // ----------------------------------------------
        // var db = new sqlite3.Database('./assets/test.db');
        // db.each("SELECT * FROM memos", (err, row) => {
        //   console.log(row.text);
        // });
        // db.close();        
    }

    clickWidget(ev) {
        return;
    }

    clickIcon(selectedGraphType: string) {
        this.showTypeIcon = true;
        this.showType = false;
        this.graphType = selectedGraphType;  
        this.graphTypeFile = '../images/' + selectedGraphType + '.png';
    }

    clickAdvancedField() {
        this.showAdvancedField = !this.showAdvancedField;
    }

    showWidget() {
        this.showWidgetDesigner = true;
    }

    clickWidgetClose() {
        this.showWidgetDesigner = false;
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
            // this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //     'background-color', 'brown'
        // );
        // this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //     'width', "1000px");
        // this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //     'top', "150px");    
        // this.renderer.setElementStyle(this.dragWidget.nativeElement,
        //     'border', "4px solid black");    
    }

    clickDropdownType() {
        if (this.typeDropdown.nativeElement.className == "dropdown open") {
            this.typeDropdown.nativeElement.className = "dropdown";
        } else {
            this.typeDropdown.nativeElement.className = "dropdown open";
        }
    }

    addNewTab() {
        this.secondTab = ! this.secondTab;
    }

    clickCloseModel() {
        this.showModalOpenDashboard = false;
    }

    clickTabBg(dash: string) {
        console.log('clickTabBg', dash)
    }

    clickDeleteTab() {
        alert ('Cannot delete last remaining Tab')
    }

    clickGotIt() {
        this.isFirstTime = !this.isFirstTime;
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