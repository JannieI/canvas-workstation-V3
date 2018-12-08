// This class defines the tables and DB structure for Dexie DBs

import { Dashboard }                  from './models';

// Dexie
import Dexie from 'dexie';

// Dexie Interface: Contact
export interface IContact {
    id?: number,
    first: string,
    last: string,
    dashboard: Dashboard
}

// Dexie Table: Contact
export class Contact implements IContact {
    id: number;
    first: string;
    last: string;
    dashboard: Dashboard;

    constructor(first: string, last: string, dashboard: Dashboard, id?:number) {
      this.first = first;
      this.last = last;
      this.dashboard = dashboard;
      if (id) this.id = id;
    }
}

// Dexie Interface: Local Dashboards
export interface ILocalDashboard {
    id: number,
    dashboard: Dashboard
}

// Dexie Table: Local Dashboards
export class LocalDashboard implements ILocalDashboard {
    id: number;
    dashboard: Dashboard;

    constructor(id:number, dashboard: Dashboard) {
        this.id = id;
        this.dashboard = dashboard;
    }
}

// Dexie Interface: Canvas User
export interface ICurrentCanvasUser {
    id: number,
    canvasServerName: string,
    canvasServerURI: string,
    currentCompany: string,
    currentUserName: string,
    currentToken: string
}

// Dexie Table: Canvas User
export class CurrentCanvasUser implements ICurrentCanvasUser {
    id: number;
    canvasServerName: string;
    canvasServerURI: string;
    currentCompany: string;
    currentUserName: string;
    currentToken: string;

    constructor(id: number,
        canvasServerName: string,
        canvasServerURI: string,
        currentCompany: string,
        currentUserName: string,
        currentToken: string
    ) {
        this.id = id;
        this.canvasServerName = canvasServerName;
        this.canvasServerURI = canvasServerURI;
        this.currentCompany = currentCompany;
        this.currentUserName = currentUserName;
        this.currentToken = currentToken;
    }
}

// Dexie DB: Canvas App DB
export class CanvasAppDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    contacts: Dexie.Table<IContact, number>; // number = type of the primkey
    localDashboards: Dexie.Table<ILocalDashboard, number>;
    currentCanvasUser: Dexie.Table<ICurrentCanvasUser, number>;
    //...other tables goes ABOVE here...

    constructor () {
        super("CanvasAppDatabase");
        this.version(1).stores({
            contacts: 'id, first, last',
            localDashboards: 'id',
            currentCanvasUser: 'id, canvasServerName, currentCompany, currentUserName'
            //...other tables goes here...
        });
    }
}
