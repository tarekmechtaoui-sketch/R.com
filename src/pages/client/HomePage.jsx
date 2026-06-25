import { useEffect } from 'react'
import Hero from '../../components/home/Hero'
import PromoBanner from '../../components/home/PromoBanner'
import BestSellers from '../../components/home/BestSellers'
import CategoriesSection from '../../components/home/CategoriesSection'
import BrandsSection from '../../components/home/BrandsSection'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useBrands } from '../../hooks/useBrands'

export default function HomePage() {
  const { products: featured, loading: loadingProducts } = useProducts({ featured: true, limit: 8 })
  const { categories, loading: loadingCategories } = useCategories()
  const { brands, loading: loadingBrands } = useBrands()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="animate-fade-in">
      <Hero />
      <CategoriesSection categories={categories} loading={loadingCategories} />
      <PromoBanner />
      <BrandsSection brands={brands} loading={loadingBrands} />
      <BestSellers products={featured} loading={loadingProducts} />
    </div>
  )
}
