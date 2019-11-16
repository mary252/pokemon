import React from "react";

const withLoader = WrappedComponent => {
  return class extends WrappedComponent {
    render() {
        console.log("hi")
      const { loading } = this.state;
      if (loading) {
        return (
          <div className="pre-loader">
            <div className="placeholder-square animated-background" />
          </div>
        );
      }
      return super.render();
    }
  };
};

export { withLoader };