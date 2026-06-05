export interface Component {
  id: string;
  name: string;
  price: number;
  badge?: string;
  tier?: 1 | 2 | 3;
}

export interface CPU extends Component {
  socket: string;
  tdp: number;
  fps_mult: number;
}

export interface Motherboard extends Component {
  socket: string;
  ramGen: "DDR4" | "DDR5";
}

export interface RAM extends Component {
  gen: "DDR4" | "DDR5";
}

export interface GPU extends Component {
  tdp: number;
  fps: { "1080p": number; "1440p": number; "4K": number };
  src: string;
}

export interface PSU extends Component { watts: number }
export interface Storage extends Component {}
export interface Case extends Component {}
export interface Cooling extends Component {}

export type ComponentKey = "cpu" | "mobo" | "ram" | "gpu" | "storage" | "psu" | "case" | "cooling";
export type Selection = Partial<Record<ComponentKey, string>>;

export interface ComponentGroup {
  key: ComponentKey;
  label: string;
  items: Component[];
}

export interface Preset {
  name: string;
  description: string;
  target: string;
  selection: Partial<Record<ComponentKey, string>>;
}

export type FpsLevel = "excellent" | "good" | "poor";


export const CPUS: CPU[] = [
  { id: "r5-5600",    name: "AMD Ryzen 5 5600",      socket: "AM4", tdp: 65,  price: 130, tier: 1, fps_mult: 0.92 },
  { id: "r7-5800x3d", name: "AMD Ryzen 7 5800X3D",   socket: "AM4", tdp: 105, price: 295, tier: 2, fps_mult: 1.05, badge: "Gaming" },
  { id: "r7-7800x3d", name: "AMD Ryzen 7 7800X3D",   socket: "AM5", tdp: 120, price: 449, tier: 3, fps_mult: 1.12, badge: "Best Gaming" },
];

export const MOBOS: Motherboard[] = [
  { id: "b550-msi",  name: "MSI MAG B550 Tomahawk",   socket: "AM4", ramGen: "DDR4", price: 95 },
  { id: "b550-asus", name: "ASUS ROG Strix B550-F",   socket: "AM4", ramGen: "DDR4", price: 140, badge: "Populaire" },
  { id: "x670-asus", name: "ASUS ROG Strix X670E-F",  socket: "AM5", ramGen: "DDR5", price: 340, badge: "AM5" },
];

export const RAMS: RAM[] = [
  { id: "16-ddr4", name: "16 Go DDR4 3200 MHz", gen: "DDR4", price: 35 },
  { id: "32-ddr4", name: "32 Go DDR4 3600 MHz", gen: "DDR4", price: 70,  badge: "Best-seller" },
  { id: "32-ddr5", name: "32 Go DDR5 6000 MHz", gen: "DDR5", price: 110, badge: "Performance" },
];

export const GPUS: GPU[] = [
  {
    id: "rtx-4060ti", name: "NVIDIA RTX 4060 Ti",
    tdp: 165, price: 389, tier: 1,
    fps: { "1080p": 105, "1440p": 72, "4K": 38 },
    src: "TechPowerUp",
  },
  {
    id: "rtx-4070s", name: "NVIDIA RTX 4070 Super",
    tdp: 220, price: 589, tier: 2, badge: "Sweet Spot",
    fps: { "1080p": 145, "1440p": 108, "4K": 62 },
    src: "Hardware Unboxed",
  },
  {
    id: "rtx-4080s", name: "NVIDIA RTX 4080 Super",
    tdp: 320, price: 1049, tier: 3, badge: "4K Ready",
    fps: { "1080p": 175, "1440p": 148, "4K": 95 },
    src: "Digital Foundry",
  },
];

export const STORAGES: Storage[] = [
  { id: "ssd-500", name: "WD Blue SN580 500 Go NVMe",  price: 45 },
  { id: "ssd-1t",  name: "Samsung 980 PRO 1 To NVMe",  price: 95,  badge: "Rapide" },
  { id: "ssd-2t",  name: "Samsung 990 PRO 2 To NVMe",  price: 165, badge: "Premium" },
];

export const PSUS: PSU[] = [
  { id: "psu-650", name: "Be Quiet! Pure Power 12 650W", watts: 650, price: 85 },
  { id: "psu-750", name: "Corsair RM750x 750W Gold",     watts: 750, price: 110, badge: "Recommandé" },
  { id: "psu-850", name: "Seasonic Focus GX-850 Gold",   watts: 850, price: 145, badge: "High-end" },
];

