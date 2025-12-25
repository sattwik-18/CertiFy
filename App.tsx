
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle, 
  Database, 
  Settings, 
  Search,
  ArrowRight,
  Hexagon,
  Cpu,
  Lock,
  History,
  CheckCircle2,
  Menu,
  Zap,
  Fingerprint,
  Mail,
  User,
  GraduationCap,
  Calendar,
  Globe,
  Key,
  CreditCard,
  Share2,
  Trash2,
  Eye,
  Activity,
  UploadCloud,
  FileText,
  FileImage,
  Layers,
  FileUp,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Button, Card, Badge, cn } from './components/UI';
import { MainAreaChart, SecurityGauge } from './components/DashboardCharts';
import { AppView, Certificate, CertificateStatus } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('LANDING');
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'CRT-9823-X',
      recipientName: 'Alice Johnson',
      recipientEmail: 'alice@example.com',
      courseTitle: 'Advanced Machine Learning',
      issuingBody: 'Stanford University Online',
      issueDate: '2024-11-20',
      blockchainHash: '0x8f2c...3a1e',
      transactionId: 'TX-882190',
      status: CertificateStatus.VALID
    },
    {
      id: 'CRT-1024-B',
      recipientName: 'Bob Smith',
      recipientEmail: 'bob.smith@corp.com',
      courseTitle: 'Blockchain Development Specialist',
      issuingBody: 'Certify Academy',
      issueDate: '2025-01-15',
      blockchainHash: '0x1a9e...f7b2',
      transactionId: 'TX-992104',
      status: CertificateStatus.VALID
    }
  ]);

  const navigate = (to: AppView) => {
    setIsLoading(true);
    setTimeout(() => {
      setView(to);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 400);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-brand selection:text-black">
      <BackgroundEffects />
      
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('LANDING')}
          >
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-black" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Certify</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Products</button>
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Enterprise</button>
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pricing</button>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Button variant="ghost" className="text-sm" onClick={() => navigate('VERIFY')}>Verify Certificate</Button>
            <Button variant="primary" className="text-sm px-8" onClick={() => navigate('AUTH')}>Sign In</Button>
          </div>
          
          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {view === 'LANDING' && <LandingView onStart={() => navigate('AUTH')} onVerify={() => navigate('VERIFY')} />}
          {view === 'AUTH' && <AuthView onLogin={() => navigate('DASHBOARD')} />}
          {view === 'DASHBOARD' && <DashboardView certificates={certificates} setCertificates={setCertificates} />}
          {view === 'VERIFY' && <VerifyView />}
        </AnimatePresence>
      </main>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <span className="text-brand font-mono text-xs tracking-widest uppercase">Initializing Secure Session...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const LandingView: React.FC<{ onStart: () => void, onVerify: () => void }> = ({ onStart, onVerify }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-7xl mx-auto px-6 pt-24 pb-32"
  >
    <div className="text-center space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-widest uppercase"
      >
        <Zap size={14} /> Powered by AI & Distributed Ledger
      </motion.div>
      
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
        Issue & Verify <br />
        <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Blockchain-Secured</span> <br />
        Certificates
      </h1>

      <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed font-light">
        The easiest way to issue immutable credentials for institutions, governments, and 
        enterprise. Secure. Permanent. Universally verifiable in one click.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Button variant="primary" className="px-10 py-4 text-lg h-14" onClick={onStart}>
          Get Started <ArrowRight size={20} />
        </Button>
        <Button variant="secondary" className="px-10 py-4 text-lg h-14" onClick={onVerify}>
          Verify Certificate
        </Button>
      </div>

      <div className="pt-32 grid md:grid-cols-3 gap-8 text-left">
        <Card className="p-8">
          <Hexagon className="text-brand mb-6" size={40} />
          <h3 className="text-xl font-bold mb-3">Immutability</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Certificates are hashed and stored on-chain, ensuring they can never be forged, 
            altered, or deleted.
          </p>
        </Card>
        <Card className="p-8">
          <Cpu className="text-brand mb-6" size={40} />
          <h3 className="text-xl font-bold mb-3">API-First Design</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Seamlessly integrate certificate issuance into your existing learning management 
            systems with our robust SDKs.
          </p>
        </Card>
        <Card className="p-8">
          <Fingerprint className="text-brand mb-6" size={40} />
          <h3 className="text-xl font-bold mb-3">Permanent Trust</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Verify any document instantly without login. Build trust with your stakeholders 
            through cryptographic proof.
          </p>
        </Card>
      </div>
    </div>
  </motion.div>
);

const AuthView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-md mx-auto px-6 py-24"
  >
    <Card className="p-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
        <p className="text-white/50 text-sm">Sign in to manage your organization's credentials</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Email Address</label>
          <input 
            type="email" 
            placeholder="name@organization.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
            <button className="text-[10px] text-brand uppercase font-bold tracking-widest hover:underline">Forgot?</button>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      <Button variant="primary" className="w-full py-4" onClick={onLogin}>
        Sign In to Dashboard
      </Button>

      <p className="text-center text-xs text-white/30">
        Don't have an account? <button className="text-brand font-bold">Request Access</button>
      </p>
    </Card>
  </motion.div>
);

