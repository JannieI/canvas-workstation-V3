// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';


@Component({
    selector: 'widget-editor',
    templateUrl: './widget.editor.component.html',
    styleUrls: ['./widget.editor.component.css']
  })
  export class WidgetEditorComponent implements OnInit {
  
      @Output() formWidgetEditorClosed: EventEmitter<string> = new EventEmitter();
      
      constructor(
          private globalFunctionService: GlobalFunctionService,
          private router: Router
      ) {}
 
    ngOnInit() {

    }
      
	clickClose(action: string) {
		this.formWidgetEditorClosed.emit(action);
    }
    
  }