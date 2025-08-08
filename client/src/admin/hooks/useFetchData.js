import { useEffect, useState } from 'react';
import { axiosInstance } from '../utills/axios.instance'

export function useFetchData(endpoint){
    const[data,setData] = useState()
    const[error,setError] = useState(null)
    useEffect(()=>{
     const controller = new AbortController();
     const fetchData = async()=>{
        try {
            const response = await axiosInstance.get(endpoint,{
                signal : controller.signal
            })
            setData(response.data)
        } catch (error) {
            setError(error?.message || "failed to fetch data")
        }
     }
     fetchData()
     return ()=>{
        controller.abort()
     }

    },[endpoint])
 return { data,error }
}