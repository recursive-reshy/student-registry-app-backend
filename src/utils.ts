const isValidEmail = ( email: string ): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email )

const decodeUrlParam = ( urlParams: string ): string => decodeURIComponent( urlParams )

// Extract email strings from a notification with @ prefix
const getMentionedEmails = ( notification: string ): string[] => {
  const mentions = notification.match( /@[^\s@]+@[^\s@]+\.[^\s@]+/g ) || []

  if( mentions.length ) {
    // Remove @ prefix and get unique emails
    return [ ...new Set( mentions.map( ( mention ) => {
      const [ _, ...rest ] = mention.split( '@' )
      return rest.join( '@' )
    } ) ) ]
  }

  return mentions
}

export { 
  isValidEmail,
  decodeUrlParam,
  getMentionedEmails
}