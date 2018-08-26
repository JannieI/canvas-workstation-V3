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
import { DashboardRecent }            from './models';

// Other
import { Subscription }               from 'rxjs';

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
    colourPickerSubscription: Subscription;
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
    dashboardCreated: Date;
    dashboardEditor: string;
    dashboardEdited: Date;
    dashboardRefresher: string;
    dashboardRefreshed: Date;
    dashboardAccessType: string;
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
                // List of ngFor (needs ID at later stage, state is useful for user)
                this.dashboardList.push(d.name + ' (' + d.id.toString() + ') ' + d.state);

                // Fill Initial
                if (this.selectedDashboard.templateDashboardID != null
                    &&
                    this.selectedDashboard.templateDashboardID == d.id) {
                    this.selectedTemplateDashboard = d.name + ' (' + d.id.toString() + ') ' + d.state;
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
        this.dashboardCreated = this.selectedDashboard.dateCreated;
        this.dashboardEditor = this.selectedDashboard.editor;
        this.dashboardEdited = this.selectedDashboard.dateEdited;
        this.dashboardRefresher = this.selectedDashboard.refresher;
        this.dashboardRefreshed = this.selectedDashboard.dateRefreshed;
        this.dashboardAccessType = this.selectedDashboard.accessType;

        // Manage colour picker
        this.colourPickerSubscription = this.globalVariableService.colourPickerClosed.subscribe(clp => {

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

    ngOnDestroy() {
        // Clean up before component is destroyed
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.colourPickerSubscription.unsubscribe;
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
        console.warn('xx this.dashboardTemplateID', this.dashboardTemplateID)
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
        this.selectedDashboard.accessType = this.dashboardAccessType;

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

        // Update recent list
        let newRecentIndex: DashboardRecent = this.globalVariableService.dashboardsRecent
            .findIndex(dR => dR.dashboardID == this.selectedDashboard.id);
        if (newRecentIndex >= 0) {
            let newRecent: DashboardRecent = this.globalVariableService.dashboardsRecent[newRecentIndex];
            newRecentIndex.nameAtRunTime = this.dashboardName
            this.globalVariableService.saveDashboardRecent(newRecent)
        }
        let newRecent: DashboardRecent = {
            id: null,
            userID: this.currentUser.userID,
            dashboardID: dashboardID,
            dashboardTabID: dashboardTabID,
            editMode: this.editMode.value,
            accessed: new Date(this.formatDate(today)),
            stateAtRunTime: 'Draft',
            nameAtRunTime: ''
        };
        this.globalVariableService.dashboardsRecent.forEach(dR => {
            if (dR.dashboardID == this.selectedDashboard.id) {
                dR.nameAtRunTime = this.dashboardName;
            };
        });

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
