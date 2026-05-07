import Link from "next/link";

const cols = [
  { head:"Product",    links:[{ label:"Features",   href:"#features"},{label:"AI Matching",href:"#features"},{label:"Gulf Mode",href:"#features"},{label:"Pricing",href:"#pricing"}] },
  { head:"Company",    links:[{ label:"Customers",  href:"#testimonials"},{label:"FAQ",href:"#faq"},{label:"Contact",href:"mailto:hello@talentaxiss.in"},{label:"Privacy",href:"#"}] },
  { head:"Get started",links:[{ label:"Create account",href:"/auth/register"},{label:"Sign in",href:"/auth/login"},{label:"Free trial",href:"/auth/register"}] },
];

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                <span className="text-[9px] font-black text-white">TA</span>
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">TalentAxiss</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Recruitment CRM built for Kerala&apos;s placement consultancies.
            </p>
            <p className="text-[12px] text-slate-600 mt-4">Kochi, Kerala · India</p>
          </div>
          {cols.map(col => (
            <div key={col.head}>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.18em] mb-5">{col.head}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-slate-400 hover:text-white transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-slate-600">
            © {new Date().getFullYear()} TalentAxiss. All rights reserved.
          </p>
          <Link href="/auth/register"
            className="text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/25">
            Get started free →
          </Link>
        </div>
      </div>
    </footer>
  );
}
