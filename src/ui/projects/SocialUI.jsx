import { useEffect, useRef, useState } from 'react'

const screens = [
  { id: 'splash', label: 'Splash', purpose: 'Introduce the product before the feed appears' },
  { id: 'feed', label: 'For You feed', purpose: 'Scan posts with clearer content boundaries' },
  { id: 'profile-peek', label: 'Profile peek', purpose: 'Understand who posted without leaving the feed' },
  { id: 'profile-expanded', label: 'Profile expanded', purpose: 'See credibility and choose whether to follow' },
  { id: 'compose', label: 'Compose', purpose: 'Start writing without competing interface noise' },
  { id: 'compose-ready', label: 'Ready to publish', purpose: 'Make audience and publish state unmistakable' },
  { id: 'published', label: 'Published', purpose: 'Return to the same feed position with clear feedback' },
]

const SPLASH_MS = 720

const avatarImages = {
  clay: '/images/social/avatars/tola.webp',
  blue: '/images/social/avatars/nia.webp',
  ink: '/images/social/avatars/petkov.webp',
  sage: '/images/social/avatars/ife.webp?v=1',
}

const NAV_ICONS = {
  home: {
    outline:
      'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99C2.157 7.31 2 7.641 2 8.004v12.496C2 21.872 3.028 23 4.3 23h5.7v-7.3h4v7.3h5.7c1.272 0 2.3-1.128 2.3-2.5V8.004c0-.363-.157-.694-.409-.858zM20 21h-4.8v-7.197c0-1.064-.897-1.852-1.852-1.852h-2.695c-1.043 0-1.707.776-1.707 1.874V21H4V8.073L12.002 2.6 20.001 8.07 20 21z',
    filled:
      'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99C2.157 7.31 2 7.641 2 8.004v12.496C2 21.872 3.028 23 4.3 23h5.7v-7.3h4v7.3h5.7c1.272 0 2.3-1.128 2.3-2.5V8.004c0-.363-.157-.694-.409-.858z',
  },
  search: {
    outline:
      'M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z',
    filled:
      'M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z',
  },
  grok: {
    viewBox: '0 0 33 32',
    outline:
      'M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466',
    filled:
      'M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466',
  },
  notifications: {
    outline:
      'M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z',
    filled:
      'M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z',
  },
  messages: {
    outline:
      'M20.7 11.7c0-4.48-3.844-8.2-8.699-8.2-4.854 0-8.698 3.72-8.698 8.2v.015l-.001.014c-.02.667.09 1.225.25 1.767.083.28.176.545.276.839.098.285.202.595.288.918.177.663.284 1.401.156 2.271-.086.582-.274 1.191-.582 1.855 1.264.375 2.55.053 4.013-.599l.455-.203.437.242c1.07.594 1.917 1.08 3.406 1.08 4.855 0 8.7-3.72 8.7-8.199zm2 0c0 5.683-4.84 10.2-10.699 10.2-1.784 0-2.96-.555-3.95-1.095-1.876.768-4.02 1.2-6.245-.075l-.885-.505.524-.875c.54-.904.77-1.581.848-2.118.078-.526.02-.98-.11-1.463-.066-.25-.15-.502-.247-.788-.095-.277-.204-.59-.301-.92-.199-.674-.36-1.449-.332-2.39C1.322 6.002 6.154 1.5 12.002 1.5c5.859 0 10.7 4.518 10.7 10.2z',
    filled:
      'M22.7 11.7c0 5.683-4.84 10.2-10.699 10.2-1.784 0-2.96-.555-3.95-1.095-1.876.768-4.02 1.2-6.245-.075l-.885-.505.524-.875c.54-.904.77-1.581.848-2.118.078-.526.02-.98-.11-1.463-.066-.25-.15-.502-.247-.788-.095-.277-.204-.59-.301-.92-.199-.674-.36-1.449-.332-2.39C1.322 6.002 6.154 1.5 12.002 1.5c5.859 0 10.7 4.518 10.7 10.2z',
  },
}

function NavIcon({ id, filled }) {
  const icon = NAV_ICONS[id]
  return (
    <svg viewBox={icon.viewBox ?? '0 0 24 24'} aria-hidden="true">
      <g transform={icon.transform}>
        <path fill="currentColor" d={filled ? icon.filled : icon.outline} />
      </g>
    </svg>
  )
}

