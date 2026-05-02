import React, { useState } from 'react';
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
    <div className="max-w-md mx-auto animate-fade-in">
        <div className="bg-tiktok-card border border-tiktok-border rounded-xl p-8 shadow-lg">
            <div className="flex flex-col items-center text-center">
                <CircleUser className="w-32 h-32 text-gray-600 mb-4" />
                <h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">Kaima Benjamin</h2>
                <p className="text-tiktok-cyan mt-1 font-black text-xs uppercase tracking-[0.2em]">Full-Stack Developer</p>
                
                <div className="mt-6 w-full border-t border-tiktok-border pt-6 space-y-4">
                    <div className="flex items-center justify-center text-gray-300">
                        <Mail className="w-5 h-5 mr-3 text-tiktok-cyan" />
                        <a 
                        href="mailto:benjakaimax425@gmail.com" 
                        className="hover:text-tiktok-cyan transition-colors font-medium"
                        >
                            benjakaimax425@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center justify-center text-gray-300">
                        <Globe className="w-5 h-5 mr-3 text-tiktok-red" />
                        <a 
                        href="https://www.kaimax-in-technology.mystrikingly.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-tiktok-red transition-colors font-medium"
                        >
                            Developer Portfolio
                        </a>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                        "Crafting modern web experiences with passion and precision."
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-tiktok-card border border-tiktok-border rounded-xl p-8 shadow-lg mt-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-2xl font-bold text-center text-white mb-6 uppercase tracking-tight">Get in Touch</h3>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-tiktok-input border border-tiktok-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan transition-all" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-tiktok-input border border-tiktok-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan transition-all" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={4} className="w-full bg-tiktok-input border border-tiktok-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tiktok-cyan transition-all"></textarea>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={status === 'sending'} className="w-full flex items-center justify-center bg-gradient-to-r from-tiktok-red to-tiktok-cyan text-white font-bold py-3 px-6 rounded-md transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-70 disabled:cursor-wait">
                        {status === 'sending' ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <SendHorizontal className="w-5 h-5 mr-2" />}
                        {status === 'sending' ? 'Sending...' : 'Send Feedback'}
                    </button>
                </div>
            </form>
            {status === 'sent' && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-md text-center text-green-300 flex items-center justify-center animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <p className="text-sm">Thank you! Your feedback has been sent.</p>
                </div>
            )}
            {status === 'error' && (
                 <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-center text-red-300 flex items-center justify-center animate-fade-in">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <p className="text-sm">Something went wrong. Please try again.</p>
                </div>
            )}
        </div>
    </div>
  );
};