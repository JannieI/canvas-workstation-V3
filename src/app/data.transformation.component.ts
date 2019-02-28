/*
 * List of Transformations that forms part of the Datasource definition.
 *
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { DataField }                  from './models';
import { Datasource }                 from './models';
import { DatasourceTransformation }   from './models';
import { Transformation }             from './models';

interface localDatasourceTransformation extends DatasourceTransformation {
    name?: string;           // Name of the Transformation to display on form
}


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


    adding: boolean = false;                        // True if adding a new Tr, click Save to complete
    dataFields: DataField[];
    datasourceTransformations: localDatasourceTransformation[] = [];
    editing: boolean = false;                       // True if editing a selected Tr
    errorMessage: string = "";
    nrParameters: number = 0;                       // Nr of Parameters for current Tr

    // Parameter info on form
    parameter1Placeholder: string = '';
    parameter1Title: string = '';
    parameter1Value: string = '';
    parameter1Heading: string = '';
    parameter1ValueOriginal: string = '';
    parameter2Placeholder: string = '';
    parameter2Title: string = '';
    parameter2Value: string = '';
    parameter2Heading: string = '';
    parameter2ValueOriginal: string = '';
    parameter3Placeholder: string = '';
    parameter3Title: string = '';
    parameter3Value: string = '';
    parameter3Heading: string = '';
    parameter3ValueOriginal: string = '';
    parameter4Placeholder: string = '';
    parameter4Title: string = '';
    parameter4Value: string = '';
    parameter4Heading: string = '';
    parameter4ValueOriginal: string = '';
    parameter5Placeholder: string = '';
    parameter5Title: string = '';
    parameter5Value: string = '';
    parameter5Heading: string = '';
    parameter5ValueOriginal: string = '';
    parameter6Placeholder: string = '';
    parameter6Title: string = '';
    parameter6Value: string = '';
    parameter6Heading: string = '';
    parameter6ValueOriginal: string = '';

    position: string = 'top-middle';                    // Position of Tr signpost
    selectedTransformationRowIndex: number = 0;         // Selected Master Tr row
    selectedDataRowIndex: number = 0;                   // Selected Tr row (for current DS)
    transitionDescription: string ='';                  // Tr Description
    transformationName: string = '';                    // Tr Name
    transformations: Transformation[] = [];             // Array of Master Tr

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
            this.globalVariableService.getResource('transformations').then(tr => {
                // Set local Vars
                this.datasourceTransformations = dtr.filter(ftr =>
                    ftr.datasourceID == this.selectedDatasource.id
                ).sort( (obj1,obj2) => {
                    if (obj1.sequence > obj2.sequence) {
                        return 1;
                    };
                    if (obj1.sequence < obj2.sequence) {
                        return -1;
                    };
                    return 0;
                });
                this.transformations = tr.slice();

                // Set description
                if (this.transformations.length > 0) {
                    this.transitionDescription = this.transformations[0].description;
                };

                // Fill name for display
                this.datasourceTransformations.forEach(dtr => {
                    this.transformations.forEach(tr => {
                        if (dtr.transformationID == tr.id) {
                            dtr.name = tr.name;
                        };
                    });
                });

                if (this.datasourceTransformations.length > 0) {
                    this.clickRow(0, this.datasourceTransformations[0].id);
                };
            });
        });
    }


    clickSelectedTransformation() {
        // Click on Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelectedTransformation', '@Start');

        // Select the Tr master record
        this.selectedTransformationRowIndex = this.transformations.findIndex(tr =>
            tr.name == this.transformationName
        );

        // Set Description
        if (this.transformations.length > 0) {
            this.transitionDescription = this.transformations[
                this.selectedTransformationRowIndex].description;
            this.nrParameters = this.transformations[
                this.selectedTransformationRowIndex].nrParameters;
        };

        // Fill form
        this.clickFillParameters(this.selectedTransformationRowIndex, -1);
    }

    clickRow(index: number, id: number) {
        // Click on DatasourceTransformation row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset Add/Edit
        if (this.selectedDataRowIndex != index) {
            this.adding = false;
            this.editing = false;
        };

        // Set seletected index - used for highlighting row
        this.selectedDataRowIndex = index;

        // Select the Tr master record
        this.selectedTransformationRowIndex = this.transformations.findIndex(tr => tr.id ==
            this.datasourceTransformations[this.selectedDataRowIndex].transformationID
        );

        // Set Description
        if (this.transformations.length > 0) {
            this.transitionDescription = this.transformations[
                this.selectedTransformationRowIndex].description;
            this.nrParameters = this.transformations[
                this.selectedTransformationRowIndex].nrParameters;
        };

        // Fill form
        this.clickFillParameters(this.selectedTransformationRowIndex, this.selectedDataRowIndex);
    }

    clickFillParameters(transformationRowIndex, dataRowIndex) {
        // Fill the Paramers, based on what was selected
        this.globalFunctionService.printToConsole(this.constructor.name,'clickFillParameters', '@Start');

        // Reset
        this.parameter1Placeholder = '';
        this.parameter1Title = '';
        this.parameter1Value = '';
        this.parameter1Heading = '';

        this.parameter2Placeholder = '';
        this.parameter2Title = '';
        this.parameter2Value = '';
        this.parameter2Heading = '';

        this.parameter3Placeholder = '';
        this.parameter3Title = '';
        this.parameter3Value = '';
        this.parameter3Heading = '';

        this.parameter4Placeholder = '';
        this.parameter4Title = '';
        this.parameter4Value = '';
        this.parameter4Heading = '';

        this.parameter5Placeholder = '';
        this.parameter5Title = '';
        this.parameter5Value = '';
        this.parameter5Heading = '';

        this.parameter6Placeholder = '';
        this.parameter6Title = '';
        this.parameter6Value = '';
        this.parameter6Heading = '';

        // Fill the rest, ie field headers, title and placeholders
        for (var i = 0; i < this.transformations[transformationRowIndex].nrParameters ; i++) {
            if (i == 0 ) {
                this.parameter1Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 1 ) {
                this.parameter2Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 2 ) {
                this.parameter3Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 3 ) {
                this.parameter4Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 4 ) {
                this.parameter5Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
            if (i == 5 ) {
                this.parameter6Heading = this.transformations[transformationRowIndex].parameterHeading[i];
            };
        };

        for (var i = 0; i < this.transformations[transformationRowIndex].nrParameters; i++) {
            if (i == 0 ) {
                this.parameter1Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 1 ) {
                this.parameter2Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 2 ) {
                this.parameter3Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 3 ) {
                this.parameter4Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 4 ) {
                this.parameter5Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
            if (i == 5 ) {
                this.parameter6Title = this.transformations[transformationRowIndex].parameterTitle[i];
            };
        };

        for (var i = 0; i < this.transformations[transformationRowIndex].nrParameters; i++) {
            if (i == 0 ) {
                this.parameter1Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 1 ) {
                this.parameter2Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 2 ) {
                this.parameter3Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 3 ) {
                this.parameter4Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 4 ) {
                this.parameter5Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
            if (i == 5 ) {
                this.parameter6Placeholder = this.transformations[transformationRowIndex].parameterPlaceholder[i];
            };
        };

        // Fill values - AFTER the above
        if (dataRowIndex >= 0) {

            for (var i = 0; i < this.transformations[transformationRowIndex].nrParameters; i++) {
                if (i == 0 ) {
                    this.parameter1Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 1 ) {
                    this.parameter2Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 2 ) {
                    this.parameter3Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 3 ) {
                    this.parameter4Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 4 ) {
                    this.parameter5Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
                if (i == 5 ) {
                    this.parameter6Value = this.datasourceTransformations[dataRowIndex].parameterValue[i];
                };
            };
        };

    }

    clickMoveUp(index: number, id: number) {
        // Move Transformation Up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveUp', '@Start');

        // Nothing to do
        if (index == 0) {
            return;
        };

        // Get 2 records
        let previousSequence: number = this.datasourceTransformations[index - 1].sequence;
        let selectedSequence: number = this.datasourceTransformations[index].sequence;

        // Swap Sequence, and sort again
        this.datasourceTransformations[index - 1].sequence = selectedSequence;
        this.datasourceTransformations[index].sequence = previousSequence;

        // Save to DB
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index - 1]);
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index]);

        // Resort
        this.datasourceTransformations = this.datasourceTransformations.sort( (obj1,obj2) => {
            if (obj1.sequence > obj2.sequence) {
                return 1;
            };
            if (obj1.sequence < obj2.sequence) {
                return -1;
            };
            return 0;
        });

        // Highlight same row
        let currentIndex: number = this.datasourceTransformations.findIndex(dtr =>
            dtr.id == id
        );
        this.clickRow(currentIndex, id);
    }

    clickMoveDown(index: number, id: number) {
        // Move Transformation Down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        // Nothing to do
        if (index == (this.datasourceTransformations.length - 1) )  {
            return;
        };

        // Get 2 records
        let selectedSequence: number = this.datasourceTransformations[index].sequence;
        let nextSequence: number = this.datasourceTransformations[index + 1].sequence;

        // Swap Sequence, and sort again
        this.datasourceTransformations[index + 1].sequence = selectedSequence;
        this.datasourceTransformations[index].sequence = nextSequence;

        // Save to DB
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index]);
        this.globalVariableService.saveDatasourceTransformation(
            this.datasourceTransformations[index + 1]);

        // Resort
        this.datasourceTransformations = this.datasourceTransformations.sort( (obj1,obj2) => {
            if (obj1.sequence > obj2.sequence) {
                return 1;
            };
            if (obj1.sequence < obj2.sequence) {
                return -1;
            };
            return 0;
        });

        // Highlight same row
        let currentIndex: number = this.datasourceTransformations.findIndex(dtr =>
            dtr.id == id
        );
        this.clickRow(currentIndex, id);
    }

    clickAdd() {
        // Start Adding a new Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Clear Values
        this.parameter1Value = '';
        this.parameter2Value = '';
        this.parameter3Value = '';
        this.parameter4Value = '';
        this.parameter5Value = '';
        this.parameter6Value = '';

        // Auto select first one
        if (this.transformations.length > 0) {
            this.transformationName = this.transformations[0].name;
            this.clickSelectedTransformation();
        };

        // Open form
        this.adding = true;

    }

    clickEdit(index: number, id: number) {
        // Edit Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'clickEdit', '@Start');

        // Remember the originals, in case we want to Cancel
        this.parameter1ValueOriginal = this.parameter1Value;
        this.parameter2ValueOriginal = this.parameter2Value;
        this.parameter3ValueOriginal = this.parameter3Value;
        this.parameter4ValueOriginal = this.parameter4Value;
        this.parameter5ValueOriginal = this.parameter5Value;
        this.parameter6ValueOriginal = this.parameter6Value;

        // Open form for editing
        this.editing = true;

    }

    clickCancel() {
        // Cancel Editing Transformation parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');

        // Restore form

        // Remember the originals, in case we want to Cancel
        this.parameter1Value = this.parameter1ValueOriginal;
        this.parameter2Value = this.parameter2ValueOriginal;
        this.parameter3Value = this.parameter3ValueOriginal;
        this.parameter4Value = this.parameter4ValueOriginal;
        this.parameter5Value = this.parameter5ValueOriginal;
        this.parameter6Value = this.parameter6ValueOriginal;

        // Cancel Editing
        this.adding = false;
        this.editing = false;
    }

    clickSave() {
        // Save Transformation and its parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';

        // Validate
        for (var i = 0; i < this.transformations[this.selectedTransformationRowIndex].nrParameters; i++) {
            if (i == 0) {
                if (this.parameter1Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                        var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter1Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
            if (i == 1) {
                if (this.parameter2Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                    var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter2Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
            if (i == 2) {
                if (this.parameter3Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                    var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter3Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
            if (i == 3) {
                if (this.parameter4Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                    var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter4Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
            if (i == 4) {
                if (this.parameter5Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                    var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter5Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
            if (i == 5) {
                if (this.parameter6Value == '') {
                    this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is compulsory';
                    return;
                };
                if (this.transformations[this.selectedTransformationRowIndex]
                    .parameterType[i].toLowerCase() == 'number') {
                    var reg = /^-?\d+(\.\d+)?$/;
                    if (!reg.test(this.parameter6Value)) {
                        this.errorMessage = this.transformations[this.selectedTransformationRowIndex]
                        .parameterHeading[i] + ' is not numeric!';
                        return;
                    };
                };
            };
        };

        // Add NEW record
        if (this.adding) {

            // Create max Sequence
            let newSequence: number = 1;
            if (this.datasourceTransformations.length > 0) {
                newSequence = this.datasourceTransformations[
                    this.datasourceTransformations.length - 1].sequence + 1;
            };

            // Create New record
            let newDatasourceTransition: DatasourceTransformation =
            {
                id: null,
                transformationID: this.transformations[this.selectedTransformationRowIndex].id,
                datasourceID: this.selectedDatasource.id,
                sequence: newSequence,
                parameterValue:
                [
                this.parameter1Value, this.parameter2Value, this.parameter3Value,
                this.parameter4Value, this.parameter5Value, this.parameter6Value
                ],
                editedBy: '',
                editedOn: null,
                createdBy: '',
                createdOn: null
            };

            // Save to DB
            this.globalVariableService.addDatasourceTransformation(newDatasourceTransition)
                .then(dtr => {

                    // Add Tr name to display on form
                    let localDtr: localDatasourceTransformation = dtr;
                    localDtr.name = this.transformations[this.selectedTransformationRowIndex].name;
                    this.datasourceTransformations.push(localDtr);

                    // Refresh previous row
                    let newID: number = dtr.id;
                    let newIndex: number = this.datasourceTransformations.findIndex(d =>
                        d.id == newID);
                    this.clickRow(newIndex, newID);

                }
            );
        };

        // Save EDITs
        if (this.editing) {
            // Change the array
            this.datasourceTransformations[this.selectedDataRowIndex].parameterValue = [
                this.parameter1Value, this.parameter2Value, this.parameter3Value,
                this.parameter4Value, this.parameter5Value, this.parameter6Value
            ];

            // Save to DB
            this.globalVariableService.saveDatasourceTransformation(
                this.datasourceTransformations[this.selectedDataRowIndex]);
        };

        // Disable
        this.adding = false;
        this.editing = false;
    }

    dblclickDelete(index: number, id: number) {
        // Delete Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');

        // Delete from local and DB
        this.globalVariableService.deleteResource('datasourceTransformations', id).then(res => {
            this.datasourceTransformations = this.datasourceTransformations.filter(dtr =>
                dtr.id != id);

            // Refresh previous row
            let newIndex: number = index > 0? index - 1 : 0;
            let newID: number = this.datasourceTransformations[newIndex].id;
            this.clickRow(newIndex, newID);
        });

    }

    clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

}


