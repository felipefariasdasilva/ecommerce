import React, { useState, useEffect } from 'react'
import { PageArea } from './styled'
import { PageContainer } from '../../components/MainComponents'
import useApi from '../../helpers/OlxAPI'
import { useLocation, useHistory } from 'react-router-dom'
import AdItem from '../../components/partials/adItem'

let timer

const Page = () => {

    const api = useApi()
    const history = useHistory()

    const useQueryString = () => {
        return new URLSearchParams( useLocation().search )
    }

    const query = useQueryString()

    const [q, setQ] = useState( query.get('q') != null ? query.get('q') : '' )
    const [cat, setCat] = useState( query.get('cat') != null ? query.get('cat') : '' )
    const [state, setState] = useState( query.get('state') != null ? query.get('state') : '' )

    const [stateList, setStateList] = useState([])
    const [categories, setCategories] = useState([])
    const [adList, setAdList] = useState([])

    const [resultOpacity, setResultOpacity] = useState(1)
    const [loading, setLoading] = useState(true)

    const [adsTotal, setAdsTotal] = useState(0)
    const [pageCount, setPageCount] = useState(0)

    const [currentPage, setCurrentPage] = useState(1)

    const getAdsList = async () => {
        
        setLoading(true)

        let offset = (currentPage - 1) * 9

        const json = await api.getAds(
            {
                sort: 'desc',
                limit: 9,
                q,
                cat,
                state,
                offset: offset
            }
        )
        setAdList(json.ads)
        setAdsTotal(json.total)
        setResultOpacity(1)
        setLoading(false)
    }

    useEffect( () => {

        if( adList.length > 0 ){            
            setPageCount( Math.ceil( adsTotal / adList.length ) )
        }else{
            setPageCount(0)
        }

    },[adsTotal])

    useEffect( () => {
        setResultOpacity(0.3)
        getAdsList()
    }, [currentPage])

    useEffect( () => {

        let queryString = []
        
        if(q){ queryString .push(`q=${q}`) }
        if(cat){ queryString .push(`cat=${cat}`) }
        if(state){ queryString .push(`state=${state}`) }

        history.replace( { search: `?${queryString.join('&')}` } )
        
        if(timer){ clearTimeout(timer) }
        timer = setTimeout(getAdsList, 2000)
        setResultOpacity(0.3)
        setCurrentPage(1)

    },[q, cat, state] )

    useEffect( () => {

        const getStates = async () => {
            const stateLocations = await api.getStates();
            setStateList(stateLocations)
        }
        getStates()
    }, [])

    useEffect( () => {

        const getCategories = async () => {
            const categorieList = await api.getCategories();
            setCategories(categorieList)
        }
        getCategories()
    }, [])

    let pagination = [] 
    for(let i = 1; i <= pageCount; i++){
        pagination.push(i)
    }

    return(

        <PageContainer>
            <PageArea>

                <div className="leftSide">

                    <form method="GET">

                        <input 
                            type="text"
                            name="q" 
                            placeholder="O que você procura?"
                            value={q}
                            onChange={ event => setQ(event.target.value) }
                        />

                        <div className="filterName">Estado:</div>
                        <select 
                            name="state" 
                            value={state}
                            onChange={ event => setState(event.target.value) }
                        >
                            <option></option>
                            {stateList.map( (state, key) => 
                                <option 
                                    key={key} 
                                    value={state.name}
                                >
                                    {state.name}
                                </option>
                            )}
                        </select>

                        <div className="filterName">Categoria:</div>
                        <ul>
                            {categories.map( (category, key) => 
                                <li 
                                    className={cat === category.slug ? "categoryItem active" : "categoryItem"}
                                    key={key}
                                    onClick={ () => { setCat(category.slug) }}
                                >
                                    <img src={category.img} alt="" />
                                    <span>{category.name}</span>
                                </li>
                            )}
                        </ul>

                    </form>

                </div>

                <div className="rightSide">
                    
                    <h2>Resultados</h2>
                    {
                        loading && adList.length === 0 &&
                            <div className="listWarning">Carregando...</div>
                    }
                    {
                        !loading && adList.length === 0 &&
                        <div className="listWarning">Não encontramos resultados.</div>
                    }

                    <div className="list" style={{ opacity: resultOpacity }}>
                        {adList.map( (ad, key) => 
                            <AdItem key={key} data={ad} />
                        )}
                    </div>

                    <div className="pagination">

                        {
                            pagination.map( (page, key) =>
                                <div 
                                    onClick={ () => setCurrentPage(page)} 
                                    className= {page === currentPage ? "pageItem active" : "pageItem"}>
                                    {page}
                                </div>
                            )
                        }

                    </div>

                </div>

            </PageArea>
        </PageContainer>
        
    )
}

export default Page
