import * as AboutFocusId from '../AboutFocusId/AboutFocusId.ts'

export const getNextFocus = (focusId: number): number => {
  switch (focusId) {
    case AboutFocusId.Copy:
      return AboutFocusId.Ok
    case AboutFocusId.Ok:
      return AboutFocusId.Copy
    default:
      return AboutFocusId.None
  }
}
