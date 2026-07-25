import type { AboutState } from '../AboutState/AboutState.ts'
import * as HandleClickClose from '../HandleClickClose/HandleClickClose.ts'
import * as HandleClickCopy from '../HandleClickCopy/HandleClickCopy.ts'
import * as HandleClickOk from '../HandleClickOk/HandleClickOk.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleClickButton = async (state: AboutState, name: string): Promise<AboutState> => {
  switch (name) {
    case InputName.Close:
      return HandleClickClose.handleClickClose(state)
    case InputName.Copy:
      return HandleClickCopy.handleClickCopy(state)
    case InputName.Ok:
      return HandleClickOk.handleClickOk(state)
    default:
      throw new Error(`unexpected button`)
  }
}
