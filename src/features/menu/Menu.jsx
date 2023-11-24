import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
 //we dont wait for first render to fetch data its all at the same time
 const menu= useLoaderData();
  console.log('menu');
  console.log(menu);

  return (
     <ul className="divide-y divide-stone-200 px-2">
    {menu.map(pizza => <MenuItem pizza={pizza} key={pizza.id} />)}
    </ul>
  );
}

//fetch data from api
export async function loader(){
  const menu=await getMenu();

  return menu;
}

export default Menu;
