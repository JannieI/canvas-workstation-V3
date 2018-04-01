/*
 * Visualise page, to view / present Dashboards previously created
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';

// Our Services
import { GlobalVariableService}       from './global-variable.service';

// Models
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';


@Component({
    selector: 'palette-buttonbar',
    templateUrl: './user.palette.buttonbar.component.html',
    styleUrls: ['./user.palette.buttonbar.component.css']
})
export class UserPaletteButtonBarComponent implements OnInit {

    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

    paletteButtons: PaletteButtonBar[];
    paletteButtonsOriginal: PaletteButtonBar[];
    paletteButtonsSelected: PaletteButtonsSelected[];


    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Set Selected and Total Available Arrays
        this.globalVariableService.getPaletteButtonBar().then( pb => {

            // Total list of available buttons - slice is NB for ByVal
            this.paletteButtons = pb.slice();
            this.paletteButtonsOriginal = pb.slice();
            this.paletteButtonsSelected = this.globalVariableService
                .currentPaletteButtonsSelected.value.slice();

            // Loop on selected ones in Available, and remove them
            let delIDs: number[] = [];
            for (var i = this.paletteButtons.length - 1; i >= 0; i--) {
                this.paletteButtonsSelected.forEach(pbs => {
                    if (this.paletteButtons[i].id == pbs.paletteButtonBarID) {
                        delIDs.push(i);
                    };
                });
            };
            delIDs.forEach( p => this.paletteButtons.splice(p, 1))

        });

    }

    clickAvailable(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAvailable', '@Start');

        this.paletteButtons[index]['isSelected'] = !this.paletteButtons[index]['isSelected'];
    }

    clickSelected(id: number, index: number){
        // Heighlight the clicked row
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSelected', '@Start');

        this.paletteButtonsSelected[index]['isSelected'] = !this.paletteButtonsSelected[index]['isSelected'];
    }

    clickAdd() {
        // Add all selected on Available list to Selected list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickAdd', '@Start');

        // Get selected in Available, and add to Selected
        let availID: number[] = [];

        // TODO - do this better with a DB
        let maxIDs: number[] = [];
        let maxID: number = 0;
        this.globalVariableService.currentPaletteButtonsSelected.value.forEach(pbs =>
            maxIDs.push (pbs.id)
        );
        maxID = Math.max(...maxIDs);

        for (var i = 0; i < this.paletteButtons.length; i++) {

            if (this.paletteButtons[i].isSelected) {
                availID.push(this.paletteButtons[i].id);
                maxID = maxID + 1;
                this.paletteButtonsSelected.push(
                    {
                        id: maxID,
                        userID: this.globalVariableService.currentUser.userID,
                        paletteButtonBarID: this.paletteButtons[i].id,
                        mainmenuItem: this.paletteButtons[i].mainmenuItem,
                        menuText: this.paletteButtons[i].menuText,
                        shape: this.paletteButtons[i].shape,
                        size: this.paletteButtons[i].size,
                        class: this.paletteButtons[i].class,
                        backgroundColor: this.paletteButtons[i].backgroundColor,
                        accesskey: this.paletteButtons[i].accesskey,
                        sortOrder: this.paletteButtons[i].sortOrder,
                        sortOrderSelected: this.paletteButtons[i].sortOrderSelected,
                        isDefault: this.paletteButtons[i].isDefault,
                        functionName: this.paletteButtons[i].functionName,
                        params: this.paletteButtons[i].params,
                        tooltipContent: this.paletteButtons[i].tooltipContent,
                        isSelected: this.paletteButtons[i].isSelected
                    }
                );
            };
        };

        // Reset Selection Sort Order
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {
            this.paletteButtonsSelected[i].isSelected = false
            this.paletteButtonsSelected[i].sortOrderSelected = i + 1;
        };

        // Delete the selected one from the Available list, in reverse order
        for (var i = this.paletteButtons.length - 1; i >= 0; i--) {
            if(availID.indexOf(this.paletteButtons[i].id) >= 0) {
                this.paletteButtons.splice(i, 1);
            };

        };

        // Sort the altered list
        this.paletteButtonsSelected.sort( (obj1,obj2) => {
            if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
                return 1;
            };
            if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
                return -1;
            };
            return 0;
        });

    }

    clickDelete() {
        // Add all selected on Selected list to Available list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Get selected in Selected, and add to Selected
        let availID: number[] = [];
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {

            if (this.paletteButtonsSelected[i].isSelected) {
                availID.push(this.paletteButtonsSelected[i].id);
                this.paletteButtons.push(this.paletteButtonsSelected[i]);
                console.log('xx pushed', i, availID, this.paletteButtons.length, this.paletteButtonsSelected.length)
            };
        };

        // Unselect all from target
        this.paletteButtons.forEach(ps => {
            ps.isSelected = false
            ps.sortOrderSelected = null
        });

        // Delete the selected one, reverse order
        for (var i = this.paletteButtonsSelected.length - 1; i >= 0; i--) {
            if(availID.indexOf(this.paletteButtonsSelected[i].id) >= 0) {
                this.paletteButtonsSelected.splice(i, 1);
            };

        };

        // Reset Selection Sort Order
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {
            this.paletteButtonsSelected[i].isSelected = false
            this.paletteButtonsSelected[i].sortOrderSelected = i + 1;
        };

        // Sort the altered list
        this.paletteButtons.sort( (obj1,obj2) => {
            if (obj1.sortOrder > obj2.sortOrder) {
                return 1;
            };
            if (obj1.sortOrder < obj2.sortOrder) {
                return -1;
            };
            return 0;
        });
    }

    clickMoveUp() {
        // Move selected row(s) up
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveUp', '@Start');

        // Stop if only 1 in Array, or first one is selected (as it cannot move down any further)
        if (this.paletteButtonsSelected.length == 1) {
            return;
        };
        if (this.paletteButtonsSelected[0].isSelected) {
            return;
        };

        // Swop sort order with predecessor. Note: sorting happend on sortOrderSelected, which is
        // only calced at Runtime, and null in DB
        for (var i = 1; i < this.paletteButtonsSelected.length; i++) {

            if (this.paletteButtonsSelected[i].isSelected) {

                // Count how many selected in this batch
                let nrSel: number = 1;
                for (var j = i + 1; j < this.paletteButtonsSelected.length; j++) {
                    if (this.paletteButtonsSelected[j].isSelected) {
                        nrSel = nrSel + 1;
                    } else {
                        break;
                    };
                };

                // Decrease those in this batch
                for (var k = i; k < (i + nrSel); k++) {

                    this.paletteButtonsSelected[k].sortOrderSelected =
                        this.paletteButtonsSelected[k].sortOrderSelected - 1;

                };

                // Increment original unselected
                this.paletteButtonsSelected[i-1].sortOrderSelected =
                    this.paletteButtonsSelected[i-1].sortOrderSelected + nrSel;

                // Set Pointer
                i = i + nrSel;

            };
        };

        // Sort the altered list
        this.paletteButtonsSelected.sort( (obj1,obj2) => {
            if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
                return 1;
            };
            if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
                return -1;
            };
            return 0;
        });
    }

    clickMoveDown() {
        // Move selected row(s) down
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        // Stop if only 1 in Array, or last one is selected (as it cannot move down any further)
        if (this.paletteButtonsSelected.length == 1) {
            return;
        };
        if (this.paletteButtonsSelected[this.paletteButtonsSelected.length - 1].isSelected) {
            return;
        };

        // Swop sort order with predecessor. Note: sorting happend on sortOrderSelected, which is
        // only calced at Runtime, and null in DB
        for (var i = 0; i < this.paletteButtonsSelected.length - 1; i++) {

            if (this.paletteButtonsSelected[i].isSelected) {

                // Count how many selected in this batch
                let nrSel: number = 1;
                for (var j = i + 1; j < this.paletteButtonsSelected.length; j++) {
                    if (this.paletteButtonsSelected[j].isSelected) {
                        nrSel = nrSel + 1;
                    } else {
                        break;
                    };
                };

                // Increase those in this batch
                for (var k = i; k < (i + nrSel); k++) {

                    this.paletteButtonsSelected[k].sortOrderSelected =
                        this.paletteButtonsSelected[k].sortOrderSelected + 1;

                };

                // Decrement unselected below
                this.paletteButtonsSelected[i + nrSel].sortOrderSelected =
                    this.paletteButtonsSelected[i + nrSel].sortOrderSelected - nrSel;

                // Set Pointer
                i = i + nrSel;

            };
        };

        // Sort the altered list
        this.paletteButtonsSelected.sort( (obj1,obj2) => {
            if (obj1.sortOrderSelected > obj2.sortOrderSelected) {
                return 1;
            };
            if (obj1.sortOrderSelected < obj2.sortOrderSelected) {
                return -1;
            };
            return 0;
        });
    }

    clickClose(action: string) {
        // Close the form, nothing saved
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formUserWidgetButtonBarClosed.emit(action);
    }

    clickReset() {
        // Reset Selected to the Default list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickReset', '@Start');
        console.log('xx reset str', this.paletteButtons.length)

        // Refill Available, Empty Selected
        this.paletteButtons = this.paletteButtonsOriginal;
        this.paletteButtonsSelected = [];

        // Move all the defaults across
        for (var i = 0; i < this.paletteButtons.length; i++) {
            if (this.paletteButtons[i].isDefault) {
                this.paletteButtons[i].isSelected = true;
            };
        };

        // Move all the defaults across
        this.clickAdd();
    }

    clickSave(action: string) {
        // Save data, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

console.log('xx sav1', this.globalVariableService.currentPaletteButtonsSelected.value)
        // Delete the inital selected ones for this user from the DB only
        this.globalVariableService.currentPaletteButtonsSelected.value.forEach(pbs =>
            this.globalVariableService.deletePaletteButtonsSelected(pbs.id)
        )

        // Unselect all
        this.paletteButtonsSelected.forEach(pbs => pbs.isSelected = false)

        // Add the new ones to the DB
        // TODO - note that IDs in paletteButtonsSelected sent to app is DIFF to DB ...
        this.paletteButtonsSelected.forEach(pbs =>
                this.globalVariableService.addPaletteButtonsSelected(pbs)
        );

        // Refresh global var, informing subscribers

        // WORKS !!!
        // this.paletteButtonsSelected.forEach( ps =>
        //     this.globalVariableService.savePaletteButtonsSelected(ps)
        // );

        // Inform subscribers
        this.globalVariableService.currentPaletteButtonsSelected.next(this.paletteButtonsSelected);

		this.formUserWidgetButtonBarClosed.emit(action);
    }

}
