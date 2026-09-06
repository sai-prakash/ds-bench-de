# T01 rubric

Judges score code + screenshots. Ignore vendor names. Score each criterion 0 / 1 / 2 / 3.

## C1 Correctness of the happy and sad paths
- 0: Form does not submit or always succeeds / always fails
- 1: One path works (success or error), the other is missing
- 2: Both paths work with minor gaps
- 3: Empty, format, blocked, and success paths all match the spec

## C2 Error UX
- 0: No visible errors, or only a browser tooltip
- 1: Errors exist but are not next to fields
- 2: Inline errors, weak association
- 3: Inline errors, associated with fields, page-level alert only for rejected sign-in

## C3 Idiom
- 0: Raw controls where the system has form primitives, or invented components
- 1: Mix of primitives and raw HTML with no clear reason
- 2: Mostly system form controls, a few raw extras
- 3: System text fields, checkbox, button, and alert/toast used as the kit intends

## C4 Accessibility
- 0: Unlabelled inputs or keyboard traps
- 1: Labels present, errors not announced / not associated
- 2: Labels + associated errors, minor contrast or name issues
- 3: Labels, associations, show-password name change, complete keyboard path
