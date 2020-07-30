import {join} from 'path'
import AppConfig from './appconfig'
import Editor from './editor'

export default class Journal {
  private date: Date

  private name: string

  constructor(date: Date) {
    this.date = date
    this.name = date.toISOString()
  }

  open(config: AppConfig, editor: Editor): void {
    const journalName = `jrnl-${this.name}`
    const fullpath: string = join(config.journalFolder, journalName)

    editor.open(fullpath)
  }
}
