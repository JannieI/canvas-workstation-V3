/*
 * Shows form with the colour picker
 */

// Angular
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'colour-picker',
    templateUrl: './colour.picker.component.html',
    styleUrls: ['./colour.picker.component.css']
})
export class ColourPickerComponent implements OnInit {

    @Input() callingRoutine: string;
    @Input() selectedColor: string;


    constructor(
      private globalFunctionService: GlobalFunctionService,
      private globalVariableService: GlobalVariableService,
    ) { }

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    clickClose() {
        // User clicked close
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.globalVariableService.colourPickerClosed.next(
            {
                callingRoutine: '',
                selectedColor: '',
                cancelled: true
            }
        );

    }

    clickColor(color: any, p1: number, p2: number) {
        // User clicked a colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColor', '@Start');

        this.selectedColor = color;

        // Return, and let calling routine know
        this.globalVariableService.colourPickerClosed.next(
            {
                callingRoutine: this.callingRoutine,
                selectedColor: color,
                cancelled: false
            }
        );
    }

    mouseOverColor(color: any) {
        // Hover over a colour
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseOverColor', '@Start');

        this.selectedColor = color;

    }

    mouseOutMap() {
        // Mouse leaves color map
        this.globalFunctionService.printToConsole(this.constructor.name,'mouseOutMap', '@Start');

        this.selectedColor = 'transparent';
    }

  }
