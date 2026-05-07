import Link from "next/link";

const cols = [
  {
    head: "Product",
    links: [
      { label: "Features",    href: "#features"     },
      { label: "AI Matching", href: "#features"     },
      { label: "Gulf Mode",   href: "#features"     },
      { label: "Pricing",     href: "#pricing"      },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Customers",   href: "#testimonials"              },
      { label: "FAQ",         href: "#faq"                       },
      { label: "Contact",     href: "mailto:hello@talentaxiss.in" },
      { label: "Privacy",     href: "#"                          },
    ],
  },
  {
    head: "Get started",
    links: [
      { label: "Create account", href: "/auth/register" },
      { label: "Sign in",        href: "/auth/login"    },
      { label: "Free trial",     href: "/auth/register" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#080809] border-t border-white/[0.05] pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-10 mb-16">

          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
                <span className="text-[9px] font-black text-black">TA</span>
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">TalentAxiss</span>
            </div>
            <p className="text-[13px] text-white/25 leading-relaxed">
              Recruitment CRM built for Kerala&apos;s placement consultancies.
            </p>
            <p className="text-[12px] text-white/15 mt-4">Kochi, Kerala · India</p>
          </div>

          {cols.map(col => (
            <div key={col.head}>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-5">{col.head}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-[13px] text-white/35 hover:text-white/70 transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/15">
            © {new Date().getFullYear()} TalentAxiss. All rights reserved.
          </p>
          <Link href="/auth/register"
            className="text-[13px] font-semibold bg-white/90 hover:bg-white text-black px-5 py-2 rounded-lg transition-colors">
            Get started free →
          </Link>
        </div>
      </div>
    </footer>
  );
}
