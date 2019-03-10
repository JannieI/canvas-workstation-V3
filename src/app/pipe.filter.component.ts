/*
 * Custom filter pipe
 */

// Angular
import { Pipe }                       from '@angular/core';
import { PipeTransform }              from '@angular/core';

// Filters DS = Datasource on Type
@Pipe({ name: "filterDSType" })
export class PipeFilterDSType implements PipeTransform {
    transform(arr: string[], searchValue: string) {
        console.log('in custom filter!: ', searchValue)
        if (!searchValue) return arr;

        return arr.filter(value => {
            console.log(value['type'].toLowerCase())
            return value['type'].toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
        });
    }
}