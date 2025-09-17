import Image from "next/image";

const IdeaPage = ({ params }) => {
    const { idea } = params;

    const ideaPost = {
        id: 1,
        image: "/blog-2.webp",
        author: "Sarah Martinez",
        date: "Dec 15, 2024",
        title: "Rustic Boho Wedding Under the Stars",
        category: "Wedding",
        readTime: "5 min read",
        content: `Planning a rustic boho wedding under the stars? This enchanting theme combines earthy elegance with celestial magic to create an unforgettable celebration. Here's everything you need to know to bring this dreamy vision to life.

🌟 Setting the Scene: Location & Timing
Choose an outdoor venue with minimal light pollution for the best stargazing experience. Vineyards, farms, or countryside estates work perfectly. Plan your ceremony for golden hour and reception under the night sky.

Pro Tip: Check the lunar calendar and plan around a new moon for optimal star visibility!

🌿 Natural Elements & Textures
Incorporate natural materials like:
• Wooden ceremony arches adorned with eucalyptus and pampas grass
• Burlap table runners with lace overlays  
• Mason jar centerpieces with wildflowers
• Vintage wooden signage with calligraphy

✨ Lighting Magic
The key to this theme is layered, warm lighting:
• String lights creating a canopy effect
• Lanterns hanging from tree branches
• Candles in vintage brass holders
• Fire bowls or a cozy bonfire for late-night warmth

🎨 Color Palette Perfection
Embrace earthy, muted tones:
• Sage green and dusty rose
• Cream and champagne
• Terracotta and burnt orange
• Deep navy for night sky accents

👗 Attire & Style
Brides should consider:
• Flowing, bohemian silhouettes with lace details
• Flower crowns or loose, romantic hairstyles
• Barefoot or strappy sandals

Grooms can opt for:
• Linen or tweed suits in earth tones
• Suspenders and bow ties
• Brown leather shoes or boots

🍽️ Farm-to-Table Dining
Complete the experience with:
• Family-style dining on long wooden tables
• Seasonal, locally-sourced menu
• Signature cocktails served in vintage glassware
• Late-night s'mores station by the fire

This magical combination of rustic charm and celestial beauty will create memories that last a lifetime!`,
        slug: "rustic-boho-wedding-under-stars",
        tags: ["Wedding", "Outdoor", "Boho", "Rustic", "Celestial"]
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="!mt-8 mb-16 space-y-7">
                <div>
                    <span className="font-medium uppercase text-primary text-[11px] md:text-sm tracking-widest">
                        Ideas / {ideaPost.category} / {idea.replace(/-/g, ' ')}
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4 capitalize">
                        {idea.replace(/-/g, ' ')}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="max-md:text-xs">By {ideaPost.author}</span>
                        <span className="max-md:text-xs">Published on {ideaPost.date}</span>
                    </div>
                </div>

                <div>
                    <Image
                        src={ideaPost.image}
                        alt={ideaPost.title}
                        width={800}
                        height={450}
                        className="w-full h-80 md:h-[450px] object-cover rounded-lg"
                    />
                </div>

                <div className="prose prose-lg max-w-none">
                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                        {ideaPost.content}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default IdeaPage;