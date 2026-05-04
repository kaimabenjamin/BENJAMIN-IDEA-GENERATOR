import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    SendHorizontal, 
    CheckCircle2, 
    AlertTriangle, 
    Loader2, 
    CircleUser,
    Globe
} from 'lucide-react';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export const DeveloperInfo: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');
    
    // Construct mailto link
    const subject = encodeURIComponent(`Feedback from ${name} (Benjamin Idea Generator)`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:benjakaimax425@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoUrl;

    // Since we open the mail app, we assume the user follows through
    setTimeout(() => {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 5000);
    }, 1000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-8"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div 
              variants={itemVariants}
              className="bg-tiktok-card border border-tiktok-border rounded-2xl p-8 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <CircleUser className="w-24 h-24 text-tiktok-cyan" />
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tiktok-cyan/10 rounded-full blur-3xl" />
                
                <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="relative mb-6"
                    >
                        <div className="absolute inset-0 bg-tiktok-cyan blur-md opacity-20 rounded-full scale-110" />
                        <CircleUser className="w-32 h-32 text-gray-400 relative z-10" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic animate-pulse-slow">
                        Kaima <span className="text-tiktok-cyan">Benjamin</span>
                    </h2>
                    <p className="text-tiktok-cyan mt-2 font-black text-xs uppercase tracking-[0.4em] bg-tiktok-cyan/10 px-4 py-1 rounded-full border border-tiktok-cyan/20">
                        Full-Stack Developer | IT Consultant
                    </p>
                    
                    <div className="mt-8 w-full border-t border-tiktok-border/50 pt-8 space-y-6">
                        <div className="flex flex-col items-center gap-1 group">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-tiktok-cyan transition-colors">Origin & Nationality</span>
                            <p className="text-lg font-medium text-gray-200">Ugandan by Birth & Nationality</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <motion.a 
                              whileHover={{ x: 5 }}
                              href="mailto:benjakaimax425@gmail.com" 
                              className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-tiktok-cyan/50 hover:bg-tiktok-cyan/5 transition-all group"
                            >
                                <Mail className="w-5 h-5 mr-3 text-tiktok-cyan group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-semibold tracking-tight text-gray-300 group-hover:text-white">benjakaimax425@gmail.com</span>
                            </motion.a>
                            
                            <motion.a 
                              whileHover={{ x: -5 }}
                              href="https://www.kaimax-in-technology.mystrikingly.com" 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-tiktok-red/50 hover:bg-tiktok-red/5 transition-all group"
                            >
                                <Globe className="w-5 h-5 mr-3 text-tiktok-red group-hover:rotate-12 transition-transform" />
                                <span className="text-sm font-semibold tracking-tight text-gray-300 group-hover:text-white">Developer Portfolio</span>
                            </motion.a>
                        </div>
                        
                        <p className="text-sm text-gray-500 italic mt-4 max-w-xs mx-auto">
                            "Crafting modern web experiences with passion and precision. Let's build the future together."
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-tiktok-card border border-tiktok-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tiktok-red via-tiktok-cyan to-tiktok-red animate-tech-scan opacity-50" />
                <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight italic">
                    Initiate <span className="text-tiktok-cyan">Contact</span>
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                        <label htmlFor="name" className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest group-focus-within:text-tiktok-cyan transition-colors">Digital Identity</label>
                        <input 
                          type="text" 
                          id="name" 
                          placeholder="Your Name"
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          required 
                          className="w-full bg-tiktok-input border border-tiktok-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan/50 transition-all placeholder:text-gray-600" 
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="email" className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest group-focus-within:text-tiktok-cyan transition-colors">E-Mail Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          placeholder="your@email.com"
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          required 
                          className="w-full bg-tiktok-input border border-tiktok-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan/50 transition-all placeholder:text-gray-600" 
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="message" className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest group-focus-within:text-tiktok-cyan transition-colors">Project Brief / Message</label>
                        <textarea 
                          id="message" 
                          placeholder="How can I help you today?"
                          value={message} 
                          onChange={e => setMessage(e.target.value)} 
                          required 
                          rows={4} 
                          className="w-full bg-tiktok-input border border-tiktok-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan/50 transition-all placeholder:text-gray-600 resize-none"
                        ></textarea>
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      disabled={status === 'sending'} 
                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(42,242,255,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-tiktok-red to-tiktok-cyan text-white font-black py-4 px-8 rounded-xl transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-wait relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        {status === 'sending' ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <SendHorizontal className="w-5 h-5 mr-3" />}
                        <span className="relative z-10 uppercase tracking-[0.2em] text-sm">
                            {status === 'sending' ? 'Transmitting...' : 'Send Transmission'}
                        </span>
                    </motion.button>
                </form>

                <AnimatePresence>
                    {status === 'sent' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 p-4 bg-tiktok-cyan/10 border border-tiktok-cyan/30 rounded-xl text-center text-tiktok-cyan flex items-center justify-center overflow-hidden"
                        >
                            <CheckCircle2 className="w-5 h-5 mr-3" />
                            <p className="text-xs font-bold uppercase tracking-wider">Transmission Successful</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    </motion.div>
  );
};
