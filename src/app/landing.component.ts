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
import { Dashboard } 				  from './models';
import { DashboardRecent } 			  from './models';
import { DashboardTab } 			  from './models';


@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();

	// sampleDashboards: Dashboard[] = this.globalVariableService.dashboardsSamples;
	recentDashboards: DashboardRecent[];
	sampleDashboards: Dashboard[];
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {
		// Load Startup info:

		// Create DB models and connect
		this.globalVariableService.connectLocalDB().then(i => {
			if (i != '') {
				console.log('Successfuly Connected to localDB in Landing page Constructor');
			} else {
				console.log('Connection to localDB in Landing page FAILED');
			}
		});


		// All Datasources
		this.globalVariableService.getDatasources();

		// Load D
		this.globalVariableService.getDashboards().then(i => {
			// Sample Dashboards
			this.globalVariableService.getDashboardSamples().then(j => {
				this.sampleDashboards = j;

				// Recent D
				this.globalVariableService.getDashboardsRecent(this.globalVariableService.currentUser.userID).then(k => {
					for (var x = 0; x < k.length; x++) {
						k[x].stateAtRunTime = 'Deleted';
						for (var y = 0; y < this.globalVariableService.dashboards.length; y++) {
							if (this.globalVariableService.dashboards[y].id ==
							k[x].dashboardID) {
								k[x].stateAtRunTime = this.globalVariableService.dashboards[y].state;
								k[x].nameAtRunTime = this.globalVariableService.dashboards[y].name;
							}
						}
					}
					this.recentDashboards = k;
				})
			})
		})
	}

	ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

	}

	ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
	}

	clickOpenSampleDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenSampleDashboard', '@Start');

		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenSampleDashboard', dashboardID, -1, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenSample');
	}

	clickOpenRecentDashboard(dashboardID: number, dashboardTabID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenRecentDashboard', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, dashboardTabID, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenRecent');
	}

	deleteRecent(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteDashboardRecent(index).then(
			i => {
				// this.recentDashboards = this.globalVariableService.getDashboardsRecentlyUsed(
			// 	this.globalVariableService.userID
			// );
		})
	}

	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
	}

	clickOpenExisting() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;

		this.formLandingClosed.emit('OpenExisting');
	}

	clickOpenNewDashboard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.globalVariableService.openNewDashboardFormOnStartup = true;

		this.formLandingClosed.emit('New');
	}

}
