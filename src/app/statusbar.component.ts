/*
 * StatusBar
 */

// From Angular
import { Component }                  from '@angular/core';
import { Input }                      from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { DashboardTab }               from './models'
import { Subscription }               from 'rxjs';


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

    currentDashboardInfoSubscription: Subscription;
    currentDashboardTabs: DashboardTab[];
    dashboardDescription: string;
    dashboardTabDescription: string;
    dontDisturb: boolean = false;
    dontDisturbSubscription: Subscription;
    editMode: boolean = false;
    editModeSubscription: Subscription;
    loggedIntoServerText: string;
    loggedIntoServerSubscription: Subscription;
    newTab: boolean = true;                     // True if Add, False if Edit existing
    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showNewTab: boolean = false;
    showTabList: boolean = false;
    state: string = '';
    statusBarMessageText: string = '';
    statusBarMessageColour: string = 'rgb(197, 194, 194)';
    statusBarMessageSubscription: Subscription;
    tabOrdering: boolean = false;
    templateInUseSubscription: Subscription;
    widgetGroupText: string;
    widgetGroupSubscription: Subscription;


    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.editModeSubscription = this.globalVariableService.editMode.subscribe(
            i => {
                    this.editMode = i;
                 }
        );

        // Dont Disturb
        this.dontDisturbSubscription = this.globalVariableService.dontDisturb.subscribe(
            ddb => this.dontDisturb = ddb)

        // Nr of Ws in group
        this.widgetGroupSubscription = this.globalVariableService.widgetGroup.subscribe(wg => {
            if (wg.length == 0) {
                this.widgetGroupText = '';
            } else {
                this.widgetGroupText = 'Group: ' + wg.length.toString();
            };
        });

        // Adjust Server Name to display on the StatusBar
        this.loggedIntoServerSubscription = this.globalVariableService.loggedIntoServer
            .subscribe(i => {
                if (i) {
                    this.loggedIntoServerText = this.globalVariableService.canvasServerName;
                } else {
                    this.loggedIntoServerText = '';
                };
        });

        // Adjust for templates
        this.templateInUseSubscription = this.globalVariableService.templateInUse
            .subscribe(i => {
                if (i) {
                    this.templateInUse = 'Tmpl Used '
                } else {
                    this.templateInUse = ''
                };
        });

        // Change name if changed via rename
        this.globalVariableService.currentDashboardName.subscribe(
            i => {
                if (i != '') {
                    this.currentDashboardName = i;
                }
            }
        )
        // Close any open popups when a new D is opened
        this.currentDashboardInfoSubscription = this.globalVariableService
            .currentDashboardInfo.subscribe(i => {
                this.showDashboardDescription = false;
                this.showDashboardTabDescription = false;
                this.showNewTab = false;
                this.showTabList = false;
                if (i != null) {
                    this.state = i.currentDashboardState;
                };

            }
        );
        this.statusBarMessageSubscription = this.globalVariableService.statusBarMessage
            .subscribe(i => {
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
        this.editModeSubscription.unsubscribe();
        this.dontDisturbSubscription.unsubscribe();
        this.widgetGroupSubscription.unsubscribe();
        this.loggedIntoServerSubscription.unsubscribe();
        this.templateInUseSubscription.unsubscribe();
        this.currentDashboardInfoSubscription.unsubscribe();
        this.statusBarMessageSubscription.unsubscribe();
    }

    clickDashboardDescription() {
        // Show the popup for the Tab Description
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDescription', '@Start');

        this.dashboardDescription = this.globalVariableService.currentDashboards[0].description;
        this.showTabList = false;
        this.showDashboardDescription = true;
        this.showDashboardTabDescription = false;
    }

    clickListTabs() {
        // Show the list of Tabs
        this.globalFunctionService.printToConsole(this.constructor.name,'clickListTabs', '@Start');

        // NB: this must execute before MoveUp and MoveDown as local currentDT loaded here
        this.currentDashboardTabs = this.globalVariableService.currentDashboardTabs.slice();
        this.showTabList = true;
        this.showDashboardDescription = false;
        this.showDashboardTabDescription = false;
        console.warn('tabs',  this.currentDashboardTabs)
    }

    clickMoveTabUp(index: number) {
        // Reorder Tabs - move this one up in order
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveTabUp', '@Start');

        // Nothing to do if only One Tab
        if (this.currentDashboardTabs.length == 1) {
            return;
        };

        // Switch off T selection
        this.tabOrdering = true;

        // Current index and order
        let currentTabIndex: number = index;
        let currentTabDisplayOrder: number = this.currentDashboardTabs[index].displayOrder;

        // Get previous index and order; wrap around if necessary
        let previousTabIndex: number = this.currentDashboardTabs.length - 1;
        if (currentTabIndex > 0) {
            previousTabIndex = currentTabIndex - 1;
        };
        let previousTabDisplayOrder: number =
            this.currentDashboardTabs[previousTabIndex].displayOrder;

        // Swap DisplayOrders
        this.currentDashboardTabs[currentTabIndex].displayOrder = previousTabDisplayOrder;
        this.currentDashboardTabs[previousTabIndex].displayOrder = currentTabDisplayOrder;

        // Save to DB
        this.globalVariableService.saveResource('dashboardTabs',
            this.currentDashboardTabs[currentTabIndex]
        );
        this.globalVariableService.saveResource('dashboardTabs', 
            this.currentDashboardTabs[previousTabIndex]
        );

        // Sort
        this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
            if (obj1.displayOrder > obj2.displayOrder) {
                return 1;
            };
            if (obj1.displayOrder < obj2.displayOrder) {
                return -1;
            };
            return 0;
        });

    }

    clickMoveTabDown(index: number) {
        // Reorder Tabs - move this one down in order
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveTabDown', '@Start');

        // Nothing to do if only One Tab
        if (this.currentDashboardTabs.length == 1) {
            return;
        };

        this.tabOrdering = true;

        // Current index and order
        let currentTabIndex: number = index;
        let currentTabDisplayOrder: number = this.currentDashboardTabs[index].displayOrder;

        // Get next index and order; wrap around if necessary
        let nextTabIndex: number = 0;
        if (currentTabIndex < this.currentDashboardTabs.length - 1) {
            nextTabIndex = currentTabIndex + 1;
        };
        let nextTabDisplayOrder: number =
            this.currentDashboardTabs[nextTabIndex].displayOrder;

        // Swap DisplayOrders
        this.currentDashboardTabs[currentTabIndex].displayOrder = nextTabDisplayOrder;
        this.currentDashboardTabs[nextTabIndex].displayOrder = currentTabDisplayOrder;

        // Save to DB
        this.globalVariableService.saveResource('dashboardTabs', 
            this.currentDashboardTabs[currentTabIndex]
        );
        this.globalVariableService.saveResource('dashboardTabs', 
            this.currentDashboardTabs[nextTabIndex]
        );

        // Sort
        this.currentDashboardTabs = this.currentDashboardTabs.sort( (obj1,obj2) => {
            if (obj1.displayOrder > obj2.displayOrder) {
                return 1;
            };
            if (obj1.displayOrder < obj2.displayOrder) {
                return -1;
            };
            return 0;
        });
console.log('xx this.currentDashboardTabs', this.currentDashboardTabs)
    }

    selectDashboardTab(index: number) {
        // Show the T selected by the user
        this.globalFunctionService.printToConsole(this.constructor.name,'selectDashboardTab', '@Start');

        // Reordering busy, so dont select
        if (this.tabOrdering) {
            this.tabOrdering = false;
            return;
        };

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

    clickTabAdd() {
        // Add a new Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTabAdd', '@Start');

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

        this.newTab = true;
        this.showNewTab = true;
    }

    clickTabEdit() {
        // Edit a Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTabEdit', '@Start');

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

        this.newTab = false;
        this.showNewTab = true;
    }

    clickTabDelete() {
        // Delete a Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTabDelete', '@Start');

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

        // Cannot delete only Tab
        if (this.globalVariableService.currentDashboardTabs.length == 1) {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'Cannot delete the only Tab in Dashboard',
                    uiArea: 'StatusBar',
                    classfication: 'Warning',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
            return;

        };

        // Cannot delete if linked
        let widgetCount: number = 0;
        let firstDashboardID: number = null;
        this.globalVariableService.widgets.forEach(w => {
            if(w.hyperlinkDashboardTabID ==
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID) {
                    widgetCount = widgetCount + 1;
                    if (firstDashboardID == null) {
                        firstDashboardID = w.dashboardID;
                    };
                };
        });

        if (firstDashboardID != null) {
            let widgetString: string = widgetCount==1? ' widget ' : ' widgets'
            let dashboardIndex: number = this.globalVariableService.dashboards
                .findIndex(d => d.id == firstDashboardID);
            if (dashboardIndex != -1) {
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Tab hyperlinked in ' + widgetCount.toString() +
                            widgetString + ', first is ' + this.globalVariableService
                            .dashboards[dashboardIndex].name,
                        uiArea: 'StatusBar',
                        classfication: 'Warning',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );
                return;
            };
        }

        // Can only delete Tab if it has no W on it
        let nrWperT: number = 0;
        nrWperT = this.globalVariableService.widgets.filter(w => {
            if (w.dashboardID == this.globalVariableService.currentDashboardInfo.value.
                currentDashboardID
                &&
                w.dashboardTabIDs.indexOf(this.globalVariableService.currentDashboardInfo.
                    value.currentDashboardTabID) >= 0) {
                    return w;
                };
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

        this.globalVariableService.deleteResource('dashboardTabs',
           this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID
        ).then(res => {

            this.globalVariableService.refreshCurrentDashboard(
                'statusbar-clickTabDelete',
                this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                0,
                'Previous'
            );
        })

        // Close popup form
        this.showDashboardTabDescription = false;
    }

    clickTabDuplicate() {
        // Duplicate a Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTabDuplicate', '@Start');

        console.warn('xx tab index', this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex, this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID, this.globalVariableService.currentWidgets)
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex >= 0) {

            let duplicateTab: DashboardTab =JSON.parse(JSON.stringify(
                this.globalVariableService.currentDashboardTabs[
                this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex
            ]));

            // Reset some info.  For now, the Tab is added at the end of the list
            duplicateTab.id = null;
            duplicateTab.name = duplicateTab.name + ' COPY';
            let maxDisplayOrder: number = 1;
            for (var i = 0; i < this.globalVariableService.currentDashboardTabs.length; i++) {
                if (this.globalVariableService.currentDashboardTabs[i].displayOrder > maxDisplayOrder) {
                    maxDisplayOrder = this.globalVariableService.currentDashboardTabs[i].displayOrder;
                };
            };
            maxDisplayOrder = maxDisplayOrder + 1;
            duplicateTab.displayOrder = maxDisplayOrder;

            // Add to DB
            this.globalVariableService.addDashboardTab(duplicateTab).then(res => {
                let newTabID: number = res.id;

                // Duplicate the Widgets
                this.globalVariableService.currentWidgets.forEach(w => {
                    console.warn('xx ids', w.dashboardTabID, this.globalVariableService
                    .currentDashboardInfo.value.currentDashboardID)
                    if (w.dashboardTabID == this.globalVariableService
                        .currentDashboardInfo.value.currentDashboardTabID) {

                        // Create Deep copy with necessary info
                        // let clipboardWidget = Object.assign({}, w);
                        let clipboardWidget = JSON.parse(JSON.stringify(w));
                        clipboardWidget.id = null
                        clipboardWidget.dashboardTabID = newTabID;
                        clipboardWidget.dashboardTabIDs = [];
                        clipboardWidget.dashboardTabIDs.push(newTabID);
                        clipboardWidget.isSelected = false;

                        // Add to DB
                        this.globalVariableService.addWidget(clipboardWidget).then(res => {
                            clipboardWidget.id = res.id;

                            this.globalVariableService.changedWidget.next(clipboardWidget);
                        });

                    };
                })
                this.globalVariableService.refreshCurrentDashboard(
                    'statusbar-clickTabDelete',
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    0,
                    'Last'
                );
            })
        } else {
            this.globalVariableService.showStatusBarMessage(
                {
                    message: 'Erro: Tab does not exist in TabList',
                    uiArea: 'StatusBar',
                    classfication: 'Error',
                    timeout: 3000,
                    defaultMessage: ''
                }
            );
        }

         // Close popup form
         this.showDashboardTabDescription = false;
     }

    handleCloseDashboardTab(changedTab: DashboardTab) {
        // Handle Close Tab form
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        if (!this.newTab  &&  changedTab != null) {
            this.currentTabName = changedTab.name;
            this.dashboardTabDescription = changedTab.description;
            this.currentTabBackgroundColor = changedTab.backgroundColor;
            this.currentTabColor = changedTab.color;
        };

        // Close forms
        this.showNewTab = false;
        this.showDashboardTabDescription = false;
    }

    clickToggleDontDisturb() {
        //Toggle the DontDisturb status
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleDontDisturb', '@Start');

        this.dontDisturb = !this.globalVariableService.dontDisturb.value;
        this.globalVariableService.dontDisturb.next(
            !this.globalVariableService.dontDisturb.value);
    }

    clickToggleEditMode() {
        //Toggle EditMode
        this.globalFunctionService.printToConsole(this.constructor.name,'clickToggleEditMode', '@Start');

        // TODO - this must do ALL the things done in app.clickMenuEditMode, OR delete
        // this.globalVariableService.editMode.next(!this.globalVariableService.editMode.value);
    }

}


