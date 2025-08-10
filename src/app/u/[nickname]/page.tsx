import { getAllUsers } from '@/lib/api';
import React from 'react'
import Cookies from "js-cookie";


const SingleUser = async ({params} : {params: {nickname: string}}) => {
    const token = Cookies.get("token") 
    console.log("Token:", token);
    try {
      const response = await getAllUsers(token);
      const result: any = response.data;
      console.log("Login response:", result);
      if (result.error) {
        console.log(result.error);
    } else {
        console.log(result);
      }
    } catch (err: any) {
      console.log(err);
    }
  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Здесь будет информация о пользователе с никнеймом: {params.nickname}</p>
    </div>
  )
}

export default SingleUser
