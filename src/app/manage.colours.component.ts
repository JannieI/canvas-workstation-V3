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
import { CSScolor }                   from './models';


@Component({
    selector: 'manage-colours',
    templateUrl: './manage.colours.component.html',
    styleUrls: ['./manage.colours.component.css']
})
export class ManageColoursComponent implements OnInit {

    @Output() formManageColoursClosed: EventEmitter<string> = new EventEmitter();

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

    // availableDashboardTags: DashboardTag[] = [];
    availableBgIndex: number = -1;
    backgroundcolors: CSScolor[];
    backgroundcolorsDefault: CSScolor[];
    errorMessage: string = '';
    newColorCode: string = '';
    newColorName: string = '';
    selectedBgIndex: number = -1;

	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Get setup info
        this.globalVariableService.getResource('canvasBackgroundcolorsDefault')
            .then(res => {
                this.backgroundcolorsDefault = res.slice();

                // Sort the list
                this.backgroundcolorsDefault.sort( (obj1,obj2) => {
                    if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                        return 1;
                    };
                    if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                        return -1;
                    };
                    return 0;
                });
            })
            .catch(err => {
                this.errorMessage = err;
            });
        this.globalVariableService.getResource('canvasBackgroundcolors').then(res => {
            this.backgroundcolors = res.slice();

            // Sort the list
            this.backgroundcolors.sort( (obj1,obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });
        });

    }

    clickAvailable(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        // Reset 
        this.errorMessage = '';
 
        this.availableBgIndex = index;
    }

    clickSelected(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelected', '@Start');

        // Reset 
        this.errorMessage = '';
 
        this.selectedBgIndex = index;
    }

    clickAddNew() {
        // Add text for a new tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddNew', '@Start');

        // Reset 
        this.errorMessage = '';

        // Validation
        if (this.newColorName == ''  ||  this.newColorName == null  ||  this.newColorName == undefined) {
            this.errorMessage = 'Name is compulsory';
            return;
        };
        if (this.newColorCode == ''  ||  this.newColorCode == null  ||  this.newColorCode == undefined) {
            this.errorMessage = 'Code is compulsory';
            return;
        };
        if (this.newColorCode.substring(0, 1) != '#') {
            this.errorMessage = 'Code must start with #';
            return;
        };
        
        console.warn('xx len', this.backgroundcolors.length, this.backgroundcolorsDefault.length);
        
        let isFound: boolean = false;
        this.backgroundcolors.forEach(bg => {
            if (bg.name == this.newColorName) {
                isFound = true;
            }
        });
        if (isFound) {
            this.errorMessage = 'Colour already exists'
            return;
        };

        // Add to DB, and local Array
        let newCSSColour: CSScolor =
            {
                id: null,
                name: this.newColorName,
                cssCode: this.newColorCode,
                shortList: false
            };
                
        this.globalVariableService.addResource('canvasBackgroundcolors', newCSSColour).then(res => {
            console.warn('xx res', res);
            
            this.backgroundcolors.push(res);

            // Sort the lists
            this.backgroundcolors.sort( (obj1,obj2) => {
                if (obj1.name > obj2.name) {
                    return 1;
                };
                if (obj1.name < obj2.name) {
                    return -1;
                };
                return 0;
            });                
        });

    }

    clickAdd() {
        // Add Bg colour that is selected on the Avaliable list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Reset 
        this.errorMessage = '';
 
        // Nothing to do
        if (this.availableBgIndex < 0) {
            return;
        };
        let isFound: boolean = false;
        this.backgroundcolors.forEach(bg => {
            if (bg.name == this.backgroundcolorsDefault[this.availableBgIndex].name) {
                isFound = true;
            }
        });
        if (isFound) {
            return;
        };

        // Add to DB, and local Array
        let newCSSColour: CSScolor =
            {
                id: null,
                name: this.backgroundcolorsDefault[this.availableBgIndex].name,
                cssCode: this.backgroundcolorsDefault[this.availableBgIndex].cssCode,
                shortList: this.backgroundcolorsDefault[this.availableBgIndex].shortList
            };
                
        this.globalVariableService.addResource('canvasBackgroundcolors', newCSSColour).then(res => {

            this.backgroundcolors.push(res);
            
            // Sort the lists
            this.backgroundcolors.sort( (obj1,obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });                

        });

    }

    dblclickDelete(id: number, index: number){
        // Delete the selected Color
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');
console.warn('xx ..', id, index)

        // Reset 
        this.errorMessage = '';
 
        // Remove from seleted list
        this.globalVariableService.deleteResource('canvasBackgroundcolors', id).then(res => {
            this.backgroundcolors.splice(index, 1);

            // Sort the lists
            this.backgroundcolors.sort( (obj1,obj2) => {
                if (obj1.name.toLowerCase() > obj2.name.toLowerCase()) {
                    return 1;
                };
                if (obj1.name.toLowerCase() < obj2.name.toLowerCase()) {
                    return -1;
                };
                return 0;
            });                
        });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formManageColoursClosed.emit(action);
    }

}