const ACTION_ICONS = {
  reply:
    'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z',
  repost:
    'M4.75 3.79l4.603 4.3-1.706 1.82L6 8.32V13.5c0 1.105.895 2 2 2h4.5v2H8c-2.209 0-4-1.791-4-4V8.32l-1.647 1.57-1.706-1.82L4.75 3.79zM15.5 6H11V4h4.5c2.209 0 4 1.791 4 4v5.18l1.647-1.57 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 11.68V8c0-1.105-.895-2-2-2z',
  like: {
    outline:
      'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.63-3.075 1.57-1.43 1.82-1.025 5.21 1.424 7.62 2.05 2.01 5.12 3.87 6.346 4.45s4.298-2.44 6.348-4.45c2.449-2.41 2.854-5.8 1.424-7.62-.725-.94-1.831-1.5-3.074-1.57z',
    filled:
      'M20.884 13.19c-1.351 2.48-4.001 5.12-8.884 8.59-4.97-3.57-7.6-6.2-8.979-8.69-1.29-2.32-1.45-4.88-.42-7.15.91-2.06 2.86-3.31 4.74-3.31 1.54 0 3.04.99 3.57 2.36h1.32c.52-1.37 2.03-2.36 3.56-2.36 1.88 0 3.83 1.25 4.74 3.31 1.13 2.37.94 4.92-.335 7.25z',
  },
  views:
    'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z',
  bookmark:
    'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z',
  share:
    'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z',
}

function ActionIcon({ id, filled = false }) {
  const icon = ACTION_ICONS[id]
  const d = typeof icon === 'string' ? icon : filled ? icon.filled : icon.outline
  return (
    <span className="x-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <g>
          <path fill="currentColor" d={d} />
        </g>
      </svg>
    </span>
  )
}

function StatusBar() {
  return <div className="x-status"><b>10:11</b><i /><span>▮▮▮ 5G ◒</span></div>
}

function Splash({ onEnter, onDone }) {
  return (
    <button
      className="x-splash"
      type="button"
      onClick={onEnter}
      onAnimationEnd={(event) => {
        if (event.animationName === 'x-splash-unveil') onDone()
      }}
      aria-label="Open X feed"
    >
      <span className="x-splash__atmosphere" aria-hidden="true" />
      <span className="x-splash__beam" aria-hidden="true" />
      <span className="x-splash__stage" aria-hidden="true">
        <span className="x-splash__trail x-splash__trail--one">𝕏</span>
        <span className="x-splash__trail x-splash__trail--two">𝕏</span>
        <span className="x-splash__mark" data-mark="𝕏">𝕏</span>
      </span>
      <span className="x-splash__flash" aria-hidden="true" />
      <small>Tap to enter</small>
    </button>
  )
}

function Avatar({ tone = 'clay', initials = 'TA', className = '' }) {
  const src = avatarImages[tone]
  return (
    <span className={`x-avatar x-avatar--${tone} ${className}`}>
      {src ? <img src={src} alt="" aria-hidden="true" /> : null}
      <span className="x-avatar__fallback">{initials}</span>
    </span>
  )
}

function Actions({ replies = 12, reposts = 34, likes = 218, views = '4.2K' }) {
  const [liked, setLiked] = useState(false)
  const likeCount = Number(likes) + (liked ? 1 : 0)
  return (
    <div className="x-actions">
      <span><ActionIcon id="reply" />{replies}</span>
      <span><ActionIcon id="repost" />{reposts}</span>
      <button
        type="button"
        className={liked ? 'is-liked' : undefined}
        aria-label="Like"
        aria-pressed={liked}
        onClick={() => setLiked((current) => !current)}
      >
        <ActionIcon id="like" filled={liked} />
        {likeCount}
      </button>
      <span><ActionIcon id="views" />{views}</span>
      <span className="x-actions__end"><ActionIcon id="bookmark" /><ActionIcon id="share" /></span>
    </div>
  )
}

const authors = {
  tola: { name: 'Tola Adebayo', handle: '@tola', tone: 'clay', initials: 'TA' },
  nia: { name: 'Nia Okeke', handle: '@niao', tone: 'blue', initials: 'NO' },
  ife: { name: 'Ife Danjuma', handle: '@ife', tone: 'sage', initials: 'ID' },
  kemi: { name: 'Kemi Bello', handle: '@kemi', tone: 'rust', initials: 'KB' },
  sade: { name: 'Sade Mensah', handle: '@sade', tone: 'sand', initials: 'SM' },
  emeka: { name: 'Emeka Nwosu', handle: '@emeka', tone: 'slate', initials: 'EN' },
}

