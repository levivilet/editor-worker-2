# Editors own widget lifetimes

Each widget instance is exclusively owned by one editor and cannot outlive it. The worker hosting a widget owns its internal behavior, but the editor owns the widget's presence and lifetime; editor state stores only lightweight widget handles rather than replicas of remote widget state.

Widget-worker processes are shared infrastructure and are not owned by individual editors. Closing an editor disposes its instances without terminating their host workers. Closed widget instances are never resurrected or persisted; durable feature data such as history and preferences belongs in separate storage.
