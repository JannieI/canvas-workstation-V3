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

@Component({
    selector: 'dashboard-save',
    templateUrl: './dashboard.save.component.html',
    styleUrls: ['./dashboard.save.component.css']
})
export class DashboardSaveComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    showNoSecurity: boolean = true;
    showTeam: boolean = false;
    showQArequired: boolean = false;
    dashboards: dashboard[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardOpenClosed.emit(action);
    }

    clickSecurityMode(mode: any) {
        console.log('mode', mode.srcElement.value)
        if (mode.srcElement.value == 'No Security') {
            this.showNoSecurity = true;
            this.showTeam = false;
            this.showQArequired = false;
        }
        if (mode.srcElement.value == 'Team') {
            this.showNoSecurity = false;
            this.showTeam = true;
            this.showQArequired = false;
        }
        if (mode.srcElement.value == 'QA required') {
            this.showNoSecurity = false;
            this.showTeam = false;
            this.showQArequired = true;
        }
    }

    clickSaveFile() {
        
    }
}
