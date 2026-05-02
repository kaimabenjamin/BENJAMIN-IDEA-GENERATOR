
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat, Modality, Part, FunctionDeclaration, Type, FunctionCall } from "@google/genai";
import { 
  SendHorizontal, 
  Loader2, 
  Mic, 
  Paperclip, 
  MicOff, 
  Volume2, 
  Search, 
  XCircle, 
  CalendarPlus, 
  ListTodo, 
  Lamp, 
  MailOpen, 
  ClipboardCheck, 
  X 
} from 'lucide-react';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// --- Types ---
type Persona = 'Creative Coach' | 'Data Analyst' | 'Voice Chat' | 'Sassy Sidekick';
type Message = {
  role: 'user' | 'model';
  content: string;
  imagePreview?: string;
  sources?: any[];
  audio?: AudioBuffer;
  toolCalls?: FunctionCall[];
  toolResult?: { id: string, name: string, result: any };
};
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// --- Helper Functions ---
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

// --- Constants ---
const personas: Record<Persona, string> = {
  'Creative Coach': "You are a fun, friendly, and highly creative assistant specializing in brainstorming and refining ideas for digital content. Your goal is to turn broad topics into actionable, viral concepts. You were developed by Kaima Benjamin, an IT professional, IT consultant, and teacher. You analyze daily chat trends and help solve people's problems—socially, economically, and politically—through content creation. Be encouraging and provide structured feedback.",
  'Data Analyst': "You are a sharp, analytical AI assistant. Your focus is on data-driven insights for content creation. You were developed by Kaima Benjamin, an IT professional, IT consultant, and teacher. You analyze the daily chat of people to identify emerging trends and solve complex social, economic, and political problems with logic and evidence. Use numbers and research-backed strategy where possible.",
  'Voice Chat': "You are a specialized voice-first AI assistant with a clear British accent. You were developed by Kaima Benjamin, an IT professional, IT consultant, and teacher. Your primary interaction mode is through speech (though you also provide text). You help solve people's daily problems—socially (communication), economically (budgeting/planning), and politically (general awareness). You are efficient, helpful, and provide concise, clear answers suitable for being read aloud in your Received Pronunciation style. Use your tools whenever appropriate to assist the user.",
  'Sassy Sidekick': "You are a witty, sarcastic, and slightly cynical AI sidekick. You were developed by Kaima Benjamin, an IT professional, IT consultant, and teacher. You give brutally honest feedback on daily chat and people's problems. Whether it's social drama, economic woes, or political chaos, you have a sharp comment and a slightly cynical solution. You are entertaining but still helpful in your own 'special' way."
};

const assistantTools: FunctionDeclaration[] = [
  {
    name: 'create_calendar_event',
    parameters: {
      type: Type.OBJECT,
      description: 'Creates a new event in the user\'s calendar.',
      properties: {
        title: { type: Type.STRING, description: 'The title of the event.' },
        date_time: { type: Type.STRING, description: 'The date and time of the event in ISO 8601 format.' },
        description: { type: Type.STRING, description: 'A brief description of the event.' },
      },
      required: ['title', 'date_time'],
    },
  },
  {
    name: 'add_to_list',
    parameters: {
        type: Type.OBJECT,
        description: 'Adds an item to the user\'s to-do list.',
        properties: { item: { type: Type.STRING, description: 'The to-do list item.' } },
        required: ['item'],
    },
  },
  {
      name: 'view_list',
      parameters: { type: Type.OBJECT, properties: {} },
      description: 'Views all items on the user\'s to-do list.',
  },
  {
    name: 'summarize_email',
    parameters: {
        type: Type.OBJECT,
        description: 'Summarizes the content of a provided text or email body.',
        properties: { text: { type: Type.STRING, description: 'The full text of the email to summarize.' } },
        required: ['text'],
    },
  },
  {
    name: 'toggle_smart_light',
    parameters: {
      type: Type.OBJECT,
      description: 'Toggles a smart light on or off.',
      properties: {
        device_name: { type: Type.STRING, description: 'The name of the smart light, e.g., "Office Lamp".' },
        state: { type: Type.BOOLEAN, description: 'True to turn on, false to turn off.' },
      },
      required: ['device_name', 'state'],
    },
  },
];


