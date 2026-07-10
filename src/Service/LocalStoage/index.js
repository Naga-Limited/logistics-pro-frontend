

class LocalStorageService {



    setLocalstorage(key,value)
    {
        localStorage.setItem(key,value);
    }

    getLocalstorage(key)
    {
       return localStorage.getItem(key);
    }

    clear()
    {
      localStorage.clear();
    }


}

export default new LocalStorageService()
