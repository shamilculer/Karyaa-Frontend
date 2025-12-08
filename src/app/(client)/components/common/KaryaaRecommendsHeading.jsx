import { getContentByKeyAction } from "@/app/actions/admin/pages";

/**
 * Server component to fetch the Karyaa Recommends heading from the database
 * Falls back to "KARYAA Recommends" if no custom heading is set
 */
export default async function KaryaaRecommendsHeading() {
    try {
        const result = await getContentByKeyAction("karyaa-recommends-heading");

        if (result.success && result.data?.content) {
            const parsedContent = typeof result.data.content === 'string'
                ? JSON.parse(result.data.content)
                : result.data.content;

            const heading = parsedContent?.heading;

            if (heading && heading.trim()) {
                return <h2 className="uppercase">{heading}</h2>;
            }
        }
    } catch (error) {
        console.error("Error fetching Karyaa Recommends heading:", error);
    }

    // Fallback to default heading
    return <h2 className="uppercase">KARYAA Recommends</h2>;
}
