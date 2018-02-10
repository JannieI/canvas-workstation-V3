/*
 * StatusBar
 */

// From Angular
import { AfterViewInit }              from '@angular/core';
import { Component }                  from '@angular/core';
import { Directive }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { HostBinding }                from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { QueryList }                  from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Renderer2 }                  from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';

import { Observable} from 'rxjs'
// Our Services
import { GlobalVariableService }      from './global-variable.service';
import { GlobalFunctionService }      from './global-function.service';

// Our Models
import { Dashboard }                  from './models'
import { DashboardTab }               from './models'
import { Datasource }                 from './models'

// Vega, Vega-Lite
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';
import * as dl from 'datalib';
import { load } from 'datalib';
import { BoxPlotStyle } from 'vega-lite/build/src/compositemark/boxplot';

// Own Services

// Own Components

// Constants
const vlTemplate: dl.spec.TopLevelExtendedSpec =
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",

    // Properties for top-level specification (e.g., standalone single view specifications)
    "background": "",
    "padding": "",
    // "autosize": "",          NB - add these only if needed, blank causes no graph display
    // "config": "",            NB - add these only if needed, blank causes no graph display

    // Properties for any specifications
    "title":
        {
            "text": "",
            "anchor": "",
            "offset": "",
            "orient": "",
            "style": ""
        },
    "name": "",
    "transform": "",

    "description": "",
    "data": "",
    "mark":
        {
            "type": "",  //bar circle square tick line area point rule text
            "style": "",
            "clip": ""
        },
    "encoding":
        {
            "x":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "ordinal",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                    {
                        "title": ""
                    },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                },
            "y":
                {
                    "aggregate": "",
                    "field": "",
                    "type": "quantitative",
                    "bin": "",
                    "timeUnit": "",
                    "axis":
                        {
                            "title": ""
                        },
                    "scale": "",
                    "legend": "",
                    "format": "",
                    "stack": "",
                    "sort": "",
                    "condition": ""
                    }
        }
};

@Component({
    selector: 'status-bar',
    styleUrls: ['./statusbar.component.css'],
    templateUrl: './statusbar.component.html'
})

export class StatusbarComponent {

    @Input() editMode: boolean;
    @Input() currentDashboardName: string;
    @Input() currentTabName: string;
    @Input() statusBarRunning: string;
    @Input() statusBarCancelRefresh: string;
    @Input() loggedIntoServerText: string;
    @Input() templateInUse: string;

    currentDashboardTabs: DashboardTab[];
    dashboardDescription: string;
    dashboardTabDescription: string;
    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showNewTab: boolean = false;
    showTabList: boolean = false;
    statusBarMessageText: string = '';
    statusBarMessageColour: string = 'rgb(197, 194, 194)';
    menuActionResize: boolean;

    // currentTabName: string;


    constructor(
        // private globalFunctionService: GlobalFunctionService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer: Renderer,
        private renderer2: Renderer2,
    ) {}

    ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Close any open popus when a new D is opened
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

    // ngAfterViewChecked(){
    //     // For Testing
    //     console.log('ngAfterViewChecked W, Sl', this.currentWidgets,
    //         this.widgetContainters.toArray())
    // }

    ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
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

        console.log('xx index', index, this.currentDashboardTabs)
        this.globalVariableService.refreshCurrentDashboard(
            'statusbar-clickShowNextTab', 
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
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddTab', '@Start');

        this.showNewTab = true;
    }

    clickStatusTemplate() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickStatusTemplate', '@Start');

        if (this.templateInUse == 'Tmpl Used') {
            this.templateInUse = 'Tmpl Disabled ';
        } else {
            this.templateInUse = 'Tmpl Used';
        }
    }

    handleCloseDashboardTab(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        this.showNewTab = false;
    }
}


