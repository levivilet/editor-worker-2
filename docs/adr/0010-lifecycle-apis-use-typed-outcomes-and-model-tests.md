# Lifecycle APIs use typed outcomes and model tests

Expected conditions such as `opened`, `superseded`, `editorClosed`, `closed`, and `alreadyClosed` are exhaustive typed outcomes rather than exceptions. A superseded open settles only after its cleanup, while invalid input, transport or worker failure, and cleanup failure reject.

The pure reducer is verified with a deterministic interpreter that settles effects in relevant permutations, plus model or property tests for ownership, one-instance-per-kind cardinality, stale-result rejection, at-most-once disposal, terminal editor closure, and the rule that editor close cannot settle while owned operations remain. Unit and end-to-end tests complement rather than substitute for these state-machine checks.
