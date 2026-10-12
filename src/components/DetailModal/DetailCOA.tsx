const ViewModal = ({ isOpen, onClose, account }) => {
    if (!isOpen || !account) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div className="z-10 w-4/5 max-w-md rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Detail Akun</h2>
                <div>
                    <p><strong>Kode Akun:</strong> {account.code}</p>
                    <p><strong>Nama Akun:</strong> {account.name}</p>
                    <p><strong>Tipe Akun:</strong> {account.type}</p>
                    <p>
                        <strong>Saldo:</strong>{" "}
                        {account.balance.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        })}
                    </p>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-300 px-4 py-2"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
