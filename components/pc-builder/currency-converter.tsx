"use client";

import { useEffect, useState } from "react";

/**
 * Affiche le total du build converti dans la devise choisie, avec des taux
 * récupérés en temps réel depuis /api/rates (intégration externe BCE).
 * Gère les états chargement / erreur (repli sur EUR) / vide.
 */
const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD"] as const;
type Currency = (typeof CURRENCIES)[number];

export function CurrencyConverter({ totalEur }: { totalEur: number }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetch("/api/rates")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("rates"))))
      .then((d: { rates: Record<string, number> }) => {
        if (!cancelled) {
          setRates(d.rates);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rate = currency === "EUR" ? 1 : rates?.[currency];
  const converted = rate != null ? totalEur * rate : null;
  const format = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(value);

  return (
    <div className="bg-[#316AC5] text-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold">TOTAL:</span>
        <span className="text-[16px] font-bold">
          {totalEur <= 0
            ? "---"
            : converted != null
              ? format(converted)
              : status === "loading"
                ? "…"
                : `${totalEur.toLocaleString("fr-FR")} EUR`}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <label htmlFor="currency" className="text-[9px] opacity-80">
          {status === "error" ? "Taux indisponible — EUR" : "Devise (taux live BCE)"}
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="text-black text-[10px] px-1 py-0.5 rounded-sm"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