const DashboardView: React.FC<{ 
  certificates: Certificate[], 
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>> 
}> = ({ certificates, setCertificates }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab certificates={certificates} />;
      case 'Issue New': return <IssueNewTab onIssue={(cert) => {
        setCertificates([cert, ...certificates]);
        setActiveTab('Registry');
      }} />;
      case 'Registry': return <RegistryTab certificates={certificates} />;
      case 'Verification': return <VerificationTab />;
      case 'Security': return <SecurityTab />;
      case 'Settings': return <SettingsTab />;
      default: return <OverviewTab certificates={certificates} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="w-full md:w-64 space-y-6 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden">
              <img src="https://picsum.photos/id/64/100/100" alt="Org Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">Stanford Online</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">Administrator</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { label: 'Overview', icon: LayoutDashboard },
              { label: 'Issue New', icon: PlusCircle },
              { label: 'Registry', icon: Database },
              { label: 'Verification', icon: ShieldCheck },
              { label: 'Security', icon: Lock },
              { label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label ? "bg-brand text-black shadow-lg shadow-brand/10" : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} className={activeTab === item.label ? "text-black" : "text-white/40 group-hover:text-white"} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const OverviewTab: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => (
  <div className="space-y-8">
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
        <p className="text-white/40 text-sm mt-1">Real-time blockchain synchronization active</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden lg:block">
          <div className="text-[10px] font-mono text-white/40 tracking-tighter mb-1">0x4F2e...A9B1</div>
          <Badge variant="success">Mainnet Node Live</Badge>
        </div>
        <Button variant="primary" className="h-11 px-6 shadow-xl shadow-brand/20">
          Sync Status
        </Button>
      </div>
    </header>

    <div className="grid sm:grid-cols-3 gap-6">
      <Card className="p-6">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Issued</p>
        <h3 className="text-3xl font-bold mt-2">12,340</h3>
        <div className="mt-4 text-brand text-[10px] font-bold">+12.4% this month</div>
      </Card>
      <Card className="p-6">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Verification</p>
        <h3 className="text-3xl font-bold mt-2">4,372</h3>
        <Badge variant="success" className="mt-4">Secure</Badge>
      </Card>
      <Card className="p-6">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Security Status</p>
        <h3 className="text-3xl font-bold mt-2">99.9%</h3>
        <div className="mt-4 text-white/40 text-[10px]">Encrypted AES-256</div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-8">
        <h4 className="font-bold mb-6">Issuance Velocity</h4>
        <MainAreaChart />
      </Card>
      <Card className="p-8">
        <h4 className="font-bold mb-6 text-center">Security Audit</h4>
        <div className="flex flex-col items-center">
          <SecurityGauge value={85} />
          <p className="mt-8 text-sm text-white/50 text-center">Identity verification: <span className="text-brand font-bold">Tier 3</span></p>
        </div>
      </Card>
    </div>
  </div>
);

const IssueNewTab: React.FC<{ onIssue: (cert: Certificate) => void }> = ({ onIssue }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', body: 'Stanford Online'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<{file: File, id: string}[]>([]);
  const [mode, setMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please upload at least one document.");
    setIsProcessing(true);
    
    // Simulate multi-file processing
    setTimeout(() => {
      files.forEach((f, idx) => {
        const newCert: Certificate = {
          id: `CRT-${Math.floor(Math.random() * 9000) + 1000}-${idx}`,
          recipientName: mode === 'SINGLE' ? formData.name : `Bulk Holder ${idx + 1}`,
          recipientEmail: mode === 'SINGLE' ? formData.email : `bulk-${idx}@example.com`,
          courseTitle: formData.course,
          issuingBody: formData.body,
          issueDate: new Date().toISOString().split('T')[0],
          blockchainHash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6),
          transactionId: 'TX-' + Math.floor(Math.random() * 1000000),
          status: CertificateStatus.VALID
        };
        onIssue(newCert);
      });
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <Badge variant="neutral" className="mb-2">Module v2.4</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Issue Credentials</h2>
          <p className="text-white/40 text-sm">Secure and broadcast immutable records to the global ledger.</p>
        </div>
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 shrink-0">
          <button 
            onClick={() => { setMode('SINGLE'); setFiles([]); }}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", mode === 'SINGLE' ? "bg-brand text-black" : "text-white/40 hover:text-white")}
          >
            <User size={14} /> Single Entry
          </button>
          <button 
            onClick={() => { setMode('BULK'); setFiles([]); }}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", mode === 'BULK' ? "bg-brand text-black" : "text-white/40 hover:text-white")}
          >
            <Layers size={14} /> Bulk Batch
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Step 1: Meta Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-6 border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <FileUp size={16} /> Identity Metadata
            </h4>
            
            <AnimatePresence mode="wait">
              {mode === 'SINGLE' ? (
                <motion.div 
                  key="single"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recipient Full Name</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand/50 outline-none transition-colors" 
                      placeholder="Jane Cooper"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand/50 outline-none transition-colors" 
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="bulk"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-6 bg-brand/5 border border-brand/20 rounded-2xl flex flex-col items-center text-center gap-4"
                >
                  <AlertCircle className="text-brand" size={32} />
                  <div>
                    <div className="font-bold text-brand">Bulk Mode Active</div>
                    <p className="text-xs text-white/40 mt-1">Recipient data will be extracted from file metadata or provided manifest.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Program / Course Title</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand/50 outline-none transition-colors" 
                placeholder="MSc Advanced Artificial Intelligence" 
                value={formData.course}
                onChange={e => setFormData({...formData, course: e.target.value})}
              />
            </div>
          </Card>
          
          <div className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl space-y-4">
             <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Live Encryption Status</h5>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
               <span className="text-xs font-mono text-white/60">AES-256 GCM READY</span>
             </div>
             <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-brand/50 blur-[1px]"
                />
             </div>
          </div>
        </div>

        {/* Step 2: Futuristic Document Drop Zone */}
        <div className="lg:col-span-3 space-y-8">
          <input 
            type="file" 
            multiple={mode === 'BULK'}
            accept="image/*,.pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          
          <Card 
            className="relative h-[300px] border-2 border-dashed border-white/10 hover:border-brand/30 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Background effects inside the drop zone */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
               <div className="absolute top-0 left-0 w-full h-full grid-pattern" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand/20 via-transparent to-brand/10 rounded-full blur-[100px]"
               />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand transition-all duration-500">
                <UploadCloud className="group-hover:text-black group-hover:rotate-6 transition-all" size={32} />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">Upload Source Files</div>
                <p className="text-white/40 text-sm mt-1">Drag & drop or click to browse (PDF, PNG, JPG)</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Badge variant="neutral">Single File Limit: 20MB</Badge>
                  {mode === 'BULK' && <Badge variant="success">Bulk Enabled</Badge>}
                </div>
              </div>
            </div>
          </Card>

          {/* File Queue List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Upload Queue ({files.length})</span>
                  <button onClick={() => setFiles([])} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:underline">Clear Queue</button>
                </div>
                
                <div className="grid gap-3">
                  {files.map((f) => (
                    <motion.div
                      key={f.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 glass rounded-xl flex items-center justify-between group border border-white/5 hover:border-brand/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                          {f.file.type.includes('image') ? <FileImage size={20} className="text-brand" /> : <FileText size={20} className="text-blue-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold truncate max-w-[200px]">{f.file.name}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest">{(f.file.size / (1024*1024)).toFixed(2)} MB • READY</div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4">
            <Button 
              variant="primary" 
              className="w-full h-16 text-lg font-bold shadow-[0_0_40px_rgba(212,255,63,0.1)]"
              isLoading={isProcessing}
            >
              {isProcessing ? 'Mining Transaction...' : `Secure & Finalize ${files.length > 1 ? 'Batch' : 'Credential'}`}
            </Button>
            <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.2em]">
              Authorized by Stanford Online Node Authority
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

const RegistryTab: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Certificate Registry</h2>
        <p className="text-white/40 text-sm mt-1">Total indexed documents: {certificates.length}</p>
      </div>
      <div className="relative w-72">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
        <input className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-2 text-sm focus:border-brand/50 outline-none" placeholder="Search registry..." />
      </div>
    </div>

    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr className="text-[10px] uppercase tracking-widest text-white/30">
              <th className="px-6 py-4 font-bold">Recipient</th>
              <th className="px-6 py-4 font-bold">Certification</th>
              <th className="px-6 py-4 font-bold">Issue Date</th>
              <th className="px-6 py-4 font-bold">Blockchain Hash</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {certificates.map(cert => (
              <tr key={cert.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold">{cert.recipientName}</div>
                  <div className="text-[10px] text-white/40">{cert.recipientEmail}</div>
                </td>
                <td className="px-6 py-4 font-medium">{cert.courseTitle}</td>
                <td className="px-6 py-4 text-white/50">{cert.issueDate}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-brand/60">{cert.blockchainHash}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Share2 size={16} /></button>
                    <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const VerificationTab: React.FC = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Access Logs</h2>
      <p className="text-white/40 text-sm mt-1">Real-time verification request monitoring</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-brand/20">
        <Activity className="text-brand mb-4" size={24} />
        <h4 className="font-bold">Total Pings</h4>
        <div className="text-2xl font-bold mt-2">1,248</div>
        <p className="text-[10px] text-white/40 mt-1">Last 24 hours</p>
      </Card>
      <Card className="p-6">
        <Globe className="text-white/40 mb-4" size={24} />
        <h4 className="font-bold">Geo-Distribution</h4>
        <div className="text-2xl font-bold mt-2">14 Countries</div>
        <p className="text-[10px] text-white/40 mt-1">Top source: USA (42%)</p>
      </Card>
      <Card className="p-6">
        <History className="text-white/40 mb-4" size={24} />
        <h4 className="font-bold">Avg. Response</h4>
        <div className="text-2xl font-bold mt-2">142ms</div>
        <p className="text-[10px] text-white/40 mt-1">Node confirmation speed</p>
      </Card>
    </div>

    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 font-bold text-sm uppercase tracking-wider">Live Traffic</div>
      <div className="divide-y divide-white/5">
        {[
          { time: '2m ago', origin: 'API Gateway', action: 'Identity Verification', status: 'SUCCESS', ip: '192.168.1.1' },
          { time: '12m ago', origin: 'Public Portal', action: 'Public Verification', status: 'SUCCESS', ip: '45.12.33.102' },
          { time: '45m ago', origin: 'Partner Node', action: 'Consensus Sync', status: 'SUCCESS', ip: '8.8.8.8' },
        ].map((log, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between text-sm hover:bg-white/[0.01]">
            <div className="flex gap-4 items-center">
              <div className="text-white/30 text-xs font-mono">{log.time}</div>
              <div>
                <div className="font-bold">{log.action}</div>
                <div className="text-[10px] text-white/40">Source: {log.origin} • {log.ip}</div>
              </div>
            </div>
            <Badge variant="success">Confirmed</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const SecurityTab: React.FC = () => (
  <div className="space-y-8 max-w-4xl">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Security & Governance</h2>
      <p className="text-white/40 text-sm mt-1">Manage cryptographic keys and access controls</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand/10 rounded-xl"><Key className="text-brand" /></div>
          <h4 className="font-bold">Blockchain Settings</h4>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
              <div className="text-sm font-bold">Auto-Sync Registry</div>
              <div className="text-[10px] text-white/40">Immediately broadcast every issuance</div>
            </div>
            <div className="w-10 h-5 bg-brand rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
              <div className="text-sm font-bold">Two-Factor Auth</div>
              <div className="text-[10px] text-white/40">Required for issuance approval</div>
            </div>
            <div className="w-10 h-5 bg-brand rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl"><Lock className="text-white/60" /></div>
          <h4 className="font-bold">Role-Based Access</h4>
        </div>
        <div className="space-y-3">
          {[
            { role: 'Admin', count: 2, permissions: 'Full Control' },
            { role: 'Issuer', count: 5, permissions: 'Can Issue' },
            { role: 'Viewer', count: 12, permissions: 'Read Only' },
          ].map(r => (
            <div key={r.role} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0">
              <div className="text-sm font-medium">{r.role} <span className="text-[10px] text-white/30 ml-2">({r.count} users)</span></div>
              <div className="text-[10px] uppercase font-bold text-white/40">{r.permissions}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const SettingsTab: React.FC = () => (
  <div className="space-y-8 max-w-4xl">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
      <p className="text-white/40 text-sm mt-1">Configure your branding and system preferences</p>
    </div>

    <Card className="p-10 space-y-10">
      <div className="space-y-6">
        <h4 className="font-bold text-lg">Branding</h4>
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-[10px] text-white/40 hover:border-brand/40 transition-colors cursor-pointer">
            <PlusCircle size={20} className="mb-2" /> Upload Logo
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Display Name</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand/50" defaultValue="Stanford University Online" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Official Domain</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand/50" defaultValue="online.stanford.edu" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/5" />

      <div className="space-y-6">
        <h4 className="font-bold text-lg">Billing & Plan</h4>
        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-4">
            <CreditCard className="text-white/40" />
            <div>
              <div className="font-bold">Enterprise Plan</div>
              <div className="text-xs text-white/40">Unlimited Issuance • Priority Node Support</div>
            </div>
          </div>
          <Button variant="secondary" className="h-10 text-xs">Manage Subscription</Button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost">Discard Changes</Button>
        <Button variant="primary" className="px-10">Save Configuration</Button>
      </div>
    </Card>
  </div>
);

const VerifyView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);

  const handleVerify = () => {
    if (!query) return;
    setIsVerifying(true);
    setTimeout(() => {
      setResult({
        id: 'CRT-9823-X',
        recipientName: 'Alice Johnson',
        recipientEmail: 'alice@example.com',
        courseTitle: 'Advanced Machine Learning',
        issuingBody: 'Stanford University Online',
        issueDate: '2024-11-20',
        blockchainHash: '0x8f2c3a1e...99b2',
        transactionId: 'TX-882190',
        status: CertificateStatus.VALID
      });
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <div className="text-center space-y-6 mb-12">
        <h2 className="text-5xl font-bold tracking-tight">Public Verification</h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Enter a certificate ID or transaction hash to verify its authenticity on the 
          distributed ledger. No account required.
        </p>
      </div>

      <div className="flex gap-4 p-2 glass rounded-2xl border border-white/10 shadow-2xl">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ID (e.g., CRT-9823-X)"
          className="flex-1 bg-transparent px-6 text-lg focus:outline-none"
        />
        <Button 
          variant="primary" 
          className="px-8 h-14" 
          onClick={handleVerify}
          isLoading={isVerifying}
        >
          {isVerifying ? 'Scanning Ledger...' : 'Verify Now'}
        </Button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="p-0 overflow-hidden border-brand/40">
              <div className="bg-brand/10 p-6 flex items-center justify-between border-b border-brand/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-brand" size={24} />
                  <span className="text-brand font-bold tracking-widest uppercase">Identity Confirmed</span>
                </div>
                <Badge variant="success">Blockchain Validated</Badge>
              </div>
              
              <div className="p-10 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recipient Name</label>
                    <div className="text-2xl font-bold">{result.recipientName}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Certification</label>
                    <div className="text-xl font-medium">{result.courseTitle}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Issuing Authority</label>
                    <div className="text-white/70">{result.issuingBody}</div>
                  </div>
                </div>

                <div className="space-y-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <History size={12} /> Blockchain Metadata
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Transaction ID</label>
                      <code className="text-xs text-brand font-mono">{result.transactionId}</code>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Block Hash</label>
                      <code className="text-[10px] text-white/60 break-all font-mono">{result.blockchainHash}</code>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Status</label>
                      <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        IMMUTABLE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                <Button variant="ghost">Download Original PDF</Button>
                <Button variant="secondary">View On Explorer</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
