import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Share2, MessageCircle, Send } from "lucide-react";

const socialIcons = [Share2, MessageCircle, Send];

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TalentAxiss</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              The AI-powered recruitment CRM built for Kerala consultancy agencies.
              Transform your business with the future of hiring.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>hello@talentaxis.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Kochi, Kerala, India</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {["Features", "Pricing", "AI Matching", "Gulf Mode", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-gray-900 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {["About", "Blog", "Careers", "Partners", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-gray-900 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-gray-900 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2025 TalentAxiss. All rights reserved. Made with ❤️ in Kerala.
          </p>
          <div className="flex items-center gap-2">
            {socialIcons.map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors shadow-sm"
              >
                <Icon className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
