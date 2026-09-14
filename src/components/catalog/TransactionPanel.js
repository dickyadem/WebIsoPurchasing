import { Badge, Button, Card, Form, InputGroup, ListGroup } from "react-bootstrap";
import { FaCartPlus, FaTimes, FaTrash } from "react-icons/fa";
import { helperReadableCurrency } from "../../utils/helpers";

const TransactionPanel = ({
  productChoices,
  grandTotal,
  onCheckout,
  onDeleteProduct,
  onQuantityChange,
  onClose,
}) => {
  return (
    <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button className="cart-backdrop" type="button" onClick={onClose} aria-label="Close cart" />
      <Card className="transaction-card cart-drawer">
        <Card.Header>
          <div>
            <span>Shopping bag</span>
            <small>{productChoices.length} items</small>
          </div>
          <button className="cart-close" type="button" onClick={onClose} aria-label="Close cart">
            <FaTimes />
          </button>
        </Card.Header>
        <ListGroup variant="flush">
          {productChoices.length === 0 ? (
            <ListGroup.Item className="transaction-empty">
              <p>Your bag is ready.</p>
              <span>Select a product to start a transaction.</span>
            </ListGroup.Item>
          ) : (
            productChoices.map((product, index) => (
              <ListGroup.Item className="transaction-item" key={product.id}>
                <p className="transaction-product-title">{product.title}</p>
                <div className="transaction-product-meta">
                  <span>{helperReadableCurrency(product.price)}</span>
                  <Badge>{helperReadableCurrency(product.subtotal)}</Badge>
                </div>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    aria-label={`Quantity for ${product.title}`}
                    onChange={(event) => onQuantityChange(event, index)}
                    value={product.quantity || ""}
                  />
                  <Button
                    onClick={() => onDeleteProduct(product)}
                    variant="outline-danger"
                    size="sm"
                    aria-label={`Remove ${product.title}`}>
                    <FaTrash />
                  </Button>
                </InputGroup>
              </ListGroup.Item>
            ))
          )}
          <ListGroup.Item className="transaction-total">
            <div>
              <span>Estimated total</span>
              <strong>{helperReadableCurrency(grandTotal)}</strong>
            </div>
            <Button className="checkout-button" onClick={onCheckout} disabled={productChoices.length === 0}>
              <FaCartPlus />
              Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default TransactionPanel;
