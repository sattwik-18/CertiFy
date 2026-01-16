import React, { useState, useRef, useEffect } from 'react';
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
  AlertCircle,
  LogOut,
  X,
  Download,
  Copy,
  ScanLine
} from 'lucide-react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Button, Card, Badge, cn } from './components/UI';
import { MainAreaChart, SecurityGauge } from './components/DashboardCharts';
import { AppView, Certificate, CertificateStatus } from './types';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { supabase } from './src/lib/supabase';
import { useRealtimeCertificates } from './src/hooks/useRealtimeCertificates';
import { ToastContainer, ToastMessage, ToastType } from './components/Toast';
import { profilesService, UserProfile } from './src/services/supabase/profiles';
import { certificatesService, CertificateRow } from './src/services/supabase/certificates';
import { useRealtimeVerifications } from './src/hooks/useRealtimeVerifications';
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('LANDING');
  const [isLoading, setIsLoading] = useState(false);
  const { certificates, loading: certsLoading } = useRealtimeCertificates(user?.id);
  const { events } = useRealtimeVerifications(user?.id); // Define events!

  // Real Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('Overview');

  // Toast Helpers
  const addToast = (title: string, type: ToastType = 'success', message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, type, message }]);

    // Optional Sound
    if (type === 'success') {
      // Small "ding" if desired, skipping for cleanliness unless requested specifically to implement audio api
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch Profile
  React.useEffect(() => {
    if (user) {
      profilesService.getProfile(user.id).then(p => {
        if (p) setProfile(p);
        else {
          // Fallback if profile missing (auto-created usually)
          setProfile({ id: user.id, email: user.email!, name: user.user_metadata?.full_name || 'User', created_at: new Date().toISOString() });
        }
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  // Auth Redirects
  React.useEffect(() => {
    if (!loading) {
      if (user && view === 'AUTH') setView('DASHBOARD');
      if (!user && view === 'DASHBOARD') setView('AUTH');
    }
  }, [user, view, loading]);

  const navigate = (to: AppView) => {
    // Protected Route Check
    if (to === 'DASHBOARD' && !user) {
      setView('AUTH');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setView(to);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 400);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('LANDING');
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>; // Initial Load
  }

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
            <span className="text-2xl font-bold tracking-tighter">Certify CLM</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Products</button>
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Enterprise</button>
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pricing</button>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Button variant="ghost" className="text-sm" onClick={() => navigate('VERIFY')}>Verify Contract</Button>
            {user ? (
              <Button variant="primary" className="text-sm px-8" onClick={() => navigate('DASHBOARD')}>Dashboard</Button>
            ) : (
              <Button variant="primary" className="text-sm px-8" onClick={() => navigate('AUTH')}>Sign In</Button>
            )}
            {user && (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand/20 border border-white/5 flex items-center justify-center transition-all overflow-hidden"
                >
                  {profile?.name?.[0] || user.email?.[0] || <User size={18} />}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-56 p-2 rounded-xl glass border border-white/5 shadow-2xl z-50 bg-black/90"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-2">
                        <div className="text-sm font-bold truncate text-white">{profile?.name || 'User'}</div>
                        <div className="text-[10px] text-white/40 truncate">{user.email}</div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setDashboardTab('Overview');
                            navigate('DASHBOARD');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setDashboardTab('Settings');
                            navigate('DASHBOARD');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings size={14} /> Settings
                        </button>
                        <div className="h-[1px] bg-white/5 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {view === 'LANDING' && <LandingView onStart={() => navigate(user ? 'DASHBOARD' : 'AUTH')} onVerify={() => navigate('VERIFY')} />}
          {view === 'AUTH' && <AuthView />}
          {view === 'DASHBOARD' && user && (
            <DashboardView
              certificates={certificates}
              profile={profile}
              user={user}
              addToast={addToast}
              activeTab={dashboardTab}
              setActiveTab={setDashboardTab}
              events={events} // Pass the events!
            />
          )}
          {view === 'VERIFY' && <VerifyView />}
        </AnimatePresence>
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <span className="text-brand font-mono text-xs tracking-widest uppercase">Initializing Secure Workspace...</span>
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
    </div>
  </motion.div>
);

const AuthView: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created! Please check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto px-6 py-24"
    >
      <Card className="p-10 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">{isSignUp ? 'Create Contract Workspace' : 'Welcome Back'}</h2>
          <p className="text-white/50 text-sm">Sign in to manage your organization's contracts</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
              {!isSignUp && <button className="text-[10px] text-brand uppercase font-bold tracking-widest hover:underline">Forgot?</button>}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full py-4 text-black" onClick={handleSubmit} isLoading={loading}>
            {isSignUp ? 'Create Account' : 'Login to Workspace'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#111] px-2 text-white/30">Or continue with</span></div>
          </div>

          <Button variant="secondary" className="w-full py-3" onClick={signInWithGoogle}>
            Google
          </Button>
        </div>

        <p className="text-center text-xs text-white/30">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            className="text-brand font-bold ml-2 hover:underline"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </Card>
    </motion.div>
  );
};

const DashboardView: React.FC<{
  certificates: CertificateRow[],
  profile: UserProfile | null,
  user: any,
  addToast: (title: string, type: ToastType, message?: string) => void,
  activeTab: string,
  setActiveTab: (tab: string) => void,
  events: any[]
}> = ({ certificates, profile, user, addToast, activeTab, setActiveTab, events }) => {

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab certificates={certificates} events={events} />;
      case 'Create Contract': return <IssueNewTab addToast={addToast} />;
      case 'Contracts': return <RegistryTab certificates={certificates} addToast={addToast} />; // Pass addToast
      case 'Verification': return <VerificationTab events={events} />;
      case 'Security': return <SecurityTab />;
      case 'Settings': return <SettingsTab />;
      default: return <OverviewTab certificates={certificates} events={events} />;
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
              {/* Fallback avatar if no image */}
              <div className="text-brand font-bold text-lg">
                {(profile?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">{profile?.name || user?.email?.split('@')[0] || 'User'}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{profile?.email || user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { label: 'Overview', icon: LayoutDashboard },
              { label: 'Create Contract', icon: PlusCircle },
              { label: 'Contracts', icon: Database },
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

const OverviewTab: React.FC<{ certificates: CertificateRow[], events?: any[] }> = ({ certificates, events = [] }) => {
  // Calculate Stats
  const totalIssued = certificates.length;
  const totalVerifications = events.length;
  // Security status is 100% because RLS is on
  const securityStatus = totalIssued > 0 ? 100 : 100;

  // Chart Data: Group by Month (using created_at)
  const chartData = React.useMemo(() => {
    if (certificates.length === 0) return [];

    const months: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}`;
      months[key] = 0;
    }

    certificates.forEach(cert => {
      const date = new Date(cert.created_at);
      const key = `${monthNames[date.getMonth()]}`;
      if (months[key] !== undefined) {
        months[key]++;
      }
    });

    return Object.keys(months).map(name => ({ name, value: months[name] }));
  }, [certificates]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
          <p className="text-white/40 text-sm mt-1">Real-time blockchain synchronization active</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="success">Mainnet Node Live</Badge>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Contracts Created</p>
          <h3 className="text-3xl font-bold mt-2">{totalIssued}</h3>
          <div className="mt-4 text-brand text-[10px] font-bold">LIFECYCLE TOTAL</div>
        </Card>
        <Card className="p-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Integrity Checks</p>
          <h3 className="text-3xl font-bold mt-2">{totalVerifications}</h3>
          <Badge variant="success" className="mt-4">Real-time Logs</Badge>
        </Card>
        <Card className="p-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Security Status</p>
          <h3 className="text-3xl font-bold mt-2">{securityStatus}%</h3>
          <div className="mt-4 text-white/40 text-[10px]">Encrypted AES-256</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h4 className="font-bold mb-6">Contract Velocity</h4>
          <MainAreaChart data={chartData} />
        </Card>
        <Card className="p-8">
          <h4 className="font-bold mb-6 text-center">Security Audit</h4>
          <div className="flex flex-col items-center">
            <SecurityGauge value={100} />
            <p className="mt-8 text-sm text-white/50 text-center">Row Level Security: <span className="text-brand font-bold">Active</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const IssueNewTab: React.FC<{ addToast: (title: string, type: ToastType, message?: string) => void }> = ({ addToast }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', body: 'Stanford Online'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<{ file: File, id: string }[]>([]);
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

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      addToast('Error', 'error', "Please upload at least one contract.");
      return;
    }
    if (!user) {
      addToast('Auth Error', 'error', "You must be logged in.");
      return;
    }

    setIsProcessing(true);

    try {
      for (const f of files) {
        await certificatesService.createCertificate(f.file, {
          userId: user.id,
          issuedTo: mode === 'SINGLE' ? formData.name : `Bulk Holder`,
          issuedBy: formData.body,
        });
      }
      addToast('Success', 'success', `Successfully created ${files.length} contracts.`);
      setFiles([]);
    } catch (error: any) {
      console.error(error);
      addToast('Upload Failed', 'error', error.message || "Unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <Badge variant="neutral" className="mb-2">Module v2.4</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Create New Contract</h2>
          <p className="text-white/40 text-sm">Secure and broadcast immutable contract records to the global ledger.</p>
        </div>
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => { setMode('SINGLE'); setFiles([]); }}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", mode === 'SINGLE' ? "bg-brand text-black" : "text-white/40 hover:text-white")}
          >
            <User size={14} /> Single Contract
          </button>
          <button
            onClick={() => { setMode('BULK'); setFiles([]); }}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", mode === 'BULK' ? "bg-brand text-black" : "text-white/40 hover:text-white")}
          >
            <Layers size={14} /> Bulk Processing
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Step 1: Meta Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-6 border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <FileUp size={16} /> Contract Metadata
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
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Counterparty Name</label>
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand/50 outline-none transition-colors"
                      placeholder="Acme Corp / John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
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
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Contract Title</label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand/50 outline-none transition-colors"
                placeholder="Service Agreement v1"
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
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
                <div className="text-xl font-bold">Upload Contract Document</div>
                <p className="text-white/40 text-sm mt-1">Drag & drop or click to browse (PDF)</p>
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
                          <div className="text-[10px] text-white/30 uppercase tracking-widest">{(f.file.size / (1024 * 1024)).toFixed(2)} MB • READY</div>
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
              {isProcessing ? 'Mining Transaction...' : `Secure & Finalize ${files.length > 1 ? 'Batch' : 'Contract Record'}`}
            </Button>
            <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.2em]">
              Authorized by Secure Contract Node Authority
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};



const RegistryTab: React.FC<{
  certificates: CertificateRow[],
  addToast: (title: string, type: ToastType, message?: string) => void
}> = ({ certificates, addToast }) => {
  const [selectedCert, setSelectedCert] = useState<CertificateRow | null>(null);
  const [modalMode, setModalMode] = useState<'DETAILS' | 'SHARE' | 'DELETE' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter certificates based on search query
  const filteredCertificates = certificates.filter(cert => {
    const q = searchQuery.toLowerCase();
    return (
      (cert.issued_to && cert.issued_to.toLowerCase().includes(q)) ||
      (cert.issued_by && cert.issued_by.toLowerCase().includes(q)) ||
      (cert.file_name && cert.file_name.toLowerCase().includes(q)) ||
      (cert.file_hash && cert.file_hash.toLowerCase().includes(q))
    );
  });

  // Handlers
  const handleOpenDetails = (cert: CertificateRow) => {
    setSelectedCert(cert);
    setModalMode('DETAILS');
  };



  const handleOpenShare = (cert: CertificateRow) => {
    setSelectedCert(cert);
    setModalMode('SHARE');
  };

  const handleOpenDelete = (cert: CertificateRow) => {
    setSelectedCert(cert);
    setModalMode('DELETE');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedCert(null);
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addToast('Download Started', 'success', `Downloading ${name}...`);
    } catch (e) {
      console.error('Download error:', e);
      addToast('Download Failed', 'error', 'Could not download file.');
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    addToast('Hash Copied', 'success', 'Certificate hash copied to clipboard.');
  };

  const handleCopyQR = async () => {
    if (!selectedCert) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${selectedCert.file_hash}&bgcolor=ffffff&color=000000`;

      // Fetch blob directly to avoid Canvas tainting issues (CORS)
      const response = await fetch(qrUrl);
      const blob = await response.blob();

      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        addToast('QR Code Copied', 'success', 'QR image copied to clipboard.');
      }
    } catch (e) {
      console.error(e);
      addToast('Copy Failed', 'error', 'Could not copy QR code.');
    }
  };

  const handleDelete = async () => {
    if (!selectedCert) return;
    setIsDeleting(true);
    try {
      await certificatesService.deleteCertificate(selectedCert.id, selectedCert.file_path);
      addToast('Contract Withdrawn', 'success', 'The contract has been withdrawn.');
      handleCloseModal();
      // Realtime subscription will update the list
    } catch (e) {
      console.error(e);
      addToast('Delete Failed', 'error', 'Could not delete certificate.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contract Repository</h2>
          <p className="text-white/40 text-sm mt-1">Total indexed contracts: {certificates.length}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search placeholder */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-brand/50 outline-none w-64 text-white"
              placeholder="Search contracts..."
            />
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden min-h-[400px]">
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/40">
            <Database size={48} className="mb-4 opacity-50" />
            <p>No contracts found in repository.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr className="text-[10px] uppercase tracking-widest text-white/30">
                  <th className="px-6 py-4 font-bold">Counterparty</th>
                  <th className="px-6 py-4 font-bold">Contract Title</th>
                  <th className="px-6 py-4 font-bold">Created On</th>
                  <th className="px-6 py-4 font-bold">Contract Hash</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                      No matching contracts found.
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map(cert => (
                    <tr
                      key={cert.id}
                      className="text-sm group hover:bg-white/[0.05] transition-colors cursor-pointer border-b border-white/5 last:border-0"
                      onClick={() => handleOpenDetails(cert)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{cert.issued_to || 'N/A'}</div>
                        <div className="text-[10px] text-white/40">{cert.issued_by || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate text-white/80" title={cert.file_name}>
                        {cert.file_name}
                      </td>
                      <td className="px-6 py-4 text-white/50">{cert.created_at ? new Date(cert.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 font-mono text-[10px] text-brand/60" title={cert.file_hash}>
                        {cert.file_hash ? cert.file_hash.substring(0, 10) + '...' : 'PENDING'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                          <button onClick={(e) => { e.stopPropagation(); handleOpenShare(cert); }} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="Share / Contract Link">
                            <Share2 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleOpenDelete(cert); }} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors" title="Withdraw">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODALS LAYER */}
      <AnimatePresence>
        {modalMode && selectedCert && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            {/* DETAILS MODAL (Merged Preview + Share) */}
            {modalMode === 'DETAILS' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Left Column: Document Preview */}
                <div className="flex-1 bg-black/40 relative flex items-center justify-center border-r border-white/10 p-8">
                  {selectedCert.file_name.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={certificatesService.getPublicUrl(selectedCert.file_path)}
                      className="w-full h-full rounded-xl shadow-2xl"
                      title="PDF Preview"
                    />
                  ) : (
                    <img
                      src={certificatesService.getPublicUrl(selectedCert.file_path)}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  )}
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-[400px] bg-[#111] flex flex-col relative">
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Contract Details</h3>
                    <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* QR Card */}
                    <div className="relative flex items-center justify-center p-[2px] rounded-2xl overflow-hidden shadow-2xl">
                      <div
                        className="absolute inset-[-100%] animate-spin"
                        style={{
                          background: 'conic-gradient(from 0deg, transparent 0deg, #22c55e 90deg, transparent 180deg)',
                          animationDuration: '3s'
                        }}
                      />
                      <div className="relative bg-[#0A0A0A] rounded-2xl p-2 z-10 w-full h-full flex items-center justify-center">
                        <div className="bg-white p-2 rounded-xl">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${selectedCert.file_hash}&bgcolor=ffffff&color=000000`}
                            alt="QR Code"
                            className="w-32 h-32 block"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Counterparty</div>
                        <div className="font-semibold text-white">{selectedCert.issued_to}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Contract Owner</div>
                        <div className="font-semibold text-white">{selectedCert.issued_by}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Created On</div>
                        <div className="font-semibold text-white">{new Date(selectedCert.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="group cursor-pointer" onClick={() => handleCopyHash(selectedCert.file_hash)}>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                          Contract Ledger Hash <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="font-mono text-xs text-brand truncate p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                          {selectedCert.file_hash}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 border-t border-white/10 space-y-3 bg-[#0A0A0A]">
                    <Button variant="primary" className="w-full" onClick={() => handleDownload(certificatesService.getPublicUrl(selectedCert.file_path), selectedCert.file_name)}>
                      <Download size={16} className="mr-2" /> Download Original
                    </Button>
                    <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleOpenDelete(selectedCert)}>
                      <Trash2 size={16} className="mr-2" /> Withdraw Contract
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SHARE MODAL */}
            {modalMode === 'SHARE' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>

                <h3 className="text-xl font-bold mb-6">Share Contract</h3>

                {/* Content */}
                <div className="relative flex items-center justify-center p-[2px] rounded-2xl overflow-hidden shadow-2xl mb-8">
                  {/* Spinning Gradient Background */}
                  <div
                    className="absolute inset-[-100%] animate-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, #22c55e 90deg, transparent 180deg)',
                      animationDuration: '3s'
                    }}
                  />

                  {/* Inner Card */}
                  <div className="relative bg-[#0A0A0A] rounded-2xl p-2 z-10 w-full h-full flex items-center justify-center">
                    <div className="bg-white p-3 rounded-xl">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${selectedCert.file_hash}&bgcolor=ffffff&color=000000`}
                        alt="QR Code"
                        className="w-48 h-48 block"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Button variant="primary" className="w-full" onClick={handleCopyQR}>
                    <Copy size={16} className="mr-2" /> Copy QR Code
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => {
                    const dateStr = selectedCert.created_at ? new Date(selectedCert.created_at).toISOString().split('T')[0] : 'unknown-date';
                    const shortHash = selectedCert.file_hash ? selectedCert.file_hash.substring(0, 8) : 'unknown-hash';
                    handleDownload(
                      `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${selectedCert.file_hash}`,
                      `verification-qrcode-${dateStr}-${shortHash}.png`
                    );
                  }}>
                    <Download size={16} className="mr-2" /> Download QR Code
                  </Button>
                </div>

                <div className="mt-6 w-full bg-white/5 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleCopyHash(selectedCert.file_hash)}>
                  <div className="truncate font-mono text-xs text-brand mr-2 max-w-[200px]">
                    {selectedCert.file_hash}
                  </div>
                  <Copy size={14} className="text-white/40 group-hover:text-white" />
                </div>
              </motion.div>
            )}

            {/* DELETE MODAL */}
            {modalMode === 'DELETE' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0A0A0A] border border-red-500/20 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Withdraw Contract?</h3>
                <p className="text-white/50 text-sm mb-8">
                  Are you sure you want to withdraw this contract with <span className="text-white font-bold">{selectedCert.issued_to}</span>?<br />
                  This action cannot be undone.
                </p>

                <div className="flex gap-4 w-full">
                  <Button variant="ghost" className="flex-1" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Withdrawing...' : 'Withdraw Permanently'}
                  </Button>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VerificationTab: React.FC<{ events: any[] }> = ({ events }) => {
  // Simple stats calculation with safety checks
  const safeEvents = Array.isArray(events) ? events : [];
  const totalPings = safeEvents.length;
  const uniqueCountries = new Set(safeEvents.map(e => e?.geo_country).filter(Boolean)).size;

  // Calculate Average Latency
  const latencies = safeEvents
    .map(e => e.latency_ms)
    .filter((ms): ms is number => typeof ms === 'number' && ms > 0);

  const avgResponse = latencies.length > 0
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) + "ms"
    : "Calculating...";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Access Logs</h2>
        <p className="text-white/40 text-sm mt-1">Real-time contract integrity checks</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-brand/20">
          <Activity className="text-brand mb-4" size={24} />
          <h4 className="font-bold">Total Pings</h4>
          <div className="text-2xl font-bold mt-2">{totalPings}</div>
          <p className="text-[10px] text-white/40 mt-1">All time events</p>
        </Card>
        <Card className="p-6">
          <Globe className="text-white/40 mb-4" size={24} />
          <h4 className="font-bold">Geo-Distribution</h4>
          <div className="text-2xl font-bold mt-2">{uniqueCountries} Countries</div>
          <p className="text-[10px] text-white/40 mt-1">Global reach</p>
        </Card>
        <Card className="p-6">
          <History className="text-white/40 mb-4" size={24} />
          <h4 className="font-bold">Avg. Response</h4>
          <div className="text-2xl font-bold mt-2">{avgResponse}</div>
          <p className="text-[10px] text-white/40 mt-1">Node confirmation speed</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 font-bold text-sm uppercase tracking-wider">Live Traffic</div>
        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
          {safeEvents.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">No verification events yet.</div>
          ) : (
            safeEvents.map((log) => {
              if (!log) return null;
              const fileName = log.certificates?.file_name || 'Contract Integrity Check';
              const verifier = log.verifier_org_name || 'Anonymous';
              const ip = log.ip_address || 'Unknown IP';
              const time = log.verified_at ? new Date(log.verified_at).toLocaleTimeString() : 'Just now';
              const isSuccess = !!log.success;

              return (
                <div key={log.id || Math.random()} className="px-6 py-4 flex items-center justify-between text-sm hover:bg-white/[0.01] animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="flex gap-4 items-center">
                    <div className="text-white/30 text-xs font-mono">{time}</div>
                    <div>
                      <div className="font-bold">
                        {fileName}
                      </div>
                      <div className="text-[10px] text-white/40">
                        Verifier: {verifier} • {ip}
                      </div>
                    </div>
                  </div>
                  <Badge variant={isSuccess ? "success" : "destructive"}>
                    {isSuccess ? "Confirmed" : "Failed"}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

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
              <div className="text-sm font-bold">Auto-Sync Contracts</div>
              <div className="text-[10px] text-white/40">Immediately broadcast every contract</div>
            </div>
            <div className="w-10 h-5 bg-brand rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
            <div>
              <div className="text-sm font-bold">Two-Factor Auth</div>
              <div className="text-[10px] text-white/40">Required for contract approval</div>
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
            { role: 'Owner', count: 5, permissions: 'Can Create' },
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
              <div className="text-xs text-white/40">Unlimited Contracts • Priority Node Support</div>
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
  const [result, setResult] = useState<any | null>(null); // Using any for simplicity as joined type is complex
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // QR Scanner Logic
  const [scannerActive, setScannerActive] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Clean up on unmount or close
  useEffect(() => {
    if (!showScanner && html5QrCodeRef.current) {
      if (scannerActive) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
          setScannerActive(false);
        }).catch(console.error);
      }
    }
    return () => {
      if (html5QrCodeRef.current && scannerActive) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [showScanner, scannerActive]);

  const handleCloseScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error("Failed to stop scanner", e);
      }
      html5QrCodeRef.current = null;
    }
    setScannerActive(false);
    setShowScanner(false);
  };

  const startCamera = async () => {
    if (scannerActive) return; // Prevent double activation

    try {
      // 1. Cleanup any existing instance
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current.clear();
        } catch (e) {
          console.warn("Cleanup error", e);
        }
        html5QrCodeRef.current = null;
      }

      // 2. Explicitly check permissions/devices first
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error("No camera devices found.");
        }
      } catch (e) {
        throw new Error("Camera permission denied.");
      }

      // 3. Initialize
      const codes = new Html5Qrcode("reader");
      html5QrCodeRef.current = codes;

      await codes.start(
        { facingMode: "environment" },
        { fps: 30, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScanSuccess(true);

          // CRITICAL FIX: Safe cleanup sequence to prevent "White Screen" / Crash
          const codeReader = html5QrCodeRef.current;
          html5QrCodeRef.current = null; // Detach ref immediately to prevent further calls

          if (codeReader) {
            codeReader.stop().then(() => {
              codeReader.clear();
            }).catch(err => {
              console.warn("Scanner stop error (harmless if unmounted):", err);
            });
          }
          setScannerActive(false);

          setTimeout(() => {
            setQuery(decodedText);
            setShowScanner(false);
            setScanSuccess(false);
            handleVerify(decodedText);
          }, 300);
        },
        (errorMessage) => {
          // ignore frame errors
        }
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Error starting camera", err);
      setError("Could not access camera. Please reset permissions and reload.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const codes = new Html5Qrcode("reader"); // Temporary instance for file scan
      try {
        const decodedText = await codes.scanFile(file, true);
        setScanSuccess(true);
        setTimeout(() => {
          setQuery(decodedText);
          setShowScanner(false);
          setScanSuccess(false);
          handleVerify(decodedText); // Auto-verify
        }, 1000);
      } catch (err) {
        console.error("Error scanning file", err);
        setError("Could not find a valid QR code in this image.");
      }
    }
  };

  const handleFileVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsHashing(true);

      try {
        // 1. Read File
        const buffer = await file.arrayBuffer();

        // 2. Simulate "Live Encryption" delay for animation effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Calculate SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        setIsHashing(false);
        setQuery(hashHex); // Set the calculated hash
        handleVerify(hashHex); // Auto-verify

      } catch (err) {
        console.error("Hashing error", err);
        setIsHashing(false);
        setError("Failed to process file. Please try again.");
      }
    }
  };

  const handleVerify = async (manualHash?: string) => {
    const hashToVerify = manualHash || query;
    if (!hashToVerify) return;

    setIsVerifying(true);
    setResult(null);
    setError(null);

    // Fetch Real IP/Geo
    let ip = "Unknown IP";
    let country = "Unknown Country";

    try {
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      ip = geoData.ip || ip;
      country = geoData.country_name || country;
    } catch (e) {
      console.warn('Failed to fetch geo data', e);
    }

    try {
      const startTime = performance.now(); // Start Timer

      const data = await certificatesService.verifyCertificate(hashToVerify);

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime); // Calculate ms

      if (data) {
        setResult(data);
        // Log Success
        await certificatesService.logVerificationEvent({
          certificateId: data.id,
          certificateHash: hashToVerify,
          success: true,
          verifierOrgName: 'Public Portal',
          ownerId: data.user_id, // Critical for dashboard
          ipAddress: ip,
          geoCountry: country,
          latencyMs: latency // Log it!
        });
      } else {
        setError("Contract not found. The hash does not match any contract in our blockchain registry.");
        // Log Failure
        await certificatesService.logVerificationEvent({
          certificateHash: hashToVerify,
          success: false,
          verifierOrgName: 'Public Portal',
          latencyMs: latency,
          ipAddress: ip,
          geoCountry: country,
        });
      }

    } catch (err: any) {
      console.error('Verify error:', err);
      setError(`An error occurred: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <div className="text-center space-y-6 mb-12">
        <h2 className="text-5xl font-bold tracking-tight">Public Contract Verification</h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Enter a contract ID or hash or scan a QR code to verify its integrity on the
          distributed ledger. No account required.
        </p>
      </div>



      {/* ENCRYPTION STATUS OVERLAY */}
      <AnimatePresence>
        {isHashing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 w-full max-w-md relative overflow-hidden font-mono">
              {/* Background Grid Effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />

              <div className="relative z-10 space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-2">Live Encryption Status</div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#B2FF0B] rounded-full animate-pulse shadow-[0_0_10px_#B2FF0B]" />
                    <div className="text-[#B2FF0B] font-bold tracking-widest text-lg">SHA-256 HASH GENERATION</div>
                  </div>
                </div>

                {/* Simulated Console Output */}
                <div className="space-y-1 text-xs text-white/60">
                  <div className="flex justify-between"><span>Reading Bytes...</span> <span className="text-[#B2FF0B]">DONE</span></div>
                  <div className="flex justify-between"><span>Calculating Digest...</span> <span className="animate-pulse text-white">PROCESSING</span></div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#B2FF0B] shadow-[0_0_10px_#B2FF0B]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {
        showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={handleCloseScanner}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Scan QR Code</h3>
                <button
                  onClick={handleCloseScanner}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-6">
                {/* Reader Container */}
                <div id="reader" className="w-full h-full absolute inset-0 rounded-xl overflow-hidden"></div>

                {/* Success Overlay */}
                {scanSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
                    >
                      <CheckCircle2 size={32} className="text-black" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Scanned!</h3>
                  </motion.div>
                )}

                {/* Controls (Only show if camera not active) */}
                {!scannerActive && (
                  <div className="flex flex-col gap-4 w-full z-10 relative px-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 bg-[#B2FF0B] hover:bg-[#a1e60a] text-black font-bold text-lg rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(178,255,11,0.3)] transition-all"
                      onClick={startCamera}
                    >
                      <Eye size={20} /> Open Camera
                    </motion.button>

                    <div className="relative w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={handleFileUpload}
                        title=""
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-14 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-full flex items-center justify-center gap-3 transition-colors"
                      >
                        <UploadCloud size={20} /> Upload QR Image
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )
      }

      <div className="flex gap-4 p-2 glass rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste hash (e.g., a8f5f167f44f496...)"
          className="flex-1 bg-transparent px-6 text-lg focus:outline-none font-mono text-sm"
        />
        <Button
          variant="primary"
          className="px-8 h-14"
          onClick={() => handleVerify()}
          isLoading={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Now'}
        </Button>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScanner(true)}
          className="group flex flex-col items-center justify-center w-32 h-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-colors hover:border-brand/50"
        >
          <div className="p-3 bg-brand/10 rounded-full mb-3 group-hover:bg-brand/20 transition-colors">
            <ScanLine size={24} className="text-brand" />
          </div>
          <span className="text-sm font-medium text-white/70 group-hover:text-white">Scan QR</span>
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex flex-col items-center justify-center w-32 h-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-colors hover:border-blue-400/50"
        >
          <input
            type="file"
            accept="*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleFileVerify}
            disabled={isHashing}
          />
          <div className="p-3 bg-blue-500/10 rounded-full mb-3 group-hover:bg-blue-500/20 transition-colors">
            <FileUp size={24} className="text-blue-400" />
          </div>
          <span className="text-sm font-medium text-white/70 group-hover:text-white">Upload File</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400"
          >
            <AlertCircle className="inline-block mr-2 mb-1" size={16} />
            {error}
          </motion.div>
        )}

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
                  <span className="text-brand font-bold tracking-widest uppercase">Integrity Verified</span>
                </div>
                <Badge variant="success">Anchored on Blockchain</Badge>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Counterparty</label>
                    <div className="text-2xl font-bold">{result.issued_to || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Contract Document</label>
                    <div className="text-xl font-medium">{result.file_name}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Contract Owner</label>
                    <div className="text-white/70">{result.profiles?.name || 'Unknown Owner'} <span className="text-xs opacity-50">({result.profiles?.email})</span></div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Creation Date</label>
                    <div className="text-white/70">{new Date(result.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="space-y-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <History size={12} /> Ledger Metadata
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Row ID</label>
                      <code className="text-xs text-brand font-mono">{result.id}</code>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">File Hash (SHA-256)</label>
                      <code className="text-[10px] text-white/60 break-all font-mono">{result.file_hash}</code>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">Status</label>
                      <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        IMMUTABLE - STORED ON SUPABASE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                <Button variant="ghost" onClick={() => window.open(result.file_path, '_blank')}>Download/View File</Button>
                <Button variant="secondary">View On Explorer</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div >
  );
};
