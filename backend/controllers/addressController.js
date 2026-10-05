const { Address } = require("../models");

// GET /api/addresses - Get all addresses for logged-in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/addresses - Create new address
const createAddress = async (req, res) => {
  try {
    const { fullName, phone, address1, address2, city, state, zipCode, country, isDefault } = req.body;

    // If this is set as default, unset all other defaults for this user
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    const address = await Address.create({
      userId: req.user.id,
      fullName,
      phone,
      address1,
      address2,
      city,
      state,
      zipCode,
      country: country || "USA",
      isDefault: isDefault || false,
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/addresses/:id - Update address
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const { fullName, phone, address1, address2, city, state, zipCode, country, isDefault } = req.body;

    // If setting as default, unset all others
    if (isDefault && !address.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    await address.update({
      fullName: fullName || address.fullName,
      phone: phone || address.phone,
      address1: address1 || address.address1,
      address2: address2 !== undefined ? address2 : address.address2,
      city: city || address.city,
      state: state !== undefined ? state : address.state,
      zipCode: zipCode || address.zipCode,
      country: country || address.country,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault,
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/addresses/:id - Delete address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    await address.destroy();
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/addresses/:id/set-default - Set address as default
const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    // Unset all defaults
    await Address.update({ isDefault: false }, { where: { userId: req.user.id } });

    // Set this one as default
    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
