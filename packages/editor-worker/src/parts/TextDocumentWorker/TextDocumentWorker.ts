import { PlainMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'

const state: {
  deferred: PromiseWithResolvers<Rpc>
  rpc: Rpc | undefined
} = {
  deferred: Promise.withResolvers<Rpc>(),
  rpc: undefined,
}

export const get = (): Promise<Rpc> => {
  const { deferred, rpc } = state
  return rpc ? Promise.resolve(rpc) : deferred.promise
}

export const set = (value: Rpc): void => {
  const { deferred } = state
  state.rpc = value
  deferred.resolve(value)
}

export const setPort = async (port: MessagePort): Promise<void> => {
  const value = await PlainMessagePortRpcParent.create({
    commandMap: {},
    messagePort: port,
  })
  set(value)
}

export const send = (method: string, ...params: readonly unknown[]): void => {
  const { rpc } = state
  if (rpc?.send) {
    rpc.send(method, ...params)
    return
  }
  void rpc?.invoke(method, ...params)
}

export const reset = (): void => {
  const { rpc } = state
  void rpc?.dispose?.()
  state.rpc = undefined
  state.deferred = Promise.withResolvers<Rpc>()
}
