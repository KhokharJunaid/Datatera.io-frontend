module.exports = (fn, toast) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.log("err", err);
      toast(`${err?.response?.data?.message}`, { type: "error" });
      next();
    });
  };
};
