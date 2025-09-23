import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AdminService from "../Service/AdminService";

function ManageCategory() {
  const [refresh, setRefresh] = useState(0);
  const [dbdata, setDbdata] = useState([]);
  const [msg, setMsg] = useState("");
  const [category, setCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    AdminService.showCategories()
      .then((result) => setDbdata(result.data))
      .catch((err) => console.log(err));
  }, [refresh]);

  // ✅ Add Category
  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = category.trim();
    if (!trimmed) {
      setMsg("⚠️ Category name is required!");
      setTimeout(() => setMsg(""), 4000);
      return;
    }

    AdminService.saveCategory({ category: trimmed })
      .then((res) => {
        if (res.data === "ER_DUP_ENTRY") {
          setMsg("⚠️ This Category Already Exists!");
        } else {
          setRefresh((prev) => prev + 1);
        }
        setTimeout(() => setMsg(""), 4000);
      })
      .catch((err) => console.log(err));

    setCategory("");
  };

  // ✅ Delete with SweetAlert
  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete "${name}" Category?`,
      html: `<p class="text-danger fw-bold">⚠ If you delete this category, <br/> all related products will also be permanently deleted!</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      backdrop: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        AdminService.deleteCategory(id)
          .then(() => {
            setRefresh((prev) => prev + 1);
            Swal.fire({
              title: "Deleted!",
              text: `"${name}" and its products have been removed.`,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((err) => console.log(err));
      }
    });
  };

  // ✅ Edit Category
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditCategory(dbdata[index].name);
  };

  const handleSave = (id) => {
    if (!editCategory.trim()) {
      setMsg("⚠️ Category name cannot be empty!");
      setTimeout(() => setMsg(""), 4000);
      return;
    }

    AdminService.updateCategory(editCategory.trim(), id)
      .then(() => setRefresh((prev) => prev + 1))
      .catch((err) => console.log(err));

    setEditIndex(null);
    setEditCategory("");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h3 className="text-center text-primary mb-4 fw-bold">
          <i className="bi bi-tags-fill me-2"></i> Manage Categories
        </h3>

        {/* Add Category */}
        <form
          onSubmit={handleAdd}
          className="d-flex gap-2 mb-4 justify-content-center"
        >
          <input
            type="text"
            className="form-control w-50 rounded-3 shadow-sm"
            placeholder="Enter Category Name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-success rounded-3 shadow-sm px-4"
            style={{ height: "3rem" }}
          >
            <i className="bi bi-plus-circle me-1"></i> Add
          </button>
        </form>
        {msg && (
          <div className="alert alert-warning text-center py-2 shadow-sm rounded-3">
            {msg}
          </div>
        )}

        {/* Show Categories */}
        {dbdata.length === 0 ? (
          <p className="text-muted text-center">
            No categories yet. <strong>Add New Categories...</strong>
          </p>
        ) : (
          <div className="row g-3">
            {dbdata.map((cat, index) => (
              <div key={cat.id} className="col-md-4" >
                <div className="card border-0 shadow-sm rounded-4 h-100 hover-shadow">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    {editIndex === index ? (
                      <div className="w-100">
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="form-control mb-2 rounded-3"
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary w-50 rounded-3"
                            onClick={() => handleSave(cat.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary w-50 rounded-3"
                            onClick={() => setEditIndex(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h6 className="fw-bold mb-0">{cat.name}</h6>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-warning me-2 rounded-3"
                            onClick={() => handleEdit(index)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-3"
                            onClick={() => handleDelete(cat.id, cat.name)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCategory;
