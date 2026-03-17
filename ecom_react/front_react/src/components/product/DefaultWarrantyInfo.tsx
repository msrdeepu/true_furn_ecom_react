import { Icon } from '../ui/Icon'

export function DefaultWarrantyInfo() {
  return (
    <div className="default-warranty-info">
      <div className="warranty-card">
        <header className="warranty-header">
          <div className="section-title">
            <Icon name="award" className="icon-md text-primary" />
            <h3>Product Warranty Policy</h3>
          </div>
          <p className="intro-text">
            We stand behind the quality of our furniture and offer warranty coverage against manufacturing defects under normal residential use. <strong>Warranty coverage begins from the date of delivery.</strong>
          </p>
        </header>

        <div className="warranty-grid">
          <div className="warranty-section">
            <div className="section-title-sm">
              <Icon name="chair" className="icon-sm text-primary" />
              <h4>Wooden Structure</h4>
            </div>
            <ul className="warranty-list">
              <li>Manufacturing defects</li>
              <li>Structural cracks</li>
              <li>Joint failures</li>
              <li>Frame instability</li>
            </ul>
            <div className="warranty-period">
              <span>Warranty Period:</span>
              <strong>12 Months</strong>
            </div>
          </div>

          <div className="warranty-section">
            <div className="section-title-sm">
              <Icon name="handyman" className="icon-sm text-primary" />
              <h4>Hardware Components</h4>
            </div>
            <p className="sub-text">Includes hinges, drawer channels, handles, fittings, and locks.</p>
            <ul className="warranty-list">
              <li>Manufacturing defects</li>
              <li>Functional failure</li>
            </ul>
            <div className="warranty-period">
              <span>Warranty Period:</span>
              <strong>6 Months</strong>
            </div>
          </div>

          <div className="warranty-section">
            <div className="section-title-sm">
              <Icon name="eco" className="icon-sm text-primary" />
              <h4>Upholstery & Cushions</h4>
            </div>
            <p className="sub-text">Includes sofa fabrics, cushion foam, and stitching.</p>
            <ul className="warranty-list">
              <li>Manufacturing defects only</li>
            </ul>
            <div className="warranty-period">
              <span>Warranty Period:</span>
              <strong>6 Months</strong>
            </div>
          </div>

          <div className="warranty-section">
            <div className="section-title-sm">
              <Icon name="shopping_bag" className="icon-sm text-primary" />
              <h4>Mattress Warranty</h4>
            </div>
            <p className="sub-text">If mattresses are sold separately.</p>
            <ul className="warranty-list">
              <li>Manufacturing defects</li>
              <li>Foam deformation</li>
            </ul>
            <div className="warranty-period">
              <span>Warranty Period:</span>
              <strong>1 – 5 Years</strong>
            </div>
          </div>
        </div>

        <div className="warranty-footer-grid">
          <div className="footer-section">
            <div className="section-title-sm">
              <Icon name="info" className="icon-sm text-primary" />
              <h4>What Is Covered</h4>
            </div>
            <ul className="warranty-list-alt">
              <li>Manufacturing defects in materials</li>
              <li>Structural failures under normal usage</li>
              <li>Hardware malfunction due to manufacturing</li>
            </ul>
            <p className="note-box">Resolution may include <strong>Repair</strong>, <strong>Replacement</strong> of parts, or product replacement if repair is not possible.</p>
          </div>

          <div className="footer-section">
            <div className="section-title-sm">
              <Icon name="error_outline" className="icon-sm text-primary" />
              <h4>What Is Not Covered</h4>
            </div>
            <ul className="warranty-list-alt no-bullet">
              <li>Normal wear and tear</li>
              <li>Minor color or texture variations</li>
              <li>Damage due to misuse or water/fire/chemicals</li>
              <li>Damage during shifting or relocation</li>
              <li>Improper installation by third parties</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .default-warranty-info {
          color: #334155;
          line-height: 1.6;
        }
        .warranty-card {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .section-title h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .section-title-sm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .section-title-sm h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .intro-text {
          font-size: 1.05rem;
          color: #475569;
          max-width: 800px;
        }
        .warranty-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
          background: #f8fafc;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
        }
        .warranty-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 1.25rem 0;
        }
        .warranty-list li {
          font-size: 0.9rem;
          padding-left: 1.25rem;
          position: relative;
          margin-bottom: 0.25rem;
        }
        .warranty-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--primary);
        }
        .warranty-period {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #e2e8f0;
          padding-top: 0.75rem;
          margin-top: auto;
        }
        .warranty-period span {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }
        .warranty-period strong {
          font-size: 1.1rem;
          color: var(--primary);
        }
        .sub-text {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .warranty-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .warranty-list-alt {
          padding-left: 1.25rem;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .warranty-list-alt li {
          margin-bottom: 0.4rem;
        }
        .no-bullet {
          list-style: none;
          padding-left: 0;
        }
        .no-bullet li {
          padding-left: 1.5rem;
          position: relative;
        }
        .no-bullet li::before {
          content: "✕";
          position: absolute;
          left: 0;
          color: #ef4444;
          font-size: 0.8rem;
          top: 0.1rem;
        }
        .note-box {
          background: #f1f5f9;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          border-left: 4px solid var(--primary);
        }
        @media (max-width: 768px) {
          .warranty-footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
