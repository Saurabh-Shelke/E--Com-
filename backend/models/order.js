
const mongoose = require('mongoose');
const deliveryAddressSchema = new mongoose.Schema({
    name : String,
    mobileNo : Number,
    street: String,
    city: String,
    state: String,
    zip: String
})

const orderSchema = new mongoose.Schema({
   order_id: { type: String, required: true },
   products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }, 
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: [String], required: true },
            commissionPrice : {type: Number}
        }
    ],
    payment_id: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    receipt: { type: String, required: true },
    status: { type: String, default: 'created' }, // 'created', 'paid', 'failed'
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // Assuming you have a User model
    invoicePath:{type:String},
    deliveryStatus:{type: String, default:'Ordered'},
    deliveryAddress:deliveryAddressSchema
    
});

const Order = mongoose.model('Order', orderSchema);


module.exports = Order;




