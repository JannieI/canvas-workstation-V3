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

@Component({
    selector: 'dashboard-open',
    templateUrl: './dashboard.open.component.html',
    styleUrls: ['./dashboard.open.component.css']
})
export class DashboardOpenComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formDashboardOpenClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  

    ngOnInit() {
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formDashboardOpenClosed.emit(action);
    }
}