const FEED_POSTS = [
  {
    id: 'tola-lagos',
    author: authors.tola,
    time: '2h',
    featured: true,
    text: 'Lagos teaches you to design for interruption. Nothing moves in a straight line, but everything still moves.',
    media: {
      src: '/images/social/lagos-in-motion.webp',
      alt: 'A busy Lagos street at golden hour seen from a moving danfo bus',
      duration: '00:18',
    },
    replies: 18,
    reposts: 62,
    likes: 412,
    views: '8.8K',
  },
  {
    id: 'nia-clarity',
    author: authors.nia,
    time: '4h',
    text: 'A quiet reminder: clarity is a feature, not the absence of features.',
    replies: 7,
    reposts: 21,
    likes: 146,
    views: '2.1K',
  },
  {
    id: 'ife-transit',
    author: authors.ife,
    time: '5h',
    text: 'Transit maps lie by being too clean. The real city is the delay between two stops.',
    media: {
      src: '/images/social/accra-night-transit.webp',
      alt: 'A busy Accra transit junction with minibuses and pedestrians at night',
      duration: '00:11',
    },
    replies: 23,
    reposts: 41,
    likes: 289,
    views: '5.4K',
  },
  {
    id: 'kemi-tutorial',
    author: authors.kemi,
    time: '6h',
    text: 'If the system needs a tutorial, the system is unfinished.',
    replies: 31,
    reposts: 88,
    likes: 640,
    views: '12K',
  },
  {
    id: 'sade-screens',
    author: authors.sade,
    time: '8h',
    text: 'Designers keep asking for more screens. Operators keep asking for fewer decisions. Guess which one the city actually runs on.',
    replies: 14,
    reposts: 37,
    likes: 198,
    views: '3.6K',
  },
  {
    id: 'emeka-bridge',
    author: authors.emeka,
    time: '11h',
    text: 'A bridge is a product. It has peak load, failure modes, and a queue you cannot hide with animation.',
    media: {
      src: '/images/social/third-mainland-bridge.webp',
      alt: 'Dense traffic crossing Lagos Third Mainland Bridge above the lagoon',
      duration: '00:24',
    },
    replies: 9,
    reposts: 54,
    likes: 371,
    views: '7.1K',
  },
  {
    id: 'tola-radio',
    author: authors.tola,
    time: '14h',
    text: 'I keep a list of interfaces that respect interruption: markets, danfo, radio. Almost none of them are apps.',
    replies: 22,
    reposts: 71,
    likes: 508,
    views: '9.4K',
  },
  {
    id: 'nia-whitespace',
    author: authors.nia,
    time: '18h',
    text: 'Whitespace is not empty. It’s where the next action lives.',
    replies: 4,
    reposts: 19,
    likes: 122,
    views: '1.8K',
  },
  {
    id: 'ife-rain',
    author: authors.ife,
    time: '1d',
    text: 'After rain, the city shows you its drainage logic. Most products never get that honest.',
    media: {
      src: '/images/social/abuja-after-rain.webp',
      alt: 'A wet Abuja street and open drainage channel after tropical rain',
      duration: '00:09',
    },
    replies: 11,
    reposts: 28,
    likes: 204,
    views: '4.0K',
  },
  {
    id: 'kemi-standing',
    author: authors.kemi,
    time: '1d',
    text: 'We keep shipping dashboards to people who work standing up.',
    replies: 16,
    reposts: 45,
    likes: 317,
    views: '6.2K',
  },
  {
    id: 'sade-wayfinding',
    author: authors.sade,
    time: '2d',
    text: 'A good wayfinding system apologizes by being unnecessary the second time.',
    replies: 8,
    reposts: 26,
    likes: 173,
    views: '2.9K',
  },
]

function FeedPost({ post, newPost = false, onAuthor }) {
  if (newPost) {
    return (
      <article className="x-post x-post--new">
        <button className="x-author-trigger" type="button" onClick={onAuthor} aria-label="Open Petkov profile"><Avatar tone="ink" initials="PC" /></button>
        <div className="x-post__body">
          <header><strong>Petkov Chakalov</strong><span>@petkov · now</span><b>•••</b></header>
          <p>The best interfaces don’t ask for attention. They return it.</p>
          <Actions replies="0" reposts="0" likes="1" views="1" />
        </div>
      </article>
    )
  }

  const { featured, author, time, text, media, replies, reposts, likes, views } = post
  return (
    <article className={`x-post${featured ? ' x-post--featured' : ''}`}>
      <button className="x-author-trigger" type="button" onClick={onAuthor} aria-label={`Open ${author.name} profile`}><Avatar tone={author.tone} initials={author.initials} /></button>
      <div className="x-post__body">
        <header><button className="x-author-name" type="button" onClick={onAuthor}>{author.name}</button><span>{author.handle} · {time}</span><b>•••</b></header>
        <p>{text}</p>
        {media ? (
          <div className={`x-post__media${media.variant ? ` x-post__media--${media.variant}` : ''}`}>
            {media.src ? <img src={media.src} alt={media.alt ?? ''} /> : null}
            {media.title ? <span>{media.title}<br /><em>{media.caption}</em></span> : null}
            <small>{media.duration}</small>
          </div>
        ) : null}
        <Actions replies={replies} reposts={reposts} likes={likes} views={views} />
      </div>
    </article>
  )
}

