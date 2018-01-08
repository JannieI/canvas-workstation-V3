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
	recentDashboards: Promise<Dashboard[]>;
	sampleDashboards: Promise<Dashboard[]>;
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {

		// Load Startup info:
		//Datasources
        this.globalVariableService.getDatasources();     
		// Sample Dashboards
		this.sampleDashboards = this.globalVariableService.getDashboardSamples();
		// Recent Dashboards
		// TODO - remove hardcoded userID and make data cater for >1 user
		this.recentDashboards = this.globalVariableService.getDashboardsRecent('JannieI');
		}

	ngOnInit() {
	}

	ngAfterViewInit() {
	}
	clickButtonData() {
		console.log('clickButtonData')
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
		if (this.globalVariableService.dashboards == []) {
				this.globalVariableService.statusBarMessages.next(
					'D still loading ...'
				);
				return;
		};

		// Load the dashboardID - Observable that will refresh all needed for current D
		this.globalVariableService.currentDashboardID.next(dashboardID);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

	loadRecentDashboard(dashboardID: number) {
		console.log('start loadRecentDashboard', dashboardID);

		// Check that we have data
		if (this.globalVariableService.dashboards == []) {
			this.globalVariableService.statusBarMessages.next(
				'D still loading ...'
			);
			return;
	};

	// Load the dashboardID - Observable that will refresh all needed for current D
	this.globalVariableService.currentDashboardID.next(dashboardID);

	// Close modal, and show the Dashboard
	this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

	promptDeleteRecent(index: number) {
		console.log("Prompt and then delete from list", index)
		this.globalVariableService.deleteDashboardRecent(index);
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
		let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs
			.filter(i => i.dashboardID = 1
		);
		console.log('currentDashboardTabs', this.globalVariableService.dashboardTabs, currentDashboardTabs)
		this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs)
		this.formLandingClosed.emit();
		this.router.navigate(['/explore']);
	}

}
