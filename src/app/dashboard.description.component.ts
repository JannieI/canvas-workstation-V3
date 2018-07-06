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
import { CSScolor }                   from './models';
import { Dashboard }                  from './models';

@Component({
    selector: 'dashboard-description',
    templateUrl: './dashboard.description.component.html',
    styleUrls: ['./dashboard.description.component.css']
})
export class DashboardDescriptionComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardDescriptionClosed: EventEmitter<string> = new EventEmitter();

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

    backgroundcolors: CSScolor[];
    callingRoutine: string = '';
    colourPickerClosed: boolean = false;
    dashboardList: string[] = ['None'];
    dashboards: Dashboard[];
    dashboardName: string;
    dashboardDescription: string;
    dashboardQArequired: boolean;
    dashboardIsSample: boolean;
    dashboardCode: string;
    dashboardDefaultTab: number;
    dashboardRefreshMode: string;
    dashboardRefreshTimer: number;
    dashboardExportFileType: string;
    dashboardExportUrl: string;
    dashboardPassword: string;
    dashboardTemplateID: number;
    dashboardTemplateIDoriginal: number;
    dashboardBackgroundColor: string;
    dashboardBackgroundImage: string;
    dashboardState: string;
    dashboardVersion: number;
    dashboardCreator: string;
    dashboardCreated: string;
    dashboardEditor: string;
    dashboardEdited: string;
    dashboardRefresher: string;
    dashboardRefreshed: string;
    errorMessage: string = '';
    selectedColour: string;
    selectedDashboardId: number;
    selectedTemplateDashboard: string;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Store Original - need to refresh if changed
        this.dashboardTemplateIDoriginal = this.selectedDashboard.templateDashboardID;

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
                if (this.selectedDashboard.templateDashboardID != null  
                    &&
                    this.selectedDashboard.templateDashboardID == d.id) {
                    this.selectedTemplateDashboard = d.name + ' (' + d.id.toString() + ')';
                };
            });

        });

        // Update local properties
        this.dashboardName = this.selectedDashboard.name;
        this.dashboardDescription = this.selectedDashboard.description;
        this.dashboardQArequired = this.selectedDashboard.qaRequired;
        this.dashboardIsSample = this.selectedDashboard.isSample;
        this.dashboardCode = this.selectedDashboard.code;
        this.dashboardDefaultTab = this.selectedDashboard.defaultTabID;
        this.dashboardRefreshMode = this.selectedDashboard.refreshMode;
        this.dashboardRefreshTimer = this.selectedDashboard.refreshTimer;
        this.dashboardExportFileType = this.selectedDashboard.defaultExportFileType;
        this.dashboardExportUrl = this.selectedDashboard.url;
        this.dashboardPassword = this.selectedDashboard.password;
        this.dashboardTemplateID = this.selectedDashboard.templateDashboardID;
        this.dashboardBackgroundColor = this.selectedDashboard.backgroundColor;
        this.dashboardBackgroundImage = this.selectedDashboard.backgroundImage;
        this.dashboardState = this.selectedDashboard.state;
        this.dashboardVersion = this.selectedDashboard.version;
        this.dashboardCreator = this.selectedDashboard.creator;
        this.dashboardCreated = this.selectedDashboard.dateCreated.toString();
        this.dashboardEditor = this.selectedDashboard.editor;
        this.dashboardEdited = this.selectedDashboard.dateEdited.toString();
        this.dashboardRefresher = this.selectedDashboard.refresher;
        this.dashboardRefreshed = this.selectedDashboard.dateRefreshed;

        // Manage colour picker
        this.globalVariableService.colourPickerClosed.subscribe(clp => {

            if (clp != null) {

                if (clp.cancelled) {
                    this.colourPickerClosed = false;
                } else {

                    if (clp.callingRoutine == 'BgColour') {
                        this.colourPickerClosed = false;
                        this.dashboardBackgroundColor = clp.selectedColor;
                    };

                };
            };
        });

        // Get setup info
        this.backgroundcolors = this.globalVariableService.backgroundcolors.slice();
        
    }

    clickTemplateDashboard(ev:any, id: number) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTemplateDashboard', '@Start');

        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardString.indexOf('(');
            let closeBracket: number = selectedDashboardString.indexOf(')');
            this.selectedDashboardId = +selectedDashboardString.substring(openBracket + 1, closeBracket);
            
            this.dashboardTemplateID = this.selectedDashboardId;
        } else {
            this.dashboardTemplateID = null;
        };
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDescriptionClosed.emit(action);
    }

    clickSave(action: string) {
        // Save the changes, then close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Validation
        if (this.dashboardName == '') {
            this.errorMessage = 'Please enter a Name';
            return;
        };
        if (this.dashboardDescription == '') {
            this.errorMessage = 'Please enter a Description';
            return;
        };
        if (this.dashboardCode == '') {
            this.errorMessage = 'Please enter a Code';
            return;
        };

        // Add permission check
        if (!this.globalVariableService.dashboardPermissionCheck(
            this.selectedDashboard.id,
            'CanEdit')) {
            this.errorMessage = 'Insufficient Permission (needs CanEdit rights or be Owner';
            return;
        };

        // Update local D
        this.selectedDashboard.name = this.dashboardName;
        this.selectedDashboard.description = this.dashboardDescription;
        this.selectedDashboard.qaRequired = this.dashboardQArequired;
        this.selectedDashboard.isSample = this.dashboardIsSample;
        this.selectedDashboard.code = this.dashboardCode;
        this.selectedDashboard.defaultTabID = this.dashboardDefaultTab;
        this.selectedDashboard.refreshMode = this.dashboardRefreshMode;
        this.selectedDashboard.refreshTimer = this.dashboardRefreshTimer;
        this.selectedDashboard.defaultExportFileType = this.dashboardExportFileType;
        this.selectedDashboard.url = this.dashboardExportUrl;
        this.selectedDashboard.password = this.dashboardPassword;
        this.selectedDashboard.templateDashboardID = this.dashboardTemplateID;
        this.selectedDashboard.backgroundColor = this.dashboardBackgroundColor;
        this.selectedDashboard.backgroundImage = this.dashboardBackgroundImage;
        this.selectedDashboard.state = this.dashboardState;
        this.selectedDashboard.version = this.dashboardVersion;
        this.selectedDashboard.creator = this.dashboardCreator;
        this.selectedDashboard.dateCreated = new Date(this.dashboardCreated);
        this.selectedDashboard.editor = this.dashboardEditor;
        this.selectedDashboard.dateEdited = new Date(this.dashboardEdited);
        this.selectedDashboard.refresher = this.dashboardRefresher;
        this.selectedDashboard.dateRefreshed = this.dashboardRefreshed;

        // Update global D
        this.globalVariableService.saveDashboard(this.selectedDashboard);

        // Refresh if Template changes to show changes on screen
        if (this.dashboardTemplateIDoriginal != this.selectedDashboard.templateDashboardID) {
            this.globalVariableService.refreshCurrentDashboard(
                'dashboardDescription-save',
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                ''
            );
        };

        // Tell user
        this.globalVariableService.showStatusBarMessage(
            {
                message: 'Changes Saved',
                uiArea: 'StatusBar',
                classfication: 'Info',
                timeout: 3000,
                defaultMessage: ''
            }
        );
		this.formDashboardDescriptionClosed.emit(action);
    }
          
    clickSelectBgColor(ev: any) {
        // Select Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColor', '@Start');

        this.dashboardBackgroundColor = ev.target.value;
    }

    clickSelectBgColorPicker(ev: any) {
        // Open the Colour Picker for Background Colour
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectBgColorPicker', '@Start');

        this.selectedColour = this.dashboardBackgroundColor;
        this.callingRoutine = 'BgColour';
        this.colourPickerClosed = true;
    }
      
}
