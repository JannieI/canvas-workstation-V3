/*
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

const rootDirectory = [
	{
		icon: "folder",
		name: "dashboards",
		files: [
			{
				name: "Exco summary of Value traded in 2017",
			},
      {
        name: "Sales in norway.cns",
      },
      {
        name: "The rise and fall of bitcoin",
      },
			{
				name: "Nominal bond values - detail report",
			},
      {
        name: "Bond trading revenue - draft",
      },
      {
        name: "Bond trading revenue - v1",
      },
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
	}
]


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

	rootDirectory: object[] = rootDirectory;

	constructor(
		private globalFunctionService: GlobalFunctionService,
		private router: Router
	) {}

	ngOnInit() {
		console.log('rootDirectory',rootDirectory)
	}

	clickBackButton() {
		this.router.navigate(['']);
	}

	loadExistingSpecification() {
		console.log('start loadExistingSpecification')
	}
}
