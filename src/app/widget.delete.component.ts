// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
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


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Init routine
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // let localWidget = Object.assign({}, this.selectedWidget);
        let localWidget = JSON.parse(JSON.stringify(this.selectedWidget));

        // Rescale and limit amount of detail on the graph
        localWidget.containerLeft = 100;
        localWidget.containerTop = 100;
        localWidget.containerHeight = 300;
        localWidget.graphHeight = 280;
        localWidget.containerWidth = 300;
        localWidget.graphWidth = 280;
        localWidget.containerBoxshadow = 'none';
        localWidget.containerBorder = 'none';
        localWidget.isSelected = false;
        // TODO - a huge graph shows too big - change Vega param to fix this.
        localWidget.graphTitle = '';
        localWidget.graphXaxisTitle = '';
        localWidget.graphYaxisTitle = '';
        localWidget.containerBorder = '';
        localWidget.containerBackgroundcolor = 'white';

        let definition = this.globalVariableService.createVegaLiteSpec(localWidget);
        console.warn('xx def', definition)
        let specification = compile(definition).spec;
        let view = new View(parse(specification));
        view.renderer('svg')
            .initialize(this.widgetDOM.nativeElement)
            .hover()
            .run()
            .finalize();

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