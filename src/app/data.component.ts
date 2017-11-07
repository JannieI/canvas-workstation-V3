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

interface Idataset {
    id: number;
    type: string;
    name: string;
    location: string;
}

interface Itransformaton {
    id: number;
    name: string;
    description: string;
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

const dataset: Idataset[] = [
    {
        id: 1,
        type: 'SQL', 
        name: 'Value by year',
        location: 'Local'
    },
    {
        id: 2,
        type: 'Overlay spec', 
        name: 'CPI tables with calculated fields',
        location: 'Server'
    },
    {
        id: 3,
        type: 'SQL', 
        name: 'Trades with extensive group-by',
        location: 'Local'
    }
]

const transformaton: Itransformaton[] = [
    {
        id: 1,
        name: 'Transpose', 
        description: 'Transpose Rows and Columns',
    },
    {
        id: 2,
        name: 'Add Calculated field', 
        description: 'Calculated field',
    },
    {
        id: 3,
        name: 'Left Align', 
        description: 'Left align string values',
    }
]
@Component({
  selector: 'app-help',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

    datasource: Idatasource[] = datasource;
    dataset: Idataset[] = dataset;
    dataTabDatasource: boolean = false;
    errorMessage: string = "";
    firstTimeUser: boolean = true;
    isError: boolean = false;
    selectedDatasource: any;
    transformaton: Itransformaton[] = transformaton;

	constructor(
		private globalFunctionService: GlobalFunctionService
	) {}

	ngOnInit() {
		this.globalFunctionService.hideSecondaryMenus();
    }
    
    clickRow() {
        if (this.selectedDatasource == null) {
            this.errorMessage = "Please select a Dataset and click again"
            this.isError = true;
            return;
        }
        this.isError = false;
        this.errorMessage = '';
        console.log('selectedId', this.selectedDatasource )
        this.selectedDatasource = true;

        // Reset
        this.selectedDatasource = null;
    }


	toggleFirstTime() {
		this.firstTimeUser = !this.firstTimeUser;
	}
}
