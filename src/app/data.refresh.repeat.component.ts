/*
 * Repeatly refresh the Datasources for the current Dashboard.
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { Datasource }                 from './models';
 
@Component({
    selector: 'data-refresh-repeat',
    templateUrl: './data.refresh.repeat.component.html',
    styleUrls: ['./data.refresh.repeat.component.css']
})

export class DataRefreshRepeatComponent implements OnInit {

    @Output() formDataRefreshRepeatClosed: EventEmitter<string> = new EventEmitter();

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
    minutes: string = '';
    errorMessage: string = '';

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: HttpClient,
	) {}

	ngOnInit() {
        // Initialise
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // this.globalVariableService.getResources('datasources').then(dc => {
        //     // Fill local Var
        //     this.datasources = dc.slice();
        //     console.warn('xx this.datasources.length', this.datasources.length)
            
        //     // Click on first one, if available
        //     if (this.datasources.length > 0) {
        //         this.clickRow(0, this.datasources[0].id);
        //     };
        // });

    }

    returnHttpGet() {
        // Get HTML
        this.globalFunctionService.printToConsole(this.constructor.name,'returnHttpGet', '@Start');

        // TODO - fix CORS & Authorisation
        // return this.http.get('https://stackoverflow.com/questions/43489689/use-angular-2-service-from-regular-js-in-browser')
        return this.http.get('https://www.w3schools.com/')
    }

    clickHttpGet() {
        // User clicked Get with URL
        this.globalFunctionService.printToConsole(this.constructor.name,'clickHttpGet', '@Start');

        // Reset
        this.errorMessage = '';

        // Get html
        this.returnHttpGet().subscribe((data: any) => {
            console.warn('xx HOLY MOLY 3', data)
        },
        err => {
            this.errorMessage = err.message;
        });



        // // code for IE7+, Firefox, Chrome, Opera, Safari
        // let xmlhttp = new XMLHttpRequest();
        
        // xmlhttp.onreadystatechange=function()
        //     {
        //         if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        //             console.warn('HOLY MOLY', xmlhttp.responseText);
        //         };
        //     }

        // // Setup callback
        // xmlhttp.onload = function() {
        //     console.warn('HOLY MOLY !!', this.responseXML );
        // }

        // xmlhttp.open("GET", 'https://stackoverflow.com/questions/43489689/use-angular-2-service-from-regular-js-in-browser', false);
        // // xmlhttp.send();    
        // console.warn('xx after SEND')
    }
    
    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

        this.formDataRefreshRepeatClosed.emit(action);

    }

    clickGo() {
        // Start refreshing
        this.globalFunctionService.printToConsole(this.constructor.name,'clickGo', '@Start');

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
