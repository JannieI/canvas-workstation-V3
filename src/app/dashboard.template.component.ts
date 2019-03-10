/*
 * Shows form to manage templates for the current Dashboard
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'dashboard-template',
    templateUrl: './dashboard.template.component.html',
    styleUrls: ['./dashboard.template.component.css']
})
export class DashboardTemplateComponent implements OnInit {

    @Output() formDashboardTemplateClosed: EventEmitter<string> = new EventEmitter();

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

    currentDashboard: Dashboard;
    currentTemplateName: string = '';
    dashboards: Dashboard[];
    errorMessage: string = '';
    selectedRow: number = 0;
    showTypeDashboard: boolean = false;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get D info
        // TODO - could be better with filterObject ?
        this.globalVariableService.getResource('dashboards')
            .then(res => {

                this.dashboards = res
                    .sort( (obj1, obj2) => {
                        if (obj1.name > obj2.name) {
                            return 1;
                        };
                        if (obj1.name < obj2.name) {
                            return -1;
                        };
                        return 0;
                    });
                let dashboardIndex: number = this.dashboards.findIndex(d => d.id 
                    == this.globalVariableService.currentDashboardInfo.value.currentDashboardID);
                this.currentDashboard = this.dashboards[dashboardIndex];

                // Get Template info
                if (this.currentDashboard.templateDashboardID != null) {
                    let templateIndex: number = this.dashboards.findIndex(
                        d => d.id == this.currentDashboard.templateDashboardID);
                    if (templateIndex >=0 ) {
                        this.currentTemplateName = this.dashboards[templateIndex].name;
                    };
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.template reading dashboards: ' + err);
            });
}

    clickClear() {
        // Clear a previously added Template
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClear', '@Start');

        // Change Template ID and save
        this.currentTemplateName = '';
        this.currentDashboard.templateDashboardID = null;
        this.globalVariableService.saveResource('dashboards', this.currentDashboard);
        this.globalVariableService.refreshCurrentDashboard(
            'DashboardTemplate clickClear',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        );

    }
 
    clickRow(index: number) {
        // Show selected record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
    }

    dblclickAdd(index: number, dashboardID: number) {
        // Add a new Template
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickAdd', '@Start');
        
        let templateIndex: number = this.dashboards.findIndex(
            d => d.id == dashboardID);
        this.currentTemplateName = this.dashboards[templateIndex].name;

        // Change Template ID and save
        this.currentDashboard.templateDashboardID = dashboardID;
        this.globalVariableService.saveResource('dashboards', this.currentDashboard);
        this.globalVariableService.refreshCurrentDashboard(
            'DashboardTemplate clickClear',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        );
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardTemplateClosed.emit(action);
    }
}
