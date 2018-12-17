/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'widget-tablist',
    templateUrl: './widget.tablist.component.html',
    styleUrls: ['./widget.tablist.component.css']
})
export class WidgetTablistComponent implements OnInit {

    @Output() formWidgetTablistClosed: EventEmitter<number[]> = new EventEmitter();
    @Input() currentWidgetDashboardTabIDs: number[];

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

    currentTabNames: { isSelected: boolean; name: string; id: number }[];
    errorMessage: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {
    }

    ngOnInit() {
        // Build list of T to which SINGLE selected Sl belongs
        // let slID: number[] = [];
        // this.globalVariableService.currentWidgets.forEach(sl => {
        //     if (sl.isSelected  &&  sl.widgetType == 'Slicer') {
        //         slID.push(sl.dashboardTabID);
        //     };
        // });

        // Build list of T names and position before showing it
        this.currentTabNames = [];
        this.globalVariableService.currentDashboardTabs.forEach(t => {
            if (this.currentTabNames == undefined) {
                if (this.currentWidgetDashboardTabIDs.indexOf(t.id) >= 0) {
                    this.currentTabNames = [{isSelected: true, name: t.name, id: t.id}];
                } else {
                    this.currentTabNames = [{isSelected: false, name: t.name, id: t.id}];
                };
            } else {
                if (this.currentWidgetDashboardTabIDs.indexOf(t.id) >= 0) {
                    this.currentTabNames.push({isSelected: true, name: t.name, id: t.id})
                } else {
                    this.currentTabNames.push({isSelected: false, name: t.name, id: t.id})
                };
            };
        });
    }

    clickClose(action: string) {
        // Close multi-tab-selection popup, no changes
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formWidgetTablistClosed.emit(null);
    }

    clickSave() {
        // Save data and Close multi-tab-selection popup
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Construct TabIDs array
        let tabIDs: number[] = [];
        
        this.currentTabNames.forEach(t => {
            if (t.isSelected) {
                tabIDs.push(t.id)
            };
        });

        // Have to select at least one
        if (tabIDs.length == 0) {
            this.errorMessage = true;
            return;
        };

		this.formWidgetTablistClosed.emit(tabIDs);

    }

    clickMultiTabSelect(index: number, ev: any) {
        // Select/UnSelect a T
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMultiTabSelect', '@Start');

        if (ev.target.localName == 'input') {
            this.currentTabNames[index].isSelected = ev.target.checked;
        };
    }
}
