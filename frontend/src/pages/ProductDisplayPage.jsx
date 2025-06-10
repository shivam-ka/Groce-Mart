import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDisplayPage = () => {

  const url = useParams();
  const productId = url?.product?.split('-')?.slice(-1)[0]

  return (

    <div>
      product ProductDisplayPage
    </div>
  )
}

export default ProductDisplayPage
