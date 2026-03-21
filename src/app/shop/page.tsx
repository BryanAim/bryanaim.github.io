'use client'

import { useState } from 'react'

const products = [
  { id: 1, name: 'Laptop Sticker', price: 5, image: '/img/stickers/laptop.jpg', description: 'Cool laptop sticker' },
  { id: 2, name: 'Bike Sticker', price: 3, image: '/img/stickers/bike.jpg', description: 'Awesome bike sticker' },
]

export default function Shop() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([])

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main id="shop">
      <h1 className="lg-heading">
        Shop <span className="text-secondary">Stickers</span>
      </h1>
      <h2 className="sm-heading">
        Buy laptop and bike stickers
      </h2>
      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>KES {product.price}</p>
            <button onClick={() => addToCart(product)} className="btn-light">Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="cart">
        <h3>Cart</h3>
        {cart.map(item => (
          <div key={item.id}>
            {item.name} x {item.quantity} = KES {item.price * item.quantity}
          </div>
        ))}
        <p>Total: KES {total}</p>
        {total > 0 && <a href="/shop/checkout" className="btn-dark">Checkout</a>}
      </div>
    </main>
  )
}