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
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
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
                this.globalVariableService.getResource('widgetGraphs').then(graphs => {
                    this.widgetGraphs = graphs;
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
                    this.clickRow(0, this.widgetStoredTemplates[0].widgetID);
                };
            }
        );        
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

            // Render graph for Vega-Lite
            if (this.localWidget.visualGrammar == 'Vega-Lite') {

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
            if (this.localWidget.visualGrammar == 'Vega') {

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

            // // Create Spec
            // this.specification = this.globalVariableService.createVegaLiteSpec(
            //     this.localWidget,
            //     200,
            //     300
            // );

            // console.warn('xx @END of ShowGraph specification', this.specification);

            // // Render graph for Vega-Lite
            // if (this.localWidget.visualGrammar == 'Vega-Lite') {
            //     if (this.specification != undefined) {
            //         let vegaSpecification = compile(this.specification).spec;
            //         let view = new View(parse(vegaSpecification));

            //         view.renderer('svg')
            //             .initialize(this.domWidget.nativeElement)
            //             .width(372)
            //             .hover()
            //             .run()
            //             .finalize();
            //     };
            // };
            // // Render graph for Vega
            // if (this.localWidget.visualGrammar == 'Vega') {
            //     if (this.localWidget.graphSpecification != undefined) {
            //         let view = new View(parse(this.localWidget.graphSpecification));

            //         view.renderer('svg')
            //             .initialize(this.domWidget.nativeElement)
            //             .width(372)
            //             .hover()
            //             .run()
            //             .finalize();
            //     };
            // };            
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
        this.localWidget._id = null;
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

}
