// Mascot: 3 anh — hình 1 binh thuong, hình 2 nhap pass + show, hình 3 nhap pass an.
// Phim D: log trang thai + duong dan anh dang hien.
import { useEffect } from 'react'
import './loginMascotAnimations.css'

/** Duong dan public/ — ten file goi nho y nghia trang thai */
export const MASCOT_IMAGES = {
  /** Hình 1: mac dinh, focus email, chua focus pass */
  normal: '/mascot-normal.png',
  /** Hình 2: focus mat khau + bat "Hien mat khau" */
  passwordVisible: '/mascot-password-visible.png',
  /** Hình 3: focus mat khau + tat "Hien mat khau" */
  passwordHidden: '/mascot-password-hidden.png',
}

function eyeStateFromProps({ passwordFocused, showPassword }) {
  if (!passwordFocused) return 'open'
  if (showPassword) return 'winking'
  return 'closed'
}

/** Chon anh theo mo ta nguoi dung (hinh 1 / 2 / 3) */
function mascotVariantFromProps({ passwordFocused, showPassword }) {
  if (passwordFocused && !showPassword) return 'passwordHidden'
  if (passwordFocused && showPassword) return 'passwordVisible'
  return 'normal'
}

function LoginMascot({
  emailFocused = false,
  passwordFocused = false,
  showPassword = false,
  loginHover = false,
}) {
  const eyeState = eyeStateFromProps({ passwordFocused, showPassword })
  const variant = mascotVariantFromProps({ passwordFocused, showPassword })

  useEffect(() => {
    Object.values(MASCOT_IMAGES).forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'd' && e.key !== 'D') return
      const tag = e.target && e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      const active = MASCOT_IMAGES[variant]
      if (typeof globalThis !== 'undefined' && globalThis.console) {
        globalThis.console.log('[Mascot]', { variant, eyeState, activeSrc: active, MASCOT_IMAGES })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [eyeState, variant])

  const classNames = [
    'mascot',
    'mascot-container',
    `eyes-${eyeState}`,
    loginHover ? 'happy' : '',
    emailFocused ? 'tracking' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const layers = [
    { key: 'normal', src: MASCOT_IMAGES.normal, active: variant === 'normal' },
    { key: 'passwordVisible', src: MASCOT_IMAGES.passwordVisible, active: variant === 'passwordVisible' },
    { key: 'passwordHidden', src: MASCOT_IMAGES.passwordHidden, active: variant === 'passwordHidden' },
  ]

  return (
    <div className={classNames} aria-hidden>
      <div className="mascot-frame">
        <div className="mascot-photo-track">
          <div className="mascot-photo-stack">
            {layers.map(({ key, src, active }) => (
              <img
                key={key}
                src={src}
                alt=""
                className={`mascot-photo ${active ? 'is-active' : ''}`}
                width={440}
                height={440}
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginMascot
