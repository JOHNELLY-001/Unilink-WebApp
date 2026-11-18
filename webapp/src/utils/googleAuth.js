// ── GOOGLE IDENTITY SERVICES HELPER ──
// Loads the GIS client script and mounts the official "Sign in with Google"
// button. The credential it returns is a Google ID token (JWT), which the
// backend verifies with google-auth-library.
//
// Requires: VITE_GOOGLE_CLIENT_ID — the SAME OAuth client ID as the backend's
// GOOGLE_CLIENT_ID. No client secret is needed for this flow.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

let scriptPromise = null

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src   = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.onload  = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error('Could not load Google sign-in. Check your connection.'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

/**
 * Renders the official Google button into `element`.
 * Calls `onCredential(idToken)` when the user completes sign-in.
 */
export async function mountGoogleButton(element, onCredential) {
  if (!element) return
  if (!CLIENT_ID) {
    throw new Error('Google sign-in is not configured (missing VITE_GOOGLE_CLIENT_ID).')
  }

  await loadGoogleScript()

  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => {
      if (response?.credential) onCredential(response.credential)
    },
    auto_select: false,
  })

  window.google.accounts.id.renderButton(element, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: Math.min(element.offsetWidth || 340, 400),
  })
}
