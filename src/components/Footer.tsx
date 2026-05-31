import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">Apna</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Modern fashion rooted in tradition. Curated for the discerning individual in Lahore and beyond.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop?category=men" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Men</Link></li>
              <li><Link href="/shop?category=women" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Women</Link></li>
              <li><Link href="/shop?category=traditional" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Traditional</Link></li>
              <li><Link href="/shop?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-muted-foreground cursor-default">Shipping Info</span></li>
              <li><span className="text-sm text-muted-foreground cursor-default">Returns & Exchanges</span></li>
              <li><span className="text-sm text-muted-foreground cursor-default">Size Guide</span></li>
              <li><span className="text-sm text-muted-foreground cursor-default">Contact Us</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Visit Us</h4>
            <address className="not-italic text-sm text-muted-foreground leading-relaxed space-y-1">
              <p>Apna Flagship Store</p>
              <p>MM Alam Road, Gulberg III</p>
              <p>Lahore, Pakistan</p>
            </address>
            <p className="text-sm text-muted-foreground mt-3">hello@apna.pk</p>
          </div>
        </div>

        <div className="border-t border-border mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Apna. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">Instagram</span>
            <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">Facebook</span>
            <span className="text-xs text-muted-foreground cursor-default hover:text-foreground transition-colors">WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
