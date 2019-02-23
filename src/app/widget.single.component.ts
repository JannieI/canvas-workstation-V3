/*
 * Manage a single Graph component
 */

// From Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { Input }                      from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Widget }                     from './models'

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';


@Component({
    selector: 'widget-single',
    templateUrl: './widget.single.component.html',
    styleUrls: ['./widget.single.component.css']
})
export class WidgetSingleComponent {
    @Input() widget: Widget;

    @ViewChild('graphDOM')  graphDOM: ElementRef;

    editMode: boolean;
    endWidgetNumber: number;
    isBusyResizing: boolean = false;
    refreshGraphs: boolean = false;
    selectedWidgetIDs: number[] = [];
    specification: any;
    startX: number;
    startY: number;
    startWidgetNumber: number;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,

    ) {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'constructor', '@Start');

    }
    ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }
    ngAfterViewInit() {
        // After View Init
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngAfterViewChecked() {
        // Runs after the View has been initialised.  This is needed to refresh the graphs
        // in the app component.
        // TODO - switch on later, this fires ALL the time ...
        // this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewChecked', '@Start');

        if (!this.refreshGraphs) {
            this.refreshGraphs = true;
            this.refreshWidget(null, 'wsingle ngAfterViewChecked');
        }
    }

    refreshWidget(w: Widget, callingRoutine: string) {
        // Refreshes this W
        // NOTE: the should not be called indivdually from another routine - let the ngFor loop
        //       do the work.  Else the incorrect W will be refreshed
        this.globalFunctionService.printToConsole(this.constructor.name,'refreshWidget', '@Start');

        console.warn('xx refreshWidget start- calling, this.widget, w, selectedWidget: ',
            callingRoutine, this.widget!=null? this.widget.id : 'this.widget = null',
            w!=null? w.id : 'w = null')
        if (w != null) {
            this.widget = w;
        }

        // Render graph for Vega-Lite
        if (this.widget.visualGrammar == 'Vega-Lite') {

            // Create specification
            this.specification = this.globalVariableService.createVegaLiteSpec(
                this.widget,
                this.widget.graphHeight,
                this.widget.graphWidth
            );

            console.log('xx this.specification', this.specification)
            // Render in DOM
            let vegaSpecification = compile(this.specification).spec;
            let view = new View(parse(vegaSpecification));

            view.renderer('svg')
                .initialize(this.graphDOM.nativeElement)
                // .width(372)
                .hover()
                .run()
                .finalize();
        };

        // Render graph for Vega
        if (this.widget.visualGrammar == 'Vega') {

            // Create specification
            this.specification = this.globalVariableService.createVegaSpec(
                this.widget,
                this.widget.graphHeight,
                this.widget.graphWidth
            );

            // Render in DOM
            let view = new View(parse(this.specification));
            view.addEventListener('click', function(event, item) {
                console.log('CLICK', event, item);
            });
            view.renderer('svg')
                .initialize(this.graphDOM.nativeElement)
                // .width(372)
                .hover()
                .run()
                .finalize();
            // view.on("click", function(evt, item) { view.update({props:"click", items:item}); })
        };
    }

    clickSingleWidget() {
        // Click W object
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSingleWidget', '@Start');

        // // TODO - fix index..
        // this.currentWidgets[index].isSelected = !this.currentWidgets[index].isSelected;
        // this.globalVariableService.currentWidgets.forEach(w => {
        //     if (w.id == id) {
        //         w.isSelected = this.currentWidgets[index].isSelected;
        //     };
        // });

    }
}