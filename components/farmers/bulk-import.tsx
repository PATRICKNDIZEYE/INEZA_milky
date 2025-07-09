'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BulkImportProps {
  onClose: () => void
  onSuccess: () => void
}

export function BulkImport({ onClose, onSuccess }: BulkImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Phone', 'Email', 'Location', 'Address', 'Bank Name', 'Account Number', 'Account Name', 'Price Per L', 'Collection Center Code'],
      ['John Doe', '+250788123456', 'john@example.com', 'Kigali', '123 Main St', 'Bank of Kigali', '1234567890', 'John Doe', '300', 'CC001'],
      ['Jane Smith', '+250788654321', 'jane@example.com', 'Musanze', '456 Oak Ave', 'Equity Bank', '0987654321', 'Jane Smith', '320', 'CC002']
    ]

    const csvContent = template.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'farmers-template.csv'
    a.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file to import')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/farmers/bulk-import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Successfully imported ${result.imported} farmers`)
        if (result.errors.length > 0) {
          toast.error(`${result.errors.length} rows had errors`)
        }
        onSuccess()
      } else {
        toast.error(result.error || 'Import failed')
      }
    } catch (error) {
      toast.error('An error occurred during import')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Import Farmers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Template Required</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Download the CSV template and fill in your farmer data before importing.
            </p>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Select CSV File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
              className="bg-sky-500 hover:bg-sky-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Farmers
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}