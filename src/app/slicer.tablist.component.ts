/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

@Component({
    selector: 'slicer-tablist',
    templateUrl: './slicer.tablist.component.html',
    styleUrls: ['./slicer.tablist.component.css']
})
export class SlicerTablistComponent implements OnInit {

    @Output() formSlicerTablistClosed: EventEmitter<string> = new EventEmitter();

    currentTabNames: {isSelected: boolean; name: string}[];
    errorMessage: boolean = false;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {
    }

    ngOnInit() {
        // Build list of T to which SINGLE selected Sl belongs
        let slID: number[] = [];
        this.globalVariableService.currentWidgets.forEach(sl => {
            if (sl.isSelected  &&  sl.widgetType == 'Slicer') {
                slID.push(sl.dashboardTabID);
            };
        });

        // Build list of T names and position before showing it
        this.currentTabNames = [];
        this.globalVariableService.currentDashboardTabs.forEach(t => {
            if (this.currentTabNames == undefined) {
                this.currentTabNames = [{isSelected: true, name: t.name}];
            } else {
                if (slID.indexOf(t.id) >= 0) {
                    this.currentTabNames.push({isSelected: true, name: t.name})
                } else {
                    this.currentTabNames.push({isSelected: false, name: t.name})
                }

            }
        });
    }

    clickClose() {
        console.log('clickClose')

		this.formSlicerTablistClosed.emit('cancelled');
    }

    clickMultiTabClose(index: number) {
        // Close multi-tab-selection popup
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMultiTabClose', '@Start');

        let x: number = 0;
        this.currentTabNames.forEach(t => {
            if (t.isSelected) {x++}
        });
        if (x == 0) {
            this.errorMessage = true;
            return;
        } else {
		this.formSlicerTablistClosed.emit('saved');
        }
    }


    clickMultiTabSelect(index: number, ev: any) {
        // Select/UnSelect a T
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMultiTabSelect', '@Start');

        if (ev.target.localName == 'input') {
            this.currentTabNames[index].isSelected = ev.target.checked;
        }
    }
}
