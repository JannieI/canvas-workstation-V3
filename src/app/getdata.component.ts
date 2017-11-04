/*
 * Get Data Wizard
 */

import { Component }                  from "@angular/core";
import { Router }                     from '@angular/router';
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
        private router: Router
        
    ) {
    }

    ngOnInit () {
        console.log('oninit ...')
        // Prevent opening on startup ...
        if (!this.globalVariableService.xlOpenGetDataWizard) {
            this.globalVariableService.xlOpenGetDataWizard = true;
        } else {
            this.xlOpenGetDataWizard = true;
        };
        this.wizardExtraLarge.reset();
    }

    clickButtonFinish() {
        console.log('clickButtonFinish')
        this.globalVariableService.xlOpenGetDataWizard = true;  // Set for next time
        this.wizardExtraLarge.close;
        this.router.navigate(['/data']);
        
    }

    ngOnDestroy() {
        console.log('dead')
    }
}
