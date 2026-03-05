type IconName =
  | 'chair'
  | 'search'
  | 'shopping_cart'
  | 'person'
  | 'dashboard'
  | 'order_history'
  | 'location'
  | 'payment'
  | 'settings'
  | 'bell'
  | 'logout'
  | 'truck'
  | 'gift'
  | 'more'
  | 'home'
  | 'business'
  | 'phone'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'menu'
  | 'mail'
  | 'lock'
  | 'visibility'
  | 'visibility_off'
  | 'close'
  | 'apple'
  | 'arrow_forward'
  | 'chevron_right'
  | 'add_shopping_cart'
  | 'star'
  | 'eco'
  | 'handyman'
  | 'public'
  | 'share'
  | 'image'

type IconProps = {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const commonProps = {
    className: `icon ${className ?? ''}`.trim(),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'shopping_cart':
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="20" r="1.3" />
          <circle cx="18" cy="20" r="1.3" />
          <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H7" />
        </svg>
      )
    case 'person':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      )
    case 'order_history':
      return (
        <svg {...commonProps}>
          <path d="M3 7h18v13H3z" />
          <path d="M16 7V5a2 2 0 1 0-4 0v2" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      )
    case 'location':
      return (
        <svg {...commonProps}>
          <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      )
    case 'payment':
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4h.1a1.8 1.8 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.8 1.8 0 0 0 1 1.6h.1a1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2v.1a1.8 1.8 0 0 0 1.6 1H21a2 2 0 0 1 0 4h-.1a1.8 1.8 0 0 0-1.6 1Z" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M15 18H5l1.3-1.3A2 2 0 0 0 7 15.3V11a5 5 0 1 1 10 0v4.3a2 2 0 0 0 .6 1.4L19 18h-4" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...commonProps}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H4" />
          <path d="M12 20h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...commonProps}>
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
        </svg>
      )
    case 'gift':
      return (
        <svg {...commonProps}>
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M12 9v12" />
          <path d="M3 13h18" />
          <path d="M8.5 9c-1.9 0-3-1.2-3-2.6A2.4 2.4 0 0 1 8 4c2 0 4 2 4 5" />
          <path d="M15.5 9c1.9 0 3-1.2 3-2.6A2.4 2.4 0 0 0 16 4c-2 0-4 2-4 5" />
        </svg>
      )
    case 'more':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      )
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      )
    case 'business':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h2M8 12h2M8 16h2M14 8h2M14 12h2M14 16h2" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...commonProps}>
          <path d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5 2h2a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 2.9a2 2 0 0 1-.4 2.1L8.2 9.8a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.4c.9.4 1.9.7 2.9.8A2 2 0 0 1 22 16.9Z" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'trash':
      return (
        <svg {...commonProps}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 6l1 14h10l1-14" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...commonProps}>
          <path d="M4 20h4l10-10-4-4L4 16v4Z" />
          <path d="m13 7 4 4" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...commonProps}>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      )
    case 'visibility':
      return (
        <svg {...commonProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    case 'visibility_off':
      return (
        <svg {...commonProps}>
          <path d="M17.9 17.4A10 10 0 0 1 12 19c-7 0-10-7-10-7a17.5 17.5 0 0 1 4.2-5.4" />
          <path d="M9.2 4.6A9.5 9.5 0 0 1 12 4c7 0 10 7 10 7a17.6 17.6 0 0 1-1.8 2.7" />
          <circle cx="12" cy="12" r="2.5" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      )
    case 'close':
      return (
        <svg {...commonProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'apple':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M16.7 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.9-1.8-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.8 3.2-.5 7.9 1.3 10.4.9 1.2 1.9 2.5 3.3 2.4 1.3-.1 1.8-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.3-1.2 3.1-2.4.9-1.3 1.3-2.5 1.3-2.6-.1 0-3.2-1.2-3.2-5ZM14.3 5.8c.7-.8 1.2-1.9 1-3-.9 0-2 .6-2.6 1.4-.6.7-1.2 1.9-1 3 .9.1 1.9-.5 2.6-1.4Z" />
        </svg>
      )
    case 'arrow_forward':
      return (
        <svg {...commonProps}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )
    case 'chevron_right':
      return (
        <svg {...commonProps}>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      )
    case 'add_shopping_cart':
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="20" r="1.3" />
          <circle cx="18" cy="20" r="1.3" />
          <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H7" />
          <line x1="12" y1="3" x2="12" y2="8" />
          <line x1="9.5" y1="5.5" x2="14.5" y2="5.5" />
        </svg>
      )
    case 'star':
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="m12 2.5 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5-4.7-4.6 6.5-1z" />
        </svg>
      )
    case 'eco':
      return (
        <svg {...commonProps}>
          <path d="M4 13c6 0 8-7 16-7-1 9-7 14-14 14-1 0-2-.2-3-.5 2.2-1.3 4.2-3.1 5.8-5.5" />
        </svg>
      )
    case 'handyman':
      return (
        <svg {...commonProps}>
          <path d="m14 7 3-3 3 3-3 3" />
          <path d="m12 9 6 6-2 2-6-6" />
          <path d="M4 20l5-5" />
          <path d="m3 15 6 6" />
        </svg>
      )
    case 'public':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      )
    case 'share':
      return (
        <svg {...commonProps}>
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <line x1="8" y1="11" x2="16" y2="6" />
          <line x1="8" y1="13" x2="16" y2="18" />
        </svg>
      )
    case 'image':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m21 16-5-5-6 6-2-2-5 5" />
        </svg>
      )
    case 'chair':
      return (
        <svg {...commonProps}>
          <path d="M7 11h10a2 2 0 0 1 2 2v2H5v-2a2 2 0 0 1 2-2Z" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
          <line x1="7" y1="15" x2="7" y2="20" />
          <line x1="17" y1="15" x2="17" y2="20" />
        </svg>
      )
    default:
      return null
  }
}
