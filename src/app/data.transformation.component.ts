/*
 * For a given datasource, this form lets the user create
 *
 */

// Angular
import { Component }                    from '@angular/core';
import { EventEmitter }                 from '@angular/core';
import { HostListener }                 from '@angular/core';
import { Input }                        from '@angular/core';
import { OnInit }                       from '@angular/core';
import { Output }                       from '@angular/core';
import { Router }                       from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	    from './global-function.service';
import { GlobalVariableService }        from './global-variable.service';

// Our Models
import { Datasource }                   from './models';
import { DatasourceTransformation }     from './models';
import { TransformationNEW }            from './models';
import { DatasourceTransformationValues }   from './models';
import { TransformationItemParameter }  from './models';
import { TransformationType }           from './models';
import { TransformationParameterType }  from './models';
import { TransformQuery, TransformConnection, TransformItem } from './models';


@Component({
    selector: 'data-transformation',
    templateUrl: './data.transformation.component.html',
    styleUrls:  ['./data.transformation.component.css']
})
export class DataTransformationComponent implements OnInit {

    @Input() selectedDatasource: Datasource;

    @Output() formDataTransformationClosed: EventEmitter<string> = new EventEmitter();

    // @TODO: Map sensible keybindings to often-used controls for ease of use.
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        //console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code == 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.ngClickClose('Close');
            return;
        };
    }

    // Globals used in confunction with Angular directives in the DOM/html templates
    ngTransformList: TransformationNEW[] = [];          // All possible transformations
    ngDSTransformList: DatasourceTransformation[] = [];  // All transformations applied to current DS
    ngCurrentTransform: TransformationNEW = null;       // The currently selected transformation
    ngCurrentDSTransform: DatasourceTransformation = null;   // The currently selected transform for this DS
    ngCurrentParameters: TransformationItemParameter[] = [];    // The parameter values and display data
    ngAdding: boolean = false;                          // True if adding a new Tr, click Save to complete
    ngEditing: boolean = false;                         // True if editing a selected Tr
    ngNrParameters: number = 0;                         // Nr of Parameters for current Tr
    ngPreviewData: object = {};                         // The preview data returned to the user
    ngAlertErrorMessage: string = '';                   // Error message that gets displayed to the user.
    ngPosition: string = 'top-middle';                  // The position of the signpost. This should 
                                                        // get moved into CSS.

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private router: Router,
	) {}

	ngOnInit() { 
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        Promise.all([
            this.globalVariableService.getResource('datasourceTransformations'), 
            this.globalVariableService.getResource('transformations')
        ])
          .then(values => {

            const dtr: DatasourceTransformation[] = values[0];  // Resolved response from getDatasourceTransformations() Promise.
            this.ngTransformList = values[1];   // Resolved response from getTransformations() Promise.

            // Only show Datasource Transformations for the current data source.
            // @Speed: Change this to only return data for the current data source. Will have to make it
            // play nice with the cache.    - Ivan (22 March 2019)
            this.ngDSTransformList = dtr.filter(ftr =>
                ftr.datasourceID == this.selectedDatasource.id
            ).sort( (obj1,obj2) => {
                if (obj1.seq > obj2.seq) {
                    return 1;
                };
                if (obj1.seq < obj2.seq) {
                    return -1;
                };
                return 0;
            });

            // Select the first datasource transformation, if we have one.
            if (this.ngDSTransformList.length > 0) {
                this.ngCurrentDSTransform = this.ngDSTransformList[0];
                this.ngUpdateParameters();
                this.ngClickRow(this.ngCurrentDSTransform);
            };

            // Bring some data back
            this.ngClickPreview();
            
          })
          .catch(error => {
            this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', 'Promise.all error :' + error.message)
            this.ngAlertErrorMessage = 'Could not initialise the form properly. Please check Canvas Server.'
          });
    }

    ngUpdateParameters() {
        // Create an array which contains the parameter values that need to get bound and displayed
        // by Angular.

        // @Refactor: Do we even need this function? Can we not store all the parameter data globally
        // and simply refer to it as we change the current transformation pointer?  - Ivan (02 Mar 2019)


        this.globalFunctionService.printToConsole(this.constructor.name,'ngUpdateParameters', '@Start');

        this.ngCurrentParameters = [];
        if ( this.ngCurrentTransform ) {   
            // This fills in parameters from the default Transformation spec. Only used when
            // adding a new transformation.
            for (let parameter of this.ngCurrentTransform.parameters) {
                this.ngCurrentParameters.push({
                    seq:            parameter.seq,
                    displayName:    parameter.displayName,
                    tooltip:        parameter.tooltip,
                    type:           parameter.type,
                    defaultValue:   parameter.defaultValue,
                    value:          parameter.defaultValue,
                    cannotBeEmpty:  parameter.cannotBeEmpty
                });
            }
            this.ngNrParameters = this.ngCurrentTransform.parameters.length;
        } else if ( this.ngCurrentDSTransform ) {
            // This fills in parameters from the currently selected Datasource Transformation 
            // value. Which should already be in the DB.
            let extraData: TransformationNEW = this.ngTransformList.find(
                x => x.type === this.ngCurrentDSTransform.type
            );
            for (let parameter of this.ngCurrentDSTransform.parameterValues) {

                // Get some additional parameter data from the Transformation parameter data
                let extraParameterData: TransformationItemParameter = extraData.parameters.find(
                    x => x.type === parameter.type
                );
                this.ngCurrentParameters.push({
                    seq: extraParameterData.seq,
                    displayName: extraParameterData.displayName,
                    tooltip: extraParameterData.tooltip,
                    type: parameter.type,
                    defaultValue: extraParameterData.defaultValue,
                    value: parameter.value,
                    cannotBeEmpty: parameter.cannotBeEmpty
                });
            }
            this.ngNrParameters = this.ngCurrentDSTransform.parameterValues.length;
        } else {
            this.ngNrParameters = 0;
        }
    }

    ngClickAdd() {
        // Let the user add a new Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickAdd', '@Start');

        this.ngNrParameters = 0;

        // Auto select first one
        if (this.ngTransformList.length > 0) {
            this.ngCurrentTransform = this.ngTransformList[0]
            this.ngUpdateParameters();
        };

        // Open form
        this.ngAdding = true;

    }

    ngClickCancel() {
        // Cancel Editing Transformation parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickCancel', '@Start');
        
        // Restore form
        this.ngAlertErrorMessage = '';
        this.ngCurrentTransform = null;
        this.ngUpdateParameters();

        // Cancel Editing
        this.ngAdding = false;
        this.ngEditing = false;
    }

    ngClickSave() {
        // Save Transformation and its parameters
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickSave', '@Start');

        // Reset
        this.ngAlertErrorMessage = '';

        // Validate
        for (let parameter of this.ngCurrentParameters) {

            // Check for missing values where there should be a value
            if (parameter.cannotBeEmpty && ( parameter.value === '' )) {
                this.ngAlertErrorMessage = parameter.displayName + ' cannot be empty.';
                return;
            }

            // Check parameter types more thoroughly.
            switch (parameter.type) {

              case (TransformationParameterType.delimiter): break;

              case (TransformationParameterType.expression):
                
                // @TODO: Add a possible regex check for the format of an expression which
                // makes sure that we get something of the form 'A=B+C' and that the field
                // names are validated against the data.        - Ivan (29 Mar 2019)

                // Check that there is an equals sign.
                if ( parameter.value.search('=') === -1 ) {
                    this.ngAlertErrorMessage = parameter.displayName + ' must be an equation of the form "A=B+C".'
                    return;
                }
                break;

              case (TransformationParameterType.fieldAlias): break;
              case (TransformationParameterType.fieldName): break;
              case (TransformationParameterType.fieldNames): break;

              case (TransformationParameterType.keepOriginalField): 
                if ( ( parameter.value !== 'True' ) && ( parameter.value !== 'False' ) ) {
                    this.ngAlertErrorMessage = parameter.displayName + ' must be either "True" or "False".';
                    return;
                }
                break;
                
              case (TransformationParameterType.keepOriginalFields):
                if ( ( parameter.value !== 'True' ) && ( parameter.value !== 'False' ) ) {
                    this.ngAlertErrorMessage = parameter.displayName + ' must be either "True" or "False".';
                    return;
                }
                break;              

              case (TransformationParameterType.newFieldName): break;
              default:
                console.log('ERROR: No matching parameter type.');
                return;
            }
        }

        // Add NEW record
        if ( this.ngAdding ) {

            // Create max Sequence
            let newSequence: number = 1;
            if (this.ngDSTransformList.length > 0) {
                newSequence = this.ngDSTransformList[this.ngDSTransformList.length - 1].seq + 1;
            };

            let newParameters: DatasourceTransformationValues[] = []

            // Store the new parameters into an object that can be embeded.
            for (let parameter of this.ngCurrentParameters) {
                newParameters.push({
                    type: parameter.type,
                    value: parameter.value,
                    cannotBeEmpty: parameter.cannotBeEmpty
                });
            }

            // Create New record
            let newDatasourceTransformation: DatasourceTransformation = {
                id: null,
                type: this.ngCurrentTransform.type,
                datasourceID: this.selectedDatasource.id,
                seq: newSequence,
                parameterValues: newParameters
            };

            // Save to DB
            this.globalVariableService.addResource(
                'datasourceTransformations', 
                newDatasourceTransformation
                )
              .then(dtr  => {
                console.log('Object returned on insert is :', dtr);

                // dtr.ops[0] is the DS Transform object that's returned with an _id from the DB.
                // We store this in our DSTransformList array.
                let _id: string = dtr.ops[0]._id;
                this.ngDSTransformList.push(dtr.ops[0]);
                this.ngCurrentTransform = null;         // Clear this since we're not adding anymore.  

                // Disable
                this.ngAdding = false;
                this.ngEditing = false;

                this.ngClickRow(this.ngDSTransformList.find( x => x._id === _id ));

              })
              .catch(() => {
                this.ngAlertErrorMessage = 'Could not save data! Please check Canvas Server.';
              });

        } else if ( this.ngEditing ) {
            // Save EDITs
            let newParameters: DatasourceTransformationValues[] = []

            // Get the parameter values from the array which is data-bound to the input boxes.
            for (let parameter of this.ngCurrentParameters) {
                newParameters.push({
                    type: parameter.type,
                    value: parameter.value,
                    cannotBeEmpty: parameter.cannotBeEmpty
                })
            }

            // Create New record
            let newDatasourceTransformation: DatasourceTransformation = {
                _id: this.ngCurrentDSTransform._id,
                id: null,
                type: this.ngCurrentDSTransform.type,
                datasourceID: this.selectedDatasource.id,
                seq: this.ngCurrentDSTransform.seq,
                parameterValues: newParameters
            };

            // Save to DB
            this.globalVariableService.saveResource(
                'datasourceTransformations',
                newDatasourceTransformation
                )
              .then(data => {
                
                // Update the DSTransformationItem Parameters to match CurrentParameters.
                const updatedIndex: number = this.ngDSTransformList.indexOf(this.ngCurrentDSTransform)
                this.ngDSTransformList[updatedIndex].parameterValues = newParameters;

                // Disable
                this.ngAdding = false;
                this.ngEditing = false;

                // Update the parameters
                this.ngClickRow(this.ngDSTransformList.find(
                    x => x._id === this.ngCurrentDSTransform._id 
                ));
              })
              .catch(err => {
                this.ngAlertErrorMessage = 'Could not save data! Please check Canvas Server.';
              });
        };
    }

    ngClickRow(row: DatasourceTransformation) {
        // Don't do anything if we are busy with the transformation adding/editing.
        if (this.ngAdding || this. ngEditing) return;

        // Click on DatasourceTransformation row
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickRow', '@Start');

        // Set seletected index - used for highlighting row
        this.ngCurrentDSTransform = row;
        this.ngUpdateParameters();

        console.log(this.ngCurrentDSTransform);
    }

    ngClickMoveUp(row: DatasourceTransformation) {
        // Don't do anything if we are busy with the transformation adding/editing.
        if (this.ngAdding || this. ngEditing) return;

        // Move Transformation Up
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickMoveUp', '@Start');

        // Don't do anything if this is number 1
        if ( row.seq === 1 ) return;

        let previousRow: DatasourceTransformation = this.ngDSTransformList.find( d => d.seq === row.seq - 1 )
        
        if ( !previousRow ) {
            // @TODO: Error checking. Notify the user that we could not find the previous record.
        }

        // Adjust the current row up one.
        row.seq -= 1;
        previousRow.seq += 1;

        // Update DB with both changes then update local data

        // @Robustness: This should be changed eventually to issue one http call so that there
        // isn't a risk of one PUT request failing and leaving the DB in an inconsistent state.
        //                                                              - Ivan (29 Mar 2019)
        Promise.all([
            this.globalVariableService.saveResource('datasourceTransformations', row),
            this.globalVariableService.saveResource('datasourceTransformations', previousRow)
        ])
          .then(() => {

            // Modify the internal data
            // First the current record...
            let index: number = this.ngDSTransformList.indexOf(
                this.ngDSTransformList.find( x => x._id === row._id ));
            this.ngDSTransformList[index] = row;

            // ... and then the previous record.
            index = this.ngDSTransformList.indexOf(
                this.ngDSTransformList.find( x => x._id === previousRow._id ));
            this.ngDSTransformList[index] = previousRow;

            this.ngDSTransformList.sort((obj1,obj2) => {
                if (obj1.seq > obj2.seq) {
                    return 1;
                };
                if (obj1.seq < obj2.seq) {
                    return -1;
                };
                return 0;
            });

            this.ngCurrentDSTransform = row;
          })
          .catch(err => {
            this.ngAlertErrorMessage = 'Could not save data! Please check Canvas Server.';
          });
    }

    ngClickMoveDown(row: DatasourceTransformation) {
        // Don't do anything if we are busy with the transformation adding/editing.
        if (this.ngAdding || this. ngEditing) return;

        // Move Transformation Down
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickMoveDown', '@Start');

        // Don't do anything if this is the last sequence in the array
        const lastRow: DatasourceTransformation = this.ngDSTransformList[this.ngDSTransformList.length - 1]
        if ( row.seq === lastRow.seq) return;

        let nextRow: DatasourceTransformation = this.ngDSTransformList.find( d => d.seq === row.seq + 1 )
        if ( !nextRow ) {
            // @TODO: Error checking. Notify the user that we could not find the next element.
            console.log('error!!!!!');
        }

        // Adjust the current row up down.
        row.seq += 1;
        nextRow.seq -= 1;

        // Update DB with both changes then update local data
        Promise.all([
            this.globalVariableService.saveResource('datasourceTransformations', row),
            this.globalVariableService.saveResource('datasourceTransformations', nextRow)
        ])
          .then(() => {

            // Modify the internal data
            // First the current record...
            let index: number = this.ngDSTransformList.indexOf(
                this.ngDSTransformList.find( x => x._id === row._id ));
            this.ngDSTransformList[index] = row;

            // ... and then the previous record.
            index = this.ngDSTransformList.indexOf(
                this.ngDSTransformList.find( x => x._id === nextRow._id ));
            this.ngDSTransformList[index] = nextRow;

            this.ngDSTransformList.sort((obj1,obj2) => {
                if (obj1.seq > obj2.seq) {
                    return 1;
                };
                if (obj1.seq < obj2.seq) {
                    return -1;
                };
                return 0;
            });

            this.ngCurrentDSTransform = row;
          })
          .catch(err => {
            this.ngAlertErrorMessage = 'Could not save data! Please check Canvas Server.';
          });
    }
 
    ngClickEdit(row: DatasourceTransformation) {
        // Don't do anything if we are busy with the transformation adding/editing.
        if (this.ngAdding || this. ngEditing) return;

        // Edit Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickEdit', '@Start');

        // Open form for editing
        this.ngEditing = true;
    }

    ngDblclickDelete(row: DatasourceTransformation) {
        // Don't do anything if we are busy with the transformation adding/editing.
        if (this.ngAdding || this. ngEditing) return;
        
        // Delete Transformation
        this.globalFunctionService.printToConsole(this.constructor.name,'ngDblclickDelete', '@Start');

        //Delete from DB first, then update local store.
        this.globalVariableService.deleteResource(
            'datasourceTransformations', 
            this.ngCurrentDSTransform.id
            )
          .then(res => {
            
            // Find the record in our DS Tansform array and remove it
            const deletedIndex: number = this.ngDSTransformList.indexOf(this.ngCurrentDSTransform)
            this.ngDSTransformList.splice(deletedIndex, 1);

            // Select the first row
            if ( this.ngDSTransformList.length > 0 ) {
                this.ngClickRow(this.ngDSTransformList[0]);
            } else {
                this.ngCurrentDSTransform = null;
                this.ngUpdateParameters();
            }
          })
          .catch(err => {
            this.ngAlertErrorMessage = 'Could not delete data! Please check Canvas Server.';
          });
    }

    ngClickClose(action: string) {
        
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickClose', '@Start');

        this.formDataTransformationClosed.emit(action);

    }

    ngGetTransformationDisplayName(type: TransformationType): string {
        // @Redundancy: This function shouldn't really exist. If the transformation types were normalised
        // in the DB, then we would simply look up the display name from that table, instead of having that
        // look up be coded into the application logic.         - Ivan (22 March 2019)

        let displayName: string;

        switch(type) {
            case TransformationType.split:          displayName = 'Split'; break;
            case TransformationType.join:           displayName = 'Join'; break;
            case TransformationType.to_upper:       displayName = 'To Upper'; break;
            case TransformationType.to_lower:       displayName = 'To Lower'; break;
            case TransformationType.to_proper:      displayName = 'To Proper'; break;
            case TransformationType.trim:           displayName = 'Trim'; break;
            case TransformationType.leave_num:      displayName = 'Only Numbers'; break;
            case TransformationType.leave_char:     displayName = 'Only Characters'; break;
            case TransformationType.weekday:        displayName = 'Weekday'; break;
            case TransformationType.month:          displayName = 'Month'; break;
            case TransformationType.day:            displayName = 'Day'; break;
            case TransformationType.hour:           displayName = 'Hour'; break;
            case TransformationType.minute:         displayName = 'Minute'; break;
            case TransformationType.second:         displayName = 'Second'; break;
            case TransformationType.week:           displayName = 'Week'; break;
            case TransformationType.day_of_year:    displayName = 'Day of the Year'; break;
            case TransformationType.quarter:        displayName = 'Quarter'; break;
            case TransformationType.arithmetic:     displayName = 'Arithmetic'; break;
            default:                                displayName = '';
        }

        return displayName;
    }

    isEqual(object1: object | null, object2: object | null): boolean {
        // Checks whether two objects are equal or not. This function checks nested properties
        // for differences as well, which native JS functions don't do.

        let value: boolean;

        // Handle the cases where one or both of the objects are empty.
        if ( (object1 == null) && (object2 == null) ) {
            return true;
        } else if ( (object1 == null) || (object2 == null) ) {
            return false;
        } else {

            // Look through object1's keys and try find matches in object2.
            for (let key in object1) {
                if ( !(key in object2) ) {
                    return false;
                } else {
                    
                    // Check the values within the keys are equal.

                    // Check the type of the object properties and perform recursion if they're 
                    // objects, as JS can't implement a proper equality check for objects.
                    if ( (typeof object1[key] === 'object') && (typeof object2[key] === 'object') ) {
                        value = this.isEqual(object1[key], object2[key]);
                        if (value === false) return false;
                    } else if ( object1[key] !== object2[key] ) {
                        return false;
                    }
                }
            }

            // Look through object2's keys and try find matches in object1.
            for (let key in object2) {
                if ( !(key in object1) ) {
                    return false;
                } else {
                    
                    // Check the values within the keys are equal.

                    // Check the type of the object properties and perform recursion if they're 
                    // objects, as JS can't implement a proper equality check for objects.
                    if ( (typeof object1[key] === 'object') && (typeof object2[key] === 'object') ) {
                        value = this.isEqual(object1[key], object2[key]);
                        if (value === false) return false;
                    } else if ( object1[key] !== object2[key] ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    ngClickPreview() {

        // Preview Transformation Data
        this.globalFunctionService.printToConsole(this.constructor.name,'ngClickPreview', '@Start');

        const test: TransformQuery = this.buildTransformationQuery();
        if (test) {
            console.log('Transformation query is :', JSON.stringify(test));
            this.globalVariableService.sendTransformationQuery(test)
            .then(data => {
                this.ngPreviewData = data;
            })
            .catch(() => {
                this.ngPreviewData = {};
                this.ngAlertErrorMessage = 'No preview data was returned. Check Canvas Server';
            });
        } else {
            this.ngAlertErrorMessage = 'Could not create transformation query. No preview available .';
        }
    }

    buildTransformationQuery(): TransformQuery | null {

        // Helper function which sets all the necessary parameters for a given transform object.
        function updateParameters(dataTransform: DatasourceTransformationValues[], transform: object) {
            for (let parameter of dataTransform) {
                switch (parameter.type) {

                  case TransformationParameterType.fieldName:
                    transform['fieldName'] = parameter.value;
                    break;

                  case TransformationParameterType.fieldAlias:
                    transform['fieldAlias'] = 'a';
                    break;

                  case TransformationParameterType.delimiter:
                    transform['delimiter'] = parameter.value;
                    break;

                  case TransformationParameterType.fieldNames:
                    // Due to limitations, multiple field names are stored as a CSV string.
                    // We need to split it and trim whitespace before it can be passed on.
                    transform['fieldNames'] = parameter.value.split(',');
                    for (let i=0; i < transform['fieldNames'].length; i++) {
                        transform['fieldNames'][i] = transform['fieldNames'][i].trim();
                    }
                    break;

                  case TransformationParameterType.keepOriginalField:
                    transform['keepOriginalField'] = parameter.value;
                    break;

                  case TransformationParameterType.newFieldName:
                    transform['newFieldName'] = parameter.value;
                    break;

                  case TransformationParameterType.keepOriginalFields:
                    transform['keepOriginalFields'] = parameter.value;
                    break;

                  case TransformationParameterType.expression:
                    transform['expression'] = parameter.value;
                    break;

                  default:
                    console.log('Unknown parameter type.', parameter);
                    return null;
                }
            }
        }

        let transformQuery: TransformQuery;
        let connection: TransformConnection;
        let transform: TransformItem;
        let resultOffset: number = 0;

        // Create the skeleton of the transformation query and fill in the components as needed.
        transformQuery = {
            version: "0.1.0",
            connections: [],
            transforms: [],
            returnOffset: [],
            returnFirst: 8,
            resultOrient: 'split'
        }
        
        // First we add in the necessary connections to the datasources.
        if ( (this.selectedDatasource.type.toLowerCase() === 'file') &&         
                (this.selectedDatasource.subType.toLowerCase() === 'csv') ) {
            connection = {
                type: 'csv-mongo',
                id: this.selectedDatasource.id
            };
        } else {
            console.log('Selected datasource is not supported yet.', this.selectedDatasource);
            return null;
        }
        transformQuery['connections'].push(connection);

        // Each transformation step is added here.
        // Add the fetch instruction as the first one, always.
        transformQuery['transforms'].push({
            type: 'fetch',
            connOffset: 0,
            alias: 'a',
            resultOffset: resultOffset
        });

        // Add each transform that the user selected.
        for (let dataTransform of this.ngDSTransformList) {
            switch (dataTransform.type) {

              case TransformationType.split: 
                transform = {
                    type: "function",
                    function: "split",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    delimiter: "",
                    fieldNames: [],
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.join:
                transform = {
                    type: "function",
                    function: "join",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    delimiter: "",
                    fieldNames: [],
                    keepOriginalFields: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.to_upper:
                transform = {
                    type: "function",
                    function: "to_upper",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.to_lower:
                transform = {
                    type: "function",
                    function: "to_lower",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.to_proper:
                 transform = { 
                    type: "function",
                    function: "to_proper",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.trim:
                transform = {
                    type: "function",
                    function: "trim",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.leave_num:
                transform = {
                    type: "function",
                    function: "leave_num",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.leave_char:
                transform = {
                    type: "function",
                    function: "leave_char",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.weekday:
                transform = {
                    type: "function",
                    function: "weekday",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.month:
                transform = {
                    type: "function",
                    function: "month",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.day:
                transform = {
                    type: "function",
                    function: "day",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.hour:
                transform = {
                    type: "function",
                    function: "hour",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.minute:
                transform = {
                    type: "function",
                    function: "minute",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.second:
                transform = {
                    type: "function",
                    function: "second",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.week:
                transform = {
                    type: "function",
                    function: "week",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.day_of_year:
                transform = {
                    type: "function",
                    function: "day_of_year",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }
                break;

              case TransformationType.quarter:
                transform = {
                    type: "function",
                    function: "quarter",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    newFieldName: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              case TransformationType.arithmetic:
                transform = {
                    type: "function",
                    function: "arithmetic",
                    sourceResultOffset: resultOffset,
                    fieldName: "",
                    fieldAlias: "",
                    expression: "",
                    keepOriginalField: false,
                    resultOffset: resultOffset + 1
                }              
                break;

              default: 
                console.log('Transform type is not supported yet.', dataTransform);
                return null;
            }
            updateParameters(dataTransform.parameterValues, transform);
            resultOffset += 1;
            //console.log('transform object is:', transform);
            transformQuery['transforms'].push(transform);
        }
        transformQuery['returnOffset'] = [ resultOffset ]

        //console.log('Transform query is:', transformQuery);
        return transformQuery;
    }
}
