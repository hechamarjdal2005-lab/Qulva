"use client";

import { useState } from "react";

export default function BiometricSimulatorClient() {
  const [hrv, setHrv] = useState<number>(65);
  const [deepSleep, setDeepSleep] = useState<number>(90);
  const [activityIndex, setActivityIndex] = useState<number>(7);

  const biologicalAgeOffset = -((hrv - 50) * 0.1 + (deepSleep - 60) * 0.05 + (activityIndex - 5) * 0.4);
  const metabolicEfficiency = Math.min(Math.round(60 + hrv * 0.3 + deepSleep * 0.2), 100);

  return (
    <section className="bg-[#F5F5F5] p-8 md:p-16 border border-[#E5E5E5] mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 space-y-8">
          <div>
            <p className="text-label-sm uppercase tracking-wider text-black font-bold mb-2">QULVA LAB SIMULATOR</p>
            <h2 className="text-headline-lg text-black">Biometric Diagnostics</h2>
            <p className="text-body-md text-[#757575] mt-2">
              Adjust standard inputs to witness simulated modifications of biological age coefficients and metabolic efficiency scores.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-label-sm uppercase">
                <span className="text-black font-medium">Heart Rate Variability</span>
                <span className="text-black font-mono font-bold">{hrv} ms</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={hrv}
                onChange={(e) => setHrv(Number(e.target.value))}
                className="w-full accent-black cursor-pointer bg-neutral-300 h-1"
              />
              <span className="text-xs text-[#757575] block">Higher HRV indicates elevated autonomic resilience.</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-label-sm uppercase">
                <span className="text-black font-medium">Stage 3 Deep Sleep</span>
                <span className="text-black font-mono font-bold">{deepSleep} mins</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                value={deepSleep}
                onChange={(e) => setDeepSleep(Number(e.target.value))}
                className="w-full accent-black cursor-pointer bg-neutral-300 h-1"
              />
              <span className="text-xs text-[#757575] block">Delta wave states facilitate deep glymphatic flushing.</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-label-sm uppercase">
                <span className="text-black font-medium">Daily Metabolic Load</span>
                <span className="text-black font-mono font-bold">Level {activityIndex}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={activityIndex}
                onChange={(e) => setActivityIndex(Number(e.target.value))}
                className="w-full accent-black cursor-pointer bg-neutral-300 h-1"
              />
              <span className="text-xs text-[#757575] block">Consistent low-level activity boosts metabolic performance.</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-white border border-black p-5 md:p-8 flex flex-col gap-8">
          <div>
            <p className="text-label-sm uppercase text-[#757575] tracking-widest">Calculated Bio-Outputs</p>
            <div className="thin-hairline my-4"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-[#F5F5F5] p-4 md:p-6 border border-[#E5E5E5] flex flex-col justify-between min-w-0">
              <span className="text-label-sm uppercase text-[#757575] block mb-4">Age Vector</span>
              <div>
                <span className="text-3xl md:text-[32px] font-bold text-black font-mono leading-none">
                  {biologicalAgeOffset < 0 ? "" : "+"}{biologicalAgeOffset.toFixed(1)}
                </span>
                <span className="text-xs text-[#757575] block mt-1 uppercase">years biological shift</span>
              </div>
            </div>

            <div className="bg-[#F5F5F5] p-4 md:p-6 border border-[#E5E5E5] flex flex-col justify-between min-w-0">
              <span className="text-label-sm uppercase text-[#757575] block mb-4">Metabolic Efficiency</span>
              <div>
                <span className="text-3xl md:text-[32px] font-bold text-black font-mono leading-none">
                  {metabolicEfficiency}%
                </span>
                <span className="text-xs text-[#757575] block mt-1 uppercase">clinical baseline</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-label-sm uppercase text-black font-bold block">Biomarker Capacity Ramp</span>
            <div className="h-6 bg-[#F5F5F5] border border-[#E5E5E5] relative overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${metabolicEfficiency}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] md:text-xs text-[#757575] font-mono gap-2">
              <span>30% ATROPHY LIMIT</span>
              <span className="text-right">100% MAXIMUM POTENCY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
