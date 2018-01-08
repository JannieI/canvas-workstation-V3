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

@Component({
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    isFirstTimeDashboardOpen: boolean;
    showAdvancedFilters: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboardOpen = i
        )
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formDashboardOpenClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboard.next(false);
    }

    clickShowAdvancedFilters() {
        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

    clickOpenView(id: number) {
        console.log('View D id', id)
        this.globalVariableService.currentDashboardID.next(id);
        this.globalVariableService.editMode.next(false);
		this.formDashboardOpenClosed.emit('View');
    }

    clickOpenEdit(id: number) {
        console.log('Edit D id', id)
        this.globalVariableService.currentDashboardID.next(id);
        this.globalVariableService.editMode.next(true);
		this.formDashboardOpenClosed.emit('View');
    }
}
