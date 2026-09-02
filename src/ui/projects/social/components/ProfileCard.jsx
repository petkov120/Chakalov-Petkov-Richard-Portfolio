import { authors } from '../data/authors'
import Avatar from './Avatar'

export default function ProfileCard({ author = authors.tola, onDismiss }) {
  return (
    <div className="x-profile-card" onClick={(event) => event.stopPropagation()}>
      <div className="x-profile-card__cover"><span>{author.initials}</span></div>
      <div className="x-profile-card__identity"><Avatar tone={author.tone} initials={author.initials} /><button>•••</button></div>
      <h2>{author.name}</h2><p className="x-handle">{author.handle}</p>
      <p className="x-bio">Writer and product thinker. Notes on cities, technology, and the systems between them.</p>
      <p className="x-context">⌖ Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Joined 2021</p>
      <div className="x-follow-count"><strong>486</strong> Following <strong>8.7K</strong> Followers</div>
      <div className="x-mutual"><Avatar tone="blue" initials="NO" /><span>Followed by Nia and 4 others</span></div>
      <div className="x-profile-card__actions"><button type="button" onClick={onDismiss}>Back to feed</button><button type="button">Follow</button></div>
    </div>
  )
}
