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
  | 'shopping_bag'
  | 'local_shipping'
  | 'history'
  | 'account_circle'
  | 'error_outline'
  | 'info'
  | 'location_on'
  | 'phonepe'
  | 'razorpay'
  | 'cash'
  | 'kitchen'
  | 'lightbulb'
  | 'award'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'youtube'

type IconProps = {
  name: IconName
  className?: string
  style?: React.CSSProperties
}

export function Icon({ name, className, style }: IconProps) {
  const commonProps = {
    className: `icon ${className ?? ''}`.trim(),
    style,
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
    case 'location_on':
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
    case 'shopping_bag':
      return (
        <svg {...commonProps}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    case 'local_shipping':
      return (
        <svg {...commonProps}>
          <path d="M10 17h4V5H2v12h3" />
          <circle cx="7" cy="17" r="2" />
          <path d="M17 17h2v-5h-4v5h2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M14 8h5l3 3v6h-2" />
        </svg>
      )
    case 'history':
      return (
        <svg {...commonProps}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      )
    case 'account_circle':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M11 8a3 3 0 1 1 2 0 3 3 0 0 1-2 0Z" />
          <path d="M7 17a5 5 0 0 1 10 0" />
        </svg>
      )
    case 'error_outline':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    case 'info':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    case 'phonepe':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="#5f259f" stroke="none">
         <path d="M10.206 9.941h2.949v4.692c-.402.201-.938.268-1.34.268-1.072 0-1.609-.536-1.609-1.743V9.941zm13.47 4.816c-1.523 6.449-7.985 10.442-14.433 8.919C2.794 22.154-1.199 15.691.324 9.243 1.847 2.794 8.309-1.199 14.757.324c6.449 1.523 10.442 7.985 8.919 14.433zm-6.231-5.888a.887.887 0 0 0-.871-.871h-1.609l-3.686-4.222c-.335-.402-.871-.536-1.407-.402l-1.274.401c-.201.067-.268.335-.134.469l4.021 3.82H6.386c-.201 0-.335.134-.335.335v.67c0 .469.402.871.871.871h.938v3.217c0 2.413 1.273 3.82 3.418 3.82.67 0 1.206-.067 1.877-.335v2.145c0 .603.469 1.072 1.072 1.072h.938a.432.432 0 0 0 .402-.402V9.874h1.542c.201 0 .335-.134.335-.335v-.67z"/>
        </svg>
      )
    case 'razorpay':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="#02042b" stroke="none">
         <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z"/>
        </svg>
      )
    case 'cash':
      return (
        <svg {...commonProps}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      )
    case 'kitchen':
      return (
        <svg {...commonProps}>
          <path d="M6 13.8V21h12V13.8M6 13.8V3h12v10.8M6 13.8h12" />
          <path d="M9 17v1M15 17v1M9 7v1" />
        </svg>
      )
    case 'lightbulb':
      return (
        <svg {...commonProps}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.8.9 1.3 1.6 1.5 2.5" />
          <path d="M9 18h6M10 22h4" />
        </svg>
      )
    case 'award':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...commonProps}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'twitter':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
        </svg>
      )
    default:
      return null
  }
}
