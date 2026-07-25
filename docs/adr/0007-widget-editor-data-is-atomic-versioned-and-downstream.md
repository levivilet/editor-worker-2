# Widget editor data is atomic, versioned, and downstream

Widgets read mutually dependent editor data through one instance-scoped snapshot from a single committed state. Snapshots carry an overall revision for ordering plus narrow domain versions such as `documentVersion`. Editor transitions commit first and then emit versioned effects only to widget kinds that declaratively subscribe to the changed data categories; widget work never participates in or rolls back the editor transaction.

Mutations derived from a snapshot declare the relevant expected versions and are applied only while the context is current and those versions match. Mismatches return typed `conflict` or `superseded` outcomes. The runtime never retries conflicts generically because recomputing replace, rename, or code-action work against newer text can change user intent.
