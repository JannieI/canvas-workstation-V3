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
        this.globalVariableService.getBackgroundColorsDefault().then(res => {

            this.backgroundcolorsDefault = res;

            // Sort the lists
            this.backgroundcolorsDefault.sort( (obj1,obj2) => {
                if (obj1.name > obj2.name) {
                    return 1;
                };
                if (obj1.name < obj2.name) {
                    return -1;
                };
                return 0;
            });
        });
        this.globalVariableService.getBackgroundColors().then(res => {
            this.backgroundcolors = res;

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

    clickAvailable(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.availableBgIndex = index;
    }

    clickSelected(index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelected', '@Start');

        this.selectedBgIndex = index;
    }

    clickAddNew() {
        // Add text for a new tag
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAddNew', '@Start');

        // Validation
        if (this.newColorName == ''  ||  this.newColorName == null  ||  this.newColorName == undefined) {
            return;
        };
        if (this.newColorCode == ''  ||  this.newColorCode == null  ||  this.newColorCode == undefined) {
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
                name: this.newColorName,
                cssCode: this.newColorCode,
                shortList: false
            };
                
        this.globalVariableService.addBackgroundColor(newCSSColour).then(res => {
            this.backgroundcolors.push(res);
        });


    }

    clickAdd() {
        // Add Bg colour that is selected on the Avaliable list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

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
                
        this.globalVariableService.addBackgroundColor(newCSSColour).then(res => {
            this.backgroundcolors.push(res);
        });

    }

    dblclickDelete(id: number, index: number){
        // Delete the selected Color
        this.globalFunctionService.printToConsole(this.constructor.name,'dblclickDelete', '@Start');
console.warn('xx ..', id, index)
        // Remove from seleted list
        this.globalVariableService.deleteBackgroundColor(id).then(res => {
            this.backgroundcolors.splice(index, 1);
        });

    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formManageColoursClosed.emit(action);
    }

}

