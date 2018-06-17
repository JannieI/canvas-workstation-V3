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
import { DataField }                  from './models';
import { Datasource }                 from './models';
import { Dataset }                    from './models';
import { Transformation }             from './models';
import { Field }                      from './models';


@Component({
    selector: 'data-transformation',
    templateUrl: './data.transformation.component.html',
    styleUrls:  ['./data.transformation.component.css']
})
export class DataTransformationComponent implements OnInit {

    @Input() selectedDatasource: Datasource;

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
    dataFields: DataField[];
    datasourceName: string = 'Trades per Month (Stats)';
    serverType: string = 'MySQL';
    datasources: Datasource[];
    errorMessage: string = "";
    selectedTransoformationRowIndex: number = 0;
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
console.warn('xx selectedDatasource', this.selectedDatasource)
    }

    clickSelect(ev: any) {
        // Select a Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelect', '@Start');

        // Set seletected index - used for highlighting row
        console.warn('xx ev', ev.target.value)
    }

    clickSelectedTransformation(index: number, id: number) {
        // Click on Transformation row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedTransformation', '@Start');

        // Set seletected index - used for highlighting row
        this.selectedTransoformationRowIndex = index;
    }

    clickMoveTransformationUp(index: number, id: number) {
        // Move Transformation Up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveTransformationUp', '@Start');

    }
    
    clickMoveTransformationDown(index: number, id: number) {
        // Move Transformation Down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveTransformationDown', '@Start');

    }
    
    clickDeleteTransformation(index: number, id: number) {
        // Delete Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDeleteTransformation', '@Start');

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

}


