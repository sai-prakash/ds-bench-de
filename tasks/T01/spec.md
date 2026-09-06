# T01 — Sign-in form with validation and error states

Build a sign-in screen for an internal tools portal.

## Product language

A person signs in with work email and password. The form must fail closed: nothing submits until both fields are valid. Errors are shown next to the field that caused them. A general banner appears only after a rejected sign-in attempt.

Do not mention or import any particular vendor kit in this spec. Use whatever component library the run condition names.

## Layout

- Page title: "Sign in"
- Short supporting line: "Use your work email."
- Email field, password field, primary submit control labelled "Sign in"
- Text control labelled "Forgot password?" that does not navigate in this task
- Checkbox labelled "Keep me signed in"

## Behaviour

1. Email is required. A value that does not contain `@` and a `.` after the `@` is invalid.
2. Password is required. A value shorter than 8 characters is invalid.
3. Validation runs on submit and on blur after the field has been touched.
4. While a field is invalid, its accessible name remains the visible label, and the error text is programmatically associated with the field.
5. Submit is allowed only when both fields are valid.
6. A successful client-side validation triggers a simulated request that rejects when the email is `blocked@example.com` (any password >= 8). All other valid pairs succeed.
7. Rejection shows a page-level alert: "We could not sign you in. Check your email and password."
8. Success replaces the form with a heading "Welcome back" and the signed-in email.
9. Password is masked. A toggle "Show password" reveals it and updates its accessible name to "Hide password".
10. Keyboard: tab order is email → password → show-password → keep-me-signed-in → forgot-password → sign-in.

## Acceptance criteria

1. Heading text is exactly `Sign in`.
2. Email input labelled Email or Work email.
3. Password input labelled Password.
4. Empty submit shows email and password errors.
5. `not-an-email` on blur shows format error.
6. `short` on blur shows length error.
7. `blocked@example.com` / `password1` shows rejection alert.
8. `ada@example.com` / `password1` shows Welcome back and the email.
9. Keep-me-signed-in is unchecked by default.
10. Every interactive control is reachable with Tab.

## Non-goals

- Real network authentication, MFA, social sign-in
