const AUTHORS = {
  'Lead Engineer': {
    initials: 'LE',
    color: '#E8912D',
    nameColor: '#1264A3',
  },
  You: {
    initials: 'PC',
    color: '#3B82F6',
    nameColor: '#1264A3',
  },
}

const HIGHLIGHT_PHRASE = 'campaign is the real product'

function groupMessages(messages) {
  return messages.map((msg, i) => ({
    ...msg,
    showHeader: i === 0 || messages[i - 1].author !== msg.author,
    isHighlight: msg.lines.some((line) =>
      line.toLowerCase().includes(HIGHLIGHT_PHRASE),
    ),
  }))
}

function Avatar({ author }) {
  const meta = AUTHORS[author] ?? { initials: '?', color: '#868686' }

  return (
    <div
      className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
      style={{ backgroundColor: meta.color }}
      aria-hidden
    >
      {meta.initials}
    </div>
  )
}

function RailIcon({ children, active = false, badge }) {
  return (
    <div
      className={`relative flex h-7 w-7 items-center justify-center rounded-md ${
        active ? 'bg-[#1164A3] text-white' : 'text-[#ababad]'
      }`}
    >
      {children}
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#E01E5A] px-0.5 text-[8px] font-bold text-white">
          {badge}
        </span>
      )}
    </div>
  )
}

function SlackRail() {
  return (
    <aside
      className="hidden sm:flex w-11 shrink-0 flex-col items-center gap-1 border-r border-[#522653] bg-[#1A1D21] py-3"
      aria-hidden
    >
      <RailIcon active badge="1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 15a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
        </svg>
      </RailIcon>
      <RailIcon>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        </svg>
      </RailIcon>
      <div className="mt-auto pb-1">
        <Avatar author="You" />
      </div>
    </aside>
  )
}

function SlackSidebar({ channel }) {
  const channelName = channel.replace(/^#\s*/, '')

  return (
    <aside
      className="hidden md:flex w-44 shrink-0 flex-col bg-[#4A154B] text-[#d1d2d3]"
      aria-hidden
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-sm font-bold truncate">Clinify</span>
        <span className="text-[#ababad] text-sm leading-none">▾</span>
      </div>
      <div className="px-2 pb-2">
        <div className="rounded border border-[#522653] bg-[#350d36] px-2 py-1.5 text-xs text-[#ababad]">
          Search…
        </div>
      </div>
      <div className="px-3 pb-1.5 text-xs font-medium text-[#ababad]">Channels</div>
      <nav className="px-2 pb-3">
        <div className="flex items-center gap-1.5 rounded bg-[#1164A3]/90 px-2 py-1 text-[13px] font-medium text-white">
          <span className="opacity-80">#</span>
          <span className="truncate">{channelName}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 rounded px-2 py-1 text-[13px] text-[#cfcfcf]/65">
          <span className="opacity-60">#</span>
          <span className="truncate">engineering</span>
        </div>
      </nav>
    </aside>
  )
}

function ChannelHeader({ channel }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[#e8e8e8] bg-[#ffffff] px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate text-base font-bold text-[#1D1C1D]">{channel}</h2>
        <span className="text-[#ababad] text-sm">★</span>
      </div>
      <span className="rounded border border-[#e8e8e8] px-2 py-0.5 text-xs font-medium text-[#1D1C1D]">
        Messages
      </span>
    </header>
  )
}

function MessageRow({ msg }) {
  const meta = AUTHORS[msg.author] ?? { nameColor: '#1264A3' }

  return (
    <div
      className={`flex gap-2.5 px-4 ${
        msg.isHighlight
          ? 'border-l-2 border-[#1264A3] bg-[#f0f7ff]/80 pl-[calc(1rem-2px)]'
          : ''
      } ${msg.showHeader ? 'pt-2' : 'pl-[52px]'}`}
    >
      {msg.showHeader ? <Avatar author={msg.author} /> : null}
      <div className="min-w-0 flex-1 pb-1.5">
        {msg.showHeader && (
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-[13px] font-bold leading-none"
              style={{ color: meta.nameColor }}
            >
              {msg.author}
            </span>
            <span className="text-[11px] text-[#616061]">{msg.time}</span>
          </div>
        )}
        <div className="space-y-0.5">
          {msg.lines.map((line) => (
            <p
              key={line}
              className={`text-[13px] leading-[1.45] text-[#1D1C1D] ${
                line.toLowerCase().includes(HIGHLIGHT_PHRASE) ? 'font-semibold' : ''
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageList({ messages }) {
  const grouped = groupMessages(messages)

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#ffffff] overscroll-contain">
      <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-3 sticky top-0 z-[1]">
        <div className="h-px flex-1 bg-[#e8e8e8]" />
        <span className="shrink-0 rounded-full border border-[#e8e8e8] px-2.5 py-0.5 text-[11px] font-medium text-[#616061]">
          Today
        </span>
        <div className="h-px flex-1 bg-[#e8e8e8]" />
      </div>
      <div className="pb-3">
        {grouped.map((msg, i) => (
          <MessageRow key={`${msg.author}-${msg.time}-${i}`} msg={msg} />
        ))}
      </div>
    </div>
  )
}

function Composer({ channel }) {
  return (
    <div className="shrink-0 border-t border-[#e8e8e8] bg-[#ffffff] px-4 py-2.5" aria-hidden>
      <div className="rounded-md border border-[#868686]/50 bg-[#ffffff] px-3 py-2">
        <p className="text-[13px] text-[#ababad]">Message {channel}</p>
      </div>
    </div>
  )
}

export default function SlackThread({ channel = '# product-design', messages = [] }) {
  return (
    <div
      className="slack-thread-exhibit w-full bg-[#ffffff]"
      aria-label={`Slack thread: ${channel}`}
    >
      <div className="slack-thread-exhibit__window flex w-full min-h-[min(420px,55vh)] max-h-[min(680px,72vh)] overflow-hidden rounded-md border border-[#e8e8e8] shadow-sm">
        <SlackRail />
        <SlackSidebar channel={channel} />
        <main className="flex min-w-0 flex-1 flex-col bg-[#ffffff]">
          <ChannelHeader channel={channel} />
          <MessageList messages={messages} />
          <Composer channel={channel} />
        </main>
      </div>
    </div>
  )
}
