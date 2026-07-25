import * as GetAboutHandler from '../GetAboutHandler/GetAboutHandler.ts'

export const showAbout = async (platform: number): Promise<void> => {
  const fn = GetAboutHandler.getAboutHandler(platform)
  await fn()
}
