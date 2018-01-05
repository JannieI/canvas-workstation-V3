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

	// sampleDashboards: Dashboard[] = this.globalVariableService.dashboardsSamples;
	recentDashboards: Dashboard[] = this.globalVariableService.dashboardsRecent;
	sampleDashboards: Promise<Dashboard[]>;
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {
		// this.globalVariableService.getDashboardSamples()
		// 	.then(data => this.sampleDashboards = data);
		this.sampleDashboards = this.globalVariableService.getDashboardSamples()

		}

	ngOnInit() {
	}

	ngAfterViewInit() {
		console.log('af', this.sampleDashboards)
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

	loadsampleDashboard(dashboardID: number) {
		console.log('start loadsampleDashboard', dashboardID);

		// Check that we have data
		if (this.globalVariableService.dashboardsSamples == []  ||
			this.globalVariableService.dashboards == []) {
				this.globalVariableService.statusBarMessages.next(
					'Still loading ...'
				);
				return;
		};

		this.globalVariableService.currentDashboardID =
			this.globalVariableService.dashboardsSamples[dashboardID].id;
		console.log('id', dashboardID, this.globalVariableService.currentDashboardID)

		// Load the current Dashboard, and Optional template
		let currentDashboards: Dashboard[] = [];
		currentDashboards.push(this.globalVariableService.dashboardsSamples[dashboardID]);
		if (currentDashboards[0].templateDashboardID != 0) {
			let templeteDashboard: Dashboard[] = null;

			templeteDashboard = this.globalVariableService.dashboards.filter(
				i => i.id = currentDashboards[0].templateDashboardID
			);

			if (templeteDashboard == null) {
				alert('Dashboard template id does not exist in Dashboards')
			} else {
				currentDashboards.push(templeteDashboard[0]);
			}
		}

		// Load the current DashboardTab
		let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs.value.filter(
			i => i.dashboardID = this.globalVariableService.currentDashboardID
		);
		this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs);

		// Load Widgets, Shapes and Slicers
        this.globalVariableService.getCurrentWidgets(this.globalVariableService.currentDashboardID);

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
