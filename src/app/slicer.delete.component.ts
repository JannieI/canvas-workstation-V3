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

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions


@Component({
    selector: 'slicer-delete',
    templateUrl: './slicer.delete.component.html',
    styleUrls: ['./slicer.delete.component.css']
})
export class SlicerDeleteComponent implements OnInit {

    @Input() currentSlicerSpec: any;
    @Output() formSlicerDeleteClosed: EventEmitter<string> = new EventEmitter();

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

  	clickClose() {
        // Close the form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formSlicerDeleteClosed.emit();
    }

    clickDelete() {
        // Confirmed, delete the Slicer
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.formSlicerDeleteClosed.emit('Delete');
    }
  }