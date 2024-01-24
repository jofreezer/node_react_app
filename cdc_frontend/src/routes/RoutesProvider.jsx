
import {
          Route,
          Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
import administration_routes from "./admin/administration_routes";
import profile_routes from "./admin/profile_routes";

export default function RoutesProvider () {
          return (
                    <Routes>
                              <Route path="/" element={<RootPage />}></Route>
                              {administration_routes}
                              {profile_routes}
                    </Routes>
          )
}