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
    color: string = '';                   // CSS color of T


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
            color: this.color
        }

        this.globalVariableService.currentDashboardTabs.push(newTab);
        this.globalVariableService.dashboardTabs.push(newTab);

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