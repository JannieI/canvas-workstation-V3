/*
 * Shows form Widget Filters filters for the selected Widget
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our models
import { Widget }                     from './models';
import { WidgetFilter }               from './models';

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'data-widgetFilterSummary',
    templateUrl: './widget.filterSummary.component.html',
    styleUrls: ['./widget.filterSummary.component.css']
})
export class WidgetFilterSummaryComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetFilterSummaryClosed: EventEmitter<string> = new EventEmitter();

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

    editing: boolean = false;
    errorMessage: string = '';
    selectedRowIndex: number = -1;
    selectedTargetWidgetID: number = -1;
    sourceField: string = '';
    sourceWidgetFields: string[] = [];
    targetField: string = '';
    targetTitle: string = '';
    targetWidgetFields: string[] = [];
    localWidgetFilters: {
        sourceWidgetTitle: string;
        sourceDescription: string;
        sourceWidgetField: string;
        targetWidgetField: string;
    }[] = [];
    widgets: Widget[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.selectedWidget != null) {
            let datasourceIndex: number = this.globalVariableService.datasources
                .findIndex(ds => ds.id == this.selectedWidget.datasourceID);
            if (datasourceIndex >= 0) {
                this.sourceWidgetFields = this.globalVariableService.datasources[datasourceIndex].dataFields;
                this.targetWidgetFields = this.globalVariableService.datasources[datasourceIndex].dataFields;
            };
        } else {
            this.errorMessage = 'An error occured - the selected Widgets is null';
        };

        // For now, only show Ws on the same Tab
        this.widgets = this.globalVariableService.currentWidgets
            .filter(
                w => w.dashboardID == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardID
                &&
                w.dashboardTabID == this.globalVariableService.currentDashboardInfo
                    .value.currentDashboardTabID
                &&
                (w.widgetType == 'Graph'  ||  w.widgetType == 'Table')
                &&
                (w.id != this.selectedWidget.id)
            )
            .sort( (a,b) => {
                if (a.name < b.name) {
                    return 1;
                };
                if (a.name > b.name) {
                    return -1;
                };
                return 0;
            })
            
        // Array of CrossFilters for form 
        this.widgets.forEach(w => {

            w.widgetFilters.forEach(wf => {
                if (wf.sourceWidgetID == this.selectedWidget.id) {

                    if (wf.filterType == 'CrossFilter') {

                        this.localWidgetFilters.push({
                            sourceWidgetField: wf.sourceDatasourceField,
                            targetWidgetID: w.id,
                            targetWidgetTitle: w.titleText,
                            targetDescription: w.description,
                            targetWidgetField: wf.filterFieldName
                        });
                    };
                };
        
                if (this.localWidgetFilters.length > 0) {
                    this.selectedRowIndex = 0;
                };
            })
        });
    
    }

    clickRow(index: number, widgetFilterID: number) {
        // A row was clicked
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRowIndex = index;
    }

    changeWidgetTitle(ev: any) {
        // User selected a Widget Title
        this.globalFunctionService.printToConsole(this.constructor.name,'changeWidgetTitle', '@Start');

        // Find the Widget
        // TODO - add id at later stage to cater for identical titles
        let widgetIndex: number = this.widgets.findIndex(w => w.titleText == ev.target.value);

        if (widgetIndex >= 0) {

            // Set TargetID
            this.selectedTargetWidgetID = this.widgets[widgetIndex].id;

            let datasourceIndex: number = this.globalVariableService.currentDatasources
                .findIndex(ds => ds.id == this.widgets[widgetIndex].datasourceID);
            if (datasourceIndex >= 0) {
                this.targetWidgetFields = this.globalVariableService.currentDatasources
                    [datasourceIndex].dataFields;
                if (this.targetWidgetFields.length > 0) {
                    this.targetField = this.targetWidgetFields[0];
                };
            };
        } else {
            this.selectedTargetWidgetID = -1;
        };
    }


    clickDelete(
        index: number, 
        sourceWidgetField: string, 
        targetWidgetID: number, 
        targetWidgetField: string
        ) {
        // Delete Cross Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Splice local Array
        this.localWidgetFilters = this.localWidgetFilters
            .filter(wf => !(wf.sourceWidgetField == sourceWidgetField
                    &&
                    wf.targetWidgetID == targetWidgetID  
                    &&  
                    wf.targetWidgetField == targetWidgetField)
            );

        let widgetIndex: number = this.globalVariableService.currentWidgets
            .findIndex(w => w.id == targetWidgetID);
        if (widgetIndex >= 0) {
            this.globalVariableService.currentWidgets[widgetIndex].widgetFilters =
                this.globalVariableService.currentWidgets[widgetIndex].widgetFilters
                    .filter(wf => wf.sourceWidgetID != this.selectedWidget.id
                            && 
                            wf.sourceDatasourceField != sourceWidgetField
                            &&
                            wf.sourceWidgetID != this.selectedWidget.id
                            &&  
                            wf.filterFieldName != targetWidgetField
                    );
            this.globalVariableService.saveResource(
                'widgets', 
                this.globalVariableService.currentWidgets[widgetIndex]
            )
            .then( res => console.log('Saved W to DB') )
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in widget.crossFilter saving Widget: ' + err);
            });
        };
    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetFilterSummaryClosed.emit(action);
    }

}
