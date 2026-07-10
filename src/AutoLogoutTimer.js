import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import LocalStorageService from 'src/Service/LocalStoage'
import AuthService from './Service/Auth/AuthService';
const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
//const navigation = useNavigate()

//const user_image = user_info.is_admin == 1 ? lp_logo : user_info.user_image
//const user_name = user_info.username
//const user_id = user_info.user_id
//const logout_time = user_info.logout_time

const AutoLogoutTimer = ({ timeoutInMinutes = 30 }) => {
  const navigation = useNavigate()
  const timeout = timeoutInMinutes * 60 * 1000;

  useEffect(() => {

    let timer = setTimeout(() => {
    LocalStorageService.clear()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your session has expired. Please Login!',


      }).then(function logout () {
        
        AuthService.logout().then((res) => {
       
        window.location.reload(false)

        })
    });
    }, timeout);


    const resetTimer = () => {
     clearTimeout(timer);
     timer = setTimeout(() => {
     AuthService.logout().then((res) => {
     LocalStorageService.clear()
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Your session has expired. Please Login!',
        }).then(function logout () {      
          window.location.reload(false)
        })
      });
      }, timeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timer);
    };
  }, [navigation, timeout]);

  return null;
};

export default AutoLogoutTimer;