function Feed({ published = false, resetView = false, onCompose, onProfile }) {
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
      <header className="x-feed-head"><Avatar tone="ink" initials="PC" /><strong>𝕏</strong><button aria-label="Settings">⌁</button></header>
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

function ProfileCard({ expanded = false, onExpand, onDismiss }) {
  return (
    <div className={`x-profile-card${expanded ? ' is-expanded' : ''}`} onClick={(event) => event.stopPropagation()}>
      <div className="x-profile-card__cover"><span>TA</span></div>
      <div className="x-profile-card__identity"><Avatar tone="clay" initials="TA" /><button>•••</button></div>
      <h2>Tola Adebayo</h2><p className="x-handle">@tola</p>
      <p className="x-bio">Writer and product thinker. Notes on cities, technology, and the systems between them.</p>
      {expanded ? <p className="x-context">⌖ Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Joined 2021</p> : null}
      <div className="x-follow-count"><strong>486</strong> Following <strong>8.7K</strong> Followers</div>
      {expanded ? <div className="x-mutual"><Avatar tone="blue" initials="NO" /><span>Followed by Nia and 4 others</span></div> : null}
      <div className="x-profile-card__actions"><button type="button" onClick={expanded ? onDismiss : onExpand}>{expanded ? 'Back to feed' : 'View profile'}</button><button type="button">Follow</button></div>
    </div>
  )
}

function Composer({ ready = false, onCancel, onReady, onPublish }) {
  return (
    <div className="x-compose">
      <header><button type="button" onClick={onCancel}>Cancel</button><strong>New post</strong><button type="button" className={ready ? 'is-ready' : ''} onClick={ready ? onPublish : undefined}>Post</button></header>
      <main><Avatar tone="ink" initials="PC" /><div className="x-compose__field"><button type="button">Everyone⌄</button><button type="button" className={`x-compose__copy${ready ? ' has-copy' : ''}`} onClick={onReady}>{ready ? 'The best interfaces don’t ask for attention. They return it.' : 'What’s happening?'}</button><span>◎ Everyone can reply</span></div></main>
      <div className="x-compose__tools"><span>▧</span><span>◉</span><span>GIF</span><span>⌁</span><i /><b>{ready ? '48' : '280'}</b></div>
      <div className="x-keyboard"><div className="x-suggestions"><span>I</span><span>The</span><span>I’m</span></div>{['QWERTYUIOP','ASDFGHJKL','⇧ZXCVBNM⌫'].map((row) => <div key={row}>{[...row].map((key, index) => <button type="button" onClick={onReady} key={`${key}-${index}`}>{key}</button>)}</div>)}<div className="x-keyboard__last"><button type="button">123</button><button type="button" onClick={onReady}>space</button><button type="button" onClick={onReady}>return</button></div></div>
    </div>
  )
}

export default function SocialUI({ screen, onScreenChange = () => {} }) {
  const isSplash = screen === 'splash'
  const isProfile = screen === 'profile-peek' || screen === 'profile-expanded'
  const isCompose = screen === 'compose' || screen === 'compose-ready'
  const onScreenChangeRef = useRef(onScreenChange)
  onScreenChangeRef.current = onScreenChange

  useEffect(() => {
    if (!isSplash) return undefined
    const timer = window.setTimeout(() => onScreenChangeRef.current('feed'), SPLASH_MS)
    return () => window.clearTimeout(timer)
  }, [isSplash])

  return (
    <div className={`x-redesign${isSplash ? ' is-splash' : ''}`}>
      <div className="x-world">
        <StatusBar />
        {isCompose ? (
          <Composer
            ready={screen === 'compose-ready'}
            onCancel={() => onScreenChange('feed')}
            onReady={() => onScreenChange('compose-ready')}
            onPublish={() => onScreenChange('published')}
          />
        ) : (
          <Feed
            published={screen === 'published'}
            resetView={screen === 'feed'}
            onCompose={() => onScreenChange('compose')}
            onProfile={() => onScreenChange('profile-peek')}
          />
        )}
      </div>
      {isSplash ? (
        <Splash onEnter={() => onScreenChange('feed')} onDone={() => onScreenChange('feed')} />
      ) : null}
      {isProfile ? (
        <div className="x-profile-layer" onClick={() => onScreenChange('feed')}>
          <ProfileCard
            expanded={screen === 'profile-expanded'}
            onExpand={() => onScreenChange('profile-expanded')}
            onDismiss={() => onScreenChange('feed')}
          />
        </div>
      ) : null}
    </div>
  )
}

export { screens as socialScreens }
