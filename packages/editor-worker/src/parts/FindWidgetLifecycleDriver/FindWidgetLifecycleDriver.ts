import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'

export interface AttachRequest {
  readonly commands: readonly (readonly any[])[]
  readonly editorUid: number
  readonly instanceId: string
  readonly intentSequence: number
  readonly kind: 'find'
  readonly rendererUid: number
}

export interface RemoveRequest {
  readonly editorUid: number
  readonly instanceId: string
  readonly intentSequence: number
  readonly kind: 'find'
  readonly rendererUid: number
}

export interface FindWidgetLifecycleDriver {
  readonly allocateRendererId: () => Promise<number>
  readonly attach: (request: AttachRequest) => Promise<boolean>
  readonly create: (instanceId: string, rendererUid: number, editor: EditorState) => Promise<void>
  readonly dispose: (instanceId: string) => Promise<void>
  readonly invoke: (method: string, ...params: readonly any[]) => Promise<any>
  readonly loadContent: (instanceId: string) => Promise<void>
  readonly remove: (request: RemoveRequest) => Promise<void>
  readonly render: (instanceId: string) => Promise<readonly (readonly any[])[]>
  readonly update: (request: AttachRequest) => Promise<boolean>
}

export const defaultDriver: FindWidgetLifecycleDriver = {
  allocateRendererId: async () => RendererWorker.invoke('WidgetLifecycle.allocateRendererId'),
  attach: async (request) => RendererWorker.invoke('WidgetLifecycle.attach', request),
  create: async (instanceId, rendererUid, editor) => {
    await FindWidgetWorker.createInstance(instanceId, rendererUid, editor.x, editor.y, editor.width, editor.height, editor.uid)
  },
  dispose: FindWidgetWorker.disposeInstance,
  invoke: FindWidgetWorker.invoke,
  loadContent: FindWidgetWorker.loadContentInstance,
  remove: async (request) => {
    await RendererWorker.invoke('WidgetLifecycle.remove', request)
  },
  render: FindWidgetWorker.renderInstance,
  update: async (request) => RendererWorker.invoke('WidgetLifecycle.update', request),
}
