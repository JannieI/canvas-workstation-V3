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
import { DashboardSnapshot }                 from './models';

@Component({
    selector: 'dashboard-subscribe',
    templateUrl: './dashboard.subscribe.component.html',
    styleUrls: ['./dashboard.subscribe.component.css']
})
export class DashboardSubscribeComponent implements OnInit {

    @Output() formDashboardSubscribeClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    subscriptions = [
        {
            view: true,
            editmode: true,
            save: false,
            delete: true,
            dashboardname: 'Budget',
            notify: 'Email'
        },
        {
            view: false,
            editmode: false,
            save: false,
            delete: true,
            dashboardname: 'Budget',
            notify: 'Msg'
        }
    ]
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardSubscribeClosed.emit(action);
    }
}
