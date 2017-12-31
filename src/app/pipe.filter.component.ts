// Custom filter pipe
// Angular
import { Pipe }                       from '@angular/core';
import { PipeTransform }              from '@angular/core';

@Pipe({ name: "filterDS" })
  export class FilterPipe implements PipeTransform {
    transform(arr: string[], searchValue: string) { 
        console.log('in custom filter!')
      if (!searchValue) return arr;
  
      return arr.filter(value => { 
        return value['name'].toLowerCase().indexOf(searchValue.toLowerCase()) > -1; 
      }); 
    }
  }