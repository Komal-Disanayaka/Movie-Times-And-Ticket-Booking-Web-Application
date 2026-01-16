const SupportMessage = require('../models/SupportMessage');

exports.sendMessage = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) data.user = req.user.id;
    const msg = new SupportMessage(data);
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getUserMessages = async (req, res) => {
  try {
    const msgs = await SupportMessage.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.listMessages = async (req, res) => {
  try {
    const msgs = await SupportMessage.find().populate('user').sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.reply = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;
    const msg = await SupportMessage.findByIdAndUpdate(id, { adminReply }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
