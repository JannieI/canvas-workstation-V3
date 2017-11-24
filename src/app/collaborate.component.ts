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
    selector: 'collaborate',
    templateUrl: './collaborate.component.html',
    styleUrls: ['./collaborate.component.css']
})
export class CollaborateComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formCollaborateClosed: EventEmitter<string> = new EventEmitter();

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

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formCollaborateClosed.emit(action);
    }
}
