/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'systemsettings',
    templateUrl: './systemsettings.component.html',
    styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent implements OnInit {

    @Output() formDashboardSystemSettingsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];

    companyName = this.globalVariableService.companyName;
    companyLogo = this.globalVariableService.companyLogo;
    dashboardTemplate = this.globalVariableService.dashboardTemplate;
    noQueryRunningMessage = this.globalVariableService.noQueryRunningMessage;
    queryRunningMessage = this.globalVariableService.queryRunningMessage;
    offlineData = this.globalVariableService.offlineData;
    offlineSchema = this.globalVariableService.offlineSchema;
    offlineLogin = this.globalVariableService.offlineLogin;
    maxTableLength = this.globalVariableService.maxTableLength;
    widgetsMinZindex = this.globalVariableService.widgetsMinZindex;
    widgetsMaxZindex = this.globalVariableService.widgetsMaxZindex;
    gridSize = this.globalVariableService.gridSize;
    snapToGrid = this.globalVariableService.snapToGrid;
    printDefault = this.globalVariableService.printDefault;
    printSize = this.globalVariableService.printSize;
    printLayout = this.globalVariableService.printLayout;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
    }

    clickClose(action: string) {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDashboardSystemSettingsClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        console.log('clickSave')

		this.formDashboardSystemSettingsClosed.emit(action);
    }
}
