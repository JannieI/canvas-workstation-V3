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
import { CanvasShape }                from './models'
import { CanvasSlicer }               from './models'
import { CanvasWidget }               from './models'
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
    @Input() currentDashboardTabIndex: number;
    @Input() currentTabName: string;
    @Input() statusBarRunning: string;
    @Input() statusBarCancelRefresh: string;
    @Input() statusBarMessages: string;
    @Input() loggedIntoServerText: string;
    @Input() templateInUse: string;

    showDashboardDescription: boolean = false;
    showDashboardTabDescription: boolean = false;
    showNewTab: boolean = false;
    showTabList: boolean = false;
    
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
    }

    // ngAfterViewChecked(){
    //     // For Testing
    //     console.log('Explore ngAfterViewChecked W, Sl', this.currentWidgets, 
    //         this.widgetContainters.toArray())
    // }

    ngAfterViewInit() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
    }

    clickDashboardDescription() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDashboardDescription', '@Start');

        this.showTabList = false;
        this.showDashboardDescription = true;
        this.showDashboardTabDescription = false;  
    }

    clickListTabs() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickListTabs', '@Start');

        this.showTabList = true;
        this.showDashboardDescription = false;
        this.showDashboardTabDescription = false;
    }

    clickShowFirstTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowFirstTab', '@Start');

        this.currentTabName = this.globalVariableService.currentDashboardTabs[0].name;
    }

    
    clickShowPreviousTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowPreviousTab', '@Start');

        let x: number = 0;
        for (var i = 0; i < this.globalVariableService.currentDashboardTabs.length; i++) {
            if (this.currentDashboardTabIndex == 
                this.globalVariableService.currentDashboardTabID) { 
                    x = i - 1;
            };
        }
        if (x < 0) { x = this.globalVariableService.currentDashboardTabs.length - 1 };
        this.currentTabName = this.globalVariableService.currentDashboardTabs[x].name;
        this.globalVariableService.currentDashboardTabID = 
            this.globalVariableService.currentDashboardTabs[x].id;
        this.globalVariableService.refreshDashboard.next(true);
    }

    clickShowTabDescription() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowTabDescription', '@Start');

        this.showTabList = false;
        this.showDashboardTabDescription = true;
        this.showDashboardDescription = false;
        
    }

    clickShowNextTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowNextTab', '@Start');

        let x: number = 0;
        for (var i = 0; i < this.globalVariableService.currentDashboardTabs.length; i++) {
            if (this.currentDashboardTabIndex == 
                this.globalVariableService.currentDashboardTabID) { 
                    x = i + 1;
            };
        }
        if (x >= this.globalVariableService.currentDashboardTabs.length) {x = 0 };
        this.currentTabName = this.globalVariableService.currentDashboardTabs[x].name;
        this.globalVariableService.currentDashboardTabID = 
            this.globalVariableService.currentDashboardTabs[x].id;
        this.globalVariableService.refreshDashboard.next(true);
    }

    clickShowLastTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowLastTab', '@Start');

        console.log('Explore clickShowLastTab',this.currentTabName)
        this.currentTabName = this.globalVariableService.currentDashboardTabs[
            this.globalVariableService.currentDashboardTabs.length - 1].name;        
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

    handleCloseDashboardTab() {
        // 
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCloseDashboardTab', '@Start');

        this.showNewTab = false;
    }
}


