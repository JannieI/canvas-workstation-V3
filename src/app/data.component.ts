/* 
 * Data page: to get new datasources, and add to the current list of datasources for this
 * Dashboard.  Can also do transformations to the data, and crteate new datasets, ie via
 * pivot.
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';

// Our Functions
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { currentDatasource }          from './models';
import { transformation }             from './models'
import { field }                      from './models'
import { fieldMetadata }              from './models'

interface Idata{
    name: string;
}

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

    @ViewChild('typeDropdown') typeDropdown: ElementRef;
    @ViewChild('typeTransformationDropdown') typeTransformationDropdown: ElementRef;
    @ViewChild('transformations') transformations: ElementRef;

    buttonLabel: string = "Show More";
    canUse: boolean = true;                 // Can use a Tab heading
    currentDatasources: currentDatasource[];
    dataServer: Idata[];
    dataRecent: Idata[];
    dataSample: Idata[];
    dataTabDatasource: boolean = false;
    errorMessage: string = "";
    fields: field[];
    fieldsMetadata: fieldMetadata[];
    firstTimeUser: boolean = true;
    indexCurrent: number = 0;
    isError: boolean = false;
    menuCreateDisabled: boolean = true;
    message:string;    
    showAddData: boolean = true;
    showAddDataDetail: boolean = false;
    showAddFile: boolean = false;
    showAddDatabase: boolean = false;
    showAddService: boolean = false;
    showAddFromWeb: boolean = false;
    showAddNoSQL: boolean = false;
    showAddFromServer: boolean = false;
    showServerData: boolean = false;
    showRecentData: boolean = false;
    showSampleData: boolean = false;
    showCurrentDetail: boolean = false;

    selectedFile: boolean = true;

    selectedData: string = 'Trades for 2016';
    // selectedDatasource: any;
    // selectedDatabase: boolean = false;
    // showDatasourceForm: boolean = false;
    // showSelector: boolean = false;
    // showFileselector: boolean = false;
    // showTransformation: boolean = false;
    // showModalFileFormatter: boolean = false;
    // snipDatasource: boolean = false;
    transformation: transformation[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {

        // Load global variables
        this.globalVariableService.currentMessage.subscribe(message => this.message = message)
        this.globalVariableService.menuCreateDisabled.subscribe(
            menuCreateDisabled => this.menuCreateDisabled = menuCreateDisabled
        );
        this.currentDatasources = this.globalVariableService.currentDatasources;
        this.transformation = this.globalVariableService.transformationsFormat;
        this.fields = this.globalVariableService.fields;
        this.fieldsMetadata = this.globalVariableService.fieldsMetadata;
        this.dataServer = this.globalVariableService.dataServer;
        this.dataRecent = this.globalVariableService.dataRecent;
        this.dataSample = this.globalVariableService.dataSample;

    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit')
    }

    clickDropdownType() {
        if (this.typeDropdown.nativeElement.className == "dropdown open") {
            this.typeDropdown.nativeElement.className = "dropdown";
        } else {
            this.typeDropdown.nativeElement.className = "dropdown open";
        }
    }
    
    // clickTypeTransformation() {
    //     if (this.typeTransformationDropdown.nativeElement.className == "dropdown open") {
    //         this.typeTransformationDropdown.nativeElement.className = "dropdown";
    //     } else {
    //         this.typeTransformationDropdown.nativeElement.className = "dropdown open";
    //     }
    // }

    // clickTransformation() {
    //     if (this.transformations.nativeElement.className == "dropdown open") {
    //         this.transformations.nativeElement.className = "dropdown";
    //     } else {
    //         this.transformations.nativeElement.className = "dropdown open";
    //     }
    //     this.showTransformation = true;
    // }

    // clickField(fieldName: string) {
    //     console.log('id');
    //     this.showModalFileFormatter = true;
    // }

    // clickCloseFieldFormatter() {
    //     this.showModalFileFormatter = false;
    // }

    // clickNavAddData(selData: string) {
    //     this.selectedData = selData;
    //     let newData: Idata = {
    //         name: selData
    //     };
    //     let len: number = this.dataCurrent.push(newData);
    //     this.canUse = false;
    // }

    clickAddFile() {
        this.showAddDataDetail = true;
        this.showAddFile = true;
        this.showAddDatabase = false;
        this.showAddService = false;
        this.showAddFromWeb = false;
        this.showAddNoSQL = false;
        this.showAddFromServer = false;
    }

    clickAddFileClose() {
        this.showAddFile = false;
    }

    clickAddFileSave() {
        this.showAddFile = false;
        let newData: currentDatasource =  {
            id: 1,
            type: 'Excel file',
            name: 'Costing preparation',
            description: 'Costing preparation',
            createdBy: 'JohnM',
            createdOn: '2017/01/01',
            refreshedBy: 'JohnM',
            refreshedOn: '2017/01/01',
            parameters: ' "databaseType": "sqlite", "table": "trades", "username": "admin", "password", "root" '
    
        }

        if (this.indexCurrent == 0) {
            newData.name = 'Trades for 2016'
        }
        if (this.indexCurrent == 1) {
            newData.name = 'Costing preparation'
        }
        if (this.indexCurrent == 2) {
            newData.name = 'Budget Forecas'
        }
        if (this.indexCurrent == 3) {
            newData.name = 'Home Budget'
        }

        this.indexCurrent = this.indexCurrent +1;
        if (this.indexCurrent > 3) {this.indexCurrent = 0}

        let len: number = this.currentDatasources.push(newData);
    }

    clickAddDatabase() {
        this.showAddFile = false;
        this.showAddDatabase = true;
        this.showAddService = false;
        this.showAddFromWeb = false;
        this.showAddNoSQL = false;
        this.showAddFromServer = false;
    }

    clickAddDatabaseClose() {
        this.showAddDatabase = false;
    }

    clickAddService() {
        this.showAddFile = false;
        this.showAddDatabase = false;
        this.showAddService = true;
        this.showAddFromWeb = false;
        this.showAddNoSQL = false;
        this.showAddFromServer = false;
    }
    clickAddServiceClose() {
        this.showAddService = false;
    }

    clickAddFromWeb() {
        this.showAddFile = false;
        this.showAddDatabase = false;
        this.showAddService = false;
        this.showAddFromWeb = true;
        this.showAddNoSQL = false;
        this.showAddFromServer = false;
    }
    clickAddFromWebClose() {
        this.showAddFromWeb = false;
    }

    clickAddNoSQL() {
        this.showAddFile = false;
        this.showAddDatabase = false;
        this.showAddService = false;
        this.showAddFromWeb = false;
        this.showAddNoSQL = true;
        this.showAddFromServer = false;
    }
    clickAddNoSQLClose() {
        this.showAddNoSQL = false;
    }

    clickAddFromServer() {
        this.showAddFile = false;
        this.showAddDatabase = false;
        this.showAddService = false;
        this.showAddFromWeb = false;
        this.showAddNoSQL = false;
        this.showAddFromServer = true;
    }
    clickAddFromServerClose() {
        this.showAddFromServer = false;
    }

    clickOpenServerList() {
        this.showServerData = !this.showServerData;
    }

    clickOpenRecentList() {
        this.showRecentData = !this.showRecentData;
    }

    clickOpenSampleList() {
        this.showSampleData = !this.showSampleData;
    }

    clickShowCurrentDetail() {
        this.showAddData = false;
        this.showAddDataDetail = false;
        this.showCurrentDetail = true;
    }

    clickBack() {
        this.globalVariableService.changeMessage("Hello from Sibling");
        this.globalVariableService.changeMenuCreateDisabled(false);
        this.router.navigate(['/explore']);
    }

    clickShowAddData() {
        this.showAddData = true;
        this.showAddDataDetail = false;
        this.showCurrentDetail = false;
    }
 }
