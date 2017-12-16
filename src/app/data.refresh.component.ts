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
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions




@Component({
    selector: 'data-refresh',
    templateUrl: './data.refresh.component.html',
    styleUrls: ['./data.refresh.component.css']
  })
  export class DataRefreshComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDataRefreshClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    currentDatasources: currentDatasource[];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
      this.currentDatasources = this.globalVariableService.datasources.filter(
        ds => ds.id < 3
      );
    }

    ngAfterViewInit() {

    }


  	clickClose(action: string) {
	  	this.formDataRefreshClosed.emit(action);
        }

  }
