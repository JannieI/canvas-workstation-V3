/*
 * Shows form to define cross filters (to other Widgets) for the selected Widget
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

// Our Services
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';


@Component({
    selector: 'widget-crossFilter',
    templateUrl: './widget.crossFilter.component.html',
    styleUrls: ['./widget.crossFilter.component.css']
})
export class WidgetCrossFilterComponent implements OnInit {

    @Input() selectedWidget: Widget;
    @Output() formWidgetCrossFilterClosed: EventEmitter<string> = new EventEmitter();

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
    sourceField: string = '';
    sourceWidgetFields: string[] = [];
    targetField: string = '';
    targetTitle: string = '';
    targetWidgetFields: string[] = [];
    widgetFilter: {
        sourceWidgetFiled: string;
        targetWidgetTitle: string;
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
        this.widgetFilter.push({
            sourceWidgetFiled: "My Field1",
            targetWidgetTitle: "That Widget Title 1",
            targetWidgetField: "That Widget Field"
        });
        this.widgetFilter.push({
            sourceWidgetFiled: "My Field1",
            targetWidgetTitle: "Other Widget Title 2",
            targetWidgetField: "Other Widget Field"
        });

        if (this.widgetFilter.length > 0) {
            this.selectedRowIndex = 0;
        };

        console.log('xx this.selectedWidget', this.selectedWidget)
        if (this.selectedWidget != null) {
            let datasourceIndex: number = this.globalVariableService.datasources
                .findIndex(ds => ds.id == this.selectedWidget.datasourceID);
            if (datasourceIndex >= 0) {
                this.sourceWidgetFields = this.globalVariableService.datasources[datasourceIndex].dataFields;
                this.targetWidgetFields = this.globalVariableService.datasources[datasourceIndex].dataFields;
                console.log('xx this.sourceWidgetFields', this.sourceWidgetFields)
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

    }

    clickRow(index: number, widgetFilterID: number) {
        // A row was clicked
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRowIndex = index;
    }

    changeWidgetTitle(ev: any) {
        // User selected a Widget Title
        this.globalFunctionService.printToConsole(this.constructor.name,'changeWidgetTitle', '@Start');

        console.log('xx ev', ev.target.value)

        // Find the Widget
        // TODO - add id at later stage to cater for identical titles
        let widgetIndex: number = this.widgets.findIndex(w => w.titleText == ev.target.value);
        console.log('xx widgetIndex', widgetIndex)
        if (widgetIndex >= 0) {
            let datasourceIndex: number = this.globalVariableService.currentDatasources
                .findIndex(ds => ds.id == this.widgets[widgetIndex].datasourceID);
            if (datasourceIndex >= 0) {
                this.targetWidgetFields = this.globalVariableService.currentDatasources
                    [datasourceIndex].dataFields;
            };
            console.log('xx this.targetWidgetFields', this.targetWidgetFields)
        };
    }

    clickAdd() {
        // Add new filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Validation
        if (this.sourceField == '') {
            this.errorMessage = 'Source field is compulsory';
        };
        if (this.targetTitle == '') {
            this.errorMessage = 'Target Widget title is compulsory';
        };
        if (this.targetField == '') {
            this.errorMessage = 'Target field is compulsory';
        };

        this.widgetFilter.push({
            sourceWidgetFiled: this.sourceField,
            targetWidgetTitle: this.targetTitle,
            targetWidgetField: this.targetField
        });
        let graphFilter: WidgetFilter = {
            id: this.filterID,
            sequence: 0,        // For LATER use
            filterType: 'WidgetFilter',
            sourceDatasourceID: null,
            sourceDatasourceField: null,
            filterFieldName: this.filterFieldName,
            filterOperator: this.filterOperator,
            filterTimeUnit: this.filterTimeUnit,
            filterValue: this.filterValue,
            filterValueFrom: this.filterValueFrom,
            filterValueTo: this.filterValueTo,
            isActive: true
        };

        NB - only one Crossfilter per field per Widget from SAME sourceWidgetID
        // Update the localWidget
        // this.localWidget.widgetFilters.push(graphFilter);
    }

    clickDelete(i, row.id) {
        // Delete Cross Filter
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        let widgetIndex: number = this.widgets.findIndex(w => w.titleText == ev.target.value);
        console.log('xx widgetIndex', widgetIndex)
        if (widgetIndex >= 0) {
        };
    }

    clickClose(action: string) {
        // Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formWidgetCrossFilterClosed.emit(action);
    }

}