// --- Sub-components ---
const BlinkingCursor = () => <span className="inline-block w-2 h-4 bg-tiktok-cyan animate-pulse ml-1" />;

const ToolCallDisplay: React.FC<{ toolCall: FunctionCall, result?: any }> = ({ toolCall, result }) => {
    const iconMap: Record<string, React.ReactElement> = {
        create_calendar_event: <CalendarPlus className="w-5 h-5" />,
        add_to_list: <ListTodo className="w-5 h-5" />,
        view_list: <ListTodo className="w-5 h-5" />,
        summarize_email: <MailOpen className="w-5 h-5" />,
        toggle_smart_light: <Lamp className="w-5 h-5" />,
    };

    const formatTitle = (name: string) => name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="my-2 p-3 bg-tiktok-bg/50 border border-tiktok-border rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                {iconMap[toolCall.name] || <ClipboardCheck className="w-5 h-5" />}
                <span>{formatTitle(toolCall.name)}</span>
                {!result && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <div className="text-xs text-gray-400 mt-2 pl-7 space-y-1">
                {Object.entries(toolCall.args).map(([key, value]) => (
                    <div key={key}>
                        <span className="font-medium text-gray-300">{key}:</span> {JSON.stringify(value)}
                    </div>
                ))}
            </div>
            {result && (
                 <div className="mt-2 pl-7 text-xs text-tiktok-cyan/80">
                    <span className="font-medium">Result:</span> {JSON.stringify(result)}
                 </div>
            )}
        </div>
    );
};


