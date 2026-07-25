# Widget presence, feature behavior, and policy are separate

Generic `ensureWidget` manages presence without implicitly changing focus or accepting changing feature payload. Feature commands such as `openFind` compose ensure with separate instance-scoped activation or update effects, which work the same for opening and already-open instances.

Widget kinds declaratively define editor-data dependencies, dismissal triggers, and genuine exclusivity groups. Multiple kinds coexist by default; matching blur, click, keyboard, or exclusivity events become ordinary close intent in the shared lifecycle engine. Editor closure always closes every kind regardless of policy.
