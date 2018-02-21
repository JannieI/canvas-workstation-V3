// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource }                 from './models';
import { Widget }                     from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions


@Component({
    selector: 'widget-delete',
    templateUrl: './widget.delete.component.html',
    styleUrls: ['./widget.delete.component.css']
})
export class WidgetDeleteComponent implements OnInit {

    // @Input() nrWidgetsSelected: number;
    @Output() formWidgetDeleteClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph
    @ViewChild('myCanvas', {read: ElementRef}) myCanvas: ElementRef;  //Vega graph

    currentWidgets: Widget[] = [];
    nrWidgetsSelected: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get the current W
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {

                // Make a deep copy
                let localWidget= Object.assign({}, w);

                // Rescale and limit amount of detail on the graph
                // TODO - change if multiple can be deleted
                localWidget.containerLeft = 100;
                localWidget.containerTop = 100;
                localWidget.containerHeight = 100;
                localWidget.graphHeight = 80;
                localWidget.containerWidth = 100;
                localWidget.graphWidth = 80;
                localWidget.containerBoxshadow = 'none';
                localWidget.containerBorder = 'none';
                localWidget.isSelected = false;
                // TODO - a huge graph shows too big - change Vega param to fix this.
                localWidget.graphTitle = '';
                localWidget.graphXaxisTitle = '';
                localWidget.graphYaxisTitle = '';
                localWidget.containerBorder = '';
                localWidget.containerBackgroundcolor = 'white';
                this.currentWidgets.push(localWidget);

            };
        });
        
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {
                // this.currentWidgets[0] = w;
                this.nrWidgetsSelected = this.nrWidgetsSelected + 1;
            };
        });

    }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

  	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	this.formWidgetDeleteClosed.emit(action);
    }

    // clickDeleteWidget() {
    //     // Delete the Widget
    //     this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteWidget', '@Start');
    //     console.log('xx clickDeleteWidget', this.globalVariableService.currentWidgets)
        
    //     // TODO - amend if more than W can be selected for deletion
    //     this.globalVariableService.deleteWidget(this.currentWidgets[0].id);

    //     this.formWidgetDeleteClosed.emit('Deleted');
    // }
}