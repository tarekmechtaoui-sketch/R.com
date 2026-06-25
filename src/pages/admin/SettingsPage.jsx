import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useForm } from 'react-hook-form'
import { Globe, Store, Info } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { lang, setLanguage, t } = useLanguage()
  const [savingLang, setSavingLang] = useState(false)
  const [langSaved, setLangSaved] = useState(false)

  const handleLanguageChange = async (code) => {
    setSavingLang(true)
    await setLanguage(code)
    setSavingLang(false)
    setLangSaved(true)
    setTimeout(() => setLangSaved(false), 2000)
  }
  const { profile, refetchProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const profileForm = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
    },
  })

  const passwordForm = useForm()

  const handleProfileSave = async (data) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name })
        .eq('id', profile.id)
      if (error) throw error
      await refetchProfile()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error
      toast.success('Password updated!')
      passwordForm.reset()
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Settings" subtitle="Manage your account and store settings" />
        <main className="p-6 max-w-2xl space-y-6">

          {/* ── Website Language ── */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={18} className="text-charcoal-400" />
              <h2 className="font-bold text-lg text-charcoal dark:text-white">{t('settings.language')}</h2>
            </div>
            <p className="text-sm text-charcoal-400 mb-5">{t('settings.language_desc')}</p>
            <div className="flex flex-wrap gap-3">
              {[{code:'en',label:'English',flag:'🇬🇧'},{code:'fr',label:'Français',flag:'🇫🇷'},{code:'ar',label:'العربية',flag:'🇩🇿'}].map((l)=>(
                <button key={l.code} onClick={()=>handleLanguageChange(l.code)} disabled={savingLang}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${lang===l.code?'border-charcoal bg-charcoal text-white dark:border-white dark:bg-white dark:text-charcoal':'border-charcoal-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-300 hover:border-charcoal-400'}`}>
                  <span className="text-lg">{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
            {langSaved && <p className="text-xs text-green-500 mt-3 font-medium">✓ {t('settings.saved')}</p>}
          </div>

          {/* Profile Settings */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft p-6">
            <h2 className="font-bold text-charcoal dark:text-white mb-5 flex items-center gap-2">
              <Store size={18} /> Profile Settings
            </h2>
            <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  className="input-field opacity-60 cursor-not-allowed"
                  value={profile?.email || ''}
                  disabled
                />
                <p className="text-xs text-charcoal-400 mt-1">Email cannot be changed here</p>
              </div>
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input-field"
                  placeholder="Your name"
                  {...profileForm.register('full_name')}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <input
                  className="input-field opacity-60 cursor-not-allowed capitalize"
                  value={profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  disabled
                />
              </div>
              <Button type="submit" loading={saving}>
                Save Profile
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft p-6">
            <h2 className="font-bold text-charcoal dark:text-white mb-5 flex items-center gap-2">
              <Globe size={18} /> Change Password
            </h2>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  {...passwordForm.register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                  })}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  {...passwordForm.register('confirmPassword', { required: 'Please confirm' })}
                />
              </div>
              <Button type="submit" loading={changingPassword}>
                Update Password
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-charcoal-50 dark:bg-charcoal-800 rounded-2xl p-4 flex items-start gap-3">
            <Info size={16} className="text-charcoal-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-charcoal dark:text-white">Supabase Storage Setup</p>
              <p className="text-xs text-charcoal-400 mt-1">
                To enable product image uploads, create a storage bucket named <code className="bg-charcoal-200 dark:bg-charcoal-700 px-1 rounded">products</code> in your Supabase dashboard and set it as public. See <code>supabase/schema.sql</code> for the storage RLS policies.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
