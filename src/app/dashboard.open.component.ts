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

@Component({
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Input() test: boolean;
    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    dashboards: Dashboard[];
    isFirstTimeDashboardOpen: boolean;
    records: number = 10;
    showAdvancedFilters: boolean = false;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboardOpen = i
        );
        console.log('test', this.test)
    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.test = true;

        console.log('DashboardOpen clickClose', this.test)

		this.formDashboardOpenClosed.emit(action);
    }

    clickGotIt() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGotIt', '@Start');

        this.globalVariableService.isFirstTimeDashboard.next(false);
    }

    clickShowAdvancedFilters() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        this.showAdvancedFilters = !this.showAdvancedFilters;
        if (this.showAdvancedFilters) {
            this.records = 3
        } else {
            this.records = 10
        };
    }

    clickOpenView(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenView', '@Start');

        console.log('DashboardOpen clickOpenView id', dashboardID)

        this.globalVariableService.editMode.next(false);

        // Set ids and then signal that the Dashboard must be refreshed
        // this.globalVariableService.currentDashboardID = dashboardID;
        // this.globalVariableService.currentDashboardTabID = 1;
        // this.globalVariableService.refreshDashboard.next(true);

		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, -1, ''
        );
        
        this.formDashboardOpenClosed.emit('View');
    }

    clickOpenEdit(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenEdit', '@Start');

        console.log('DashboardOpen clickOpenEdit id', dashboardID)

        this.globalVariableService.editMode.next(true);

        // Set ids and then signal that the Dashboard must be refreshed
        // this.globalVariableService.currentDashboardID = dashboardID;
        // this.globalVariableService.currentDashboardTabID = 1;
        // this.globalVariableService.refreshDashboard.next(true);
		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, -1, ''
        );
        this.formDashboardOpenClosed.emit('View');
    }
}
