/*
 * Shows form to manage Navigator Networks
 */

// Angular
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { HostListener }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { ViewChild }                  from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { NavigatorHistory }           from './models';

@Component({
    selector: 'data-networks',
    templateUrl: './data.networks.component.html',
    styleUrls: ['./data.networks.component.css']
})
export class DataNetworksComponent implements OnInit { 

    @Output() formDataNetworksClosed: EventEmitter<string> = new EventEmitter();
    @ViewChild('widgetDOM') widgetDOM: ElementRef;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();

        // Known ones
        if (event.code === 'Escape'  &&  (!event.ctrlKey)  &&  (!event.shiftKey)  ) {
            this.clickClose('Close');
            return;
        };

    }

    navigatorNetworks: NavigatorHistory[];
    errorMessage: string = '';
    selectedRow: number = 0;

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.globalVariableService.getResource('navigatorNetworks')
            .then (nw => this.navigatorNetworks = nw)
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks reading navigatorNetworks: ' + err);
            });
    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;
    }

    clickClose(action: string) {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDataNetworksClosed.emit(action);
    }
}
