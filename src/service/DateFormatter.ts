import * as moment from 'moment'

export interface IDateFormatter{
  format(d: Date): string
}

export default class DateFormatter implements IDateFormatter {
  format(d: Date): string {
    return moment(d).format('YYYY-MM-DD')
  }
}