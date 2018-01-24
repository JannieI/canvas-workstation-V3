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

// Our Models
import { Datasource } 				  from './models';
import { DashboardTab } 			  from './models';
import { Dashboard } 				  from './models';

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

		console.log('Landing constructor')
		// Load Startup info:
		//Datasources
        this.globalVariableService.getDatasources();
		// Sample Dashboards
		this.sampleDashboards = this.globalVariableService.getDashboardSamples();
		// Recent Dashboards
		// TODO - remove hardcoded userID and make data cater for >1 user
		this.recentDashboards = this.globalVariableService.getDashboardsRecentlyUsed('JannieI');
		this.globalVariableService.getDashboardsRecent('JannieI');
	}

	ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
	}

	ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');

	}

	clickButtonData() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickButtonData', '@Start');

		console.log('Landing clickButtonData')
		this.router.navigate(['/data']);
	}

	clickOpenSampleDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenSampleDashboard', '@Start');

		console.log('Landing start clickOpenSampleDashboard', dashboardID);

		// Check that we have data
		if (this.globalVariableService.dashboards == []) {
				this.globalVariableService.statusBarMessages.next(
					'D still loading ...'
				);
				return;
		};

		// Set ids and then signal that the Dashboard must be refreshed
		this.globalVariableService.currentDashboardID = dashboardID;
		this.globalVariableService.currentDashboardTabID = 1;
		this.globalVariableService.refreshDashboard.next(true);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit();
		// this.router.navigate(['/explore']);
	}

	clickOpenRecentDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenRecentDashboard', '@Start');

		console.log('Landing start clickOpenRecentDashboard', dashboardID);

		// Set ids and then signal that the Dashboard must be refreshed
		// this.globalVariableService.currentDashboardID = dashboardID;
		// this.globalVariableService.currentDashboardTabID = 1;
		// this.globalVariableService.refreshDashboard.next(true);
        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, 1, ''
		);    

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit();
			// this.router.navigate(['/explore']);
	}

	deleteRecent(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteDashboardRecent(index).then(
			i => {
				this.recentDashboards = this.globalVariableService.getDashboardsRecentlyUsed(
				this.globalVariableService.userID
			);
		})
	}

	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
		// if (action !== 'OpenExisting') {
		// 	this.router.navigate(['/data']);
		// }
	}

	clickOpenExisting() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;
		// let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs
		// 	.filter(i => i.dashboardID = 1
		// );
		// console.log('Landing clickOpenExisting', this.globalVariableService.dashboardTabs, currentDashboardTabs)
		// this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs)
		this.formLandingClosed.emit();
		// this.router.navigate(['/explore']);
	}

	clickOpenNewDashboard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.globalVariableService.openNewDashboardFormOnStartup = true;
		// let currentDashboardTabs: DashboardTab[] = this.globalVariableService.dashboardTabs
		// 	.filter(i => i.dashboardID = 1
		// );
		// console.log('Landing clickOpenNewDashboard', this.globalVariableService.dashboardTabs, currentDashboardTabs)
		// this.globalVariableService.currentDashboardTabs.next(currentDashboardTabs)
		this.formLandingClosed.emit();
		// this.router.navigate(['/explore']);
	}

}
