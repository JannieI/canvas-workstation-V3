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
    canvasServerName: string,
    canvasServerURI: string,
    currentCompany: string,
    currentUserID: string,
    currentToken: string
}

// Dexie Table: Canvas User-related information
export class CurrentCanvasUser implements ICurrentCanvasUser {
    canvasServerName: string;
    canvasServerURI: string;
    currentCompany: string;
    currentUserID: string;
    currentToken: string;

    constructor(
        canvasServerName: string,
        canvasServerURI: string,
        currentCompany: string,
        currentUserID: string,
        currentToken: string
    ) {
        this.canvasServerName = canvasServerName;
        this.canvasServerURI = canvasServerURI;
        this.currentCompany = currentCompany;
        this.currentUserID = currentUserID;
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
            currentCanvasUser: 'canvasServerName, currentCompany, currentUserID'
            //...other tables goes here...
        });
    }
}

// Dexie Interface: Local Caching Table
export interface IDataCachingTable {
    key: string;                            // Unique key
    objectID: number;                       // Optional record ID, ie for Data
    messageDateTime: Date;                  // Last WS number processed
    serverCacheable: boolean;               // True if cached on server
    serverLastUpdatedDateTime: Date;        // When cached last refreshed on server
    serverExpiryDateTime: Date;             // When cache expires on server
    serverLastWSsequenceNr: number;         // Last WSockets message nr sent for this
    serverUtl: string;                      // URL of the data on the server
    localCacheable: boolean;                // True if cached locally, ie IndexedDB
    localLastUpdatedDateTime: Date;         // When local cache last refreshed
    localExpiryDateTime: Date;              // When local cache expries
    localVariableName: string;              // Optional name of memory variable
    localCurrentVariableName: string;       // Optional name of memory current variable
    localTableName: string;                 // Optional name of Table in IndexedDB
}

// Dexie Table: Local Caching Table
export class LocalDataCachingTable implements IDataCachingTable {
    key: string;
    objectID: number;                       // Optional record ID, ie for Data
    messageDateTime: Date;                  // Last WS number processed
    serverCacheable: boolean;
    serverLastUpdatedDateTime: Date;
    serverExpiryDateTime: Date;
    serverLastWSsequenceNr: number;
    serverUtl: string;
    localCacheable: boolean;
    localLastUpdatedDateTime: Date;
    localExpiryDateTime: Date;
    localVariableName: string;
    localCurrentVariableName: string;       // Optional name of memory current variable
    localTableName: string;                 // Optional name of Table in IndexedDB

    constructor(key: string,
        serverCacheable: boolean,
        objectID: number,
        messageDateTime: Date,
        serverLastUpdatedDateTime: Date,
        serverExpiryDateTime: Date,
        serverLastWSsequenceNr: number,
        serverUtl: string,
        localCacheable: boolean,
        localLastUpdatedDateTime: Date,
        localExpiryDateTime: Date,
        localVariableName: string,
        localCurrentVariableName: string,
        localTableName: string
    ) {

            this.key = key,
            this.serverCacheable = serverCacheable,
            this.objectID = objectID;
            this.messageDateTime = messageDateTime,
            this.serverLastUpdatedDateTime = serverLastUpdatedDateTime,
            this.serverExpiryDateTime = serverExpiryDateTime,
            this.serverLastWSsequenceNr = serverLastWSsequenceNr,
            this.serverUtl = serverUtl;
            this.localCacheable = localCacheable,
            this.localLastUpdatedDateTime = localLastUpdatedDateTime,
            this.localExpiryDateTime = localExpiryDateTime,
            this.localVariableName = localVariableName
            this.localCurrentVariableName = localCurrentVariableName;
            this.localTableName = localTableName;

                }
}

// Dexie DB: Data Caching DB
export class DataCachingDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    localDataCachingTable: Dexie.Table<IDataCachingTable, number>; // number = type of the primkey

    constructor () {
        super("DataCachingTable");
        this.version(1).stores({
            localDataCachingTable: 'key, localLastUpdatedDateTime, localExpiryDateTime'
        });
    }
}
