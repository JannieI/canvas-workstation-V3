// Global functions
import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

// Our Models

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

        // Clean alerts
        this.sessionDebugging = this.globalVariableService.sessionDebugging;
        this.sessionLogging = this.globalVariableService.sessionLogging;

        // Note: has to use Console log here !
        if (this.sessionDebugging === true) {
          console.log('@' + componentName + ' - ' + functionName + ': ' + message);
        }

        // Log to DB if loggin switched on GLOBALLY
        if (this.sessionLogging == true) {
          console.log('-- Later on Logging to DB / File: @' + componentName + ' - ' + functionName + ': ' + message);
        }
    }

}
