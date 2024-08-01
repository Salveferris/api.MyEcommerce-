const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const database = require('../database');


router.get('/', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const orders =  await database.orders.find({
    userId: user._id.toString(),

  });
  
  res.json(orders);

});

router.get('/:id', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  const order =  await database.products.findOne({
    userId: user._id.toString(),
    _id: id,
  });

  res.json(order);
});

router.put('/:id/complete', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;
  console.log('Começo', user._id.toString())
  let order =  await database.orders.findOne({
    userId: user._id.toString(),
    _id: id
  });

  if (!order) {
    console.log('ordem', order)
    return res.status(400).json({ message: 'Erro ao completar compra.' });
  }

  order.status = 'DONE';
  await order.save();

  res.json(order);
});

router.put('/:id/cancel', authMiddleware, async (req, res, next) => {
  const { user } = res.locals;
  const { id } = req.params;

  let order =  await database.orders.findOne({
    userId: user._id.toString(),
    _id: id
  });

  if (!order) {
    return res.status(400).json({ message: 'Erro ao cancelar compra.' });
  }

  order.status = 'CANCELLED';
  await order.save();

  res.end();
});

module.exports = router;
