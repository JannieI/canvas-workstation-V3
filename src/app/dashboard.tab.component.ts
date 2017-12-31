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
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

@Component({
    selector: 'dashboard-tab',
    templateUrl: './dashboard.tab.component.html',
    styleUrls: ['./dashboard.tab.component.css']
  })
  export class DashboardTabComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardTabClosed: EventEmitter<string> = new EventEmitter();


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {}

  	clickClose(action: string) {
	  	this.formDashboardTabClosed.emit(action);
    }

    clickDelete(action: string) {
      alert('Can only delete a Tab once it is empty (so remove Widgets first), and cannot delete the last Tab (has to have at least one)')
	  	this.formDashboardTabClosed.emit(action);
    }
  }