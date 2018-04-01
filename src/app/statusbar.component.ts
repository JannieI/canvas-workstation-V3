/*
 * StatusBar
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Dashboard }                  from './models'
import { DashboardTab }               from './models'
import { Datasource }                 from './models'


@Component({
    selector: 'status-bar',
    styleUrls: ['./statusbar.component.css'],
    templateUrl: './statusbar.component.html'
})

export class StatusbarComponent {

    @Input() currentDashboardName: string;
    @Input() currentTabName: string;
    @Input() currentDashboardTabIndex: number;
    @Input() currentTabBackgroundColor: string;
    @Input() currentTabColor: string;
    @Input() statusBarRunning: string;
    @Input() statusBarCancelRefresh: string;
    @Input() templateInUse: string;

    currentDashboardTabs: DashboardTab[];
    dashboardDescription: string;
    dashboardTabDescription: string;
    editMode: boolean = false;
    loggedIntoServerText: string;
    menuActionResize: boolean;
    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showNewTab: boolean = false;
    showTabList: boolean = false;
    statusBarMessageText: string = '';
    statusBarMessageColour: string = 'rgb(197, 194, 194)';
    widgetGroupText: string;


    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.editMode.subscribe(
            i => {
                    this.editMode = i;
                 }
        );

        // Nr of Ws in group
        this.globalVariableService.widgetGroup.subscribe(wg => {
            if (wg.length == 0) {
                this.widgetGroupText = '';
            } else {
                this.widgetGroupText = 'Group: ' + wg.length.toString();
            };
        });

        // Adjust Local / Server
        this.globalVariableService.loggedIntoServer.subscribe(i => {
            if (i) {
                this.loggedIntoServerText = 'Server';
            } else {
                this.loggedIntoServerText = 'Local';
            };
        });

        // Adjust for templates
        this.globalVariableService.templateInUse.subscribe(i => {
            if (i) {
                this.templateInUse = 'Tmpl Used '
            } else {
                this.templateInUse = ''
            };
        });

        // Close any open popups when a new D is opened
        this.globalVariableService.currentDashboardInfo.subscribe(
            i => {
                this.showDashboardDescription = false;
                this.showDashboardTabDescription = false;
                this.showNewTab = false;
                this.showTabList = false;
            }
        );
        this.globalVariableService.statusBarMessage.subscribe(i =>
            {
                var self = this;
                if (i != null) {
                    this.statusBarMessageText = i.message;
                    this.statusBarMessageColour = 'rgb(197, 194, 194)';
                    if (i.classfication == 'Warning') {
                        this.statusBarMessageColour = 'yellow';
                    }
                    if (i.classfication == 'Error') {
                        this.statusBarMessageColour = 'orange';
                    }

                    setTimeout(function(){
                        self.statusBarMessageText = '';
                        self.statusBarMessageColour = 'rgb(197, 194, 194)';
                        }, i.timeout
                    );
                }
            }

        )
    }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        // Throws an error on second Slicer selection who wants to pass a message ...
        // this.globalVariableService.editMode.unsubscribe();
        // this.globalVariableService.widgetGroup.unsubscribe();
        // this.globalVariableService.loggedIntoServer.unsubscribe();
        // this.globalVariableService.templateInUse.unsubscribe();
        // this.globalVariableService.currentDashboardInfo.unsubscribe();
        // this.globalVariableService.statusBarMessage.unsubscribe();
    }

    clickDashboardDescription() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDescription', '@Start');

        this.dashboardDescription = this.globalVariableService.currentDashboards[0].description;
        this.showTabList = false;
        this.showDashboardDescription = true;
        this.showDashboardTabDescription = false;
    }

    clickListTabs() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickListTabs', '@Start');

        this.currentDashboardTabs = this.globalVariableService.currentDashboardTabs;
        this.showTabList = true;
        this.showDashboardDescription = false;
        this.showDashboardTabDescription = false;
    }

    selectDashboardTab(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'selectDashboardTab', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-selectDashboardTab',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            this.currentDashboardTabs[index].id,
            ''
        );
    }

    clickShowFirstTab() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFirstTab', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = false;
        this.showDashboardDescription = false;

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickShowFirstTab',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'First'
        );
    }


    clickShowPreviousTab() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowPreviousTab', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = false;
        this.showDashboardDescription = false;

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickShowPreviousTab',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Previous'
        );
    }

    clickShowTabDescription() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowTabDescription', '@Start');

        this.dashboardTabDescription = this.globalVariableService.currentDashboardTabs[
            this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex
        ].description

        this.showTabList = false;
        this.showDashboardTabDescription = true;
        this.showDashboardDescription = false;

    }

    clickShowNextTab() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowNextTab', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = false;
        this.showDashboardDescription = false;

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickShowNextTab',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Next'
        );
    }

    clickShowLastTab() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowLastTab', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = false;
        this.showDashboardDescription = false;

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickShowLastTab',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Last'
        );
    }

    clickAddTab() {
        // Add a new Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddTab', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: this.globalVariableService.canvasSettings.notInEditModeMsg,
                    uiArea: 'StatusBar',
                    classfication: 'Warning',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
            return;
        };
        this.showNewTab = true;
    }

    clickTabDelete() {
        // Delete a Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        // Has to be in editMode
        if (!this.editMode) {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: this.globalVariableService.canvasSettings.notInEditModeMsg,
                    uiArea: 'StatusBar',
                    classfication: 'Warning',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
            return;
        };

        // Can only delete Tab if it has no W on it
        let nrWperT: number = 0;
        nrWperT = this.globalVariableService.widgets.filter(w => {
            if (w.dashboardID == this.globalVariableService.currentDashboardInfo.value.
                currentDashboardID
            &&
            w.dashboardTabIDs.indexOf(this.globalVariableService.currentDashboardInfo.
                value.currentDashboardTabID) >= 0) {
                    return w;
                }
        }).length;
        if (nrWperT > 0) {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'First delete all Widgets',
                    uiArea: 'StatusBar',
                    classfication: 'Warning',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
            return;
        };

        // Get the index, Delete, and refresh
        // TODO - improve when working with a DB
        for (var x = 0; x < this.globalVariableService.dashboardTabs.length; x++) {
            if (this.globalVariableService.dashboardTabs[x].id ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID) {
                    break;
            };
        };

        this.globalVariableService.dashboardTabs.splice(x, 1);

        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickTabDelete',
            this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
            0,
            'Previous'
        );

        // Close popup form
        this.showDashboardTabDescription = false;
    }

    handleCloseDashboardTab(action: string) {
        // Handle Close Tab form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        this.showNewTab = false;
    }
}


