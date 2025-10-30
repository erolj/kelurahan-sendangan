'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Users, Home, Mail, Phone, MapPin, Save } from 'lucide-react'

interface Settings {
  totalJiwa?: string
  jumlahKK?: string
  lakiLaki?: string
  perempuan?: string
  alamat?: string
  telp?: string
  email?: string
  website?: string
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({})
  const [formData, setFormData] = useState<Settings>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      setSettings(data)
      setFormData(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save settings')

      const data = await res.json()
      setSettings(data)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key: keyof Settings, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage website settings and information</p>
      </div>

      <Tabs defaultValue="population" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="population">
            <Users className="w-4 h-4 mr-2" />
            Population Data
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Home className="w-4 h-4 mr-2" />
            Contact Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="population" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Kependudukan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalJiwa">Total Jiwa</Label>
                  <Input
                    id="totalJiwa"
                    type="text"
                    value={formData.totalJiwa || ''}
                    onChange={(e) => updateField('totalJiwa', e.target.value)}
                    placeholder="6.120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jumlahKK">Jumlah KK</Label>
                  <Input
                    id="jumlahKK"
                    type="text"
                    value={formData.jumlahKK || ''}
                    onChange={(e) => updateField('jumlahKK', e.target.value)}
                    placeholder="1.845"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lakiLaki">Laki-laki</Label>
                  <Input
                    id="lakiLaki"
                    type="text"
                    value={formData.lakiLaki || ''}
                    onChange={(e) => updateField('lakiLaki', e.target.value)}
                    placeholder="3.080"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perempuan">Perempuan</Label>
                  <Input
                    id="perempuan"
                    type="text"
                    value={formData.perempuan || ''}
                    onChange={(e) => updateField('perempuan', e.target.value)}
                    placeholder="3.040"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Population Data'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFormData(settings)}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Alamat
                </Label>
                <Input
                  id="alamat"
                  type="text"
                  value={formData.alamat || ''}
                  onChange={(e) => updateField('alamat', e.target.value)}
                  placeholder="Jl. Raya Sendangan, Kec. Kawangkoan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telp">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telepon
                </Label>
                <Input
                  id="telp"
                  type="text"
                  value={formData.telp || ''}
                  onChange={(e) => updateField('telp', e.target.value)}
                  placeholder="(0431) 123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="kelurahan.sendangan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://sendangan.example.com"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFormData(settings)}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
