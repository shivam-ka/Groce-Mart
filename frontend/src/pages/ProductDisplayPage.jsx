import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDisplayPage = () => {
    const url = useParams();
    console.log(url)
  return (
    <div>
      product ProductDisplayPage
    </div>
  )
}

export default ProductDisplayPage
