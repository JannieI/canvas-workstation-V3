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
        });
        
    }

    dblClickView(index: number, id: number) {
        // Toggle the View value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickView', '@Start');

        this.dashboardSubscriptions[index].view = !this.dashboardSubscriptions[index].view;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickEditMode(index: number, id: number) {
        // Toggle the EditMode value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickEditMode', '@Start');

        this.dashboardSubscriptions[index].editmode = !this.dashboardSubscriptions[index].editmode;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickSave(index: number, id: number) {
        // Toggle the Save value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickSave', '@Start');

        this.dashboardSubscriptions[index].save = !this.dashboardSubscriptions[index].save;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickDelete(index: number, id: number) {
        // Toggle the Delete value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'v', '@Start');

        this.dashboardSubscriptions[index].delete = !this.dashboardSubscriptions[index].delete;
        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    dblClickNotify(index: number, id: number) {
        // Toggle the Notify value for the given row
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickNotify', '@Start');

        if (this.dashboardSubscriptions[index].notify == 'Email') {
            this.dashboardSubscriptions[index].notify = 'Message';
        } else {
            if (this.dashboardSubscriptions[index].notify == 'Message') {
                this.dashboardSubscriptions[index].notify = 'Both'
            } else {
                if (this.dashboardSubscriptions[index].notify == 'Both') {
                    this.dashboardSubscriptions[index].notify = 'Email'
                };
            };
        };

        this.globalVariableService.saveDashboardSubscription(this.dashboardSubscriptions[index]);
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardSubscribeClosed.emit(action);
    }

}
