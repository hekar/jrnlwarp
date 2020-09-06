import {Command, flags} from '@oclif/command'
import * as path from 'path'
import * as moment from 'moment'
import ExternalEditor from './service/editor'
import Journal from './journal'
import LocalAppConfigLoader from './service/app-config-loader'
import SimpleGitRepo from './service/git-repo'
import SimpleDateFormatter from './service/date-formatter'
import NativeFileSystem from './service/file-system'

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

    const fileSystem = new NativeFileSystem()
    const config = await new LocalAppConfigLoader(fileSystem).loadOrDefault(configPath)
    if (flags.pwd) {
      console.log(config.journalFolder) // eslint-disable-line no-console
      return this.exit(0)
    }

    if (flags['print-config']) {
      console.log(JSON.stringify(config, null, 2)) // eslint-disable-line no-console
      return this.exit(0)
    }

    if (!flags['push-only']) {
      const editor = new ExternalEditor()
      const journal = new Journal(
        new SimpleDateFormatter(),
        new NativeFileSystem(),
        config,
        {date: from, title},
      )
      await journal.open(editor)
    }

    if (flags.push || flags['push-only']) {
      const gitRepo = new SimpleGitRepo(
        config,
        config.journalFolder)
      await gitRepo.initIfNotExists()
      await gitRepo.commitAndPush()
    }

    return this.exit(0)
  }
}

export = Jrnlwarp
