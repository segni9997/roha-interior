import React from 'react';

/**
 * Normalizes user typing like "450 m2" or "100 ft2" into proper Unicode superscripts "450 m²" or "100 ft²".
 */
export function normalizeSuperscriptInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/\b(m|cm|mm|ft|in|km)2\b/gi, '$1²')
    .replace(/\b(m|cm|mm|ft|in|km)3\b/gi, '$1³')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³');
}

/**
 * Renders any string with semantic <sup> tags for superscripts (e.g. m², m2, cm², ft², etc.).
 */
export function renderSuperscriptText(text?: string | null): React.ReactNode {
  if (!text) return null;

  // Split by common unit suffixes and superscripts
  const parts = text.split(/(m²|m³|cm²|cm³|mm²|mm³|ft²|ft³|km²|in²|in³|\b(?:m|cm|mm|ft|in|km)[23]\b|\^[0-9]+|²|³)/gi);

  return (
    <>
      {parts.map((part, index) => {
        if (/^(m²|m2)$/i.test(part)) return <span key={index}>m<sup>2</sup></span>;
        if (/^(m³|m3)$/i.test(part)) return <span key={index}>m<sup>3</sup></span>;
        if (/^(cm²|cm2)$/i.test(part)) return <span key={index}>cm<sup>2</sup></span>;
        if (/^(cm³|cm3)$/i.test(part)) return <span key={index}>cm<sup>3</sup></span>;
        if (/^(mm²|mm2)$/i.test(part)) return <span key={index}>mm<sup>2</sup></span>;
        if (/^(mm³|mm3)$/i.test(part)) return <span key={index}>mm<sup>3</sup></span>;
        if (/^(ft²|ft2)$/i.test(part)) return <span key={index}>ft<sup>2</sup></span>;
        if (/^(ft³|ft3)$/i.test(part)) return <span key={index}>ft<sup>3</sup></span>;
        if (/^(km²|km2)$/i.test(part)) return <span key={index}>km<sup>2</sup></span>;
        if (/^(in²|in2)$/i.test(part)) return <span key={index}>in<sup>2</sup></span>;
        if (/^(in³|in3)$/i.test(part)) return <span key={index}>in<sup>3</sup></span>;
        if (part === '²') return <sup key={index}>2</sup>;
        if (part === '³') return <sup key={index}>3</sup>;
        if (/^\^([0-9]+)$/.test(part)) {
          return <sup key={index}>{part.replace('^', '')}</sup>;
        }
        return part;
      })}
    </>
  );
}
