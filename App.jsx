import React, { useEffect, useState, useRef } from "react";
import { Alert, Platform } from "react-native";
import AppNav from "./Navigation/AppNav";
import store from "./store/Store";
import { Provider as StoreProvider } from "react-redux";

export default () => {
  return (
    <>
      <StoreProvider store={store}>
        <AppNav />
      </StoreProvider>
    </>
  );
};