export const CASES: Case[] = [
  { id: "case-focus", name: "Fractal Design Focus 2",   price: 65 },
  { id: "case-h510",  name: "NZXT H5 Flow",             price: 95,  badge: "Airflow" },
  { id: "case-o11",   name: "Lian Li O11 Dynamic EVO",  price: 160, badge: "Premium" },
];

export const COOLINGS: Cooling[] = [
  { id: "cooler-air", name: "DeepCool AK400 (Air)",           price: 30 },
  { id: "cooler-240", name: "Arctic Liquid Freezer II 240mm", price: 80,  badge: "Best Value" },
  { id: "cooler-360", name: "NZXT Kraken 360 RGB",            price: 180, badge: "Premium" },
];

export const GROUPS: ComponentGroup[] = [
  { key: "cpu",     label: "Processeur",      items: CPUS },
  { key: "mobo",    label: "Carte mère",      items: MOBOS },
  { key: "ram",     label: "Mémoire RAM",     items: RAMS },
  { key: "gpu",     label: "Carte graphique", items: GPUS },
  { key: "storage", label: "Stockage",        items: STORAGES },
  { key: "psu",     label: "Alimentation",    items: PSUS },
  { key: "case",    label: "Boîtier",         items: CASES },
  { key: "cooling", label: "Refroidissement", items: COOLINGS },
];

/**
 * Clés ordonnées du catalogue. Source de vérité pour Zod et le rendu.
 */
export const COMPONENT_KEYS = [
  "cpu",
  "mobo",
  "ram",
  "gpu",
  "storage",
  "psu",
  "case",
  "cooling",
] as const satisfies readonly ComponentKey[];

/**
 * Set de tous les ids de composants existants. Utilisé par Zod pour rejeter
 * un id de composant inexistant dans une `Selection` reçue côté serveur.
 */
export const ALL_COMPONENT_IDS: ReadonlySet<string> = new Set(
  GROUPS.flatMap((g) => g.items.map((i) => i.id)),
);

export const PRESETS: Preset[] = [
  {
    name: "Budget Gaming", description: "1080p Ultra fluide", target: "1080p",
    selection: { cpu: "r5-5600", mobo: "b550-msi", ram: "16-ddr4", gpu: "rtx-4060ti", storage: "ssd-500", psu: "psu-650", case: "case-focus", cooling: "cooler-air" },
  },
  {
    name: "Performance", description: "1440p Ultra sans compromis", target: "1440p",
    selection: { cpu: "r7-5800x3d", mobo: "b550-asus", ram: "32-ddr4", gpu: "rtx-4070s", storage: "ssd-1t", psu: "psu-750", case: "case-h510", cooling: "cooler-240" },
  },
  {
    name: "4K Ultra", description: "Max settings partout", target: "4K",
    selection: { cpu: "r7-7800x3d", mobo: "x670-asus", ram: "32-ddr5", gpu: "rtx-4080s", storage: "ssd-2t", psu: "psu-850", case: "case-o11", cooling: "cooler-360" },
  },
];

