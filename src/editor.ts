import {spawn} from 'child_process'

interface IEditor {
}

export default class Editor implements IEditor {
  private _command: string

  get command(): string {
    return this._command
  }

  constructor(command = '') {
    if (command === '') {
      this._command = process.env.EDITOR || 'vi'
    } else {
      this._command = command
    }
  }

  async open(filepath: string) {
    spawn(this.command, [filepath], {
      stdio: 'inherit',
    })
  }
}
