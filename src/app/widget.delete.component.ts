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

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Init routine
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Count Widget Stored Templates linked to this W
        this.globalVariableService.getWidgetStoredTemplates().then(res => {
            if (res != null  && res.length > 0) {
                this.nrWidgetStoredTemplates = res.length;
            };
        });
        
        // let localWidget = Object.assign({}, this.selectedWidget);
        let localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Rescale and limit amount of detail on the graph
        // localWidget.containerLeft = 100;
        // localWidget.containerTop = 100;
        // localWidget.containerHeight = 300;
        // localWidget.graphHeight = 280;
        // localWidget.containerWidth = 300;
        // localWidget.graphWidth = 280;
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;
        // TODO - a huge graph shows too big - change Vega param to fix this.
        localWidget.graphTitle = '';
        localWidget.graphXaxisTitle = '';
        localWidget.graphYaxisTitle = '';
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';
        localWidget.containerBackgroundcolorName = 'white';

        if (localWidget.visualGrammar == 'Vega-Lite') {

            let definition = this.globalVariableService.createVegaLiteSpec(localWidget, 200, 220);

            let specification = compile(definition).spec;
            let view = new View(parse(specification));
            view.renderer('svg')
                .initialize(this.widgetDOM.nativeElement)
                .hover()
                .run()
                .finalize();
        } else {

            // Render graph for Vega
            if (localWidget.visualGrammar == 'Vega') {
                if (localWidget.graphSpecification != undefined) {
                    localWidget.graphSpecification.width = 200;
                    localWidget.graphSpecification.height = 200;
                    let view = new View(parse(localWidget.graphSpecification));

                    view.renderer('svg')
                        .initialize(this.widgetDOM.nativeElement)
                        .width(200)
                        .height(220)
                        .hover()
                        .run()
                        .finalize();
                };
            };
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