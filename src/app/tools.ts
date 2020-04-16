export class Tools {

    public static getWeek(date: Date) {
        const baseDate = new Date("01/06/2020"); 
        baseDate.setHours(0, 0, 0, 0);
        
        const diff = date.getTime() - baseDate.getTime(); // in ms
        const weekNumber = Math.floor(diff / (1000*3600*24*7));
        return weekNumber;
      }
}