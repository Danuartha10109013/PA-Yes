<ReusableModal
  isOpen={showFormModal}
  onClose={() => setShowFormModal(false)}
  title={isEdit ? "Edit Kontak" : "Tambah Kontak"}
  onSubmit={handleFormSubmit}
  submitLabel="Simpan"
>
  <div className="space-y-4">
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Nama"
      className="w-full border border-gray-300 px-3 py-2 rounded"
    />
    {/* Add other fields here */}
  </div>
</ReusableModal>
