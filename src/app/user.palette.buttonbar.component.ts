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
import { PaletteButtonBar }           from './models';
import { PaletteButtonsSelected }     from './models';


@Component({
    selector: 'palette-buttonbar',
    templateUrl: './user.palette.buttonbar.component.html',
    styleUrls: ['./user.palette.buttonbar.component.css']
})
export class UserPaletteButtonBarComponent implements OnInit {

    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

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
        this.globalVariableService.getResource('paletteButtonBars').then( pb => {

            // Total list of available buttons afresh from DB - slice is NB for ByVal
            this.paletteButtons = pb.slice();
            this.paletteButtonsOriginal = pb.slice();

            // Set selected, already obtained at startup
            this.paletteButtonsSelected = this.globalVariableService
                .currentPaletteButtonsSelected.value.slice();

            // Loop on selected ones in Available, and remove them
            for (var i = this.paletteButtons.length - 1; i >= 0; i--) {
                this.paletteButtonsSelected.forEach(pbs => {
                    if (this.paletteButtons[i].id == pbs.paletteButtonBarID) {

                        this.paletteButtons.splice(i, 1)
                    };
                });
            };

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
        let maxCurrentPaletteButtonsSelectedIDs: number[] = [];
        let maxCurrentPaletteButtonsSelectedID: number = 0;
        this.globalVariableService.currentPaletteButtonsSelected.value.forEach(pbs =>
            maxCurrentPaletteButtonsSelectedIDs.push (pbs.id)
        );
        maxCurrentPaletteButtonsSelectedID = Math.max(...maxCurrentPaletteButtonsSelectedIDs);

        let maxSortOrderSelectedSelectedIDs: number[] = [];
        let maxSortOrderSelectedSelectedID: number = 0;
        this.globalVariableService.currentPaletteButtonsSelected.value.forEach(pbs =>
            maxSortOrderSelectedSelectedIDs.push (pbs.sortOrderSelected)
        );
        maxSortOrderSelectedSelectedID = Math.max(...maxSortOrderSelectedSelectedIDs);

        for (var i = 0; i < this.paletteButtons.length; i++) {

            if (this.paletteButtons[i].isSelected) {
                // Remember this ID - to delete it from Available later
                availID.push(this.paletteButtons[i].id);

                // Increment numbers
                maxCurrentPaletteButtonsSelectedID = maxCurrentPaletteButtonsSelectedID + 1;
                maxSortOrderSelectedSelectedID = maxSortOrderSelectedSelectedID + 1;
                
                // Create new record
                let newPaletteButton: PaletteButtonsSelected = 
                    {
                        id: maxCurrentPaletteButtonsSelectedID,
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
                        sortOrderSelected: maxSortOrderSelectedSelectedID,  // this.paletteButtons[i].sortOrderSelected,
                        isDefault: this.paletteButtons[i].isDefault,
                        functionName: this.paletteButtons[i].functionName,
                        params: this.paletteButtons[i].params,
                        tooltipContent: this.paletteButtons[i].tooltipContent,
                        isSelected: this.paletteButtons[i].isSelected
                    };

                // Add to DB, and local Array
                this.globalVariableService.addPaletteButtonsSelected(newPaletteButton).then(
                    res => this.paletteButtonsSelected.push(res)
                );

            };
        };

        // Delete the selected one from the Available list, in reverse order
        for (var i = this.paletteButtons.length - 1; i >= 0; i--) {
            if(availID.indexOf(this.paletteButtons[i].id) >= 0) {
                this.paletteButtons.splice(i, 1);
            };

        };

    }

    clickDelete() {
        // Add all selected on Selected list to Available list, and unselect original
        // Then sort the altered list
        this.globalFunctionService.printToConsole(this.constructor.name,'clickDelete', '@Start');

        // Delete the selected one and Add to Available ones, reverse order
        for (var i = this.paletteButtonsSelected.length - 1; i >= 0; i--) {
            if (this.paletteButtonsSelected[i].isSelected) {

                // Add to Available
                let newPaletteButton: PaletteButtonBar = 
                {
                    id: this.paletteButtonsSelected[i].id,
                    mainmenuItem: this.paletteButtonsSelected[i].mainmenuItem,
                    menuText: this.paletteButtonsSelected[i].menuText,
                    shape: this.paletteButtonsSelected[i].shape,
                    size: this.paletteButtonsSelected[i].size,
                    class: this.paletteButtonsSelected[i].class,
                    backgroundColor: this.paletteButtonsSelected[i].backgroundColor,
                    accesskey: this.paletteButtonsSelected[i].accesskey,
                    sortOrder: this.paletteButtonsSelected[i].sortOrder,
                    sortOrderSelected: null,
                    isDefault: this.paletteButtonsSelected[i].isDefault,
                    functionName: this.paletteButtonsSelected[i].functionName,
                    params: this.paletteButtonsSelected[i].params,
                    tooltipContent: this.paletteButtonsSelected[i].tooltipContent,
                    isSelected: false
                };
                this.paletteButtons.push(newPaletteButton);

                // Delete from Selected
                this.globalVariableService.deletePaletteButtonsSelected(
                    this.paletteButtonsSelected[i].id).then(res => {
                        this.paletteButtonsSelected.splice(i, 1);
                    }
                );
            };
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

        let changedIDs: number[] = [];

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

                // Decrease sort index of those in this batch, unselect and remember them
                for (var k = i; k < (i + nrSel); k++) {

                    this.paletteButtonsSelected[k].sortOrderSelected =
                        this.paletteButtonsSelected[k].sortOrderSelected - 1;
                    this.paletteButtonsSelected[k].isSelected = false;
                    changedIDs.push(this.paletteButtonsSelected[k].id);
                };

                // Increment original unselected
                this.paletteButtonsSelected[i-1].sortOrderSelected =
                    this.paletteButtonsSelected[i-1].sortOrderSelected + nrSel;
                changedIDs.push(this.paletteButtonsSelected[i-1].id);

                // Set Pointer
                i = i + nrSel;

            };
        };

        // Save alter ones to DB
        let paletteIndex: number; 

        for (var i = 0; i < changedIDs.length; i++) {
            paletteIndex = this.paletteButtonsSelected.findIndex(
                ps => ps.id == changedIDs[i] );
            if (paletteIndex >= 0) {
                this.globalVariableService.saveResource(
                    'paletteButtonsSelecteds',
                    this.paletteButtonsSelected[paletteIndex]
                );                
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

        let changedIDs: number[] = [];

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

                // Increase sort index of those in this batch, unselect and remember them
                for (var k = i; k < (i + nrSel); k++) {

                    this.paletteButtonsSelected[k].sortOrderSelected =
                        this.paletteButtonsSelected[k].sortOrderSelected + 1;
                    this.paletteButtonsSelected[k].isSelected = false;
                    changedIDs.push(this.paletteButtonsSelected[k].id);
                };

                // Decrement unselected below
                this.paletteButtonsSelected[i + nrSel].sortOrderSelected =
                    this.paletteButtonsSelected[i + nrSel].sortOrderSelected - nrSel;
                changedIDs.push(this.paletteButtonsSelected[i + nrSel].id);

                // Set Pointer
                i = i + nrSel;

            };
        };

        // Save alter ones to DB
        let paletteIndex: number; 

        for (var i = 0; i < changedIDs.length; i++) {
            paletteIndex = this.paletteButtonsSelected.findIndex(
                ps => ps.id == changedIDs[i] );
            if (paletteIndex >= 0) {
                this.globalVariableService.saveResource(
                    'paletteButtonsSelecteds',
                    this.paletteButtonsSelected[paletteIndex]
                );                
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

        // Refill Available, Empty Selected
        this.paletteButtons = this.paletteButtonsOriginal;
        this.paletteButtonsSelected = [];
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {
            this.paletteButtonsSelected[i].sortOrderSelected = i;
        };

        // Move all the defaults across
        for (var i = 0; i < this.paletteButtons.length; i++) {
            if (this.paletteButtons[i].isDefault) {
                this.paletteButtons[i].isSelected = true;
            };
        };

        // Move all the defaults across
        this.clickAdd();
    }

    // clickSave(action: string) {
    //     // Save data, and Close the form
    //     this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

    //     // Load set of original and current IDs
    //     let originalIDs: number [] = [];
    //     let currentIDs: number [] = [];
    //     this.globalVariableService.currentPaletteButtonsSelected.value.forEach(spb => {
    //         originalIDs.push(spb.id);
    //     });
    //     this.paletteButtonsSelected.forEach(spb => {
    //         currentIDs.push(spb.id);
    //     });

    //     // Delete the original no longer in current
    //     originalIDs.forEach(opb => {
    //         if (currentIDs.indexOf(opb) < 0) {
    //             this.globalVariableService.deletePaletteButtonsSelected(opb);
    //         };
    //     });

    //     // Unselect all
    //     this.paletteButtonsSelected.forEach(pbs => pbs.isSelected = false)

    //     // Add current and not in origina
    //     currentIDs.forEach(opb => {
    //         if (originalIDs.indexOf(opb) < 0) {
    //             let currentIndex: number = this.paletteButtonsSelected.findIndex(
    //                 b => b.id == opb
    //             );
    //             this.globalVariableService.addPaletteButtonsSelected(
    //                 this.paletteButtonsSelected[currentIndex]
    //             );
    //         };
    //     });

	// 	this.formUserWidgetButtonBarClosed.emit(action);
    // }

}
