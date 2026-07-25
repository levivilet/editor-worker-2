import * as DeleteText from '../DeleteText/DeleteText.ts'

export const deleteCharacterRight = async (uid: number): Promise<void> => {
  await DeleteText.deleteText(uid, 'right', 'character')
}
