import { Icon } from '../components/ui/Icon'

export function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="pill">Est. 2012</div>
            <h1>Crafting Comfort, <span>Defining Luxury</span></h1>
            <p className="lead">
              At TREEFURN, we believe your home should be a reflection of your finest self. 
              We blend timeless craftsmanship with contemporary design to create pieces 
              that aren't just furniture—they're legacies.
            </p>
          </div>
        </div>
        <div className="about-hero-bg">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn" 
            alt="Premium Furniture Design" 
          />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="about-narrative container">
        <div className="narrative-grid">
          <div className="narrative-image">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcMTn0bRrWmRa2sCUFLtiWRqm-YHTJYlKakrAgfmhDdIhbqGzKFDaJnvVyn0FVDi5BAEFRzZASI3icY5snmlTnMRiMO4ZqzPPZk6U17zUrfqypyQzfztEv8EH1csgr2ccQ0XfKbEGmel7Bd9lW7x2PTzc4LC1A9KxHuiQoQwUNrHK-WuGfAMhz3xBeO9VnoFUNHEZgR2YNMNOdcfLjrqZvpBc5Wl49t38lwXI8UfDoGOrq0JoqAgXf3gVKt-gwLYBVQB4JmFfsY3pl" 
              alt="Artisan Craftsmanship" 
            />
          </div>
          <div className="narrative-content">
            <h2 className="section-title">The Artisan's Journey</h2>
            <p>
              Born from a passion for sustainable elegance, TREEFURN started as a small workshop 
              dedicated to reviving traditional woodworking techniques. Today, we are a premier 
              destination for those who seek uncompromising quality and distinct style.
            </p>
            <p>
              Every curve, every joint, and every finish is a testament to our artisans' dedication. 
              We don't just build furniture; we curate environments that inspire and comfort.
            </p>
            <div className="stat-row">
              <div className="stat-item">
                <h3>12+</h3>
                <p>Years of Excellence</p>
              </div>
              <div className="stat-item">
                <h3>5k+</h3>
                <p>Homes Transformed</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Master Artisans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="section-head-center">
            <h2 className="section-title">Core Principles</h2>
            <p>Our foundation is built on three unwavering promises to you.</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Icon name="eco" />
              </div>
              <h3>Sustainable Soul</h3>
              <p>We use FSC-certified woods and eco-friendly finishes, ensuring your luxury doesn't cost the Earth.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Icon name="award" />
              </div>
              <h3>Master Quality</h3>
              <p>Rigorous 50-point quality checks on every piece before it leaves our showroom floor.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Icon name="settings" />
              </div>
              <h3>Bespoke Design</h3>
              <p>Furniture that adapts to you. Custom dimensions and fabrics tailored to your unique architectural needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process CTA */}
      <section className="about-cta container">
        <div className="cta-box">
          <div className="cta-content">
            <h2>Ready to Begin Your Legacy?</h2>
            <p>Join thousands of discerning patrons who have elevated their living experience with TREEFURN.</p>
            <div className="cta-actions">
              <a href="/shop" className="btn-primary">Browse Collection</a>
              <a href="/contact" className="btn-ghost" style={{ color: 'white' }}>Consult a Designer</a>
            </div>
          </div>
          <div className="cta-img">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMLZy1doiS-FhB6JOjdlAKrKoRzfRkBr7LJD_yWrRJPlpDLZEOmUA-Dc3Cc6rseksbqs7VbslO_XCbyOUiWLJXQRuPXfNwkqOmiNynzTynk43_yexS1gnL_wbBOxOdTJqsMVQV2DfHjEt6uMFJgwkNUzulp16SfPV2yezMmlvVtUpCgOgbnmu6gB0JoqklIZnQ7m2EyqimJAbjyHkTzEzEuj0C8hjXIUbyGi28CRcKexWDFv_Vkf6phMMP5yT6tYBCqwahmGxiVy1W" 
              alt="Luxury Interior" 
            />
          </div>
        </div>
      </section>
    </div>
  )
}
