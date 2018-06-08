/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
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
    dashboards: Dashboard[];
    preferenceAutoSync: boolean;
    preferencePaletteHorisontal: boolean;
    preferenceShowOpenStartupMessage: boolean;
    preferenceShowOpenDataCombinationMessage: boolean;
    preferenceShowViewStartupMessage: boolean;
    preferenceShowDiscardStartupMessage: boolean;
    preferenceDefaultTemplate: number;
    preferenceDefaultDateformat: string;
    preferenceDefaultFolder: string;
    preferenceDefaultPrinter: string;
    preferenceDefaultPageSize: string;
    preferenceDefaultPageLayout: string;
    preferenceDefaultSnapshotMins: number;
    selectedTemplateDashboard: string;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get list of D for dropdown
        this.globalVariableService.getDashboards().then(d => {
            this.dashboards = d;
            let dashboards = d.sort((n1,n2) => {
                if (n1.name > n2.name) {
                    return 1;
                };
    
                if (n1.name < n2.name) {
                    return -1;
                };
    
                return 0;
            });
            dashboards.forEach(d => {
                if (d.state = 'Complete') {
                    this.dashboardList.push(d.name + ' (' + d.id.toString() + ')');
                };
                
                // Fill Initial
                if (this.preferenceDefaultTemplate != null  
                    &&
                    this.preferenceDefaultTemplate == d.id) {
                    this.selectedTemplateDashboard = d.name + ' (' + d.id.toString() + ')';
                };
            });

        });

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
        this.preferenceDefaultSnapshotMins = this.globalVariableService.currentUser.preferenceDefaultSnapshotMins;
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
        this.globalVariableService.currentUser.preferenceDefaultSnapshotMins = this.preferenceDefaultSnapshotMins;

        // Save globally, and in DB
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
