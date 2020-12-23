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
    },

    register: async (name, email, password, stateLocation) => {
        const json = await apiFetchPost(
            '/user/signup',
            { name, email, password, state: stateLocation }
        )
        
        return json
    },

    getStates: async () => {
        const json = await apiFetchGet(
            '/states'
        )
        return json.states
    },

    getCategories: async () => {
        const json = await apiFetchGet(
            '/categories'
        )
        return json.categories
    },

    getAds: async (options) => {
        const json = await apiFetchGet(
            '/ad/list',
            options
        )
        return json
    },

    getAd: async (id, other = false) => {
        const json = await apiFetchGet(
            '/ad/item',
            { id, other }
        )
        console.log(json);
        return json
    }

}

export default () => OlxAPI