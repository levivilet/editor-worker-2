# Editor

This context manages editing sessions and the auxiliary interfaces attached to them.

## Language

**Editor**:
An active editing session that owns its auxiliary widget instances.

**Editor Closure**:
The terminal end of an editing session, when the editor and all of its widget instances disappear together. Closure is complete only after outstanding widget work and resulting resources have been cleaned up; the same editor cannot become active again.

**Widget Instance**:
One continuous lifetime of an auxiliary interface attached exclusively to one editor. A widget instance cannot outlive its owning editor, and reopening a closed widget creates a new instance.
_Avoid_: Child view, popup

**Widget Instance ID**:
An opaque, renderer-wide identifier for one widget instance. It is namespaced by the owning editor and is never reused for another widget lifetime.
_Avoid_: Random UID

**Widget Worker**:
A shared remote host for the internal state and behavior of widget instances. A widget worker is not owned by any individual editor.

**Opening Widget**:
A current widget instance whose opening has been accepted but whose remote creation is not yet complete. It occupies its widget kind's slot without yet being visible.

**Open Widget**:
A current widget instance whose remote creation has completed and which may be presented in its editor.

**Widget Closure**:
The end of a widget instance, when it immediately ceases to be current and visible. Closure is complete only after its outstanding work and resulting resources have been cleaned up.

**Widget Activation**:
Directing user interaction to a current widget instance. Activation is independent of whether the widget already existed or was just opened.
_Avoid_: Open, when only focus or interaction changes

**Widget Kind**:
A category of widget behavior, such as Find. An editor has at most one current widget instance of each kind.
_Avoid_: Widget ID

**Widget Handle**:
The editor-owned reference to a widget instance, containing its identity and lifecycle information without duplicating the widget's internal state.
_Avoid_: Widget State

**Widget Context**:
The identity of a widget instance together with its owning editor, presented when that widget interacts with the editor. Only the current instance's context grants authority to affect the editor.
_Avoid_: Parent UID

**Widget Intent**:
An accepted request for a widget to be present or absent in an editor. Newer widget intent supersedes older outstanding widget work.
