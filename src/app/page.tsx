"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Building2, Stethoscope, GraduationCap, Microscope, Users, MapPin, ArrowRight, Search, Phone, Menu, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Brand tokens — easy to tweak later
const BRAND = {
  green: "#006332", // Rush green
  gold: "#c7a44a", // optional accent
  dark: "#0b1a15",
};

// Public-domain / permissive b‑roll sources (fallbacks in order)
const BROLL_SOURCES = [
  // NIBIB CC‑BY educational explainer (WebM)
  { src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0c/How_Does_an_MRI_Work-.webm/How_Does_an_MRI_Work-.webm.720p.vp9.webm", type: "video/webm" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/How_Does_an_MRI_Work-.webm", type: "video/webm" },
  // Real‑time cardiac MRI (CC‑BY‑SA, OGV)
  { src: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Real-time_MRI_-_Thorax.ogv", type: "video/ogg" },
];

// Respect user's reduced‑motion preference
const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefers(m.matches);
    onChange();
    try { m.addEventListener('change', onChange); } catch { m.addListener(onChange); }
    return () => { try { m.removeEventListener('change', onChange); } catch { m.removeListener(onChange); } };
  }, []);
  return prefers;
};

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-md">
    {children}
  </span>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-semibold" style={{ color: BRAND.green }}>{value}</div>
    <div className="text-sm text-slate-600 mt-1">{label}</div>
  </div>
);

