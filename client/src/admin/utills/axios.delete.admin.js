export let axiosDeleteAdminFunction = null
export let axiosCreateAdminFunction = null
export const setAxiosDeleteAdmin = (deleteAdminfn)=>{
 axiosDeleteAdminFunction = deleteAdminfn
}
export const setAxiosCreateAdmin = (createAdminfn)=>{
    axiosCreateAdminFunction = createAdminfn
}