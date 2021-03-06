/*
 * Global functions used by all components
*/

import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

// Our Models

// Vega

@Injectable()
export class GlobalFunctionService {
    sessionDebugging: boolean;
    sessionLogging: boolean;
    gridSize: number;                           // Size of grid blocks, ie 3px x 3px
    snapToGrid: boolean = true;                 // If true, snap widgets to gridSize

    constructor(
      private globalVariableService: GlobalVariableService) {
    }

    // Prints a message to the console if in debugging mode GLOBALLY
    printToConsole(componentName: string, functionName: string, message: string) {

        // Clean logging
        this.sessionDebugging = this.globalVariableService.sessionDebugging;
        this.sessionLogging = this.globalVariableService.sessionLogging;

        // Note: has to use Console log here !
        if (this.sessionDebugging === true) {
          console.log('%c @' + componentName + ' - ' + functionName + ': ' + message,
            "color: yellow; background: black; font-size: 10px");
        }

        // Log to DB if loggin switched on GLOBALLY
        if (this.sessionLogging === true) {
          console.log('-- Later on Logging to DB / File: @' + componentName + ' - ' + functionName + ': ' + message);
        }
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
            break;
        }
      }
    }
}
