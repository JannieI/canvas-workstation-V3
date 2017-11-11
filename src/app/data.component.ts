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

interface Ifield {
    id: number;
    name: string;
    type: string;
    format: string;
    filter: string;
    calc: string;
    order: string;
}

interface IfieldsMetadata{
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

const fields: Ifield[] = [
    {
        id: 1,
        name: 'DateTrade',
        type: 'Date',
        format: '',
        filter: '',
        calc: '',
        order: 'Asc 1'
    },
    {
        id: 2,
        name: 'Share',
        type: 'Text',
        format: '',
        filter:  '',
        calc:  '',
        order: ''
    },
    {
        id: 3,
        name: 'Volume',
        type: 'Number',
        format: 'Integer',
        filter: '',
        calc:  '',
        order: ''
    },
    {
        id: 4,
        name: 'Value',
        type: 'Number',
        format: '2 decimals',
        filter: '> 1m',
        calc: 'Volume * 10',
        order: '' 
    }
]

const fieldsMetadata: IfieldsMetadata[] = [
    {
        name: 'DateTrade',
        description: 'Date on which trade when through trading system'
    },
    {
        name: 'Share',
        description: 'Name of share (stock) that traded, ie Anglo American plc'
    },
    {
        name: 'Volume',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.'
    },
    {
        name: 'Value',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.'
    }
]

// The most straightforward solution would be for you to get a reference to the NavLevelDirective instance for the sidenav with @ViewChild, and all its close() method.

// For instance, add a reference variable in your template:

// <nav #mySidenav class="sidenav" [clr-nav-level]="2">
//     <app-sidebar></app-sidebar>
// </nav>
// Then access it in your app's component by using:

// @ViewChild("mySidenav", {read: NavLevelDirective}) sidenav: NavLevelDirective;
// and just call sidenav.close() when the user clicks the "find" button.



// <nav class="subnav">
// <ul class="nav">
//     <li class="nav-item" *ngFor="nav of navs">
//         <a class="nav-link" routerLinkActive="active"
// [routerLink]="nav.link">{{nav.title}}</a>
//     </li>
// </ul>
// </nav>
// and in your class :

// nav = [
//    {link:'somewhere/dashboard',title:'Dashboard'},
//    {link:'somewhere/management',title:'Management'},
//    {link:'somewhere/cloud',title:'Cloud'}

// ]


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
    fields: Ifield[] = fields;
    fieldsMetadata: IfieldsMetadata[] = fieldsMetadata;
    firstTimeUser: boolean = true;
    isError: boolean = false;
    selectedDatasource: any;
    showDatasourceForm: boolean = false;
    snipDatasource: boolean = false;
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
    
    clickShowDatasourceForm() {
        console.log('this.showDatasourceForm', this.showDatasourceForm)
        this.showDatasourceForm = !this.showDatasourceForm
    }
}
