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

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetFilterSummaryClosed.emit(action);
    }

}
