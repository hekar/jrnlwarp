import {Command, flags} from '@oclif/command'
import * as path from 'path'
import * as moment from 'moment'
import Editor from './editor'
import Journal from './journal'
import AppConfig from './appconfig'
import GitRepo from './gitrepo'
import { getPriority } from 'os'

function defaultConfigPath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? '~'
  return path.join(home, '.jrnlwrap', 'config.json')
}

class Jrnlwarp extends Command {
  static description = 'manage your developer journals with vim and git'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    from: flags.string({description: 'date of the journal to open', default: 'today'}),
    push: flags.boolean({description: 'push the journal contents to git remote', default: false}),
    config: flags.string({description: 'path to the appconfig', default: defaultConfigPath()}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Jrnlwarp)

    let from = new Date()
    if (flags.from) {
      from = moment(flags.from).toDate()
    }

    const configPath = flags.config

    const config = await AppConfig.loadOrDefault(configPath)
    const editor = new Editor()
    const journal = new Journal(config, from)
    await journal.open(editor)

    if (flags.push) {
      const gitRepo = new GitRepo(
        config,
        config.journalFolder)
      await gitRepo.commitAndPush()
    }
  }
}

export = Jrnlwarp
