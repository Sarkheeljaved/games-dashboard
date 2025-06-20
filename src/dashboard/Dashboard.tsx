import { Link } from "react-router-dom";
import { AppRoute } from "../routes/Routes";
import "./Dashboard.css";

function Dashboard() {
  // Filter out the Dashboard route
  const filteredRoutes = AppRoute.filter(
    (route: any) => route.name !== "Dashboard"
  );

  return (
    <div>
      <div className="App">
        <div className="container">
          <div className="container-fluid">
            <div className="row pt-3">
              {filteredRoutes.map((game: any, index: number) => (
                <>
                  {game.name && (
                    <div
                      key={index}
                      className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-3 my-2"
                    >
                      <div className="card shadow">
                        <div className="card-body">
                          <h5 className="card-title">{game.name}</h5>
                          {game.path.startsWith("http") ? (
                            <a href={game.path} className="btn btn-primary">
                              Open Game
                            </a>
                          ) : (
                            <Link to={game.path} className="btn btn-primary">
                              Open Game
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
