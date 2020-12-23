import React, { useState, useEffect } from 'react'
import { PageArea } from './styled'
import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents'
import useApi from '../../helpers/OlxAPI'
import { doLogin } from '../../helpers/AuthHandler'
const Page = () => {

    const api = useApi()

    const [name, setName] = useState('')
    const [stateLocation, setStateLocation] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [stateList, setStateList] = useState([])

    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState('')

    useEffect( () => {

        const getStatesLocation = async () => {
            const list = await api.getStates()
            setStateList(list)
        }

        getStatesLocation()

    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setDisabled(true)
        setError('')

        if(password !== confirmPassword){
            setError('Senhas não batem')
            setDisabled(false)
            return
        }

        const json = await api.register(name, email, password, stateLocation)

        if(json.error){
            setError(json.error)
        }else{
            doLogin(json.token)   
            window.location.href = '/'
        }

        setDisabled(false)

    }

    return(
        <PageContainer>

            <PageTitle>Cadastro</PageTitle>
            
            <PageArea>
                
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }

                <form onSubmit={handleSubmit}>

                <label className="area">
                        <div className="area--title">Nome Completo</div>
                        <div className="area--input">
                            <input 
                                type="text" 
                                disabled={disabled}
                                value={name}
                                onChange={ event => setName(event.target.value) }
                                required
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Estado</div>
                        <div className="area--input">
                            <select 
                                value={stateLocation} 
                                onChange={event => 
                                setStateLocation(event.target.value)} 
                                required
                            >
                                <option></option>
                                {
                                    stateList.map( (state, key) => 
                                        <option key={key} value={state._id}>
                                            { state.name }
                                        </option>
                                    )
                                }
                            </select>                            
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">E-mail</div>
                        <div className="area--input">
                            <input 
                                type="email" 
                                disabled={disabled}
                                value={email}
                                onChange={ event => setEmail(event.target.value) }
                                required
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Senha</div>
                        <div className="area--input">
                            <input 
                                type="password" 
                                disabled={disabled}
                                value={password}
                                onChange={ event => setPassword(event.target.value) }
                                required
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Confirmar Senha</div>
                        <div className="area--input">
                            <input 
                                type="password" 
                                disabled={disabled}
                                value={confirmPassword}
                                onChange={ event => setConfirmPassword(event.target.value) }
                                required
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title"></div>
                        <div className="area--input">
                            <button disabled={disabled}>
                                 Fazer Login
                            </button>
                        </div>
                    </label>

                </form>

            </PageArea>

        </PageContainer>
    )
}

export default Page
