const { createQuotation } = require('./server/controllers/orderController');

const req = {
  body: {
    items: [
      { productId: 1, quantity: 1, unitUsed: 'kg' },
      { productId: 1, quantity: 1, unitUsed: 'mg' }
    ]
  },
  user: { id: 1 } // assuming user ID 1 exists
};

const res = {
  status: function(s) { console.log("STATUS:", s); return this; },
  json: function(j) { console.log("JSON:", JSON.stringify(j, null, 2)); return this; }
};

const next = function(err) { console.error("NEXT ERROR:", err); };

createQuotation(req, res, next);
