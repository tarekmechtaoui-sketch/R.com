/**
 * Format price in DZD (Algerian Dinar)
 */
export const formatPrice = (price) => {
  if (price == null) return '—'
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' DA'
}

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Truncate text to given length
 */
export const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '…' : text
}

/**
 * Generate a slug from a name
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Get the first image from a product images array
 */
export const getProductImage = (images) => {
  if (!images || images.length === 0) return null
  return images[0]
}

/**
 * Calculate cart total
 */
export const calcCartTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * Calculate cart item count
 */
export const calcCartCount = (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Merge class names (clsx + tailwind-merge)
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
