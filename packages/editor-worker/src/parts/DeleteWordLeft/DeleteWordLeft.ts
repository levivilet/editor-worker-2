import * as DeleteText from '../DeleteText/DeleteText.ts'

export const deleteWordLeft = async (uid: number): Promise<void> => {
  await DeleteText.deleteText(uid, 'left', 'word')
}
