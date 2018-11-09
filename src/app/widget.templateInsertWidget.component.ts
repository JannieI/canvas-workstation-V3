/*
 * Save the selected Widget as a Widget Template, for later use
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Widget }                     from './models';
import { WidgetGraph }                from './models';
import { WidgetStoredTemplate }       from './models';

// Functions
import { compile }                    from 'vega-lite';
import { parse }                      from 'vega';
import { View }                       from 'vega';

@Component({
    selector: 'widget-templateInsertWidget',
    templateUrl: './widget.templateInsertWidget.component.html',
    styleUrls: ['./widget.templateInsertWidget.component.css']
})
export class WidgetTemplateInsertWidgetComponent implements OnInit {

    @Output() formWidgetTemplateInsertWidgetClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('domWidget', {read: ElementRef}) domWidget: ElementRef;  //Vega graph

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
    graphVisualGrammar: string = 'Vega-Lite';
    localWidget: Widget;
    selectedRow: number = 0;
    selectedWidgetID: number;
    sortOrder: number = 1;
    specification: any;              // Vega-Lite, Vega, or other grammar
    widgetGraphs: WidgetGraph[] =[];
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
                this.globalVariableService.getWidgetGraphs().then(graphs => {
                    this.widgetGraphs = graphs;
                });

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
                if (this.widgetStoredTemplates.length > 0) {
                    this.clickRow(0, this.widgetGraphs[0].id);
                };
            }
        );        
    }

    clickRow(index: number, widgetID: number) {
        // Show graph for row that the user clicked on
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset
        this.errorMessage = '';
        this.selectedRow = index;

        // Create new W
        this.selectedWidgetID = widgetID;
        let widgetIndex: number = this.globalVariableService.widgets.findIndex(w =>
            w.id == widgetID
        );

        if (widgetIndex < 0) {
            this.errorMessage = 'Error: selected Widget does not exist any more';
            return;
        };
        this.localWidget = JSON.parse(JSON.stringify(
            this.globalVariableService.widgets[widgetIndex])
        );
        this.localWidget.id = null;
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
    
        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(
            this.localWidget.datasourceID).then(res => {

            // Create Spec
            this.specification = this.globalVariableService.createVegaLiteSpec(
                this.localWidget,
                200,
                300
            );

            console.warn('xx @END of ShowGraph specification', this.specification);

            // Get the widgetGraph
            this.graphVisualGrammar = 'Vega-Lite';
            if (this.localWidget.graphLayers != null) {
                let graphID: number = this.localWidget.graphLayers[0].graphMarkID;
                let widgetGraphIndex: number = this.widgetGraphs.findIndex(
                    wg => wg.id == graphID
                );
                if (widgetGraphIndex < 0) {
                    this.errorMessage = 'Graph type id = ' + graphID + ' does not exist in the DB';
                } else {
                    this.graphVisualGrammar = this.widgetGraphs[widgetGraphIndex].visualGrammar;
                };
            };

            // Render graph for Vega-Lite
            if (this.graphVisualGrammar == 'Vega-Lite') {
                if (this.specification != undefined) {
                    let vegaSpecification = compile(this.specification).spec;
                    let view = new View(parse(vegaSpecification));

                    view.renderer('svg')
                        .initialize(this.domWidget.nativeElement)
                        .width(372)
                        .hover()
                        .run()
                        .finalize();
                };
            };
        });

    }

    clickAdd() {
        // Add the selected Widget to the current Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.errorMessage = '';

        // Validate
        if (this.selectedWidgetID == null) {
            this.errorMessage = 'Select a Widget to add';
            return;
        };

        // Create new W
        let widgetIndex: number = this.globalVariableService.widgets.findIndex(w =>
            w.id == this.selectedWidgetID
        );

        if (widgetIndex < 0) {
            this.errorMessage = 'Error: selected Widget does not exist any more';
            return;
        };
        this.localWidget = JSON.parse(JSON.stringify(
            this.globalVariableService.widgets[widgetIndex])
        );
        this.localWidget.id = null;
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;
    
        // Add DS to current DS (no action if already there)
        this.globalVariableService.addCurrentDatasource(
            this.localWidget.datasourceID).then(res => {

            // Update local and global vars
            this.localWidget.dashboardTabIDs.push(this.globalVariableService.
                currentDashboardInfo.value.currentDashboardTabID);

            this.globalVariableService.addWidget(this.localWidget).then(addedWidget => {
                this.localWidget.id = addedWidget.id;

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
                this.formWidgetTemplateInsertWidgetClosed.emit(addedWidget);

            });

        });

    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTemplateInsertWidgetClosed.emit(null);
    }

    clickInsertWidget() {
        // Insert the Widget for the selected Widget Template record
        this.globalFunctionService.printToConsole(this.constructor.name,'clickInsertWidget', '@Start');


    }
}
