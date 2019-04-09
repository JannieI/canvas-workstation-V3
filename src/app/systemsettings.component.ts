/*
 * Shows form with overall Canvas system settings
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
import { CanvasSettings }             from './models';

@Component({
    selector: 'systemsettings',
    templateUrl: './systemsettings.component.html',
    styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent implements OnInit {

    @Output() formDashboardSystemSettingsClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code === 'Enter'  ||  event.code === 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave('Saved');
            return;
        };

    }

    companyName: string;
    companyLogo: string;
    createdBy: string;
    createdOn: Date;
    dashboardTemplate: string;
    errorMessage: string = '';
    gridSize: number;
    maxTableLength: number;
    notInEditModeMsg: string;
    noQueryRunningMessage: string;
    printDefault: string;
    printSize: string;
    printLayout: string;
    queryRunningMessage: string;
    widgetsMinZindex: number;
    widgetsMaxZindex: number;
    
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
        this.maxTableLength = this.globalVariableService.canvasSettings.maxTableLength;
        this.widgetsMinZindex = this.globalVariableService.canvasSettings.widgetsMinZindex;
        this.widgetsMaxZindex = this.globalVariableService.canvasSettings.widgetsMaxZindex;
        this.gridSize = this.globalVariableService.canvasSettings.gridSize;
        this.printDefault = this.globalVariableService.canvasSettings.printDefault;
        this.printSize = this.globalVariableService.canvasSettings.printSize;
        this.printLayout = this.globalVariableService.canvasSettings.printLayout;
        this.notInEditModeMsg = this.globalVariableService.canvasSettings.notInEditModeMsg;
        this.noQueryRunningMessage = this.globalVariableService.canvasSettings.noQueryRunningMessage;
        this.queryRunningMessage = this.globalVariableService.canvasSettings.queryRunningMessage;
        this.createdBy = this.globalVariableService.canvasSettings.createdBy;
        this.createdOn = this.globalVariableService.canvasSettings.createdOn;

    }

    clickClose(action: string) {
        // Close form, no save
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'No changes',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardSystemSettingsClosed.emit(action);
    }

    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        let data: CanvasSettings = {
            id: 1,
            companyName: this.companyName,
            companyLogo: this.companyLogo,
            dashboardTemplate: this.dashboardTemplate,
            maxTableLength: this.maxTableLength,
            widgetsMinZindex: this.widgetsMinZindex,
            widgetsMaxZindex: this.widgetsMaxZindex,
            gridSize: this.gridSize,
            printDefault: this.printDefault,
            printSize: this.printSize,
            printLayout: this.printLayout,
            notInEditModeMsg: this.notInEditModeMsg,
            noQueryRunningMessage: this.noQueryRunningMessage,
            queryRunningMessage: this.queryRunningMessage,
            cleanCacheOnLogin: false,
            cleanCacheOnLogout: false,
            editedBy: this.globalVariableService.currentUser.userID,
            editedOn: new Date(),
            createdBy: this.createdBy,
            createdOn: this.createdOn

        };

        // Save globally, and in DB
        this.globalVariableService.canvasSettings = data;
        this.globalVariableService.saveResource('canvasSettings', data)
            .then(
                res => 
                    {
                        this.globalVariableService.showStatusBarMessage(
                            {
                                message: 'Settings saved',
                                uiArea: 'StatusBar',
                                classfication: 'Info',
                                timeout: 3000,
                                defaultMessage: ''
                            }
                        );
                    }
            )
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Collaborate.auditTrail saving canvasSettings: ' + err);
            });

		this.formDashboardSystemSettingsClosed.emit(action);
    }
}
