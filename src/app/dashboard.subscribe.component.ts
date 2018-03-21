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
import { DashboardSubscription }      from './models';

@Component({
    selector: 'dashboard-subscribe',
    templateUrl: './dashboard.subscribe.component.html',
    styleUrls: ['./dashboard.subscribe.component.css']
})
export class DashboardSubscribeComponent implements OnInit {

    @Output() formDashboardSubscribeClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardSubscriptions: DashboardSubscription[] = [];
    //     {
    //         view: true,
    //         editmode: true,
    //         save: false,
    //         delete: true,
    //         dashboardname: 'Budget',
    //         notify: 'Email'
    //     },
    //     {
    //         view: false,
    //         editmode: false,
    //         save: false,
    //         delete: true,
    //         dashboardname: 'Budget',
    //         notify: 'Msg'
    //     }
    // ]
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;

        this.globalVariableService.getDashboardSubscription().then(data =>
             {
                 this.dashboardSubscriptions = data;
                console.log('xx data', this.dashboardSubscriptions)
        });
        
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSubscribeClosed.emit(action);
    }
}
