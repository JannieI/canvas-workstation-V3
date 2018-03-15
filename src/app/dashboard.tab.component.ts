// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our models
import { Datasource, DashboardTab }                 from './models';

// Our Services
import { GlobalFunctionService } 		  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Functions

@Component({
    selector: 'dashboard-tab',
    templateUrl: './dashboard.tab.component.html',
    styleUrls: ['./dashboard.tab.component.css']
})
export class DashboardTabComponent implements OnInit {

    @Output() formDashboardTabClosed: EventEmitter<string> = new EventEmitter();

    dashboardID: number;                  // FK to DashboardID to which widget belongs
    name: string = '';                    // Name of new T
    description: string = '';             // T description
    backgroundColor: string = 'white';    // Bg Color of T
    color: string = 'black';              // CSS color of T
    showErrorMessage: boolean = false;
    errorMessageText: string = '';

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
    ) {}

    ngOnInit() {}

  	clickClose() {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	  this.formDashboardTabClosed.emit();
    }

  	clickSave() {
        // Save new Tab, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        this.showErrorMessage = false;
        this.errorMessageText = '';

        if (this.name == ''  ||  this.name.length > 20) { 
            this.showErrorMessage = true;
            this.errorMessageText = 'Please enter a name, and less than 20 char';
        };

        if (this.description == '') { 
            this.showErrorMessage = true;
            this.errorMessageText = 'Please enter a description';
        };

        if (this.showErrorMessage) {
            return;
        }

        // Get new DSid
        // TODO - do better with DB
        let newTid: number = 1;
        let tIDs: number[] = [];
        this.globalVariableService.dashboardTabs.forEach(t => tIDs.push(t.id));
        newTid = Math.max(...tIDs) + 1;

        // Add new one
        
        let newTab: DashboardTab = {
            id: newTid,
            dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            name: this.name,
            description: this.description,
            backgroundColor: this.backgroundColor,
            color: this.color
        }

        this.globalVariableService.currentDashboardTabs.push(newTab);
        this.globalVariableService.dashboardTabs.push(newTab);

        console.log('xx currT', this.globalVariableService.currentDashboardTabs)
        // Browse to it
        this.globalVariableService.refreshCurrentDashboard(
            'tabNew-clickSave',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Last'
        );
        this.formDashboardTabClosed.emit();
    }
  }