# Widget intent outranks asynchronous completion

Widget presence follows accepted open and close intent order, never worker completion order. An editor has at most one current instance of each widget kind; accepting an open immediately creates an `opening` handle, a fully rendered success moves it to `open`, and close intent removes it from the active editor immediately. Reopening creates a new instance, and late results from older instances cannot change current state.

Effects are causally ordered within one widget instance but may run concurrently across instance IDs, so a new generation need not wait for its predecessor's cleanup. Repeated ensures join the current generation, while all close paths are idempotent and coalesce remote disposal per instance.
