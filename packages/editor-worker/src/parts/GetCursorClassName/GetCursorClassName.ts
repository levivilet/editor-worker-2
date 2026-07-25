export const getCursorClassName = (uid: number, cursorIndex: number): string => {
  return `EditorCursor-${uid}-${cursorIndex}`
}
