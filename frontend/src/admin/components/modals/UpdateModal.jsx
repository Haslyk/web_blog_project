import axiosInstance, { fetchCsrfToken } from "../../middleware/axios";
import React, { useState, useEffect } from "react";
import Notify from "./Notify";

const UpdateModal = ({ data, id, onUpdate }) => {
  const [notify, setNotify] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const [formData, setFormData] = useState({
    id: data.id,
    file: data.image,
    title: data.title,
    text: data.text,
  });

  const [preview, setPreview] = useState(`${process.env.REACT_APP_API_URL}/${data.image}`);

  useEffect(() => {
    const getToken = async () => {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
    };
    getToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
    setPreview(URL.createObjectURL(file));
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", data.id);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("text", formData.text);

      setNotify(true);

      await axiosInstance.post(
        `/data/update${capitalizeFirstLetter(id.split("-")[0])}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`modal fade`}
      id={`${id}`}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      {notify && <Notify message={"Güncellendi"} />}
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Güncelle
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Kapak Resmi
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                />
                {preview && (
                  <div className="mt-3 d-flex justify-center items-center">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Başlık
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Açıklama
                </label>
                <textarea
                  className="form-control"
                  id="text"
                  name="text"
                  rows="3"
                  value={formData.text}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Kaydet
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
