interface PengumumanProps {
  id?: string;
}

const Pengumuman: React.FC<PengumumanProps> = ({ id }) => {
    return (
      <section id={id} className="py-10">
        <h2 className="text-4xl text-gray-700 mb-6 font-poppins text-center font-semibold">Pengumuman</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl">Menyambut Ramadhan 1444 H</h3>
            <p className="text-gray-700 mt-2">Lorem ipsum dolor sit amet...</p>
            <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg">Read More</button>
          </div>
        </div>
      </section>
    );
  };
  
  export default Pengumuman;
  