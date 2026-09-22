import React, { useState, useEffect } from 'react';
import logoBsDefault from '../assets/images/LogoBS.jpg';
import pbvsiDefaultImg from '../assets/images/logopbvsi.png';

// Authentic Official PBVSI Emblem Logo SVG Vector
export const PbvsiVector: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 500 500"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Circular Navy Blue Ring */}
    <circle cx="250" cy="250" r="236" fill="#ffffff" stroke="#003882" strokeWidth="18" />

    {/* Tilted Volleyball Net Grid */}
    <g transform="rotate(-9 250 260)">
      {/* Net Boundary Lines */}
      <line x1="20" y1="172" x2="480" y2="172" stroke="#003882" strokeWidth="6" />
      <line x1="20" y1="362" x2="480" y2="362" stroke="#003882" strokeWidth="6" />

      {/* Net Inner Horizontals */}
      <line x1="20" y1="210" x2="480" y2="210" stroke="#003882" strokeWidth="3" />
      <line x1="20" y1="248" x2="480" y2="248" stroke="#003882" strokeWidth="3" />
      <line x1="20" y1="286" x2="480" y2="286" stroke="#003882" strokeWidth="3" />
      <line x1="20" y1="324" x2="480" y2="324" stroke="#003882" strokeWidth="3" />

      {/* Net Vertical Mesh Columns */}
      <line x1="38" y1="172" x2="38" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="72" y1="172" x2="72" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="106" y1="172" x2="106" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="140" y1="172" x2="140" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="174" y1="172" x2="174" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="208" y1="172" x2="208" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="242" y1="172" x2="242" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="276" y1="172" x2="276" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="310" y1="172" x2="310" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="344" y1="172" x2="344" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="378" y1="172" x2="378" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="412" y1="172" x2="412" y2="362" stroke="#003882" strokeWidth="3" />
      <line x1="446" y1="172" x2="446" y2="362" stroke="#003882" strokeWidth="3" />
    </g>

    {/* Volleyball Ball resting on top of the net */}
    <g id="ball">
      <circle cx="238" cy="148" r="64" fill="#ffffff" stroke="#003882" strokeWidth="7" />
      {/* Panel contours */}
      <path d="M 215 88 C 230 100, 235 125, 232 150 C 230 170, 222 195, 206 208" fill="none" stroke="#003882" strokeWidth="5" />
      <path d="M 238 84 C 255 100, 260 125, 258 152 C 255 174, 245 198, 228 211" fill="none" stroke="#003882" strokeWidth="5" />
      <path d="M 178 122 C 195 128, 215 122, 232 108" fill="none" stroke="#003882" strokeWidth="5" />
      <path d="M 184 152 C 202 156, 220 148, 232 136" fill="none" stroke="#003882" strokeWidth="5" />
      <path d="M 242 165 C 265 160, 285 168, 298 182" fill="none" stroke="#003882" strokeWidth="5" />
      <path d="M 250 192 C 270 188, 288 194, 296 202" fill="none" stroke="#003882" strokeWidth="5" />
    </g>

    {/* Bold Red PBVSI Acronym */}
    <text
      x="250"
      y="325"
      textAnchor="middle"
      fill="#ff0000"
      fontSize="122"
      fontWeight="900"
      fontFamily="'Impact', 'Arial Black', -apple-system, sans-serif"
      letterSpacing="-2px"
      transform="scale(1, 1.14) translate(0, -32)"
    >
      PBVSI
    </text>
  </svg>
);

// PBVSI Logo with Link, LocalStorage, and Image/SVG fallback
export const PbvsiLogo: React.FC<{
  className?: string;
  src?: string;
  forceVector?: boolean;
}> = ({ className = 'w-16 h-16', src, forceVector = false }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (src) return src;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pbvsi_logo_url') || pbvsiDefaultImg;
    }
    return pbvsiDefaultImg;
  });
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setLoadFailed(false);
      return;
    }

    const updateFromStorage = () => {
      const stored = localStorage.getItem('pbvsi_logo_url');
      setCurrentSrc(stored || pbvsiDefaultImg);
      setLoadFailed(false);
    };

    updateFromStorage();
    window.addEventListener('pbvsi_logo_changed', updateFromStorage);
    window.addEventListener('storage', updateFromStorage);

    return () => {
      window.removeEventListener('pbvsi_logo_changed', updateFromStorage);
      window.removeEventListener('storage', updateFromStorage);
    };
  }, [src]);

  if (!forceVector && !loadFailed && currentSrc) {
    return (
      <img
        src={currentSrc}
        alt="Logo PBVSI (Persatuan Bola Voli Seluruh Indonesia)"
        className={`${className} object-contain`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setLoadFailed(true)}
      />
    );
  }

  return <PbvsiVector className={className} />;
};

