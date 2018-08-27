/*
 * Open an existing Dashboard
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
import { CanvasAuditTrail }           from './models';
import { Datasource }                 from './models';
import { DashboardTag }               from './models';
import { CanvasGroup }                from './models';
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';
import { DashboardScheduleLog }       from './models';
import { DashboardSchedule }          from './models';

@Component({
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Input() test: boolean;
    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

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

    canvasAuditTrails: CanvasAuditTrail[] = [];
    dashboardsOriginal: Dashboard[];
    dashboardPermission: DashboardPermission[];
    dashboards: Dashboard[];
    dashboardScheduleLog: DashboardScheduleLog[] = [];
    dashboardSchedules: DashboardSchedule[] = [];
    dashboardTags: DashboardTag[] =[];
    datasources: Datasource[] = [];
    errorMessage: string = '';
    filteredDashboardIDs: number[] = [];
    filterDashboardName: string = '';
    filterSchedulesSendTo: string = '';
    filterSchedulesDueOn: string = '';
    filterSchedulesSentAfter: string = '';
    filterSchedulesSentBefore: string = '';
    filterSharedByUserID: string = '';
    filterSharedWithUserID: string = '';
    filterSharedWithGroup: string = '';
    filterOpenedByUserID: string = '';
    filterOpenedAfterDate: string = '';
    filterCreatedBy: string = '';
    filterCreatedAfter: string = '';
    filterDataDatasource: string = '';
    filterState: string = '';
    filterTag: string = '';
    filterMyFav: string = '';
    filterModifiedAfter: string = '';
    filterModifiedBefore: string = '';
    filterModifiedByUserID: string = '';
    groups: CanvasGroup[] = [];
    records: number = 15;
    selectedRow: number = 0;
    selectedTemplateDashboard: string;
    showAdvancedFilters: boolean = false;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Prefetch data
        this.globalVariableService.getCanvasGroups().then( res => {
            this.groups = res;
        });

        // Get DSs
        this.datasources = this.globalVariableService.datasources.slice();

        // Get Ds
        this.dashboardsOriginal = this.globalVariableService.dashboards.slice()
        this.dashboards = this.dashboardsOriginal.slice().sort((n1,n2) => {
            if (n1.name > n2.name) {
                return 1;
            };

            if (n1.name < n2.name) {
                return -1;
            };

            return 0;
        });
    }

    clickSearch() {
        // Create a new Dashboard, and close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSearch', '@Start');

        // Reset
        this.dashboards = this.dashboardsOriginal;

        // Filter Name
        if (this.filterDashboardName != '') {
            this.dashboards = this.dashboardsOriginal.filter(d =>
                d.name.toLowerCase().includes(this.filterDashboardName.toLowerCase())
            );
        };
    }

    clickClose(action: string) {
        // Close form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.test = true;

        console.log('DashboardOpen clickClose', this.test)

		this.formDashboardOpenClosed.emit(action);
    }

    clickShowAdvancedFilters() {
        // Open area with advanced filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        this.showAdvancedFilters = !this.showAdvancedFilters;

        // Get AuditTrail in advance
        this.globalVariableService.getCanvasAuditTrails().then( res => {
            this.canvasAuditTrails = res;
        });

        // Get Tags in advance
        this.globalVariableService.getDashboardTags().then(res =>
            this.dashboardTags = res);

        // Get Schedule Logs in advance
        this.globalVariableService.getDashboardScheduleLog().then(res =>
            this.dashboardScheduleLog = res);

        // Get Schedules in advance
        this.globalVariableService.getDashboardSchedules().then(res =>
            this.dashboardSchedules = res);

        // Nothing selected
        this.filteredDashboardIDs = [];
    }

    clickFiltersClose() {
        // Clear the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFiltersClose', '@Start');

        // Close the filter
        this.showAdvancedFilters = false;
    }

    clickFiltersClear() {
        // Clear the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFiltersClear', '@Start');

        this.filterDashboardName = '';
        this.filterSchedulesSendTo = '';
        this.filterSchedulesDueOn = '';
        this.filterSchedulesSentAfter = '';
        this.filterSchedulesSentBefore = '';
        this.filterSharedByUserID = '';
        this.filterSharedWithUserID = '';
        this.filterSharedWithGroup = '';
        this.filterOpenedByUserID = '';
        this.filterOpenedAfterDate = '';
        this.filterCreatedBy = '';
        this.filterCreatedAfter = '';
        this.filterDataDatasource = '';
        // this.filterDataField = '';
        this.filterState = '';
        this.filterTag = '';
        this.filterMyFav = '';
        this.filterModifiedAfter = '';
        this.filterModifiedBefore = '';
        this.filterModifiedByUserID = '';

    }

    clickFiltersApply() {
        // Open area with advanced filters
        // Note: these are combined as AND conditions
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        // Reset
        this.filteredDashboardIDs = [];
        this.dashboards = this.dashboardsOriginal.slice();

        // TODO - add Schedule filters later
        if (this.filterSchedulesSendTo != '') {
            if (this.dashboardScheduleLog.length ==0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };

            let dIDs: number[] = this.dashboardScheduleLog
                .filter(
                    dsl => dsl.userID.toLowerCase() == this.filterSchedulesSendTo.toLowerCase()
                    ||
                    dsl.groupID.toLowerCase() == this.filterSchedulesSendTo.toLowerCase())
                .map(dsl => dsl.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterSchedulesDueOn != '') {
            // TODO - this is not final - needs to calc the due date
            if (this.dashboardSchedules.length == 0) {
                this.errorMessage = 'Still retrieving Schedules ...';
                return;
            };
            let dueOn: Date = new Date(this.filterSchedulesDueOn);
            this.dashboards.forEach(d => {
                this.dashboardSchedules.forEach(sch => {
                    if (sch.dashboardID == d.id
                        &&
                        sch.startsOn >= dueOn
                        ) {
                            if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                                this.filteredDashboardIDs.push(d.id);
                            };
                    };
                });
            });

        };
        if (this.filterSchedulesSentAfter != '') {
            let sentAfter: Date = new Date(this.filterSchedulesSentAfter);

            if (this.dashboardScheduleLog.length ==0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };

            let dIDs: number[] = this.dashboardScheduleLog
                .filter(dsl => new Date(dsl.sentOn) >= sentAfter)
                .map(dsl => dsl.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterSchedulesSentBefore != '') {
            let sentBefore: Date = new Date(this.filterSchedulesSentBefore);

            if (this.dashboardScheduleLog.length ==0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };

            let dIDs: number[] = this.dashboardScheduleLog
                .filter(dsl => new Date(dsl.sentOn) <= sentBefore)
                .map(dsl => dsl.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        console.warn('xx AFTER filterSchedulesSentBefore', this.dashboards)

        if (this.filterSharedByUserID != '') {
            let dIDs: number[] = this.globalVariableService.dashboardPermissions
                .filter(dP => dP.grantor.toLowerCase() == this.filterSharedByUserID.toLowerCase())
                .map(dP => dP.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });
        };
        if (this.filterSharedWithUserID != '') {
            let dIDs: number[] = this.globalVariableService.dashboardPermissions
                .filter(dP => dP.userID.toLowerCase() == this.filterSharedWithUserID.toLowerCase())
                .map(dP => dP.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });
        };
        if (this.filterSharedWithGroup != '') {
            let groupIndex: number = this.groups.findIndex(
                grp => grp.name.toLowerCase() == this.filterSharedWithGroup.toLowerCase());
            let groupID: number = null;
            if (groupIndex >= 0) {
                groupID = this.groups[groupIndex].id;
            } else {
                this.errorMessage = 'Unexpected error: The group does not exist in the DB';
                return;
            };

            let dIDs: number[] = this.globalVariableService.dashboardPermissions
                .filter(dP => dP.groupID == groupID)
                .map(dP => dP.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };

        if (this.filterOpenedByUserID != '') {
            if (this.dashboardScheduleLog.length == 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            let dIDs: number[] = this.canvasAuditTrails.filter(aud =>
                aud.userID.toLowerCase() == this.filterOpenedByUserID.toLowerCase()
                &&
                aud.objectType == 'Dashboard'
                &&
                aud.actionType == 'Open')
                .map(aud => aud.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterOpenedAfterDate != '') {
            if (this.dashboardScheduleLog.length == 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };

            let afterDate: Date = new Date(this.filterOpenedAfterDate);
            let dIDs: number[] = this.canvasAuditTrails.filter(aud =>
                new Date(aud.changedOn) >= afterDate
                &&
                aud.objectType == 'Dashboard'
                &&
                aud.actionType == 'Open')
                .map(aud => aud.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterCreatedBy != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.creator != null) {
                    if (d.creator.toLowerCase() == this.filterCreatedBy.toLowerCase()) {
                        return d;
                    };
                };
            });

        };
        if (this.filterCreatedAfter != '') {
            let dateAfter: Date = new Date(this.filterCreatedAfter);
            this.dashboards = this.dashboards.filter(d => {
                if (d.dateCreated != null) {
                    if (new Date(d.dateCreated) >= dateAfter) {
                        return d;
                    };
                };
            });

        };
        if (this.filterDataDatasource != '') {
            let datasourceIndex: number = this.datasources.findIndex(
                ds => ds.name.toLowerCase() == this.filterDataDatasource.toLowerCase());
            let datasourceID: number = null;
            if (datasourceIndex >= 0) {
                datasourceID = this.datasources[datasourceIndex].id;
            } else {
                this.errorMessage = 'Unexpected error: The selected datasource does not exist in the DB';
                return;
            };

            // Loop on W and get list of their D-ids that use this D
            let dISs: number[] = [];
            this.globalVariableService.widgets.forEach(w => {
                if (w.datasourceID == datasourceID) {
                    if (dISs.indexOf(w.dashboardID) < 0) {
                        dISs.push(w.dashboardID);
                    };
                };
            });

            this.dashboards = this.dashboards.filter(d => dISs.indexOf(d.id) >= 0);

        };
        if (this.filterState != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.state != null) {
                    if (d.state.toLowerCase() == this.filterState.toLowerCase()) {
                        // if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                        //     this.filteredDashboardIDs.push(d.id);
                        // };
                        return d;
                    };
                };
            });

        };
        if (this.filterTag != '') {
            if (this.dashboardTags.length == 0) {
                this.errorMessage = 'Still retrieving Dashboard Tags ...';
                return;
            };
            let dTagIDs: number[] = this.dashboardTags
                .filter(tag => tag.tag.toLowerCase() == this.filterTag.toLowerCase())
                .map(tag => tag.dashboardID)
            this.dashboards = this.dashboards.filter(d => {
                if (dTagIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });
        };

        if (this.filterMyFav != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (this.globalVariableService.currentUser.favouriteDashboards.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterModifiedAfter != '') {
            let dateAfter: Date = new Date(this.filterModifiedAfter);
            this.dashboards = this.dashboards.filter(d => {
                if (d.dateEdited != null) {
                    if (d.dateEdited >= dateAfter) {
                        return d;
                    };
                };
            });

        };
        if (this.filterModifiedBefore != '') {
            let dateAfter: Date = new Date(this.filterModifiedAfter);
            this.dashboards = this.dashboards.filter(d => {
                if (d.dateEdited != null) {
                    if (d.dateEdited <= dateAfter) {
                        return d;
                    };
                };
            });

        };
        if (this.filterModifiedByUserID != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.editor != null) {
                    if (d.editor.toLowerCase() == this.filterModifiedByUserID.toLowerCase()) {
                        return d;
                    };
                };
            });
        };

        // Close the filter
        this.showAdvancedFilters = false;
    }

    clickOpenView(dashboardID: number) {
        // Open a Dashboard in ViewOnly Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenView', '@Start');

        this.globalVariableService.editMode.next(false);

		this.globalVariableService.refreshCurrentDashboard(
			'openDashboard-clickOpenRecentDashboard', dashboardID, -1, ''
        );

        this.formDashboardOpenClosed.emit('View');
    }

    clickOpenEdit(index: number, dashboardID: number) {
        // Open a Dashboard in EditMode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenEdit', '@Start');

        // Only Editor can open his Draft
        if (this.dashboards[index].state == 'Draft'
            &&
            this.dashboards[index].editor != this.globalVariableService.currentUser.
            userID) {
                this.errorMessage = 'Dashboard is edited by ' + this.dashboards[index].editor;
                return;
        };

        // Copy Original to Draft
        if (this.dashboards[index].state == 'Complete') {
            this.globalVariableService.copyDashboard(
                this.dashboards[index].id, null, 'Draft'
            ).then(res => {
                this.globalVariableService.refreshCurrentDashboard(
                    'openDashboard-clickOpenEdit', res.id, -1, ''
                );
                this.globalVariableService.editMode.next(true);
                this.formDashboardOpenClosed.emit('View');
            });
        } else {

            this.globalVariableService.refreshCurrentDashboard(
                'openDashboard-clickOpenEdit', dashboardID, -1, ''
            );
            this.globalVariableService.editMode.next(true);
            this.formDashboardOpenClosed.emit('View');
        };
    }

    clickRow(index: number) {
        // Show groups
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');
        this.selectedRow = index;
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
            
            this.preferenceDefaultTemplateID = this.selectedDashboardId;
        } else {
            this.preferenceDefaultTemplateID = null;
        };
    }
}
