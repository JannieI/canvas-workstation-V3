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
import { DashboardTag }               from './models';
import { ButtonBarAvailable}          from './models'
import { ButtonBarSelected }          from './models';
import { Dashboard }                  from './models';
import { PaletteButtonBar }           from './models';
import { UserPaletteButtonBar }       from './models';
import { WidgetCheckpointsComponent } from 'app/widget.checkpoints.component';


@Component({
    selector: 'palette-buttonbar',
    templateUrl: './user.palette.buttonbar.component.html',
    styleUrls: ['./user.palette.buttonbar.component.css']
})
export class UserPaletteButtonBarComponent implements OnInit {

    @Output() formUserWidgetButtonBarClosed: EventEmitter<string> = new EventEmitter();

    showTypeDashboard: boolean = false;
    dashboards: Dashboard[];
    dashboardTags: DashboardTag[];
    paletteButtons: PaletteButtonBar[];
    paletteButtonsSelected: PaletteButtonBar[];
    userPaletteButtons: UserPaletteButtonBar[];
    widgetButtonsAvailable: ButtonBarAvailable[];
    widgetButtonsSelected: ButtonBarSelected[];
	constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
	) {}

    ngOnInit() {
        // Initial
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards = this.globalVariableService.dashboards;
        this.dashboardTags = this.globalVariableService.dashboardTags;
        this.widgetButtonsAvailable = this. globalVariableService.widgetButtonsAvailable;
        this.widgetButtonsSelected = this. globalVariableService.widgetButtonsSelected;

        this.globalVariableService.getPaletteButtonBar().then( pb => {
            this.globalVariableService.getUserPaletteButtonBar().then( up => {

                // Total list of available buttons
                this.paletteButtons = pb.slice();
                this.paletteButtonsSelected = [];

                // Buttons for this user
                this.userPaletteButtons = up.filter(u => 
                    u.userID == this.globalVariableService.userID).slice();

                // If none as yet, give him default ones
                if (this.userPaletteButtons.length == 0) {
                    this.paletteButtons.forEach(p => {
                        if (p.isDefault) {
                            this.userPaletteButtons.push(
                                {
                                    id: null,
                                    userID: this.globalVariableService.userID,
                                    paletteButtonBarID: p.id
                                }
                            )

                        };
                    });
                };

                // Mark user ones as selected
                this.paletteButtons.forEach(pb => {
                    this.userPaletteButtons.forEach(up => {
                        if (pb.id == up.paletteButtonBarID) {
                            pb.isSelected = true;
                        };
                    });
                });

                // Move selected ones across
                this.clickAdd();

            });
        })
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
        for (var i = 0; i < this.paletteButtons.length; i++) {

            if (this.paletteButtons[i].isSelected) {
                availID.push(this.paletteButtons[i].id);
                this.paletteButtonsSelected.push(this.paletteButtons[i]);
            };
        };

        // Reset Selection Sort Order
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {
            this.paletteButtonsSelected[i].isSelected = false
            this.paletteButtonsSelected[i].sortOrderSelected = i + 1;
        };

        // Delete the selected one, reverse order
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
        this.globalFunctionService.printToConsole(this.constructor.name,'clickMoveDown', '@Start');

        // Get selected in Selected, and add to Selected
        let availID: number[] = [];
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {

            if (this.paletteButtonsSelected[i].isSelected) {
                availID.push(this.paletteButtonsSelected[i].id);
                this.paletteButtons.push(this.paletteButtonsSelected[i]);
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

        // Empty Selected
        this.paletteButtonsSelected = [];

        // Move all the defaults across
        for (var i = 0; i < this.paletteButtons.length; i++) {
            if (this.paletteButtons[i].isDefault) {
                this.paletteButtonsSelected.push(this.paletteButtons[i]);
            };
        };

        // Reset Selection Sort Order
        for (var i = 0; i < this.paletteButtonsSelected.length; i++) {
            this.paletteButtonsSelected[i].isSelected = false
            this.paletteButtonsSelected[i].sortOrderSelected = i + 1;
        };
    }

    clickSave(action: string) {
        // Save data, and Close the form
        this.globalFunctionService.printToConsole(this.constructor.name,'clickSave', '@Start');

        // Delete all originals
        // TODO - with DB, only change the Delta
        this.globalVariableService.currentUserPaletteButtonBar.forEach(up => {
            if (up.userID == this.globalVariableService.userID) {
                this.globalVariableService.deleteUserPaletteButtonBar(up.id);
            };
        });

        // Add Selected ones
        this.paletteButtonsSelected.forEach(ps => {
            let newUserPaletteButtonBar: UserPaletteButtonBar = 
                {
                    id: null,
                    userID: this.globalVariableService.userID,
                    paletteButtonBarID: ps.id
                };
            this.globalVariableService.addUserPaletteButtonBar(newUserPaletteButtonBar);
        });

        // Inform subscribers
        this.globalVariableService.paletteButtons.next(this.paletteButtonsSelected);

		this.formUserWidgetButtonBarClosed.emit(action);
    }

}
