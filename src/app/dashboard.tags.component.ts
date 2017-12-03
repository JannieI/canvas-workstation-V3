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

@Component({
    selector: 'dashboard-tags',
    templateUrl: './dashboard.tags.component.html',
    styleUrls: ['./dashboard.tags.component.css']
})
export class DashboardTagsComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardTagsClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: dashboard[];
    dashboardTags: dashboardTag[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formDashboardTagsClosed.emit(action);
    }

    dragstart_handler(ev) {
        console.log("dragStart", ev, ev.srcElement.innerText);
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
        console.log('drag_start')
    }

    dragend_handler(ev) {
        console.log('dragend_handler', ev.dataTransfer.dropEffect)
    }

    drop_pivot(ev) {
        ev.preventDefault();

        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log('drop_handler dropped !!')
    }

    dragover_pivot(ev) {
        console.log('dragover_handler')
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move"
      }

}
