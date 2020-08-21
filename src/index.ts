import {Command, flags} from '@oclif/command'
import * as path from 'path'
import * as moment from 'moment'
import Editor from './editor'
import Journal from './journal'
import AppConfig from './appconfig'
import GitRepo from './gitrepo'

function defaultConfigPath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? '~'
  return path.join(home, '.jrnlwarp', 'config.json')
}

class Jrnlwarp extends Command {
  static description = 'manage your developer journals with vim and git'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    from: flags.string({description: 'date of the journal to open'}),
    push: flags.boolean({description: 'push the journal contents to git remote', default: false}),
    'push-only': flags.boolean({description: 'do not open the editor, but push journal contents to remote', default: false}),
    config: flags.string({description: 'path to the appconfig', default: defaultConfigPath()}),
    'print-config': flags.boolean({description: 'print config and exit'}),
    pwd: flags.boolean({description: 'print the directory containing jrnl entries and exit'}),
  }

  static args = [{name: 'title'}]

  async run() {
    const {args, flags} = this.parse(Jrnlwarp)

    const {title} = args
    let from = new Date()
    if (flags.from) {
      const parsed = moment(flags.from)
      if (!parsed.isValid()) {
        throw new Error(`Invalid date --from ${flags.from}`)
      }
      from = parsed.toDate()
    }

    const configPath = flags.config

    const config = await AppConfig.loadOrDefault(configPath)
    if (flags.pwd) {
      console.log(config.journalFolder)
      return
    }

    if (flags['print-config']) {
      console.log(JSON.stringify(config, null, 2))
      return
    }

    if (!flags['push-only']) {
      const editor = new Editor()
      const journal = new Journal(config, from, title)
      await journal.open(editor)
    }

    if (flags.push || flags['push-only']) {
      const gitRepo = new GitRepo(
        config,
        config.journalFolder)
      await gitRepo.initIfNotExists()
      await gitRepo.commitAndPush()
    }
  }
}

export = Jrnlwarp
