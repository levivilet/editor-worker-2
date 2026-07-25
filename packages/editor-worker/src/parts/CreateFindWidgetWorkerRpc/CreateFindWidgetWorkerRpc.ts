import { TransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { CloseFindOutcome } from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'
import * as ApplyDocumentEdits from '../ApplyDocumentEdits/ApplyDocumentEdits.ts'
import * as GetLines2 from '../GetLines2/GetLines2.ts'
import * as GetSelections2 from '../GetSelections2/GetSelections2.ts'
import * as SetSelections2 from '../SetSelections2/SetSelections2.ts'

const commandMap = {
  'Editor.applyDocumentEdits': ApplyDocumentEdits.applyDocumentEdits,
  'Editor.getLines2': GetLines2.getLines2,
  'Editor.getSelections2': GetSelections2.getSelections2,
  'Editor.requestFindWidgetClose': async (context: { readonly editorUid: number; readonly instanceId: string }): Promise<CloseFindOutcome> => {
    const FindWidgetLifecycle = await import('../FindWidgetLifecycle/FindWidgetLifecycle.ts')
    return FindWidgetLifecycle.close(context.editorUid, context.instanceId)
  },
  'Editor.setSelections2': SetSelections2.setSelections2,
}

export const createFindWidgetWorkerRpc = async (): Promise<Rpc> => {
  return TransferMessagePortRpcParent.create({
    commandMap,
    isMessagePortOpen: true,
    async send(port) {
      await RendererWorker.invokeAndTransfer('IpcParent.create', {
        method: 6,
        name: 'Find Widget Worker',
        port,
        raw: true,
        url: 'findWidgetWorkerMain.js',
      })
    },
  })
}
