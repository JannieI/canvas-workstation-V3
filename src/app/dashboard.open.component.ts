/*
 * Shows the form to open an existing Dashboard
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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    canvasAuditTrails: CanvasAuditTrail[] = [];
    dashboardList: string[] = ['None'];
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
    selectedDashboardId: number;
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
        this.globalVariableService.getResource('canvasGroups').then( res => {
            this.groups = res;
        })
        .catch(err => {
            this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
            console.error('Error in Dashboard.open reading canvasGroups: ' + err);
        });

        // Get DSs
        this.globalVariableService.getResource('datasources')
            .then(res =>{
                this.datasources = res;
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading datasources: ' + err);
            });

        // Template list
        this.globalVariableService.getResource('dashboards')
            .then(res =>{
                this.dashboardsOriginal = res;                
                this.dashboardsOriginal.forEach(d => {
                    if (d.state === 'Complete') {
                        this.dashboardList.push(d.name + ' (' + d.id.toString() + ')');
                    };
                });

                // Get Ds
                this.dashboards = this.dashboardsOriginal.slice().sort((n1,n2) => {
                    if (n1.name.toLowerCase() > n2.name.toLowerCase()) {
                        return 1;
                    };

                    if (n1.name.toLowerCase() < n2.name.toLowerCase()) {
                        return -1;
                    };

                    return 0;
                });
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading dashboards: ' + err);
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
        this.globalVariableService.getResource('canvasAuditTrails')
            .then( res => this.canvasAuditTrails = res)
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading canvasAuditTrails: ' + err);
            });

        // Get Tags in advance
        this.globalVariableService.getResource('dashboardTags')
            .then(res =>
                this.dashboardTags = res
            )
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading dashboardTags: ' + err);
            });

        // Get Schedule Logs in advance
        this.globalVariableService.getResource('dashboardScheduleLog')
            .then(res => this.dashboardScheduleLog = res)
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading dashboardScheduleLog: ' + err);
            });

        // Get Schedules in advance
        this.globalVariableService.getResource('dashboardSchedules')
            .then(res => this.dashboardSchedules = res)
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in Dashboard.open reading dashboardSchedules: ' + err);
            });
    
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
                    dsl => dsl.userID.toLowerCase() === this.filterSchedulesSendTo.toLowerCase()
                    ||
                    dsl.groupID.toLowerCase() === this.filterSchedulesSendTo.toLowerCase())
                .map(dsl => dsl.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterSchedulesDueOn != '') {
            // TODO - this is not final - needs to calc the due date
            if (this.dashboardSchedules.length === 0) {
                this.errorMessage = 'Still retrieving Schedules ...';
                return;
            };
            let dueOn: Date = new Date(this.filterSchedulesDueOn);
            this.dashboards.forEach(d => {
                this.dashboardSchedules.forEach(sch => {
                    if (sch.dashboardID === d.id
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

        if (this.filterSharedByUserID != '') {
            this.globalVariableService.getResource('dashboardPermissions')
                .then(res => {

                    let dIDs: number[] = res
                        .filter(dP => dP.grantor.toLowerCase() === this.filterSharedByUserID.toLowerCase())
                        .map(dP => dP.dashboardID);

                    this.dashboards = this.dashboards.filter(d => {
                        if (dIDs.indexOf(d.id) >= 0) {
                            return d;
                        };
                    });
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.open reading dashboardPermissions: ' + err);
                });

        };
        if (this.filterSharedWithUserID != '') {
            this.globalVariableService.getResource('dashboardPermissions')
                .then(res => {

                    let dIDs: number[] = res
                        .filter(dP => dP.userID.toLowerCase() === this.filterSharedWithUserID.toLowerCase())
                        .map(dP => dP.dashboardID);

                    this.dashboards = this.dashboards.filter(d => {
                        if (dIDs.indexOf(d.id) >= 0) {
                            return d;
                        };
                    });
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.open reading dashboardPermissions: ' + err);
                });
        };

        if (this.filterSharedWithGroup != '') {
            this.globalVariableService.getResource('dashboardPermissions')
                .then(res => {
    
                    let groupIndex: number = this.groups.findIndex(
                        grp => grp.name.toLowerCase() === this.filterSharedWithGroup.toLowerCase());
                    let groupID: number = null;
                    if (groupIndex >= 0) {
                        groupID = this.groups[groupIndex].id;
                    } else {
                        this.errorMessage = 'Unexpected error: The group does not exist in the DB';
                        return;
                    };

                    let dIDs: number[] = res
                        .filter(dP => dP.groupID === groupID)
                        .map(dP => dP.dashboardID);

                    this.dashboards = this.dashboards.filter(d => {
                        if (dIDs.indexOf(d.id) >= 0) {
                            return d;
                        };
                    });
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.open reading dashboardPermissions: ' + err);
                });

        };

        if (this.filterOpenedByUserID != '') {
            if (this.dashboardScheduleLog.length === 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };
            let dIDs: number[] = this.canvasAuditTrails.filter(aud =>
                aud.userID.toLowerCase() === this.filterOpenedByUserID.toLowerCase()
                &&
                aud.objectType === 'Dashboard'
                &&
                aud.actionType === 'Open')
                .map(aud => aud.dashboardID);

            this.dashboards = this.dashboards.filter(d => {
                if (dIDs.indexOf(d.id) >= 0) {
                    return d;
                };
            });

        };
        if (this.filterOpenedAfterDate != '') {
            if (this.dashboardScheduleLog.length === 0) {
                this.errorMessage = 'Still retrieving Schedule Log ...';
                return;
            };

            let afterDate: Date = new Date(this.filterOpenedAfterDate);
            let dIDs: number[] = this.canvasAuditTrails.filter(aud =>
                new Date(aud.changedOn) >= afterDate
                &&
                aud.objectType === 'Dashboard'
                &&
                aud.actionType === 'Open')
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
                    if (d.creator.toLowerCase() === this.filterCreatedBy.toLowerCase()) {
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
                ds => ds.name.toLowerCase() === this.filterDataDatasource.toLowerCase());
            let datasourceID: number = null;
            if (datasourceIndex >= 0) {
                datasourceID = this.datasources[datasourceIndex].id;
            } else {
                this.errorMessage = 'Unexpected error: The selected datasource does not exist in the DB';
                return;
            };

            // Loop on W and get list of their D-ids that use this D
            let dISs: number[] = [];
            this.globalVariableService.getResource('widgets')
                .then(res => {

                    res.forEach(w => {
                        if (w.datasourceID === datasourceID) {
                            if (dISs.indexOf(w.dashboardID) < 0) {
                                dISs.push(w.dashboardID);
                            };
                        };
                    });

                    this.dashboards = this.dashboards.filter(d => dISs.indexOf(d.id) >= 0);
                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in Dashboard.open reading widgets: ' + err);
                });

        };
        if (this.filterState != '') {
            this.dashboards = this.dashboards.filter(d => {
                if (d.state != null) {
                    if (d.state.toLowerCase() === this.filterState.toLowerCase()) {
                        // if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                        //     this.filteredDashboardIDs.push(d.id);
                        // };
                        return d;
                    };
                };
            });

        };
        if (this.filterTag != '') {
            if (this.dashboardTags.length === 0) {
                this.errorMessage = 'Still retrieving Dashboard Tags ...';
                return;
            };
            let dTagIDs: number[] = this.dashboardTags
                .filter(tag => tag.tag.toLowerCase() === this.filterTag.toLowerCase())
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

        if (this.selectedDashboardId != null) {
            this.dashboards = this.dashboards.filter(d => {
                if (d.templateDashboardID === this.selectedDashboardId) {
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
                    if (d.editor.toLowerCase() === this.filterModifiedByUserID.toLowerCase()) {
                        return d;
                    };
                };
            });
        };

        // Close the filter
        this.showAdvancedFilters = false;
    }

    clickOpenView(dashboardID: number, state: string) {
        // Open a Dashboard in ViewOnly Mode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenView', '@Start');

        // No Access
        if (!this.globalVariableService.dashboardPermissionCheck(
            dashboardID, 'canviewandcanedit')) {
                this.errorMessage = 'Insufficient Permission';
                return;
        };

        // this.globalVariableService.editMode.next(state === 'Draft'?  true  :  false);

		this.globalVariableService.refreshCurrentDashboard(
			'openDashboard-clickOpenRecentDashboard', dashboardID, -1, ''
        );

        this.formDashboardOpenClosed.emit('View');
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

        } else {
            this.selectedDashboardId = null;
        };

    }
}
