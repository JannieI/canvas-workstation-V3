/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardTemplate }          from './models';

@Component({
    selector: 'dashboard-template',
    templateUrl: './dashboard.template.component.html',
    styleUrls: ['./dashboard.template.component.css']
})
export class DashboardTemplateComponent implements OnInit {

    @Output() formDashboardTemplateClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    
    currentDashboard: string = '';
    dashboards: Dashboard[];
    dashboardTemplates: DashboardTemplate[];
    showTypeDashboard: boolean = false;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards.slice();
        this.dashboardTemplates = this.globalVariableService.dashboardTemplates;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardTemplateClosed.emit(action);
    }
}
