/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';

@Component({
    selector: 'dashboard-share',
    templateUrl: './dashboard.share.component.html',
    styleUrls: ['./dashboard.share.component.css']
})
export class DashboardShareComponent implements OnInit {

    @Output() formDashboardShareClosed: EventEmitter<string> = new EventEmitter();

    accessList: boolean = false;
    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardPermissions: DashboardPermission[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardPermissions = this.globalVariableService.dashboardPermissions;
    }
 
    clickClose(action: string) {
        // Close form, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardShareClosed.emit(action);
    }

    clickSelectAccess(ev) {
        // User changed the security access for the D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectAccess', '@Start');

        console.log(ev.srcElement.value)
        // Set accessList
        if (ev.srcElement.value == 'Access List') {
            this.accessList = true;
        } else {
            this.accessList = false;
        }
    }
}
