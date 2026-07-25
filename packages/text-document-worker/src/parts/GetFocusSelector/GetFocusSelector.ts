import * as AboutFocusId from '../AboutFocusId/AboutFocusId.ts'
import * as InputName from '../InputName/InputName.ts'

export const getFocusSelector = (focusId: number): string => {
  switch (focusId) {
    case AboutFocusId.Copy:
      return InputName.Copy
    case AboutFocusId.Ok:
      return InputName.Ok
    default:
      return ''
  }
}
