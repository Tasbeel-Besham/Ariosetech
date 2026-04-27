import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  // Test if the preset is valid by calling Cloudinary's upload endpoint
  // with a tiny 1x1 transparent PNG (base64) — doesn't save anything real
  let presetStatus = 'not tested'
  if (cloudName && uploadPreset) {
    try {
      // 1x1 white pixel PNG, base64
      const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg=='
      const fd = new FormData()
      fd.append('file', testImage)
      fd.append('upload_preset', uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: fd }
      )
      const data = await res.json()

      if (res.ok) {
        presetStatus = `✓ WORKING — upload successful (public_id: ${data.public_id})`
      } else {
        const msg = data?.error?.message || JSON.stringify(data)
        presetStatus = `✗ FAILED — ${msg}`
        if (msg.includes('unsigned')) {
          presetStatus += ' → Your preset is SIGNED. Change it to UNSIGNED in Cloudinary Dashboard'
        }
        if (msg.includes('Unknown API key') || msg.includes('preset')) {
          presetStatus += ` → Preset "${uploadPreset}" does not exist. Create it in Cloudinary → Settings → Upload → Add Preset`
        }
      }
    } catch (e) {
      presetStatus = `✗ Network error — ${String(e)}`
    }
  }

  return NextResponse.json({
    status: presetStatus.startsWith('✓') ? 'ready' : 'error',
    cloudinary: {
      cloud_name:     cloudName     ? `✓ ${cloudName}`     : '✗ NOT SET',
      upload_preset:  uploadPreset  ? `✓ ${uploadPreset}`  : '✗ NOT SET',
      preset_test:    presetStatus,
    },
    imgbb: {
      api_key: process.env.IMGBB_API_KEY ? '✓ set' : '✗ not set',
    },
    fix: presetStatus.startsWith('✓') ? 'Everything is configured correctly!' : [
      '1. Go to cloudinary.com → Settings (⚙️) → Upload tab',
      '2. Scroll to "Upload Presets" → click "Add upload preset"',
      '3. Set Preset name: ariosetech_upload',
      '4. Change Signing Mode to: Unsigned',
      '5. Click Save',
      '6. Go to Vercel → Project → Settings → Environment Variables',
      `7. Change CLOUDINARY_UPLOAD_PRESET to: ariosetech_upload`,
      '8. Redeploy the project',
    ],
  })
}