// Bintang Samudra Logo (Authentic Club Logo from BS.png / LogoBS.jpg)
export const BintangSamudraLogo: React.FC<{
  className?: string;
  src?: string;
  forceVector?: boolean;
}> = ({ className = 'w-24 h-24', src, forceVector = false }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (src) return src;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bs_club_logo_url') || logoBsDefault;
    }
    return logoBsDefault;
  });
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setLoadFailed(false);
      return;
    }

    const updateFromStorage = () => {
      const stored = localStorage.getItem('bs_club_logo_url');
      setCurrentSrc(stored || logoBsDefault);
      setLoadFailed(false);
    };

    updateFromStorage();
    window.addEventListener('bs_logo_changed', updateFromStorage);
    window.addEventListener('storage', updateFromStorage);

    return () => {
      window.removeEventListener('bs_logo_changed', updateFromStorage);
      window.removeEventListener('storage', updateFromStorage);
    };
  }, [src]);

  if (!forceVector && !loadFailed && currentSrc) {
    return (
      <img
        src={currentSrc}
        alt="Bintang Samudra"
        className={`${className} object-contain`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setLoadFailed(true)}
      />
    );
  }

  return (
  <svg
    viewBox="20 150 560 295"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="bs-ball-clip">
        <circle cx="280" cy="275" r="145" />
      </clipPath>
    </defs>

    {/* 1. Volleyball in Center/Upper-Right nestled behind Star & Text */}
    <g clipPath="url(#bs-ball-clip)">
      <circle cx="280" cy="275" r="145" fill="#ffffff" />

      {/* Top Left Yellow Panel */}
      <path
        d="M 145,205 C 180,145 250,135 330,160 C 290,195 230,215 145,205 Z"
        fill="#f7a400"
      />
      <path
        d="M 135,270 C 160,195 220,155 300,155 C 270,220 210,260 135,270 Z"
        fill="#0f3b7d"
      />

      {/* Upper Right Navy Blue & Yellow Panels */}
      <path
        d="M 300,155 C 370,175 420,225 425,285 C 370,260 310,235 265,220 C 285,190 295,170 300,155 Z"
        fill="#0f3b7d"
      />
      <path
        d="M 230,215 C 310,230 380,260 425,300 C 390,335 330,340 250,315 C 240,275 235,245 230,215 Z"
        fill="#f7a400"
      />

      {/* Lower Panels */}
      <path
        d="M 145,270 C 220,260 290,285 340,335 C 300,385 220,410 150,365 C 138,335 138,300 145,270 Z"
        fill="#f7a400"
      />
      <path
        d="M 250,315 C 320,330 375,335 415,315 C 405,370 355,415 285,420 C 275,385 265,350 250,315 Z"
        fill="#0f3b7d"
      />
      <path
        d="M 195,370 C 260,370 320,380 365,405 C 315,425 255,420 195,370 Z"
        fill="#f7a400"
      />

      {/* Crisp White Seams */}
      <path
        d="M 140,205 C 210,200 285,210 360,245"
        stroke="#ffffff"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 135,270 C 215,255 295,275 375,330"
        stroke="#ffffff"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 245,145 C 245,215 250,290 260,365"
        stroke="#ffffff"
        strokeWidth="7.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 310,160 C 305,230 315,305 345,380"
        stroke="#ffffff"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 200,315 C 260,330 330,340 420,310"
        stroke="#ffffff"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
    </g>

    {/* Volleyball Outer Seam Rim */}
    <circle cx="280" cy="275" r="145" stroke="#ffffff" strokeWidth="4" fill="none" />

    {/* 2. Athletic Dynamic Red & Golden Star on Left */}
    <g>
      {/* Golden Flame Accent in Top Star Notch */}
      <path
        d="M 148,195 C 160,172 185,157 215,165 C 190,182 175,202 168,232 Z"
        fill="#f7a400"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Main Dynamic Red Star */}
      <polygon
        points="138,168 152,238 25,245 126,295 72,392 166,332 218,438 203,322 152,238"
        fill="#e11b22"
      />

      {/* Dynamic Yellow & Navy Swoop on Lower Star Wing */}
      <path
        d="M 176,388 C 205,420 236,438 252,434 C 238,422 215,402 195,378 Z"
        fill="#f7a400"
      />
      <path
        d="M 210,408 C 232,426 248,430 258,426 C 246,416 230,405 212,392 Z"
        fill="#0f3b7d"
      />

      {/* Dynamic Inner Yellow Star Accent Arc */}
      <path
        d="M 148,172 L 158,232 L 205,202 C 185,185 165,175 148,172 Z"
        fill="#f7a400"
      />

      {/* White Inner Star Negative Space Cutout */}
      <polygon
        points="138,262 172,262 185,228 198,262 232,262 205,285 215,318 185,296 155,318 165,285"
        fill="#ffffff"
      />
    </g>

    {/* 3. Wordmark "BINTANG" (Vivid Red Serif Typography) */}
    <text
      x="165"
      y="322"
      fill="#d31920"
      fontFamily="'Playfair Display', 'Times New Roman', Georgia, serif"
      fontWeight="900"
      fontSize="78"
      letterSpacing="-0.5px"
    >
      BINTANG
    </text>

    {/* 4. Left Yellow Wing Accent & Wordmark "SAMUDRA" (Deep Navy Blue) */}
    <g>
      {/* Yellow Triangle Accent directly left of SAMUDRA */}
      <polygon
        points="310,338 336,338 310,368"
        fill="#f7a400"
      />

      {/* SAMUDRA Text */}
      <text
        x="352"
        y="364"
        fill="#0f3875"
        fontFamily="'Playfair Display', 'Times New Roman', Georgia, serif"
        fontWeight="900"
        fontSize="33"
        letterSpacing="4.5px"
      >
        SAMUDRA
      </text>
    </g>
  </svg>
  );
};
