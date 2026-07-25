import { createLazyRpc, RpcId } from '@lvce-editor/rpc-registry'
import { createFindWidgetWorkerRpc } from '../CreateFindWidgetWorkerRpc/CreateFindWidgetWorkerRpc.ts'

const rpcRef: { value?: ReturnType<typeof createLazyRpc> } = {}

const getRpc = (): ReturnType<typeof createLazyRpc> => {
  if (!rpcRef.value) {
    const rpc = createLazyRpc(RpcId.FindWidgetWorker)
    rpc.setFactory(createFindWidgetWorkerRpc)
    rpcRef.value = rpc
  }
  return rpcRef.value
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  return getRpc().invoke(method, ...params)
}

export const createInstance = async (
  instanceId: string,
  rendererUid: number,
  x: number,
  y: number,
  width: number,
  height: number,
  editorUid: number,
): Promise<void> => {
  await getRpc().invoke('FindWidget.createInstance', instanceId, rendererUid, x, y, width, height, editorUid)
}

export const loadContentInstance = async (instanceId: string): Promise<void> => {
  await getRpc().invoke('FindWidget.loadContentInstance', instanceId)
}

export const renderInstance = async (instanceId: string): Promise<readonly (readonly any[])[]> => {
  const rpc = getRpc()
  const diffResult = await rpc.invoke('FindWidget.diffInstance', instanceId)
  return rpc.invoke('FindWidget.renderInstance', instanceId, diffResult)
}

export const disposeInstance = async (instanceId: string): Promise<void> => {
  await getRpc().invoke('FindWidget.disposeInstance', instanceId)
}
