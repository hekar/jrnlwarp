import {expect, test} from '@oclif/test'
import * as moment from 'moment'
import {AppConfig} from '../src/app-config'
import SimpleDateFormatter from '../src/service/date-formatter'
import NativeFileSystem from '../src/service/file-system'
import Journal from '../src/journal'

const defaultDateStr = '1970-01-01'
const defaultDate = moment(defaultDateStr).toDate()

function create(title: string, appConfig: AppConfig): Journal {
  return new Journal(
    new SimpleDateFormatter(),
    new NativeFileSystem(),
    appConfig,
    {date: defaultDate, title},
  )
}

describe('journal', () => {
  describe('#constructor', () => {
    test.it('replaces title in config.journalTemplate', () => {
      const title = 'mytitle'
      const journal = create(title, {
        journalFolder: '',
        journalTemplate: 'title: #{title}#',
        gitRemote: '',
        gitBranch: '',
      })
      expect(journal.name).to.equal(`jrnl-${defaultDateStr}`)
      expect(journal.template).to.equal(`title: ${title}`)
    })

    test.it('replaces date in config.journalTemplate', () => {
      const journal = create('title', {
        journalFolder: '',
        journalTemplate: 'date: #{date}#',
        gitRemote: '',
        gitBranch: '',
      })
      expect(journal.template).to.equal('date: 1970-01-01')
    })
  })
})
