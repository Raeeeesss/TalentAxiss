import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Share2, MessageCircle, Send } from "lucide-react";

const socialIcons = [Share2, MessageCircle, Send];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TalentAxiss</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-4 max-w-xs">
              The AI-powered recruitment CRM built for Kerala consultancy agencies.
              Transform your business with the future of hiring.
            </p>
            <div className="flex flex-col gap-2 text-xs text-white/30">
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
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {["Features", "Pricing", "AI Matching", "Gulf Mode", "Changelog"].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {["About", "Blog", "Careers", "Partners", "Contact"].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2025 TalentAxiss. All rights reserved. Made with ❤️ in Kerala.
          </p>
          <div className="flex items-center gap-3">
            {socialIcons.map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors"
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
