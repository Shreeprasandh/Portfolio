import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

// Component to load and display your 3D desk model
const Model = () => {
  const { scene } = useGLTF('/models/desk.glb');
  return <primitive object={scene} scale={1.5} />;
};

const Contact = () => {
  const form = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Check for mobile screen size to adjust 3D settings
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedback({ type: '', message: '' });

    if (!form.current) return;
    const formData = new FormData(form.current);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      _honeypot: formData.get('_honeypot'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message.');
      }

      setFeedback({
        type: 'success',
        message: "Message sent successfully! I'll get back to you soon."
      });
      if (form.current) {
        form.current.reset();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || "Something went wrong while sending. Please try again."
      });
      console.error("Contact Form Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="w-full bg-[#1B1B1B] py-20 md:py-32 px-6 md:px-8">
      <div className="max-w-[1263px] mx-auto">
        
        {/* Main Heading */}
        <h2 className="text-[#D8D3CC] text-[32px] md:text-[48px] font-semibold tracking-[-1px] md:tracking-[-2px] text-center mb-10 md:mb-[48px]">
          Get in Touch – Let’s Connect
        </h2>

        {/* Container: Relative for mobile layering, Flex for desktop layout */}
        <div className="relative flex flex-col lg:flex-row gap-[56px] items-stretch">
          
          {/* 1. FORM SIDE (Placed first for Desktop Left Alignment)
             - Mobile: Relative z-10 (Sit on top of model), Glass background
             - Desktop: Static, Solid background
          */}
          <form 
            ref={form}
            onSubmit={sendEmail}
            className="w-full lg:w-[545px] relative z-10 bg-[#0F0F0F]/80 backdrop-blur-sm lg:bg-[#0F0F0F] lg:backdrop-blur-none border border-[#0F0F0F] rounded-[12px] p-[30px] md:p-[40px_30px] flex flex-col gap-[20px] md:gap-[30px]"
          >
            {feedback.message && (
              <div 
                role="status"
                className={`flex items-center gap-3 p-3.5 rounded-[8px] text-[14px] leading-snug transition-all ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Anti-bot Honeypot Trap (Hidden from human visitors) */}
            <input 
              type="text" 
              name="_honeypot" 
              tabIndex={-1} 
              autoComplete="off" 
              className="hidden" 
              aria-hidden="true" 
            />
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className="text-[#D8D3CC] text-[16px] font-normal">Your name</label>
              <input 
                id="contact-name"
                name="name" 
                required
                type="text" 
                placeholder="What’s your good name?" 
                className="w-full h-[54px] bg-[#1B1B1B] rounded-[6px] px-4 text-[#D8D3CC] border border-transparent focus:border-[#D8D3CC]/30 outline-none transition-all placeholder:text-[#D8D3CC]/40"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className="text-[#D8D3CC] text-[16px] font-normal">Your email</label>
              <input 
                id="contact-email"
                name="email" 
                required
                type="email" 
                placeholder="What’s your email address?" 
                className="w-full h-[54px] bg-[#1B1B1B] rounded-[6px] px-4 text-[#D8D3CC] border border-transparent focus:border-[#D8D3CC]/30 outline-none transition-all placeholder:text-[#D8D3CC]/40"
              />
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="text-[#D8D3CC] text-[16px] font-normal">Your message</label>
              <textarea 
                id="contact-message"
                name="message" 
                required
                placeholder="How can I help you?" 
                rows="4"
                className="w-full bg-[#1B1B1B] rounded-[6px] p-4 text-[#D8D3CC] border border-transparent focus:border-[#D8D3CC]/30 outline-none transition-all resize-none placeholder:text-[#D8D3CC]/40"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSending}
              className="w-full h-[52px] bg-[#D8D3CC] rounded-[8px] flex items-center justify-center gap-2 text-[#0F0F0F] font-semibold text-[16px] hover:bg-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send message'} 
              {!isSending && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* 2. 3D MODEL SIDE (Placed second for Desktop Right Alignment)
             - Mobile: Absolute background, z-0, fast spin, non-interactive
             - Desktop: Flex-1 (Right side), interactive, slow spin
          */}
          <div className={`
            absolute inset-0 h-full w-full z-0 pointer-events-none opacity-30
            lg:static lg:flex-1 lg:h-auto lg:w-auto lg:z-auto lg:pointer-events-auto lg:opacity-100 lg:bg-[#0F0F0F]/30 lg:rounded-[20px] lg:overflow-hidden lg:relative
          `}>
            <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5} contactShadow={false}>
                  <Model />
                </Stage>
                <OrbitControls 
                  enableZoom={!isMobile} 
                  enableRotate={!isMobile} 
                  autoRotate 
                  /* Mobile: Fast (5), Desktop: Slow (0.5) */
                  autoRotateSpeed={isMobile ? 5 : 0.5} 
                />
              </Suspense>
            </Canvas>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact; 