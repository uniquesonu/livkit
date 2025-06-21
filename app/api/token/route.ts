import { NextResponse } from "next/server"
import { AccessToken } from "livekit-server-sdk"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, room } = body

  // Replace these with your actual LiveKit Cloud credentials
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  const at = new AccessToken(apiKey, apiSecret, {
    identity: name,
  })
  at.addGrant({ roomJoin: true, room })

  const token = await at.toJwt()
  return NextResponse.json({ token })
}
