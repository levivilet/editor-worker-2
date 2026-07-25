import * as DeleteText from '../DeleteText/DeleteText.ts'

export const deleteCharacterLeft = async (uid: number): Promise<void> => {
  await DeleteText.deleteText(uid, 'left', 'character')
}
