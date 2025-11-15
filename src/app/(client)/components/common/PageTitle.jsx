
function PageTitle({ imgUrl, title, tagline }) {
    return (
        <section 
            className="!m-0 bg-cover bg-center h-64 md:h-[360px] flex-center relative px-4"
            style={{ backgroundImage: `url(${imgUrl || "/new-banner-3.jpg"})` }}
        >
            <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
            <div className="relative z-10 text-white text-center">
                <h1 className="!text-white !text-4xl lg:!text-[65px]">{title}</h1>
                {tagline && (
                    <p className="mt-2 max-md:text-xs">{tagline}</p>
                )}
            </div>
        </section>
    )
}

export default PageTitle
