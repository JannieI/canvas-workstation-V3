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
    @ViewChild('widgetDOM', {read: ElementRef}) widgetDOM: ElementRef;  //Vega graph

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

    errorMessage: string = '';
    // graphVisualGrammar: string = 'Vega-Lite';
    localWidget: Widget;
    selectedRow: number = 0;
    selectedWidgetID: number;
    sortOrderName: number = 1;
    specification: any;              // Vega-Lite, Vega, or other grammar
    widgetGraphs: WidgetGraph[] =[];
    widgetStoredTemplates: WidgetStoredTemplate[] = [];
    widgets: Widget[] = [];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initials
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Load Widgets
        this.globalVariableService.getResource('widgets')
        .then(res => {
            this.widgets = res;
        })
        .catch(err => {
            this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
            console.error('Error in widgetTemplate.insert reading widgets: ' + err);
        });

        // Load Stored Widget Templates, adding DS Name for user
        this.globalVariableService.getResource('widgetStoredTemplates')
            .then(res => {
                this.globalVariableService.getResource('widgetGraphs')
                    .then(graphs => {
                        this.widgetGraphs = graphs;
                    })
                    .catch(err => {
                        this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                        console.error('Error in widgetTemplate.insert reading widgetGraphs: ' + err);
                    });
    

                this.widgetStoredTemplates = res
                    .slice()
                    .sort( (obj1, obj2) => {
                        if (obj1.name < obj2.name) {
                            return -1;
                        };
                        if (obj1.name > obj2.name) {
                            return 1;
                        };
                        return 0;
                    });

                // TODO - this must be done in DB
                this.widgetStoredTemplates.forEach(wst => {
                    this.globalVariableService.widgets.forEach(w => {
                        if (w.id === wst.widgetID) {
                            this.globalVariableService.datasources.forEach(ds => {
                                if (w.datasourceID === ds.id) {
                                    wst.datasourceName = ds.name;
                                };
                            });
                        };
                    })
                });
                if (this.widgetStoredTemplates.length > 0) {
                    this.clickRow(0, this.widgetStoredTemplates[0].widgetID);
                };
            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in widgetTemplate.insert reading widgetStoredTemplates: ' + err);
            });
    }

    clickColumn() {
        // Unselect the row and unshow the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickColumn', '@Start');

        // Reset
        this.errorMessage = '';
        this.selectedRow = -1;
    }

    clickRow(index: number, widgetID: number) {
        // Show graph for row that the user clicked on
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset
        this.errorMessage = '';
        this.selectedRow = index;

        // Create new W
        this.selectedWidgetID = widgetID;
        let widgetIndex: number = this.widgets.findIndex(w =>
            w.id === widgetID
        );

        if (widgetIndex < 0) {
            this.errorMessage = 'Error: selected Widget does not exist any more';
            return;
        };
        this.localWidget = JSON.parse(JSON.stringify(
            this.widgets[widgetIndex])
        );
        this.localWidget.id = null;
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;

        // Add DS to current DS (no action if already there)
        this.globalVariableService.getCurrentDatasource(
            this.localWidget.datasourceID
            ).then(res => {

                // Render graph for Vega-Lite
                if (this.localWidget.visualGrammar === 'Vega-Lite') {

                    // Create specification
                    this.specification = this.globalVariableService.createVegaLiteSpec(
                        this.localWidget,
                        this.localWidget.graphHeight,
                        this.localWidget.graphWidth
                    );

                    // Render in DOM
                    let vegaSpecification = compile(this.specification).spec;
                    let view = new View(parse(vegaSpecification));

                    view.renderer('svg')
                        .initialize(this.widgetDOM.nativeElement)
                        .width(372)
                        .hover()
                        .run()
                        .finalize();
                };

                // Render graph for Vega
                if (this.localWidget.visualGrammar === 'Vega') {

                    // Create specification
                    this.specification = this.globalVariableService.createVegaSpec(
                        this.localWidget,
                        this.localWidget.graphHeight,
                        this.localWidget.graphWidth
                    );

                    // Render in DOM
                    let view = new View(parse(this.specification));
                    view.renderer('svg')
                        .initialize(this.widgetDOM.nativeElement)
                        .width(372)
                        .hover()
                        .run()
                        .finalize();
                };

            })
            .catch(err => {
                this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                console.error('Error in widgetTemplate.insert clickRow: ' + err);
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
        let widgetIndex: number = this.widgets.findIndex(w =>
            w.id === this.selectedWidgetID
        );

        if (widgetIndex < 0) {
            this.errorMessage = 'Error: selected Widget does not exist any more';
            return;
        };
        this.localWidget = JSON.parse(JSON.stringify(
            this.widgets[widgetIndex])
        );
        this.localWidget._id = null;
        this.localWidget.id = null;
        this.localWidget.dashboardID = this.globalVariableService.currentDashboardInfo.value.currentDashboardID;
        this.localWidget.dashboardTabID = this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID;

        // Add DS to current DS (no action if already there)
        this.globalVariableService.getCurrentDatasource(
            this.localWidget.datasourceID).then(res => {

            // Update local and global vars
            this.globalVariableService.addResource('widgets', this.localWidget)
                .then(addedWidget => {
                    this.localWidget.id = addedWidget.id;

                    // Action
                    // TODO - cater for errors + make more generic
                    let actID: number = this.globalVariableService.actionUpsert(
                        null,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardID,
                        this.globalVariableService.currentDashboardInfo.value.currentDashboardTabID,
                        this.localWidget.id,
                        'Widget',
                        'Add',
                        'Add Widget',
                        'W Tmpl clickSave',
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

                })
                .catch(err => {
                    this.errorMessage = !err.message?  err.slice(0, 100)  :  err.message.slice(0, 100);
                    console.error('Error in widgetTemplate.insert addding widgets: ' + err);
                });
    
        });

    }

    clickClose(action: string) {
        // Close the form, without saving anything
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTemplateInsertWidgetClosed.emit(null);
    }

}
