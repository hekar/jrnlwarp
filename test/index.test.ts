import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('jrnlwarp', () => {
  test
  .stdout()
  .do(() => cmd.run(['-h']))
  .exit(0)
  .it('runs help', ctx => {
    expect(ctx.stdout).to.contain('jrnlwarp')
  })

  test
  .stdout()
  .do(() => cmd.run(['--print-config']))
  .exit(0)
  .it('prints config and exits', ctx => {
    expect(ctx.stdout).to.contain('"journalFolder"')
  })

  test
  .stdout()
  .do(() => cmd.run(['-v']))
  .exit(0)
  .it('prints version and exits', ctx => {
    expect(ctx.stdout).to.contain('jrnlwarp/')
  })

  test
  .stdout()
  .do(() => cmd.run(['--pwd']))
  .exit(0)
  .it('prints directory containing journals and exits', ctx => {
    expect(ctx.stdout).to.contain('.jrnlwarp')
  })
})
