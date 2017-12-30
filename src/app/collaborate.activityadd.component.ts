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

// Functions




@Component({
    selector: 'collaborate-activityadd',
    templateUrl: './collaborate.activityadd.component.html',
    styleUrls: ['./collaborate.activityadd.component.css']
  })
  export class CollaborateActivityAddComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formCollaborateActivityAddClosed: EventEmitter<string> = new EventEmitter();

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
	  	this.formCollaborateActivityAddClosed.emit(action);
        }

  }