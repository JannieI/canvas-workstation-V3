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

    preferenceAutoSync: boolean;
    preferencePaletteHorisontal: boolean;
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

        this.preferenceAutoSync = this.globalVariableService.currentUser.preferenceAutoSync;
        this.preferencePaletteHorisontal = this.globalVariableService.currentUser.preferencePaletteHorisontal;
        this.preferenceShowOpenStartupMessage = this.globalVariableService.currentUser.preferenceShowOpenStartupMessage;
        this.preferenceShowOpenDataCombinationMessage = this.globalVariableService.currentUser.preferenceShowOpenDataCombinationMessage;
        this.preferenceShowViewStartupMessage = this.globalVariableService.currentUser.preferenceShowViewStartupMessage;
        this.preferenceShowDiscardStartupMessage = this.globalVariableService.currentUser.preferenceShowDiscardStartupMessage;
        this.preferenceDefaultTemplate = this.globalVariableService.currentUser.preferenceDefaultTemplate;
        this.preferenceDefaultDateformat = this.globalVariableService.currentUser.preferenceDefaultDateformat;
        this.preferenceDefaultFolder = this.globalVariableService.currentUser.preferenceDefaultFolder;
        this.preferenceDefaultPrinter = this.globalVariableService.currentUser.preferenceDefaultPrinter;
        this.preferenceDefaultPageSize = this.globalVariableService.currentUser.preferenceDefaultPageSize;
        this.preferenceDefaultPageLayout = this.globalVariableService.currentUser.preferenceDefaultPageLayout;
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

        // let data: UserPreferences = {
        //     preferencePaletteHorisontal: this.preferencePaletteHorisontal,
        //     preferenceAutoSync: this.preferenceAutoSync,
        //     preferenceShowOpenStartupMessage: this.preferenceShowOpenStartupMessage,
        //     preferenceShowOpenDataCombinationMessage: this.preferenceShowOpenDataCombinationMessage,
        //     preferenceShowViewStartupMessage: this.preferenceShowViewStartupMessage,
        //     preferenceShowDiscardStartupMessage: this.preferenceShowDiscardStartupMessage,
        //     preferenceDefaultTemplate: this.preferenceDefaultTemplate,
        //     preferenceDefaultDateformat: this.preferenceDefaultDateformat,
        //     preferenceDefaultFolder: this.preferenceDefaultFolder,
        //     preferenceDefaultPrinter: this.preferenceDefaultPrinter,
        //     preferenceDefaultPageSize: this.preferenceDefaultPageSize,
        //     preferenceDefaultPageLayout: this.preferenceDefaultPageLayout,
        // };
        this.globalVariableService.currentUser.preferencePaletteHorisontal = this.preferencePaletteHorisontal,
        this.globalVariableService.currentUser.preferenceAutoSync = this.preferenceAutoSync,
        this.globalVariableService.currentUser.preferenceShowOpenStartupMessage = this.preferenceShowOpenStartupMessage,
        this.globalVariableService.currentUser.preferenceShowOpenDataCombinationMessage = this.preferenceShowOpenDataCombinationMessage,
        this.globalVariableService.currentUser.preferenceShowViewStartupMessage = this.preferenceShowViewStartupMessage,
        this.globalVariableService.currentUser.preferenceShowDiscardStartupMessage = this.preferenceShowDiscardStartupMessage,
        this.globalVariableService.currentUser.preferenceDefaultTemplate = this.preferenceDefaultTemplate,
        this.globalVariableService.currentUser.preferenceDefaultDateformat = this.preferenceDefaultDateformat,
        this.globalVariableService.currentUser.preferenceDefaultFolder = this.preferenceDefaultFolder,
        this.globalVariableService.currentUser.preferenceDefaultPrinter = this.preferenceDefaultPrinter,
        this.globalVariableService.currentUser.preferenceDefaultPageSize = this.preferenceDefaultPageSize,
        this.globalVariableService.currentUser.preferenceDefaultPageLayout = this.preferenceDefaultPageLayout,

        // Save globally, and in DB
        // this.globalVariableService.userPreferences = data;
        // this.globalVariableService.saveUserPreferences(data).then(
        this.globalVariableService.saveCanvasUser(this.globalVariableService.currentUser).then(
            res =>
                {
                    this.globalVariableService.showStatusBarMessage(
                        {
                            message: 'Prefs saved',
                            uiArea: 'StatusBar',
                            classfication: 'Info',
                            timeout: 3000,
                            defaultMessage: ''
                        }
                    );
                }
        );

        // Inform Subscribers
        this.globalVariableService.preferencePaletteHorisontal.next( 
            this.preferencePaletteHorisontal
        );
		this.formDashboardPreferencesClosed.emit(action);
    }

    //TODO
    //1. Set global var isFirstTimeDashboard = T/F depending on user input

}
