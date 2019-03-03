/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { CanvasGroup }                from './models';
import { CanvasUser }                 from './models';
import { DatasourcePermission }       from './models';
import { Datasource }                 from './models';

@Component({
    selector: 'data-description',
    templateUrl: './data.description.component.html',
    styleUrls: ['./data.description.component.css']
})
export class DatasourceDescriptionComponent implements OnInit {

    @Output() formDataDatasourceDescriptionClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[];
    errorMessage: string = '';
    infoMessage: string = '';
    selectedDatasource: Datasource;
    selectedRowIndex: number = 0;

    
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.datasources = this.globalVariableService.datasources
            .slice()
            .sort( (obj1, obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });

        if (this.datasources.length > 0) {
            this.selectedDatasource = this.datasources[0];
        };

    }

    clickRow(index: number, id: number) {
        // Highlight selected Row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Set seletected index - used for highlighting row
        this.selectedRowIndex = index;
        this.selectedDatasource = JSON.parse(JSON.stringify(this.datasources[index]));
    }

    clickSave() {
        // Save the DS
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Reset
        this.errorMessage = '';
        this.infoMessage = '';

        // Validation
        if (this.selectedDatasource.name == ''  ||  this.selectedDatasource.name == null) {
            this.errorMessage = 'Please enter a Name for the Datasource';
            return;
        };
        if (this.selectedDatasource.description == ''  ||  this.selectedDatasource.description == null) {
            this.errorMessage = 'Please enter a Description for the Datasource';
            return;
        };

        // Warn that access list was deleted
        if (this.datasources[this.selectedRowIndex].accessType == 'AccessList'
            &&
            this.selectedDatasource.accessType != 'AccessList') {

                // Delete the old DS Permissions
                this.globalVariableService.getDatasourcePermissions().then(res => {
                    res.forEach(dP => {
                        if (dP.datasourceID == this.selectedDatasource.id) {
                            this.globalVariableService.deleteDatasourcePermission(
                                dP.datasourceID
                            );
                        };
                    });
                });
                this.errorMessage = 'Warning; the existing access list was deleted.';
            };

        // Update DS
        this.globalVariableService.saveResource('datasources', this.selectedDatasource).then(res => {
            this.infoMessage = 'Datasource Saved';
          
            this.datasources = this.globalVariableService.datasources
                .slice()
                .sort( (obj1, obj2) => {
                    if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });

            if (this.datasources.length > 0) {
                this.selectedDatasource = this.datasources[0];
            };            
        });


    }

    clickClose(action: string) {
        // Close the form, nothing saved at this moment
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        console.log('clickClose')

		this.formDataDatasourceDescriptionClosed.emit(action);
    }
}
