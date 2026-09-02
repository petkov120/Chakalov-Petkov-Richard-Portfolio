import { useEffect, useRef, useState } from 'react'
import { authors } from './data/authors'
import { socialScreens } from './screens'
import AccountMenu from './components/AccountMenu'
import Composer from './components/Composer'
import CreatorStudio from './components/CreatorStudio'
import Feed from './components/Feed'
import ProfileCard from './components/ProfileCard'
import Splash from './components/Splash'
import StatusBar from './components/StatusBar'
import VideoStudio from './components/VideoStudio'
import './social.css'

const SPLASH_MS = 720

export default function SocialUI({ screen, onScreenChange = () => {} }) {
  const isSplash = screen === 'splash'
  const isProfile = screen === 'profile-peek'
  const isCompose = screen === 'compose' || screen === 'compose-ready'
  const isAccountMenu = screen === 'account-menu'
  const isCreatorStudio = screen === 'creator-studio'
  const isVideoStudio = screen === 'video-studio'
  const onScreenChangeRef = useRef(onScreenChange)
  const [selectedProfile, setSelectedProfile] = useState(authors.tola)
  onScreenChangeRef.current = onScreenChange

  useEffect(() => {
    if (!isSplash) return undefined
    const timer = window.setTimeout(() => onScreenChangeRef.current('feed'), SPLASH_MS)
    return () => window.clearTimeout(timer)
  }, [isSplash])

  return (
    <div className={`x-redesign${isSplash ? ' is-splash' : ''}${isVideoStudio ? ' is-video' : ''}`}>
      <div className="x-world">
        <StatusBar />
        {isCompose ? (
          <Composer
            ready={screen === 'compose-ready'}
            onCancel={() => onScreenChange('feed')}
            onChange={(draft) => onScreenChange(draft.trim() ? 'compose-ready' : 'compose')}
            onPublish={() => onScreenChange('published')}
          />
        ) : isCreatorStudio ? (
          <CreatorStudio
            onBack={() => onScreenChange('account-menu')}
            onOpenVideo={() => onScreenChange('video-studio')}
            onHome={() => onScreenChange('feed')}
          />
        ) : isVideoStudio ? (
          <VideoStudio onBack={() => onScreenChange('creator-studio')} />
        ) : (
          <Feed
            published={screen === 'published'}
            resetView={screen === 'feed'}
            onCompose={() => onScreenChange('compose')}
            onMenu={() => onScreenChange('account-menu')}
            onProfile={(author) => {
              setSelectedProfile(author)
              onScreenChange('profile-peek')
            }}
          />
        )}
      </div>
      {isSplash ? (
        <Splash onEnter={() => onScreenChange('feed')} onDone={() => onScreenChange('feed')} />
      ) : null}
      {isProfile ? (
        <div className="x-profile-layer" onClick={() => onScreenChange('feed')}>
          <ProfileCard author={selectedProfile} onDismiss={() => onScreenChange('feed')} />
        </div>
      ) : null}
      {isAccountMenu ? (
        <AccountMenu
          onDismiss={() => onScreenChange('feed')}
          onCreatorStudio={() => onScreenChange('creator-studio')}
        />
      ) : null}
    </div>
  )
}

export { socialScreens }
