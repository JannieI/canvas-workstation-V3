// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { DashboardTab }               from './models';
import { Datasource }                 from './models';

// Our Services
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'dashboard-tab',
    templateUrl: './dashboard.tab.component.html',
    styleUrls: ['./dashboard.tab.component.css']
})
export class DashboardTabComponent {

    @Input() newTab: boolean;
    @Output() formDashboardTabClosed: EventEmitter<DashboardTab> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

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
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (!this.newTab) {
            let tabIndex: number = this.globalVariableService.currentDashboardTabs
                .findIndex(t => t.id == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardTabID);
            if (tabIndex >= 0) {
                this.name = this.globalVariableService.currentDashboardTabs[tabIndex].name;
                this.description = this.globalVariableService.currentDashboardTabs[tabIndex]
                    .description;
                this.backgroundColor = this.globalVariableService.currentDashboardTabs[tabIndex]
                    .backgroundColor;
                this.color = this.globalVariableService.currentDashboardTabs[tabIndex].color;
            };
        }
    }

  	clickClose() {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

	  	  this.formDashboardTabClosed.emit(null);
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

        // Add new one
        if (this.newTab) {
            let newTab: DashboardTab = {
                id: null,
                dashboardID: this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                name: this.name,
                description: this.description,
                backgroundColor: this.backgroundColor,
                color: this.color
            }

            this.globalVariableService.addDashboardTab(newTab).then(res => {

                // Browse to it
                this.globalVariableService.refreshCurrentDashboard(
                    'tabNew-clickSave',
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    0,
                    'Last'
                );

                newTab.id = res.id;
                this.formDashboardTabClosed.emit(newTab);
        
            });
        } else {
            let tab: DashboardTab = {
                id: this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardTabID,
                dashboardID: this.globalVariableService.currentDashboardInfo.value
                    .currentDashboardID,
                name: this.name,
                description: this.description,
                backgroundColor: this.backgroundColor,
                color: this.color
            };

            this.globalVariableService.saveDashboardTab(tab).then(res => {
                this.formDashboardTabClosed.emit(tab)
            });
        }
    }
  }