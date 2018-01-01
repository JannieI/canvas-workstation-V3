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
import { Dashboard }                  from './models';
import { DashboardTag }               from './models';

@Component({
    selector: 'dashboard-tags',
    templateUrl: './dashboard.tags.component.html',
    styleUrls: ['./dashboard.tags.component.css']
})
export class DashboardTagsComponent implements OnInit {

    @Output() formDashboardTagsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: Partial<Dashboard>[];
    dashboardTags: DashboardTag[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formDashboardTagsClosed.emit(action);
    }

}
