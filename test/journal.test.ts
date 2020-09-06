import {expect, test} from '@oclif/test'
import * as moment from 'moment'
import * as tempy from 'tempy'
import AppConfig, { AppConfigSettings } from '../src/appconfig'
import Editor from '../src/editor'
import DateFormatter from '../src/services/DateFormatter'
import FileSystem from '../src/services/FileSystem'
import Journal from '../src/journal'

const defaultDate = moment('1970-01-01').toDate()

function create(title: string, settings: AppConfigSettings) : Journal {
  const appconfig = new AppConfig(settings)
  return new Journal(
    new DateFormatter(),
    new FileSystem(),
    appconfig,
    defaultDate,
    title,
  )
}

describe('journal', () => {
  describe('#constructor', () => {
    test.it('replaces title in config.journalTemplate', ctx => {
      const journal = create('mytitle', {
        journalFolder: '',
        journalTemplate: 'title: #{title}#',
        gitRemote: '',
        gitBranch: ''
      })
      expect(journal.title).to.equal('mytitle')
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
