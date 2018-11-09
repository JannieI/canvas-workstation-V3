/*
 * Save the selected Widget as a Widget Template, for later use
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Input }                      from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';
import { WidgetStoredTemplate }             from './models';

// Other
import { Subscription }               from 'rxjs';

@Component({
    selector: 'widget-templateInsertWidget',
    templateUrl: './widget.templateInsertWidget.component.html',
    styleUrls: ['./widget.templateInsertWidget.component.css']
})
export class WidgetTemplateInsertWidgetComponent implements OnInit {

    @Input() selectedWidget: Widget;
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
        if (
            (event.code == 'Enter'  ||  event.code == 'NumpadEnter')
            &&
            (!event.ctrlKey)
            &&
            (!event.shiftKey)
           ) {
            this.clickSave();
            return;
        };

    }

    deleteSnapshots: boolean = true;
    isFirstTimeDashboardSave: boolean;
    // dashboards: Dashboard[];
    dashboardsSubscription: Subscription;
    widgetStoredTemplates: WidgetStoredTemplate[] = [];
    widgetStoreTemplateDescription: string = '';
    widgetStoreTemplateName: string = '';

    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // this.dashboards = this.globalVariableService.dashboards.slice();
        this.dashboardsSubscription = this.globalVariableService.isFirstTimeDashboardSave.subscribe(
            i => this.isFirstTimeDashboardSave = i
        )

        this.globalVariableService.getWidgetStoredTemplates()
            .then(res => {
                this.widgetStoredTemplates = res.slice();

                this.widgetStoredTemplates.forEach(wst => {
                    this.globalVariableService.widgets.forEach(w => {
                        if (w.id == this.selectedWidget.id) {
                            this.widgetStoreTemplateName = wst.name;
                            this.widgetStoreTemplateDescription = wst.description;
                        };
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

    ngOnDestroy() {
        // Cleanup just before Angular destroys the directive/component.
        // Unsubscribe Observables and detach event handlers to avoid memory leaks.
        // Called just before Angular destroys the directive/component.
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnDestroy', '@Start');

        this.dashboardsSubscription.unsubscribe();
    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTemplateInsertWidgetClosed.emit(action);
    }

    clickSave() {
        // Save the D (replace the original as Completed and delete the Draft)
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.globalVariableService.saveDraftDashboard(this.deleteSnapshots).then(res => {
            this.globalVariableService.refreshCurrentDashboard(
                'discardDashboard-clickDiscard', res, -1, ''
            );
            this.globalVariableService.editMode.next(false);
            this.formWidgetTemplateInsertWidgetClosed.emit('Saved');
        });

    }
}
