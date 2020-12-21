import Cookies from 'js-cookie'
import qs from 'qs'

const BASE_API = 'http://alunos.b7web.com.br:501'

const apiFetchPost = async (endpoint, body) => {

    if(!body.token){
        let token = Cookies.get('token')
        if(token){
            body.token = token
        }
    }

    const response = await fetch(BASE_API + endpoint, {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const json = await response.json()

    if(json.notAllowed){
        window.location.href = '/signin'
        return
    }

    return json
}

const apiFetchGet = async (endpoint, body = []) => {

    if(!body.token){
        let token = Cookies.get('token')
        if(token){
            body.token = token
        }   
    }

    const response = await fetch(`${BASE_API + endpoint}?${qs.stringify(body)}`)
    const json = await response.json()

    if(json.notAllowed){
        window.location.href = '/signin'
        return
    }

    return json
}

const OlxAPI = {

    login: async (email, password) => {   

        const json = await apiFetchPost(
            '/user/signin',
            { email, password }
        )

        return json
    }

}

export default () => OlxAPI