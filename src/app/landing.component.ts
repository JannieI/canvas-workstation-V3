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
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

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
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();
	
	sampleDashboards: object[] = sampleDashboards;
	recentDashboards: object[] = recentDashboards;
	firstTimeUser: boolean = true;
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

	loadExistingSpecification() {
		console.log('start loadExistingSpecification')
	}

	toggleFirstTime() {
		this.firstTimeUser = !this.firstTimeUser;
	}

	promptDeleteRecent(fileToDelete: string) {
		console.log("Prompt and then delete from list")
	}

	clickClose(action: string) {
		this.formLandingClosed.emit(action);
		if (action !== 'OpenExisting') {
			this.router.navigate(['/data']);
		}
	}
	
}
