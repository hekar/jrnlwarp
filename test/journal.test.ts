import {expect, test} from '@oclif/test'
import * as moment from 'moment'
import * as tempy from 'tempy'
import AppConfig, { AppConfigSettings } from '../src/AppConfig'
import Editor from '../src/Editor'
import DateFormatter from '../src/service/DateFormatter'
import FileSystem from '../src/service/FileSystem'
import Journal from '../src/Journal'
import JournalReference from '../src/JournalReference'

const defaultDateStr = '1970-01-01'
const defaultDate = moment(defaultDateStr).toDate()

function create(title: string, settings: AppConfigSettings) : Journal {
  const appconfig = new AppConfig(settings)
  return new Journal(
    new DateFormatter(),
    new FileSystem(),
    appconfig,
    { date: defaultDate, title },
  )
}

describe('journal', () => {
  describe('#constructor', () => {
    test.it('replaces title in config.journalTemplate', ctx => {
      const title = 'mytitle';
      const journal = create(title, {
        journalFolder: '',
        journalTemplate: 'title: #{title}#',
        gitRemote: '',
        gitBranch: ''
      })
      expect(journal.name).to.equal(`${title}-${defaultDateStr}`)
      expect(journal.template).to.equal(`title: ${title}`)
    })

    test.it('replaces date in config.journalTemplate', ctx => {
      const journal = create('title', {
        journalFolder: '',
        journalTemplate: 'date: #{date}#',
        gitRemote: '',
        gitBranch: ''
      })
      expect(journal.template).to.equal('date: 1970-01-01')
    })
  })
})
