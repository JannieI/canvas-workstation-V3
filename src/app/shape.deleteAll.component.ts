/*
 * Shows form to delete all Shapes on the current Tab
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions


@Component({
    selector: 'shape-deleteAll',
    templateUrl: './shape.deleteAll.component.html',
    styleUrls: ['./shape.deleteAll.component.css']
})
export class ShapeDeleteAllComponent implements OnInit {

    @Output() formShapeDeleteClosedAll: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose();
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickDelete();
            return;
        };

    }

    @ViewChild('dragWidget', {read: ElementRef}) dragWidget: ElementRef;  //Vega graph

    errorMessage: string = '';


    constructor(
        private globalFunctionService: GlobalFunctionService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

  	clickClose() {
        // Close the form, no action
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

  	  	this.formShapeDeleteClosedAll.emit();
    }

    clickDelete() {
        // Confirmed, delete the Shape
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        this.formShapeDeleteClosedAll.emit('Delete');
    }
  }