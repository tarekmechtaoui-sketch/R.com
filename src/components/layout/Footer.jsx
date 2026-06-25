import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const categories = [
    { label: 'Cases & Covers', to: '/products?category=cases' },
    { label: 'Chargers & Cables', to: '/products?category=chargers' },
    { label: 'Audio & Headphones', to: '/products?category=audio' },
    { label: 'Power Banks', to: '/products?category=power' },
    { label: 'Smart Accessories', to: '/products?category=smart' },
  ]

  const quickLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.products'), to: '/products' },
    { label: t('nav.cart'), to: '/cart' },
  ]
  return (
    <footer className="bg-charcoal dark:bg-charcoal-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-charcoal text-sm font-black">R</span>
              </div>
              <span className="text-xl font-black tracking-tight">R.com</span>
            </div>
            <p className="text-charcoal-300 text-sm leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-charcoal-700 rounded-full flex items-center justify-center text-charcoal-300 hover:bg-white hover:text-charcoal transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-charcoal-400 mb-5">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className="text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-charcoal-400 mb-5">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-charcoal-400 mb-5">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-charcoal-400 mt-0.5 shrink-0" />
                <span className="text-sm text-charcoal-300">Algiers, Algeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-charcoal-400 shrink-0" />
                <a href="tel:+213500000000" className="text-sm text-charcoal-300 hover:text-white transition-colors">
                  +213 500 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-charcoal-400 shrink-0" />
                <a href="mailto:contact@r.com" className="text-sm text-charcoal-300 hover:text-white transition-colors">
                  contact@r.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal-400">
            © {new Date().getFullYear()} R.com. {t('footer.rights')}
          </p>
          <p className="text-xs text-charcoal-500">
            Premium Mobile Accessories Store
          </p>
        </div>
      </div>
    </footer>
  )
}
