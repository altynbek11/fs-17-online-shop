import axios from "axios";
import React, { createContext, useReducer } from "react";
import { useLocation } from "react-router-dom";
``;

export const productsContext = createContext();

const API = "http://localhost:8000/products";

const INIT_STATE = {
  products: [],
  productDetails: null,
  pageTotalCount: 1,
};

const reducer = (prevState = INIT_STATE, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...prevState,
        products: action.payload.data,
        pageTotalCount: Math.ceil(action.payload.headers["x-total-count"] / 6),
      };
    case "GET_ONE_PRODUCT":
      return { ...prevState, productDetails: action.payload };
    default:
      return prevState;
  }
};

const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const location = useLocation();
  //   Хук useLocation возвращает объект location, представляющий текущий URL. Его можно рассматривать как useState, который возвращает новое местоположение при каждом изменении URL. Этот хук можно использовать, например, чтобы вызвать событие просмотра новой страницы для инструмента веб-аналитики.
  console.log(location.search);

  const getProducts = async () => {
    const { data } = await axios(`${API}${location.search}`);
    dispatch({
      type: "GET_PRODUCTS",
      payload: data,
    });
  };

  const getOneProduct = async (id) => {
    const res = await axios(`${API}/${id}`);
    console.log(res);
    dispatch({
      type: "GET_ONE_PRODUCT",
      payload: res,
    });
  };

  const cloud = {
    getProducts,
    getOneProduct,
    productsArr: state.products,
    productDetails: state.productDetails,
    pageTotalCount: state.pageTotalCount,
  };

  return (
    <productsContext.Provider value={cloud}>
      {children}
    </productsContext.Provider>
  );
};

export default ProductContextProvider;
