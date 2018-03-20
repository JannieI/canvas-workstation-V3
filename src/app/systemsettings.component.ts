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
import { CanvasSettings }             from './models';

@Component({
    selector: 'systemsettings',
    templateUrl: './systemsettings.component.html',
    styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent implements OnInit {

    @Output() formDashboardSystemSettingsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    companyName: string;
    companyLogo: string;
    dashboardTemplate: string;
    offlineData: boolean;
    offlineSchema: boolean;
    offlineLogin: boolean;
    maxTableLength: number;
    widgetsMinZindex: number;
    widgetsMaxZindex: number;
    gridSize: number;
    snapToGrid: boolean;
    printDefault: string;
    printSize: string;
    printLayout: string;
    notInEditModeMsg: string;
    noQueryRunningMessage: string;
    queryRunningMessage: string;
    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.companyName = this.globalVariableService.canvasSettings.companyName;
        this.companyLogo = this.globalVariableService.canvasSettings.companyLogo;
        this.dashboardTemplate = this.globalVariableService.canvasSettings.dashboardTemplate;
        this.offlineData = this.globalVariableService.canvasSettings.offlineData;
        this.offlineSchema = this.globalVariableService.canvasSettings.offlineSchema;
        this.offlineLogin = this.globalVariableService.canvasSettings.offlineLogin;
        this.maxTableLength = this.globalVariableService.canvasSettings.maxTableLength;
        this.widgetsMinZindex = this.globalVariableService.canvasSettings.widgetsMinZindex;
        this.widgetsMaxZindex = this.globalVariableService.canvasSettings.widgetsMaxZindex;
        this.gridSize = this.globalVariableService.canvasSettings.gridSize;
        this.snapToGrid = this.globalVariableService.canvasSettings.snapToGrid;
        this.printDefault = this.globalVariableService.canvasSettings.printDefault;
        this.printSize = this.globalVariableService.canvasSettings.printSize;
        this.printLayout = this.globalVariableService.canvasSettings.printLayout;
        this.notInEditModeMsg = this.globalVariableService.canvasSettings.notInEditModeMsg;
        this.noQueryRunningMessage = this.globalVariableService.canvasSettings.noQueryRunningMessage;
        this.queryRunningMessage = this.globalVariableService.canvasSettings.queryRunningMessage;


        console.log('xx cs', this.globalVariableService.canvasSettings)
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

        let data: CanvasSettings = {
            companyName: this.companyName,
            companyLogo: this.companyLogo,
            dashboardTemplate: this.dashboardTemplate,
            offlineData: this.offlineData,
            offlineSchema: this.offlineSchema,
            offlineLogin: this.offlineLogin,
            maxTableLength: this.maxTableLength,
            widgetsMinZindex: this.widgetsMinZindex,
            widgetsMaxZindex: this.widgetsMaxZindex,
            gridSize: this.gridSize,
            snapToGrid: this.snapToGrid,
            printDefault: this.printDefault,
            printSize: this.printSize,
            printLayout: this.printLayout,
            notInEditModeMsg: this.notInEditModeMsg,
            noQueryRunningMessage: this.noQueryRunningMessage,
            queryRunningMessage: this.queryRunningMessage,
        };

        // Save globally, and in DB
        this.globalVariableService.canvasSettings = data;
        this.globalVariableService.saveSystemSettings(data).then(
            res => 
                {
                    this.globalVariableService.showStatusBarMessage(
                        {
                            message: 'Settings saved',
                            uiArea: 'StatusBar',
                            classfication: 'Warning',
                            timeout: 3000,
                            defaultMessage: ''
                        }
                    );
                }
            );

		this.formDashboardSystemSettingsClosed.emit(action);
    }
}
