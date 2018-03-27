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

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'widget-export',
    templateUrl: './widget.export.component.html',
    styleUrls: ['./widget.export.component.css']
})
export class WidgetExportComponent implements OnInit {

    @Output() formWidgetExportClosed: EventEmitter<string> = new EventEmitter();

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private router: Router,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }


  	clickClose(action: string) {
        // Close the form, no action taken
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formWidgetExportClosed.emit(action);
    }

    clickExport() {
        // Export the image, and close the file
        this.globalFunctionService.printToConsole(this.constructor.name,'clickExport', '@Start');
  
  	  	this.formWidgetExportClosed.emit('Exported');
        
    }
}
