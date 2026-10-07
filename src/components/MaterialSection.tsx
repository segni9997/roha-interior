import React, { useState, useMemo } from 'react';
import {
  Palette,
  Plus,
  Trash2,
  Compass,
  X,
  ChevronRight
} from 'lucide-react';

export interface MaterialSpecimen {
  id: string;
  name: string;
  finish: string;
  colorHex: string;
  description: string;
  category?: 'timber' | 'stone' | 'metal' | 'glass' | 'composite' | 'fabrication' | 'other';
  application?: string;
  texturePattern?: 'wood' | 'stone' | 'brushed' | 'glass' | 'solid';
  origin?: string;
}

// -------------------------------------------------------------
// CURATED ARCHITECTURAL MATERIAL KNOWLEDGE BASE
// -------------------------------------------------------------
const MATERIAL_PRESETS: Record<string, Partial<MaterialSpecimen>> = {
  oak: {
    name: 'Smoked European White Oak',
    finish: 'Natural Matte Deep Oil',
    colorHex: '#3e2a1d',
    category: 'timber',
    application: 'Bespoke Architectural Joinery & Wall Cladding',
    description: 'Sustainably harvested European oak smoked to rich umber tones, highlighting natural open grain with an ultra-matte, tactile organic finish.',
    texturePattern: 'wood',
    origin: 'European Forestry / FSC Certified'
  },
  walnut: {
    name: 'American Black Walnut',
    finish: 'Satin Micro-Waxed',
    colorHex: '#4a3324',
    category: 'timber',
    application: 'Feature Paneling & Custom Cabinetry',
    description: 'Warm, deep-grained hardwood selected for its continuous linear grain flow, offering high acoustic warmth and timeless elegance.',
    texturePattern: 'wood',
    origin: 'North American Sustainable Harvest'
  },
  timber: {
    name: 'Selected Solid Architectural Timber',
    finish: 'Natural Matte Polyurethane',
    colorHex: '#6b4c35',
    category: 'timber',
    application: 'Structural Ceilings & Screen Louvers',
    description: 'Premium architectural timber milled to tight tolerances, providing natural warmth and acoustic absorption.',
    texturePattern: 'wood'
  },
  wanza: {
    name: 'Indigenous Ethiopian Wanza (Cordia)',
    finish: 'Hand-Rubbed Organic Oil',
    colorHex: '#52341e',
    category: 'timber',
    application: 'Bespoke Furniture & Architectural Highlights',
    description: 'Exquisite indigenous Ethiopian hardwood renowned for distinctive ribbon grain, golden-brown undertones, and enduring resilience.',
    texturePattern: 'wood',
    origin: 'Ethiopian Rift Highlands'
  },
  travertine: {
    name: 'Roman Silver Travertine',
    finish: 'Honed & Cross-Cut (Unfilled)',
    colorHex: '#d4c7b8',
    category: 'stone',
    application: 'Primary Floor Slabs, Hearth & Wet Areas',
    description: 'Sourced from classical quarry beds, characterized by delicate porous textures, soft earthen hues, and monolithic thermal mass.',
    texturePattern: 'stone',
    origin: 'Tivoli, Italy'
  },
  basalt: {
    name: 'Volcanic Basalt Stone',
    finish: 'Flamed & Bush-Hammered',
    colorHex: '#2b2d30',
    category: 'stone',
    application: 'Feature Facade & Monolithic Kitchen Islands',
    description: 'Dense volcanic igneous stone with dark charcoal micro-crystals, offering superior scratch resistance and tactile raw stone gravitas.',
    texturePattern: 'stone',
    origin: 'Ethiopian Rift Escarpment'
  },
  marble: {
    name: 'Calacatta Vagli Marble',
    finish: 'Silk Honed & Book-Matched',
    colorHex: '#ece7df',
    category: 'stone',
    application: 'Island Monoliths & Master Bathroom Enclosure',
    description: 'Prestigious natural marble boasting warm amber and grey veining on an ivory ground, precisely book-matched across all planes.',
    texturePattern: 'stone',
    origin: 'Carrara, Italy'
  },
  brass: {
    name: 'Aged Brushed Brass',
    finish: 'Hand-Patinated Satin',
    colorHex: '#b58d3d',
    category: 'metal',
    application: 'Cabinetry Pulls, Concealed Hinges & Reveal Profiles',
    description: 'Living brass metalwork hand-buffed with micro-abrasives to achieve a rich champagne sheen that matures organically with age.',
    texturePattern: 'brushed',
    origin: 'Custom Metal Studio'
  },
  bronze: {
    name: 'Architectural Cast Bronze',
    finish: 'Dark Antique Chemical Patina',
    colorHex: '#4d392b',
    category: 'metal',
    application: 'Entrance Hardware, Fluted Mullions & Luminaires',
    description: 'Heavy architectural alloy possessing deep espresso tones and tactile cool warmth, precision-machined for flawless spatial tolerances.',
    texturePattern: 'brushed'
  },
  steel: {
    name: 'Blackened Raw Carbon Steel',
    finish: 'Beeswax Seal / Industrial Matte',
    colorHex: '#1e2124',
    category: 'metal',
    application: 'Custom Staircases, Glazing Frames & Fireplace Surround',
    description: 'Precision hot-rolled carbon steel treated with natural hot beeswax to preserve raw mill scale textures and subtle steel bloom.',
    texturePattern: 'brushed'
  },
  glass: {
    name: 'Low-Iron Acoustic Fluted Glass',
    finish: 'Acid-Etched 12mm Reeded',
    colorHex: '#a0b9b7',
    category: 'glass',
    application: 'Spatial Partitions & Translucent Dressing Enclosures',
    description: 'Ultra-clear reeded glass offering optimal acoustic isolation while diffusing natural daylight into rhythmic vertical light gradients.',
    texturePattern: 'glass'
  },
  acrylic: {
    name: 'Optical Grade Cast Acrylic',
    finish: 'Laser-Cut & Flame-Polished Edge',
    colorHex: '#b8cdd6',
    category: 'fabrication',
    application: 'Scale Model Glazing & Floor Level Articulation',
    description: '99.8% light-transmission optical sheet cut via precision CO2 laser down to 0.05mm tolerance for crisp architectural scale models.',
    texturePattern: 'glass'
  },
  basswood: {
    name: 'Kiln-Dried American Basswood',
    finish: 'Micro-Sanded 400-Grit Architectural Raw',
    colorHex: '#d8c29d',
    category: 'fabrication',
    application: 'Physical Massing Models & Structural Louvers',
    description: 'Tight-grained, warp-resistant scale lumber ideal for micro-louvers, fine columns, and tactile monochromatic architectural models.',
    texturePattern: 'wood',
    origin: 'Sustainable Forestry / Model Making Grade'
  },
  resin: {
    name: 'SLA Photopolymer High-Detail Resin',
    finish: 'UV Post-Cured & Satin Primer',
    colorHex: '#d5dcde',
    category: 'fabrication',
    application: 'Complex Parametric Geometries & Organic Facades',
    description: 'Liquid photopolymer 3D printed at 25-micron layer resolution, reproducing double-curved parametric surfaces with pinpoint fidelity.',
    texturePattern: 'solid'
  },
  concrete: {
    name: 'Architectural Fair-Faced Concrete',
    finish: 'Smooth Tie-Rod Formed Matte',
    colorHex: '#8b8e8f',
    category: 'stone',
    application: 'Exposed Structural Cores & Cantilevered Slabs',
    description: 'Self-compacting micro-cement blend cured against smooth plywood forms, delivering crisp shadow reveals and monolithic stability.',
    texturePattern: 'stone'
  },
  plaster: {
    name: 'Tadelakt Mineral Lime Plaster',
    finish: 'Olive-Soap Polished Seamless',
    colorHex: '#e2d9cd',
    category: 'stone',
    application: 'Continuous Wall Surfaces & Curving Soffits',
    description: 'Seamless traditional hydraulic lime plaster hand-burnished with river stones, creating smooth, breathable, and water-repellent surfaces.',
    texturePattern: 'stone'
  }
};

