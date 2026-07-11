"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vector, setVector] = useState("skin");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [protocolSeq, setProtocolSeq] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    const seq = `Q-DATA-${Math.floor(1000 + Math.random() * 9000)}`;

    await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      vector,
      message: message.trim(),
      protocol_seq: seq,
    });

    setProtocolSeq(seq);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in pt-32 pb-24 px-6 md:px-16 min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-8">
            <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-4">INQUIRIES</p>
            <h1 className="text-display-lg text-black leading-tight mb-8">
              Clinical &amp; <br />
              Research Contact.
            </h1>
            <div className="w-16 h-[2px] bg-black mb-8"></div>
            <p className="text-body-lg text-[#757575] max-w-2xl leading-relaxed">
              For research institutions, biomarker trial candidates, or general optimization consultation, use the secure terminal below.
            </p>
          </div>
        </div>

        <div className="thick-hairline mb-24"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-12">
            <div>
              <p className="text-label-sm uppercase text-black font-bold mb-4">HEADQUARTERS</p>
              <p className="text-body-md text-[#5D5F5F] leading-loose uppercase tracking-wide">
                QULVA BIOMETRIC FLUID LABS<br />
                BUILDING 4B, TECH PARK NORTH<br />
                ZURICH, SWITZERLAND
              </p>
            </div>

            <div>
              <p className="text-label-sm uppercase text-black font-bold mb-4">RESEARCH INTAKE</p>
              <p className="text-body-md text-[#5D5F5F] leading-loose">
                intake@qulva.science<br />
                +41 44 910 2000
              </p>
            </div>

            <div>
              <p className="text-label-sm uppercase text-black font-bold mb-4">SECURE ENCRYPTION</p>
              <p className="text-xs text-[#757575] font-mono leading-relaxed">
                ALL COMPLETED TRANSMISSIONS ARE ROUTED THROUGH SECURE PROTOCOLS. CLINICAL DATA COMPLIES STRICTLY WITH MEDICAL ETHICAL STANDARDS.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 bg-[#F5F5F5] border border-[#E5E5E5] p-8 md:p-16">
            {submitted ? (
              <div className="space-y-6 text-center py-12 animate-fade-in">
                <CheckCircle className="w-16 h-16 text-black mx-auto stroke-1" />
                <div>
                  <h3 className="text-headline-md text-black font-bold uppercase mb-2">Transmission Secure</h3>
                  <p className="text-body-md text-[#757575] max-w-md mx-auto">
                    Your request has been logged successfully under protocol sequence <span className="font-mono text-black font-semibold">{protocolSeq}</span>. A laboratory analyst will review your biomarkers within 48 clinical hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setProtocolSeq("");
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="bg-black text-white px-10 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer rounded-none inline-block"
                >
                  New Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <p className="text-label-sm uppercase tracking-widest text-[#757575] font-bold">STAGE 01 | Secure Form</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-label-sm uppercase text-black font-bold block">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ENTER FULL NAME"
                      className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-label-sm uppercase text-black font-bold block">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-sm uppercase text-black font-bold block">PRIMARY RESEARCH VECTOR</label>
                  <select
                    value={vector}
                    onChange={(e) => setVector(e.target.value)}
                    className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all rounded-none text-black font-semibold"
                  >
                    <option value="skin">SKIN SCIENCE: EPIGENETICS &amp; DERMAL AGING</option>
                    <option value="sleep">SLEEP: GLYMPHATIC DISCHARGE &amp; CORE COOLING</option>
                    <option value="posture">BIOMECHANICS: KINETIC STABILITY</option>
                    <option value="longevity">LONGEVITY: AUTOPHAGIC INDUCTION</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-label-sm uppercase text-black font-bold block">COLLABORATION OR CONSULTATION DETAILS</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="PROVIDE SYSTEM BIO-INPUTS OR RESEARCH QUESTIONS"
                    className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white px-10 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 rounded-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? "Transmitting..." : "Transmit Data"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
