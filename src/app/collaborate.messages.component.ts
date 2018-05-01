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
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasMessage }              from './models';
import { DatagridInput }              from './models';
import { DatagridColumn }             from './models';

@Component({
    selector: 'collaborate-messages',
    templateUrl: './collaborate.messages.component.html',
    styleUrls: ['./collaborate.messages.component.css']
})
export class CollaborateMessagesComponent implements OnInit {

    @Output() formCollaborateMessagesClosed: EventEmitter<string> = new EventEmitter();

    canvasMessages: CanvasMessage[];
    datagridColumns: DatagridColumn[];
    datagridInput: DatagridInput = null;
    datagridData: any;
    datagridPagination: boolean = false;
    datagridPaginationSize: number = 10;
    datagridShowHeader: boolean = false;
    datagridShowRowActionMenu: boolean = false;
    datagridShowData: boolean = true;
    datagridShowFooter: boolean = false;
    datagridRowHeight: number = 12;
    datagriduserCanChangeProperties: boolean = false;
    datagridShowTotalsRow: boolean = false;
    datagridShowTotalsCol: boolean = false;
    datagridCanEditInCell: boolean = false;
    datagridCanExportData: boolean = false;
    datagridEmptyMessage: string = 'No Messages created so far';
    datagridVisibleFields: string[];
    datagridShowFields: string[];


	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getCanvasMessages().then (ca => {
            // Set the data for the grid
            this.datagridData = ca;

            // Set the column object
            this.datagridColumns = this.globalVariableService.createDatagridColumns(
                ca[0], this.datagridShowFields, this.datagridVisibleFields);

        });
    }

    clickClose(action: string) {
        // Close form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formCollaborateMessagesClosed.emit(action);
    }
}