const ChatMessage: React.FC<{ message: Message; isStreaming: boolean; onReplayAudio: (audio: AudioBuffer) => void; }> = ({ message, isStreaming, onReplayAudio }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`max-w-xl p-3 rounded-2xl shadow-md ${isUser ? 'bg-gradient-to-br from-tiktok-red to-tiktok-cyan text-white rounded-br-none' : 'bg-tiktok-input text-gray-200 rounded-bl-none'}`}>
        {message.imagePreview && <img src={message.imagePreview} alt="upload preview" className="rounded-lg mb-2 max-h-48" />}
        {message.toolCalls && message.toolCalls.map((tc, idx) => (
             <ToolCallDisplay key={idx} toolCall={tc} result={message.toolResult?.id === tc.id ? message.toolResult.result : undefined} />
        ))}
        {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
        {message.role === 'model' && isStreaming && <BlinkingCursor />}
        {message.role === 'model' && message.audio && (
          <button onClick={() => onReplayAudio(message.audio!)} className="text-tiktok-cyan/70 hover:text-tiktok-cyan transition-colors mt-2 p-1 rounded-full hover:bg-white/10">
            <Volume2 className="w-4 h-4" />
          </button>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-tiktok-border/50">
            <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2"><Search className="w-4 h-4" /> Sources:</h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a key={idx} href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-tiktok-bg text-gray-300 px-2 py-1 rounded-md hover:bg-tiktok-cyan hover:text-black transition-colors">
                  {source.web?.title || 'Link'}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PersonaSelector: React.FC<{ activePersona: Persona; onPersonaChange: (p: Persona) => void; }> = ({ activePersona, onPersonaChange }) => (
    <div className="flex items-center bg-tiktok-input p-1 rounded-lg w-full" role="tablist">
        {Object.keys(personas).map((p) => (
            <button
                key={p}
                onClick={() => onPersonaChange(p as Persona)}
                className={`flex-1 text-center text-xs font-semibold rounded-md p-2 transition-colors ${activePersona === p ? 'bg-tiktok-card text-white shadow' : 'text-gray-400 hover:bg-white/10'}`}
            >
                {p}
            </button>
        ))}
    </div>
);

// --- Main Component ---
export const LiveChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>('Creative Coach');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ b64: string, mimeType: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<string[]>(['Buy milk', 'Walk the dog']);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const initialInputRef = useRef<string>('');

  const getStorageKey = (p: Persona) => `benjamin_chat_history_${p}`;

  const initializeChat = () => {
     try {
      const config: any = { systemInstruction: personas[persona] };
      if (persona === 'Voice Chat') {
        config.tools = [{ functionDeclarations: assistantTools }];
      } else {
        config.tools = [{ googleSearch: {} }];
      }

      // Load history from localStorage
      const storageKey = getStorageKey(persona);
      const saved = localStorage.getItem(storageKey);
      let loadedMessages: Message[] = [];

      if (saved) {
          try {
              loadedMessages = JSON.parse(saved);
          } catch (e) {
              console.error("Failed to parse chat history", e);
          }
      }

      // Prepare history for SDK
      const sdkHistory = loadedMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
      }));

      chatRef.current = ai.chats.create({ 
          model: 'gemini-2.5-flash', 
          config,
          history: sdkHistory.length > 0 ? sdkHistory : undefined
      });
      
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        const initialMessages: Record<Persona, Message> = {
            'Creative Coach': { role: 'model', content: "Hey there! I'm ready to brainstorm some amazing content ideas with you. What's on your mind?" },
            'Data Analyst': { role: 'model', content: "Greetings. I am ready to analyze content strategies. Please provide a topic or query." },
            'Voice Chat': { role: 'model', content: "Hello! I'm your Voice Chat specialist. I can help solve social, economic, and political problems through conversation. How can I assist you today?" },
            'Sassy Sidekick': { role: 'model', content: "Alright, let's hear it. What half-baked idea are we pretending is brilliant today?" },
        };
        setMessages([initialMessages[persona]]);
      }
    } catch (e) {
      console.error("Failed to initialize chat:", e);
      setError("Could not start chat session. Please check your API key and refresh.");
    }
  };

  useEffect(initializeChat, [persona]);
  
  // Save history to localStorage
  useEffect(() => {
      if (messages.length === 0) return;
      const storageKey = getStorageKey(persona);
      // Strip AudioBuffers before saving
      const cleanMessages = messages.map(({ audio, ...rest }) => rest);
      localStorage.setItem(storageKey, JSON.stringify(cleanMessages));
  }, [messages, persona]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handlePersonaChange = (newPersona: Persona) => {
      setMessages([]); // Clear messages to ensure we don't save old persona's messages to new persona's storage
      setPersona(newPersona);
  };

  const handleClearHistory = () => {
    localStorage.removeItem(getStorageKey(persona));
    initializeChat();
  };

  const speak = async (text: string): Promise<AudioBuffer | null> => {
    if (!text || typeof window === 'undefined') return null;
    
    // Using SpeechSynthesis for immediate playback and legacy support
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a British English voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
    
    if (britishVoice) {
      utterance.voice = britishVoice;
    } else {
      // Fallback: If voices aren't loaded yet, typical for some browsers, 
      // we just set the lang and hope the OS picks a good one
      utterance.lang = 'en-GB';
    }

    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    
    return null; // Return null because we are using speechSynthesis which manages its own queue
  };

  const playAudio = (audioBuffer: AudioBuffer, ctx: AudioContext) => {
    if (!audioBuffer || !ctx) return;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !uploadedImage) || isLoading) return;
    if (isRecording) {
        speechRecognitionRef.current?.stop();
        setIsRecording(false);
    }

    const userMessage: Message = { role: 'user', content: input, imagePreview: imagePreview || undefined };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentImage = uploadedImage;
    setInput('');
    setUploadedImage(null);
    setImagePreview(null);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) throw new Error("Chat session not initialized.");
      
      const parts: Part[] = [];
      if (currentInput) parts.push({ text: currentInput });
      if (currentImage) {
        parts.push({ inlineData: { data: currentImage.b64, mimeType: currentImage.mimeType } });
      }
      
      let stream = await chatRef.current.sendMessageStream({ message: parts });
      
      let fullResponse = "";
      let sources: any[] = [];
      let functionCalls: FunctionCall[] = [];
      let modelMessage: Message = { role: 'model', content: "" };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        if (chunk.functionCalls) {
            functionCalls.push(...chunk.functionCalls);
        } else {
            const chunkText = chunk.text;
            fullResponse += chunkText;
        }
        
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            sources = chunk.candidates[0].groundingMetadata.groundingChunks;
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: fullResponse,
            sources: sources,
            toolCalls: functionCalls.length > 0 ? functionCalls : undefined,
          };
          return newMessages;
        });
      }

      // --- Function Calling Logic ---
      if (functionCalls.length > 0) {
        const functionResponses: Part[] = [];

        for(const fc of functionCalls) {
          let result: any;
          switch (fc.name) {
            case 'create_calendar_event':
              result = `Event '${fc.args.title}' scheduled for ${fc.args.date_time}.`;
              break;
            case 'add_to_list':
              setTodoList(prev => [...prev, fc.args.item as string]);
              result = `Item '${fc.args.item}' added to your list.`;
              break;
            case 'view_list':
              result = todoList.length > 0 ? `Here is your list: ${todoList.join(', ')}` : "Your to-do list is empty.";
              break;
            case 'summarize_email':
              result = "Summary: [This is a simulated summary of the provided text.]";
              break;
            case 'toggle_smart_light':
              result = `The ${fc.args.device_name} has been turned ${fc.args.state ? 'ON' : 'OFF'}.`;
              break;
            default:
              result = `Unknown function: ${fc.name}`;
          }

          functionResponses.push({ functionResponse: { name: fc.name, response: { result } } });
        }

        stream = await chatRef.current.sendMessageStream({ message: functionResponses });
        fullResponse = ""; 
        modelMessage = { role: 'model', content: "" };
        setMessages(prev => [...prev, modelMessage]);
        
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = fullResponse;
                return newMessages;
            });
        }
      }
      
      const audioBuffer = await speak(fullResponse);
      if (audioBuffer) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          newMessages[lastMsgIndex].audio = audioBuffer;
          return newMessages;
        });
      }

    } catch (err) {
      console.error(err);
      const errorMessage = "Oops! Something went wrong on my end. Please try sending your message again.";
      setError(errorMessage);
      setMessages(prev => [...prev.slice(0,-1), { role: 'model', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      speechRecognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';
    
    initialInputRef.current = input;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      const separator = initialInputRef.current && transcript ? ' ' : '';
      setInput(initialInputRef.current + separator + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
      
      setUploadedImage({ b64: base64, mimeType });
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset to allow selecting same file
  };
  
  return (
    <div className="flex flex-col h-full bg-tiktok-card border border-tiktok-border rounded-xl shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between border-b border-tiktok-border px-4 py-3 bg-tiktok-bg/50 backdrop-blur-md rounded-t-xl z-10">
            <div className="w-full max-w-3xl">
                <PersonaSelector activePersona={persona} onPersonaChange={handlePersonaChange} />
            </div>
            <button onClick={handleClearHistory} className="ml-4 p-2 text-gray-400 hover:text-tiktok-red hover:bg-tiktok-red/10 rounded-full transition-colors flex-shrink-0" title="Clear Chat History">
                <X className="w-4 h-4" />
            </button>
        </div>
        
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isStreaming={msg.role === 'model' && isLoading && index === messages.length - 1 && !msg.toolCalls}
            onReplayAudio={(audio) => playAudio(audio, audioContextRef.current!)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="px-4 pb-2 text-center text-xs text-tiktok-red font-medium">{error}</div>}

      <div className="p-4 bg-tiktok-bg/30 border-t border-tiktok-border/50 backdrop-blur-md">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-4 p-1 border border-tiktok-border rounded-lg bg-tiktok-input shadow-inner">
            <img src={imagePreview} className="w-full h-full object-cover rounded" />
            <button
              onClick={() => { setImagePreview(null); setUploadedImage(null); }}
              className="absolute -top-2 -right-2 bg-tiktok-red text-white rounded-full p-0.5 shadow-lg hover:scale-110 transition-transform"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-1">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-400 hover:text-tiktok-cyan hover:bg-white/10 rounded-full transition-all" aria-label="Attach image">
              <Paperclip className="w-5 h-5" />
            </button>
            <button type="button" onClick={handleToggleRecording} className={`p-2.5 rounded-full transition-all ${isRecording ? 'text-tiktok-red bg-red-500/10 animate-pulse scale-110' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
               {isRecording ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Benjamin anything..."
              className="w-full bg-tiktok-input border border-tiktok-border rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan/50 transition-all shadow-inner"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !uploadedImage)}
            className="flex items-center justify-center bg-gradient-to-r from-tiktok-red to-tiktok-cyan text-white font-black py-3.5 px-8 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(42,242,255,0.3)] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 disabled:grayscale uppercase text-xs tracking-widest"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizontal className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
