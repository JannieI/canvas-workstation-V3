/*
 * Shows form with Data Quality issues
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasComment }              from './models';
import { DataQualityIssue }           from './models';

// import { AgGridNg2 }                  from 'ag-grid-angular';


@Component({
    selector: 'dashboard-dataquality',
    templateUrl: './dashboard.dataquality.component.html',
    styleUrls: ['./dashboard.dataquality.component.css']
})
export class DashboardDataQualityComponent implements OnInit {

    @Output() formDashboardDataQualityClosed: EventEmitter<string> = new EventEmitter();
    @Input() selectedDatasourceID: number;
    // @ViewChild('agGrid') agGrid: AgGridNg2;

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

    canvasComments: CanvasComment[] = [];
    dataQualityIssues: DataQualityIssue[] = [];
    errorMessage: string = '';
    headerText: string;
    selectedRow: number = 0;


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Display the source, and set the array of DSids
        let dsArray: number[] = [];
        if (this.selectedDatasourceID == -1) {
            this.headerText = 'the current Dashboard';
            this.globalVariableService.currentDatasources.forEach(ds =>
                dsArray.push(ds.id)
            );
        } else {
            this.headerText = 'the selected Widget';
            dsArray = [this.selectedDatasourceID];
        };

        this.globalVariableService.getResource('dataQualityIssues')
            .then (ca => {
                this.dataQualityIssues = ca.filter(c =>
                    dsArray.indexOf(c['datasourceID']) >= 0)
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Dashboard.dataQuality reading dataQualityIssues: ' + err);
            });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDashboardDataQualityClosed.emit(action);
    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    // ag-Grid Experiment
    // getSelectedRows() {
    //     const selectedNodes = this.agGrid.api.getSelectedNodes();
    //     const selectedData = selectedNodes.map( node => node.data );
    //     const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ');
    //     alert(`Selected nodes: ${selectedDataStringPresentation}`);
    // }

}
