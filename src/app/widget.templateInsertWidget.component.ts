/*
 * Save the selected Widget as a Widget Template, for later use
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';
import { WidgetStoredTemplate }             from './models';


@Component({
    selector: 'widget-templateInsertWidget',
    templateUrl: './widget.templateInsertWidget.component.html',
    styleUrls: ['./widget.templateInsertWidget.component.css']
})
export class WidgetTemplateInsertWidgetComponent implements OnInit {

    @Output() formWidgetTemplateInsertWidgetClosed: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    sortOrder: number = 1;
    widgetStoredTemplates: WidgetStoredTemplate[] = [];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load Stored Widget Templates, adding DS Name for user
        this.globalVariableService.getWidgetStoredTemplates()
            .then(res => {
                this.widgetStoredTemplates = res.slice();

                this.widgetStoredTemplates.forEach(wst => {
                    this.globalVariableService.widgets.forEach(w => {
                        if (w.id == wst.widgetID) {
                            this.globalVariableService.datasources.forEach(ds => {
                                if (w.datasourceID == ds.id) {
                                    wst.datasourceName = ds.name;
                                };
                            });
                        };
                    })
                });
            }
        );        
    }

    dblClickRow() {
        // Show graph for row that the user clicked on
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickRow', '@Start');

    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTemplateInsertWidgetClosed.emit(action);
    }

    clickInsertWidget() {
        // Insert the Widget for the selected Widget Template record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickInsertWidget', '@Start');


    }
}
