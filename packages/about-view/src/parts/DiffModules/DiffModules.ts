import * as DiffAbout from '../DiffAbout/DiffAbout.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffFocusContext from '../DiffFocusContext/DiffFocusContext.ts'

export const modules = [DiffAbout.isEqual, DiffFocus.isEqual, DiffFocusContext.isEqual]

export const numbers = [DiffAbout.diffType, DiffFocus.diffType, DiffFocusContext.diffType]
