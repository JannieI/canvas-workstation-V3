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
import { Subscription }               from 'rxjs/Subscription';


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
    dontDisturb: boolean = false;
    editMode: boolean = false;
    editModeSubscription: Subscription;
    loggedIntoServerText: string;
    menuActionResize: boolean;
    newTab: boolean = true;                     // True if Add, False if Edit existing
    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showNewTab: boolean = false;
    showTabList: boolean = false;
    state: string = '';
    statusBarMessageText: string = '';
    statusBarMessageColour: string = 'rgb(197, 194, 194)';
    tabOrdering: boolean = false;
    widgetGroupText: string;


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
        this.globalVariableService.dontDisturb.subscribe(ddb => this.dontDisturb = ddb)

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

        // Change name if changed via rename
        this.globalVariableService.currentDashboardName.subscribe(
            i => {
                if (i != '') {
                    this.currentDashboardName = i;
                }
            }
        )
        // Close any open popups when a new D is opened
        this.globalVariableService.currentDashboardInfo.subscribe(
            i => {
                this.showDashboardDescription = false;
                this.showDashboardTabDescription = false;
                this.showNewTab = false;
                this.showTabList = false;
                if (i != null) {
                    this.state = i.currentDashboardState;
                };

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
        this.editModeSubscription.unsubscribe();
        console.warn('xx unsubsribed')
        // this.globalVariableService.widgetGroup.unsubscribe();
        // this.globalVariableService.loggedIntoServer.unsubscribe();
        // this.globalVariableService.templateInUse.unsubscribe();
        // this.globalVariableService.currentDashboardInfo.unsubscribe();
        // this.globalVariableService.statusBarMessage.unsubscribe();
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

        this.currentDashboardTabs = this.globalVariableService.currentDashboardTabs.slice();
        this.showTabList = true;
        this.showDashboardDescription = false;
        this.showDashboardTabDescription = false;
        console.warn('tabs',  this.currentDashboardTabs)
    }

    clickMoveTabUp(index: number) {
        // Reorder Tabs - move this one up in order
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveTabUp', '@Start');

        // Switch off T selection
        this.tabOrdering = true;

        // Current order
        let currentTabDisplayOrder: number = this.currentDashboardTabs[index].displayOrder;
        console.warn('xx Before currentTabDisplayOrder',  currentTabDisplayOrder)

        // If first, move to end.  Else, Swap with prior one
        this.currentDashboardTabs.forEach(t => {
            if (currentTabDisplayOrder == 1) {
                if (t.displayOrder == 1) {
                    t.displayOrder = this.currentDashboardTabs.length;
                    console.warn('xx 1 after t.displayOrder',  t.displayOrder)
                } else {
                    t.displayOrder = t.displayOrder - 1;
                    console.warn('xx 2 after t.displayOrder',  t.displayOrder)
                };
            } else {
                if (t.displayOrder == (currentTabDisplayOrder - 1) ) {
                    t.displayOrder = t. displayOrder + 1;
                } else {
                    if (t.displayOrder == currentTabDisplayOrder) {
                        t.displayOrder = t. displayOrder - 1;
                    };
                };
            };

            // Save to DB
            this.globalVariableService.saveDashboardTab(t);
        });

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

        this.tabOrdering = true;

        // Current order
        let currentTabDisplayOrder: number = this.currentDashboardTabs[index].displayOrder;
        console.warn('xx Before currentTabDisplayOrder',  currentTabDisplayOrder)

        // If first, move to end.  Else, Swap with prior one
        this.currentDashboardTabs.forEach(t => {
            if (currentTabDisplayOrder == this.currentDashboardTabs.length) {
                if (t.displayOrder == this.currentDashboardTabs.length) {
                    t.displayOrder = 1;
                    console.warn('xx 1 after t.displayOrder',  t.displayOrder)
                } else {
                    t.displayOrder = t.displayOrder + 1;
                    console.warn('xx 2 after t.displayOrder',  t.displayOrder)
                };
            } else {
                if (t.displayOrder == (currentTabDisplayOrder + 1) ) {
                    t.displayOrder = t. displayOrder - 1;
                } else {
                    if (t.displayOrder == currentTabDisplayOrder) {
                        t.displayOrder = t. displayOrder + 1;
                    };
                };
            };

            // Save to DB
            this.globalVariableService.saveDashboardTab(t);
        });

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

        this.globalVariableService.deleteDashboardTab(
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
        // Delete a Tab
        this.globalFunctionService.printToConsole(this.constructor.name,'clickTabDuplicate', '@Start');

        console.warn('xx tab index', this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex)
        if (this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex >= 0) {

            let duplicateTab: DashboardTab = Object.assign({},this.globalVariableService
                .currentDashboardTabs[
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabIndex
            ]);

            // Reset some info
            duplicateTab.id = null;
            duplicateTab.name = duplicateTab.name + ' COPY';

            // Add to DB
            this.globalVariableService.addDashboardTab(duplicateTab).then(res => {
                
                // Duplicate the Widgets
                this.globalVariableService.currentWidgets.forEach(w => {
                    if (w.dashboardTabID == this.globalVariableService
                        .currentDashboardInfo.value.currentDashboardID) {
console.warn('xx copy w', w.shapeText)
                        let clipboardWidget = Object.assign({}, w);
                        clipboardWidget.dashboardTabID = res.dashboardTabID;
                
                        this.globalVariableService.duplicateSingleWidget(clipboardWidget);
                
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

}


