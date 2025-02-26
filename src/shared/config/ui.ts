
export const LOADING_DELAY = 2000;

export const MOBILE_BREAKPOINT = 768;

export const UI_ELEMENTS = {
  GLASS_EFFECT: 'glass-effect p-4 rounded-lg',
  BUTTON: {
    BASE: 'px-4 py-2 rounded-lg transition-colors duration-200',
    PRIMARY: 'bg-[#4FD1C5] hover:bg-[#45b8ae] text-white',
    DANGER: 'bg-[#ea384c] hover:bg-[#d1293c] text-white',
    GHOST: 'glass-effect hover:bg-white/5',
  },
} as const;
