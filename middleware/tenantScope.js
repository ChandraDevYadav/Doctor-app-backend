// Attaches to Mongoose models to auto-add tenantId to find/update/delete
module.exports = function applyTenantScope(Model) {
  Model.schema.pre("find", function () {
    if (this.mongooseCollection.collectionName === "users") return; // Skip users
    if (!this.getQuery().tenantId) {
      this.where({ tenantId: this._tenantId });
    }
  });

  Model.schema.pre("findOne", function () {
    if (!this.getQuery().tenantId) this.where({ tenantId: this._tenantId });
  });

  Model.schema.pre("updateMany", function () {
    if (!this.getQuery().tenantId) this.where({ tenantId: this._tenantId });
  });

  Model.schema.pre("deleteMany", function () {
    if (!this.getQuery().tenantId) this.where({ tenantId: this._tenantId });
  });

  // Inject tenantId from req in routes
  return function (req, res, next) {
    if (!req.tenantId)
      return res.status(400).json({ error: "Tenant context missing" });
    Model._tenantId = req.tenantId;
    next();
  };
};
