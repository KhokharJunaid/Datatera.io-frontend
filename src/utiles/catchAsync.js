module.exports = (fn, toast) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      toast(`${err?.response?.data?.message}`, { type: "error" });
      next();
    });
  };
};
