import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, args?: any, originalBoard?: any): any {
    if (!value) return null;
    if (!args) return value;
    // console.log(originalBoard);
    value = JSON.parse(JSON.stringify(originalBoard.columns));
    args = args.toLowerCase();
    value.forEach(function (item: any) {
      item.tasks = item.tasks.filter((d: any) => {
        return d.heading.toLowerCase().includes(args);
      });
      //   JSON.stringify(item).toLowerCase().includes(args);
    });
    console.log(value)
    return value;
  }
}
