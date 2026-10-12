import JadwalSholat from "./JadwalSholat";

interface BannerProps {
    id?: string;
}

const Banner: React.FC<BannerProps> = ({ id }) => {
    return (
        <section
            id={id}
            className="relative text-center"
            style={{ height: "105vh" }}
        >
            <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out"
  style={{
    backgroundImage: "url('/images/landingpage/masjid1.jpg')",
    height: "100vh", // Tinggi penuh layar
    zIndex: -1,
  }}
>

            <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                <h1 className="text-shadow transform text-2xl font-bold text-white transition-transform duration-300 ease-in-out hover:scale-110 sm:text-xl md:text-4xl lg:text-5xl xl:text-6xl">
                    MASJID TERCODE
                </h1>
            </div>

            <div className="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 translate-y-1/2 transform px-4 sm:w-[90%] md:w-[70%] lg:w-[50%]">
                <JadwalSholat />
            </div>
            </div>
        </section>
    );
};

export default Banner;
