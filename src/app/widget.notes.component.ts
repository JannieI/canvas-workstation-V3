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
import { widgetNote }                 from './models';

@Component({
    selector: 'widget-notes',
    templateUrl: './widget.notes.component.html',
    styleUrls: ['./widget.notes.component.css']
})
export class WidgetNotesComponent implements OnInit {

    @Input() currentWidgetSpec: any;
    @Output() formWidgetNotesClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;  
    dashboards: dashboard[];
    widgetNotes: widgetNote[];

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        this.dashboards = this.globalVariableService.dashboards;
        this.widgetNotes = this.globalVariableService.widgetNotes;
    }

    clickClose(action: string) {
        console.log('clickClose')
        
		this.formWidgetNotesClosed.emit(action);
    }
}
