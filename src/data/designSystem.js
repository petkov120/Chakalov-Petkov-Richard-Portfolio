export const auroraSystem = {
  palette: [
    { name: 'Teal',    hex: '#00d4ff', role: 'Primary accent · links · focus' },
    { name: 'Green',   hex: '#00e5b0', role: 'Success · gradient endpoint' },
    { name: 'Blue',    hex: '#5b8fff', role: 'Running badge · AI states' },
    { name: 'Purple',  hex: '#a855f7', role: 'Admin accent · AI-tagged' },
    { name: 'Magenta', hex: '#e040fb', role: 'Decorative · shimmer only' },
    { name: 'Pink',    hex: '#ff4d9e', role: 'Decorative · shimmer only' },
  ],

  semantic: [
    { name: 'Success', hex: '#00e5b0' },
    { name: 'Warning', hex: '#ffb300' },
    { name: 'Error',   hex: '#ff5272' },
    { name: 'Accent',  hex: '#00d4ff' },
  ],

  statusPills: [
    { label: 'Success', color: '#00e5b0', bg: 'rgba(0,229,176,0.1)',   border: 'rgba(0,229,176,0.3)',   meaning: 'Completed' },
    { label: 'Running', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.3)',   meaning: 'In progress' },
    { label: 'Warning', color: '#ffb300', bg: 'rgba(255,179,0,0.1)',   border: 'rgba(255,179,0,0.3)',   meaning: 'Needs review' },
    { label: 'Error',   color: '#ff5272', bg: 'rgba(255,82,114,0.1)',  border: 'rgba(255,82,114,0.3)',  meaning: 'Failed' },
    { label: 'Idle',    color: '#7a8aaa', bg: 'rgba(122,138,170,0.1)', border: 'rgba(122,138,170,0.3)', meaning: 'Not started' },
    { label: 'AI',      color: '#a855f7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)',  meaning: 'AI-tagged' },
  ],

  callStates: [
    { state: 'Connecting',  color: '#3b82f6', meaning: 'Initiating via Twilio' },
    { state: 'Ringing',     color: '#f59e0b', meaning: 'Member device ringing' },
    { state: 'Active',      color: '#22c55e', meaning: 'Live call · timer running' },
    { state: 'Completed',   color: '#6b7280', meaning: 'Finished · auto-close 3s' },
    { state: 'Failed',      color: '#ef4444', meaning: 'Call failed · auto-close 3s' },
    { state: 'Unfinished',  color: '#f97316', meaning: 'Incomplete · needs follow-up' },
    { state: 'Rescheduled', color: '#3b82f6', meaning: 'Deferred · clock shown' },
  ],
}