const QuickLink = ({ icon: Icon, title, desc, cta }: { icon: React.ComponentType<any>; title: string; desc: string; cta: string }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow rounded-2xl">
    <CardHeader className="flex flex-row items-center gap-3 pb-2">
      <span className="p-2 rounded-xl" style={{ backgroundColor: `${BRAND.green}20` }}>
        <Icon size={20} style={{ color: BRAND.green }} />
      </span>
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-slate-600 -mt-2">
      <p>{desc}</p>
      <Button variant="link" className="px-0 mt-2" style={{ color: BRAND.green }}>
        {cta}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

const DivisionCard = ({ title }: { title: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm">
    <div className="h-36 w-full bg-gradient-to-br from-emerald-100 to-emerald-200" aria-hidden />
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
    <div className="absolute bottom-3 left-3">
      <Badge className="text-xs bg-white/90 text-slate-900 hover:bg-white">Division</Badge>
      <h4 className="mt-2 text-white text-lg font-semibold drop-shadow-sm">{title}</h4>
    </div>
  </div>
);

const FacultySpotlight = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {["Maya Patel, MD — Breast Imaging", "Alex Chen, MD, PhD — Neuroradiology", "Jordan Alvarez, MD — Interventional Radiology"].map((t, i) => (
      <Card key={i} className="rounded-2xl overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-emerald-200 to-emerald-100" />
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 -mt-2">
          Pushing the field forward in patient care, education and research.
        </CardContent>
      </Card>
    ))}
  </div>
);

// Simple video banner for hero
const BRoll = ({ localSrc = "/broll.mp4", poster, sources = BROLL_SOURCES }: { localSrc?: string; poster?: string; sources?: Array<{ src: string; type: string }> }) => {
  const reduce = usePrefersReducedMotion();
  const allSources = localSrc
    ? [{ src: localSrc, type: "video/mp4" }, ...sources]
    : sources;

  return (
    <div className="absolute inset-0 z-0">
      {/* Video - bottom layer */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-1"
        poster={poster}
        autoPlay={!reduce}
        muted
        loop={!reduce}
        playsInline
        preload="metadata"
        aria-label="Radiology b‑roll background"
      >
        {allSources.map((s, i) => (
          <source key={i} src={s.src} type={s.type} />
        ))}
      </video>
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 z-2"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(12,18,16,0.12), transparent 60%), repeating-linear-gradient(135deg, rgba(0,99,50,0.04) 0, rgba(0,99,50,0.04) 2px, transparent 2px, transparent 6px)",
        }}
        aria-hidden
      />
      {/* Soft white wash to blend into page background - on top of video */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/85 z-3" aria-hidden />
    </div>
  );
};

export default function RushRadiologyMockHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Rush‑green sidebars (desktop only) */}
      <div className="pointer-events-none fixed inset-y-0 left-0 hidden lg:block z-10" aria-hidden>
        <div className="h-full" style={{ backgroundColor: BRAND.green, width: 'clamp(24px, 7vw, 120px)' }} />
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-0 hidden lg:block z-10" aria-hidden>
        <div className="h-full" style={{ backgroundColor: BRAND.green, width: 'clamp(24px, 7vw, 120px)' }} />
      </div>

      {/* Top bar */}
      <div className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Section className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md" style={{ backgroundColor: BRAND.green }} />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Department of Radiology</div>
              <div className="text-xs text-slate-500">Rush University Medical Center</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            {["Patient Care","Education","Research","Divisions","Faculty","News","Careers","Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-slate-900">{item}</a>
            ))}
            <Button style={{ backgroundColor: BRAND.green }} className="hover:opacity-90">Apply</Button>
          </nav>
          <button
            className="md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            Menu
          </button>
        </Section>
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <Section className="py-3">
              <nav className="grid gap-3 text-sm">
                {["Patient Care","Education","Research","Divisions","Faculty","News","Careers","Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <Button style={{ backgroundColor: BRAND.green }} className="justify-self-start mt-2" onClick={() => setMenuOpen(false)}>Apply</Button>
              </nav>
            </Section>
          </div>
        )}
      </div>

      {/* Hero with full‑bleed video behind content */}
      <div className="relative overflow-hidden">
        <BRoll localSrc="/broll.mp4" />
        <Section className="relative z-10 grid md:grid-cols-2 gap-8 pt-14 md:pt-24 pb-16">
          <div>
            <Pill>Modern • Accessible • Recruit‑ready</Pill>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Welcome to Rush Radiology
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              Let our team of expert radiologists and technicians help you in your health journey.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" style={{ backgroundColor: BRAND.green }} className="hover:opacity-90">
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300">
                View Open Roles
              </Button>
              <Button size="lg" variant="ghost" className="text-slate-700">
                Watch Overview
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Pill><Stethoscope className="h-3 w-3 mr-1" /> Patient resources</Pill>
              <Pill><GraduationCap className="h-3 w-3 mr-1" /> Residency & Fellowships</Pill>
              <Pill><Microscope className="h-3 w-3 mr-1" /> Research labs</Pill>
              <Pill><Users className="h-3 w-3 mr-1" /> Faculty directory</Pill>
            </div>
          </div>
          <div />
        </Section>
      </div>

      {/* Quick links */}
      <Section className="relative z-10 grid md:grid-cols-3 gap-6 -mt-6 md:-mt-10">
        <QuickLink icon={Calendar} title="Schedule Imaging" desc="Find a location, prep instructions and insurance info." cta="Start scheduling" />
        <QuickLink icon={Building2} title="Refer a Patient" desc="One-step fax/eFax details and direct lines for clinicians." cta="Referral guide" />
        <QuickLink icon={GraduationCap} title="Residency & Fellowships" desc="Rotations, call, curriculum and how to apply." cta="Explore training" />
      </Section>

      {/* Stats strip */}
      <Section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        <Stat label="Faculty" value="85+" />
        <Stat label="Residents & Fellows" value="60+" />
        <Stat label="Annual Exams" value=">1M" />
        <Stat label="Research Pubs/yr" value="250+" />
      </Section>

      {/* Three pillars */}
      <Section id="patient-care" className="mt-14">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Stethoscope className="h-5 w-5" style={{ color: BRAND.green }} /> Patient Care</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 -mt-2">
              Exam prep, what to expect, locations, and rapid MyChart results. Clear language, larger text, prominent phone numbers.
              <Button variant="link" className="px-0 mt-2" style={{ color: BRAND.green }}>Patient resources <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5" style={{ color: BRAND.green }} /> Education</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 -mt-2">
              Residency & fellowships, rotation schedules, call structure, case library, conferences and application timelines.
              <Button variant="link" className="px-0 mt-2" style={{ color: BRAND.green }}>Programs <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Microscope className="h-5 w-5" style={{ color: BRAND.green }} /> Research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 -mt-2">
              Labs, grants, publications, core facilities and collaboration portals. Highlights for AI, image-guided therapy and translational work.
              <Button variant="link" className="px-0 mt-2" style={{ color: BRAND.green }}>Research hubs <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Divisions */}
      <Section id="divisions" className="mt-16">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-semibold tracking-tight">Clinical Divisions</h3>
          <div className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="h-9 w-56 rounded-md border px-3 text-sm" placeholder="Search divisions" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {["Body Imaging", "Breast Imaging", "Cardiothoracic Imaging", "Emergency Radiology", "Musculoskeletal Imaging", "Neuroradiology", "Nuclear Medicine", "Pediatric Radiology", "Vascular & Interventional Radiology"].map((d) => (
            <DivisionCard key={d} title={d} />
          ))}
        </div>
      </Section>

      {/* Faculty spotlight */}
      <Section id="faculty" className="mt-16">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-semibold tracking-tight">Faculty Spotlight</h3>
          <Button variant="outline" className="border-slate-300">Browse Directory</Button>
        </div>
        <FacultySpotlight />
      </Section>

      {/* Recruiting banner */}
      <Section id="careers" className="mt-16">
        <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent" aria-hidden />
          <div className="grid md:grid-cols-[1.2fr,0.8fr] items-center gap-6 p-6 md:p-8 relative">
            <div>
              <Badge className="bg-black/80 hover:bg-black text-white">We’re hiring</Badge>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">Now recruiting in Body Imaging, Neuroradiology & IR</h3>
              <p className="mt-2 text-slate-600 max-w-2xl">Join a collaborative department with protected academic time, state‑of‑the‑art equipment and a culture that values teaching and innovation.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button style={{ backgroundColor: BRAND.green }} className="hover:opacity-90">See open roles</Button>
                <Button variant="outline" className="border-slate-300">Life at Rush Radiology</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-3xl font-semibold" style={{ color: BRAND.green }}>1:1</div>
                <div className="text-sm text-slate-600 mt-1">Mentorship & on‑boarding</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-3xl font-semibold" style={{ color: BRAND.green }}>8</div>
                <div className="text-sm text-slate-600 mt-1">ACGME fellowships</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-3xl font-semibold" style={{ color: BRAND.green }}>24/7</div>
                <div className="text-sm text-slate-600 mt-1">Dedicated IT & PACS support</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-3xl font-semibold" style={{ color: BRAND.green }}>Top 10</div>
                <div className="text-sm text-slate-600 mt-1">Chicago lifestyle perks</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* News & events */}
      <Section id="news" className="mt-16">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-semibold tracking-tight">News & Events</h3>
          <Button variant="outline" className="border-slate-300">All news</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-emerald-100 to-emerald-200" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sample headline #{i}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 -mt-2">
                Short dek describing the update, award, publication or upcoming CME course.
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Locations / contact */}
      <Section id="contact" className="mt-16 mb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border bg-white shadow-sm p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: BRAND.green }} />
              <h3 className="text-lg font-semibold tracking-tight">Locations</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">Main campus and community sites across Chicagoland.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
              {["1611 W Harrison St, Chicago, IL","Rush Oak Park Hospital","Rush Copley Medical Center","Multiple outpatient imaging centers"].map((l) => (
                <div key={l} className="rounded-xl border p-3">{l}</div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border bg-white shadow-sm p-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" style={{ color: BRAND.green }} />
              <h3 className="text-lg font-semibold tracking-tight">Contact</h3>
            </div>
            <div className="mt-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-slate-500">Scheduling</div>
                <div className="font-medium">(312) 942‑5741</div>
              </div>
              <div>
                <div className="text-slate-500">Referrals (Clinicians)</div>
                <div className="font-medium">(312) 563‑4720</div>
              </div>
              <div>
                <div className="text-slate-500">Residency Program</div>
                <div className="font-medium">radrsvp@rush.edu</div>
              </div>
              <div>
                <div className="text-slate-500">Media Inquiries</div>
                <div className="font-medium">media@rush.edu</div>
              </div>
            </div>
            <div className="mt-6">
              <Button style={{ backgroundColor: BRAND.green }} className="hover:opacity-90">General contact form</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-white/70 backdrop-blur mt-12">
        <Section className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Department of Radiology, Rush University Medical Center
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Accessibility</a>
            <a className="hover:underline" href="#">Nondiscrimination</a>
            <a className="hover:underline" href="#">Sitemap</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
