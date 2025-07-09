import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'File must contain header and at least one data row' }, { status: 400 })
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const dataLines = lines.slice(1)

    const results = {
      imported: 0,
      errors: [] as string[]
    }

    // Get collection centers for validation
    const collectionCenters = await prisma.collectionCenter.findMany()
    const centerMap = new Map(collectionCenters.map(c => [c.code, c.id]))

    // Get last farmer ID for auto-increment
    const lastFarmer = await prisma.farmer.findFirst({
      orderBy: { farmerId: 'desc' }
    })
    
    let nextId = 1
    if (lastFarmer) {
      const lastIdNum = parseInt(lastFarmer.farmerId.replace('F', ''))
      nextId = lastIdNum + 1
    }

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i]
      const values = line.split(',').map(v => v.trim())
      
      try {
        const [name, phone, email, location, address, bankName, accountNumber, accountName, pricePerL, collectionCenterCode] = values

        if (!name || !phone || !location || !collectionCenterCode) {
          results.errors.push(`Row ${i + 2}: Missing required fields`)
          continue
        }

        const collectionCenterId = centerMap.get(collectionCenterCode)
        if (!collectionCenterId) {
          results.errors.push(`Row ${i + 2}: Invalid collection center code: ${collectionCenterCode}`)
          continue
        }

        const farmerId = `F${nextId.toString().padStart(4, '0')}`
        nextId++

        await prisma.farmer.create({
          data: {
            farmerId,
            name,
            phone,
            email: email || null,
            location,
            address: address || null,
            bankName: bankName || null,
            accountNumber: accountNumber || null,
            accountName: accountName || null,
            pricePerL: pricePerL ? parseFloat(pricePerL) : 300,
            collectionCenterId,
            isActive: true
          }
        })

        results.imported++
      } catch (error) {
        results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Log activity
    await logActivity(userId, 'BULK_IMPORT', 'farmer', null, { imported: results.imported, errors: results.errors.length }, request)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Bulk import failed:', error)
    return NextResponse.json(
      { error: 'Bulk import failed' },
      { status: 500 }
    )
  }
}