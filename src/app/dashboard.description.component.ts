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

    }
    
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


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDescriptionClosed.emit(action);
    }

    clickSave(action: string) {
        // Save the changes, then close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Add permission check
        if (this.globalVariableService.dashboardPermissionCheck(
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
        this.selectedDashboard.dateCreated = this.dashboardCreated;
        this.selectedDashboard.editor = this.dashboardEditor;
        this.selectedDashboard.dateEdited = this.dashboardEdited;
        this.selectedDashboard.refresher = this.dashboardRefresher;
        this.selectedDashboard.dateRefreshed = this.dashboardRefreshed;

        // Update global D
        this.globalVariableService.currentDashboards.forEach(d => {
            if (d.id == this.selectedDashboard.id) {
                d.name = this.dashboardName;
                d.description = this.dashboardDescription;
                d.qaRequired = this.dashboardQArequired;
                d.isSample = this.dashboardIsSample;
                d.code = this.dashboardCode;
                d.defaultTabID = this.dashboardDefaultTab;
                d.refreshMode = this.dashboardRefreshMode;
                d.refreshTimer = this.dashboardRefreshTimer;
                d.defaultExportFileType = this.dashboardExportFileType;
                d.url = this.dashboardExportUrl;
                d.password = this.dashboardPassword;
                d.templateDashboardID = this.dashboardTemplateID;
                d.backgroundColor = this.dashboardBackgroundColor;
                d.backgroundImage = this.dashboardBackgroundImage;
                d.state = this.dashboardState;
                d.version = this.dashboardVersion;
                d.creator = this.dashboardCreator;
                d.dateCreated = this.dashboardCreated;
                d.editor = this.dashboardEditor;
                d.dateEdited = this.dashboardEdited;
                d.refresher = this.dashboardRefresher;
                d.dateRefreshed = this.dashboardRefreshed;
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
}
