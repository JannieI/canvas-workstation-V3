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
    selector: 'dashboard-description',
    templateUrl: './dashboard.description.component.html',
    styleUrls: ['./dashboard.description.component.css']
})
export class DashboardDescriptionComponent implements OnInit {

    @Input() selectedDashboard: Dashboard;
    @Output() formDashboardDescriptionClosed: EventEmitter<string> = new EventEmitter();

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


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
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
        console.log('clickClose')

		this.formDashboardDescriptionClosed.emit(action);
    }
}
