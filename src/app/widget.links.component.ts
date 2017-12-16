/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { dashboard }                  from './models';
 
@Component({
    selector: 'widget-links',
    templateUrl: './widget.links.component.html',
    styleUrls: ['./widget.links.component.css']
})
export class WidgetLinksComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formWidgetLinksClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: dashboard[];
    isFirstTimeDashboardOpen: boolean;
    showAdvancedFilters: boolean = false;
    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeDashboard.subscribe(
            i => this.isFirstTimeDashboardOpen = i
        )
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formWidgetLinksClosed.emit(action);
    }

    clickGotIt() {
        this.globalVariableService.isFirstTimeDashboard.next(false);
    }

    clickShowAdvancedFilters() {
        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

}
