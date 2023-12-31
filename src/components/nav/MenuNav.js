import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { Link } from "react-router-dom";
import { deleteTshirt } from "../../features/tshirtSlice";
import { clearSelectedProducts } from "../../features/purchaseSlice";
import logo from "../../images/logo.png";

function MenuNav() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const tshirts = useSelector((state) => state.tshirts.tshirts);
  const myLogoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    myLogoRef.current.focus();
  }, []);

  const clearCart = () => {
    tshirts.forEach((tshirt) => {
      dispatch(deleteTshirt(tshirt.id));
    });
    dispatch(clearSelectedProducts());
  };

  const handleLogout = () => {
    clearCart();
    dispatch(logoutUser());
  };

  return (
    <header className="z-50 bg-white flex justify-between items-center py-4 px-4 text-myblacki shadow-md fixed w-full inset-x-0">
      <Link to={isAdmin ? "/purchase-orders" : "/dashboard"}>
        <div className="w-6">
          <img
            tabIndex={0}
            ref={myLogoRef}
            className="absolute top-0 w-[90px]"
            alt="logo de la empresa"
            src={logo}
          />
        </div>
      </Link>
      <div>
        {isAdmin ? (
          <>
            <Link
              to="/tee-designer-admin"
              className="px-4 py-4 rounded-sm text-sm hover:border-b-4 hover:border-summer"
            >
              Administrar Camisetas
            </Link>
            <Link
              to="/products"
              className="px-4 py-4 rounded-sm text-sm hover:border-b-4 hover:border-summer"
            >
              Administrar Otros Productos
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/customer-order"
              className="px-4 py-4 rounded-sm text-sm hover:border-b-4 hover:border-summer"
            >
              Carrito de Compras
            </Link>
          </>
        )}
        <Link
          to="/"
          onClick={handleLogout}
          className="px-4 py-4 rounded-sm text-sm hover:border-b-4 hover:border-summer"
        >
          Cerrar Sesión
        </Link>
      </div>
    </header>
  );
}

export default MenuNav;
