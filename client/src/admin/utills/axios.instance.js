import axios from 'axios'
import { axiosDeleteAdminFunction } from './axios.delete.admin'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Consistent with main API
  withCredentials: true, 
});

let isRefreshing = false
let failedQueue = []

const processQueue = (error)=>{
 failedQueue.forEach(promise=>{
  if(error) promise.reject(error)
  else promise.resolve()
 })
 failedQueue = []
}

axiosInstance.interceptors.response.use(response=>response,async(error)=>{
  const failedReq = error.config   
  if(error?.response?.status == "401" && error?.response?.data?.error == "token expired" && !failedReq._retry){
   failedReq._retry = true
   if(isRefreshing){
    return new Promise((resolve,reject)=>{
      failedQueue.push({
        resolve : ()=>resolve(axiosInstance(failedReq)),
        reject : err=>reject(err)
      })
    })
   }
   isRefreshing = true
   try {    
     await axiosInstance.post('/auth/admin/refresh-token')     
     processQueue(null)
     return axiosInstance(failedReq)
   } catch (error) {
    if(axiosDeleteAdminFunction) axiosDeleteAdminFunction()
    processQueue(error)
    return Promise.reject(error)
   } finally{
    isRefreshing = false
   }
  }
  return Promise.reject(error)
})
