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
import { Datasource }                 from './models';
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

    datasourceNames: string[] = [];
    datasources: Datasource[] = [];
    editing: boolean = false;  // TODO - must be received via @Input
    errorMessage: string = '';
    navigatorNetworks: NavigatorNetwork[];
    selectedDashboardRelationshipID: number = -1;
    selectedDashboardPropertyID: number = -1;
    selectedRow: number = 0;
    selectedNavigatorNetwork: NavigatorNetwork = null;
    selectedNetworkName: string = '';
    selectedNetworkDescription: string = '';
    selectedPropertyDS: string = '';
    selectedRelationshipDS: string = '';

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

        // Get Datasource list
        this.globalVariableService.getResource('datasources')
            .then(res => {
                this.datasources = res;
                this.datasources.forEach(ds => {
                    this.datasourceNames.push(ds.name + ' (' + ds.id + ')');
                });
                this.datasourceNames = this.datasourceNames.sort( (obj1,obj2) => {
                    if (obj1.toLowerCase() > obj2.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.toLowerCase() < obj2.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
                this.datasourceNames = ['', ...this.datasourceNames];
            })
            .catch(err => {
                this.errorMessage = err.slice(0, 100);
                console.error('Error in Data.Networks reading datasources: ' + err);
            });


    }

    clickRow(index: number, id: number) {
        // User clicked a row, now refresh the graph
        this.globalFunctionService.printToConsole(this.constructor.name,'clickRow', '@Start');

        this.selectedRow = index;

        // Show data for selected record
        console.log('xx ...', this.navigatorNetworks[this.selectedRow])
        this.selectedNetworkName = this.navigatorNetworks[this.selectedRow].name;
        this.selectedNetworkDescription = this.navigatorNetworks[this.selectedRow].description;
        this.selectedDashboardRelationshipID = this.navigatorNetworks[this.selectedRow].relationshipDatasourceID;
        this.selectedDashboardPropertyID = this.navigatorNetworks[this.selectedRow].propertiesDatasourceID;
        
        // Find the Relationship record
        let relationshipIndex: number = this.datasources.findIndex(
            ds => ds.id == this.selectedDashboardRelationshipID); 
        if (relationshipIndex >= 0) {
            this.selectedRelationshipDS = this.datasources[relationshipIndex].name + ' (' 
                + this.datasources[relationshipIndex].id + ')';
        } else {
            this.selectedRelationshipDS = '';
        };
        
        // Find the Property record
        let propertyIndex: number = this.datasources.findIndex(
            ds => ds.id == this.selectedDashboardPropertyID); 
        if (propertyIndex >= 0) {
            this.selectedPropertyDS = this.datasources[propertyIndex].name + ' (' 
                + this.datasources[propertyIndex].id + ')';
        } else {
            this.selectedPropertyDS = '';
        };
        
            console.log('xx this.selectedRelationshipDS', this.selectedRelationshipDS, this.selectedPropertyDS)
    }

    changeSelectRelationshipDS(ev: any) {
        // User selected a Relationship DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectRelationshipDS', '@Start');
        
        let selectedDashboardString: string = ev.target.value;
        if (selectedDashboardString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardString.indexOf('(');
            let closeBracket: number = selectedDashboardString.indexOf(')');
            this.selectedDashboardRelationshipID = +selectedDashboardString.substring(openBracket + 1, closeBracket);

        } else {
            this.selectedDashboardRelationshipID = null;
        };

        console.log('xx ev.target.value', ev.target.value, this.selectedDashboardRelationshipID);

    }

    changeSelectPropertyDS(ev: any) {
        // User selected a Property DS
        this.globalFunctionService.printToConsole(this.constructor.name,'changeSelectPropertyDS', '@Start');
        let selectedDashboardString: string = ev.target.value;

        if (selectedDashboardString != 'None') {

            // Get D info
            let openBracket: number = selectedDashboardString.indexOf('(');
            let closeBracket: number = selectedDashboardString.indexOf(')');
            this.selectedDashboardRelationshipID = +selectedDashboardString.substring(openBracket + 1, closeBracket);

        } else {
            this.selectedDashboardRelationshipID = null;
        };

        console.log('xx ev.target.value', ev.target.value, this.selectedDashboardRelationshipID);

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
