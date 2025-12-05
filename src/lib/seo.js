
/**
 * Fetches SEO metadata for a page.
 * @param {string} type - 'static', 'category', 'subcategory'
 * @param {string} identifier - unique identifier or slug
 */
export async function getMetaData(type, identifier) {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // Default metadata fallback
    const defaults = {
        title: "Karyaa - The Ultimate Event Vendor Marketplace",
        description: "Find the best trusted vendors for your events in the UAE.",
        keywords: ["karyaa", "event management", "uae events", "vendors"],
        openGraph: {
            images: ['/logo.svg'],
        },
    };

    try {
        let url = "";
        if (type === "static") {
            url = `${SERVER_URL}/api/v1/admin/seo/static/public/${identifier}`;
        } else if (type === "category") {
            // Assuming public category API handles slug
            url = `${SERVER_URL}/api/v1/categories/${identifier}`;
        } else if (type === "subcategory") {
            url = `${SERVER_URL}/api/v1/subcategories/${identifier}`;
        }

        const res = await fetch(url, { next: { revalidate: 60 } }); // Revalidate every 60s
        if (!res.ok) return defaults;

        const json = await res.json();

        let seoData = null;
        if (type === "static") {
            seoData = json.data; // PageSEO object
        } else if (type === "category") {
            seoData = json.category; // Category object
        } else if (type === "subcategory") {
            seoData = json.subcategory; // SubCategory object
        }

        if (!seoData) return defaults;

        return {
            title: seoData.metaTitle || defaults.title,
            description: seoData.metaDescription || defaults.description,
            keywords: (seoData.metaKeywords && seoData.metaKeywords.length > 0) ? seoData.metaKeywords : defaults.keywords,
            openGraph: {
                title: seoData.metaTitle || defaults.title,
                description: seoData.metaDescription || defaults.description,
                images: seoData.ogImage ? [seoData.ogImage] : (type === 'static' ? defaults.openGraph.images : [seoData.coverImage]),
            },
        };

    } catch (error) {
        console.error(`Failed to fetch SEO for ${type}/${identifier}:`, error);
        return defaults;
    }
}
