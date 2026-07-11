"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WaitlistModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ email, isOpen, onClose }: WaitlistModalProps) {
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [sleep, setSleep] = useState<number>(7);
  const [stress, setStress] = useState<string>("medium");
  const [focus, setFocus] = useState<string>("mental");
  const [skinConcern, setSkinConcern] = useState<string>("aging");
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen && email) {
      async function initQueue() {
        const { count } = await supabase
          .from("waitlist_entries")
          .select("*", { count: "exact", head: true });
        setQueuePosition((count || 0) + 1);
      }
      initQueue();
      setStep("welcome");
      setSaved(false);
    }
  }, [isOpen, email]);

  if (!isOpen) return null;

  const calculateScore = () => {
    let score = 70;
    if (sleep >= 7 && sleep <= 9) score += 15;
    else if (sleep < 6) score -= 10;

    if (stress === "low") score += 10;
    else if (stress === "high") score -= 15;

    return Math.min(Math.max(score, 30), 100);
  };

  const bioScore = calculateScore();

  const handleLaunchQuiz = () => {
    setStep("quiz");
  };

  const handleAnalyze = async () => {
    setSaving(true);
    const { error } = await supabase.from("waitlist_entries").insert({
      email,
      queue_pos: queuePosition,
      sleep_hours: sleep,
      stress_level: stress,
      vector: focus,
      skin_concern: skinConcern,
      bio_score: bioScore,
    });
    if (!error) setSaved(true);
    setSaving(false);
    setStep("result");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-black p-8 md:p-12 animate-scale-up rounded-none">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:opacity-70 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {step === "welcome" && (
          <div className="space-y-8">
            <div>
              <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-4">Verification Successful</p>
              <h3 className="text-headline-lg text-black leading-none mb-4">ACCESS RESERVED</h3>
              <div className="thick-hairline my-6"></div>
              <p className="text-body-md text-[#757575]">
                You have successfully secured a position in the early access pipeline for <span className="font-semibold text-black">Qulva AI</span>.
              </p>
            </div>

            <div className="bg-[#F5F5F5] p-6 border-l-2 border-black flex flex-col gap-2">
              <span className="text-label-sm text-[#757575] uppercase tracking-wider">Your Queue Node</span>
              <span className="text-display-lg text-black font-mono leading-none tracking-tight">#{queuePosition}</span>
              <span className="text-xs text-[#757575] uppercase mt-2">Email: {email}</span>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-body-md text-black font-medium">
                Optimize your wait: Generate an initial diagnostic biomarker blueprint.
              </p>
              <button
                onClick={handleLaunchQuiz}
                className="w-full bg-black text-white px-8 py-4 text-label-sm uppercase tracking-widest hover:bg-white hover:text-black hover:border hover:border-black transition-all cursor-pointer text-center block"
              >
                Launch Diagnostic Tool
              </button>
              <button
                onClick={onClose}
                className="w-full text-center text-label-sm uppercase tracking-widest text-[#757575] hover:text-black transition-colors"
              >
                Skip, take me back
              </button>
            </div>
          </div>
        )}

        {step === "quiz" && (
          <div className="space-y-8">
            <div>
              <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">Stage 01 | Biometric Query</p>
              <h3 className="text-headline-md text-black font-bold">Biomarker Inputs</h3>
              <div className="thin-hairline my-4"></div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-label-sm uppercase text-black block">Average Nocturnal Sleep Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 6, 7, 8].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setSleep(hours)}
                      className={`py-2 text-label-sm border text-center transition-all cursor-pointer ${
                        sleep === hours
                          ? "bg-black text-white border-black"
                          : "border-[#E5E5E5] text-[#757575] hover:border-black"
                      }`}
                    >
                      {hours === 5 ? "< 6h" : hours === 8 ? "8h+" : `${hours}h`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-label-sm uppercase text-black block">Perceived Oxidative Stress Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setStress(level)}
                      className={`py-2 text-label-sm border text-center uppercase transition-all cursor-pointer ${
                        stress === level
                          ? "bg-black text-white border-black"
                          : "border-[#E5E5E5] text-[#757575] hover:border-black"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-label-sm uppercase text-black block">Primary Optimization Vector</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] p-3 text-label-sm uppercase tracking-wider focus:outline-none focus:border-black rounded-none"
                >
                  <option value="mental">Glymphatic &amp; Cognitive Clearance</option>
                  <option value="physical">Dermal Bio-Integrity &amp; Synthesis</option>
                  <option value="longevity">Telomeric Extension &amp; Fasting Protocols</option>
                  <option value="kinetic">Postural Stability &amp; Joint Kinematics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-label-sm uppercase text-black block">Dermal Epigenetic Profile Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "aging", label: "Anti-Aging" },
                    { id: "barriers", label: "Barrier Repair" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSkinConcern(item.id)}
                      className={`py-2 text-label-sm border text-center uppercase transition-all cursor-pointer ${
                        skinConcern === item.id
                          ? "bg-black text-white border-black"
                          : "border-[#E5E5E5] text-[#757575] hover:border-black"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={saving}
              className="w-full bg-black text-white px-8 py-4 text-label-sm uppercase tracking-widest hover:bg-white hover:text-black hover:border hover:border-black transition-all cursor-pointer text-center block mt-4 disabled:opacity-50"
            >
              {saving ? "Analyzing..." : "Analyze Biomarker Profile"}
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">Stage 02 | Initial Synthesis</p>
              <h3 className="text-headline-md text-black font-bold">BIOMARKER MATRIX</h3>
              <div className="thin-hairline my-4"></div>
            </div>

            <div className="flex flex-col items-center justify-center py-6 bg-[#F5F5F5] border border-[#E5E5E5] text-center">
              <span className="text-label-sm uppercase tracking-widest text-[#757575] mb-2">Achromatic Bio-Index</span>
              <span className="text-[64px] font-bold text-black font-mono leading-none">{bioScore}%</span>
              <span className="text-xs uppercase text-black tracking-widest font-semibold mt-2">
                {bioScore >= 80 ? "Optimal Baseline" : bioScore >= 60 ? "Sub-Optimal Margin" : "Action Vector Required"}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-label-sm uppercase text-black tracking-wider border-b border-[#E5E5E5] pb-2 font-bold">
                Early Action Directives
              </p>
              <div className="space-y-3">
                {bioScore >= 80 ? (
                  <>
                    <div className="flex gap-3 items-start text-body-md text-[#757575]">
                      <span className="text-black font-bold font-mono">01/</span>
                      <span>Initiate AMPK activation protocols with once-weekly 14-hour fasts to preserve high cellular turnover.</span>
                    </div>
                    <div className="flex gap-3 items-start text-body-md text-[#757575]">
                      <span className="text-black font-bold font-mono">02/</span>
                      <span>Integrate double-blind dermal peptide synthesizers pre-nocturnal sleep.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3 items-start text-body-md text-[#757575]">
                      <span className="text-black font-bold font-mono">01/</span>
                      <span>Implement thermal dumping sequence (40°C warm bath 90 min before sleep) to extend delta wave deep sleep.</span>
                    </div>
                    <div className="flex gap-3 items-start text-body-md text-[#757575]">
                      <span className="text-black font-bold font-mono">02/</span>
                      <span>Reduce oxidative load by shifting screen exposures below 100 lumens past circadian sunset.</span>
                    </div>
                  </>
                )}
                <div className="flex gap-3 items-start text-body-md text-[#757575]">
                  <span className="text-black font-bold font-mono">03/</span>
                  <span>Your detailed optimization blueprint will unlock on early release. Securing Node #{queuePosition}.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-black text-white px-8 py-4 text-label-sm uppercase tracking-widest hover:bg-white hover:text-black hover:border hover:border-black transition-all cursor-pointer text-center block mt-4"
            >
              Conclude Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
