/*
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

const sampleDashboards = [
  	{
  		name: "Headcount for management pack",
  	},
  	{
  		name: "Presentation to Bitvest on listings value preposition",
  	},
  	{
  		name: "Settlement window analysis",
  	},
  	{
  		name: "Cost breakdown for Finance Department"
  	}
]

const recentDashboards = [
		{
			name: "Exco summary of Value traded in 2017",
		},
		{
			name: "Sales in Norway"
		},
		{
			name: "The rise and fall of Bitcoin"
		},
		{
			name: "Nominal bond values - detail report"
		},
		{
			name: "Bond trading revenue - draft"
		},
		{
			name: "Bond trading revenue - v1"
		}
]

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	sampleDashboards: object[] = sampleDashboards;
	recentDashboards: object[] = recentDashboards;
	firstTimeUser: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
		private router: Router
	) {}

	ngOnInit() {
		this.globalFunctionService.hideSecondaryMenus();
	}

	clickButtonData() {
		this.router.navigate(['/data']);
	}

	loadExistingSpecification() {
		console.log('start loadExistingSpecification')
	}

	toggleFirstTime() {
		this.firstTimeUser = !this.firstTimeUser;
	}

	promptDeleteRecent(fileToDelete: string) {
		console.log("Prompt and then delete from list")
	}
}
