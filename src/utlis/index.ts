const isValidEmail = ( email: string ): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email )

const decodeUrlParam = ( urlParams: string ): string => decodeURIComponent( urlParams )

// Extract email strings from a notification with @ prefix
const getMentionedEmails = ( notification: string ): string[] => notification.match( /@[^\s@]+@[^\s@]+\.[^\s@]+/g ) || []

export { 
  isValidEmail,
  decodeUrlParam,
  getMentionedEmails
}