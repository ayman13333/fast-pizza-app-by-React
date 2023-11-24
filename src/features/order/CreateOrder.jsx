//import { useState } from "react";

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {username , status: addressStatus , position , address ,error:errorAddress }=useSelector(state=>state.user);
  const navigation=useNavigation();
  const dispatch=useDispatch();

  const isLoadingAddress= addressStatus==='loading';

  const isSubmitting=navigation.state==='submitting';

  const formErrors=useActionData();


  const cart = useSelector(getCart);
  const totalCartPrice=useSelector(getTotalCartPrice);
  const priorityPrice= withPriority ? totalCartPrice*0.2 :0;
  const totalPrice=totalCartPrice+priorityPrice;

  if(!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
     
     
      <Form method="POST">
        <div 
        className="
        flex flex-col 
        sm:flex-row sm:items-center
        mb-5  gap-2">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" defaultValue={username} name="customer" required />
        </div>

        <div className="
        flex flex-col 
        sm:flex-row sm:items-center
        mb-5  gap-2">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && 
            <p className="text-xs  mt-2 
            bg-red-100 text-red-700 p-2 rounded-full ">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="
        relative
        flex flex-col 
        sm:flex-row sm:items-center
        mb-5  gap-2">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input 
            disabled={isLoadingAddress}
            defaultValue={address}
            type="text" 
            name="address"
            className="input w-full"
             required />

             {addressStatus=='error' && 
             <p className="text-xs mt-2 
             bg-red-100 text-red-700 p-2 rounded-full ">{errorAddress}</p>
           }
          </div>

         
          {
            !position.latitude&&!position.longitude&&
            <span className="absolute 
            right-[3px] z-50 top-[3px]
            sm:right-[5px] sm:top-[5px]
            ">
            <Button
            disabled={isLoadingAddress} 
            type='small' onClick={ (e)=>{
              e.preventDefault();
              dispatch(fetchAddress());
            }}>get position</Button>
            </span>
          }
          
          
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 
            accent-yellow-400
            focus:ring  focus:ring-yellow-400 focus:ring-offset-2
            "
             value={withPriority}
             onChange={(e) => setWithPriority(e.target.checked)}
            
          />
          <label 
          className="font-medium"
          htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        

        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="position" value={position.longitude && position.latitude ? `${position.latitude}, ${position.longitude}` :''} />
        <div>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress} >
          {isSubmitting ? 'placing order...' : `Order now for ${ formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//we cant use dispatch in regular functions but we can implement that from store
export async function action({request})
{
    const formData= await request.formData();
    const data=Object.fromEntries(formData);

    const order={
      ...data,
      cart:JSON.parse(data.cart),
      priority:data.priority==='true'
    };

    const errors={};
    if(!isValidPhone(order.phone))
    errors.phone='Please give us valid phone number';

    //errors.phone='Please give us valid phone number';
    if(Object.keys(errors).length>0) return errors;

    const newOrder=await createOrder(order);
    
    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
