import React, { useRef, useState, useEffect } from 'react'
import { PageArea } from './styled'
import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents'
import useApi from '../../helpers/OlxAPI'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { useHistory } from 'react-router-dom'

const Page = () => {

    const api = useApi()
    const fileField = useRef()
    const history = useHistory()

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [priceNegotiable, setPriceNegotiable] = useState(false)
    const [description, setDescription] = useState('')

    const [categories, setCategories] = useState([])

    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        
        const getCategories = async () => {
            const categoryList = await api.getCategories()
            setCategories(categoryList)
        }
        getCategories()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setDisabled(true)
        setError('')

       let errors = []

       if(!title.trim()){
           errors.push('sem titulo')
       }

       if(!category){
           errors.push('sem categoria')
       }

       if(errors.length === 0){

            const formData = new FormData()
            formData.append('title', title)
            formData.append('price', price)
            formData.append('priceneg', priceNegotiable)
            formData.append('desc', description)
            formData.append('cat', category)

            if(fileField.current.files.length > 0){

                for(let i = 0; i < fileField.current.files.length; i++){
                    formData.append('img', fileField.current.files[i])
                }

            }

            const json = await api.addAd(formData)

            if(!json.error){
                history.push(`/ad/${json.id}`)
                return
            }else{
                setError(json.error)
            }

       }else{
           setError(errors.join("\n"))
       }

       setDisabled(false)

    }


    const priceMask = createNumberMask(
        {
            prefix: 'R$ ',
            includeThousandsSeparator: true,
            thousandsSeparatorSymbol: '.',
            allowDecimal: true,
            decimalSymbol: ','
        }
    )

    return(
        <PageContainer>

            <PageTitle>Postar um anúncio</PageTitle>
            
            <PageArea>
                
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }

                <form onSubmit={handleSubmit}>

                    <label className="area">
                        <div className="area--title">Título</div>
                        <div className="area--input">
                            <input 
                                type="text" 
                                disabled={disabled}
                                value={title}
                                onChange={ event => setTitle(event.target.value) }
                                required
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Categoria</div>
                        <div className="area--input">
                            <select
                                disabled={disabled}
                                onChange={ event => setCategory(event.target.value) }
                                required
                            >
                                <option></option>
                                {categories && categories.map( selectedCategory =>
                                    <option
                                        key={selectedCategory._id}
                                        value={selectedCategory._id}
                                    >
                                        {selectedCategory.name}
                                    </option>
                                )}

                            </select>
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Preço</div>
                        <div className="area--input">
                            <MaskedInput 
                                mask={priceMask}
                                placeholder="R$"
                                disabled={ disabled || priceNegotiable }
                                value={price}
                                onChange={ event => setPrice(event.target.value)}
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Preço negociável</div>
                        <div className="area--input">
                            <input 
                                type="checkbox" 
                                disabled={disabled}
                                checked={priceNegotiable}
                                onChange={ event => setPriceNegotiable(!priceNegotiable) }
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Descrição</div>
                        <div className="area--input">
                            <textarea 
                                disabled={disabled}
                                value={description}
                                onChange={ event => setDescription(event.target.value) }                         
                            ></textarea>
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title">Imagens (1 ou mais)</div>
                        <div className="area--input">
                            <input 
                                type="file"
                                disabled={disabled}
                                multiple
                                ref={fileField}                        
                            />
                        </div>
                    </label>

                    <label className="area">
                        <div className="area--title"></div>
                        <div className="area--input">
                            <button disabled={disabled}>
                                 Adicionar Anúncio
                            </button>
                        </div>
                    </label>

                </form>

            </PageArea>

        </PageContainer>
    )
}

export default Page
