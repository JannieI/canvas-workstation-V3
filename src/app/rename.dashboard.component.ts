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
    selector: 'rename-dashboard',
    templateUrl: './rename.dashboard.component.html',
    styleUrls: ['./rename.dashboard.component.css']
})
export class RenameDashboardComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formRenameDashboardClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  

    ngOnInit() {

    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formRenameDashboardClosed.emit(action);
    }
}
