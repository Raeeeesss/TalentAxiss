import Link from "next/link";

const cols = [
  {
    head: "Product",
    links: [
      { label: "Features",     href: "#features"     },
      { label: "Pricing",      href: "#pricing"      },
      { label: "AI Matching",  href: "#features"     },
      { label: "Gulf Mode",    href: "#features"     },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "About",         href: "#"                      },
      { label: "Customers",     href: "#testimonials"          },
      { label: "Contact",       href: "mailto:hello@talentaxiss.in" },
      { label: "Privacy",       href: "#"                      },
    ],
  },
  {
    head: "Get started",
    links: [
      { label: "Create account",  href: "/auth/register" },
      { label: "Sign in",         href: "/auth/login"    },
      { label: "Free trial",      href: "/auth/register" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#0B0B0F] border-t border-white/[0.06] pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
                <span className="text-[9px] font-black text-black">TA</span>
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">TalentAxiss</span>
            </div>
            <p className="text-[13px] text-white/30 leading-relaxed">
              Recruitment CRM built for Kerala&apos;s placement consultancies.
            </p>
            <p className="text-[12px] text-white/20 mt-4">Kochi, Kerala, India</p>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.head}>
              <div className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-4">{col.head}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-[13px] text-white/40 hover:text-white/70 transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20">
            © {new Date().getFullYear()} TalentAxiss. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link href="/auth/register"
              className="text-[13px] font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
              Get started free →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
