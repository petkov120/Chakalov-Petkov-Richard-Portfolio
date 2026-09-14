import Glyph, { MENU_ICONS } from '../icons/Glyph'
import NavIcon from '../icons/NavIcon'

export default function CreatorStudio({ onBack, onOpenVideo, onHome }) {
  return (
    <div className="x-cstudio">
      <header>
        <button type="button" aria-label="Back" onClick={onBack}><Glyph path={MENU_ICONS.back} size={20} /></button>
        <strong>Creator Studio</strong>
        <span />
      </header>
      <main>
        <section>
          <h2>Programs</h2>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.gift} />
            <div><strong>Original Content Rewards</strong><small>Earn from your posts</small></div>
            <em>Ineligible</em>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.communities} />
            <div><strong>Subscriptions</strong></div>
            <em>Ineligible</em>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
        </section>
        <section>
          <h2>Tools</h2>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.chart} />
            <div><strong>Analytics</strong></div>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.spark} />
            <div><strong>Inspiration</strong><small>Top posts by engagement</small></div>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
          <button type="button" className="x-cstudio__row is-new" onClick={onOpenVideo}>
            <Glyph path={MENU_ICONS.video} />
            <div><strong>Video Studio</strong><small>Trim, images, and keyframes in X</small></div>
            <b>New</b>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
        </section>
        <section>
          <h2>Support</h2>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.support} />
            <div><strong>Contact support</strong></div>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
          <button type="button" className="x-cstudio__row">
            <Glyph path={MENU_ICONS.learn} />
            <div><strong>Learn more</strong></div>
            <Glyph path={MENU_ICONS.chevron} size={16} />
          </button>
        </section>
      </main>
      <nav className="x-bottom" aria-label="Primary navigation">
        {[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
          { id: 'grok', label: 'Grok' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'messages', label: 'Messages' },
        ].map((item) => {
          const isActive = item.id === 'home'
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? 'is-active' : ''}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={item.id === 'home' ? onHome : undefined}
            >
              <span className="x-bottom__mark">
                <NavIcon id={item.id} filled={isActive} />
                {isActive ? <i className="x-bottom__dot" aria-hidden="true" /> : null}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
