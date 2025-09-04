import { createContext, useContext, useState, ReactNode } from "react";

type CommodityContextType = {
    /** engine symbol = jo tumhari strategy API ko chahiye (e.g. BTCUSDT) */
    selectedCommodity: string | null;
    setSelectedCommodity: (s: string) => void;
};

const CommodityContext = createContext<CommodityContextType | undefined>(undefined);

export function CommodityProvider({ children }: { children: ReactNode }) {
    // default BTCUSDT rakha – tum apni marzi se set kar sakte ho
    const [selectedCommodity, setSelectedCommodity] = useState<string | null>("BTCUSDT");

    return (
        <CommodityContext.Provider value={{ selectedCommodity, setSelectedCommodity }}>
            {children}
        </CommodityContext.Provider>
    );
}

export function useCommodity() {
    const ctx = useContext(CommodityContext);
    if (!ctx) throw new Error("useCommodity must be used inside CommodityProvider");
    return ctx;
}
