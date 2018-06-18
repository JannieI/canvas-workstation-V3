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
import { DatasourceTransformation }   from './models';
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
    transformationName: string = '';
    dataFields: DataField[];
    errorMessage: string = "";

    parameter1Placeholder: string = '';
    parameter1Title: string = '';
    parameter1Text: string = '';
    parameter1Heading: string = '';

    parameter2Placeholder: string = '';
    parameter2Title: string = '';
    parameter2Text: string = '';
    parameter2Heading: string = '';

    parameter3Placeholder: string = '';
    parameter3Title: string = '';
    parameter3Text: string = '';
    parameter3Heading: string = '';

    parameter4Placeholder: string = '';
    parameter4Title: string = '';
    parameter4Text: string = '';
    parameter4Heading: string = '';

    parameter5Placeholder: string = '';
    parameter5Title: string = '';
    parameter5Text: string = '';
    parameter5Heading: string = '';

    parameter6Placeholder: string = 'Nr Chars from Left 6';
    parameter6Title: string = 'aitsa 6';
    parameter6Text: string = '60';
    parameter6Heading: string = 'Left 6';

    selectedTransoformationRowIndex: number = 0;
    datasourceTransformations: DatasourceTransformation[] = [];
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

        this.globalVariableService.getDatasourceTransformations().then(dtr => {
            this.globalVariableService.getTransformations().then(tr => {
                // Set local Vars
                this.datasourceTransformations = dtr.slice();
                this.transformations = tr.slice();
                console.warn('xx tr', this.datasourceTransformations, this.transformations, this.selectedDatasource)
            });
        });
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

        // Reset
        this.parameter1Placeholder = '';
        this.parameter1Title = '';
        this.parameter1Text = '';
        this.parameter1Heading = '';

        this.parameter2Placeholder = '';
        this.parameter2Title = '';
        this.parameter2Text = '';
        this.parameter2Heading = '';

        this.parameter3Placeholder = '';
        this.parameter3Title = '';
        this.parameter3Text = '';
        this.parameter3Heading = '';

        this.parameter4Placeholder = '';
        this.parameter4Title = '';
        this.parameter4Text = '';
        this.parameter4Heading = '';

        this.parameter5Placeholder = '';
        this.parameter5Title = '';
        this.parameter5Text = '';
        this.parameter5Heading = '';

        this.parameter6Placeholder = '';
        this.parameter6Title = '';
        this.parameter6Text = '';
        this.parameter6Heading = '';

        for (var i = 0; i <this.transformations[index].parameterHeading.length; i++) {
            if (i == 0 ) {
                this.parameter1Heading = this.transformations[index].parameterHeading[i];
            };
            if (i == 1 ) {
                this.parameter2Heading = this.transformations[index].parameterHeading[i];
            };
            if (i == 2 ) {
                this.parameter3Heading = this.transformations[index].parameterHeading[i];
            };
            if (i == 3 ) {
                this.parameter4Heading = this.transformations[index].parameterHeading[i];
            };
            if (i == 4 ) {
                this.parameter5Heading = this.transformations[index].parameterHeading[i];
            };
            if (i == 5 ) {
                this.parameter6Heading = this.transformations[index].parameterHeading[i];
            };
        };

        for (var i = 0; i <this.datasourceTransformations[index].parameterText.length; i++) {
            if (i == 0 ) {
                this.parameter1Text = this.datasourceTransformations[index].parameterText[i];
            };
            if (i == 1 ) {
                this.parameter2Text = this.datasourceTransformations[index].parameterText[i];
            };
            if (i == 2 ) {
                this.parameter3Text = this.datasourceTransformations[index].parameterText[i];
            };
            if (i == 3 ) {
                this.parameter4Text = this.datasourceTransformations[index].parameterText[i];
            };
            if (i == 4 ) {
                this.parameter5Text = this.datasourceTransformations[index].parameterText[i];
            };
            if (i == 5 ) {
                this.parameter6Text = this.datasourceTransformations[index].parameterText[i];
            };
        };

        for (var i = 0; i <this.transformations[index].parameterTitle.length; i++) {
            if (i == 0 ) {
                this.parameter1Title = this.transformations[index].parameterTitle[i];
            };
            if (i == 1 ) {
                this.parameter2Title = this.transformations[index].parameterTitle[i];
            };
            if (i == 2 ) {
                this.parameter3Title = this.transformations[index].parameterTitle[i];
            };
            if (i == 3 ) {
                this.parameter4Title = this.transformations[index].parameterTitle[i];
            };
            if (i == 4 ) {
                this.parameter5Title = this.transformations[index].parameterTitle[i];
            };
            if (i == 5 ) {
                this.parameter6Title = this.transformations[index].parameterTitle[i];
            };
        };
    
        for (var i = 0; i <this.transformations[index].parameterPlaceholder.length; i++) {
            if (i == 0 ) {
                this.parameter1Placeholder = this.transformations[index].parameterPlaceholder[i];
            };
            if (i == 1 ) {
                this.parameter2Placeholder = this.transformations[index].parameterPlaceholder[i];
            };
            if (i == 2 ) {
                this.parameter3Placeholder = this.transformations[index].parameterPlaceholder[i];
            };
            if (i == 3 ) {
                this.parameter4Placeholder = this.transformations[index].parameterPlaceholder[i];
            };
            if (i == 4 ) {
                this.parameter5Placeholder = this.transformations[index].parameterPlaceholder[i];
            };
            if (i == 5 ) {
                this.parameter6Placeholder = this.transformations[index].parameterPlaceholder[i];
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


