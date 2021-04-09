interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  compareInDays(start_date: Date, end_date: Date): number;
  convertToUtc(date: Date): string;
  dateNow(): Date;
  isAfter(start_date: Date, end_date: Date): boolean;
}

export { IDateProvider };
