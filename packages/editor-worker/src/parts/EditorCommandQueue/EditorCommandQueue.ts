const queues = new Map<number, Promise<void>>()

const runAfter = async (previous: Readonly<Promise<void>>, command: () => Promise<void>): Promise<void> => {
  try {
    await previous
  } catch {
    // A failed command must not block later commands for the same editor.
  }
  await command()
}

export const enqueue = async (uid: number, command: () => Promise<void>): Promise<void> => {
  const previous = queues.get(uid) ?? Promise.resolve()
  const current = runAfter(previous, command)
  queues.set(uid, current)
  try {
    await current
  } finally {
    if (queues.get(uid) === current) {
      queues.delete(uid)
    }
  }
}

export const dispose = (uid: number): void => {
  queues.delete(uid)
}
