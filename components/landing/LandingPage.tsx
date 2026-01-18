
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Hexagon,
  Cpu,
  Fingerprint,
  CheckCircle2,
  Lock,
  Globe,
  Key,
  Server,
  Activity,
  Users,
  Building2,
  HardDrive,
  ChevronDown,
  ChevronUp,
  CloudLightning,
  Network
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../UI';

interface LandingPageProps {
  onStart: () => void;
  onVerify: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onVerify }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        {/* --- ORIGINAL HERO SECTION (PRESERVED) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 mb-32"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-widest uppercase"
          >
            <Zap size={14} /> Powered by AI & Secure Contract Ledger
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
            Draft & Verify <br />
            <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Blockchain-Secured</span> <br />
            Contracts
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed font-light">
            The easiest way to draft, manage, and verify contracts for institutions, governments, and
            enterprise. Secure. Permanent. Universally verifiable in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button variant="primary" className="px-10 py-4 text-lg h-14" onClick={onStart}>
              Get Started <ArrowRight size={20} />
            </Button>
            <Button variant="secondary" className="px-10 py-4 text-lg h-14" onClick={onVerify}>
              Verify Contract
            </Button>
          </div>

          <div className="pt-32 grid md:grid-cols-3 gap-8 text-left">
            <Card className="p-8">
              <Hexagon className="text-brand mb-6" size={40} />
              <h3 className="text-xl font-bold mb-3">Immutable Record</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Contracts are hashed and stored on-chain, ensuring they can never be forged,
                altered, or deleted.
              </p>
            </Card>
            <Card className="p-8">
              <Cpu className="text-brand mb-6" size={40} />
              <h3 className="text-xl font-bold mb-3">API-First Design</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Seamlessly integrate contract lifecycle management into your existing systems
                with our robust SDKs.
              </p>
            </Card>
            <Card className="p-8">
              <Fingerprint className="text-brand mb-6" size={40} />
              <h3 className="text-xl font-bold mb-3">Permanent Trust</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Verify any contract instantly without login. Build trust with your stakeholders
                through cryptographic proof.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* --- NEW SECTION 1: WHY CHOOSE US --- */}
        <SectionWrapper className="mb-32">
          <SectionHeader title="Why Choose CertiFy" subtitle="The Future of Contract Security" />
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Lock className="text-brand" />}
              title="Military-Grade Encryption"
              desc="AES-256 encryption ensures your sensitive contract data remains private and secure at all times."
            />
            <FeatureCard
              icon={<Activity className="text-brand" />}
              title="Real-Time Auditing"
              desc="Track every interaction, view, and verification event with immutable timestamped logs."
            />
            <FeatureCard
              icon={<Globe className="text-brand" />}
              title="Global Compliance"
              desc="Built to meet international standards for digital signatures and document preservation."
            />
          </div>
        </SectionWrapper>

        {/* --- NEW SECTION 2: HOW IT WORKS --- */}
        <SectionWrapper className="mb-32">
          <SectionHeader title="How It Works" subtitle="Seamless Workflow from Draft to Verification" />
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute top-[2.25rem] left-0 w-full h-[2px] bg-white/10"></div>

            <div className="grid md:grid-cols-3 gap-12">
              <StepCard
                number="01"
                title="Draft & Upload"
                desc="Upload PDFs or draft contracts using our secure editor. We instantly generate a cryptographic hash."
              />
              <StepCard
                number="02"
                title="Anchor to Chain"
                desc="The unique hash is anchored to the Polygon Proof-of-Stake blockchain, creating a permanent timestamp."
              />
              <StepCard
                number="03"
                title="Verify Anywhere"
                desc="Share the document or QR code. Anyone can verify authenticity instantly without an account."
              />
            </div>
          </div>
        </SectionWrapper>

        {/* --- NEW SECTION 3: SECURITY & PERFORMANCE --- */}
        <SectionWrapper className="mb-32">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
            {/* Decorative background pulse */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full" />

            <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
              <MetricBlock value="256-bit" label="Encryption Strength" icon={<Key size={20} className="text-brand mb-2 mx-auto" />} />
              <MetricBlock value="<50ms" label="Verification Latency" icon={<CloudLightning size={20} className="text-brand mb-2 mx-auto" />} />
              <MetricBlock value="99.99%" label="System Uptime" icon={<Server size={20} className="text-brand mb-2 mx-auto" />} />
            </div>
          </div>
        </SectionWrapper>

        {/* --- NEW SECTION 4: USE CASES --- */}
        <SectionWrapper className="mb-32">
          <SectionHeader title="Use Cases" subtitle="Trusted by Industries Worldwide" />
          <div className="grid md:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Building2 />}
              title="Enterprise"
              items={['Employment Contracts', 'NDA Management', 'Vendor Agreements']}
            />
            <UseCaseCard
              icon={<Users />}
              title="Government"
              items={['Land Registry', 'License Issuance', 'Vital Records']}
            />
            <UseCaseCard
              icon={<HardDrive />}
              title="Personal"
              items={['Will & Testaments', 'Property Deeds', 'Academic Certificates']}
            />
          </div>
        </SectionWrapper>

        {/* --- NEW SECTION 5: FAQs --- */}
        <SectionWrapper className="mb-32 max-w-4xl mx-auto">
          <SectionHeader title="Frequently Asked Questions" subtitle="Common questions about our technology" />
          <div className="space-y-4">
            <FAQItem
              question="Is my document content stored on the blockchain?"
              answer="No. Only the cryptographic hash (fingerprint) of your document is stored on-chain. The actual file is stored in our secure, encrypted storage or your private server."
            />
            <FAQItem
              question="Can I delete a contract after it's issued?"
              answer="You can revoke the validity of a contract in our system, but the blockchain record of its issuance is permanent and immutable."
            />
            <FAQItem
              question="Do verifiers need an account?"
              answer="No. Verification is public and open. Anyone with the document file or QR code can instantly verify its authenticity on our verification page."
            />
          </div>
        </SectionWrapper>

        {/* --- NEW SECTION 6: FINAL CTA --- */}
        <SectionWrapper className="mb-20">
          <div className="text-center space-y-8 bg-gradient-to-b from-white/5 to-transparent p-16 rounded-3xl border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Secure Your Documents?</h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Join thousands of organizations trusting CertiFy for their critical contract infrastructure.
            </p>
            <Button variant="primary" className="px-12 py-5 text-lg h-16 shadow-[0_0_40px_rgba(212,255,63,0.3)] hover:shadow-[0_0_60px_rgba(212,255,63,0.5)]" onClick={onStart}>
              Start for Free <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </motion.div>
  );
};

