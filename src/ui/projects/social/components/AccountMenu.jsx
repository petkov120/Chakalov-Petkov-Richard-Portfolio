import Glyph, { MENU_ICONS } from '../icons/Glyph'
import Avatar from './Avatar'

const MENU_PRIMARY = [
  { id: 'profile', label: 'Profile' },
  { id: 'premium', label: 'Premium' },
  { id: 'history', label: 'Bookmarks' },
  { id: 'communities', label: 'Communities' },
  { id: 'lists', label: 'Lists' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'studio', label: 'Creator Studio' },
]

const MENU_SECONDARY = [
  { id: 'grok', label: 'Open Grok' },
  { id: 'settings', label: 'Settings and privacy' },
  { id: 'help', label: 'Help Centre' },
]

export default function AccountMenu({ onDismiss, onCreatorStudio }) {
  return (
    <div className="x-menu-layer" onClick={onDismiss}>
      <aside className="x-menu" onClick={(event) => event.stopPropagation()}>
        <header className="x-menu__head">
          <div>
            <Avatar tone="ink" initials="PC" />
            <h2>Petkov Chakalov <i className="x-menu__verified" aria-label="Verified">✓</i></h2>
            <p>@petkov</p>
            <div className="x-follow-count"><strong>1,909</strong> Following <strong>498</strong> Followers</div>
          </div>
          <span className="x-menu__switch" aria-hidden="true">+</span>
        </header>
        <nav aria-label="Account">
          {MENU_PRIMARY.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.id === 'studio' ? onCreatorStudio : undefined}
            >
              <Glyph path={MENU_ICONS[item.id]} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <nav className="x-menu__secondary" aria-label="More">
          {MENU_SECONDARY.map((item) => (
            <button key={item.id} type="button">
              <Glyph path={MENU_ICONS[item.id]} size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  )
}
