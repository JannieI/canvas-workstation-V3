/* 
 * Data tabs
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';

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
    category: string;
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
    type: string;
    description: string;
    keyField: boolean;
    explainedBy: string
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
        category: 'Column-level',
        name: 'FormatDate', 
        description: '(columnName, date format): if the columnName is blank, Tributary will try to convert all date fields.  The format can be YYYYMMDD, MMMMM, etc.'
    },
    {
        id: 2,
        category: 'Column-level',
        name: 'FillBlanks', 
        description: '(columnName, newValue)'
    },
    {
        id: 3,
        category: 'Column-level',
        name: 'FillNull', 
        description: '(columnName, newValue)'
    },
    {
        id: 4,
        category: 'Column-level',
        name: 'FillBlankAndNull', 
        description: '(columnName, newValue)'
    },
    {
        id: 5,
        category: 'Column-level',
        name: 'ReplaceNumbers', 
        description: '(columnName, from, to, newValue)'
    },
    {
        id: 6,
        category: 'Column-level',
        name: 'ReplaceString', 
        description: '(columnName, oldValue, newValue)'
    },
    {
        id: 7,
        category: 'Column-level',
        name: 'AppendColumn', 
        description: '(newColumnName, dataType, fillValue)'
    },
    {
        id: 8,
        category: 'Column-level',
        name: 'Columns', 
        description: '([column1, column2, ...]) to be returned'
    },
    {
        id: 9,
        category: 'Column-level',
        name: 'Field Filters', 
        description: '([ {columnX, operator, value} ]'
    },
    {
        id: 10,
        category: 'Column-level',
        name: 'CalcColumn', 
        description: '(newColumnName, columnOne, columnTwo, Operator, fillValue)'
    },
    {
        id: 11,
        category: 'Column-level',
        name: 'Substring', 
        description: '(columnName, startPosition, length)'
    },
    {
        id: 12,
        category: 'Column-level',
        name: 'LeftTrim', 
        description: '(columnName)'
    },
    {
        id: 13,
        category: 'Column-level',
        name: 'RightTrim', 
        description: '(columnName)'
    },
    {
        id: 14,
        category: 'Column-level',
        name: 'Trim', 
        description: '(columnName), which combines LeftTrim and RightTrim'
    },
    {
        id: 15,
        category: 'Column-level',
        name: 'RightSubstring', 
        description: '(columnName, startPosition, length) is similar to Substring, but startPosition is counted from the right.'
    },
    {
        id: 16,
        category: 'Column-level',
        name: 'DatePart', 
        description: '(columnName, DatePart) extracts a portion from the date.  For example, DatePart can be Day, Month, Year, Hour, Minute, Second'
    },
    {
        id: 17,
        category: 'Column-level',
        name: 'Concatenate', 
        description: '(columnNameOne, ColumnNameTwo)'
    },
    {
        id: 18,
        category: 'Column-level',
        name: 'ConcatenateColumn', 
        description: '(columnName, preString, postString) will append strings to the front or back of a column'
    },
    {
        id: 19,
        category: 'Column-level',
        name: 'Calculate', 
        description: '(columnName, expression) where operation is a valid math expression, for example ‘+ 2’, or ‘/1000’.  The [columnName] (in square brackets) can be part of the expression, say [columnName] * 1.14'
    },
    {
        id: 20,
        category: 'Column-level',
        name: 'FormatNumber', 
        description: '(columnName, formatString) where formatString is a valid string in Excel (VBA) format.  For example, ‘#0.00’, R#0,00’, ‘0000’'
    },
    {
        id: 21,
        category: 'Table-level',
        name: 'Pivot', 
        description: '(row-heading, column-heading, operator, data-heading) '
    },
    {
        id: 22,
        category: 'Table-level',
        name: 'Transpose', 
        description: 'turning rows into columns and vice versa'
    },
    {
        id: 23,
        category: 'Table-level',
        name: 'FormatTable', 
        description: '(format), where format = json, csv, tsv, Excel, ADO, etc.'
    },
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
        type: 'Date',
        description: 'Date on which trade when through trading system',
        keyField: false,
        explainedBy: ''
    },
    {
        name: 'Share',
        type: 'String',
        description: 'Name of share (stock) that traded, ie Anglo American plc',
        keyField: true,
        explainedBy: ''
    },
    {
        name: 'Volume',
        type: 'Number',
        description: 'Number of instruments traded.  Single counted, excluding BR, YT trade types.',
        keyField: false,
        explainedBy: 'Broker, TradeType'
    },
    {
        name: 'Value',
        type: 'Number',
        description: 'Value in Rand of the instruments traded, based on Volume and Price.',
        keyField: false,
        explainedBy: 'Query: TradeAttribution'
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
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    @ViewChild('typeTransformationDropdown') typeTransformationDropdown: ElementRef;
    @ViewChild('transformations') transformations: ElementRef;


    datasource: Idatasource[] = datasource;
    dataset: Idataset[] = dataset;
    dataTabDatasource: boolean = false;
    errorMessage: string = "";
    fields: Ifield[] = fields;
    fieldsMetadata: IfieldsMetadata[] = fieldsMetadata;
    firstTimeUser: boolean = true;
    isError: boolean = false;
    selectedDatasource: any;
    selectedFile: boolean = false;
    selectedDatabase: boolean = false;
    showDatasourceForm: boolean = false;
    showModalFileselector: boolean = false;
    showTransformation: boolean = false;
    showModalFileFormatter: boolean = false;
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
    
    clickShowDatasourceForm() {
        console.log('this.showDatasourceForm', this.showDatasourceForm)
        this.showDatasourceForm = !this.showDatasourceForm
    }

    
    clickDropdownType() {
        if (this.typeDropdown.nativeElement.className == "dropdown open") {
            this.typeDropdown.nativeElement.className = "dropdown";
        } else {
            this.typeDropdown.nativeElement.className = "dropdown open";
        }
    }
    
    clickTypeTransformation() {
        if (this.typeTransformationDropdown.nativeElement.className == "dropdown open") {
            this.typeTransformationDropdown.nativeElement.className = "dropdown";
        } else {
            this.typeTransformationDropdown.nativeElement.className = "dropdown open";
        }
    }

    clickTransformation() {
        if (this.transformations.nativeElement.className == "dropdown open") {
            this.transformations.nativeElement.className = "dropdown";
        } else {
            this.transformations.nativeElement.className = "dropdown open";
        }
        this.showTransformation = true;
    }

    clickOpenFile() {
        console.log('clickOpenFile()')
        this.selectedDatabase = false;
        this.showModalFileselector = true;
        this.selectedFile = false;
    }
    
    clickOpenDatabase() {
        console.log('clickOpenDatabase()')
        this.selectedFile = false;
        this.selectedDatabase = true;
        this.typeDropdown.nativeElement.className = "dropdown";
        this.showDatasourceForm = !this.showDatasourceForm;
        this.firstTimeUser = !this.firstTimeUser;
    }
    
    clickCloseModel() {
        console.log('clickCloseModel()')
        this.showModalFileselector = false;
        this.selectedFile = true;
        this.typeDropdown.nativeElement.className = "dropdown";
        this.showDatasourceForm = !this.showDatasourceForm;
        this.firstTimeUser = !this.firstTimeUser;
    }

    clickField(fieldName: string) {
        console.log('id');
        this.showModalFileFormatter = true;
    }

    clickCloseFieldFormatter() {
        this.showModalFileFormatter = false;
    }

}
