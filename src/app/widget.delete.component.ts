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

        // Get the current W
        this.globalVariableService.currentWidgets.forEach(w => {
            if (w.isSelected) {

                // TODO - improve this when using a DB!
                let newID: number = 1;
                if (this.globalVariableService.widgets.length > 0) {
                    newID = this.globalVariableService.widgets.length - 1;
                };

                // Make a deep copy
                let localWidget= Object.assign({}, w);
                localWidget.id = newID;

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

    }

    drawGrid() {
      // var c = document.getElementById("myCanvas");
      // var ctx = c.getContext("2d");
      // ctx.clearRect(0, 0, c.width, c.height);
      // var img = document.getElementById("lamp")
      // var pat = ctx.createPattern(img, 'repeat');
      // ctx.rect(0, 0, 150, 100);
      // ctx.fillStyle = pat;
      // ctx.fill();
    }
  	clickClose(action: string) {
	  	this.formWidgetDeleteClosed.emit(action);
        }
        clickDelete(index: number) {
            console.log('clickDelete', index)
            this.globalVariableService.deleteWidget(index);
        }
    clickDeleteWidget() {
        console.log('clickDelete')

        this.globalVariableService.deleteWidget(this.currentWidgets[0].id);

        this.formWidgetDeleteClosed.emit('Deleted');
    }
}