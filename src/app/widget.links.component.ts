/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Dashboard }                  from './models';

@Component({
    selector: 'widget-links',
    templateUrl: './widget.links.component.html',
    styleUrls: ['./widget.links.component.css']
})
export class WidgetLinksComponent implements OnInit {

    @Output() formWidgetLinksClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    isFirstTimeWidgetLinked: boolean;
    showAdvancedFilters: boolean = false;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.globalVariableService.isFirstTimeWidgetLinked.subscribe(
            i => this.isFirstTimeWidgetLinked = i
        )
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formWidgetLinksClosed.emit(action);
    }

    clickGotIt() {
        // Until var for help boxie
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGotIt', '@Start');

        this.globalVariableService.isFirstTimeWidgetLinked.next(false);

    }

    clickSelectRow() {
        // Select a row in D grid
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectRow', '@Start');

    }

    clickShowAdvancedFilters() {
        // Show Advanced Filters - TODO: add to html, or delete here
        this.globalFunctionService.printToConsole(this.constructor.name,'clickShowAdvancedFilters', '@Start');

        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

}
