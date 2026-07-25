# Widget effects use RPC registry and explicit failure events

The effect interpreter maps high-level effects to typed per-worker clients exported by `@lvce-editor/rpc-registry`, backed by `createLazyRpc`; no second widget-driver registry is introduced. Open failure triggers best-effort disposal, removes the active handle, records a failed operation long enough to settle callers and diagnostics, and leaves the editor usable for a fresh retry.

A widget-worker disconnect is one reducer event that invalidates all instances hosted by that worker, removes their renderer roots, and rejects affected feature and open operations. Process death itself releases remote state and later opens may launch a fresh worker. Integration requires a `FindWidgetWorker` export and disconnect/reset behavior that the current installed rpc-registry v9.39.0 and `createLazyRpc` API do not yet provide.
