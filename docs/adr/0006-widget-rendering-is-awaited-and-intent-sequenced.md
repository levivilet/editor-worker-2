# Widget rendering is awaited and intent-sequenced

Widget workers return transient renderer commands tagged with instance identity; editor state never stores remote old/new state or render-command snapshots. The effect interpreter forwards commands only for the current instance through an awaited, typed renderer RPC. An open resolves as `opened` only after remote creation, initialization, rendering, and renderer attachment succeed.

Renderer attach and removal requests also carry widget intent sequence. The renderer applies work only while that sequence is latest, so close can invalidate an attach RPC already in flight without allowing late DOM resurrection. Editor close batches all widget-root removals into the same visible update; renderer lifecycle metadata is retired after older work and final removal settle.
