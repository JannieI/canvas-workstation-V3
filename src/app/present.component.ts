/*
 * Present page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

@Component({
    templateUrl: './present.component.html',
    styleUrls: ['./present.component.css']
})

export class PresentComponent implements OnInit {

    showTypeDashboard: boolean = false;  
    showModalFileselector: boolean = false;
    showDashboard: boolean = false;

    ngOnInit() {

    }

    clickOpenDashboard() {
      this.showModalFileselector = !this.showModalFileselector;
      this.showTypeDashboard = true;
    }

    clickArrow() {
        this.showDashboard = !this.showDashboard;
    }
}
