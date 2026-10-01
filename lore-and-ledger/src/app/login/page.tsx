'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary, PRESET_USERS, User } from '@/context/LibraryContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login, logout, showToast } = useLibrary();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('ARCH-001');
  const [identifier, setIdentifier] = useState('eleanor.vance@bodleian.archive.ox');
  const [passphrase, setPassphrase] = useState('clavis-aurea-1888');
  const [station, setStation] = useState('Special Manuscripts Vault — Desk I');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPreset = (preset: User) => {
    setSelectedPresetId(preset.id);
    setIdentifier(preset.email);
    setPassphrase(preset.id === 'ARCH-001' ? 'clavis-aurea-1888' : 'scriptorium-pass-1888');
    if (preset.id === 'ARCH-001') {
      setStation('Special Manuscripts Vault — Desk I');
    } else if (preset.id === 'ARCH-042') {
      setStation('North Gallery — Mathematical Stacks');
    } else if (preset.id === 'ARCH-109') {
      setStation('West Wing — Botanical Herbarium');
    } else {
      setStation('South Cloisters — Reading Commons');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Please provide an Archival Identifier or Email.', 'warning', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Look up if preset matches or find by ID
      const matchedPreset = PRESET_USERS.find(
        p => p.id === selectedPresetId || p.email.toLowerCase() === identifier.toLowerCase().trim()
      );

      if (matchedPreset) {
        login(matchedPreset);
      } else {
        login({
          email: identifier.trim(),
          name: identifier.includes('@') ? identifier.split('@')[0].replace('.', ' ') : identifier,
          role: 'Visiting Archival Scholar',
          department: station,
          title: 'Guest Researcher'
        });
      }

      setIsSubmitting(false);
      router.push('/dashboard');
    }, 450);
  };

  const handleGuestEntry = () => {
    login({
      id: 'GUEST-1888',
      name: 'Guest Reader',
      role: 'Public Reading Room Guest',
      title: 'Consulting Scholar',
      email: 'guest.reader@bodleian.archive.ox',
      department: 'Main Reading Room',
      sealCode: 'SEAL-GUEST-1888',
      accessTier: 'Public Catalog Read-Only'
    });
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-primary flex flex-col justify-between overflow-x-hidden selection:bg-secondary/30 selection:text-secondary-fixed">
      {/* Background Archival Textures & Crest Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#1b382b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />

      {/* Decorative Archival Watermark */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-surface-bright hidden xl:block">
        <svg fill="currentColor" height="520" viewBox="0 0 100 100" width="520">
          <circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeDasharray="3 2" strokeWidth="2" />
          <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 15 L53 38 L76 38 L57 52 L64 75 L50 61 L36 75 L43 52 L24 38 L47 38 Z" fill="currentColor" />
          <text fontFamily="serif" fontSize="5.5" letterSpacing="2" textAnchor="middle" x="50" y="88">
            LORE &amp; LEDGER • EST 1888
          </text>
        </svg>
      </div>

      {/* Top Archival Header Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-secondary/20 bg-primary/90 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 rounded bg-primary-container p-1 border border-secondary/40 shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/images/crest.png"
              alt="Lore & Ledger Crest"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-[22px] text-secondary-fixed font-semibold tracking-wide leading-tight group-hover:text-surface-bright transition-colors">
              Lore &amp; Ledger
            </span>
            <span className="font-body-sm text-[11px] text-primary-fixed-dim italic">
              Archival Scriptorium &amp; Circulation Register
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-primary-container/80 border border-secondary/30 text-secondary-fixed font-code-ledger text-[12px]">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
            <span>Michaelmas Term 1888</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-secondary/40 bg-surface-container-low/10 text-secondary-fixed hover:bg-surface-container-low/20 font-body-sm text-[13px] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Browse Registers</span>
          </Link>
        </div>
      </header>

      {/* Center Auth Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl bg-surface-container-low rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] border-2 border-secondary/40 overflow-hidden relative">
          {/* Antique Leather / Gold Accent Top Spine */}
          <div className="h-3 bg-gradient-to-r from-secondary-container via-secondary to-primary-container border-b border-secondary/30" />

          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-secondary-fixed border border-secondary/50 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-stamp-label text-[10px] uppercase tracking-widest text-secondary font-bold">
                      Archival Authentication
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-code-ledger text-[10px] border border-secondary/30">
                      Folio #SEC-1888
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-[26px] md:text-[30px] font-semibold text-primary leading-tight">
                    Scriptorium Desk Register
                  </h1>
                </div>
              </div>

              {currentUser && (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border border-secondary/30 text-[12px] font-body-sm text-primary self-stretch sm:self-auto justify-between sm:justify-start">
                  <span className="text-secondary font-semibold">Active Session:</span>
                  <span className="font-bold truncate max-w-[140px]">{currentUser.name.split(' ')[0]}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-tertiary hover:underline font-code-ledger text-[11px] ml-1"
                  >
                    (Sign Out)
                  </button>
                </div>
              )}
            </div>

            {/* Quick Preset Selector for Fast Sign In */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-stamp-label text-[11px] text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                  Choose Archival Identity (Presets)
                </label>
                <span className="font-body-sm text-[11px] text-on-surface-variant italic">
                  Click any role to autofill credentials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_USERS.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-primary text-surface-bright border-secondary shadow-md ring-2 ring-secondary/40'
                          : 'bg-surface-container hover:bg-surface-container-high border-secondary/25 text-on-surface'
                      }`}
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-secondary/40 mt-0.5 bg-secondary/10 flex items-center justify-center">
                        <Image
                          src={preset.avatar}
                          alt={preset.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-headline-sm text-[14px] font-semibold truncate ${isSelected ? 'text-secondary-fixed' : 'text-primary'}`}>
                            {preset.name}
                          </span>
                          <span className={`font-code-ledger text-[10px] shrink-0 ${isSelected ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>
                            {preset.id}
                          </span>
                        </div>
                        <p className={`font-body-sm text-[11px] truncate ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                          {preset.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Sign-In Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Archival ID / Email Field */}
              <div>
                <label className="block font-stamp-label text-[11px] text-secondary uppercase tracking-wider mb-1.5">
                  Archival Roll Identifier / Scriptorium Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
                    ink_pen
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => {
                      setIdentifier(e.target.value);
                      setSelectedPresetId('');
                    }}
                    placeholder="e.g. eleanor.vance@bodleian.archive.ox or ARCH-001"
                    className="w-full pl-11 pr-4 py-2.5 bg-surface-container rounded-xl border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none font-code-ledger text-[13px] text-on-surface placeholder:italic placeholder:font-sans placeholder:text-on-surface-variant shadow-inner transition-all"
                  />
                </div>
              </div>

              {/* Secret Seal Passphrase */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-stamp-label text-[11px] text-secondary uppercase tracking-wider">
                    Wax Seal Passphrase / Keycode
                  </label>
                  <span className="font-code-ledger text-[11px] text-on-surface-variant">
                    Case Sensitive Latin Key
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
                    key
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    placeholder="Enter secret cipher phrase..."
                    className="w-full pl-11 pr-11 py-2.5 bg-surface-container rounded-xl border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none font-code-ledger text-[13px] text-on-surface shadow-inner transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer"
                    title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Scriptorium Chamber Station */}
              <div>
                <label className="block font-stamp-label text-[11px] text-secondary uppercase tracking-wider mb-1.5">
                  Assigned Reading Chamber / Stacks Station
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
                    location_on
                  </span>
                  <select
                    value={station}
                    onChange={e => setStation(e.target.value)}
                    className="w-full pl-11 pr-8 py-2.5 bg-surface-container rounded-xl border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none font-body-sm text-on-surface shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Special Manuscripts Vault — Desk I">Special Manuscripts Vault — Desk I (Custodial)</option>
                    <option value="North Gallery — Mathematical Stacks">North Gallery — Mathematical &amp; Astronomical Stacks</option>
                    <option value="West Wing — Botanical Herbarium">West Wing — Botanical Herbarium &amp; Alchemical Folios</option>
                    <option value="South Cloisters — Reading Commons">South Cloisters — Philology &amp; Reading Commons</option>
                    <option value="Main Circulation Desk — Central Rotunda">Main Circulation Desk — Central Rotunda</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Checkbox and Help Link */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-secondary/50 accent-primary"
                  />
                  <span className="font-body-sm text-[12px] text-on-surface">
                    Keep wax seal valid for 30 archival days
                  </span>
                </label>

                <span className="font-code-ledger text-[11px] text-secondary hover:underline cursor-pointer">
                  Request Seal Reset
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary text-secondary-fixed border-2 border-secondary font-headline-sm text-[16px] font-semibold shadow-lg hover:bg-primary-container hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        progress_activity
                      </span>
                      <span>Breaking Seal &amp; Loading Folios...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
                        verified_user
                      </span>
                      <span>Break Wax Seal &amp; Enter Registers</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGuestEntry}
                  className="py-3 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-secondary/40 font-body-sm text-body-sm text-on-surface transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    person_pin
                  </span>
                  <span>Guest Reader</span>
                </button>
              </div>
            </form>

            {/* Archival Security & Statutes Covenant */}
            <div className="p-3.5 rounded-xl bg-surface-container/60 border border-secondary/25 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                gavel
              </span>
              <div className="text-[11.5px] leading-relaxed text-on-surface-variant font-body-sm">
                <span className="font-semibold text-primary">Archival Reader Covenant:</span> All readers and scribes entering the registers must treat the folios with highest reverence. No open inkhorns within three paces of uncatalogued incunabula.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-secondary/20 bg-primary text-center text-primary-fixed-dim font-code-ledger text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 1888–2026 Lore &amp; Ledger Archival Registry • All Rights Reserved</span>
        <div className="flex items-center gap-4">
          <Link href="/books" className="hover:text-secondary-fixed transition-colors">Book Registers</Link>
          <span>•</span>
          <Link href="/students" className="hover:text-secondary-fixed transition-colors">Scholar Rolls</Link>
          <span>•</span>
          <Link href="/reports" className="hover:text-secondary-fixed transition-colors">Dispatches</Link>
        </div>
      </footer>
    </div>
  );
}
