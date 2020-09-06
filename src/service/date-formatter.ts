import * as moment from 'moment'

export interface DateFormatter{
  format(d: Date): string;
}

export default class SimpleDateFormatter implements DateFormatter {
  format(d: Date): string {
    return moment(d).format('YYYY-MM-DD')
  }
}
