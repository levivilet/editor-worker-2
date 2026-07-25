# Widget lifecycle has a functional core

All widget kinds use one synchronous reducer that returns a new immutable root state plus an exhaustive union of high-level effects. The runtime owns one mutable reference to domain state, commits each transition before starting effects, and keeps RPC clients, promises, and callbacks in a thin shell. Core state, events, effects, and outcomes are structured-cloneable data; no feature module owns a mutable editor map, promise queue, or parallel lifecycle state.

Pending widget operations remain as small immutable records in root state after their active editor or handle is removed. The shell may associate operation IDs with awaiting callers, but all lifecycle truth and every completion pass through the reducer.
