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
import { currentDatasource }          from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

@Component({
    templateUrl: './widget.expand.component.html',
    styleUrls: ['./widget.expand.component.css']
  })
  export class WidgetExpandComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formWidgetExpandClosed: EventEmitter<string> = new EventEmitter();

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
	  	this.formWidgetExpandClosed.emit(action);
        }

  }
