import { redirect } from "react-router-dom"
import SummaryApi from "../common"
import { toast } from 'react-toastify'

const buyNow = async(e,id,authToken) =>{
    e?.stopPropagation()
    e?.preventDefault()

    const response = await fetch(SummaryApi.buyNow.url,{
        method : SummaryApi.buyNow.method,
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, 
        },
        body : JSON.stringify(
       
            { productId : id }
        )
    })
    // alert(id)
    const responseData = await response.json()
    alert(responseData.product._id)
    if(responseData.success){
        // alert(responseData.message)
        localStorage.setItem('buyNowProduct', JSON.stringify(responseData.product));
        toast.success(responseData.message)
        window.location.href = '/buynow';        
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default buyNow