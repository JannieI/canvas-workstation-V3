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
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    datasourceDetails: string = '';
    editing: boolean = false;
    errorMessage: string = '';
    selectedRowIndex: number = -1;
    localWidgetFilters: {
        sourceWidgetTitle: string;
        sourceDescription: string;
        sourceWidgetField: string;
        targetWidgetField: string;
    }[] = [];

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        if (this.selectedWidget != null) {
            let datasourceIndex: number = this.globalVariableService.datasources
                .findIndex(ds => ds.id === this.selectedWidget.datasourceID);
            if (datasourceIndex >= 0) {
                this.datasourceDetails = 
                    this.globalVariableService.datasources[datasourceIndex].name + ' - ' 
                    + this.globalVariableService.datasources[datasourceIndex].description;
            };
        } else {
            this.errorMessage = 'An error occured - the selected Widgets is null';
        };

            
        // Array of CrossFilters for form 
        this.selectedWidget.widgetFilters.forEach(wf => {

            if (wf.filterType === 'CrossFilter') {

                this.localWidgetFilters.push({
                    sourceWidgetTitle: '',
                    sourceDescription: '',
                    sourceWidgetField: '',
                    targetWidgetField: ''
                });
            };
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
