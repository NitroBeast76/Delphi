import React, { useRef } from "react";
import { ArrowRight, ImagePlus, MessageSquare, Mic, Sparkles, Volume2 } from "lucide-react";
import { BRAND } from "../brand";

function Welcome({ setActiveTab, logo, setLogo }) {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextLogo = String(reader.result || "");
      setLogo(nextLogo);
      localStorage.setItem("brand-logo", nextLogo);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const launchWorkspace = (tab) => setActiveTab(tab);

  return (
    <main className="welcome-page">
      <div className="welcome-orbit welcome-orbit-one" />
      <div className="welcome-orbit welcome-orbit-two" />

      <section className="welcome-hero">
        <div className="welcome-brand-lockup">
          <div className="welcome-mark">
            {logo ? <img src={logo} alt={`${BRAND.name} logo`} /> : <Sparkles size={28} strokeWidth={1.8} />}
          </div>
          <span>Private by design</span>
        </div>

        <p className="welcome-eyebrow">Your local creative intelligence</p>
        <h1>
          Meet <em>{BRAND.name}.</em>
        </h1>
        <p className="welcome-tagline">{BRAND.tagline}</p>
        <p className="welcome-description">{BRAND.description}</p>

        <div className="welcome-actions">
          <button className="m3-btn m3-btn-filled welcome-primary-action" onClick={() => launchWorkspace("generator")}>
            Create an image
            <ArrowRight size={17} />
          </button>
          <button className="m3-btn m3-btn-outlined" onClick={() => launchWorkspace("chat")}>
            Start a conversation
          </button>
        </div>
      </section>

      <section className="welcome-panel" aria-label="Delphi capabilities">
        <div className="welcome-panel-header">
          <div>
            <span className="welcome-section-kicker">A studio for making</span>
            <h2>Ideas, kept close.</h2>
          </div>
          <button className="welcome-logo-upload" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={16} />
            {logo ? "Change logo" : "Add your logo"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} hidden />
        </div>

        <div className="welcome-capabilities">
          <button className="welcome-capability-card" onClick={() => launchWorkspace("generator")}>
            <span className="welcome-capability-icon image-icon"><Sparkles size={20} /></span>
            <span>
              <strong>Imagine</strong>
              <small>Generate visual worlds locally.</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button className="welcome-capability-card" onClick={() => launchWorkspace("chat")}>
            <span className="welcome-capability-icon chat-icon"><MessageSquare size={20} /></span>
            <span>
              <strong>Think</strong>
              <small>Talk with your private models.</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button className="welcome-capability-card" onClick={() => launchWorkspace("speech")}>
            <span className="welcome-capability-icon voice-icon"><Mic size={20} /></span>
            <span>
              <strong>Listen</strong>
              <small>Turn voice into clear ideas.</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button className="welcome-capability-card" onClick={() => launchWorkspace("tts")}>
            <span className="welcome-capability-icon sound-icon"><Volume2 size={20} /></span>
            <span>
              <strong>Speak</strong>
              <small>Give your words a natural voice.</small>
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Welcome;