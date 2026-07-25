export const getLines = (content: string): readonly string[] => {
  return content.split(/\r\n|\n|\r/)
}