// --- HELPER COMPONENTS ---

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
    <p className="text-white/50 text-sm md:text-base uppercase tracking-widest">{subtitle}</p>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <Card className="p-6 hover:bg-white/5 transition-colors border-white/5">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-3">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
  </Card>
);

const StepCard: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div className="relative pt-8 md:pt-16 text-center md:text-left">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-12 h-12 bg-black border-4 border-brand/20 rounded-full flex items-center justify-center z-10 font-bold text-brand">
      <div className="w-3 h-3 bg-brand rounded-full"></div>
    </div>
    <div className="text-4xl font-bold text-white/10 mb-4">{number}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
  </div>
);

const MetricBlock: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="p-4">
    {icon}
    <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
      {value}
    </div>
    <div className="text-sm font-bold text-brand uppercase tracking-widest">{label}</div>
  </div>
);

const UseCaseCard: React.FC<{ icon: React.ReactNode; title: string; items: string[] }> = ({ icon, title, items }) => (
  <Card className="p-8 hover:border-brand/30 transition-all group">
    <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement, { size: 28 })}
    </div>
    <h3 className="text-xl font-bold mb-6">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-white/60">
          <CheckCircle2 size={14} className="text-brand shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </Card>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold">{question}</span>
        {isOpen ? <ChevronUp size={18} className="text-white/50" /> : <ChevronDown size={18} className="text-white/50" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-white/50 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
