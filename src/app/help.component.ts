/* 
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

var rootDirectory = [
	{
		icon: "folder", 
		name: "dashboards", 
		files: [
			{
				name: "Value traded.cns", 
			},
      {
        name: "Sales in norway.cns", 
      },
      {
        name: "The rise and fall of bitcoin.cns",
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

	constructor(
		private globalFunctionService: GlobalFunctionService
	) {}

	ngOnInit() {
		this.globalFunctionService.hideSecondaryMenus();
	}
	
}
