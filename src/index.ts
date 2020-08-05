import {Command, flags} from '@oclif/command'
import * as path from 'path'
import * as moment from 'moment'
import Editor from './editor'
import Journal from './journal'
import AppConfig from './appconfig'

class Jrnlwarp extends Command {
  static description = 'manage your developer journals with vim and git'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    from: flags.string({description: 'date of the journal to open'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Jrnlwarp)

    let from = new Date()
    if (flags.from) {
      from = moment(flags.from).toDate()
    }

    const editor = new Editor()
    const journal = new Journal(AppConfig.default(), from)
    await journal.open(editor)
  }
}

export = Jrnlwarp
