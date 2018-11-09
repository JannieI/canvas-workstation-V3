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

    errorMessage: string = '';
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

    dblClickRow(widgetID: number) {
        // Show graph for row that the user clicked on
        this.globalFunctionService.printToConsole(this.constructor.name,'dblClickRow', '@Start');

        this.errorMessage = '';

        // Create new W
        let widgetIndex: number = this.globalVariableService.widgets.findIndex(w =>
            w.id == widgetID
        );

        if (widgetIndex < 0) {
            this.errorMessage = 'Error: selected Widget does not exist any more';
            return;
        };
        this.localWidget = JSON.parse(JSON.stringify(this.globalVariableService.currentWidgets[6]));
        this.localWidget.id = null;
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
    
        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(
            this.localWidget.datasourceID).then(res => {

            // Update local and global vars
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID);

            this.globalVariableService.addWidget(this.localWidget).then(res => {
                this.localWidget.id = res.id;

                // Action
                // TODO - cater for errors + make more generic
                let actID: number = this.globalVariableService.actionUpsert(
                    null,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                    this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                    this.localWidget.id,
                    'Widget',
                    'Edit',
                    'Update Title',
                    'W Title clickSave',
                    null,
                    null,
                    null,
                    this.localWidget,
                    false               // Dont log to DB yet
                );

                // Tell user
                this.globalVariableService.showStatusBarMessage(
                    {
                        message: 'Graph Added',
                        uiArea: 'StatusBar',
                        classfication: 'Info',
                        timeout: 3000,
                        defaultMessage: ''
                    }
                );

                // Return to main menu
                this.formWidgetEditorClosed.emit(this.localWidget);

            });

        });

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
