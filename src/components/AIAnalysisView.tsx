import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Smartphone, ShieldCheck, ShieldAlert, AlertTriangle, ScanLine, Cpu, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Button } from '../../components/UI';
import { analyzeContract, AnalysisResult } from '../services/ai.service';

export const AIAnalysisView = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: OCR (Gemini), 2: Analysis (Groq), 3: Done
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsScanning(true);
    setScanStep(1); // Start OCR

    try {
      // Simulate visual progress for steps if API is too fast
      const scanningTimer = setInterval(() => {
        setScanStep(prev => (prev < 2 ? prev + 1 : prev));
      }, 3000);

      const analysisResult = await analyzeContract(file);

      clearInterval(scanningTimer);
      setResult(analysisResult);
      setScanStep(3); // Done
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      setIsScanning(false);
      setScanStep(0);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setIsScanning(false);
    setScanStep(0);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight mb-2">AI Contract Forensics</h2>
        <p className="text-white/40">Advanced document forgery detection powered by Gemini & Groq/Llama3.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Upload */}
        {!isScanning && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-8"
          >
            <div
              className={`border-2 border-dashed rounded-3xl p-20 flex flex-col items-center justify-center transition-colors cursor-pointer
                ${isDragging ? 'border-brand bg-brand/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />

              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                {file ? <FileText size={48} className="text-brand" /> : <Upload size={48} className="text-white/30" />}
              </div>

              <h3 className="text-2xl font-bold mb-2">
                {file ? file.name : "Drop Contract File Here"}
              </h3>
              <p className="text-white/30 text-center max-w-md">
                {file ?
                  `Ready to analyze. ${(file.size / 1024 / 1024).toFixed(2)} MB` :
                  "Upload PDF or Image contracts. AI will analyze pixel data, metadata, and structural logic for signs of forgery."}
              </p>

              {file && (
                <Button onClick={(e) => { e.stopPropagation(); startAnalysis(); }} className="mt-8 px-8 py-6 text-lg bg-brand text-black hover:bg-brand/90">
                  <ScanLine className="mr-2" />
                  Initiate Forensic Scan
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* State 2: Scanning (Cyberpunk Animation) */}
        {isScanning && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="relative w-64 h-64 mb-12">
              {/* Spinning Rings */}
              <motion.div
                className="absolute inset-0 border-4 border-brand/20 rounded-full border-t-brand"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-white/10 rounded-full border-b-white/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Central Pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu size={64} className="text-brand animate-pulse" />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-mono font-bold">
                {scanStep === 1 && "GEMINI OPTICAL SCANNING..."}
                {scanStep === 2 && "GROQ STRUCTURAL ANALYSIS..."}
              </h3>
              <div className="w-96 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: "0%" }}
                  animate={{ width: scanStep === 1 ? "50%" : "90%" }}
                />
              </div>
              <p className="text-white/40 font-mono text-sm">
                Detecting PDF artifacts, compression anomalies, and font mismatch...
              </p>
            </div>
          </motion.div>
        )}

        {/* State 3: Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Score Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 ${result.score > 80 ? 'bg-green-500' : result.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />

                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Integrity Score</h3>
                  <div className={`text-8xl font-bold mb-4 ${result.score > 80 ? 'text-green-400' : result.score > 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {result.score}%
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold ${result.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
                    result.status === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {result.status === 'VERIFIED' ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                    {result.status}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Search size={18} /> Deep Meta-Analysis
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Detected Format</span>
                    <span>{result.metadata.detectedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Page Count</span>
                    <span>{result.metadata.pageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Compression</span>
                    <span>{result.metadata.compression}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full py-6" onClick={reset}>
                Analyze Another Contract
              </Button>
            </div>

            {/* Main Analysis */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">AI Findings Summary</h3>
                <p className="text-white/70 leading-relaxed mb-8">
                  {result.summary}
                </p>

                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Forensic Checkpoints</h4>
                <div className="space-y-3">
                  {result.checks.map((check, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                      <div className={`mt-1 ${check.status === 'PASS' ? 'text-green-400' :
                        check.status === 'FAIL' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                        {check.status === 'PASS' ? <CheckCircle2 size={20} /> :
                          check.status === 'FAIL' ? <XCircle size={20} /> : <AlertTriangle size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm mb-1">{check.name}</div>
                        <p className="text-sm text-white/50">{check.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
