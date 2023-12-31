import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDesign, editDesign } from "../../features/localDesignSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "react-modal";

function DesignsForm() {
  const [design, setDesign] = useState({
    name: "",
    image: null,
  });

  const [initialDesign, setInitialDesign] = useState(null);
  const params = useParams();
  const designs = useSelector((state) => state.designs.designs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      const designToEdit = designs.find(
        (design) => design.id === Number(params.id)
      );
      if (designToEdit) {
        setInitialDesign(designToEdit);
        setDesign(designToEdit);
      }
    }
  }, [params.id, designs]);

  const handleChange = (e) => {
    setDesign({
      ...design,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesign({
        ...design,
        image: file,
      });
    }
  };

  const getNextDesignId = () => {
    const productIds = designs.map((design) => design.id);
    const maxId = Math.max(...productIds);
    return maxId + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!design.name || !design.image) {
      setErrors({
        name: !design.name ? "Campo obligatorio" : "",
        image: !design.image ? "Campo obligatorio" : "",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      if (params.id) {
        await dispatch(
          editDesign({ id: Number(params.id), designData: design })
        );
      } else {
        await dispatch(
          addDesign({
            ...design,
            id: getNextDesignId(),
          })
        );
      }
      setRequestStatus("succeeded");
    } catch (error) {
      setRequestStatus("failed");
    }
  };

  useEffect(() => {
    if (requestStatus === "succeeded") {
      navigate("/tee-designer-admin");
    }
  }, [requestStatus, navigate]);

  return (
    <>
      <div>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
            <h1 className="text-center text-3xl font-light text-darkiblue">
              {params.id ? "Editar Diseño" : "Agregar Diseño"}
            </h1>
            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre del diseño"
                      value={design.name}
                      onChange={handleChange}
                      className={`text-sm sm:text-base placeholder-gray-500 pl-2 pr-4 rounded-lg border ${
                        errors.name ? "border-red-500" : "border-gray-400"
                      } w-full py-2`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="flex flex-col mb-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      onChange={(e) => handleImageChange(e)}
                    />
                    <div
                      role="button"
                      tabIndex="0"
                      className="cursor-pointer w-full px-4 py-2 border border-gray-400 rounded-md bg-white hover:bg-gray-100 text-gray-800"
                    >
                      <span className="inline-block mr-2">
                        <svg
                          className="w-5 h-5 text-gray-600 pt-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </span>
                      Escoger imagen
                    </div>
                    <span className="pl-1 text-xs text-gray-600">
                      {design.image
                        ? "Imagen: " + design.image.name
                        : "No se ha seleccionado una imagen"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-x-2">
                  <button className="bg-mainblue hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-md">
                    Guardar Diseño
                  </button>
                  <Link
                    to={"/tee-designer-admin"}
                    className="bg-summer text-darkiblue hover:bg-summerhovered transition font-bold px-2 py-1 rounded-md"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirmation Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-black opacity-90 absolute inset-0"></div>
        <div className="bg-white p-6 rounded-md shadow-md text-center relative">
          <p className="mb-4">
            ¿Estás seguro de que deseas guardar los cambios?
          </p>
          <button
            className="bg-mainblue hover:bg-blue-700 text-white px-3 py-1 rounded-md mt-3 mr-2"
            onClick={handleConfirm}
          >
            Sí, guardar
          </button>
          <button
            className="bg-summer text-darkiblue hover:bg-summerhovered transition px-3 py-1 rounded-md mt-3"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
}

export default DesignsForm;
