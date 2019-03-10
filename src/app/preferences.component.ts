/*
 * Shows form with preferences for the current user
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
import { DashboardTab }               from './models';


@Component({
    selector: 'preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

    @Output() formDashboardPreferencesClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave('Saved');
            return;
        };

    }

    dashboardList: string[] = ['None'];
    dashboardTabList: string[] = ['None'];
    dashboards: Dashboard[];
    dashboardTabs: DashboardTab[] = [];
    errorMessage: string = '';
    preferenceAutoSync: boolean;
    preferenceDefaultTemplateID: number;
    preferenceDefaultDateformat: string;
    preferenceDefaultFolder: string;
    preferenceDefaultPrinter: string;
    preferenceDefaultPageSize: string;
    preferenceDefaultPageLayout: string;
    preferenceDefaultSnapshotMins: number;
    preferencePaletteHorisontal: boolean;
    preferencePlaySound: boolean;
    preferenceDebugSession: boolean;
    preferenceShowOpenStartupMessage: boolean;
    preferenceShowOpenDataCombinationMessage: boolean;
    preferenceShowViewStartupMessage: boolean;
    preferenceShowDiscardStartupMessage: boolean;
    preferenceStartupDashboardID: number;
    preferenceStartupDashboardTabID: number;
    preferenceShowWidgetEditorLite: boolean;
    selectedTemplateDashboard: string;
    selectedStartupDashboard: string;
    selectedStartupDashboardTab: string;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Fill local vars for ngModel
        this.preferenceAutoSync = this.globalVariableService.currentUser.preferenceAutoSync;
        this.preferencePaletteHorisontal = this.globalVariableService.currentUser.preferencePaletteHorisontal;
        this.preferencePlaySound = this.globalVariableService.currentUser.preferencePlaySound;
        this.preferenceDebugSession = this.globalVariableService.currentUser.preferenceDebugSession;
        this.preferenceShowOpenStartupMessage = this.globalVariableService.currentUser.preferenceShowOpenStartupMessage;
        this.preferenceShowOpenDataCombinationMessage = this.globalVariableService.currentUser.preferenceShowOpenDataCombinationMessage;
        this.preferenceShowViewStartupMessage = this.globalVariableService.currentUser.preferenceShowViewStartupMessage;
        this.preferenceShowDiscardStartupMessage = this.globalVariableService.currentUser.preferenceShowDiscardStartupMessage;
        this.preferenceDefaultTemplateID = this.globalVariableService.currentUser.preferenceDefaultTemplateID;
        this.preferenceDefaultDateformat = this.globalVariableService.currentUser.preferenceDefaultDateformat;
        this.preferenceDefaultFolder = this.globalVariableService.currentUser.preferenceDefaultFolder;
        this.preferenceDefaultPrinter = this.globalVariableService.currentUser.preferenceDefaultPrinter;
        this.preferenceDefaultPageSize = this.globalVariableService.currentUser.preferenceDefaultPageSize;
        this.preferenceDefaultPageLayout = this.globalVariableService.currentUser.preferenceDefaultPageLayout;
        this.preferenceDefaultSnapshotMins = this.globalVariableService.currentUser.preferenceDefaultSnapshotMins;
        this.preferenceStartupDashboardID = this.globalVariableService.currentUser.preferenceStartupDashboardID;
        this.preferenceStartupDashboardTabID = this.globalVariableService.currentUser.preferenceStartupDashboardTabID;

        // Get list of D for dropdown
        this.globalVariableService.getResource('dashboards')
            .then(d => {
                this.dashboards = d;
                let dashboards = d.sort((n1,n2) => {
                    if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                        return 1;
                    };

                    if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                        return -1;
                    };

                    return 0;
                });
                dashboards.forEach(d => {
                    if (d.state = 'Complete') {
                        this.dashboardList.push(d.name + ' (' + d.id.toString() + ')');
                    };

                    // Fill Initial Template
                    if (this.preferenceDefaultTemplateID != null
                        &&
                        this.preferenceDefaultTemplateID == d.id) {
                        this.selectedTemplateDashboard = d.name + ' (' + d.id.toString() + ')';
                    };

                    // Fill Initial Startup D
                    if (this.preferenceStartupDashboardID != null
                        &&
                        this.preferenceStartupDashboardID == d.id) {
                        this.selectedStartupDashboard = d.name + ' (' + d.id.toString() + ')';
                    };

                });

                this.globalVariableService.getResource('dashboardTabs')
                    .then(t => {
                        this.dashboardTabs = t;
                        this.dashboardTabs.forEach(t => {

                            // Fill TabList
                            if (this.preferenceStartupDashboardID != null 
                                &&
                                this.preferenceStartupDashboardID == t.dashboardID) {
                                    this.dashboardTabList.push(t.name + ' (' + t.id.toString() + ')');
                            };

                            // Fill Initial Startup T
                            if (this.preferenceStartupDashboardID != null 
                                &&
                                this.preferenceStartupDashboardID == t.dashboardID
                                &&
                                this.preferenceStartupDashboardTabID != null
                                &&
                                this.preferenceStartupDashboardTabID == t.id) {
                                this.selectedStartupDashboardTab = t.name + ' (' + t.id.toString() + ')';
                            };
                        });
                    })
                    .catch(err => {
                        this.errorMessage = err.slice(0, 45);
                        console.error('Error in preferences reading dashboardTabs: ' + err);
                    });

            })
            .catch(err => {
                this.errorMessage = err.slice(0, 45);
                console.error('Error in preferences reading dashboards: ' + err);
            });
}

    
    clickTemplateDashboard(ev:any) {
        // Selected a Template in the dropdown
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTemplateDashboard', '@Start');

        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardString.indexOf('(');
            let closeBracket: number = selectedDashboardString.indexOf(')');
            this.preferenceDefaultTemplateID = +selectedDashboardString.substring(openBracket + 1, closeBracket);

        } else {
            this.preferenceDefaultTemplateID = null;
        };
    }

    clickStartupDashboard(ev:any) {
        // Selected a startup D
        this.globalFunctionService.printToConsole(this.constructor.name,'clickStartupDashboard', '@Start');

        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardString.indexOf('(');
            let closeBracket: number = selectedDashboardString.indexOf(')');
            this.preferenceStartupDashboardID = +selectedDashboardString.substring(openBracket + 1, closeBracket);

            // Fill relevant Tabs
            this.dashboardTabList = ['None'];

            this.dashboardTabs.forEach(t => {

                // Fill TabList
                if (this.preferenceStartupDashboardID != null 
                    &&
                    this.preferenceStartupDashboardID == t.dashboardID) {
                        this.dashboardTabList.push(t.name + ' (' + t.id.toString() + ')');
                };

            });

        } else {
            this.preferenceStartupDashboardID = null;

            // Clear Tabs
            this.dashboardTabList = ['None'];

        };
    }

    clickStartupDashboardTab(ev:any) {
        // Selected a startup T
        this.globalFunctionService.printToConsole(this.constructor.name,'clickStartupDashboardTab', '@Start');

        let selectedDashboardTabString: string = ev.target.value;

        if (selectedDashboardTabString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardTabString.indexOf('(');
            let closeBracket: number = selectedDashboardTabString.indexOf(')');
            this.preferenceStartupDashboardTabID = +selectedDashboardTabString.substring(openBracket + 1, closeBracket);

        } else {
            this.preferenceStartupDashboardID = null;
        };
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

        this.globalVariableService.updateCurrentUserProperties(
            {
                preferencePaletteHorisontal: this.preferencePaletteHorisontal,
                preferencePlaySound: this.preferencePlaySound,
                preferenceDebugSession: this.preferenceDebugSession,
                preferenceAutoSync: this.preferenceAutoSync,
                preferenceShowOpenStartupMessage: this.preferenceShowOpenStartupMessage,
                preferenceShowOpenDataCombinationMessage: this.preferenceShowOpenDataCombinationMessage,
                preferenceShowViewStartupMessage: this.preferenceShowViewStartupMessage,
                preferenceShowDiscardStartupMessage: this.preferenceShowDiscardStartupMessage,
                preferenceDefaultTemplateID: this.preferenceDefaultTemplateID,
                preferenceDefaultDateformat: this.preferenceDefaultDateformat,
                preferenceDefaultFolder: this.preferenceDefaultFolder,
                preferenceDefaultPrinter: this.preferenceDefaultPrinter,
                preferenceDefaultPageSize: this.preferenceDefaultPageSize,
                preferenceDefaultPageLayout: this.preferenceDefaultPageLayout,
                preferenceDefaultSnapshotMins: this.preferenceDefaultSnapshotMins,
                preferenceStartupDashboardID: this.preferenceStartupDashboardID,
                preferenceStartupDashboardTabID: this.preferenceStartupDashboardTabID,
                preferenceShowWidgetEditorLite: this.preferenceShowWidgetEditorLite
            }
        );

        // Save globally, and in DB
        this.globalVariableService.saveResource(
            'canvasUsers', 
            this.globalVariableService.currentUser
            ).then(res =>
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

    clickRefreshLocalCache() {
        // Refreshes local cache
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRefreshLocalCache', '@Start');

        this.globalVariableService.refreshLocalCache();
    }

    //TODO
    //1. Set global var isFirstTimeDashboard = T/F depending on user input

}
