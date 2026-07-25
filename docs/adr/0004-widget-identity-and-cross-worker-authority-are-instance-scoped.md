# Widget identity and cross-worker authority are instance-scoped

Widget instance IDs are opaque strings composed from the renderer-assigned editor UID and a monotonic per-editor sequence, such as `editor:42:widget:3`. They are synchronously allocated by pure transitions, never reused, and cannot collide with renderer-generated numeric component IDs.

Every widget-originated editor request carries a `WidgetContext` containing both editor and instance identity. Reads, edits, selections, activation, and self-close are served only while that exact handle is current; stale contexts return typed `superseded` outcomes. Editor commands may separately close the current `(editor, kind)`, avoiding an overloaded API that lets an old instance close its replacement. Remote `dispose(instanceId)` is mandatory, idempotent, and removes missing, completed, or partially created instance state safely.
