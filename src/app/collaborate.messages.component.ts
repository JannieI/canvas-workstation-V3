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
import { Dashboard }                  from './models';
import { CanvasMessage }              from './models';

@Component({
    selector: 'collaborate-messages',
    templateUrl: './collaborate.messages.component.html',
    styleUrls: ['./collaborate.messages.component.css']
})
export class CollaborateMessagesComponent implements OnInit {

    @Output() formCollaborateMessagesClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    canvasMessages: CanvasMessage[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.canvasMessages = this.globalVariableService.canvasMessages;
    }

    clickClose(action: string) {
        console.log('clickClose')

		this.formCollaborateMessagesClosed.emit(action);
    }
}
