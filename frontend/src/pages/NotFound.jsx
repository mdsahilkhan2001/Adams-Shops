import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="lux-container py-24 text-center space-y-6">
      <h1 className="font-display text-4xl">Page Not Found</h1>
      <p className="text-sand">The page you are looking for is not available.</p>
      <Link to="/" className="lux-button">Return Home</Link>
    </div>
  );
};

export default NotFound;
