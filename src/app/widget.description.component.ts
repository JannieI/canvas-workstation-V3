/*
 * Shows form to edit Widget Description
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';

@Component({
    selector: 'widget-description',
    templateUrl: './widget.description.component.html',
    styleUrls: ['./widget.description.component.css']
})
export class WidgetDescriptionComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetDescriptionClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    errorMessage = '';
    hasTemplate: boolean = false;
    linkedDashboardID: string;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('widgetStoredTemplates')
            .then(wst => {
                wst = wst.filter(w => w.widgetID === this.selectedWidget.id);
                if (wst != null  &&  wst.length > 0) {
                    this.hasTemplate = true;
                };
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.description reading widgetStoredTemplates: ' + err);
            });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetDescriptionClosed.emit(action);
    }

}
