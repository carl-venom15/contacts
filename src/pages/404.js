import { Link } from "react-router-dom";

export default function FourOhFour() {
    return <div style={{margin: 50}}>
      <h1>404 - Page Not Found</h1>
      <Link to="/">
          Go back to Contact Page
      </Link>
    </div>
}