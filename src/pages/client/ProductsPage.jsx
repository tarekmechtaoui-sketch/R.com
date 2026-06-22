import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../../components/ui/ProductCard'
import { CardSkeleton, PageLoader } from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { debounce } from '../../utils/helpers'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')

  const { products, loading, error } = useProducts({ categorySlug: selectedCategory, search })
  const { categories } = useCategories()

  // Stable debounced search — created once, never recreated on re-render
  const debouncedSetSearch = useMemo(() => debounce(setSearch, 400), [])

  // Sync search state → URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    setSearchParams(params)
  }, [search])

  const handleCategory = (slug) => {
    setSelectedCategory(slug)
    const params = new URLSearchParams(searchParams)
    if (slug !== 'all') params.set('category', slug)
    else params.delete('category')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setSelectedCategory('all')
    setSearchParams({})
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const hasFilters = search || selectedCategory !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-charcoal dark:text-white mb-2">
          All Products
        </h1>
        <p className="text-charcoal-400">
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl px-5 py-4 text-sm mb-6">
          Failed to load products. Please refresh the page.
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              debouncedSetSearch(e.target.value)
            }}
            placeholder="Search products..."
            className="input-field pl-10"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setSearch(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal px-4 py-2 rounded-xl border border-charcoal-200 hover:border-charcoal transition-all"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => handleCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
              : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 dark:bg-charcoal-700 dark:text-charcoal-300 dark:hover:bg-charcoal-600'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedCategory === cat.slug
                ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 dark:bg-charcoal-700 dark:text-charcoal-300 dark:hover:bg-charcoal-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          type="products"
          title="No products found"
          description={hasFilters ? 'Try adjusting your filters.' : 'No products are available yet.'}
          action={hasFilters && (
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
