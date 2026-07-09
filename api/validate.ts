import { createHmac } from 'crypto'

type ValidateResult = {
  valid: boolean
  allowed: boolean
  chatId?: number
  chatType?: string
  chatTitle?: string
  userId?: number
  error?: string
}

function parseInitData(initData: string): Map<string, string> {
  const params = new URLSearchParams(initData)
  const map = new Map<string, string>()
  for (const [key, value] of params.entries()) {
    map.set(key, value)
  }
  return map
}

function validateHmac(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return false

  params.delete('hash')
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  return computedHash === hash
}

function parseAllowedChatIds(envValue: string | undefined): number[] {
  if (!envValue) return []
  return envValue
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n))
}

export default function handler(req: { method?: string; body?: { initData?: string } }, res: {
  status: (code: number) => { json: (data: ValidateResult) => void }
  setHeader: (key: string, value: string) => void
}) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).json({ valid: true, allowed: true })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ valid: false, allowed: false, error: 'Method not allowed' })
    return
  }

  const botToken = process.env.BOT_TOKEN
  if (!botToken) {
    res.status(500).json({ valid: false, allowed: false, error: 'BOT_TOKEN not configured' })
    return
  }

  const initData = req.body?.initData
  if (!initData || typeof initData !== 'string') {
    res.status(400).json({ valid: false, allowed: false, error: 'Missing initData' })
    return
  }

  const isValid = validateHmac(initData, botToken)
  if (!isValid) {
    res.status(403).json({ valid: false, allowed: false, error: 'Invalid signature' })
    return
  }

  const params = parseInitData(initData)

  const authDate = Number(params.get('auth_date'))
  if (isNaN(authDate) || Date.now() / 1000 - authDate > 300) {
    res.status(403).json({ valid: false, allowed: false, error: 'Expired initData' })
    return
  }

  const chatStr = params.get('chat')
  const userStr = params.get('user')

  let chatId: number | undefined
  let chatType: string | undefined
  let chatTitle: string | undefined
  let userId: number | undefined

  if (chatStr) {
    try {
      const chat = JSON.parse(chatStr)
      chatId = chat.id
      chatType = chat.type
      chatTitle = chat.title
    } catch {
      // ignore parse error
    }
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      userId = user.id
    } catch {
      // ignore parse error
    }
  }

  const allowedChatIds = parseAllowedChatIds(process.env.ALLOWED_CHAT_IDS)

  if (allowedChatIds.length === 0) {
    res.status(200).json({ valid: true, allowed: true, chatId, chatType, chatTitle, userId })
    return
  }

  const allowed = chatId != null && allowedChatIds.includes(chatId)

  res.status(200).json({
    valid: true,
    allowed,
    chatId,
    chatType,
    chatTitle,
    userId,
  })
}