/**
 * Intelligent material parser that extracts rich architectural specimens
 * from a raw comma/semicolon-separated string.
 */
export function parseMaterialsFromString(raw: string): MaterialSpecimen[] {
  if (!raw || !raw.trim()) {
    return [
      {
        id: 'mat-1',
        name: 'Smoked European White Oak',
        finish: 'Natural Matte Deep Oil',
        colorHex: '#3e2a1d',
        category: 'timber',
        application: 'Bespoke Architectural Joinery & Wall Cladding',
        description: 'Sustainably harvested European oak smoked to rich umber tones, highlighting natural open grain with an ultra-matte, tactile organic finish.',
        texturePattern: 'wood'
      },
      {
        id: 'mat-2',
        name: 'Roman Silver Travertine',
        finish: 'Honed & Cross-Cut (Unfilled)',
        colorHex: '#d4c7b8',
        category: 'stone',
        application: 'Primary Floor Slabs, Hearth & Wet Areas',
        description: 'Sourced from classical quarry beds, characterized by delicate porous textures, soft earthen hues, and monolithic thermal mass.',
        texturePattern: 'stone'
      },
      {
        id: 'mat-3',
        name: 'Aged Brushed Brass',
        finish: 'Hand-Patinated Satin',
        colorHex: '#b58d3d',
        category: 'metal',
        application: 'Cabinetry Pulls, Concealed Hinges & Reveal Profiles',
        description: 'Living brass metalwork hand-buffed with micro-abrasives to achieve a rich champagne sheen that matures organically with age.',
        texturePattern: 'brushed'
      }
    ];
  }

  const items = raw
    .split(/[,;\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return items.map((item, idx) => {
    const lower = item.toLowerCase();
    let matchedPreset: Partial<MaterialSpecimen> | null = null;

    for (const key of Object.keys(MATERIAL_PRESETS)) {
      if (lower.includes(key)) {
        matchedPreset = MATERIAL_PRESETS[key];
        break;
      }
    }

    if (matchedPreset) {
      return {
        id: `mat-${idx + 1}-${lower.replace(/[^a-z0-9]/g, '')}`,
        name: matchedPreset.name || item,
        finish: matchedPreset.finish || 'Custom Architectural Finish',
        colorHex: matchedPreset.colorHex || '#4a5568',
        category: matchedPreset.category || 'other',
        application: matchedPreset.application || 'Architectural Palette Application',
        description: matchedPreset.description || `Architectural specification for ${item}, carefully selected to harmonize with the spatial ambiance.`,
        texturePattern: matchedPreset.texturePattern || 'solid',
        origin: matchedPreset.origin
      };
    }

    // Dynamic fallback for custom material
    return {
      id: `mat-${idx + 1}`,
      name: item.charAt(0).toUpperCase() + item.slice(1),
      finish: 'Custom Architectural Finish',
      colorHex: idx % 3 === 0 ? '#3e2a1d' : idx % 3 === 1 ? '#c8b69b' : '#b08b50',
      category: 'other',
      application: 'Bespoke Spatial Element',
      description: `Custom curated material selection for ${item}, ensuring tactile richness and spatial continuity.`,
      texturePattern: 'solid'
    };
  });
}

export interface MaterialSectionProps {
  materials?: MaterialSpecimen[];
  materialPalette?: string;
  materialsUsed?: string;
  title?: string;
  subtitle?: string;
  editable?: boolean;
  onUpdateMaterials?: (materials: MaterialSpecimen[]) => void;
  className?: string;
}

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  materials: initialMaterials,
  materialPalette = '',
  materialsUsed = '',
  title = 'Curated Material & Tactile Palette',
  subtitle = 'TACTILE SPECIMENS // ARCHITECTURAL FINISHES',
  editable = false,
  onUpdateMaterials,
  className = ''
}) => {
  // Compute specimens
  const specimens: MaterialSpecimen[] = useMemo(() => {
    if (initialMaterials && initialMaterials.length > 0) {
      return initialMaterials;
    }
    const combinedString = [materialPalette, materialsUsed].filter(Boolean).join(', ');
    return parseMaterialsFromString(combinedString);
  }, [initialMaterials, materialPalette, materialsUsed]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSpecimen, setSelectedSpecimen] = useState<MaterialSpecimen | null>(null);

  // Filtered list
  const filteredSpecimens = useMemo(() => {
    if (activeCategory === 'all') return specimens;
    return specimens.filter(s => s.category === activeCategory);
  }, [specimens, activeCategory]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    specimens.forEach(s => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [specimens]);

  const handleAddCustomSpecimen = () => {
    if (!onUpdateMaterials) return;
    const newSpecimen: MaterialSpecimen = {
      id: `mat-${Date.now()}`,
      name: 'Bespoke Material Specimen',
      finish: 'Honed Matte Texture',
      colorHex: '#8c7853',
      category: 'timber',
      application: 'Feature Spatial Element',
      description: 'Custom selected architectural material specimen with tactile finish and curated palette harmony.',
      texturePattern: 'wood'
    };
    onUpdateMaterials([...specimens, newSpecimen]);
    setSelectedSpecimen(newSpecimen);
  };

  const handleDeleteSpecimen = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateMaterials) return;
    const next = specimens.filter(s => s.id !== id);
    onUpdateMaterials(next);
    if (selectedSpecimen?.id === id) {
      setSelectedSpecimen(null);
    }
  };

  const handleUpdateCurrentSpecimen = (updated: MaterialSpecimen) => {
    if (!onUpdateMaterials) return;
    const next = specimens.map(s => (s.id === updated.id ? updated : s));
    onUpdateMaterials(next);
    setSelectedSpecimen(updated);
  };

  return (
    <section
      id="material-section"
      className={`w-full bg-[#f0f0f0] py-16 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 relative overflow-hidden border-t border-slate-300/80 ${className}`}
    >
      {/* Subtle architectural background grid / watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#172a2b_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 pb-8 border-b border-slate-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172a2b]/10 text-[#205b63] border border-[#205b63]/20 mb-3">
              <Palette size={13} className="text-[#d4af37]" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest">
                {subtitle}
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#172a2b] uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-sans max-w-2xl mt-2 leading-relaxed">
              Every texture is specified with intentional sensory contrast—combining natural stone gravitas, organic timber warmth, and precision-machined metal details.
            </p>
          </div>

          {/* Action or Category Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#172a2b] text-white shadow-md'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200'
              }`}
            >
              All ({specimens.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#172a2b] text-white shadow-md'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {editable && onUpdateMaterials && (
              <button
                onClick={handleAddCustomSpecimen}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#205b63] hover:bg-[#172a2b] text-white text-xs font-bold font-mono uppercase transition-all shadow-md cursor-pointer ml-auto"
              >
                <Plus size={14} />
                <span>Add Specimen</span>
              </button>
            )}
          </div>
        </div>

        {/* Specimen Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSpecimens.map((specimen, idx) => {
            const isSelected = selectedSpecimen?.id === specimen.id;
            return (
              <div
                key={specimen.id || idx}
                onClick={() => setSelectedSpecimen(specimen)}
                className={`group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#205b63] ring-2 ring-[#205b63]/30 -translate-y-1'
                    : 'border-slate-200/90 hover:border-[#205b63]/50 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Top Swatch Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    {/* Swatch Plate with realistic lighting gradient */}
                    <div
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border border-black/15 shadow-inner relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: specimen.colorHex }}
                    >
                      {/* Highlight reflection gradient */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40 pointer-events-none" />
                      {/* Subtle pattern indication */}
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[8px] font-mono text-white/90 uppercase font-bold">
                        {specimen.colorHex}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#205b63] font-bold bg-[#205b63]/10 px-2.5 py-1 rounded-full border border-[#205b63]/15">
                        {specimen.category || 'Specimen'}
                      </span>
                      {specimen.origin && (
                        <span className="text-[9px] font-mono text-slate-400">
                          {specimen.origin}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specimen Name & Finish */}
                  <h4 className="text-lg sm:text-xl font-black text-[#172a2b] uppercase tracking-tight group-hover:text-[#205b63] transition-colors line-clamp-1">
                    {specimen.name}
                  </h4>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37] mt-1">
                    {specimen.finish}
                  </p>

                  {/* Application Pill */}
                  {specimen.application && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-medium">
                      <Compass size={11} className="text-[#205b63]" />
                      <span className="truncate max-w-[240px]">{specimen.application}</span>
                    </div>
                  )}

                  {/* Tactile Description */}
                  <p className="text-xs sm:text-sm text-slate-600 font-sans mt-4 leading-relaxed line-clamp-3">
                    {specimen.description}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#205b63] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Inspect Specimen</span>
                    <ChevronRight size={13} />
                  </span>

                  {editable && onUpdateMaterials && (
                    <button
                      onClick={e => handleDeleteSpecimen(specimen.id, e)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Remove Specimen"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* -------------------- SPECIMEN DETAIL INSPECTOR MODAL -------------------- */}
        {selectedSpecimen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpecimen(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                {/* Enlarged Swatch Visual Plate */}
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-2 border-black/10 shadow-xl relative overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: selectedSpecimen.colorHex }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/40 pointer-events-none" />
                  <span className="relative z-10 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-sm">
                    {selectedSpecimen.colorHex}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#205b63]/10 text-[#205b63] px-2.5 py-0.5 rounded-full">
                      {selectedSpecimen.category || 'Architectural Specimen'}
                    </span>
                    {selectedSpecimen.origin && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {selectedSpecimen.origin}
                      </span>
                    )}
                  </div>

                  {editable ? (
                    <input
                      type="text"
                      value={selectedSpecimen.name}
                      onChange={e =>
                        handleUpdateCurrentSpecimen({ ...selectedSpecimen, name: e.target.value })
                      }
                      className="text-2xl sm:text-3xl font-black text-[#172a2b] uppercase tracking-tight w-full border-b border-slate-300 focus:outline-none focus:border-[#205b63] pb-1"
                    />
                  ) : (
                    <h3 className="text-2xl sm:text-3xl font-black text-[#172a2b] uppercase tracking-tight">
                      {selectedSpecimen.name}
                    </h3>
                  )}

                  {editable ? (
                    <input
                      type="text"
                      value={selectedSpecimen.finish}
                      onChange={e =>
                        handleUpdateCurrentSpecimen({ ...selectedSpecimen, finish: e.target.value })
                      }
                      placeholder="Finish / Texture..."
                      className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37] w-full border-b border-slate-300 focus:outline-none focus:border-[#205b63] mt-2 pb-1"
                    />
                  ) : (
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37] mt-1">
                      {selectedSpecimen.finish}
                    </p>
                  )}
                </div>
              </div>

              {/* Editable Fields or Specs in Modal */}
              <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                    Spatial Application & Placement
                  </label>
                  {editable ? (
                    <input
                      type="text"
                      value={selectedSpecimen.application || ''}
                      onChange={e =>
                        handleUpdateCurrentSpecimen({ ...selectedSpecimen, application: e.target.value })
                      }
                      placeholder="e.g. Bespoke Joinery & Wall Cladding"
                      className="w-full text-sm font-sans p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#205b63]"
                    />
                  ) : (
                    <p className="text-sm font-sans font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {selectedSpecimen.application || 'Curated across primary spatial surfaces and architectural reveals.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                    Tactile Rationale & Sensory Description
                  </label>
                  {editable ? (
                    <textarea
                      rows={3}
                      value={selectedSpecimen.description}
                      onChange={e =>
                        handleUpdateCurrentSpecimen({ ...selectedSpecimen, description: e.target.value })
                      }
                      className="w-full text-sm font-sans p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#205b63]"
                    />
                  ) : (
                    <p className="text-sm font-sans text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {selectedSpecimen.description}
                    </p>
                  )}
                </div>

                {editable && (
                  <div className="flex items-center gap-4 pt-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        Swatch Hex Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedSpecimen.colorHex}
                          onChange={e =>
                            handleUpdateCurrentSpecimen({ ...selectedSpecimen, colorHex: e.target.value })
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                        />
                        <input
                          type="text"
                          value={selectedSpecimen.colorHex}
                          onChange={e =>
                            handleUpdateCurrentSpecimen({ ...selectedSpecimen, colorHex: e.target.value })
                          }
                          className="text-xs font-mono uppercase p-2 rounded-lg border border-slate-300 w-24"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        Category
                      </label>
                      <select
                        value={selectedSpecimen.category || 'other'}
                        onChange={e =>
                          handleUpdateCurrentSpecimen({
                            ...selectedSpecimen,
                            category: e.target.value as any
                          })
                        }
                        className="text-xs font-mono uppercase p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="timber">Timber & Joinery</option>
                        <option value="stone">Natural Stone & Mineral</option>
                        <option value="metal">Architectural Metals</option>
                        <option value="glass">Glazing & Systems</option>
                        <option value="fabrication">Model Fabrication</option>
                        <option value="other">Other Specimen</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button at bottom */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedSpecimen(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#172a2b] hover:bg-[#205b63] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MaterialSection;
