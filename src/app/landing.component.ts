/*
 * Help page, including Recently opened Dashboards
 */

// Angular
import { Component }                  from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Router }                     from '@angular/router';

// Our Functions
import { GlobalFunctionService } 	  from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { Datasource } 				  from './models';
import { Dashboard } 				  from './models';
import { DashboardRecent } 			  from './models';
import { DashboardTab } 			  from './models';

// Functions
import { nSQL } from "nano-sql";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

	@Output() formLandingClosed: EventEmitter<string> = new EventEmitter();

	// sampleDashboards: Dashboard[] = this.globalVariableService.dashboardsSamples;
	recentDashboards: DashboardRecent[];
	sampleDashboards: Dashboard[];
	showModel: boolean = true;

	constructor(
		private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
		private router: Router
	) {


		// Example 0
		nSQL('widgets') //  "users" is our table name.
        .model([ // Declare data model
            {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
            {key:'name',type:'string'},
            {key:'age', type:'int'}
		])
		nSQL('users') //  "users" is our table name.
        .model([ // Declare data model
            {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
            {key:'name',type:'string'},
            {key:'age', type:'int'}
		])
		nSQL().connect()
		.then( dbinfo => console.log('xx2', dbinfo))

		// Example 1
        // nSQL('widgets') //  "users" is our table name.
        // .model([ // Declare data model
        //     {key:'id',type:'int',props:['pk','ai']}, // pk == primary key, ai == auto incriment
        //     {key:'name',type:'string'},
        //     {key:'age', type:'int'}
        // ])
        // .connect() // Init the data store for usage. (only need to do this once)
        // .then(function(result) {
        //     return nSQL().query('upsert',{ // Add a record
        //         id: null, name:"boy", age: 54
        //     }).exec();
        // })
        // .then(function(result) {
        //     return nSQL().query('select').exec(); // select all rows from the current active table
        // })
        // .then(function(result) {
        //     console.log('xx2 W', result) // <= [{id:1, name:"bill", age: 20}]
        // })

		// Example 2
		// nSQL('users')// Table/Store Name, required to declare model and attach it to this store.
		// .model([ // Data Model, required
        //     {key:'id',type:'int',props:['pk', 'ai']}, // pk == primary key, ai == auto incriment
        //     {key:'name',type:'string'},
        //     {key:'age', type:'int'}
		// ])
		// .config({
		// 	mode: "PERM", // With this enabled, the best storage engine will be auttomatically selected and all changes saved to it.  Works in browser AND nodeJS automatically.
		// 	history: true // allow the database to undo/redo changes on the fly. 
		// }) 
		// .actions([ // Optional
		// 	{
		// 		name:'add_new_user',
		// 		args:['user:map'],
		// 		call:function(args, db) {
		// 			return db.query('upsert',args.user).exec();
		// 		}
		// 	}
		// ])
		// .views([ // Optional
		// 	{
		// 		name: 'get_user_by_name',
		// 		args: ['name:string'],
		// 		call: function(args, db) {
		// 			return db.query('select').where(['name','=',args.name]).exec();
		// 		}
		// 	},
		// 	{
		// 		name: 'list_all_users',
		// 		args: ['page:int'],
		// 		call: function(args, db) {
		// 			return db.query('select',['id','name']).exec();
		// 		}
		// 	}                       
		// ])
		// .connect()
			// .then( conn =>
			// 	nSQL().doAction('add_new_user', { user: { id: null, name:"bill", age: 20 } } )
			// 	.then(first =>
			// 		nSQL().doAction('add_new_user', { user: { id: 4, name:"bambie", age: 21 } } )
			// 		// nSQL().query('upsert',{ // Add a record
			// 		// 	name:"bill", age: 20
			// 		// }).exec()
			// 			.then(second => {
			// 				console.log('xx21', conn, first, second) //  <- "1 Row(s) upserted"
			// 				return nSQL().getView('list_all_users');
			// 			}).then(result => {
			// 				console.log('xx22', result) //  <- single object array containing the row we inserted.
			// 			})
			// 		)
			// )
		

		// Load Startup info:

		// All Datasources
		this.globalVariableService.getDatasources();

		// Load D
		this.globalVariableService.getDashboards().then(i => {
			// Sample Dashboards
			this.globalVariableService.getDashboardSamples().then(j => {
				this.sampleDashboards = j;

				// Recent D
				this.globalVariableService.getDashboardsRecent(this.globalVariableService.currentUser.userID).then(k => {
					for (var x = 0; x < k.length; x++) {
						k[x].stateAtRunTime = 'Deleted';
						for (var y = 0; y < this.globalVariableService.dashboards.length; y++) {
							if (this.globalVariableService.dashboards[y].id ==
							k[x].dashboardID) {
								k[x].stateAtRunTime = this.globalVariableService.dashboards[y].state;
								k[x].nameAtRunTime = this.globalVariableService.dashboards[y].name;
							}
						}
					}
					this.recentDashboards = k;
				})
			})
		})
	}

	ngOnInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
	}

	ngAfterViewInit() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'ngAfterViewInit', '@Start');
	}

	clickOpenSampleDashboard(dashboardID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenSampleDashboard', '@Start');

		this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, -1, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenSample');
	}

	clickOpenRecentDashboard(dashboardID: number, dashboardTabID: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenRecentDashboard', '@Start');

        this.globalVariableService.refreshCurrentDashboard(
			'landing-clickOpenRecentDashboard', dashboardID, dashboardTabID, ''
		);

		// Close modal, and show the Dashboard
		this.formLandingClosed.emit('OpenRecent');
	}

	deleteRecent(index: number) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteRecent', '@Start');

		// Delete from temp array, refresh
		this.globalVariableService.deleteDashboardRecent(index).then(
			i => {
				// this.recentDashboards = this.globalVariableService.getDashboardsRecentlyUsed(
			// 	this.globalVariableService.userID
			// );
		})
	}

	clickClose(action: string) {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickClose', '@Start');

		this.formLandingClosed.emit(action);
	}

	clickOpenExisting() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenExisting', '@Start');

		this.globalVariableService.openDashboardFormOnStartup = true;

		this.formLandingClosed.emit('OpenExisting');
	}

	clickOpenNewDashboard() {
        //
        this.globalFunctionService.printToConsole(this.constructor.name,'clickOpenNewDashboard', '@Start');

		this.globalVariableService.openNewDashboardFormOnStartup = true;

		this.formLandingClosed.emit('New');
	}

}
