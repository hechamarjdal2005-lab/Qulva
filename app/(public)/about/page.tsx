import { createClient } from "@/lib/supabase-server";
import BiometricSimulatorClient from "./BiometricSimulatorClient";

export default async function AboutPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "show_biometric_simulator")
    .single();

  const showSimulator = data?.value !== false;

  return (
    <div className="animate-fade-in pt-32 pb-24 px-6 md:px-16 min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-8">
            <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-4">THE SCIENCE</p>
            <h1 className="text-display-lg text-black leading-tight mb-8">
              Objective datasets. <br />
              Zero marketing fluff.
            </h1>
            <div className="w-16 h-[2px] bg-black mb-8"></div>
            <p className="text-body-lg text-[#757575] max-w-2xl leading-relaxed">
              We operate under a simple hypothesis: human health and performance are not mysteries to be guessed at. They are biochemical equations waiting to be measured and solved with absolute precision.
            </p>
          </div>
        </div>

        <div className="thick-hairline mb-24"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-32">
          <div className="space-y-4">
            <span className="text-label-sm text-black font-mono font-bold">01/</span>
            <h3 className="text-headline-md text-black">Epigenetics</h3>
            <p className="text-body-md text-[#757575] leading-relaxed">
              By monitoring DNA methylation patterns, we map how environmental stimuli alter gene expression and cellular decay rates.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-label-sm text-black font-mono font-bold">02/</span>
            <h3 className="text-headline-md text-black">Glymphatics</h3>
            <p className="text-body-md text-[#757575] leading-relaxed">
              Optimizing cerebrospinal fluid dynamics during stage-3 sleep cycles to maximize metabolic debris clearance from brain tissue.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-label-sm text-black font-mono font-bold">03/</span>
            <h3 className="text-headline-md text-black">Biomechanics</h3>
            <p className="text-body-md text-[#757575] leading-relaxed">
              Analyzing structural alignments to minimize baseline kinetic strain, which decreases daily physiological exhaustion.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-label-sm text-black font-mono font-bold">04/</span>
            <h3 className="text-headline-md text-black">Autophagy</h3>
            <p className="text-body-md text-[#757575] leading-relaxed">
              Triggering natural cellular cleanup cycles to purge senescent cells and maintain optimal chromosomal telomere lengths.
            </p>
          </div>
        </div>

        {showSimulator && <BiometricSimulatorClient />}
      </div>
    </div>
  );
}
