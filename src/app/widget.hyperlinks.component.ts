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
import { DashboardTab }               from './models';
import { Widget }                     from './models';

@Component({
    selector: 'widget-hyperlinks',
    templateUrl: './widget.hyperlinks.component.html',
    styleUrls: ['./widget.hyperlinks.component.css']
})
export class WidgetLinksComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetHyperlinksClosed: EventEmitter<Widget> = new EventEmitter();

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

    dashboardIsLinked: boolean = false;
    dashboards: Dashboard[];
    dashboardTabs: DashboardTab[];
    linkedDashboard: string;
    linkedTab: string;
    selectedDashboardTabs: DashboardTab[] = [];
    selectedDashboardID: number = 0;
    selectedDashboardIndex: number = 0;
    selectedDashboardName: string;
    selectedTabID: number = 0;
    selectedTabIndex: number = 0;
    selectedTabName: string;
    showAdvancedFilters: boolean = false;
    showTypeDashboard: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards.slice();
        this.dashboardTabs = this.globalVariableService.dashboardTabs.slice();

        // Show linking
        if (this.selectedWidget.hyperlinkDashboardID != null
            &&
            this.selectedWidget.hyperlinkDashboardTabID != null) {

            this.showLink(
                this.selectedWidget.hyperlinkDashboardID,
                this.selectedWidget.hyperlinkDashboardTabID
            );


        } else {
            this.dashboardIsLinked = false;
        };

        // Select the topmost D
        if (this.dashboards.length > 0) {
            this.clickSelectDashboard(0, this.dashboards[0].id, this.dashboards[0].name)
        };

    }

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formWidgetHyperlinksClosed.emit(this.selectedWidget);
    }

    clickUnlink() {
        // Unlink the linked D and T
        this.globalFunctionService.printToConsole(this.constructor.name,'clickUnlink', '@Start');

        // Reset and hide area
        this.selectedWidget.hyperlinkDashboardID = null;
        this.selectedWidget.hyperlinkDashboardTabID = null;
        this.dashboardIsLinked = false;

        // Save to DB
        this.globalVariableService.saveWidget(this.selectedWidget);

    }

    clickLink() {
        // Link the selected D and T
        this.globalFunctionService.printToConsole(this.constructor.name,'clickLink', '@Start');

        // Update local and linked info
        this.selectedWidget.hyperlinkDashboardID = this.selectedDashboardID;
        this.selectedWidget.hyperlinkDashboardTabID = this.selectedTabID;
        if (this.selectedWidget.hyperlinkDashboardID != null
            &&
            this.selectedWidget.hyperlinkDashboardTabID != null) {

            this.showLink(
                this.selectedWidget.hyperlinkDashboardID,
                this.selectedWidget.hyperlinkDashboardTabID
            );
        };

        // Save to DB
        this.globalVariableService.saveWidget(this.selectedWidget);

        // Show the linked info
        this.dashboardIsLinked = true;

    }

    clickSelectDashboard(
        index: number,
        id: number,
        selectedDashboardName: string
        ) {
        // Select a row in D grid
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectDashboard', '@Start');

        // Set D properties
        this.selectedDashboardName = selectedDashboardName;
        this.selectedDashboardIndex = index;
        this.selectedDashboardID = id;

        // Filter its Tabs
        this.selectedDashboardTabs = this.dashboardTabs.filter(t => t.dashboardID == id);

        // Select topmost Tab
        if (this.dashboardTabs.length > 0) {
            this.clickSelectTab(0, this.selectedDashboardTabs[0].id, this.selectedDashboardTabs[0].name)
        };
    }

    clickSelectTab(
        index: number,
        id: number,
        selectedTabName: string
        ) {
        // Select a row in T grid
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectTab', '@Start');

        // Set T properties
        this.selectedTabName = selectedTabName;
        this.selectedTabID = id;
        this.selectedTabIndex = index;

    }

    showLink(linkedDashboardID: number, selectedTabID: number) {
        // Show the D and T that is currently linked
        this.globalFunctionService.printToConsole(this.constructor.name,'showLink', '@Start');

        let tempD: Dashboard[] = this.dashboards.filter(d =>
            d.id == linkedDashboardID
        );
        if (tempD.length > 0) {
            this.linkedDashboard = tempD[0].name;

            if (this.selectedWidget.hyperlinkDashboardTabID != null) {
                let tempT: DashboardTab[] = this.dashboardTabs.filter(t =>
                    t.id == selectedTabID
                );
                if (tempT.length > 0) {
                    this.linkedTab = tempT[0].name;
                    this.dashboardIsLinked = true;
                };
            };
        };
    }

}
