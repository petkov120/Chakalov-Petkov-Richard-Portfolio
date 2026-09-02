import { useEffect, useRef, useState } from 'react'
import { FEED_POSTS } from '../data/posts'
import NavIcon from '../icons/NavIcon'
import Avatar from './Avatar'
import FeedPost from './FeedPost'

export default function Feed({ published = false, resetView = false, onCompose, onProfile, onMenu }) {
  const [activeNav, setActiveNav] = useState('home')
  const [showNewPosts, setShowNewPosts] = useState(true)
  const [isRapidScrolling, setIsRapidScrolling] = useState(false)
  const feedRef = useRef(null)
  const blurTimerRef = useRef(null)
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
    { id: 'grok', label: 'Grok' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'messages', label: 'Messages' },
  ]

  useEffect(() => {
    if (!resetView) return undefined
    setShowNewPosts(true)
    setIsRapidScrolling(false)
    const frame = window.requestAnimationFrame(() => {
      if (feedRef.current) feedRef.current.scrollTop = 520
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(blurTimerRef.current)
    }
  }, [resetView])

  const scrollToNewest = () => {
    setIsRapidScrolling(true)
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setShowNewPosts(false)
    window.clearTimeout(blurTimerRef.current)
    blurTimerRef.current = window.setTimeout(() => setIsRapidScrolling(false), 520)
  }

  return (
    <>
      <header className="x-feed-head">
        <button type="button" className="x-feed-head__avatar" aria-label="Open account menu" onClick={onMenu}>
          <Avatar tone="ink" initials="PC" />
        </button>
        <strong>𝕏</strong>
        <button aria-label="Settings">⌁</button>
      </header>
      <nav className="x-tabs"><span className="is-active">For you<i aria-hidden="true" /></span><span>Following</span><span>Design</span><button type="button" aria-label="Add topic">+</button></nav>
      {showNewPosts ? <button className="x-float-pill" type="button" aria-label="Show newest posts" onClick={scrollToNewest}>
        <span className="x-float-pill__arrow" aria-hidden="true">↑</span>
        <span className="x-float-pill__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="x-float-pill__faces" aria-hidden="true">
          <Avatar tone="clay" initials="TA" />
          <Avatar tone="blue" initials="NO" />
          <Avatar tone="ink" initials="PC" />
        </span>
      </button> : null}
      <main
        className={`x-feed${isRapidScrolling ? ' is-rapid-scrolling' : ''}`}
        ref={feedRef}
        onWheel={(event) => event.stopPropagation()}
      >
        {published ? <FeedPost newPost onAuthor={onProfile} /> : null}
        {FEED_POSTS.map((post) => (
          <FeedPost key={post.id} post={post} onAuthor={onProfile} />
        ))}
      </main>
      <button className="x-compose-fab" type="button" aria-label="Compose" onClick={onCompose}>+</button>
      <nav className="x-bottom" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? 'is-active' : ''}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                if (item.id === 'home' && activeNav === 'home') scrollToNewest()
                setActiveNav(item.id)
              }}
            >
              <span className="x-bottom__mark">
                <NavIcon id={item.id} filled={isActive} />
                {item.id === 'home' && isActive ? <i className="x-bottom__dot" aria-hidden="true" /> : null}
              </span>
            </button>
          )
        })}
      </nav>
      {published ? <div className="x-toast"><i>✓</i><span><strong>Posted</strong>Your thought is live.</span></div> : null}
    </>
  )
}
