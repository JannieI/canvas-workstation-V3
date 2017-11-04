/*
 * Get Data Wizard
 */

import { Component }                  from "@angular/core";
import { ViewChild }                  from "@angular/core";

// Clarity UI
import {Wizard}                       from "clarity-angular";

// Our Services
import { GlobalVariableService }      from './global-variable.service';

@Component({
    styleUrls: ['./getdata.component.css'],
    templateUrl: './getdata.component.html',
})
export class GetDataComponent {
    @ViewChild("wizardxl") wizardExtraLarge: Wizard;
    
    xlOpenGetDataWizard: boolean = false;  // Open Wizard if True
    
    constructor(
        private globalVariableService: GlobalVariableService,
    ) {
    }
    ngOnInit () {
        console.log('oninit ...')
        this.xlOpenGetDataWizard = this.globalVariableService.xlOpenGetDataWizard; // Open when menu is clicked
        this.wizardExtraLarge.reset();
    }

    clickButtonFinish() {
        console.log('clickButtonFinish')
        this.globalVariableService.xlOpenGetDataWizard = true;  // Reset for next time
    }
    ngOnDestroy() {
        console.log('dead')
    }
}
