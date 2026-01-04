const validate = (schema) => (req, res, next) => {
  try {
    // Parse req.body, req.query, req.params if defined in schema
    // Our schemas currently wrap 'body'.
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
