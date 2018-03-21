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
import { UserPreferences }            from './models';

@Component({
    selector: 'preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

    @Output() formDashboardPreferencesClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    preferenceAutoSync: boolean;
    preferenceShowOpenStartupMessage: boolean;
    preferenceShowOpenDataCombinationMessage: boolean;
    preferenceShowViewStartupMessage: boolean;
    preferenceShowDiscardStartupMessage: boolean;
    preferenceDefaultTemplate: string;
    preferenceDefaultDateformat: string;
    preferenceDefaultFolder: string;
    preferenceDefaultPrinter: string;
    preferenceDefaultPageSize: string;
    preferenceDefaultPageLayout: string;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.preferenceAutoSync = this.globalVariableService.userPreferences.preferenceAutoSync;
        this.preferenceShowOpenStartupMessage = this.globalVariableService.userPreferences.preferenceShowOpenStartupMessage;
        this.preferenceShowOpenDataCombinationMessage = this.globalVariableService.userPreferences.preferenceShowOpenDataCombinationMessage;
        this.preferenceShowViewStartupMessage = this.globalVariableService.userPreferences.preferenceShowViewStartupMessage;
        this.preferenceShowDiscardStartupMessage = this.globalVariableService.userPreferences.preferenceShowDiscardStartupMessage;
        this.preferenceDefaultTemplate = this.globalVariableService.userPreferences.preferenceDefaultTemplate;
        this.preferenceDefaultDateformat = this.globalVariableService.userPreferences.preferenceDefaultDateformat;
        this.preferenceDefaultFolder = this.globalVariableService.userPreferences.preferenceDefaultFolder;
        this.preferenceDefaultPrinter = this.globalVariableService.userPreferences.preferenceDefaultPrinter;
        this.preferenceDefaultPageSize = this.globalVariableService.userPreferences.preferenceDefaultPageSize;
        this.preferenceDefaultPageLayout = this.globalVariableService.userPreferences.preferenceDefaultPageLayout;
    }

    clickClose(action: string) {
        // Close the form
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
		this.formDashboardPreferencesClosed.emit(action);
    }


    clickSave(action: string) {
        // Save data and Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        let data: UserPreferences = {
            preferenceAutoSync: this.preferenceAutoSync,
            preferenceShowOpenStartupMessage: this.preferenceShowOpenStartupMessage,
            preferenceShowOpenDataCombinationMessage: this.preferenceShowOpenDataCombinationMessage,
            preferenceShowViewStartupMessage: this.preferenceShowViewStartupMessage,
            preferenceShowDiscardStartupMessage: this.preferenceShowDiscardStartupMessage,
            preferenceDefaultTemplate: this.preferenceDefaultTemplate,
            preferenceDefaultDateformat: this.preferenceDefaultDateformat,
            preferenceDefaultFolder: this.preferenceDefaultFolder,
            preferenceDefaultPrinter: this.preferenceDefaultPrinter,
            preferenceDefaultPageSize: this.preferenceDefaultPageSize,
            preferenceDefaultPageLayout: this.preferenceDefaultPageLayout,
        };

        // Save globally, and in DB
        this.globalVariableService.userPreferences = data;
        this.globalVariableService.saveUserPreferences(data).then(
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
    }
            //TODO
    //1. Set global var isFirstTimeDashboard = T/F depending on user input

}
