import { useState } from 'react'
import { authors } from '../data/authors'
import ActionIcon from '../icons/ActionIcon'
import Avatar from './Avatar'

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

export default function FeedPost({ post, newPost = false, onAuthor }) {
  if (newPost) {
    return (
      <article className="x-post x-post--new">
        <button className="x-author-trigger" type="button" onClick={() => onAuthor(authors.petkov)} aria-label="Open Petkov profile"><Avatar tone="ink" initials="PC" /></button>
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
      <button className="x-author-trigger" type="button" onClick={() => onAuthor(author)} aria-label={`Open ${author.name} profile`}><Avatar tone={author.tone} initials={author.initials} /></button>
      <div className="x-post__body">
        <header><button className="x-author-name" type="button" onClick={() => onAuthor(author)}>{author.name}</button><span>{author.handle} · {time}</span><b>•••</b></header>
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
