import React from "react";

const ErrorFallback = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Oops!</h1>
      <p style={styles.message}>
        Something went wrong. Please try again later.
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.5rem",
  },
};

export default ErrorFallback;