export const IDEALO_URLS: Record<string, string> = {
  "r5-5600":     "https://www.idealo.fr/prix/7625980/amd-ryzen-5-5600.html",
  "r7-5800x3d":  "https://www.idealo.fr/prix/9048510/amd-ryzen-7-5800x3d.html",
  "r7-7800x3d":  "https://www.idealo.fr/prix/9810410/amd-ryzen-7-7800x3d.html",
  "b550-msi":    "https://www.idealo.fr/prix/7401609/msi-mag-b550-tomahawk.html",
  "b550-asus":   "https://www.idealo.fr/prix/7433386/asus-rog-strix-b550-f-gaming.html",
  "x670-asus":   "https://www.idealo.fr/prix/9205890/asus-rog-strix-x670e-f-gaming-wifi.html",
  "16-ddr4":     "https://www.idealo.fr/prix/8144286/kingston-fury-beast-16go-ddr4-3200.html",
  "32-ddr4":     "https://www.idealo.fr/prix/7143748/corsair-vengeance-lpx-32go-ddr4-3600.html",
  "32-ddr5":     "https://www.idealo.fr/prix/8904048/g-skill-trident-z5-rgb-32go-ddr5-6000.html",
  "rtx-4060ti":  "https://www.idealo.fr/prix/9486720/nvidia-geforce-rtx-4060-ti.html",
  "rtx-4070s":   "https://www.idealo.fr/prix/9810320/nvidia-geforce-rtx-4070-super.html",
  "rtx-4080s":   "https://www.idealo.fr/prix/9810330/nvidia-geforce-rtx-4080-super.html",
  "ssd-500":     "https://www.idealo.fr/prix/9530210/wd-blue-sn580-500go.html",
  "ssd-1t":      "https://www.idealo.fr/prix/8380540/samsung-980-pro-1to.html",
  "ssd-2t":      "https://www.idealo.fr/prix/9380540/samsung-990-pro-2to.html",
  "psu-650":     "https://www.idealo.fr/prix/9050210/be-quiet-pure-power-12-650w.html",
  "psu-750":     "https://www.idealo.fr/prix/7197530/corsair-rm750x-2021.html",
  "psu-850":     "https://www.idealo.fr/prix/6953820/seasonic-focus-gx-850.html",
  "case-focus":  "https://www.idealo.fr/prix/9174220/fractal-design-focus-2.html",
  "case-h510":   "https://www.idealo.fr/prix/9550320/nzxt-h5-flow.html",
  "case-o11":    "https://www.idealo.fr/prix/8550320/lian-li-pc-o11-dynamic-evo.html",
  "cooler-air":  "https://www.idealo.fr/prix/9170230/deepcool-ak400.html",
  "cooler-240":  "https://www.idealo.fr/prix/7380320/arctic-liquid-freezer-ii-240.html",
  "cooler-360":  "https://www.idealo.fr/prix/9130460/nzxt-kraken-360-rgb.html",
};


export function getCompatibilityErrors(sel: Selection): string[] {
  const errors: string[] = [];

  if (sel.cpu && sel.mobo) {
    const cpu = CPUS.find(c => c.id === sel.cpu);
    const mobo = MOBOS.find(m => m.id === sel.mobo);
    if (cpu && mobo && cpu.socket !== mobo.socket)
      errors.push(`Socket incompatible — CPU ${cpu.socket} vs Carte mère ${mobo.socket}`);
  }

  if (sel.mobo && sel.ram) {
    const mobo = MOBOS.find(m => m.id === sel.mobo);
    const ram = RAMS.find(r => r.id === sel.ram);
    if (mobo && ram && mobo.ramGen !== ram.gen)
      errors.push(`RAM incompatible — Carte mère ${mobo.ramGen} vs RAM ${ram.gen}`);
  }

  if (sel.psu && (sel.cpu || sel.gpu)) {
    const cpu = CPUS.find(c => c.id === sel.cpu);
    const gpu = GPUS.find(g => g.id === sel.gpu);
    const psu = PSUS.find(p => p.id === sel.psu);
    const needed = Math.round(((cpu?.tdp ?? 0) + (gpu?.tdp ?? 0)) * 1.4);
    if (psu && psu.watts < needed)
      errors.push(`Alimentation insuffisante — ${psu.watts}W vs ${needed}W recommandés`);
  }

  return errors;
}

export function wouldCreateError(sel: Selection, key: ComponentKey, id: string): boolean {
  return getCompatibilityErrors({ ...sel, [key]: id }).length > 0;
}

export function calculateTotal(sel: Selection): number {
  return GROUPS.reduce((total, group) => {
    const item = group.items.find(i => i.id === sel[group.key]);
    return total + (item?.price ?? 0);
  }, 0);
}

export function getSelectedCount(sel: Selection): number {
  return GROUPS.filter(g => sel[g.key]).length;
}

export function getSocketHint(key: ComponentKey, sel: Selection): string | null {
  if (key === "mobo" && sel.cpu) return CPUS.find(c => c.id === sel.cpu)?.socket ?? null;
  if (key === "ram" && sel.mobo) return MOBOS.find(m => m.id === sel.mobo)?.ramGen ?? null;
  return null;
}

export function getFpsLevel(fps: number): FpsLevel {
  if (fps >= 100) return "excellent";
  if (fps >= 70)  return "good";
  return "poor";
}

export function getYouTubeUrl(cpuId: string, gpuId: string): string | null {
  const cpu = CPUS.find(c => c.id === cpuId);
  const gpu = GPUS.find(g => g.id === gpuId);
  if (!cpu || !gpu) return null;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpu.name} ${gpu.name} benchmark gaming`)}`;
}
