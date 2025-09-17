import CompareTable from "../components/CompareTable"

const ComaprePage = () => {
  return (
    <div className='min-h-screen'>
      <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Compare</h1>
          <p className="mt-2 max-md:text-xs">Ideas, Inspiration & Expert Tips for Every Event</p>
        </div>
      </section>

      <section className='container'>
        <CompareTable />
      </section>
    </div>
  )
}

export default ComaprePage