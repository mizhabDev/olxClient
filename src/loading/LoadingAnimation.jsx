import React from "react";

import logoGif from "../loading/logoAnimation.gif";


const LogoAnimation = () => {
  return (
    <div style={styles.wrapper}>
      <img
        src={logoGif}
        alt="Logo animation"
        style={styles.image}
        draggable={false}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#ffffff", // pure white
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "240px",   // adjust if needed
    height: "auto",
  },
};

export default LogoAnimation;
