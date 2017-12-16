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
import { dashboardTag }               from './models';
import { buttonBarAvailable}          from './models'
import { buttonBarSelected }          from './models';

@Component({
    selector: 'widget-buttonbar',
    templateUrl: './user.widget.buttonbar.component.html',
    styleUrls: ['./user.widget.buttonbar.component.css']
})
export class UserWidgetButtonBarComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: dashboard[];
    dashboardTags: dashboardTag[];
    widgetButtonsAvailable: buttonBarAvailable[];
    widgetButtonsSelected: buttonBarSelected[];
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.widgetButtonsAvailable = this. globalVariableService.widgetButtonsAvailable;
        this.widgetButtonsSelected = this. globalVariableService.widgetButtonsSelected;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formUserWidgetButtonBarClosed.emit(action);
    }

}
