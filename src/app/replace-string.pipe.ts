import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceString',
  standalone: true,
})
export class ReplaceStringPipe implements PipeTransform {
  transform(value: string, toBeReplaced: string, replacement: string): string {
    return value.replace(toBeReplaced, replacement);
  }
}
