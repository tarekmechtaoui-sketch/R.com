import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16">
            <div className="relative bg-cream dark:bg-charcoal-900 rounded-3xl overflow-hidden min-h-[420px] flex items-center">
                {/* Left Content */}
                <div className="relative z-10 flex-1 px-8 md:px-14 py-12">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-300">
                            50+ Premium Products
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-charcoal dark:text-white leading-none mb-6 text-balance">
                        Smart Living
                        <br />
                        Starts Here
                    </h1>

                    <p className="text-charcoal-500 dark:text-charcoal-300 text-base max-w-md leading-relaxed mb-8">
                        Discover premium mobile accessories designed for your lifestyle. From cases to smart gadgets — we have everything you need.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <Link
                            to="/products"
                            className="bg-charcoal dark:bg-white text-white dark:text-charcoal px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-charcoal-700 dark:hover:bg-charcoal-100 active:scale-95 transition-all duration-200"
                        >
                            Explore Products
                        </Link>
                        <Link
                            to="/products"
                            className="border-2 border-charcoal dark:border-charcoal-400 text-charcoal dark:text-charcoal-200 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-charcoal hover:text-white dark:hover:bg-charcoal-700 active:scale-95 transition-all duration-200"
                        >
                            About Us
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <div>
                            <p className="text-2xl font-black text-charcoal dark:text-white">500+</p>
                            <p className="text-xs text-charcoal-400 font-medium">Products</p>
                        </div>
                        <div className="w-px h-10 bg-charcoal-200 dark:bg-charcoal-700" />
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-charcoal-200 border-2 border-white dark:border-charcoal-900 flex items-center justify-center text-xs font-bold text-charcoal"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-charcoal dark:text-white">355+</p>
                                <p className="text-xs text-charcoal-400 font-medium">Happy Clients</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-charcoal-200 dark:bg-charcoal-700 hidden sm:block" />
                        <div className="hidden sm:block">
                            <p className="text-2xl font-black text-charcoal dark:text-white">4.8</p>
                            <p className="text-xs text-charcoal-400 font-medium">Market Rating</p>
                        </div>
                    </div>
                </div>

                {/* Right image */}
                <div className="hidden md:flex flex-1 items-center justify-center relative h-full min-h-[420px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-cream dark:from-charcoal-900 to-transparent z-10 w-24" />

                    <div className="rounded-2xl overflow-hidden drop-shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=90"
                            alt="Premium Earbuds"
                            className="w-80 h-80 object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
