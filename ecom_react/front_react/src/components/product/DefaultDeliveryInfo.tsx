import { Icon } from '../ui/Icon'

export function DefaultDeliveryInfo() {
  return (
    <div className="default-delivery-info">
      <div className="delivery-card">
        <div className="delivery-section">
          <div className="section-title">
            <Icon name="local_shipping" className="icon-md text-primary" />
            <h3>Free Delivery</h3>
          </div>
          <p>
            We offer <strong>FREE delivery</strong> for orders above <strong>₹75,000</strong> within a 100 km radius of our warehouse or showroom.
          </p>
          <ul className="delivery-features">
            <li>Applicable only for eligible locations within the delivery zone</li>
            <li>Applies to in-stock products only</li>
            <li>Delivery will be scheduled after order confirmation</li>
          </ul>
        </div>

        <div className="delivery-section">
          <div className="section-title">
            <Icon name="payment" className="icon-md text-primary" />
            <h3>Delivery Charges</h3>
          </div>
          <p>For orders that do not meet the free delivery criteria:</p>
          <ul className="delivery-features">
            <li><strong>Orders below ₹75,000</strong> — Delivery charges will be calculated based on distance and order size</li>
            <li><strong>Locations beyond 100 km</strong> — Additional logistics charges may apply</li>
          </ul>
          <p className="note-text">Our team will inform you of the exact delivery cost before dispatch.</p>
        </div>

        <div className="delivery-section">
          <div className="section-title">
            <Icon name="history" className="icon-md text-primary" />
            <h3>Delivery Timeline</h3>
          </div>
          <div className="timeline-grid">
            <div className="timeline-item">
              <h4>In-Stock Products</h4>
              <p>Dispatch arranged within <strong>2 – 5 business days</strong></p>
            </div>
            <div className="timeline-item">
              <h4>Made-to-Order</h4>
              <p>Estimated dispatch time: <strong>7 – 21 business days</strong></p>
            </div>
          </div>
        </div>

        <div className="delivery-section">
          <div className="section-title">
            <Icon name="truck" className="icon-md text-primary" />
            <h3>Scheduling & Requirements</h3>
          </div>
          <p>Our team will contact you to schedule a convenient delivery date. Please ensure:</p>
          <ul className="delivery-features">
            <li>Proper access for delivery vehicles</li>
            <li>Adequate space for installation if required</li>
            <li>Any building permissions or lift access</li>
          </ul>
        </div>

        <div className="delivery-section">
          <div className="section-title">
            <Icon name="info" className="icon-md text-primary" />
            <h3>Inspection at Delivery</h3>
          </div>
          <p>
            We recommend inspecting the product at the time of delivery. Report any issues immediately to the delivery team or contact our support team within 24 hours.
          </p>
        </div>
      </div>

      <style>{`
        .default-delivery-info {
          color: #334155;
          line-height: 1.6;
        }
        .delivery-card {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .delivery-section {
          padding-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .delivery-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .section-title h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .delivery-features {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
          display: grid;
          gap: 0.5rem;
        }
        .delivery-features li {
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.95rem;
        }
        .delivery-features li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }
        .note-text {
          font-size: 0.85rem;
          color: #64748b;
          font-style: italic;
          background: #f8fafc;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .timeline-item h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .timeline-item p {
          font-size: 0.9rem;
          margin: 0;
        }
        @media (max-width: 640px) {
          .timeline-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
