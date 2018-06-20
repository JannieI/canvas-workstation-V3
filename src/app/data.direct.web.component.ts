/*
 * Data Dictionary for Datasources
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Datasource }                 from './models';
 
@Component({
    selector: 'data-direct-web',
    templateUrl: './data.direct.web.component.html',
    styleUrls: ['./data.direct.web.component.css']
})

export class DataDirectWebComponent implements OnInit {

    @Output() formDataDirectWebClosed: EventEmitter<string> = new EventEmitter();

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

    datasources: Datasource[] = [];
    element: string = '';
    newName: string = '';
    newDescription: string = '';
    url: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // this.globalVariableService.getDatasources().then(dc => {
        //     // Fill local Var
        //     this.datasources = dc.slice();
        //     console.warn('xx this.datasources.length', this.datasources.length)
            
        //     // Click on first one, if available
        //     if (this.datasources.length > 0) {
        //         this.clickRow(0, this.datasources[0].id);
        //     };
        // });

    }

    clickHttpGet(index: number, id: number) {
        // Get HTML
        this.globalFunctionService.printToConsole(this.constructor.name,'httpGet', '@Start');

        // code for IE7+, Firefox, Chrome, Opera, Safari
        let xmlhttp = new XMLHttpRequest();
        
        xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                    console.warn('HOLY MOLY', xmlhttp.responseText);
                };
            }
        xmlhttp.open("GET", 'https://stackoverflow.com/questions/43489689/use-angular-2-service-from-regular-js-in-browser', false);
        xmlhttp.send();    
        console.warn('xx after SEND')
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataDirectWebClosed.emit(action);

    }

    clickCancel() {
        // Cancel Editing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickCancel', '@Start');
        
        // // Re Fill the form
        // let datasourceIndex: number = this.datasources
        //     .findIndex(sch => sch.id == this.selectedDatasource.id);
        // if (datasourceIndex >= 0) {
        //     this.selectedDatasource = Object.assign({}, 
        //         this.datasources[datasourceIndex]
        //     );
        // };

        // // Reset
        // this.selectedDatasourcesRowIndex = null;
        // this.selectedDatasourceID = null;

    }

    clickSave() {
        // Save changes to the Datasource
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Save the changes
        // if (this.editing) {
        //     let datasourceIndex: number = this.datasources
        //         .findIndex(ds => ds.id == this.selectedDatasource.id);
        //     if (datasourceIndex >= 0) {
        //         this.datasources[datasourceIndex].dataDictionary = 
        //             this.selectedDatasource.dataDictionary
        //     };
        //     this.globalVariableService.saveDatasource(this.selectedDatasource)
        // };

    }

}
