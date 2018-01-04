/*
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
import { Datasource, DashboardTab } 				  from 'app/models';
import { Dashboard } 				  from 'app/models';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();

	sampleDashboards: Partial<Dashboard>[] = this.globalVariableService.dashboardsSamples;
	recentDashboards: Partial<Dashboard>[] = this.globalVariableService.dashboardsRecent;
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {}

	ngOnInit() {
	}

	clickButtonData() {
		console.log('clickButtonData')
		this.globalVariableService.changeMenuCreateDisabled(true);
		this.router.navigate(['/data']);
	}

	loadExistingSpecification(action: string) {
		console.log('start loadExistingSpecification');
		this.formLandingClosed.emit(action);
		this.router.navigate(['/explore']);
	}

	loadsampleDashboard(index: number) {
		console.log('start loadsampleDashboard', index);

		// Load the current Dashboard
		let currentDashboards = this.globalVariableService.dashboardsSamples.filter(
			i => i.id == index
		)
		this.globalVariableService.currentDashboards = currentDashboards;

		// Load the current DashboardTab
		let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs.value.filter(
			i => i.dashboardID = 1
		);
		this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs);

		// Load Widgets, Shapes and Slicers
		// this.globalVariableService.currentWidgets.next(this.globalVariableService.getWidgets());
        this.globalVariableService.get('getWidgets', null, 1);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

	loadRecentDashboard(index: number) {
		console.log('start loadRecentDashboard', index);
		let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs.value.filter(
			i => i.dashboardID = 1
		);

		this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs);
		this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

	promptDeleteRecent(index: number) {
		console.log("Prompt and then delete from list", index)
		this.globalVariableService.dashboardRecentDelete(index);
	}
	
	clickClose(action: string) {
		this.formLandingClosed.emit(action);
		if (action !== 'OpenExisting') {
			this.router.navigate(['/data']);
		}
	}

	clickOpenExisting() {
		console.log('ai')
		this.globalVariableService.openDashboardFormOnStartup = true;
		let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs.value.filter(
			i => i.dashboardID = 1
		);
		console.log('currentDashboardTabs', this.globalVariableService.dashboardTabs.value, currentDashboardTabs)
		this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs)
		this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

}
