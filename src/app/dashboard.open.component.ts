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
import { Dashboard }                  from './models';
import { DashboardPermission }        from './models';

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

    dashboards: Dashboard[];
    dashboardPermission: DashboardPermission[];
    dashboardsOriginal: Dashboard[];
    errorMessage: string = '';
        
    filteredDashboardIDs: number[] = [];
    filterDashboardName: string = '';
    filterSchedulesSendToTitle: string = '';
    filterSchedulesDueOn: string = '';
    filterSchedulesSentAfter: string = '';
    filterSchedulesSentBefore: string = '';
    filterSharedByMe: string = '';
    filterSharedWithMe: string = '';
    filterSharedWithUserID: string;
    filterSharedWithGroup: string = '';
    filterOpenedByMe: string = '';
    filterOpenedLastMonth: string = '';
    filterCreatedBy: string = '';
    filterCreatedLastMonth: string = '';
    filterDataDatasource: string = '';
    filterDataField: string = '';
    filterStatus: string = '';
    filterTag: string = '';
    filterMyFav: string = '';
    filterModifiedAfter: string = '';
    filterModifiedBefore: string = '';
    filterModifiedByUserID: string = '';

    records: number = 15;
    selectedRow: number = 0;
    showAdvancedFilters: boolean = false;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

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

        // Nothing selected
        this.filteredDashboardIDs = [];
    }

    clickFiltersClear() {
        // Clear the filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFiltersClear', '@Start');

        this.filterDashboardName = '';
        this.filterSchedulesSendToTitle = '';
        this.filterSchedulesDueOn = '';
        this.filterSchedulesSentAfter = '';
        this.filterSchedulesSentBefore = '';
        this.filterSharedByMe = '';
        this.filterSharedWithMe = '';
        this.filterSharedWithUserID = '';
        this.filterSharedWithGroup = '';
        this.filterOpenedByMe = '';
        this.filterOpenedLastMonth = '';
        this.filterCreatedBy = '';
        this.filterCreatedLastMonth = '';
        this.filterDataDatasource = '';
        this.filterDataField = '';
        this.filterStatus = '';
        this.filterTag = '';
        this.filterMyFav = '';
        this.filterModifiedAfter = '';
        this.filterModifiedBefore = '';
        this.filterModifiedByUserID = '';

    }

    clickFiltersApply() {
        // Open area with advanced filters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        // filterSharedWithUserID
        this.dashboardsOriginal.forEach(d => {
            this.globalVariableService.dashboardPermissions.forEach(dP => {
                if (dP.dashboardID == d.id  &&  dP.grantor == this.filterSharedWithUserID) {
                    if (this.filteredDashboardIDs.indexOf(d.id) < 0) {
                        this.filteredDashboardIDs.push(d.id);
                    };
                };
            });
        })
        
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
                console.warn('xx res', res)
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
}
