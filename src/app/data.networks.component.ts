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
import { NavigatorNetwork }           from './models';

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
            this.clickClose();
            return;
        };

    }

    editing: boolean = false;  // TODO - must be received via @Input
    navigatorNetworks: NavigatorNetwork[];
    errorMessage: string = '';
    selectedRow: number = 0;
    selectedNavigatorNetwork: NavigatorNetwork = null;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedPropertyDS: number = -1;
    selectedRelationshipDS: number = -1;

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

    clickClose() {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formDataNetworksClosed.emit('Close');
    }

    clickAdd() {
        // Add, and then close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

		this.formDataNetworksClosed.emit('Update');
    }

    clickSave() {
        // Save, and then close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

		this.formDataNetworksClosed.emit('Update');
    }
}
