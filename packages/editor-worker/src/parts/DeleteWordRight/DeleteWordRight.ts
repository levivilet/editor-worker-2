import * as DeleteText from '../DeleteText/DeleteText.ts'

export const deleteWordRight = async (uid: number): Promise<void> => {
  await DeleteText.deleteText(uid, 'right', 'word')
}
