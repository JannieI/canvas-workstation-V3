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
import { Widget }                     from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';


@Component({
    selector: 'widget-delete',
    templateUrl: './widget.delete.component.html',
    styleUrls: ['./widget.delete.component.css']
})
export class WidgetDeleteComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @ViewChild('widgetDOM')  widgetDOM: ElementRef;
    @Output() formWidgetDeleteClosed: EventEmitter<string> = new EventEmitter();

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
            this.clickClose('delete');
            return;
        };

    }


    nrWidgetStoredTemplates: number = 0;
    specification: any;


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Init routine
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
        
        // let localWidget = Object.assign({}, this.selectedWidget);
        let localWidget = JSON.parse(JSON.stringify(this.selectedWidget));
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;

        // Count Widget Stored Templates linked to this W
        this.globalVariableService.getResource('widgetStoredTemplates').then(res => {
            if (res != null  && res.length > 0) {
                res = res.filter(wst => wst.widgetID == localWidget.id)
                this.nrWidgetStoredTemplates = res.length;
            };
        });

        // TODO - a huge graph shows too big - change Vega param to fix this.
        localWidget.graphTitle = '';
        localWidget.graphXaxisTitle = '';
        localWidget.graphYaxisTitle = '';
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';
        localWidget.containerBackgroundcolorName = 'white';

        // Render graph for Vega-Lite
        if (localWidget.visualGrammar == 'Vega-Lite') {

            // Create specification
            this.specification = this.globalVariableService.createVegaLiteSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let vegaSpecification = compile(this.specification).spec;
            let view = new View(parse(vegaSpecification));

            view.renderer('svg')
                .initialize(this.widgetDOM.nativeElement)
                .width(372)
                .hover()
                .run()
                .finalize();
        };

        // Render graph for Vega
        if (localWidget.visualGrammar == 'Vega') {

            // Create specification
            this.specification = this.globalVariableService.createVegaSpec(
                localWidget,
                localWidget.graphHeight,
                localWidget.graphWidth
            );

            // Render in DOM
            let view = new View(parse(this.specification));
            view.renderer('svg')
                .initialize(this.widgetDOM.nativeElement)
                .width(372)
                .hover()
                .run()
                .finalize();
        };

    }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

  	clickClose(action: string) {
        // Close the form.  Action = '', or 'delete' to instruct calling routine to delete it
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	this.formWidgetDeleteClosed.emit(action);
    }

}