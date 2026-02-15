import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const SPLASH_DURATION_MS = 2500;
const FADE_OUT_MS = 400;

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setFadeOut(true);
    }, SPLASH_DURATION_MS - FADE_OUT_MS);

    const finishTimer = window.setTimeout(() => {
      onFinish();
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        @keyframes splash-logo-in {
          0% { opacity: 0; transform: scale(0.85); }
          60% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-line-draw {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes splash-bar-fill {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes splash-shine {
          0% { opacity: 0; }
          50% { opacity: 0.4; }
          100% { opacity: 0; }
        }
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .splash-container.fade-out {
          opacity: 0;
        }
      `}</style>
      <Box
        className={fadeOut ? 'splash-container fade-out' : 'splash-container'}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 35%, #2563EB 70%, #3B82F6 100%)',
          opacity: 1,
          transition: `opacity ${FADE_OUT_MS}ms ease-out`,
        }}
      >
        <Box
          sx={{
            animation: 'splash-logo-in 1s ease-out forwards',
            transformOrigin: 'center',
          }}
        >
          <svg
            width="280"
            height="120"
            viewBox="0 0 280 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="lexa-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#BFDBFE" />
              </linearGradient>
              <linearGradient id="saving-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#BFDBFE" />
                <stop offset="100%" stopColor="#E0E7FF" />
              </linearGradient>
              <filter id="splash-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
              </filter>
              <filter id="splash-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Decorative line under logo - animated draw */}
            <path
              d="M 40 82 L 240 82"
              stroke="url(#lexa-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: 'splash-line-draw 1.2s ease-out 0.3s forwards',
                filter: 'url(#splash-glow)',
              }}
            />

            {/* LEXA - bold modern type */}
            <text
              x="140"
              y="42"
              textAnchor="middle"
              fill="url(#lexa-gradient)"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                filter: 'url(#splash-shadow)',
              }}
            >
              LEXA
            </text>

            {/* SAVING - lighter weight */}
            <text
              x="140"
              y="72"
              textAnchor="middle"
              fill="url(#saving-gradient)"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '0.18em',
                opacity: 0.95,
              }}
            >
              SAVING
            </text>

            {/* Coin / circle accent */}
            <circle
              cx="232"
              cy="38"
              r="12"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              style={{ animation: 'splash-pulse 2s ease-in-out infinite 0.8s' }}
            />
            <circle cx="232" cy="38" r="6" fill="rgba(255,255,255,0.9)" />
          </svg>
        </Box>

        {/* Loading bar */}
        <Box
          sx={{
            width: 200,
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            mt: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: 2,
              transformOrigin: 'left',
              animation: 'splash-bar-fill 2s ease-out 0.4s forwards',
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Melacak tujuan menabung Anda
        </Box>
      </Box>
    </>
  );
}
