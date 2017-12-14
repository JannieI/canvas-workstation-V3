/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { dashboard }                  from './models';
import { dashboardTemplate }          from './models';

@Component({
    selector: 'dashboard-template',
    templateUrl: './dashboard.template.component.html',
    styleUrls: ['./dashboard.template.component.css']
})
export class DashboardTemplateComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardThemeClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: dashboard[];
    dashboardTemplates: dashboardTemplate[];
   

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTemplates = this.globalVariableService.dashboardTemplates;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardThemeClosed.emit(action);
    }
}
