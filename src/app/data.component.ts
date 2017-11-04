/* 
 * Data tabs
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';

interface Idatasource {
    id: number;
    type: string;
    name: string;
    location: string;
}

const datasource: Idatasource[] = [
    {
        id: 1,
        type: 'Excel', 
        name: 'Revenue forecast for 2017',
        location: 'C:\My Documents'
    },
    {
        id: 2,
        type: 'PostgreSQL', 
        name: 'CPI tables',
        location: 'pDB'
    },
    {
        id: 3,
        type: 'Microsoft SQL', 
        name: 'Trades',
        location: 'prod51SQL'
    }
]

@Component({
  selector: 'app-help',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

    datasource: Idatasource[] = datasource;

	constructor(
		private globalFunctionService: GlobalFunctionService
	) {}

	ngOnInit() {
		this.globalFunctionService.hideSecondaryMenus();
	}
	
}
