/*
 * List of Transformations that forms part of the Datasource definition.
 * 
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                     from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataConnection }             from './models';
import { DataTable }                  from './models';
import { DataField }                  from './models';
import { Datasource }                 from './models';
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';
import { FieldMetadata }              from './models';
import { DataQualityIssue }           from './models';


@Component({
    selector: 'data-transformation',
    templateUrl: './data.transformation.component.html',
    styleUrls:  ['./data.transformation.component.css']
})
export class DataTransformationComponent implements OnInit {

    datasourceName: string = 'Trades per Month (Stats)';
    dataConnectionName: string = 'Trades History';
    dataTable: DataTable = 
    {
        id: 1,
        connectionID: 1,
        nameDB: 'TradStaMnt',
        nameLocal: 'TradesPerMonth',
        type: 'Table',
        description: 'Trade summary per month',
        businessGlossary: 'Trade summary per month',
        creator: 'EthanR',
        dateCreated: '2017/01/01',
        editor: '',
        dateEdited: ''
    };
    dataFields: DataField[];

    @Output() formDataTransformationClosed: EventEmitter<string> = new EventEmitter();

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

    connectionName: string = '';
    connectionType: string = 'MySQL';
    description: string = 'Post Trade Data Vault';
    dataTables: DataTable[] = [];
    datasources: Datasource[];
    errorMessage: string = "";
    selectedTableRowIndex: number = 0;
    serverName: string = 'MSSQL54: 8000';
    transformationDS: Transformation[] = [];
    transformations: Transformation[] = [];

    // connections ->

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.transformationDS = this.globalVariableService.transformationsFormat;
        this.globalVariableService.getTransformations().then(tr => {
            this.globalVariableService.getDataField().then(df => {
                
                // Set local Vars
                this.transformations = tr.slice();
                this.dataFields = df.slice();
            });
        });

    }



    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

}


