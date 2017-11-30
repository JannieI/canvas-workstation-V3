/* 
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';

import { Wizard } from "clarity-angular";
import { WizardPage } from "clarity-angular";

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { currentDatasource }          from './model.currentDashboard';
import { transformation }             from './models'
import { field }                      from './models'
import { fieldMetadata }              from './models'

interface Idata{
    name: string;
}

@Component({
    selector: 'data-popup1',
    templateUrl: './data.popup1.component.html',
    styleUrls:  ['./data.popup1.component.css']
})
export class DataPopup1Component implements OnInit {

    @Input() showWizard: boolean;
    @Output() formDataPopupClosed: EventEmitter<string> = new EventEmitter();
    
    @ViewChild("wizard") wizard: Wizard;
    @ViewChild("pageThree") pageThree: WizardPage;
    @ViewChild("pageFive") pageFive: WizardPage;

    open: boolean = true;

    ngOnInit() {
        console.log('ngOnInit')
        this.open = true;
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit')
        this.open = true;
        
    }
    
    public jumpTo(page: WizardPage) {
        if (page && page.completed) {
            this.wizard.navService.setCurrentPage(page);
        } else {
            this.wizard.navService.setLastEnabledPageCurrent();
        }
        this.wizard.open();
    }

    public jumpToThree(): void {
        this.jumpTo(this.pageThree);
    }

    public jumpToFive(): void {
        this.jumpTo(this.pageFive);
    }

    clickClose(action: string) {
		this.formDataPopupClosed.emit(action);
    }

    

}