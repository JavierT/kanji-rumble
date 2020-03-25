import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       const seconds = value - minutes * 60;
       const zero_before = (seconds < 10) ? '0' : '';
       return minutes + ':' + zero_before + seconds ;
    }

}