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
    
    
    adding: boolean = false;
    connectionName: string = '';
    dataFields: DataField[];
    datasourceName: string = 'Trades per Month (Stats)';
    serverType: string = 'MySQL';
    datasources: Datasource[];
    errorMessage: string = "";

    parameter1Placeholder: string = 'Nr Chars from Left';
    parameter1Title: string = 'aitsa';
    parameter1Text: string = '10';
    parameter1Heading: string = 'Left';

    parameter2Placeholder: string = 'Nr Chars from Left 2';
    parameter2Title: string = 'aitsa 2';
    parameter2Text: string = '20';
    parameter2Heading: string = 'Left2';

    parameter3Placeholder: string = 'Nr Chars from Left 3';
    parameter3Title: string = 'aitsa 3';
    parameter3Text: string = '30';
    parameter3Heading: string = 'Left 3';

    parameter4Placeholder: string = 'Nr Chars from Left 4';
    parameter4Title: string = 'aitsa 4';
    parameter4Text: string = '40';
    parameter4Heading: string = 'Left 4';

    parameter5Placeholder: string = 'Nr Chars from Left 5';
    parameter5Title: string = 'aitsa 5';
    parameter5Text: string = '50';
    parameter5Heading: string = 'Left 5';

    parameter6Placeholder: string = 'Nr Chars from Left 6';
    parameter6Title: string = 'aitsa 6';
    parameter6Text: string = '60';
    parameter6Heading: string = 'Left 6';

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

        this.parameter1Text = '10';
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

        for (var i = 0; i <this.transformationDS[index].parameterHeading.length; i++) {
            if (i == 0 ) {
                this.parameter1Heading = this.transformationDS[index].parameterHeading[i];
            };
            if (i == 1 ) {
                this.parameter2Heading = this.transformationDS[index].parameterHeading[i];
            };
            if (i == 2 ) {
                this.parameter3Heading = this.transformationDS[index].parameterHeading[i];
            };
            if (i == 3 ) {
                this.parameter4Heading = this.transformationDS[index].parameterHeading[i];
            };
            if (i == 4 ) {
                this.parameter5Heading = this.transformationDS[index].parameterHeading[i];
            };
            if (i == 5 ) {
                this.parameter6Heading = this.transformationDS[index].parameterHeading[i];
            };
        };

        for (var i = 0; i <this.transformationDS[index].parameterText.length; i++) {
            if (i == 0 ) {
                this.parameter1Text = this.transformationDS[index].parameterText[i];
            };
            if (i == 1 ) {
                this.parameter2Text = this.transformationDS[index].parameterText[i];
            };
            if (i == 2 ) {
                this.parameter3Text = this.transformationDS[index].parameterText[i];
            };
            if (i == 3 ) {
                this.parameter4Text = this.transformationDS[index].parameterText[i];
            };
            if (i == 4 ) {
                this.parameter5Text = this.transformationDS[index].parameterText[i];
            };
            if (i == 5 ) {
                this.parameter6Text = this.transformationDS[index].parameterText[i];
            };
        };
    }

    clickMoveUp(index: number, id: number) {
        // Move Transformation Up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveUp', '@Start');

    }
    
    clickMoveDown(index: number, id: number) {
        // Move Transformation Down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

    }
    
    clickEdit(index: number, id: number) {
        // Edit Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        this.adding = true;
        
    }
    
    clickDelete(index: number, id: number) {
        // Delete Transformation 
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

    }

    clickAdd() {
        // Start Adding a new Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        this.adding = true;
    }

    clickSave() {
        // Save Transformation and its parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        this.adding = false;
    }
    
    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

}


