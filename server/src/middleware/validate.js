// Returns middleware that validates req.body against a zod schema.
// On success, req.body is replaced with the parsed (coerced) value.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body || {})
    if (!result.success) {
      const issue = result.error.issues[0]
      const field = issue.path.join('.')
      return res.status(400).json({
        success: false,
        message: field ? `${field}: ${issue.message}` : issue.message,
      })
    }
    req.body = result.data
    next()
  }
}
