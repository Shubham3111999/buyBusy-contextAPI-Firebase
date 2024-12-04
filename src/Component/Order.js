import React from "react";
import "../CSS/Order.css";

const Order = ({ order }) => {

  const grandTotal = order.reduce((sum, order) => sum + (order.price * order.qty), 0);

  return (
    <div className="order-container">
      <p>Ordered On: <strong>{order[0].createdAt.substring(0, 10)}</strong></p>
      <table className="order-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.map((order) => (
            <tr key={order.id}>
              <td>{order.title}</td>
              <td>₹ {order.price}</td>
              <td>{order.qty}</td>
              <td>₹ {order.price * order.qty}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Grand Total</td>
            <td>₹ {grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Order;
