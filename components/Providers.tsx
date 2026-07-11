"use client";

import { useState, createContext, useContext } from "react";
import WaitlistModal from "@/components/WaitlistModal";

interface WaitlistContextType {
  openWaitlist: (email: string) => void;
}

const WaitlistContext = createContext<WaitlistContextType>({
  openWaitlist: () => {},
});

export function useWaitlist() {
  return useContext(WaitlistContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = (email: string) => {
    setWaitlistEmail(email);
    setIsWaitlistOpen(true);
  };

  return (
    <WaitlistContext.Provider value={{ openWaitlist }}>
      {children}
      <WaitlistModal
        email={waitlistEmail}
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </WaitlistContext.Provider>
  );
}
