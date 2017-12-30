// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our models
import { CurrentDatasource }          from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'data-slicers',
    templateUrl: './data.slicers.component.html',
    styleUrls: ['./data.slicers.component.css']
  })
  export class DataSlicersComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDataSlicersClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

  	clickClose(action: string) {
	  	this.formDataSlicersClosed.emit(action);
        }

    clickSave() {
      this.globalVariableService.slicerHeader.next('Changed')
	  	this.formDataSlicersClosed.emit('Saved');
    }
  }
