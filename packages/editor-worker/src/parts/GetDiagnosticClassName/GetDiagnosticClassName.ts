import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getDiagnosticClassName = (type: string): string => {
  if (type === 'warning') {
    return ClassNames.DiagnosticWarning
  }
  return ClassNames.DiagnosticError
}
