import * as FindWidgetLifecycle from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'

type FindWidgetCommand = (rendererUid: number, ...args: readonly any[]) => Promise<any>
type Execute = (editorUid: number, method: string, ...params: readonly any[]) => Promise<any>

const methodAliases: Readonly<Record<string, string>> = {
  'FindWidget.handleClickReplace': 'FindWidget.replace',
  'FindWidget.handleClickReplaceAll': 'FindWidget.replaceAll',
  'FindWidget.handleFocusClose': 'FindWidget.focusCloseButton',
  'FindWidget.handleFocusNext': 'FindWidget.focusNextMatchButton',
  'FindWidget.handleFocusPrevious': 'FindWidget.focusPreviousMatchButton',
  'FindWidget.handleFocusReplaceAll': 'FindWidget.focusReplaceAllButton',
}

const resolveMethod = (method: string): string => {
  return methodAliases[method] ?? method
}

export const createCommandMap = (execute: Execute): Record<string, FindWidgetCommand> => {
  const forward = (method: string): FindWidgetCommand => {
    return (editorUid, ...args) => execute(editorUid, resolveMethod(method), ...args)
  }
  return {
    'FindWidget.close': forward('FindWidget.close'),
    'FindWidget.focusCloseButton': forward('FindWidget.focusCloseButton'),
    'FindWidget.focusElement': forward('FindWidget.focusElement'),
    'FindWidget.focusFind': forward('FindWidget.focusFind'),
    'FindWidget.focusFirst': forward('FindWidget.focusFirst'),
    'FindWidget.focusIndex': forward('FindWidget.focusIndex'),
    'FindWidget.focusLast': forward('FindWidget.focusLast'),
    'FindWidget.focusNext': forward('FindWidget.focusNext'),
    'FindWidget.focusNextElement': forward('FindWidget.focusNextElement'),
    'FindWidget.focusNextMatchButton': forward('FindWidget.focusNextMatchButton'),
    'FindWidget.focusPrevious': forward('FindWidget.focusPrevious'),
    'FindWidget.focusPreviousElement': forward('FindWidget.focusPreviousElement'),
    'FindWidget.focusPreviousMatchButton': forward('FindWidget.focusPreviousMatchButton'),
    'FindWidget.focusReplace': forward('FindWidget.focusReplace'),
    'FindWidget.focusReplaceAllButton': forward('FindWidget.focusReplaceAllButton'),
    'FindWidget.focusReplaceButton': forward('FindWidget.focusReplaceButton'),
    'FindWidget.focusToggleReplace': forward('FindWidget.focusToggleReplace'),
    'FindWidget.handleBlur': forward('FindWidget.handleBlur'),
    'FindWidget.handleClickButton': forward('FindWidget.handleClickButton'),
    'FindWidget.handleClickClose': forward('FindWidget.handleClickClose'),
    'FindWidget.handleClickReplace': forward('FindWidget.handleClickReplace'),
    'FindWidget.handleClickReplaceAll': forward('FindWidget.handleClickReplaceAll'),
    'FindWidget.handleFocus': forward('FindWidget.handleFocus'),
    'FindWidget.handleFocusClose': forward('FindWidget.handleFocusClose'),
    'FindWidget.handleFocusNext': forward('FindWidget.handleFocusNext'),
    'FindWidget.handleFocusPrevious': forward('FindWidget.handleFocusPrevious'),
    'FindWidget.handleFocusReplaceAll': forward('FindWidget.handleFocusReplaceAll'),
    'FindWidget.handleInput': forward('FindWidget.handleInput'),
    'FindWidget.handleReplaceFocus': forward('FindWidget.handleReplaceFocus'),
    'FindWidget.handleReplaceInput': forward('FindWidget.handleReplaceInput'),
    'FindWidget.handleResizerPointerDown': forward('FindWidget.handleResizerPointerDown'),
    'FindWidget.handleResizerPointerMove': forward('FindWidget.handleResizerPointerMove'),
    'FindWidget.handleResizerPointerUp': forward('FindWidget.handleResizerPointerUp'),
    'FindWidget.handleToggleReplaceFocus': forward('FindWidget.handleToggleReplaceFocus'),
    'FindWidget.preventDefaultBrowserFind': forward('FindWidget.preventDefaultBrowserFind'),
    'FindWidget.replace': forward('FindWidget.replace'),
    'FindWidget.replaceAll': forward('FindWidget.replaceAll'),
    'FindWidget.resize': forward('FindWidget.resize'),
    'FindWidget.toggleMatchCase': forward('FindWidget.toggleMatchCase'),
    'FindWidget.toggleMatchWholeWord': forward('FindWidget.toggleMatchWholeWord'),
    'FindWidget.togglePreserveCase': forward('FindWidget.togglePreserveCase'),
    'FindWidget.toggleReplace': forward('FindWidget.toggleReplace'),
    'FindWidget.toggleUseRegularExpression': forward('FindWidget.toggleUseRegularExpression'),
  }
}

export const commandMap = createCommandMap(FindWidgetLifecycle.execute)

export const executeWidgetCommand = (
  editorUid: number,
  _name: string,
  method: string,
  _rendererUid: number,
  _widgetId: number,
  ...params: readonly any[]
): Promise<boolean> => {
  return FindWidgetLifecycle.execute(editorUid, resolveMethod(method), ...params)
}
