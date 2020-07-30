import {Command, flags} from '@oclif/command'

class Jrnlwarp extends Command {
  static description = 'manage your developer journals with vim and git'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    date: flags.string({char: 'd', description: 'date of journal to open'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Jrnlwarp)

    const date = flags.date ?? new Date().toISOString()
    this.log(`hello ${date} from ./src/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}

export = Jrnlwarp
