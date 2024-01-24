import { Route } from "react-router-dom";
import ProfileListPage from "../../pages/profiles/ProfileListPage";
import NewProfilePage from "../../pages/profiles/NewProfilePage";
import EditProfilePage from "../../pages/profiles/EditProfilePages";

export const profile_routes_items = {
          profiles: {
                    path: "profiles",
                    name: "profiles",
                    component: ProfileListPage
          },
          new_profiles: {
                    path: "profiles/new",
                    name: "Nouveau profile",
                    component: NewProfilePage
          },
          edit_profiles: {
                    path: "profiles/edit",
                    name: "Modifier le profile",
                    component: EditProfilePage
          }
}
var profile_routes = []
for(let key in profile_routes_items) {
          const route = profile_routes_items[key]
          profile_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}
export default profile_routes