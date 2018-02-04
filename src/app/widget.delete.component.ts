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

    currentWidgets: Widget;
    nrWidgetsSelected: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        this.globalVariableService.widgetToEditID.subscribe(
            i => {
                    this.currentWidgets = this.globalVariableService.currentWidgets[i];
                    this.nrWidgetsSelected = this.globalVariableService.currentWidgets.length;
            }
        );

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

        this.globalVariableService.deleteWidget(this.currentWidgets.id);

        this.formWidgetDeleteClosed.emit('Deleted');
    }
}