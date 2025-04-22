import React, { useState } from 'react';
import styles from './StockDashboard.module.css';

//const API_KEY = '24LTOAWYKHF6D8QO';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

const StockDashboard = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stocks, setStocks] = useState([]);

  const isValidStock = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();
      return (
        data.bestMatches &&
        data.bestMatches.some(
          (match) => match['1. symbol'].toUpperCase() === symbol.toUpperCase()
        )
      );
    } catch (error) {
      console.error('Error validating stock symbol:', error);
      return false;
    }
  };

  const handleAddStock = async () => {
    const symbol = stockSymbol.trim().toUpperCase();
    if (!symbol || !quantity || !price) return;

    const valid = await isValidStock(symbol);
    if (!valid) {
      alert('Invalid stock symbol!');
      return;
    }

    const newStock = {
      symbol,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    };

    setStocks([...stocks, newStock]);
    setStockSymbol('');
    setQuantity('');
    setPrice('');
  };

  return (
    <div className={styles.container}>
      <h1>Finance Dashboard</h1>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleAddStock} className={styles.button}>
          Add Stock
        </button>
      </div>

      <div className={styles.stockList}>
        <h2>Stock List</h2>
        {stocks.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          stocks.map((stock, index) => (
            <div className={styles.stockItem} key={index}>
              <strong>{stock.symbol}</strong> — {stock.quantity} shares @ ${stock.price.toFixed(2)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
